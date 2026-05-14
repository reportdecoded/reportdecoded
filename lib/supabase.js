import { createClient } from '@supabase/supabase-js';

// Server-only client using the secret/service_role key. This bypasses Row
// Level Security, so NEVER import this from a "use client" file or send it
// to the browser. Only API routes and server actions may use it.
//
// Key migration (May 2026): Supabase deprecated the legacy "service_role" JWT
// in favour of new "Secret API keys" with proper rotation. We prefer the new
// name but fall back to the legacy one so the swap can happen incrementally
// (deploy code first, add new env vars second, remove old vars third). Once
// SUPABASE_SECRET_KEY is set everywhere and legacy JWT-based keys are
// disabled in the Supabase dashboard, the fallback can be removed.
export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secretKey) {
    throw new Error(
      'Supabase env vars missing — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY) in .env.local'
    );
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
