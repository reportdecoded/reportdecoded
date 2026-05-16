/** @type {import('next').NextConfig} */
const nextConfig = {
  // Baseline security headers applied to every response. A full
  // Content-Security-Policy would also need to whitelist Stripe,
  // Supabase, UploadThing, Vercel Analytics, HERE Maps — deferred
  // to a dedicated CSP pass once we've audited every third-party
  // origin we genuinely need. The four headers below are universal
  // and have no per-domain dependencies.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            // SAMEORIGIN lets our own pages embed each other in iframes
            // (e.g. the inline PDF preview opens in a new tab so doesn't
            // need this) while blocking other origins from clickjacking
            // our /dashboard, /signin, etc.
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            // Stops the browser from MIME-sniffing — every response is
            // treated strictly as the Content-Type we declared. Prevents
            // a class of XSS where attacker-uploaded "image" files get
            // re-interpreted as scripts.
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Strip the full URL from cross-origin referrers, but keep
            // the origin so outbound analytics / Stripe / Supabase can
            // still see we're reportdecoded.com.au. Default Chrome
            // behaviour but explicit is clearer for auditors.
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            // We don't use camera / mic / geolocation anywhere, so block
            // them outright. Any future feature that needs one of these
            // can override per-route.
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
