// lib/runAnalysis.js
// Orchestrator: load a report from Supabase, analyse it with Claude, save the
// result back, send the buyer an email. Designed to be called from the Stripe
// webhook via Next's after() — i.e. AFTER payment is confirmed, OUT of the
// response path so Stripe gets its 2xx quickly.

import { getServiceSupabase } from './supabase';
import { analyseInspectionPdf } from './claude';
import { sendReportReadyEmail, sendRefundNotificationEmail } from './email';
import { findTradiesForAnalysis } from './places';

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
  //    findTradiesForAnalysis returns {} if GOOGLE_MAPS_API_KEY is unset or
  //    Places API fails — analysis still completes cleanly.
  const analysis = result.analysis;
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

  // 6. Email the buyer
  if (report.buyer_email) {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
      await sendReportReadyEmail({
        to: report.buyer_email,
        propertyAddress: analysis?.property_address,
        verdict: analysis?.overall_verdict,
        reportUrl: `${base}/results?reportId=${reportId}`,
      });
    } catch (e) {
      console.error('[runAnalysis] result email send failed:', e?.message || e);
    }
  }

  console.log(`[runAnalysis] ${reportId} complete`);
}
