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
import SetPasswordCard from './SetPasswordCard';

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

  // Lightweight count to detect first-run state. Used for the zero-state
  // onboarding banner — cheaper than fetching the full reports list when
  // we only care whether there are any. count='exact', head=true asks
  // PostgREST for the count header without payload.
  let reportCount = 0;
  if (hasActiveSub) {
    const { count } = await admin
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('agent_id', agent.id);
    reportCount = count || 0;
  }
  const isFirstRun = hasActiveSub && reportCount === 0;

  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav" style={agent.accent_color ? { '--amber': agent.accent_color, '--amber-hover': agent.accent_color } : undefined}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          {agent.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={agent.logo_url} alt={agent.business_name || 'Your agency'} style={{ height: 36, maxWidth: 180, objectFit: 'contain' }} />
          ) : (
            <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
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
              {agent.subscription_status === 'trialing' ? (
                <>
                  🎁 You're in! Your first report is on us — billing starts when you complete your first analysis.
                </>
              ) : (
                <>✅ Subscription active. Welcome to Report Decoded — let's go.</>
              )}
            </div>
          </>
        )}

        {/* Persistent trial banner (not just on the post-Checkout
            return). Shows for any agent whose subscription is in
            'trialing' status, every time they land on /dashboard.
            Makes the 'first report free' mechanic continuously
            visible so they don't forget what they're getting. Goes
            away the moment their first report completes and the
            webhook flips status to 'active'. */}
        {hasActiveSub && agent.subscription_status === 'trialing' && !justSubscribed && (
          <div
            style={{
              background: 'var(--teal-light)',
              border: '1px solid var(--teal-border)',
              color: 'var(--text)',
              padding: '12px 18px',
              borderRadius: 10,
              marginBottom: 24,
              fontSize: 14,
              lineHeight: 1.55,
            }}
          >
            <strong style={{ color: 'var(--teal)' }}>🎁 Free trial active.</strong>{' '}
            Your first report is on us. Billing starts when you complete your first analysis — no deadline.
          </div>
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
            {isFirstRun && <FirstRunBanner />}
            <ActiveSubscriberView agent={agent} isFirstRun={isFirstRun} />
            <div id="brand-settings" style={{ marginTop: 32, scrollMarginTop: 80 }}>
              <BrandSettings initial={{ logo_url: agent.logo_url, accent_color: agent.accent_color }} />
            </div>
            <SetPasswordCard />
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

function FirstRunBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FEF3E8 0%, #FDE4CC 100%)',
        border: '1px solid #F4C9A0',
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
        🚀 Let's get your first report up
      </div>
      <div style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.55, opacity: 0.85 }}>
        Upload an inspection PDF to see Report Decoded in action — analysis, branded
        client view, and a downloadable PDF in under two minutes. Your subscription
        covers the cost; you can run it on a sample report first if you want to see
        what your client receives.
      </div>
    </div>
  );
}

function ActiveSubscriberView({ agent, isFirstRun = false }) {
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
          title={isFirstRun ? '📤 Run your first report' : '📤 Run a client report'}
          body={
            isFirstRun
              ? "Upload an AS4349.1 inspection PDF — analysis takes 60-120 seconds, then it's ready to share with your client."
              : 'Upload an inspection PDF — your subscription covers the analysis. Your client gets a branded report shareable via one link.'
          }
          ctaText="Upload PDF →"
          ctaHref="/dashboard/upload"
          emphasised={isFirstRun}
        />
        <DashboardCard
          title="📋 Your client reports"
          body={
            isFirstRun
              ? "Once you run a report it'll appear here, ready to share with your client via link or branded PDF."
              : "Every report you've generated, with one-click sharing links pre-branded with your logo + accent colour."
          }
          ctaText={isFirstRun ? 'See how this page works →' : 'View all reports →'}
          ctaHref="/dashboard/reports"
        />
        <DashboardCard
          title="👀 Preview your branding"
          body={
            agent.logo_url
              ? 'See exactly how a client will receive your reports — either the shared web view, or the downloadable PDF, both rendered with your logo + accent colour.'
              : 'Upload your logo below, then preview a sample report rendered with your branding — both the web view and the downloadable PDF.'
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

function DashboardCard({ title, body, ctaText, ctaHref, customCta, emphasised = false }) {
  // Emphasised: used during first-run state to lead the eye to "Upload
  // your first report". Renders the CTA as a filled button instead of a
  // text link, and adds a subtle accent border.
  return (
    <div
      style={{
        background: '#fff',
        border: emphasised ? '1.5px solid var(--amber)' : '1px solid var(--border)',
        borderRadius: 12,
        padding: '20px 22px',
        boxShadow: emphasised ? '0 4px 16px rgba(201,122,58,0.08)' : 'none',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{title}</div>
      <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
        {body}
      </div>
      {customCta ? (
        customCta
      ) : ctaHref ? (
        emphasised ? (
          <Link
            href={ctaHref}
            style={{
              display: 'inline-block',
              background: 'var(--amber)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            {ctaText}
          </Link>
        ) : (
          <Link
            href={ctaHref}
            style={{ color: 'var(--amber)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
          >
            {ctaText}
          </Link>
        )
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
