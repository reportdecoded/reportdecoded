// Route-segment metadata for /signin. The page itself is 'use client'
// for form state + Supabase browser client. Robots: noindex because
// sign-in pages provide no organic-search value and shouldn't compete
// with marketing pages for crawl budget.

export const metadata = {
  title: 'Sign In — Report Decoded',
  description:
    'Sign in to your Report Decoded agent dashboard to manage subscriptions, view client reports, and configure branding.',
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/signin',
  },
  robots: { index: false, follow: true },
};

export default function SignInLayout({ children }) {
  return children;
}
