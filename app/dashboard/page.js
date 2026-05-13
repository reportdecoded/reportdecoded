// app/dashboard/page.js
// Protected agent dashboard. Server-rendered.
// Redirects to /signin if not authenticated.
// For now: shows a welcome card. Real features land in Phase 3.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/auth-server';
import { getServiceSupabase } from '@/lib/supabase';
import { STYLES } from '@/components/ReportDecoded';
import SignOutButton from './SignOutButton';

export const metadata = {
  title: 'Dashboard — Report Decoded',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin?next=/dashboard');
  }

  // Look up the agent profile by email (Phase 1 leads not yet linked by
  // auth_user_id). Service-role client bypasses RLS for this server-side read.
  const admin = getServiceSupabase();
  const { data: agent } = await admin
    .from('agents')
    .select('full_name, business_name, role, tier_interest, status')
    .ilike('email', user.email)
    .maybeSingle();

  const displayName = agent?.full_name || user.email?.split('@')[0] || 'there';
  const firstName = displayName.split(/\s+/)[0];

  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" style={{ height: 36 }} />
        </Link>
        <div className="nav-links">
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginRight: 12 }}>
            {user.email}
          </span>
          <SignOutButton />
        </div>
      </nav>

      <main style={{ maxWidth: 880, margin: '48px auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 38, marginBottom: 6 }}>
          Welcome back, {firstName}.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32 }}>
          {agent
            ? `${agent.business_name ? agent.business_name + ' · ' : ''}${roleLabel(agent.role)}${agent.tier_interest ? ' · interested in ' + tierLabel(agent.tier_interest) : ''}`
            : "You're signed in. Your account is being set up — Morgan will be in touch shortly to finish onboarding."}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          <DashboardCard
            title="📋 Your reports"
            body="When you generate an analysis for a client, it'll appear here with their address and verdict — searchable and shareable."
            ctaText="Coming in Phase 3"
            ctaHref={null}
          />
          <DashboardCard
            title="🎨 White-label"
            body="Upload your agency logo and we'll brand every PDF report we generate for your clients."
            ctaText="Coming in Phase 3"
            ctaHref={null}
          />
          <DashboardCard
            title="💳 Subscription"
            body={
              agent?.status === 'active'
                ? 'Manage your subscription, billing, and team accounts.'
                : 'Your sub is being set up manually. Morgan will email you a Stripe link.'
            }
            ctaText="Coming in Phase 3"
            ctaHref={null}
          />
          <DashboardCard
            title="📤 Upload a report"
            body="Until self-serve white-label lands you can run client reports through the standard buyer flow. We'll re-link them to your dashboard once you're set up."
            ctaText="Open buyer upload →"
            ctaHref="/"
          />
        </div>

        <div
          style={{
            marginTop: 40,
            padding: '20px 24px',
            background: 'var(--cream2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--text)' }}>Early-access agent.</strong> Your
          dashboard is intentionally bare while we finish Phase 3 (Stripe Subscriptions,
          white-label, report history). Email{' '}
          <a href="mailto:info@reportdecoded.com.au" style={{ color: 'var(--amber)' }}>
            info@reportdecoded.com.au
          </a>
          {' '}any time — Morgan answers personally.
        </div>
      </main>
    </>
  );
}

function DashboardCard({ title, body, ctaText, ctaHref }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '20px 22px',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{title}</div>
      <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
        {body}
      </div>
      {ctaHref ? (
        <Link href={ctaHref} style={{ color: 'var(--amber)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          {ctaText}
        </Link>
      ) : (
        <span style={{ color: 'var(--subtle)', fontSize: 12, fontStyle: 'italic' }}>{ctaText}</span>
      )}
    </div>
  );
}

function roleLabel(r) {
  return r === 'buyer_agent' ? "Buyer's Agent" : r === 'sales_agent' ? 'Sales Agent' : 'Other';
}
function tierLabel(t) {
  return ({ starter: 'Starter', pro: 'Pro', agency: 'Agency', exploring: 'no tier yet' })[t] || t;
}
