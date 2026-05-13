// lib/usage.js
// Phase 4b: count an agent's reports for the rolling 30-day window and,
// when a Starter agent exceeds their 12-report allowance, fire a Stripe
// meter event so the $15-per-extra-report overage Price is billed.
//
// Why rolling 30 days (not calendar month / not Stripe billing cycle)?
// Stripe's meter is the actual source of truth for billing — even if our
// count drifts by a day, Stripe correctly aggregates events by their
// timestamp into the agent's true billing window. Keeping the count
// calculation simple keeps the moving parts small.

import { getServiceSupabase } from './supabase';
import { getStripe } from './stripe';

// Starter tier monthly inclusion. Reports 1–12 are free; #13+ triggers a
// meter event worth $15 each (price STRIPE_PRICE_STARTER_OVERAGE).
export const STARTER_INCLUDED_REPORTS = 12;

/**
 * Count this agent's reports in the rolling 30-day window.
 * Excludes refunded / failed rows by default — we only count work delivered.
 */
export async function countAgentReportsLast30Days(agentId) {
  if (!agentId) return 0;
  const supabase = getServiceSupabase();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from('reports')
    .select('id', { count: 'exact', head: true })
    .eq('agent_id', agentId)
    .gte('created_at', thirtyDaysAgo)
    .neq('status', 'failed');

  if (error) {
    console.error('[usage] count query failed:', error.message);
    return 0;
  }
  return count || 0;
}

/**
 * Fire a metered usage event to Stripe so the agent gets billed $15 for
 * one over-allowance report. Idempotent on the Stripe side by `identifier`:
 * passing the same identifier twice within the dedup window collapses to a
 * single billable event, which protects us against accidental double-fires
 * during webhook retries / serverless re-invocation.
 *
 * Pass `reportId` as the identifier so the event maps 1:1 to a report row.
 */
export async function reportStarterOverageUsage({ stripeCustomerId, reportId }) {
  if (!stripeCustomerId) {
    console.warn('[usage] cannot report overage — agent has no stripe_customer_id');
    return { ok: false, reason: 'no_customer' };
  }
  const eventName = process.env.STRIPE_METER_EVENT_STARTER_OVERAGE;
  if (!eventName) {
    console.warn('[usage] STRIPE_METER_EVENT_STARTER_OVERAGE not set — skipping meter event');
    return { ok: false, reason: 'no_event_name' };
  }

  try {
    await getStripe().billing.meterEvents.create({
      event_name: eventName,
      identifier: `report_${reportId}`,
      payload: {
        stripe_customer_id: stripeCustomerId,
        value: '1',
      },
    });
    console.log(`[usage] meter event fired for customer ${stripeCustomerId} report ${reportId}`);
    return { ok: true };
  } catch (err) {
    console.error('[usage] meter event create failed:', err?.message || err);
    return { ok: false, reason: 'stripe_error', error: err?.message };
  }
}

/**
 * Convenience: given an agent row + the just-created report id, decide
 * whether to charge them for overage and do it if so. Called by the
 * agent-upload flow AFTER the report row is persisted (so we don't
 * accidentally double-count the current upload).
 *
 * Caller passes the already-fetched count to avoid a second DB hit if it
 * already has it.
 */
export async function maybeReportOverage({ agent, reportId, currentCount }) {
  if (!agent || agent.subscription_tier !== 'starter') {
    return { ok: true, charged: false, reason: 'not_starter' };
  }
  // The just-uploaded report is included in currentCount (we count AFTER
  // insert). If the post-insert count exceeds the included allowance, this
  // report is the overage one.
  if (currentCount <= STARTER_INCLUDED_REPORTS) {
    return { ok: true, charged: false, reason: 'within_allowance', currentCount };
  }
  const res = await reportStarterOverageUsage({
    stripeCustomerId: agent.stripe_customer_id,
    reportId,
  });
  return { ...res, charged: res.ok, currentCount };
}
