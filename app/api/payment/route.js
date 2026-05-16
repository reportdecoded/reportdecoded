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
    const supabase = getServiceSupabase();
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
    //    webhook can flip the correct row to paid.
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: buyerEmail,
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
      metadata: { reportId, pack },
    });

    return Response.json({ url: session.url, reportId });
  } catch (error) {
    console.error('Payment error:', error);
    return Response.json(
      { error: error?.message || 'Payment setup failed' },
      { status: 500 }
    );
  }
}
