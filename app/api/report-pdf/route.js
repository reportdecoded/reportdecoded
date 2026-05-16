// app/api/report-pdf/route.js
// Generate a downloadable PDF of a completed report. Public — the report
// URL is already public via /results?reportId=X, and the PDF is just an
// alternative rendering of the same data.
//
//   GET /api/report-pdf?reportId=<uuid>&agent=<agent_uuid>&preview=1
//
// If ?agent= is provided AND that agent has white-label settings (logo +
// accent color), the PDF is rebranded with their identity. Otherwise it
// uses the default Report Decoded branding.
//
// If ?preview=1 is set, the PDF opens INLINE in the browser tab instead
// of triggering a download — used by /dashboard/branding's "Preview
// branded PDF" button so agents can see their logo + accent colour on
// a sample PDF before running a real client report.

import { renderToBuffer } from '@react-pdf/renderer';
import { getServiceSupabase } from '@/lib/supabase';
import { ReportDocument } from '@/lib/pdf/reportPdf';

// PDF generation can take 3–10 seconds for long reports.
export const maxDuration = 30;
export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get('reportId');
  const agentId = searchParams.get('agent');
  // preview=1 → render INLINE in a browser tab. Default → attachment (download).
  const isPreview = searchParams.get('preview') === '1';

  if (!reportId) {
    return Response.json({ error: 'reportId is required' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Load report row
  const { data: report, error: loadErr } = await supabase
    .from('reports')
    .select('id, status, property_address, result_json')
    .eq('id', reportId)
    .single();

  if (loadErr || !report) {
    return Response.json({ error: 'Report not found' }, { status: 404 });
  }
  if (report.status !== 'complete') {
    return Response.json(
      { error: `Report is ${report.status}. PDF only available once analysis completes.` },
      { status: 409 }
    );
  }
  if (!report.result_json) {
    return Response.json({ error: 'Report has no analysis data' }, { status: 422 });
  }

  // Optional agent branding
  let agent = null;
  if (agentId) {
    const { data } = await supabase
      .from('agents')
      .select('id, business_name, logo_url, accent_color')
      .eq('id', agentId)
      .maybeSingle();
    if (data && (data.logo_url || data.accent_color || data.business_name)) {
      agent = data;
    }
  }

  // Render the PDF to a buffer.
  let pdfBuffer;
  try {
    pdfBuffer = await renderToBuffer(
      ReportDocument({ report, agent, brandUrl: 'reportdecoded.com.au' })
    );
  } catch (err) {
    console.error('[report-pdf] render failed:', err);
    return Response.json({ error: 'Could not generate PDF' }, { status: 500 });
  }

  // Filename: address slug or fallback to short report id
  const addressForName = (report.property_address || 'inspection-report')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  const filename = `report-decoded-${addressForName || reportId.slice(0, 8)}.pdf`;

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${isPreview ? 'inline' : 'attachment'}; filename="${filename}"`,
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    },
  });
}
