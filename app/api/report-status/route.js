// app/api/report-status/route.js
// Polled by the /results page until status='complete'. Returns minimal data
// while pending, and the full result_json once analysis lands.
//
// Auth: the reportId is a UUID generated server-side and only handed to the
// buyer (via the Stripe success_url). It's not enumerable, but anyone with
// the link can read the result. Acceptable for v1 — revisit when we add
// buyer accounts.

import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get('reportId');

  if (!reportId) {
    return Response.json({ error: 'reportId required' }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('reports')
    .select(
      'id, status, payment_status, property_address, report_type, result_json, tradies_json, failure_reason, created_at, buyer_email'
    )
    .eq('id', reportId)
    .single();

  if (error || !data) {
    return Response.json({ error: 'Report not found' }, { status: 404 });
  }

  // Only surface result_json when complete — keeps response small while polling.
  // report_type is exposed so the results page can vary verdict + amount
  // labels for new build handover reports (e.g. RECTIFY instead of NEGOTIATE).
  const payload = {
    id: data.id,
    status: data.status,
    payment_status: data.payment_status,
    property_address: data.property_address,
    report_type: data.report_type,
    created_at: data.created_at,
  };
  // buyer_email is returned ONLY during the pending/processing window so the
  // /results LoadingState can show "we're sending it to b***@example.com" —
  // catches typo'd or wrong-inbox uploads BEFORE the buyer panics and pays
  // again with a different email. (Bill case, Jun 2026: same PDF uploaded
  // twice 5 min apart under work email then personal Gmail because the
  // work email got quarantined and he assumed delivery failed.) Once
  // complete, the email is omitted — the analysis is already on-screen,
  // no need to leak the address to anyone the /results URL is shared with.
  if (data.status !== 'complete' && data.buyer_email) {
    payload.buyer_email = data.buyer_email;
  }
  if (data.status === 'complete') {
    payload.analysis = data.result_json;
    payload.tradies = data.tradies_json || null;
  }
  if (data.status === 'failed') {
    payload.failure_reason = data.failure_reason;
  }

  return Response.json(payload);
}
