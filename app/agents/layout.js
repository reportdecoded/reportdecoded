// Route-segment metadata for /agents (the agent-facing landing /
// signup page). Page itself is 'use client' for pricing-card state.

export const metadata = {
  title: "For Buyer's Agents & Sales Agents — Report Decoded",
  description:
    "Report Decoded helps Australian buyer's and sales agents deliver instant, plain-English analyses of their clients' building inspection reports — branded with your logo and accent colour.",
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/agents',
  },
  openGraph: {
    title: "Report Decoded for Buyer's Agents",
    description:
      "Branded, plain-English building inspection report analyses for your clients in under 2 minutes. Subscription plans from $79/mo.",
    url: 'https://www.reportdecoded.com.au/agents',
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'website',
  },
  keywords: [
    "buyer's agent tools",
    'sales agent tools',
    'building inspection report analysis',
    'white-label inspection report',
    'AS4349.1 analysis Australia',
  ],
};

export default function AgentsLayout({ children }) {
  return children;
}
