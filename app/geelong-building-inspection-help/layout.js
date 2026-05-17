// Server-side metadata for the Geelong SEO landing page.

export const metadata = {
  title: 'Geelong Building Inspection Report Help — Plain-English Analysis in Under 2 Minutes | Report Decoded',
  description:
    'Upload your Geelong / Bellarine inspection PDF (pre-purchase or new-build handover) and get plain-English verdict, costs, tradies and negotiation amount — in under 2 minutes.',
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/geelong-building-inspection-help',
  },
  openGraph: {
    title: 'Geelong Building Inspection Report Help',
    description:
      'Plain-English analysis of your Geelong building & pest inspection PDF in under 2 minutes. Verdict, costs, tradies, negotiation.',
    url: 'https://www.reportdecoded.com.au/geelong-building-inspection-help',
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'website',
  },
  keywords: [
    'Geelong building inspection',
    'building inspection report Geelong',
    'pre-purchase inspection Geelong',
    'building and pest inspection Geelong',
    'AS4349.1 Geelong',
    'Geelong property report help',
    'Newtown Belmont Highton inspection',
    'Armstrong Creek new build handover',
    'building inspection analysis Bellarine',
  ],
};

export default function GeelongLayout({ children }) {
  return children;
}
