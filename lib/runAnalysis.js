// lib/runAnalysis.js
// Orchestrator: load a report from Supabase, analyse it with Claude, save the
// result back, send the buyer an email. Designed to be called from the Stripe
// webhook via Next's after() — i.e. AFTER payment is confirmed, OUT of the
// response path so Stripe gets its 2xx quickly.

import { getServiceSupabase } from './supabase';
import { analyseInspectionPdf } from './claude';
import { sendReportReadyEmail, sendRefundNotificationEmail } from './email';
import { findTradiesForAnalysis } from './places';

// @react-pdf/renderer + pdf/reportPdf are heavy (~30MB of fontkit/pdfkit
// dependencies). Static import bloats every serverless function that
// transitively requires this file — including /api/agent-upload which
// previously crashed at cold start (500 with empty body) because the
// bundle hit Vercel's memory ceiling. Deferred to dynamic import inside
// the function that uses it; runs inside after() so HTTP response is
// already sent by then.

export async function runAnalysisForReport(reportId) {
  const supabase = getServiceSupabase();

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

  // 6. Generate the PDF (non-fatal — if generation fails, email still goes
  //    with a link to /results instead of an attachment). Resolves the
  //    agent's branding when this report came from an agent dashboard
  //    upload so the attached PDF carries their logo + accent color.
  let pdfBuffer = null;
  let agentForBranding = null;
  if (report.agent_id) {
    const { data: agentRow } = await supabase
      .from('agents')
      .select('id, business_name, logo_url, accent_color')
      .eq('id', report.agent_id)
      .maybeSingle();
    if (agentRow && (agentRow.logo_url || agentRow.accent_color || agentRow.business_name)) {
      agentForBranding = agentRow;
    }
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
      });
    } catch (e) {
      console.error('[runAnalysis] result email send failed:', e?.message || e);
    }
  }

  console.log(`[runAnalysis] ${reportId} complete`);
}
