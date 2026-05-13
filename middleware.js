// middleware.js
// Refreshes the Supabase session on every request so cookies stay valid.
// Without this, sessions expire and protected routes show users as logged out
// even when they have a valid token.

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Touching getUser() forces a session refresh and writes any rotated tokens
  // back into the response cookies.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets and Next.js internals.
    '/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image.png|logo-dark.png|logo-light.png).*)',
  ],
};
