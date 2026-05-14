// lib/auth-server.js
// Server-side Supabase Auth client backed by Next.js cookies.
// Use this in server components, API routes, and middleware to:
//   - read the current session
//   - send magic-link emails
//   - exchange auth codes for sessions on callback
//
// Uses the public anon key (NOT the service role key) — RLS still applies
// to the authenticated user. Service-role operations should still use
// getServiceSupabase() from lib/supabase.js.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  // May 2026 migration: prefer the new "publishable" key, fall back to the
  // legacy "anon" key. See lib/supabase.js header for context.
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server components can read cookies but not set them; that's fine,
            // the middleware will refresh the session on the next request.
          }
        },
      },
    }
  );
}

/** Return the currently-authenticated user, or null. */
export async function getCurrentUser() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
