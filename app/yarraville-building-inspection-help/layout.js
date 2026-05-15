// Server-side metadata for the Yarraville SEO landing page. The page
// itself is a client component (for FAQ accordion + analytics tracking)
// so it can't export metadata directly — a route-segment layout is the
// Next.js App Router pattern for adding SEO metadata to client pages.

export const metadata = {
  title: 'Yarraville Building Inspection Report Help — Plain-English Analysis in 60 Seconds | Report Decoded',
  description:
    'Got a building & pest inspection report for a Yarraville property? Upload your PDF and get a plain-English verdict, AU repair costs, local tradies, and exactly how much to negotiate — backed by citations to your inspector\'s exact pages.',
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/yarraville-building-inspection-help',
  },
  openGraph: {
    title: 'Yarraville Building Inspection Report Help',
    description:
      'Plain-English analysis of your Yarraville building & pest inspection PDF in 60 seconds. Verdict, costs, tradies, negotiation.',
    url: 'https://www.reportdecoded.com.au/yarraville-building-inspection-help',
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'website',
  },
  keywords: [
    'Yarraville building inspection',
    'building inspection report Yarraville',
    'pre-purchase inspection Yarraville',
    'building and pest inspection Yarraville',
    'AS4349.1 Yarraville',
    'Yarraville property report help',
    'building inspection analysis Melbourne',
  ],
};

export default function YarravilleLayout({ children }) {
  return children;
}
