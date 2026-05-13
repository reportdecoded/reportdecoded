// Next.js auto-serves this as /robots.txt
// Disallows crawlers from indexing private/internal pages.

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',         // backend endpoints
          '/auth/',        // OAuth callback flow
          '/dashboard',    // private agent dashboard
          '/dashboard/',
          '/results',      // contain customer PDFs + property defects
          '/results/',
        ],
      },
    ],
    sitemap: 'https://www.reportdecoded.com.au/sitemap.xml',
    host: 'https://www.reportdecoded.com.au',
  };
}
