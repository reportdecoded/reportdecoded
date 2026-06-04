// components/AffiliateTracker.jsx
//
// DIY affiliate tracking. Replaces Rewardful — same mechanism, no
// platform fee, no external script.
//
// How it works:
//   1. On first landing, reads ?via=<handle> from the URL
//   2. Stores the handle in a 30-day cookie (rd_affiliate)
//   3. Exposes window.affiliateRef so the buyer/agent checkout forms
//      can read it and pass to /api/payment + /api/subscribe
//
// The cookie persists across pages so a buyer who lands via
// /resources/strata-report → browses → comes back to / → uploads
// still attributes to the same affiliate.
//
// We use a plain `document.cookie` write rather than HttpOnly because
// the value needs to be readable from JavaScript (so we can pass it to
// the API). The value is a public handle, not a secret — no security
// concern. We mark SameSite=Lax so it survives normal navigations but
// blocks CSRF-style cross-site cookie sends.
//
// Admin manages affiliates via Supabase UI directly (no self-serve
// signup yet). The handle is whatever Morgan agrees with each creator
// (typically their TikTok / IG handle e.g. 'jase', 'maddie').
// Personalised coupon codes (e.g. JASE10, MADDIE10) all redeem the
// same underlying Stripe coupon (creator_buyer_10off).

'use client';

import { useEffect } from 'react';

const COOKIE_NAME = 'rd_affiliate';
const COOKIE_DAYS = 30;

export default function AffiliateTracker() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    try {
      // Parse ?via= from current URL
      const params = new URLSearchParams(window.location.search);
      const via = (params.get('via') || '').trim().toLowerCase();

      // Sanitise to alphanumeric + hyphen + underscore (defensive — don't
      // let anyone smuggle weird characters into the cookie)
      const safeVia = via.replace(/[^a-z0-9_-]/g, '').slice(0, 64);

      if (safeVia) {
        // Set cookie for 30 days. Path=/ so it covers every route.
        const maxAge = COOKIE_DAYS * 24 * 60 * 60;
        document.cookie = `${COOKIE_NAME}=${safeVia}; max-age=${maxAge}; path=/; SameSite=Lax`;
        window.affiliateRef = safeVia;
      } else {
        // No ?via= in URL — try to read existing cookie
        const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
        if (match && match[1]) {
          window.affiliateRef = decodeURIComponent(match[1]);
        }
      }
    } catch {
      // Defensive — never crash the page on a tracking failure
    }
  }, []);

  return null;
}
