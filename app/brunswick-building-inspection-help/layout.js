// Server-side metadata for the Brunswick SEO landing page. The page
// itself is a client component (FAQ accordion + analytics) so metadata
// goes on a route-segment layout.

export const metadata = {
  title: 'Brunswick Building Inspection Report Help — Plain-English Analysis in 60 Seconds | Report Decoded',
  description:
    'Got a building & pest inspection report for a Brunswick (VIC 3056/3057) property? Upload your PDF and get a plain-English verdict, AU repair costs, local tradies, and exactly how much to negotiate — with citations to your inspector\'s exact pages.',
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/brunswick-building-inspection-help',
  },
  openGraph: {
    title: 'Brunswick Building Inspection Report Help',
    description:
      'Plain-English analysis of your Brunswick building & pest inspection PDF in 60 seconds. Verdict, costs, tradies, negotiation.',
    url: 'https://www.reportdecoded.com.au/brunswick-building-inspection-help',
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'website',
  },
  keywords: [
    'Brunswick building inspection',
    'building inspection report Brunswick',
    'pre-purchase inspection Brunswick',
    'building and pest inspection Brunswick',
    'AS4349.1 Brunswick',
    'Brunswick property report help',
    'Brunswick heritage home inspection',
    'building inspection analysis Melbourne inner-north',
  ],
};

export default function BrunswickLayout({ children }) {
  return children;
}
