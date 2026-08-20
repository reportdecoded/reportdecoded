import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { DM_Sans, Inter, DM_Mono } from 'next/font/google';
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import GoogleTagManager from '@/components/GoogleTagManager';
import AffiliateTracker from '@/components/AffiliateTracker';
import {
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
  JsonLd,
} from '@/lib/schema';

// Self-hosted Google Fonts via next/font — replaces the render-blocking
// @import chain (HTML → component <style> → googleapis CSS → gstatic
// font files) that pushed mobile FCP to ~4.3s. next/font inlines the
// @font-face rules at build time, serves the .woff2 from our own
// origin, and generates a size-adjusted system fallback so text paints
// immediately. Each exposes a CSS variable consumed by STYLES et al.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
// Linear-informed test (Aug 2026): headlines swapped Fraunces -> Inter to
// evaluate the Linear "precision instrument" feel. Kept the --font-serif
// variable name so every heading switches without touching components.
// To restore the editorial serif identity, revert this block to Fraunces.
const inter = Inter({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Report Decoded — Building Inspection Reports, Decoded | Australia',
  description: 'Upload your building inspection PDF — get a plain-English verdict, repair cost estimates, and exactly how much to negotiate. Results in 2 minutes. From $59.',
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
      'Upload your Australian building and pest inspection PDF. Get a plain-English verdict, repair cost estimates, and exactly how much to negotiate — in under 2 minutes.',
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
  // Site-ownership verification meta tags.
  // - Google Search Console: verified via DNS (no meta tag needed)
  // - Bing Webmaster Tools: meta-tag method (GSC-import API path failed
  //   during the May 2026 launch admin sprint; we fell back to manual
  //   verification, which only needs this meta tag in <head>).
  verification: {
    other: {
      'msvalidate.01': 'C249E57F4650E3A6C0744BFC0235FA54',
    },
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
    <html lang="en-AU" className={`${dmSans.variable} ${inter.variable} ${dmMono.variable}`}>
      <head>
        {/* JSON-LD structured data — site-wide schemas.
            Organization gives Google our knowledge-panel data + logo.
            WebSite enables the sitelinks-search-box rich result.
            SoftwareApplication (WebApplication) marks us as a SaaS
            tool with pricing tiers so Google can show pricing + offer
            data in rich results.
            Per-page schemas (FAQPage, BreadcrumbList, Service) are
            injected on individual pages. */}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <JsonLd data={softwareApplicationSchema()} />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <MetaPixel />
        <GoogleAnalytics />
        <GoogleTagManager />
        <AffiliateTracker />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
