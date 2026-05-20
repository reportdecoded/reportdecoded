// lib/runAnalysis.js
// Orchestrator: load a report from Supabase, analyse it with Claude, save the
// result back, send the buyer an email. Designed to be called from the Stripe
// webhook via Next's after() — i.e. AFTER payment is confirmed, OUT of the
// response path so Stripe gets its 2xx quickly.

import { getServiceSupabase } from './supabase';
import { analyseInspectionPdf } from './claude';
import { sendReportReadyEmail, sendRefundNotificationEmail } from './email';
import { findTradiesForAnalysis } from './places';
import { countAgentReportsLast30Days, reportStarterOverageUsage } from './usage';
import { getStripe } from './stripe';

// @react-pdf/renderer + pdf/reportPdf are heavy (~30MB of fontkit/pdfkit
// dependencies). Static import bloats every serverless function that
// transitively requires this file — including /api/agent-upload which
// previously crashed at cold start (500 with empty body) because the
// bundle hit Vercel's memory ceiling. Deferred to dynamic import inside
// the function that uses it; runs inside after() so HTTP response is
// already sent by then.

export async function runAnalysisForReport(reportId) {
  const supabase = getServiceSupabase();

  // Wrap the entire body so ANY uncaught exception flips the row to
  // 'failed' with a useful reason. Previously, an uncaught error here
  // (e.g. Anthropic SDK network blip, Vercel after() killing the instance
  // mid-Claude-call) left the row stuck in 'processing' forever — the
  // user paid, got no feedback, and we had no DB-side trace to debug.
  try {
    await _runAnalysisInternal(reportId, supabase);
  } catch (err) {
    const msg = err?.message || String(err) || 'unknown background-job error';
    console.error(`[runAnalysis] uncaught exception for ${reportId}:`, err);
    try {
      await supabase
        .from('reports')
        .update({
          status: 'failed',
          failure_reason: `Background analysis crashed: ${msg.slice(0, 400)}`,
        })
        .eq('id', reportId)
        .eq('status', 'processing'); // don't overwrite a successful row
    } catch (e2) {
      console.error(`[runAnalysis] also failed to mark row failed for ${reportId}:`, e2);
    }
  }
}

async function _runAnalysisInternal(reportId, supabase) {
  // 1. Load the report row
  const { data: report, error: loadErr } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (loadErr || !report) {
    console.error('[runAnalysis] could not load report', reportId, loadErr);
    return;
  }

  // Idempotency: skip if already complete. The webhook's conditional
  // update (only flipping payment_status from 'unpaid'->'paid' wins the race)
  // already guarantees only one webhook delivery schedules us, so the
  // processing-state check that used to live here was over-eager.
  if (report.status === 'complete') {
    console.log(`[runAnalysis] skipping ${reportId} — already complete`);
    return;
  }

  // 2. Mark processing (webhook may have set it already; this is a no-op if so)
  if (report.status !== 'processing') {
    await supabase
      .from('reports')
      .update({ status: 'processing' })
      .eq('id', reportId);
  }

  // 3. Run Claude
  const result = await analyseInspectionPdf({
    reportUrl: report.report_url,
    purchasePrice: report.purchase_price,
    reportType: report.report_type || 'pre_purchase',
    purchaseIntent: report.purchase_intent || 'home',
  });

  if (!result.ok) {
    console.error(`[runAnalysis] analysis failed for ${reportId}:`, result.error);
    await supabase
      .from('reports')
      .update({
        status: 'failed',
        failure_reason: result.error,
        // If refund-eligible, mark payment_status; the admin/refund flow handles
        // the actual Stripe refund call separately.
        ...(result.refund ? { payment_status: 'refunded' } : {}),
      })
      .eq('id', reportId);

    if (result.refund && report.buyer_email) {
      try {
        await sendRefundNotificationEmail({
          to: report.buyer_email,
          reason: result.error,
        });
      } catch (e) {
        console.error('[runAnalysis] refund email send failed:', e?.message || e);
      }
    }
    return;
  }

  // 4. Enrich with local tradies (best-effort; never blocks completion).
  //    findTradiesForAnalysis returns {} if HERE_API_KEY is unset or the
  //    Discover API fails — analysis still completes cleanly.
  //
  //    Fallback: if Claude couldn't extract a property address from the PDF
  //    but the buyer/agent provided one when uploading (e.g. via the
  //    homepage form's address field or /dashboard/upload), use theirs so
  //    the HERE geocode still works. Without this fallback the tradies
  //    silently return empty when Claude misses the address.
  const analysis = result.analysis;
  if (!analysis.property_address && report.property_address) {
    analysis.property_address = report.property_address;
    console.log(`[runAnalysis] ${reportId} using user-supplied address as fallback: ${report.property_address}`);
  }

  let tradiesByCategory = {};
  try {
    tradiesByCategory = await findTradiesForAnalysis(analysis);
    const found = Object.values(tradiesByCategory).reduce((n, list) => n + list.length, 0);
    console.log(`[runAnalysis] ${reportId} matched ${found} tradies across ${Object.keys(tradiesByCategory).length} categories`);
  } catch (e) {
    console.error('[runAnalysis] tradie lookup failed (non-fatal):', e?.message || e);
  }

  // 5. Persist analysis + tradies
  await supabase
    .from('reports')
    .update({
      status: 'complete',
      result_json: analysis,
      tradies_json: Object.keys(tradiesByCategory).length > 0 ? tradiesByCategory : null,
      property_address: analysis?.property_address || report.property_address,
    })
    .eq('id', reportId);

  // 5b. Fetch the agent row once — reused by the overage check (5c),
  //     the trial-end check (5d), and branded-PDF generation (6).
  //     Only relevant when this report came from an agent dashboard
  //     upload (report.agent_id is set).
  let agentFull = null;
  if (report.agent_id) {
    const { data } = await supabase
      .from('agents')
      .select('id, business_name, logo_url, accent_color, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id')
      .eq('id', report.agent_id)
      .maybeSingle();
    agentFull = data || null;
  }

  // 5c. Overage meter event (Starter only). Fired AFTER status='complete'
  //     so a failed analysis is never billed. Count excludes 'failed' rows
  //     by default, so failed attempts don't burn a slot either.
  if (agentFull?.subscription_tier === 'starter') {
    try {
      const count = await countAgentReportsLast30Days(agentFull.id);
      if (count > 12) {
        const res = await reportStarterOverageUsage({
          stripeCustomerId: agentFull.stripe_customer_id,
          reportId,
        });
        if (res.ok) {
          console.log(`[runAnalysis] starter overage billed: agent ${agentFull.id} report ${reportId} (count ${count})`);
        }
      }
    } catch (e) {
      // Non-fatal — Stripe meter events can be backfilled, but we don't
      // want a billing hiccup to break the user's report delivery.
      console.error('[runAnalysis] overage meter event failed (non-fatal):', e?.message || e);
    }
  }

  // 5d. End trial early if this is the agent's first completed report.
  //
  //     'First report free · 7 days to claim' means whichever happens
  //     first triggers billing: report #1 completion, or day 8. We've
  //     just completed a report — check whether it's the first, and if
  //     so AND the agent is still 'trialing', tell Stripe to end the
  //     trial now (kicks off the first billing cycle).
  //
  //     Idempotent: subsequent reports won't fire this because the
  //     status will already be 'active' (or 'past_due', 'canceled',
  //     etc.) after the first trial-end. The count check is also a
  //     belt-and-braces guard — only triggers when count === 1.
  if (
    agentFull?.subscription_status === 'trialing' &&
    agentFull?.stripe_subscription_id
  ) {
    try {
      const { count: completeCount } = await supabase
        .from('reports')
        .select('id', { count: 'exact', head: true })
        .eq('agent_id', agentFull.id)
        .eq('status', 'complete');
      if (completeCount === 1) {
        // First-and-only completed report — end the trial.
        await getStripe().subscriptions.update(agentFull.stripe_subscription_id, {
          trial_end: 'now',
        });
        console.log(
          `[runAnalysis] trial ended early for agent ${agentFull.id} ` +
            `after first completed report ${reportId}`
        );
      }
    } catch (e) {
      // Non-fatal — Stripe will auto-end the trial at the 7-day mark
      // anyway. Log so we can investigate if it happens routinely.
      console.error(
        '[runAnalysis] trial-end-on-first-report failed (non-fatal):',
        e?.message || e
      );
    }
  }

  // 6. Generate the PDF (non-fatal — if generation fails, email still goes
  //    with a link to /results instead of an attachment). Resolves the
  //    agent's branding when this report came from an agent dashboard
  //    upload so the attached PDF carries their logo + accent color.
  let pdfBuffer = null;
  let agentForBranding = null;
  if (agentFull && (agentFull.logo_url || agentFull.accent_color || agentFull.business_name)) {
    agentForBranding = agentFull;
  }
  try {
    // Lazy-load the PDF renderer + template here — keeping these out of
    // the top-level import chain so /api/agent-upload doesn't pay the
    // ~30MB bundle cost just to schedule this background job.
    const [{ renderToBuffer }, { ReportDocument }] = await Promise.all([
      import('@react-pdf/renderer'),
      import('./pdf/reportPdf.js'),
    ]);
    const reportWithFreshData = {
      ...report,
      result_json: analysis,
      property_address: analysis?.property_address || report.property_address,
    };
    pdfBuffer = await renderToBuffer(
      ReportDocument({ report: reportWithFreshData, agent: agentForBranding })
    );
    console.log(`[runAnalysis] PDF generated for ${reportId} (${pdfBuffer.length} bytes)`);
  } catch (e) {
    console.error('[runAnalysis] PDF generation failed (non-fatal):', e?.message || e);
  }

  // 7. Email the buyer / agent's client (with PDF attached when available)
  if (report.buyer_email) {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
      await sendReportReadyEmail({
        to: report.buyer_email,
        propertyAddress: analysis?.property_address,
        verdict: analysis?.overall_verdict,
        reportUrl: `${base}/results?reportId=${reportId}${report.agent_id ? `&agent=${report.agent_id}` : ''}`,
        majorCount: Array.isArray(analysis?.major_defects) ? analysis.major_defects.length : null,
        minorCount: Array.isArray(analysis?.minor_defects) ? analysis.minor_defects.length : null,
        pestCount: Array.isArray(analysis?.pest_findings) ? analysis.pest_findings.length : null,
        costLow: analysis?.total_repair_cost_low,
        costHigh: analysis?.total_repair_cost_high,
        negotiationAmount: analysis?.negotiation_amount,
        pdfBuffer,
        // Enriched email blocks: capex forecast (universal) + compliance
        // gap count (investor-only). The HTML template no-ops cleanly when
        // these are absent so the buyer flow still renders a tidy email.
        capexForecast: analysis?.capex_forecast,
        complianceGapsCount: Array.isArray(analysis?.rental_compliance_gaps)
          ? analysis.rental_compliance_gaps.length
          : 0,
        isInvestor: (report.purchase_intent || analysis?.purchase_intent) === 'investment',
        // Drives handover-specific vocab in the email: RECTIFY instead of
        // NEGOTIATE, "Rectification value" instead of "Suggested negotiation".
        reportType: report.report_type,
      });
    } catch (e) {
      console.error('[runAnalysis] result email send failed:', e?.message || e);
    }
  }

  console.log(`[runAnalysis] ${reportId} complete`);
}
