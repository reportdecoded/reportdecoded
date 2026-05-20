// Next.js auto-serves this as /robots.txt
// Disallows crawlers from indexing private/internal pages.
//
// Allow rule for the public sample report comes AFTER the disallow
// for /results — Google + Bing process specificity by URL prefix
// length, so a more specific allow takes precedence. This lets the
// crawler index the public Yarraville sample (the strongest proof of
// concept on the entire site) while still blocking every other
// /results/* URL (which contain real customer PDFs).

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          // Public Yarraville sample report — explicitly allowed so
          // Google can crawl the live analysis output as a working
          // example. Helps with topical authority for "AS4349.1
          // building inspection report".
          '/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d',
          '/results/?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d',
        ],
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
