// components/MetaPixel.jsx
//
// Meta (Facebook/Instagram) Pixel install. Loaded once globally from
// app/layout.js. Fires PageView automatically on every page (including
// client-side navigations — fbq retries the init pattern in SPA setups).
//
// The pixel ID is read from NEXT_PUBLIC_META_PIXEL_ID — public on
// purpose, this is the client-side tracking ID Meta hands out for
// public use. Without the env var set, the component renders nothing,
// so the site keeps working in any environment that doesn't have it.
//
// Custom events (ViewContent / Lead / InitiateCheckout / Purchase) fire
// from individual page components by calling window.fbq('track', '...').
// See lib/metaPixelEvents.js for the typed helper.

'use client';

import Script from 'next/script';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
