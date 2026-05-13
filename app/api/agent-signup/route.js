// app/api/agent-signup/route.js
// Phase 1 of Stream 2: lead capture. Validates form input, inserts into the
// agents table, sends Morgan a notification, sends the agent a welcome.
// No auth/payment yet — agents convert to paying customers in Phase 2/3.

import { getServiceSupabase } from '@/lib/supabase';
import { sendAgentSignupNotificationEmail, sendAgentWelcomeEmail } from '@/lib/email';

const VALID_ROLES = new Set(['buyer_agent', 'sales_agent', 'other']);
const VALID_TIERS = new Set(['starter', 'pro', 'agency', 'exploring']);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const fullName = (body.fullName || '').trim();
  const businessName = (body.businessName || '').trim() || null;
  const email = (body.email || '').trim().toLowerCase();
  const phone = (body.phone || '').trim() || null;
  const role = body.role;
  const tierInterest = body.tierInterest || null;

  // Validation
  if (!fullName || fullName.length < 2) {
    return Response.json({ error: 'Please enter your full name' }, { status: 400 });
  }
  if (!email || !/.+@.+\..+/.test(email)) {
    return Response.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }
  if (!VALID_ROLES.has(role)) {
    return Response.json({ error: 'Please select your role' }, { status: 400 });
  }
  if (tierInterest && !VALID_TIERS.has(tierInterest)) {
    return Response.json({ error: 'Invalid tier selection' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Insert. Catch the unique-email constraint specifically so we can give a
  // friendly "you've already signed up" message instead of a 500.
  const { data: agent, error } = await supabase
    .from('agents')
    .insert({
      full_name: fullName,
      business_name: businessName,
      email,
      phone,
      role,
      tier_interest: tierInterest,
    })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      // unique_violation on lower(email)
      return Response.json(
        { error: "You've already signed up — we'll be in touch soon!" },
        { status: 409 }
      );
    }
    console.error('[agent-signup] insert failed:', error);
    return Response.json(
      { error: 'Could not save your details. Please try again.' },
      { status: 500 }
    );
  }

  // Fire off both emails in parallel. Failures are logged but don't fail the
  // signup itself — Morgan still has the row in Supabase to follow up on.
  Promise.allSettled([
    sendAgentSignupNotificationEmail({ agent }),
    sendAgentWelcomeEmail({ to: agent.email, fullName: agent.full_name }),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[agent-signup] email ${i} failed:`, r.reason?.message || r.reason);
      }
    });
  });

  return Response.json({ ok: true });
}
