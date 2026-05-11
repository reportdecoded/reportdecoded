export const metadata = {
  title: 'Report Decoded',
  description: 'AI Building Inspection Report Interpreter for Australian Property Buyers',
  metadataBase: new URL('https://www.reportdecoded.com.au'),
  openGraph: {
    title: 'Report Decoded — Your Building Report, Decoded',
    description:
      'Upload your Australian building and pest inspection PDF. Get a plain-English verdict, repair cost estimates, and exactly how much to negotiate — in 60 seconds.',
    url: 'https://www.reportdecoded.com.au',
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Report Decoded — Your Building Report, Decoded',
    description:
      'AI-powered plain-English interpretation of Australian building inspection reports.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
