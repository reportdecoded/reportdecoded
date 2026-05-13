import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'Report Decoded',
  description: 'AI Building Inspection Report Interpreter for Australian Property Buyers',
  metadataBase: new URL('https://www.reportdecoded.com.au'),
  applicationName: 'Report Decoded',
  // Apple-specific PWA flags so iOS "Add to Home Screen" launches full-screen
  // with our navy status bar instead of Safari chrome.
  appleWebApp: {
    capable: true,
    title: 'Report Decoded',
    statusBarStyle: 'black-translucent',
  },
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

// Next 16 separates viewport/theme-color into their own export so they're
// emitted as <meta name="viewport"> and <meta name="theme-color"> at the
// document root. The navy theme-color colors the Android status bar to match
// the sticky nav for an app-like feel.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0A1628' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1628' },
  ],
  colorScheme: 'light',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
