// app/api/report-count/route.js
//
// Public endpoint — returns the count of completed reports.
// Used by the homepage counter strip. No auth required (count only, no PII).
// Cached for 5 minutes so the homepage isn't hammering Supabase on every visit.

import { getServiceSupabase } from '@/lib/supabase';

export const revalidate = 300; // 5-min Next.js cache

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { count, error } = await supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'complete');

    if (error) throw error;

    return Response.json({ count: count ?? 0 }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (err) {
    // Fail silently — counter just won't show
    return Response.json({ count: 0 });
  }
}
