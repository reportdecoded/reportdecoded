// app/api/cron/agent-day3-tips/route.js
//
// Daily cron — fires the day-3 tips email for any agent whose Stripe
// subscription was created 3-4 days ago and who hasn't received it yet.
//
// Triggering: configured in vercel.json under "crons" so Vercel calls
// this once per day (UTC). Vercel injects the special header
// `Authorization: Bearer ${CRON_SECRET}` if CRON_SECRET env var is set
// — we check it to refuse public invocations.
//
// Idempotency: agents.day3_tips_email_sent_at is set after a successful
// send. Subsequent cron runs see the timestamp and skip that agent.
//
// REQUIRED SCHEMA (run once in Supabase SQL editor):
//   alter table agents add column day3_tips_email_sent_at timestamptz null;
//
// If the column doesn't exist, the route fails open: the update query
// errors but the cron returns 200 anyway with the affected agent in
// "skipped" so the cron schedule keeps ticking without alerting.

import { getServiceSupabase } from '@/lib/supabase';
import { getStripe } from '@/lib/stripe';

// Hard limit Vercel cron runs at 60s; we don't expect hundreds of new
// subscribers a day in v1, so processing serially within the window is
// fine. Bump this and parallelise once volume warrants.
export const maxDuration = 60;

const WINDOW_LOW_MS = 4 * 24 * 60 * 60 * 1000;   // 4 days ago
const WINDOW_HIGH_MS = 3 * 24 * 60 * 60 * 1000;  // 3 days ago
const ACTIVE_STATUSES = new Set(['active', 'trialing']);

export async function GET(request) {
  // -- Authorisation: Vercel cron sends Bearer ${CRON_SECRET} if set.
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const got = request.headers.get('authorization');
    if (got !== `Bearer ${expected}`) {
      return Response.json({ error: 'unauthorised' }, { status: 401 });
    }
  }

  const supabase = getServiceSupabase();
  const stripe = getStripe();

  const now = Date.now();
  const createdGte = Math.floor((now - WINDOW_LOW_MS) / 1000);
  const createdLte = Math.floor((now - WINDOW_HIGH_MS) / 1000);

  // -- Query Stripe for subscriptions created in the 3-4 day window.
  //    Filtering by status='active' would miss trialing — leave it open
  //    and check ACTIVE_STATUSES below.
  let stripeSubs;
  try {
    const list = await stripe.subscriptions.list({
      created: { gte: createdGte, lte: createdLte },
      limit: 100,
    });
    stripeSubs = list.data || [];
  } catch (err) {
    console.error('[cron/day3] stripe list failed:', err?.message || err);
    return Response.json({ ok: false, error: 'stripe_list_failed' }, { status: 500 });
  }

  const results = { processed: 0, sent: 0, skipped: 0, errored: 0, details: [] };

  for (const sub of stripeSubs) {
    if (!ACTIVE_STATUSES.has(sub.status)) {
      results.skipped++;
      results.details.push({ sub: sub.id, why: 'not_active', status: sub.status });
      continue;
    }
    results.processed++;

    // Look up agent + check idempotency timestamp.
    const { data: agent, error: lookupErr } = await supabase
      .from('agents')
      .select('id, email, full_name, business_name, logo_url, accent_color, day3_tips_email_sent_at')
      .eq('stripe_subscription_id', sub.id)
      .maybeSingle();

    if (lookupErr || !agent) {
      results.skipped++;
      results.details.push({ sub: sub.id, why: 'no_agent_row' });
      continue;
    }
    if (agent.day3_tips_email_sent_at) {
      results.skipped++;
      results.details.push({ sub: sub.id, why: 'already_sent', sent_at: agent.day3_tips_email_sent_at });
      continue;
    }

    // Count completed reports for personalised tone (0 vs 1+ runs).
    const { count: reportCount } = await supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('agent_id', agent.id)
      .eq('status', 'complete');

    try {
      const { sendAgentDay3TipsEmail } = await import('@/lib/email');
      await sendAgentDay3TipsEmail({
        to: agent.email,
        fullName: agent.full_name,
        businessName: agent.business_name,
        hasBranding: !!(agent.logo_url || agent.accent_color),
        reportsRunSoFar: reportCount || 0,
      });
      // Mark sent. If this update fails (e.g. column missing), the
      // email already went — we log + count as sent but flag for review.
      const { error: updateErr } = await supabase
        .from('agents')
        .update({ day3_tips_email_sent_at: new Date().toISOString() })
        .eq('id', agent.id);
      if (updateErr) {
        console.error(`[cron/day3] sent OK but update failed for ${agent.id}:`, updateErr.message);
        results.details.push({ agent: agent.id, why: 'sent_but_flag_failed', error: updateErr.message });
      } else {
        results.details.push({ agent: agent.id, why: 'sent', reportCount: reportCount || 0 });
      }
      results.sent++;
    } catch (err) {
      console.error(`[cron/day3] send failed for ${agent.id}:`, err?.message || err);
      results.errored++;
      results.details.push({ agent: agent.id, why: 'send_failed', error: err?.message });
    }
  }

  console.log(`[cron/day3] processed=${results.processed} sent=${results.sent} skipped=${results.skipped} errored=${results.errored}`);
  return Response.json({ ok: true, ...results });
}
