const url = 'https://www.reportdecoded.com.au/affiliates';

export const metadata = {
  title: 'Affiliate Program | Report Decoded',
  description:
    'Earn $15 per buyer report sold via your code (your audience saves $10) + 30% recurring on agent subscriptions. Built for AU property + finance creators sharing a tool their audience genuinely needs.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Report Decoded — Creator Affiliate Program',
    description:
      'Earn $15 per buyer report (audience saves $10) + 30% recurring on agent subscriptions. For AU property + finance creators.',
    url,
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Report Decoded — Affiliate Program', description: 'Earn $15 per buyer report (audience saves $10) + 30% recurring on agent subscriptions.' },
};

export default function Layout({ children }) { return children; }
