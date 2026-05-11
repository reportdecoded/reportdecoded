// lib/runAnalysis.js
// Orchestrator: load a report from Supabase, analyse it with Claude, save the
// result back, send the buyer an email. Designed to be called from the Stripe
// webhook via Next's after() — i.e. AFTER payment is confirmed, OUT of the
// response path so Stripe gets its 2xx quickly.

import { getServiceSupabase } from './supabase';
import { analyseInspectionPdf } from './claude';
import { sendReportReadyEmail, sendRefundNotificationEmail } from './email';

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

  // Idempotency: don't re-run if already complete or actively processing
  if (report.status === 'complete' || report.status === 'processing') {
    console.log(`[runAnalysis] skipping ${reportId} — status=${report.status}`);
    return;
  }

  // 2. Mark processing
  await supabase
    .from('reports')
    .update({ status: 'processing' })
    .eq('id', reportId);

  // 3. Run Claude
  const result = await analyseInspectionPdf({
    reportUrl: report.report_url,
    purchasePrice: report.purchase_price,
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

  // 4. Persist analysis
  const analysis = result.analysis;
  await supabase
    .from('reports')
    .update({
      status: 'complete',
      result_json: analysis,
      property_address: analysis?.property_address || report.property_address,
    })
    .eq('id', reportId);

  // 5. Email the buyer
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

  console.log(`[runAnalysis] ${reportId} complete (cache_read_input_tokens=${result.usage?.cache_read_input_tokens ?? 0})`);
}
