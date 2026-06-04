// components/RewardfulScript.jsx
//
// Rewardful affiliate tracking. Loaded once globally from app/layout.js.
//
// The Rewardful script does two jobs:
//   1. Reads ?via=<affiliate_handle> from the URL on first landing, sets
//      a tracking cookie that persists 30 days (configurable in
//      Rewardful UI under the campaign settings).
//   2. Exposes window.Rewardful.referral — a UUID string we pass into
//      Stripe Checkout's client_reference_id field. Rewardful's webhook
//      matches that ID back to the affiliate and attributes the
//      commission.
//
// Buyer + agent checkout flows both read window.Rewardful.referral
// before redirecting to Stripe. See:
//   - components/ReportDecoded.jsx (buyer upload → /api/payment)
//   - app/dashboard/SubscribeButtons.js (agent subscribe → /api/subscribe)
//
// The component renders nothing if NEXT_PUBLIC_REWARDFUL_API_KEY is
// missing, so the site keeps working in environments without Rewardful
// configured (e.g. local dev, preview deploys without the env var).

'use client';

import Script from 'next/script';

const API_KEY = process.env.NEXT_PUBLIC_REWARDFUL_API_KEY;

export default function RewardfulScript() {
  if (!API_KEY) return null;

  return (
    <>
      {/* Rewardful queue stub — must load BEFORE the async script so
          early window.rewardful() calls (rare but possible) queue up
          instead of throwing. Standard Rewardful install pattern. */}
      <Script
        id="rewardful-queue"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,r){
              w._rwq=r;
              w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}
            })(window,'rewardful');
          `,
        }}
      />
      {/* Rewardful main script — reads the ?via= URL param, sets cookie,
          exposes window.Rewardful.referral once loaded. */}
      <Script
        id="rewardful-main"
        strategy="afterInteractive"
        async
        src="https://r.wdfl.co/rw.js"
        data-rewardful={API_KEY}
      />
    </>
  );
}
