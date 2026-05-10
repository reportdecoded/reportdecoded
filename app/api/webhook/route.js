// app/api/webhook/route.js
// Handles Stripe webhook events — unlocks reports after payment confirmed

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return Response.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object;
      const { reportId } = session.metadata;

      // Mark report as paid in Supabase
      await supabase
        .from('reports')
        .update({
          payment_status: 'paid',
          stripe_session_id: session.id,
        })
        .eq('id', reportId);

      // Trigger analysis if not already done
      // (or trigger email delivery of completed report)
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      // Update agent or PM subscription status in Supabase
      // Match by stripe_subscription_id
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      // Deactivate agent or PM account
      break;
    }

    case 'invoice.payment_failed': {
      // Notify user their payment failed
      // Pause account after grace period
      break;
    }
  }

  return Response.json({ received: true });
}
