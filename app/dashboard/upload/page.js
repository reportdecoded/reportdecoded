// app/dashboard/upload/page.js
// Phase 4b: the agent's in-dashboard PDF upload page.
// Server component gate -> only authenticated, active subscribers see the form.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/auth-server';
import { getServiceSupabase } from '@/lib/supabase';
import { STYLES } from '@/components/ReportDecoded';
import SignOutButton from '../SignOutButton';
import UploadForm from './UploadForm';

export const metadata = {
  title: 'Upload a client report â€” Report Decoded',
  robots: { index: false, follow: false },
};

const ACTIVE_STATUSES = new Set(['active', 'trialing']);

export default async function DashboardUploadPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/signin?next=/dashboard/upload');
  }

  const admin = getServiceSupabase();
  const { data: agent } = await admin
    .from('agents')
    .select('id, business_name, logo_url, accent_color, subscription_status, subscription_tier')
    .ilike('email', user.email)
    .maybeSingle();

  if (!agent) {
    redirect('/agents?need_profile=1');
  }
  if (!ACTIVE_STATUSES.has(agent.subscription_status)) {
    // No active subscription -> back to dashboard pricing view.
    redirect('/dashboard?subscribe_required=1');
  }

  const accentStyle = agent.accent_color
    ? { '--amber': agent.accent_color, '--amber-hover': agent.accent_color }
    : undefined;

  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav" style={accentStyle}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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

      <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px' }}>
        <Link
          href="/dashboard"
          style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}
        >
          â† Back to dashboard
        </Link>

        <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 34, marginTop: 12, marginBottom: 6 }}>
          Upload a client report
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
          Your subscription covers the analysis â€” no per-report charge.
          {agent.subscription_tier === 'starter' && (
            <>
              {' '}You're on Starter: 12 reports per month, then $15 per extra report.
            </>
          )}
        </p>

        <UploadForm tier={agent.subscription_tier} accentColor={agent.accent_color} />
      </main>
    </>
  );
}
