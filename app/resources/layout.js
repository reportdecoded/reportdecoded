// Index-page metadata. Individual articles have their own layout.js.
export const metadata = {
  title: 'Resources — Building Inspection Guides for Australian Buyers | Report Decoded',
  description: 'Plain-English Australian building inspection guides — AS4349.1, negotiation, termite costs, asbestos, rental compliance. Written by buyers, for buyers.',
  alternates: { canonical: 'https://www.reportdecoded.com.au/resources' },
  openGraph: {
    title: 'Resources — Building Inspection Guides for Australian Buyers',
    description: 'Plain-English Australian building inspection guides — AS4349.1, negotiation, termite costs, asbestos, rental compliance.',
    url: 'https://www.reportdecoded.com.au/resources',
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'website',
  },
};

export default function Layout({ children }) {
  return children;
}
