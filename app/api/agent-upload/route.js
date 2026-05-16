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
import { countAgentReportsLast30Days } from '@/lib/usage';
// runAnalysisForReport lazy-imported inside after() so the agent-upload
// route's cold-start bundle stays slim — runAnalysis transitively pulls
// in @react-pdf/renderer, the Anthropic SDK, places.js, etc. which we
// don't need available until the background job actually runs.

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
  if (!propertyAddress || typeof propertyAddress !== 'string' || propertyAddress.trim().length < 6) {
    return Response.json(
      { error: 'Property address is required (it powers local tradie matching).' },
      { status: 400 }
    );
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

  // -- Synchronous pre-screen: catch wrong-document uploads (CMAs, Section 32s,
  //    contracts of sale, council rates, etc) BEFORE we write a junk row to the
  //    DB and burn the agent's monthly allowance. Adds ~1-3s to the response
  //    but saves ~30-60s of round-trip + a "failed" row in the dashboard.
  //    Lazy-import so the route's cold-start bundle isn't bloated by pdfjs-dist.
  try {
    const { prescreenPdfUrl } = await import('@/lib/claude');
    const pre = await prescreenPdfUrl(reportUrl);
    if (!pre.ok) {
      return Response.json({ error: pre.error }, { status: pre.status || 422 });
    }
  } catch (err) {
    // Don't block on a prescreen crash — fall through to the existing
    // flow, where runAnalysis will still catch a bad PDF and mark failed.
    console.warn('[agent-upload] prescreen errored (non-fatal):', err?.message || err);
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

  // -- Overage pre-check (Starter only).
  //
  //    Counting here gives the dashboard an immediate "this one's overage"
  //    badge for UI feedback. The ACTUAL meter event is NOT fired here —
  //    that's deferred to runAnalysis after the row flips to 'complete', so
  //    a failed analysis never bills the agent $15 for a report they didn't
  //    receive. countAgentReportsLast30Days already excludes status='failed'
  //    rows so failed attempts never burn an allowance slot.
  let overagePredicted = false;
  let currentCount = 0;
  try {
    currentCount = await countAgentReportsLast30Days(agent.id);
    overagePredicted =
      agent.subscription_tier === 'starter' && currentCount > 12;
  } catch (err) {
    console.error('[agent-upload] count check failed (non-fatal):', err?.message || err);
  }

  // -- Kick off analysis after responding.
  after(async () => {
    try {
      const { runAnalysisForReport } = await import('@/lib/runAnalysis');
      await runAnalysisForReport(report.id);
    } catch (err) {
      // runAnalysisForReport now has its own try/catch that marks the row
      // 'failed' on uncaught errors, but belt-and-braces: if the dynamic
      // import itself fails (or anything else here), make sure the row
      // doesn't sit in 'processing' forever.
      const msg = err?.message || String(err) || 'unknown error';
      console.error(`[agent-upload] background analysis failed for ${report.id}:`, err);
      try {
        await admin
          .from('reports')
          .update({
            status: 'failed',
            failure_reason: `Background job crashed before analysis: ${msg.slice(0, 400)}`,
          })
          .eq('id', report.id)
          .eq('status', 'processing');
      } catch (e2) {
        console.error(`[agent-upload] also failed to mark row failed for ${report.id}:`, e2);
      }
    }
  });

  return Response.json({
    ok: true,
    reportId: report.id,
    // overage:true means THIS upload WILL incur a $15 overage when it
    // completes — for the UI to show a heads-up banner. The actual Stripe
    // meter event is fired inside runAnalysis after status='complete', so
    // a failing analysis won't be billed.
    overage: overagePredicted,
    countInWindow: currentCount,
  });
}
