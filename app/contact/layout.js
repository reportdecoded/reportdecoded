// Route-segment metadata for /contact. The page itself is 'use client'
// (it owns the form state + topic-deep-link logic) so metadata has to
// live on a sibling layout in App Router. Mirrors the SEO landing pages.

export const metadata = {
  title: 'Contact Us — Report Decoded',
  description:
    "Get in touch with Report Decoded. We help Australian property buyers and buyer's agents make sense of their building and pest inspection reports.",
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/contact',
  },
  openGraph: {
    title: 'Contact Report Decoded',
    description:
      "Send Morgan and the team a question about your building inspection report, your subscription, or anything else — we usually reply within a few hours.",
    url: 'https://www.reportdecoded.com.au/contact',
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'website',
  },
};

export default function ContactLayout({ children }) {
  return children;
}
