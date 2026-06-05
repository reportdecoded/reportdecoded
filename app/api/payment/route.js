// app/api/payment/route.js
// Creates a Supabase report row, then a Stripe Checkout session linked to it
// via metadata.reportId. Webhook flips the row to paid + triggers analysis.

import { getStripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';

const PRICES = {
  single: { amount: 5900, label: 'Single Report — Report Decoded' },
  three:  { amount: 14900, label: '3-Report Pack — Report Decoded' },
  ten:    { amount: 39000, label: '10-Report Pack — Report Decoded' },
};

export async function POST(request) {
  try {
    const {
      reportUrl,
      buyerEmail,
      purchasePrice,
      propertyAddress,
      pack = 'single',
      reportType = 'pre_purchase',
      purchaseIntent = 'home',
      // DIY affiliate handle (e.g. 'jase'). Frontend pulls this from
      // window.affiliateRef (set by AffiliateTracker from the ?via=
      // URL param + 30-day cookie). When present:
      //  • we apply the creator $10-off coupon at Stripe Checkout, so
      //    the buyer pays $49 not $59
      //  • we store the handle in Stripe metadata + client_reference_id
      //    so payouts can be calculated from a Stripe charges export
      // Null/undefined when no affiliate cookie present — totally fine.
      affiliateRef,
    } = await request.json();

    const price = PRICES[pack];
    if (!price) {
      return Response.json({ error: 'Invalid pack type' }, { status: 400 });
    }
    if (!['pre_purchase', 'new_build_handover'].includes(reportType)) {
      return Response.json({ error: 'Invalid reportType' }, { status: 400 });
    }
    if (!['home', 'investment'].includes(purchaseIntent)) {
      return Response.json({ error: 'Invalid purchaseIntent' }, { status: 400 });
    }
    if (!reportUrl) {
      return Response.json({ error: 'reportUrl is required' }, { status: 400 });
    }
    if (!buyerEmail || !/.+@.+\..+/.test(buyerEmail)) {
      return Response.json({ error: 'Valid buyerEmail is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();

    // -- Duplicate-charge prevention. The buyer can land back on the
    //    upload form via browser-back from Stripe Checkout (or by
    //    opening the site in a second tab) and re-click "Continue to
    //    Payment". Without this guard each click creates a NEW Stripe
    //    session and the buyer can pay $59 twice for the same PDF.
    //
    //    Strategy: within the last 15 minutes, look up the most recent
    //    report row for this (buyer_email, report_url) pair.
    //      • Already paid → return 409 with a friendly "you've already
    //        purchased this report" message
    //      • Has a still-open Stripe session → reuse its URL instead
    //        of minting a new one (Stripe sessions are valid 24h)
    //      • Otherwise fall through and create a new session
    //
    //    15 min window covers the realistic re-click scenarios without
    //    blocking a genuine retry an hour or a day later.
    const FIFTEEN_MIN_AGO = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: existingReports } = await supabase
      .from('reports')
      .select('id, payment_status, stripe_session_id')
      .eq('buyer_email', buyerEmail)
      .eq('report_url', reportUrl)
      .gte('created_at', FIFTEEN_MIN_AGO)
      .order('created_at', { ascending: false })
      .limit(1);

    if (existingReports && existingReports.length > 0) {
      const existing = existingReports[0];

      if (existing.payment_status === 'paid') {
        return Response.json(
          {
            error:
              "You've already purchased this report. Check your email for the link — if it hasn't arrived in 10 minutes, reply to your Stripe receipt and we'll resend it.",
          },
          { status: 409 }
        );
      }

      // Existing unpaid attempt has a Stripe session — try to reuse it
      // so the buyer doesn't get a second one charged on top of the first.
      if (existing.stripe_session_id) {
        try {
          const existingSession = await getStripe().checkout.sessions.retrieve(
            existing.stripe_session_id
          );
          if (existingSession.status === 'open' && existingSession.url) {
            return Response.json({
              url: existingSession.url,
              reportId: existing.id,
              reused: true,
            });
          }
        } catch (err) {
          // Session might have been deleted in Stripe — fall through
          // and create a new one. Log so we can spot abnormal patterns.
          console.warn(
            '[payment] could not retrieve existing session, creating new:',
            err?.message || err
          );
        }
      }
      // No reusable session — fall through to create new.
    }

    // -- Synchronous pre-screen: refuse wrong-document uploads (CMAs,
    //    Section 32s, contracts of sale) BEFORE creating a Stripe session.
    //    Buyer flow has higher stakes than agent flow — they're about to
    //    be charged $59. Catching a wrong PDF here saves a refund round-
    //    trip later. Adds ~1-3s to the response.
    try {
      const { prescreenPdfUrl } = await import('@/lib/claude');
      const pre = await prescreenPdfUrl(reportUrl);
      if (!pre.ok) {
        return Response.json({ error: pre.error }, { status: pre.status || 422 });
      }
    } catch (err) {
      // Don't block on a prescreen crash — fall through and rely on
      // runAnalysis to catch + refund as a safety net.
      console.warn('[payment] prescreen errored (non-fatal):', err?.message || err);
    }

    // 1. Create the report row up front so the webhook has something to update.
    const { data: report, error: insertErr } = await supabase
      .from('reports')
      .insert({
        report_url: reportUrl,
        buyer_email: buyerEmail,
        purchase_price: purchasePrice ? Number(purchasePrice) : null,
        property_address: (propertyAddress && typeof propertyAddress === 'string' && propertyAddress.trim().length >= 4)
          ? propertyAddress.trim().slice(0, 250)
          : null,
        pack,
        report_type: reportType,
        purchase_intent: purchaseIntent,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select('id')
      .single();

    if (insertErr || !report) {
      console.error('[payment] supabase insert failed:', insertErr);
      return Response.json(
        { error: 'Could not create report record. Please try again.' },
        { status: 500 }
      );
    }

    const reportId = report.id;
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 2. Create the Stripe Checkout session, tagging it with reportId so the
    //    webhook can flip the correct row to paid. If an affiliate handle is
    //    present, attach the creator $10-off coupon AND tag the session for
    //    payout attribution.
    //
    //    The coupon must be pre-created in Stripe (one-time setup via
    //    dashboard.stripe.com → Coupons): id = 'creator_buyer_10off',
    //    amount_off = 1000, currency = aud, duration = once, applies to
    //    one-time payments. Personalised codes per affiliate (JASE10,
    //    MADDIE10) all redeem this same underlying coupon — the affiliate
    //    handle in metadata is what drives commission attribution, not the
    //    code itself.
    const COUPON_ID = process.env.STRIPE_CREATOR_COUPON_ID || 'creator_buyer_10off';
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: buyerEmail,
      ...(affiliateRef ? { client_reference_id: affiliateRef } : {}),
      ...(affiliateRef ? { discounts: [{ coupon: COUPON_ID }] } : {}),
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: { name: price.label },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${base}/results?reportId=${reportId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: base,
      metadata: { reportId, pack, ...(affiliateRef ? { affiliate_ref: affiliateRef } : {}) },
    });

    // Persist the session ID on the report row immediately so the
    // dedupe check at the top of POST can find + reuse this session
    // if the buyer re-submits via browser-back. Webhook will also
    // write this field on payment_intent.succeeded (idempotent — same
    // value, no race).
    await supabase
      .from('reports')
      .update({ stripe_session_id: session.id })
      .eq('id', reportId);

    return Response.json({ url: session.url, reportId });
  } catch (error) {
    console.error('Payment error:', error);
    return Response.json(
      { error: error?.message || 'Payment setup failed' },
      { status: 500 }
    );
  }
}
