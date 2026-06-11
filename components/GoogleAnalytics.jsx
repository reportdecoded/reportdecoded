// components/GoogleAnalytics.jsx
//
// Google Analytics 4 (gtag.js) install. Loaded once globally from
// app/layout.js, mirroring the MetaPixel pattern.
//
// The measurement ID is read from NEXT_PUBLIC_GA_MEASUREMENT_ID —
// public on purpose, this is the client-side ID Google hands out for
// public use. Without the env var set, the component renders nothing,
// so the site keeps working in any environment that doesn't have it.
//
// Why GA4 alongside Meta Pixel: the pixel only attributes Meta-sourced
// traffic. GA4 attributes EVERY source — Google organic, direct, social,
// referral — so we can finally see which of the /resources articles
// actually convert to $59 purchases rather than just drawing traffic.
//
// page_view fires automatically on load. Client-side route changes in
// the App Router are also captured automatically by GA4's enhanced
// measurement ("page changes based on browser history events").
//
// Conversion events (purchase / begin_checkout / generate_lead /
// view_item) fire from lib/metaPixelEvents.js — the same wrappers that
// fire the Meta Pixel events, so every funnel event lands in both
// systems from a single call site.

'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  );
}
