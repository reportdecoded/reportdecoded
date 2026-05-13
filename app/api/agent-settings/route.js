// app/api/agent-settings/route.js
// Authenticated agent saves their white-label settings: logo + accent colour.
// PUT body: { logo_url?: string|null, accent_color?: string|null }

import { getCurrentUser } from '@/lib/auth-server';
import { getServiceSupabase } from '@/lib/supabase';

const HEX_RE = /^#[0-9a-f]{6}$/i;

export async function PUT(request) {
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

  const update = {};
  if (Object.prototype.hasOwnProperty.call(body, 'logo_url')) {
    const v = body.logo_url;
    if (v !== null && (typeof v !== 'string' || v.length > 1000)) {
      return Response.json({ error: 'Invalid logo_url' }, { status: 400 });
    }
    update.logo_url = v || null;
  }
  if (Object.prototype.hasOwnProperty.call(body, 'accent_color')) {
    const v = body.accent_color;
    if (v !== null && (typeof v !== 'string' || !HEX_RE.test(v))) {
      return Response.json(
        { error: 'accent_color must be a 6-digit hex like #C97A3A' },
        { status: 400 }
      );
    }
    update.accent_color = v || null;
  }
  if (Object.keys(update).length === 0) {
    return Response.json({ error: 'No fields to update' }, { status: 400 });
  }

  const admin = getServiceSupabase();
  const { error } = await admin
    .from('agents')
    .update(update)
    .ilike('email', user.email);

  if (error) {
    console.error('[agent-settings] update failed:', error.message);
    return Response.json({ error: 'Could not save settings' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
