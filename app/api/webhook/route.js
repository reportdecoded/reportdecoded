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
// runAnalysisForReport lazy-imported inside after() — same fix as
// /api/agent-upload. Static import previously bloated the webhook's
// cold-start bundle with @react-pdf/renderer (~30MB) which risks Stripe
// retries when the webhook can't respond inside its 10s timeout.

// Allow up to 5 minutes for the post-response analysis to finish.
export const maxDuration = 300;

// Reverse-lookup tier from price ID — used when subscription event metadata is
// missing (Stripe doesn't always carry our checkout-time metadata into
// subscription.* events). The env var names match those in /api/subscribe.
function agentTierFromPriceId(priceId) {
  if (!priceId) return null;
  if (
    priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_STARTER_YEARLY
  ) return 'starter';
  if (
    priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_PRO_YEARLY
  ) return 'pro';
  if (
    priceId === process.env.STRIPE_PRICE_AGENCY_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_AGENCY_YEARLY
  ) return 'agency';
  return null;
}

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

      // SUBSCRIPTION checkout (agent signs up for Starter/Pro/Agency).
      // The subscription.created event handles tier + status; here we just
      // log + idempotently link the agent row to the new customer/subscription.
      if (session.mode === 'subscription') {
        const agentId = session.metadata?.agent_id;
        const supabase = getServiceSupabase();
        if (agentId) {
          await supabase
            .from('agents')
            .update({
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
            })
            .eq('id', agentId);
          console.log(`[webhook] subscription checkout completed for agent ${agentId}`);
        }
        break;
      }

      // ONE-OFF PAYMENT checkout (buyer pays for a report) — existing flow.
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
          const { runAnalysisForReport } = await import('@/lib/runAnalysis');
          await runAnalysisForReport(reportId);
        } catch (err) {
          // runAnalysisForReport now self-marks 'failed' on its own
          // uncaught errors. Belt-and-braces in case the dynamic import
          // itself fails so a buyer never sits paid-but-stuck forever.
          const msg = err?.message || String(err) || 'unknown error';
          console.error(`[webhook] background analysis failed for ${reportId}:`, err);
          try {
            await supabase
              .from('reports')
              .update({
                status: 'failed',
                failure_reason: `Background job crashed before analysis: ${msg.slice(0, 400)}`,
              })
              .eq('id', reportId)
              .eq('status', 'processing');
          } catch (e2) {
            console.error(`[webhook] also failed to mark row failed for ${reportId}:`, e2);
          }
        }
      });
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const supabase = getServiceSupabase();
      const tier = sub.metadata?.tier || agentTierFromPriceId(sub.items?.data?.[0]?.price?.id);
      const update = {
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer,
        subscription_status: sub.status,            // Stripe's enum mirrors ours
        subscription_tier: tier || null,
      };
      const { error, count } = await supabase
        .from('agents')
        .update(update, { count: 'exact' })
        .or(`stripe_customer_id.eq.${sub.customer},stripe_subscription_id.eq.${sub.id}`);
      if (error) {
        console.error(`[webhook] subscription update failed:`, error.message);
      } else {
        console.log(`[webhook] subscription ${sub.id} (${sub.status}, tier=${tier}) -> ${count} agent rows updated`);
      }

      // Send the "your subscription is active" welcome — ONLY on the
      // .created event (skip .updated which fires on every renewal +
      // metadata change). Wrapped in after() so a Resend hiccup doesn't
      // block our 2xx back to Stripe (would trigger Stripe to retry the
      // same event and double-fire the welcome email).
      if (event.type === 'customer.subscription.created' && tier) {
        after(async () => {
          try {
            const { data: agent } = await supabase
              .from('agents')
              .select('email, full_name, business_name')
              .or(`stripe_customer_id.eq.${sub.customer},stripe_subscription_id.eq.${sub.id}`)
              .maybeSingle();
            if (!agent?.email) {
              console.warn(`[webhook] welcome: no agent email found for sub ${sub.id}`);
              return;
            }
            const { sendAgentSubscriptionActivatedEmail } = await import('@/lib/email');
            await sendAgentSubscriptionActivatedEmail({
              to: agent.email,
              fullName: agent.full_name,
              tier,
              businessName: agent.business_name,
            });
            console.log(`[webhook] welcome email sent to ${agent.email} (tier=${tier})`);
          } catch (e) {
            console.error(`[webhook] welcome email failed for sub ${sub.id}:`, e?.message || e);
          }
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const supabase = getServiceSupabase();
      await supabase
        .from('agents')
        .update({ subscription_status: 'canceled' })
        .eq('stripe_subscription_id', sub.id);
      console.log(`[webhook] subscription ${sub.id} canceled`);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      if (invoice.subscription) {
        const supabase = getServiceSupabase();
        await supabase
          .from('agents')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_subscription_id', invoice.subscription);
        console.log(`[webhook] invoice payment failed for sub ${invoice.subscription} -> past_due`);
        // TODO future: send a "your card declined" email via Resend
      }
      break;
    }
  }

  return Response.json({ received: true });
}
