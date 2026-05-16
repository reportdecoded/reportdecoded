// app/dashboard/reports/page.js
// Phase 4b: list of reports the signed-in agent has generated.
// Each row links to the branded /results view + has a copy-share-link button.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServer } from '@/lib/auth-server';
import { getServiceSupabase } from '@/lib/supabase';
import { STYLES } from '@/components/ReportDecoded';
import SignOutButton from '../SignOutButton';
import { countAgentReportsLast30Days, STARTER_INCLUDED_REPORTS } from '@/lib/usage';
import CopyShareButton from './CopyShareButton';

export const metadata = {
  title: 'Your client reports — Report Decoded',
  robots: { index: false, follow: false },
};

const ACTIVE_STATUSES = new Set(['active', 'trialing']);

export default async function DashboardReportsPage({ searchParams }) {
  const params = await searchParams;
  const justCreated = params?.new;
  const overageBanner = params?.overage === '1';

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/signin?next=/dashboard/reports');
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
    redirect('/dashboard?subscribe_required=1');
  }

  // Pull this agent's reports, newest first.
  const { data: reports = [] } = await admin
    .from('reports')
    .select('id, created_at, status, property_address, buyer_email, result_json, report_type, purchase_intent, purchase_price, failure_reason')
    .eq('agent_id', agent.id)
    .order('created_at', { ascending: false })
    .limit(100);

  const countInWindow = await countAgentReportsLast30Days(agent.id);
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

      <main style={{ maxWidth: 960, margin: '40px auto', padding: '0 24px' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}>
          ← Back to dashboard
        </Link>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 34, marginBottom: 6 }}>
              Your client reports
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              {agent.subscription_tier === 'starter'
                ? `${countInWindow} of ${STARTER_INCLUDED_REPORTS} reports used in the past 30 days`
                : `${countInWindow} report${countInWindow === 1 ? '' : 's'} in the past 30 days · unlimited`}
            </p>
          </div>
          <Link
            href="/dashboard/upload"
            style={{
              background: 'var(--amber)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            + New report
          </Link>
        </div>

        {justCreated && (
          <div
            style={{
              marginTop: 18,
              background: 'var(--teal-light)',
              border: '1px solid var(--teal-border)',
              color: 'var(--teal)',
              padding: '14px 18px',
              borderRadius: 10,
              fontWeight: 600,
            }}
          >
            ✅ Report uploaded. Claude is analysing it now — refresh in ~60 seconds.
            {overageBanner && (
              <div style={{ marginTop: 6, fontWeight: 400, fontSize: 13, color: 'var(--text)' }}>
                Heads up: this one's over your monthly allowance, so $15 will be added to
                your next invoice.
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          {reports.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reports.map((r) => (
                <ReportRow key={r.id} report={r} agentId={agent.id} highlighted={r.id === justCreated} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Sample report ID rendered live on production — same one linked from the
// homepage hero + agent welcome email. Lets a brand-new agent preview the
// output before they upload a real client PDF for the first time.
const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';

function EmptyState() {
  const steps = [
    {
      n: 1,
      t: 'Upload an inspection PDF',
      d: 'Drag in any AS4349.1 building / pest report — your subscription covers the analysis. Most PDFs process in 60–120 seconds.',
    },
    {
      n: 2,
      t: 'We extract everything that matters',
      d: 'Verdict (PROCEED / NEGOTIATE / WALK AWAY), every defect with cost ranges, suggested negotiation amount, local tradies, 5-year capex forecast.',
    },
    {
      n: 3,
      t: 'Share the branded report with your client',
      d: 'One link or branded PDF, carrying your logo + accent colour. They can open it on their phone the same day.',
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '36px 30px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 38, marginBottom: 10, lineHeight: 1 }} aria-hidden="true">📋</div>
        <h2
          style={{
            fontFamily: "'Fraunces',serif",
            fontSize: 26,
            margin: '0 0 8px',
            color: 'var(--text)',
          }}
        >
          Your client reports will appear here.
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
          Once you upload an inspection PDF, every report you run — with its sharing link
          and branded PDF — shows up on this page.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        {steps.map((s) => (
          <div
            key={s.n}
            style={{
              display: 'flex',
              gap: 14,
              padding: '14px 16px',
              background: 'var(--cream2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--amber)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {s.n}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, color: 'var(--text)' }}>{s.t}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        <Link
          href="/dashboard/upload"
          style={{
            background: 'var(--amber)',
            color: '#fff',
            padding: '12px 22px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Upload your first report →
        </Link>
        <Link
          href={`/results?reportId=${SAMPLE_REPORT_ID}&sample=1`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--muted)',
            padding: '12px 16px',
            fontWeight: 600,
            fontSize: 13,
            textDecoration: 'none',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}
        >
          See a sample report
        </Link>
      </div>

      <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
        Want your logo + accent colour on every report?{' '}
        <Link href="/dashboard#brand-settings" style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>
          Set your branding →
        </Link>
      </div>
    </div>
  );
}

function ReportRow({ report, agentId, highlighted }) {
  const verdict = report.result_json?.overall_verdict;
  const verdictMeta = verdictDisplay(verdict, report.status);
  const address =
    report.property_address ||
    report.result_json?.property_address ||
    'Address not detected';
  const created = new Date(report.created_at).toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  const shareUrl = `/results?reportId=${report.id}&agent=${agentId}`;

  // For failed rows, build a retry URL that pre-fills the upload form
  // with the same metadata. The agent only needs to re-attach the PDF.
  const retryUrl = report.status === 'failed'
    ? `/dashboard/upload?retryFor=${report.id}` +
      `&addr=${encodeURIComponent(report.property_address || '')}` +
      `&intent=${encodeURIComponent(report.purchase_intent || 'home')}` +
      `&type=${encodeURIComponent(report.report_type || 'pre_purchase')}` +
      (report.buyer_email ? `&email=${encodeURIComponent(report.buyer_email)}` : '') +
      (report.purchase_price ? `&price=${encodeURIComponent(report.purchase_price)}` : '')
    : null;

  return (
    <div className={`rd-report-row${highlighted ? ' highlighted' : ''}`}>
      <div className="rd-report-main">
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {address}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 12 }}>
          {created} · {reportTypeLabel(report.report_type)}
          {report.buyer_email && ` · ${report.buyer_email}`}
        </div>
        {report.status === 'failed' && report.failure_reason && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: 'var(--red)',
              lineHeight: 1.45,
              maxWidth: 560,
            }}
          >
            <strong>Why it failed:</strong>{' '}
            {report.failure_reason.length > 180
              ? report.failure_reason.slice(0, 180) + '…'
              : report.failure_reason}
          </div>
        )}
      </div>
      <div className="rd-report-actions">
        <span
          style={{
            background: verdictMeta.bg,
            color: verdictMeta.fg,
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          {verdictMeta.label}
        </span>
        {report.status === 'complete' ? (
          <>
            <Link
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--amber)', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              View →
            </Link>
            <CopyShareButton shareUrl={shareUrl} />
          </>
        ) : retryUrl ? (
          <Link
            href={retryUrl}
            style={{
              color: 'var(--amber)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Try again →
          </Link>
        ) : (
          <span style={{ color: 'var(--subtle)', fontSize: 12 }}>—</span>
        )}
      </div>
    </div>
  );
}

function verdictDisplay(verdict, status) {
  if (status === 'failed') {
    return { label: 'FAILED', bg: 'var(--red-bg)', fg: 'var(--red)' };
  }
  if (status !== 'complete') {
    return { label: 'PROCESSING', bg: 'var(--cream2)', fg: 'var(--muted)' };
  }
  if (verdict === 'PROCEED') {
    return { label: 'PROCEED', bg: 'var(--teal-light)', fg: 'var(--teal)' };
  }
  if (verdict === 'NEGOTIATE') {
    return { label: 'NEGOTIATE', bg: 'var(--gold-bg)', fg: 'var(--gold)' };
  }
  if (verdict === 'WALK_AWAY') {
    return { label: 'WALK AWAY', bg: 'var(--red-bg)', fg: 'var(--red)' };
  }
  return { label: 'COMPLETE', bg: 'var(--cream2)', fg: 'var(--muted)' };
}

function reportTypeLabel(t) {
  return t === 'new_build_handover' ? 'New build handover' : 'Pre-purchase';
}
