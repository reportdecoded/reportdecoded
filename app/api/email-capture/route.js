// app/api/email-capture/route.js
//
// Handles the "Not ready? Get a free sample" form on the homepage.
// Saves the lead to Supabase, sends a sample-report email via Resend.
//
// REQUIRED SCHEMA (run once in Supabase SQL editor if not already present):
//   create table if not exists leads (
//     id          uuid primary key default gen_random_uuid(),
//     email       text not null,
//     source      text not null default 'unknown',
//     created_at  timestamptz not null default now()
//   );
//   create unique index if not exists leads_email_source_idx on leads (email, source);
//
// If the table doesn't exist the DB upsert fails silently — the email still
// sends, so leads aren't lost. Once the table is created, re-submitting the
// same email + source is idempotent (upsert on conflict does nothing).

import { getServiceSupabase } from '@/lib/supabase';
import { sendSampleReportEmail } from '@/lib/email';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const email = (body?.email || '').trim().toLowerCase();
  const source = (body?.source || 'unknown').slice(0, 80);

  if (!email || !/.+@.+\..+/.test(email)) {
    return Response.json({ error: 'invalid_email' }, { status: 400 });
  }

  // Save lead — fail open (email send is the primary goal).
  try {
    const supabase = getServiceSupabase();
    await supabase
      .from('leads')
      .upsert({ email, source }, { onConflict: 'email,source', ignoreDuplicates: true });
  } catch (err) {
    console.warn('[email-capture] DB save failed (table may not exist yet):', err?.message || err);
  }

  // Send sample report email.
  try {
    await sendSampleReportEmail({ to: email });
  } catch (err) {
    console.error('[email-capture] email send failed:', err?.message || err);
    return Response.json({ error: 'email_send_failed' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
