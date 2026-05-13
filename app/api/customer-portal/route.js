// app/api/customer-portal/route.js
// Generates a Stripe Customer Portal session so the agent can:
//   - update their card / billing address
//   - swap tiers
//   - cancel their subscription
// We just redirect them to Stripe's hosted UI; no in-app management needed.

import { getCurrentUser } from '@/lib/auth-server';
import { getServiceSupabase } from '@/lib/supabase';
import { getStripe } from '@/lib/stripe';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: 'Not signed in' }, { status: 401 });
  }

  const admin = getServiceSupabase();
  const { data: agent } = await admin
    .from('agents')
    .select('stripe_customer_id')
    .ilike('email', user.email)
    .maybeSingle();

  if (!agent?.stripe_customer_id) {
    return Response.json(
      { error: 'No active subscription. Subscribe first.' },
      { status: 404 }
    );
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: agent.stripe_customer_id,
    return_url: `${base}/dashboard`,
  });

  return Response.json({ url: session.url });
}
