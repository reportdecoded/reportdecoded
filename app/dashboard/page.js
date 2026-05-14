// app/dashboard/page.js
// Protected agent dashboard. Server-rendered.
//
// States:
//   - not authenticated -> redirect to /signin
//   - authenticated but no agents row -> redirect to /agents (must complete profile first)
//   - authenticated + agent row + no active subscription -> show pricing CTAs
//   - authenticated + active subscription -> show "subscribed" view + manage button

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/auth-server';
import { getServiceSupabase } from '@/lib/supabase';
import { STYLES } from '@/components/ReportDecoded';
import SignOutButton from './SignOutButton';
import SubscribeButtons from './SubscribeButtons';
import ManageBillingButton from './ManageBillingButton';
import BrandSettings from './BrandSettings';
import ShareLinkActions from './ShareLinkActions';
import SubscribedTracker from './SubscribedTracker';

export const metadata = {
  title: 'Dashboard — Report Decoded',
  robots: { index: false, follow: false },
};

const ACTIVE_STATUSES = new Set(['active', 'trialing']);

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const justSubscribed = params?.subscribed === '1';
  const subscribeCancelled = params?.subscribe_cancelled === '1';
  const subscribeRequired = params?.subscribe_required === '1';

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin?next=/dashboard');
  }

  const admin = getServiceSupabase();
  let { data: agent } = await admin
    .from('agents')
    .select('id, full_name, email, phone, business_name, role, tier_interest, status, subscription_status, subscription_tier, stripe_customer_id, stripe_subscription_id, auth_user_id, logo_url, accent_color')
    .ilike('email', user.email)
    .maybeSingle();

  // No agent row — they signed in without going through the /agents form.
  // Send them there to complete their profile before they can subscribe.
  if (!agent) {
    redirect('/agents?need_profile=1');
  }

  // Link the auth user to this agent row on first sign-in (one-time).
  if (!agent.auth_user_id) {
    await admin.from('agents').update({ auth_user_id: user.id }).eq('id', agent.id);
    agent = { ...agent, auth_user_id: user.id };
  }

  const hasActiveSub = ACTIVE_STATUSES.has(agent.subscription_status);
  const firstName =
    (agent.full_name || user.email?.split('@')[0] || 'there').split(/\s+/)[0];

  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav" style={agent.accent_color ? { '--amber': agent.accent_color, '--amber-hover': agent.accent_color } : undefined}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          {agent.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agent.logo_url} alt={agent.business_name || 'Your agency'} style={{ height: 36, maxWidth: 180, objectFit: 'contain' }} />
          ) : (
            <img src="/logo-dark.png" alt="Report Decoded" style={{ height: 36 }} />
          )}
        </Link>
        <div className="nav-links">
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginRight: 12 }}>
            {user.email}
          </span>
          <SignOutButton />
        </div>
      </nav>

      <main style={{ maxWidth: 880, margin: '40px auto', padding: '0 24px' }}>
        {justSubscribed && (
          <>
            <SubscribedTracker tier={agent.subscription_tier} />
            <div
              style={{
                background: 'var(--teal-light)',
                border: '1px solid var(--teal-border)',
                color: 'var(--teal)',
                padding: '14px 18px',
                borderRadius: 10,
                marginBottom: 24,
                fontWeight: 600,
              }}
            >
              ✅ Subscription active. Welcome to Report Decoded — let's go.
            </div>
          </>
        )}
        {subscribeCancelled && (
          <div
            style={{
              background: 'var(--gold-bg)',
              border: '1px solid var(--gold-border)',
              color: 'var(--gold)',
              padding: '14px 18px',
              borderRadius: 10,
              marginBottom: 24,
            }}
          >
            Subscription cancelled before payment. No worries — choose a plan below when you're ready.
          </div>
        )}
        {subscribeRequired && !hasActiveSub && (
          <div
            style={{
              background: 'var(--gold-bg)',
              border: '1px solid var(--gold-border)',
              color: 'var(--gold)',
              padding: '14px 18px',
              borderRadius: 10,
              marginBottom: 24,
            }}
          >
            Pick a plan below to start uploading client reports.
          </div>
        )}

        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 38, marginBottom: 6 }}>
          Welcome back, {firstName}.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32 }}>
          {agent.business_name ? agent.business_name + ' · ' : ''}
          {roleLabel(agent.role)}
          {hasActiveSub && agent.subscription_tier
            ? ` · ${tierLabel(agent.subscription_tier)} (${agent.subscription_status})`
            : ' · No active subscription'}
        </p>

        {hasActiveSub ? (
          <>
            <ActiveSubscriberView agent={agent} />
            <div id="brand-settings" style={{ marginTop: 32, scrollMarginTop: 80 }}>
              <BrandSettings initial={{ logo_url: agent.logo_url, accent_color: agent.accent_color }} />
            </div>
          </>
        ) : (
          <PricingView agent={agent} />
        )}

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
          <strong style={{ color: 'var(--text)' }}>Early-access agent.</strong> Email{' '}
          <a href="mailto:info@reportdecoded.com.au" style={{ color: 'var(--amber)' }}>
            info@reportdecoded.com.au
          </a>
          {' '}any time — Morgan answers personally.
        </div>
      </main>
    </>
  );
}

function ActiveSubscriberView({ agent }) {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        <DashboardCard
          title="📤 Run a client report"
          body="Upload an inspection PDF — your subscription covers the analysis. Your client gets a branded report shareable via one link."
          ctaText="Upload PDF →"
          ctaHref="/dashboard/upload"
        />
        <DashboardCard
          title="📋 Your client reports"
          body="Every report you've generated, with one-click sharing links pre-branded with your logo + accent colour."
          ctaText="View all reports →"
          ctaHref="/dashboard/reports"
        />
        <DashboardCard
          title="👀 Preview your branding"
          body={
            agent.logo_url
              ? "See how a sample client report renders with your logo and accent colour applied."
              : "Once you upload your logo below, click here to see how a client report will look — your logo at the top, your accent colour on every button."
          }
          customCta={
            <ShareLinkActions
              agentId={agent.id}
              hasBranding={!!(agent.logo_url || agent.accent_color)}
            />
          }
        />
        <DashboardCard
          title="💳 Billing"
          body={`You're on ${tierLabel(agent.subscription_tier)}. Update card, swap tier, or cancel via Stripe's secure portal.`}
          customCta={<ManageBillingButton />}
        />
      </div>
    </>
  );
}

function PricingView({ agent }) {
  return (
    <>
      <div
        style={{
          background: 'var(--cream2)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 22px',
          marginBottom: 28,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
          📝 Profile saved — pick a plan to activate your account
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
          You're signed in as <strong>{agent.email}</strong>. Choose a tier below and
          you'll be subscribed instantly via Stripe (test mode — no real card needed).
          Cancel any time.
        </div>
      </div>

      <SubscribeButtons />
    </>
  );
}

function DashboardCard({ title, body, ctaText, ctaHref, customCta }) {
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
      {customCta ? (
        customCta
      ) : ctaHref ? (
        <Link
          href={ctaHref}
          style={{ color: 'var(--amber)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
        >
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
  return ({ starter: 'Starter', pro: 'Pro', agency: 'Agency' })[t] || t || 'Free';
}
