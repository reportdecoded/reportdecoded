// app/api/cron/buyer-day7/route.js
//
// Daily cron — fires a "next property / Pro plan" upsell for any buyer
// whose report completed 7–8 days ago and who hasn't received this email.
//
// Triggering: configured in vercel.json. Vercel injects
// Authorization: Bearer ${CRON_SECRET} — we check it to block public calls.
//
// Idempotency: reports.day7_upsell_sent_at is set after a successful send.
//
// REQUIRED SCHEMA (run once in Supabase SQL editor):
//   alter table reports add column day7_upsell_sent_at timestamptz null;

import { getServiceSupabase } from '@/lib/supabase';
import { sendBuyerDay7UpsellEmail } from '@/lib/email';

export const maxDuration = 60;

// 7–8 day window after completed_at.
const WINDOW_LOW_H  = 8 * 24;  // 192h
const WINDOW_HIGH_H = 7 * 24;  // 168h

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

  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, buyer_email, property_address, completed_at, day7_upsell_sent_at')
    .eq('status', 'complete')
    .gte('completed_at', windowLow)
    .lte('completed_at', windowHigh)
    .is('day7_upsell_sent_at', null);

  if (error) {
    console.error('[cron/buyer-day7] query failed:', error.message);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  const results = { found: reports?.length ?? 0, sent: 0, skipped: 0, errored: 0 };

  for (const report of (reports || [])) {
    if (!report.buyer_email) {
      results.skipped++;
      continue;
    }
    try {
      await sendBuyerDay7UpsellEmail({
        to: report.buyer_email,
        propertyAddress: report.property_address,
        reportId: report.id,
      });

      const { error: updateErr } = await supabase
        .from('reports')
        .update({ day7_upsell_sent_at: now.toISOString() })
        .eq('id', report.id);

      if (updateErr) {
        console.error(`[cron/buyer-day7] sent but update failed for ${report.id}:`, updateErr.message);
      }
      results.sent++;
    } catch (err) {
      console.error(`[cron/buyer-day7] send failed for ${report.id}:`, err?.message || err);
      results.errored++;
    }
  }

  console.log(`[cron/buyer-day7] found=${results.found} sent=${results.sent} skipped=${results.skipped} errored=${results.errored}`);
  return Response.json({ ok: true, ...results });
}
