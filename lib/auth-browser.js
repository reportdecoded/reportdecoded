'use client';
// lib/auth-browser.js
// Browser-side Supabase Auth client. Use this in 'use client' components
// for client-driven sign-in flows (requesting magic links, sign-out, etc.)

import { createBrowserClient } from '@supabase/ssr';

let _client;

export function getSupabaseBrowser() {
  if (_client) return _client;
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return _client;
}
