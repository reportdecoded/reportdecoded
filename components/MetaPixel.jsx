// components/MetaPixel.jsx
//
// Meta (Facebook/Instagram) Pixel install. Loaded once globally from
// app/layout.js.
//
// IMPLEMENTATION NOTE (Aug 2026): previously used <Script
// dangerouslySetInnerHTML> from next/script, but on this Next 16 App
// Router setup the inline snippet was serialised HTML-escaped
// (&lt;script&gt; / &#x27;) and never executed — fbq stayed undefined and
// every Meta event silently no-oped (broken pixel = no ad conversion
// tracking). Fixed by injecting the standard fbq bootstrap imperatively
// in a useEffect: it's real JS running on the client, so there is no
// string-serialisation/escaping step to break. Bulletproof.
//
// The pixel ID is read from NEXT_PUBLIC_META_PIXEL_ID (public by design).
// Without it, nothing runs. Custom events fire from lib/metaPixelEvents.js.

'use client';

import { useEffect } from 'react';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) return;
    if (window.fbq) return; // already initialised

    // Standard Meta Pixel bootstrap, written as real JS (not a string).
    /* eslint-disable */
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
