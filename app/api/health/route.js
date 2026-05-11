// app/api/health/route.js
// Diagnostic endpoint: returns presence/absence of every external-service
// env var so Morgan can check which keys are still missing without running
// the full upload flow. Reports only "set" / "missing", never the values.
//
//   curl http://localhost:3000/api/health | jq
//
// Returns 200 with details either way; the "ready" boolean is true only when
// every required key is present.

const KEYS = [
  { name: 'ANTHROPIC_API_KEY',           required: true,  label: 'Anthropic (Claude API)' },
  { name: 'STRIPE_SECRET_KEY',           required: true,  label: 'Stripe — secret key' },
  { name: 'STRIPE_PUBLISHABLE_KEY',      required: true,  label: 'Stripe — publishable key' },
  { name: 'STRIPE_WEBHOOK_SECRET',       required: true,  label: 'Stripe — webhook signing secret' },
  { name: 'NEXT_PUBLIC_SUPABASE_URL',    required: true,  label: 'Supabase project URL' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true,label: 'Supabase anon key' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY',   required: true,  label: 'Supabase service-role key' },
  { name: 'UPLOADTHING_TOKEN',           required: true,  label: 'UploadThing token' },
  { name: 'RESEND_API_KEY',              required: true,  label: 'Resend (email) API key' },
  { name: 'NEXT_PUBLIC_BASE_URL',        required: false, label: 'Public base URL' },
  { name: 'GOOGLE_MAPS_API_KEY',         required: false, label: 'Google Maps (tradie matching, later)' },
  { name: 'INTERNAL_API_TOKEN',          required: false, label: 'Internal API token (prod /api/analyse gate)' },
  { name: 'RESEND_FROM_EMAIL',           required: false, label: 'Resend "from" email (defaults to onboarding@resend.dev)' },
];

export async function GET() {
  const status = KEYS.map(({ name, required, label }) => {
    const value = process.env[name];
    const present = typeof value === 'string' && value.length > 0;
    return { name, label, required, present, length: value?.length ?? 0 };
  });

  const missingRequired = status.filter((s) => s.required && !s.present);
  const ready = missingRequired.length === 0;

  return Response.json({
    ready,
    missing_required: missingRequired.map((s) => s.name),
    keys: status,
    nextSteps: ready
      ? [
          'All required keys present. Run the Supabase migration (supabase/migrations/0001_init.sql) in the SQL editor.',
          'Start a local Stripe webhook listener: `stripe listen --forward-to localhost:3000/api/webhook` — paste the printed `whsec_...` into STRIPE_WEBHOOK_SECRET in .env.local.',
          'Test the full path: open http://localhost:3000, upload a sample PDF, complete checkout with Stripe test card 4242 4242 4242 4242.',
        ]
      : missingRequired.map(
          (s) => `Set ${s.name} in .env.local — ${s.label}`
        ),
  });
}
