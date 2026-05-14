'use client';
// lib/auth-browser.js
// Browser-side Supabase Auth client. Use this in 'use client' components
// for client-driven sign-in flows (requesting magic links, sign-out, etc.)

import { createBrowserClient } from '@supabase/ssr';

let _client;

// May 2026 migration: prefer the new "publishable" key, fall back to the
// legacy "anon" key. See lib/supabase.js header for context.
export function getSupabaseBrowser() {
  if (_client) return _client;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey
  );
  return _client;
}
