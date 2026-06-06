// app/api/cron/buyer-day1/route.js
//
// Daily cron — fires a "How did the negotiation go?" follow-up for
// any buyer whose report completed 24–48 hours ago and who hasn't
// received this email yet.
//
// Triggering: configured in vercel.json. Vercel injects
// Authorization: Bearer ${CRON_SECRET} — we check it to block public calls.
//
// Idempotency: reports.day1_followup_sent_at is set after a successful
// send. Subsequent cron runs skip rows that already have this timestamp.
//
// REQUIRED SCHEMA (run once in Supabase SQL editor):
//   alter table reports add column day1_followup_sent_at timestamptz null;

import { getServiceSupabase } from '@/lib/supabase';
import { sendBuyerDay1FollowupEmail } from '@/lib/email';

export const maxDuration = 60;

// 24–48h window after completed_at.
const WINDOW_LOW_H  = 48;
const WINDOW_HIGH_H = 24;

export async function GET(request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const got = request.headers.get('authorization');
    if (got !== `Bearer ${expected}`) {
      return Response.json({ error: 'unauthorised' }, { status: 401 });
    }
  }

  const supabase = getServiceSupabase();
  const now = new Date();

  const windowHigh = new Date(now.getTime() - WINDOW_HIGH_H * 60 * 60 * 1000).toISOString();
  const windowLow  = new Date(now.getTime() - WINDOW_LOW_H  * 60 * 60 * 1000).toISOString();

  // Find completed reports in the 24–48h window without a day1 followup.
  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, buyer_email, property_address, completed_at, day1_followup_sent_at')
    .eq('status', 'complete')
    .gte('completed_at', windowLow)
    .lte('completed_at', windowHigh)
    .is('day1_followup_sent_at', null);

  if (error) {
    // Column may not exist yet — fail gracefully, don't break the cron.
    console.error('[cron/buyer-day1] query failed:', error.message);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  const results = { found: reports?.length ?? 0, sent: 0, skipped: 0, errored: 0 };

  for (const report of (reports || [])) {
    if (!report.buyer_email) {
      results.skipped++;
      continue;
    }
    try {
      await sendBuyerDay1FollowupEmail({
        to: report.buyer_email,
        propertyAddress: report.property_address,
        reportId: report.id,
      });

      const { error: updateErr } = await supabase
        .from('reports')
        .update({ day1_followup_sent_at: now.toISOString() })
        .eq('id', report.id);

      if (updateErr) {
        console.error(`[cron/buyer-day1] sent but update failed for ${report.id}:`, updateErr.message);
      }
      results.sent++;
    } catch (err) {
      console.error(`[cron/buyer-day1] send failed for ${report.id}:`, err?.message || err);
      results.errored++;
    }
  }

  console.log(`[cron/buyer-day1] found=${results.found} sent=${results.sent} skipped=${results.skipped} errored=${results.errored}`);
  return Response.json({ ok: true, ...results });
}
