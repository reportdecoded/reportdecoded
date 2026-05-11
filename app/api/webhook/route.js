// app/api/webhook/route.js
// Stripe webhook. On checkout.session.completed:
//   1. Validate signature
//   2. Idempotency check (skip if payment_status already 'paid')
//   3. Mark report paid + processing (conditional update wins the race)
//   4. Schedule analysis via Next's after() so we return 2xx to Stripe quickly
//
// Stripe enforces a ~10 second response timeout. Claude PDF analysis can take
// 20–60s. after() lets the work continue on the same function instance after
// the response is sent.

import { after } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';
import { runAnalysisForReport } from '@/lib/runAnalysis';

// Allow up to 5 minutes for the post-response analysis to finish.
export const maxDuration = 300;

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[webhook] signature invalid:', err?.message);
    return Response.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const reportId = session.metadata?.reportId;
      if (!reportId) {
        console.warn('[webhook] checkout.session.completed without reportId');
        break;
      }

      const supabase = getServiceSupabase();

      // Conditional update wins the race: only one webhook delivery flips
      // payment_status from 'unpaid' to 'paid'; concurrent retries return zero rows.
      const { data: updated, error: updateErr } = await supabase
        .from('reports')
        .update({
          payment_status: 'paid',
          status: 'processing',
          stripe_session_id: session.id,
        })
        .eq('id', reportId)
        .eq('payment_status', 'unpaid')
        .select('id')
        .maybeSingle();

      if (updateErr) {
        console.error(`[webhook] update failed for ${reportId}:`, updateErr);
        // Return 500 so Stripe retries.
        return Response.json({ error: 'DB update failed' }, { status: 500 });
      }

      if (!updated) {
        console.log(`[webhook] ${reportId} already paid — skipping analysis`);
        break;
      }

      // Schedule the slow Claude call AFTER we respond to Stripe.
      after(async () => {
        try {
          await runAnalysisForReport(reportId);
        } catch (err) {
          console.error(`[webhook] background analysis failed for ${reportId}:`, err);
        }
      });
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      // Agent / PM / tradie subscription activation — handled in Phase 2.
      break;
    }

    case 'customer.subscription.deleted': {
      // Subscription cancel — Phase 2.
      break;
    }

    case 'invoice.payment_failed': {
      // Notify user, pause account after grace period — Phase 2.
      break;
    }
  }

  return Response.json({ received: true });
}
