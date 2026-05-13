// app/auth/callback/route.js
// Endpoint that magic-link emails redirect to. Exchanges the one-time code
// for a session cookie, then redirects the user to the dashboard.

import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/auth-server';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/dashboard';
  const errorDescription = url.searchParams.get('error_description');

  if (errorDescription) {
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(errorDescription)}`, url.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/signin?error=missing_code', url.origin));
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
