// app/api/agent-brand/route.js
// Public endpoint — returns ONLY the white-label branding fields for a given
// agent ID. Used by /results when a report is viewed via an agent's personal
// share link (?agent=AGENT_ID). No auth required: agent.id is a non-guessable
// UUID and only branding/business-display fields are exposed.

import { getServiceSupabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return Response.json({ error: 'Invalid agent id' }, { status: 400 });
  }

  const admin = getServiceSupabase();
  const { data, error } = await admin
    .from('agents')
    .select('id, business_name, logo_url, accent_color, subscription_status')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return Response.json({ error: 'Agent not found' }, { status: 404 });
  }

  // Only return branding for agents with at least some branding configured.
  // (Don't expose empty profile data for guessing.)
  if (!data.logo_url && !data.accent_color) {
    return Response.json({ error: 'No branding' }, { status: 404 });
  }

  return Response.json({
    business_name: data.business_name,
    logo_url: data.logo_url,
    accent_color: data.accent_color,
  });
}
