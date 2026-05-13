// app/api/subscribe/route.js
// Authenticated subscription checkout. Agent picks tier+interval, we create
// (or reuse) their Stripe customer, then a subscription Checkout session.
// Stripe redirects them back to /dashboard on success/cancel.

import { getCurrentUser } from '@/lib/auth-server';
import { getServiceSupabase } from '@/lib/supabase';
import { getStripe } from '@/lib/stripe';

const TIER_INTERVAL_TO_PRICE_ENV = {
  starter_monthly: 'STRIPE_PRICE_STARTER_MONTHLY',
  starter_yearly:  'STRIPE_PRICE_STARTER_YEARLY',
  pro_monthly:     'STRIPE_PRICE_PRO_MONTHLY',
  pro_yearly:      'STRIPE_PRICE_PRO_YEARLY',
  agency_monthly:  'STRIPE_PRICE_AGENCY_MONTHLY',
  agency_yearly:   'STRIPE_PRICE_AGENCY_YEARLY',
};

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { tier, interval } = body;
  const key = `${tier}_${interval}`;
  const priceEnv = TIER_INTERVAL_TO_PRICE_ENV[key];
  if (!priceEnv) {
    return Response.json({ error: 'Invalid tier or interval' }, { status: 400 });
  }
  const priceId = process.env[priceEnv];
  if (!priceId) {
    return Response.json(
      { error: `Server missing price for ${key} (env ${priceEnv} not set)` },
      { status: 500 }
    );
  }

  // Must be signed in
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: 'Not signed in' }, { status: 401 });
  }

  // Must have an agents row (filled in via /agents form)
  const admin = getServiceSupabase();
  const { data: agent } = await admin
    .from('agents')
    .select('*')
    .ilike('email', user.email)
    .maybeSingle();

  if (!agent) {
    return Response.json(
      {
        error: 'Please complete your agent profile first',
        redirect: '/agents',
      },
      { status: 403 }
    );
  }

  // Create or reuse Stripe customer
  const stripe = getStripe();
  let customerId = agent.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: agent.email,
      name: agent.full_name,
      phone: agent.phone || undefined,
      metadata: { agent_id: agent.id, business_name: agent.business_name || '' },
    });
    customerId = customer.id;
    await admin.from('agents').update({ stripe_customer_id: customerId }).eq('id', agent.id);
  }

  // Link the auth user to this agent row if not already linked
  if (!agent.auth_user_id) {
    await admin.from('agents').update({ auth_user_id: user.id }).eq('id', agent.id);
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const lineItems = [{ price: priceId, quantity: 1 }];

  // Starter tier gets a second, metered line item that bills $15/extra report
  // when usage in a billing cycle exceeds the 12-report cap. The metered
  // subscription item exists from day 1 but won't be charged until usage
  // events are reported via the meter (wired in Phase 4b).
  if (tier === 'starter' && process.env.STRIPE_PRICE_STARTER_OVERAGE) {
    lineItems.push({ price: process.env.STRIPE_PRICE_STARTER_OVERAGE });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: lineItems,
    success_url: `${base}/dashboard?subscribed=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/dashboard?subscribe_cancelled=1`,
    metadata: { agent_id: agent.id, tier, interval },
    subscription_data: {
      metadata: { agent_id: agent.id, tier, interval },
    },
    // Allow the customer to apply promo codes (later if you set them up)
    allow_promotion_codes: true,
    // Australian tax handling — collect customer billing address for GST treatment
    billing_address_collection: 'required',
  });

  return Response.json({ url: session.url });
}
