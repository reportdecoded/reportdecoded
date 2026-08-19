// app/api/cron/buyer-review/route.js
//
// Daily cron — fires a review request to any buyer whose report completed
// 3–4 days ago and who hasn't received it. Sits before the day-7 upsell so
// the two don't collide.
//
// Each buyer gets a UNIQUE, single-use ($10-off) Stripe promotion code for
// their next report — generated here at send time (max_redemptions: 1), so
// codes can't be shared or reused. The discount is a returning-customer
// thank-you (applies regardless); the review ask carries no incentive.
//
// Triggering: configured in vercel.json. Vercel injects
// Authorization: Bearer ${CRON_SECRET} — we check it to block public calls.
//
// Idempotency: reports.review_request_sent_at is set after a successful send.
//
// REQUIRED SCHEMA (run once in Supabase SQL editor):
//   alter table reports add column review_request_sent_at timestamptz null;
//
// REQUIRED STRIPE (one-time): create a coupon = $10 off (amount_off 1000,
// currency aud, duration once), then set STRIPE_RETURNING_COUPON_ID to its
// id (default 'returning_10off'). If the coupon/env is missing we still send
// the review email — just without the discount block.

import { getServiceSupabase } from '@/lib/supabase';
import { getStripe } from '@/lib/stripe';
import { sendBuyerReviewRequestEmail } from '@/lib/email';

export const maxDuration = 60;

// 3–4 day window after created_at (report completes within ~2 min of creation,
// so created_at is a safe, always-present proxy for "a few days later").
const WINDOW_HIGH_H = 3 * 24;  // 72h
const WINDOW_LOW_H  = 4 * 24;  // 96h

const DISCOUNT_LABEL = '$10';

async function makeReturningCode(reportId) {
  const couponId = process.env.STRIPE_RETURNING_COUPON_ID || 'returning_10off';
  // Readable, unique-enough code; collisions across the account throw and we
  // fall back to a review-only email for that buyer.
  const code = 'BACK' + Math.random().toString(36).slice(2, 8).toUpperCase();
  try {
    // The account's default Stripe API version has dropped the top-level
    // `coupon` param on promotion_codes create; pin a version that still
    // accepts it (verified 2024-06-20 works, account default rejects it).
    await getStripe().promotionCodes.create(
      {
        coupon: couponId,
        code,
        max_redemptions: 1,
        metadata: { source: 'day3_review_email', reportId },
      },
      { apiVersion: '2024-06-20' }
    );
    return code;
  } catch (err) {
    console.error(`[cron/buyer-review] promo code create failed for ${reportId}:`, err?.message || err);
    return null;
  }
}

export async function GET(request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const got = request.headers.get('authorization');
    if (got !== `Bearer ${expected}`) {
      return Response.json({ error: 'unauthorised' }, { status: 401 });
    }
  }

  const supabase = getServiceSupabase();
  const now = new Date();

  const windowHigh = new Date(now.getTime() - WINDOW_HIGH_H * 60 * 60 * 1000).toISOString();
  const windowLow  = new Date(now.getTime() - WINDOW_LOW_H  * 60 * 60 * 1000).toISOString();

  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, buyer_email, property_address, created_at, review_request_sent_at')
    .eq('status', 'complete')
    .gte('created_at', windowLow)
    .lte('created_at', windowHigh)
    .is('review_request_sent_at', null);

  if (error) {
    console.error('[cron/buyer-review] query failed:', error.message);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  // Dedupe by buyer_email — a buyer with several reports in the window gets
  // ONE review email (using their most recent report for the content). On a
  // successful send we mark ALL of that buyer's unsent completed reports, so
  // none re-trigger on a later run either.
  const byEmail = new Map();
  for (const r of (reports || [])) {
    if (!r.buyer_email) continue;
    const prev = byEmail.get(r.buyer_email);
    if (!prev || r.created_at > prev.created_at) byEmail.set(r.buyer_email, r);
  }

  const results = { found: reports?.length ?? 0, recipients: byEmail.size, sent: 0, errored: 0 };

  for (const [email, report] of byEmail) {
    try {
      const discountCode = await makeReturningCode(report.id);

      await sendBuyerReviewRequestEmail({
        to: email,
        propertyAddress: report.property_address,
        reportId: report.id,
        discountCode,
        discountLabel: discountCode ? DISCOUNT_LABEL : null,
      });

      const { error: updateErr } = await supabase
        .from('reports')
        .update({ review_request_sent_at: now.toISOString() })
        .eq('buyer_email', email)
        .eq('status', 'complete')
        .is('review_request_sent_at', null);

      if (updateErr) {
        console.error(`[cron/buyer-review] sent but mark failed for ${email}:`, updateErr.message);
      }
      results.sent++;
    } catch (err) {
      console.error(`[cron/buyer-review] send failed for ${email}:`, err?.message || err);
      results.errored++;
    }
  }

  console.log(`[cron/buyer-review] found=${results.found} recipients=${results.recipients} sent=${results.sent} errored=${results.errored}`);
  return Response.json({ ok: true, ...results });
}
