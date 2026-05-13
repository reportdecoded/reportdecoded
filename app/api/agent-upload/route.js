// app/api/agent-upload/route.js
// Phase 4b: an authenticated, subscribed agent uploads a PDF from their
// dashboard. Their subscription covers the analysis, so we skip Stripe
// Checkout entirely. The flow is:
//
//   1. Confirm user is signed in and has an active subscription
//   2. Insert reports row with agent_id set and payment_status = 'paid'
//      (the subscription IS the payment — no per-report charge)
//   3. Count the agent's reports in the rolling 30-day window
//   4. If they're on Starter and this report exceeds the 12-report
//      allowance, fire a Stripe meter event for $15 overage billing
//   5. Schedule the Claude analysis via after() so we return quickly
//
// The buyer_email field is optional — if the agent provides their client's
// email, we'll send the same "report ready" email to them when complete.

import { after } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { getServiceSupabase } from '@/lib/supabase';
import { runAnalysisForReport } from '@/lib/runAnalysis';
import { countAgentReportsLast30Days, maybeReportOverage } from '@/lib/usage';

export const maxDuration = 300;

const ACTIVE_STATUSES = new Set(['active', 'trialing']);

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: 'Not signed in' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    reportUrl,
    propertyAddress,
    purchasePrice,
    clientEmail,
    reportType = 'pre_purchase',
    purchaseIntent = 'home',
  } = body;

  // -- Input validation
  if (!reportUrl || typeof reportUrl !== 'string') {
    return Response.json({ error: 'reportUrl is required' }, { status: 400 });
  }
  if (!['pre_purchase', 'new_build_handover'].includes(reportType)) {
    return Response.json({ error: 'Invalid reportType' }, { status: 400 });
  }
  if (!['home', 'investment'].includes(purchaseIntent)) {
    return Response.json({ error: 'Invalid purchaseIntent' }, { status: 400 });
  }
  if (clientEmail && !/.+@.+\..+/.test(clientEmail)) {
    return Response.json({ error: 'Invalid clientEmail' }, { status: 400 });
  }

  // -- Subscription gate
  const admin = getServiceSupabase();
  const { data: agent, error: agentErr } = await admin
    .from('agents')
    .select('id, subscription_status, subscription_tier, stripe_customer_id, full_name, business_name')
    .ilike('email', user.email)
    .maybeSingle();

  if (agentErr) {
    console.error('[agent-upload] agent lookup failed:', agentErr.message);
    return Response.json({ error: 'Account lookup failed' }, { status: 500 });
  }
  if (!agent) {
    return Response.json({ error: 'No agent profile found' }, { status: 403 });
  }
  if (!ACTIVE_STATUSES.has(agent.subscription_status)) {
    return Response.json(
      { error: 'Active subscription required', subscribe_url: '/dashboard' },
      { status: 402 }
    );
  }

  // -- Create the report row. payment_status='paid' because subscription covers it.
  const { data: report, error: insertErr } = await admin
    .from('reports')
    .insert({
      report_url: reportUrl,
      buyer_email: clientEmail || null,
      property_address: propertyAddress || null,
      purchase_price: purchasePrice ? Number(purchasePrice) : null,
      report_type: reportType,
      purchase_intent: purchaseIntent,
      status: 'processing',
      payment_status: 'paid',
      agent_id: agent.id,
    })
    .select('id')
    .single();

  if (insertErr || !report) {
    console.error('[agent-upload] insert failed:', insertErr);
    return Response.json({ error: 'Could not create report record' }, { status: 500 });
  }

  // -- Overage check (Starter only). Count INCLUDES this just-created row, so
  //    once an agent's count goes from 12 -> 13 they're on overage.
  let overageResult = null;
  try {
    const currentCount = await countAgentReportsLast30Days(agent.id);
    overageResult = await maybeReportOverage({
      agent,
      reportId: report.id,
      currentCount,
    });
    if (overageResult.charged) {
      console.log(`[agent-upload] starter overage billed: agent ${agent.id} report ${report.id} (count ${currentCount})`);
    }
  } catch (err) {
    // Don't block the analysis on a meter event failure — Stripe meter events
    // can be backfilled, but the agent still expects their report.
    console.error('[agent-upload] overage check failed (non-fatal):', err?.message || err);
  }

  // -- Kick off analysis after responding.
  after(async () => {
    try {
      await runAnalysisForReport(report.id);
    } catch (err) {
      console.error(`[agent-upload] background analysis failed for ${report.id}:`, err);
    }
  });

  return Response.json({
    ok: true,
    reportId: report.id,
    overage: overageResult?.charged === true,
    countInWindow: overageResult?.currentCount,
  });
}
