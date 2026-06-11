import Link from 'next/link';
import { STYLES } from '@/components/ReportDecoded';

export const metadata = {
  title: 'Privacy Policy — Report Decoded',
  description: 'How Report Decoded collects, uses, and stores your personal data when you upload an inspection PDF or manage an agent subscription.',
  alternates: {
    canonical: 'https://www.reportdecoded.com.au/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>
            ← Home
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: '48px auto', padding: '0 24px', color: 'var(--text)', lineHeight: 1.7 }}>
        <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 40, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Last updated: 22 May 2026</p>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>Who we are</h2>
        <p>
          Report Decoded is operated by Morgan Smith (sole trader, Australia). You can
          contact us at <a href="mailto:info@reportdecoded.com.au" style={{ color: 'var(--amber)' }}>info@reportdecoded.com.au</a>.
        </p>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>What we collect</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li>The inspection report PDF you upload.</li>
          <li>The email address you provide for delivery of your analysis.</li>
          <li>The purchase price you enter (optional).</li>
          <li>Property type indicator (pre-purchase vs new-build handover; owner-occupier vs investment).</li>
          <li>Payment information — handled entirely by Stripe; we never see your card details.</li>
        </ul>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>How we use it</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li><strong>Anthropic (Claude AI):</strong> your PDF is sent to Anthropic's Claude API to extract defects and produce the analysis. Anthropic does not train on data submitted via their API.</li>
          <li><strong>HERE Maps:</strong> we send the property address from the report to HERE Maps to geocode it and search for local tradies. HERE Maps does not retain this data beyond the immediate query.</li>
          <li><strong>Stripe:</strong> handles the $59 payment. They store your card and contact details under their own privacy policy.</li>
          <li><strong>UploadThing:</strong> hosts your uploaded PDF temporarily so it can be processed.</li>
          <li><strong>Resend:</strong> sends you the "your report is ready" email.</li>
          <li><strong>Supabase:</strong> stores the analysis output linked to your email so we can deliver and re-show your report.</li>
        </ul>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>Where your data is processed</h2>
        <p>
          Several of the services we use to deliver your analysis are based outside
          Australia. By using Report Decoded you consent to your personal data being
          transferred to and processed in the following countries:
        </p>
        <ul style={{ paddingLeft: 24 }}>
          <li>
            <strong>United States:</strong> Anthropic (Claude AI inference), Stripe
            (payment processing), Resend (transactional email delivery), Vercel
            (web hosting + serverless functions).
          </li>
          <li>
            <strong>Singapore:</strong> UploadThing (where your uploaded inspection
            PDF is temporarily stored for processing) and Supabase (where your
            analysis result is stored so we can deliver and re-show your report).
          </li>
        </ul>
        <p>
          Each of these providers is contractually required under their service
          agreements with us to protect your data to standards equivalent to the
          Australian Privacy Principles. Both the United States and Singapore have
          mature data-protection frameworks. We do not sell, lease, or otherwise
          transfer your data to any third party for marketing purposes.
        </p>
        <p>
          If you would prefer your data not be transferred outside Australia, you
          should not use this service — the analysis cannot be performed without
          sending the inspection PDF to Anthropic for AI processing.
        </p>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>How long we keep it</h2>
        <p>
          We currently retain reports indefinitely so you can revisit them. You can request
          deletion of your data at any time by emailing{' '}
          <a href="mailto:info@reportdecoded.com.au" style={{ color: 'var(--amber)' }}>
            info@reportdecoded.com.au
          </a>
          . We aim to introduce automatic deletion after 30 days in a future update.
        </p>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>Your rights</h2>
        <p>
          Under the Australian Privacy Act 1988 you have the right to access, correct, or
          request deletion of personal information we hold about you. Email us at the
          address above and we'll action your request within 30 days.
        </p>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>Tradie listings</h2>
        <p>
          The tradesperson suggestions shown in your report are sourced from public business
          listings via HERE Maps and are not endorsed or verified by Report Decoded. Always
          verify a tradesperson's licence and insurance before engaging them.
        </p>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>Cookies</h2>
        <p>
          We use only essential cookies required for the site to function (e.g. session
          state during checkout). No advertising or third-party tracking cookies are set.
        </p>

        <h2 style={{ marginTop: 28, marginBottom: 10 }}>Changes</h2>
        <p>
          We may update this policy. The "Last updated" date at the top will reflect any
          changes. Material changes will be communicated by email where we have your address.
        </p>

        <p style={{ marginTop: 48, color: 'var(--muted)', fontSize: 13 }}>
          This page is a plain-English starter and not a substitute for advice from an
          Australian privacy lawyer. We will refine it as the product evolves.
        </p>
      </main>
    </>
  );
}
