'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';
import { topTradesForDefect, tradeByKey, googleMapsSearchUrl, filterTradiesByInferredTrades } from '@/lib/trades';

const LOAD_STEPS = [
  'Reading inspection report…',
  'Identifying major defects (AS4349.1)…',
  'Classifying minor defects…',
  'Assessing pest and termite findings…',
  'Estimating repair costs (AU rates)…',
  'Checking state rental compliance…',
  'Generating negotiation position…',
  'Drafting conveyancer questions…',
  'Building your report…',
];

function ResultsBody() {
  const params = useSearchParams();
  const reportId = params.get('reportId');
  const isSample = params.get('sample') === '1';
  const agentId = params.get('agent');
  const stripeSessionId = params.get('session_id');

  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loadStep, setLoadStep] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState(false);
  const [brand, setBrand] = useState(null); // { business_name, logo_url, accent_color }
  const [trackedView, setTrackedView] = useState(false);

  // Fire 'report_purchased' the moment we arrive from Stripe Checkout success.
  // This is the funnel event most ad campaigns will optimise against.
  useEffect(() => {
    if (stripeSessionId) {
      track('report_purchased', { source: isSample ? 'sample' : 'buyer_flow' });
    } else if (isSample) {
      track('sample_viewed', { source: agentId ? 'branded' : 'public' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fire 'report_viewed' once the analysis is complete and rendered.
  useEffect(() => {
    if (!trackedView && report?.status === 'complete') {
      track('report_viewed', {
        verdict: report.analysis?.overall_verdict || 'UNKNOWN',
        is_branded: !!agentId,
      });
      setTrackedView(true);
    }
  }, [report, trackedView, agentId]);

  // Fetch agent branding if ?agent= is in the URL (white-label share link)
  useEffect(() => {
    if (!agentId) return;
    let cancelled = false;
    fetch(`/api/agent-brand?id=${encodeURIComponent(agentId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && (data.logo_url || data.accent_color)) {
          setBrand(data);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [agentId]);

  // Poll /api/report-status until complete or failed.
  useEffect(() => {
    if (!reportId) return;
    let cancelled = false;
    let timeoutId;

    async function poll() {
      try {
        const res = await fetch(`/api/report-status?reportId=${reportId}`);
        if (cancelled) return;
        if (!res.ok) {
          setError(`Couldn't load this report (HTTP ${res.status}).`);
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setReport(data);
        if (data.status === 'complete' || data.status === 'failed') return;
        timeoutId = setTimeout(poll, 3000);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Network error');
      }
    }
    poll();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [reportId]);

  // Animate the load steps while waiting.
  useEffect(() => {
    if (report?.status === 'complete' || report?.status === 'failed') return;
    if (loadStep >= LOAD_STEPS.length - 1) return;
    const t = setTimeout(() => setLoadStep((s) => s + 1), 4500);
    return () => clearTimeout(t);
  }, [loadStep, report?.status]);

  const toggle = (k) => setExpanded((e) => ({ ...e, [k]: !e[k] }));

  return (
    <>
      <style>{STYLES}</style>

      {/* When viewed via an agent's share link, override the amber accent. */}
      {brand?.accent_color && (
        <style>{`:root { --amber: ${brand.accent_color}; --amber-hover: ${brand.accent_color}; }`}</style>
      )}

      <nav className="nav">
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          {brand?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logo_url}
              alt={brand.business_name || 'Agency'}
              style={{ height: 36, maxWidth: 200, objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <img
              src="/logo-dark.png"
              alt="Report Decoded"
              style={{ height: 36, width: 'auto', display: 'block' }}
            />
          )}
        </Link>
        <div className="nav-links">
          {brand && (
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginRight: 14, fontStyle: 'italic' }}>
              Analysis by Report Decoded
            </span>
          )}
          {/* Branded view = agent's own dashboard. 'Run another' for an
              agent must go to /dashboard/upload (their unlimited
              subscription flow), NOT to / (the public consumer flow
              which would charge $59 + show a logged-out nav, making it
              look like the agent has been logged out).
              Consumer ($59 one-off) view goes back to / to start fresh. */}
          <Link
            href={brand ? '/dashboard/upload' : '/'}
            className="nav-link"
            style={{ textDecoration: 'none' }}
          >
            {brand ? '↑ Run another' : '← Upload Another'}
          </Link>
        </div>
      </nav>

      {isSample && (
        <div
          style={{
            background: 'var(--amber)',
            color: '#fff',
            padding: '12px 24px',
            textAlign: 'center',
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          📋 <strong>This is a sample report</strong> based on a real Australian inspection
          PDF — not your own analysis.{' '}
          <Link
            href="/"
            style={{ color: '#fff', textDecoration: 'underline', fontWeight: 600 }}
          >
            Upload your own PDF →
          </Link>
        </div>
      )}

      {!reportId && <NoReportId />}
      {reportId && error && <ErrorState message={error} />}
      {reportId && !error && (!report || report.status === 'pending' || report.status === 'processing') && (
        <LoadingState loadStep={loadStep} buyerEmail={report?.buyer_email} createdAt={report?.created_at} />
      )}
      {reportId && !error && report?.status === 'failed' && (
        <FailedState reason={report.failure_reason} />
      )}
      {reportId && !error && report?.status === 'complete' && (
        <>
          <ResultsView
            analysis={report.analysis}
            tradies={report.tradies}
            reportType={report.report_type}
            expanded={expanded}
            toggle={toggle}
            copied={copied}
            setCopied={setCopied}
            reportId={reportId}
            agentId={agentId}
          />
          <FeedbackPrompt reportId={reportId} propertyAddress={report.property_address} />
        </>
      )}

      <footer
        style={{
          background: 'var(--navy)',
          color: 'rgba(255,255,255,0.6)',
          padding: '32px 24px',
          marginTop: 48,
          textAlign: 'center',
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="rd-footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            © 2026 Report Decoded · AI analysis is general information, not professional advice.
          </div>
        </div>
      </footer>
    </>
  );
}

function NoReportId() {
  return (
    <div className="loading-screen">
      <h2 className="loading-h">No report selected.</h2>
      <p className="loading-sub">
        Head back home and upload an inspection report to get started.
      </p>
    </div>
  );
}

/**
 * FeedbackPrompt — appears at the bottom of every completed report.
 * Lets a buyer flag a defect that's miscategorised, a cost that looks
 * off, or a tradie that doesn't match — turning customer frustration
 * into product feedback Morgan can fix in the next release. Pre-fills
 * the email subject with the report ID so each piece of feedback is
 * traceable back to the exact analysis the buyer saw.
 */
function FeedbackPrompt({ reportId, propertyAddress }) {
  const shortId = reportId ? reportId.slice(0, 8) : 'unknown';
  const subject = encodeURIComponent(`Report feedback — ${shortId}`);
  const body = encodeURIComponent(
    `Report ID: ${reportId || '(none)'}\n` +
      `Property: ${propertyAddress || '(none)'}\n` +
      `\n` +
      `What looked wrong:\n` +
      `(e.g. "the kitchen defect was routed to a plumber, should be cabinetmaker", ` +
      `or "the $20K cost estimate for the cracked window seems way too high", ` +
      `or "the tradies returned don't operate in my suburb")\n` +
      `\n` +
      `\n` +
      `Anything else we should know:\n` +
      `\n`,
  );
  const mailto = `mailto:info@reportdecoded.com.au?subject=${subject}&body=${body}`;

  return (
    <section
      style={{
        maxWidth: 760,
        margin: '32px auto 0',
        padding: '20px 24px',
        background: 'var(--cream, #F7F3EE)',
        border: '1px solid rgba(201,122,58,0.22)',
        borderRadius: 12,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: '1 1 320px', minWidth: 240 }}>
        <div style={{ fontWeight: 600, color: 'var(--navy, #0A1628)', fontSize: 15, marginBottom: 4 }}>
          Spot something that looks wrong?
        </div>
        <div style={{ fontSize: 13, color: 'rgba(10,22,40,0.65)', lineHeight: 1.55 }}>
          Wrong trade chip, cost looks off, tradie not in your area — we want to know. Each report
          we hear from gets better the next time someone uploads.
        </div>
      </div>
      <a
        href={mailto}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 18px',
          background: 'var(--navy, #0A1628)',
          color: '#fff',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: 0.2,
          whiteSpace: 'nowrap',
        }}
      >
        Tell us →
      </a>
    </section>
  );
}

function ErrorState({ message }) {
  return (
    <div className="loading-screen">
      <h2 className="loading-h">Something went wrong.</h2>
      <p className="loading-sub">{message}</p>
    </div>
  );
}

// Sanitise failure_reason before showing to buyers — raw API errors
// (e.g. Anthropic JSON with "credit balance is too low") must never
// reach the UI. Map to a friendly buyer-facing string.
function sanitiseFailureReason(reason) {
  if (!reason) return null;
  // If it looks like JSON or contains internal API language, suppress it.
  if (
    reason.startsWith('{') ||
    reason.startsWith('[') ||
    reason.toLowerCase().includes('credit balance') ||
    reason.toLowerCase().includes('api key') ||
    reason.toLowerCase().includes('invalid_request_error') ||
    reason.toLowerCase().includes('anthropic') ||
    reason.toLowerCase().includes('http 4') ||
    reason.toLowerCase().includes('http 5')
  ) {
    return null; // fall through to default message below
  }
  return reason;
}

function FailedState({ reason }) {
  const safeReason = sanitiseFailureReason(reason);
  return (
    <div className="loading-screen">
      <h2 className="loading-h">We couldn't analyse this report.</h2>
      <p className="loading-sub">
        {safeReason ||
          'Something went wrong on our end. If you were charged, a full refund will be processed — reply to your Stripe receipt or email info@reportdecoded.com.au and we\'ll sort it within an hour.'}
      </p>
    </div>
  );
}

function LoadingState({ loadStep, buyerEmail, createdAt }) {
  // Track wall-clock since the report was created so we can reassure
  // the buyer when analysis runs longer than the 1–2 min headline
  // estimate (large PDFs or busy times → 3–4 min is normal).
  //
  // Why this exists: on Jun 5 2026 a buyer paid $59 with his work
  // email, waited ~5 min without seeing the analysis email (work mail
  // server quarantined the new-sender transactional email), assumed
  // the upload had failed, and re-uploaded the SAME PDF with his
  // personal Gmail → got charged $59 a second time. The fix has two
  // sides: (1) show the buyer email on screen so a typo is caught
  // before payment fails to land, (2) reassure during the longer
  // tail of the analysis so they don't bail and re-pay.
  const [extendedWait, setExtendedWait] = useState(false);
  useEffect(() => {
    if (!createdAt) return;
    const ageMs = Date.now() - new Date(createdAt).getTime();
    if (ageMs > 180_000) {
      // Already 3+ min in (e.g. user closed and re-opened the tab).
      setExtendedWait(true);
      return;
    }
    const remaining = Math.max(0, 180_000 - ageMs);
    const t = setTimeout(() => setExtendedWait(true), remaining);
    return () => clearTimeout(t);
  }, [createdAt]);

  return (
    <div className="loading-screen">
      <div className="loading-ring">
        <div className="loading-ring-outer" />
        <div className="loading-ring-inner" />
      </div>
      <h2 className="loading-h">Analysing your report…</h2>
      <p className="loading-sub">This usually takes 2–4 minutes. You can close this tab — we&apos;ll email it.</p>

      {/* Where we're sending it. The single most important piece of
          information during the wait — confirms the email is correct
          (catches typos before the buyer assumes delivery failed) and
          gives a clear recovery path that isn't "pay again with a
          different email". */}
      {buyerEmail && (
        <div
          style={{
            maxWidth: 520,
            margin: '24px auto 0',
            padding: '14px 18px',
            background: 'var(--cream2, #F0E9DE)',
            border: '1px solid var(--border, rgba(10,22,40,0.12))',
            borderRadius: 10,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: 'var(--navy, #0A1628)',
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            📧 We&apos;ll email your report to:
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14,
              color: 'var(--navy, #0A1628)',
              fontWeight: 600,
              marginBottom: 8,
              wordBreak: 'break-all',
            }}
          >
            {buyerEmail}
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(10,22,40,0.65)' }}>
            Wrong email or doesn&apos;t arrive in 10 minutes? Reply to your Stripe
            receipt or email <a href="mailto:info@reportdecoded.com.au" style={{ color: 'var(--amber, #C97A3A)', textDecoration: 'underline' }}>info@reportdecoded.com.au</a>{' '}
            with your report ID and we&apos;ll resend within an hour —{' '}
            <strong>please don&apos;t re-upload</strong>, you&apos;ll be charged again.
          </div>
        </div>
      )}

      <div className="loading-steps">
        {LOAD_STEPS.map((s, i) => (
          <div
            key={i}
            className={`lstep ${i < loadStep ? 'done' : i === loadStep ? 'active' : 'wait'}`}
          >
            <div className="lstep-icon">
              {i < loadStep ? '✓' : i === loadStep ? '›' : '·'}
            </div>
            {s}
          </div>
        ))}
      </div>

      {/* After 3 minutes — when the step animation has long finished
          and the buyer is staring at a static spinner — drop in a
          reassuring note so they don't bail and re-pay. */}
      {extendedWait && (
        <p
          style={{
            maxWidth: 520,
            margin: '20px auto 0',
            fontSize: 13,
            lineHeight: 1.55,
            color: 'rgba(10,22,40,0.6)',
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          Still working — large PDFs sometimes take 3–4 minutes. Your report is
          safe and will be emailed when ready. No need to refresh or re-upload.
        </p>
      )}
    </div>
  );
}

// VerdictBadge accepts an optional reportType so we can show
// rectification-appropriate language for new build handovers — there's
// no "negotiate" or "walk away" when the buyer is already in contract;
// they need to "rectify" defects or "escalate" to the VBA.
function VerdictBadge({ verdict, reportType }) {
  const isHandover = reportType === 'new_build_handover';
  if (verdict === 'PROCEED')
    return (
      <div className="verdict-left">
        <span className="verdict-emoji">✅</span>
        <div className="verdict-badge">{isHandover ? 'Ready for Sign-off' : 'Proceed'}</div>
      </div>
    );
  if (verdict === 'WALK AWAY')
    return (
      <div className="verdict-left">
        <span className="verdict-emoji">🛑</span>
        <div className="verdict-badge">{isHandover ? 'Escalate' : 'Walk Away'}</div>
      </div>
    );
  return (
    <div className="verdict-left">
      <span className="verdict-emoji">⚖️</span>
      <div className="verdict-badge">{isHandover ? 'Rectify' : 'Negotiate'}</div>
    </div>
  );
}

function verdictCardClass(verdict) {
  if (verdict === 'PROCEED') return 'verdict-card proceed';
  if (verdict === 'WALK AWAY') return 'verdict-card walk';
  return 'verdict-card negotiate';
}

function fmt$(n) {
  if (n == null || isNaN(n)) return '—';
  return `$${Number(n).toLocaleString('en-AU')}`;
}

function tradieInitials(name) {
  return (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('');
}

function formatDistance(meters) {
  if (typeof meters !== 'number' || !isFinite(meters)) return null;
  if (meters < 1000) return `${Math.round(meters)} m away`;
  return `${(meters / 1000).toFixed(1)} km away`;
}

function TradieCard({ tradie, suburb }) {
  // Compose Google search query: business name + suburb when available.
  // Disambiguates generic names ('Matrix Bathrooms', 'Plumb Point') so
  // results land on the local branch rather than a Sydney/Brisbane one.
  const searchQuery = suburb ? `${tradie.name} ${suburb}` : tradie.name;
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  const dist = formatDistance(tradie.distance_m);
  return (
    <div className="tradie-card">
      <div className="tradie-top">
        <div className="tradie-avatar">{tradieInitials(tradie.business_name)}</div>
        <div>
          <div className="tradie-name">{tradie.business_name}</div>
          {dist && (
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>
              {dist}
            </div>
          )}
        </div>
      </div>
      {tradie.address && (
        <div className="tradie-meta">
          <span className="tradie-tag">📍 {tradie.address}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {tradie.phone && (
          <a
            href={`tel:${tradie.phone.replace(/\s+/g, '')}`}
            className="tradie-quote-btn"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            📞 {tradie.phone}
          </a>
        )}
        {/* Replaced direct 'Visit website' (using HERE's stored URL,
            which goes stale: businesses change domains, servers move,
            registrations lapse) with a Google search for the business
            name. Always lands on something useful — Google ranks
            current website, Google Business Profile, map, reviews,
            and recent phone number even when HERE's data is months old.
            Shows for EVERY tradie now, not only those HERE happens to
            have a www: field for. */}
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tradie-quote-btn"
          style={{ textDecoration: 'none', display: 'inline-block', background: 'var(--cream2)', color: 'var(--text)' }}
        >
          Find them online →
        </a>
      </div>
    </div>
  );
}

// Renders a single trade advisory chip (Trade needed: X + Google Maps
// CTA). `accent='primary'` is the dominant amber CTA for the main
// inferred trade; `accent='secondary'` is muted (outline) so the buyer
// understands it's an additional specialty to consider, not a
// duplicate. The secondary chip carries the smaller phrase "Also
// verify with" so the hierarchy reads correctly.
function TradeChip({ trade, suburb, accent }) {
  const isPrimary = accent === 'primary';
  const url = suburb
    ? googleMapsSearchUrl(trade.label, suburb)
    : googleMapsSearchUrl(trade.label);
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        padding: isPrimary ? '10px 14px' : '8px 14px',
        background: isPrimary ? 'var(--cream2)' : 'transparent',
        border: '1px solid var(--border)',
        borderRadius: 8,
        fontSize: isPrimary ? 13.5 : 12.5,
      }}
    >
      <div style={{ flex: '1 1 auto', minWidth: 200 }}>
        <span style={{ color: 'var(--muted)', fontWeight: 500 }}>
          {isPrimary ? 'Trade needed:' : 'Also verify with:'}
        </span>{' '}
        <strong style={{ color: 'var(--navy)' }}>{trade.label}</strong>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: isPrimary ? 'var(--amber)' : 'transparent',
          color: isPrimary ? '#fff' : 'var(--navy)',
          border: isPrimary ? 'none' : '1px solid var(--border)',
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 12.5,
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Search Google Maps →
      </a>
    </div>
  );
}

function DefectCard({ kind, defect, index, expanded, toggle, tradiesByKey, suburb, reportType }) {
  const key = `${kind}-${index}`;
  // New-build handover reports go through a builder who will rectify
  // under contract — the framing should be calmer and less adversarial.
  // "MAJOR DEFECT" is fine for a pre-purchase negotiation; for a buyer
  // working WITH their builder it reads as inflammatory. Soften the
  // badge labels + repair-cost prominence + "why it matters" wording.
  const isHandover = reportType === 'new_build_handover';
  const badge = isHandover
    ? (kind === 'major' ? 'TO RECTIFY' : kind === 'minor' ? 'COSMETIC ITEM' : 'PEST FINDING')
    : (kind === 'major' ? 'MAJOR DEFECT' : kind === 'minor' ? 'MINOR DEFECT' : 'PEST RISK');

  // Schema tolerance: pest_findings sometimes return pest_type/damage_description
  // instead of the defect-standard name/plain_english. Show whatever's present.
  const displayName = defect.name || defect.pest_type || 'Finding';
  const description = defect.plain_english || defect.damage_description || defect.summary || '';
  const whyItMatters = defect.why_it_matters || defect.recommendation || '';

  const pages = Array.isArray(defect.source_pages) ? defect.source_pages.filter(Number.isFinite) : [];
  const pageLabel = pages.length === 0 ? null : pages.length === 1 ? `p.${pages[0]}` : `pp.${pages.join(', ')}`;

  const hasCosts = Number.isFinite(defect.repair_cost_low) && defect.repair_cost_low > 0;

  // Infer the specific trade(s) needed for THIS defect from its text
  // (name, description, why-it-matters, location). Mapping rules live
  // in lib/trades.js. We use topTradesForDefect which returns 1-2
  // entries — the second only when the defect genuinely spans two
  // trades (e.g. a slab edge blowout affecting brickwork DPC
  // compliance: concreter grinds the slab, bricklayer verifies the
  // masonry-side compliance). Each trade gets its own Google Maps
  // fallback link so the buyer can call whoever is easier to reach.
  // HERE results remain below as nearby starting-points to verify.
  // PREFER Claude's assigned trade (it reads the defect and picks the right
  // specialist — e.g. "seal/paint timber edges" → painter, "metal flashing"
  // → roofer). Fall back to regex inference only when Claude didn't assign a
  // valid trade (older reports analysed before the `trade` field existed).
  const claudePrimary = tradeByKey(defect?.trade);
  const claudeSecondary = tradeByKey(defect?.trade_secondary);
  let inferredTrades;
  if (claudePrimary) {
    // Claude gives a primary + secondary trade per defect (min 2). Dedupe in
    // case it returned the same key twice; backfill a regex runner-up if it
    // only gave one distinct trade.
    inferredTrades = [claudePrimary, claudeSecondary]
      .filter(Boolean)
      .filter((t, i, arr) => arr.findIndex((x) => x.key === t.key) === i);
    if (inferredTrades.length < 2) {
      const extra = topTradesForDefect(defect).find((t) => t.key !== claudePrimary.key);
      if (extra) inferredTrades.push(extra);
    }
  } else {
    inferredTrades = topTradesForDefect(defect);
  }
  const primaryTrade = inferredTrades[0] || null;
  const secondaryTrade = inferredTrades[1] || null;

  // Build the tradie list for this defect. Preferred path: HERE Maps
  // was queried for each inferred trade specifically (Carpenter,
  // Concreter, Stair specialist, etc) — so `tradiesByKey[primaryTrade.key]`
  // contains real specialists for that trade. Fallback path (legacy
  // reports cached before the per-trade refactor, or defects that
  // didn't infer cleanly): merge the broad trade_category bucket.
  const byKey = tradiesByKey || {};
  const primaryList = primaryTrade ? (byKey[primaryTrade.key] || []) : [];
  const secondaryList = secondaryTrade ? (byKey[secondaryTrade.key] || []) : [];
  const legacyList = defect?.trade_category ? (byKey[defect.trade_category] || []) : [];
  // Merge per-trade first (best matches first), then legacy as backfill.
  const seenIds = new Set();
  const merged = [];
  for (const t of [...primaryList, ...secondaryList, ...legacyList]) {
    const id = t?.id || t?.business_name;
    if (!id || seenIds.has(id)) continue;
    seenIds.add(id);
    merged.push(t);
  }
  // Always apply the trade-name filter. When we COULDN'T infer a trade from
  // the defect text, do NOT dump the raw broad trade_category bucket — that's
  // what surfaced wrong specialties (e.g. a builder + concreter under a
  // door-weather-seal defect). Better to show nothing than the wrong trade.
  const tradies = primaryTrade
    ? filterTradiesByInferredTrades(merged, inferredTrades)
    : [];
  const hadTradiesButNoneMatched =
    primaryTrade && merged.length > 0 && tradies.length === 0;

  return (
    <div className={`defect-card ${kind}${isHandover ? ' handover' : ''}`}>
      <div className="defect-header" onClick={() => toggle(key)}>
        <div className="defect-title-row">
          <div className="severity-dot" />
          <div>
            <div className="defect-name">{displayName}</div>
            <div className="defect-loc" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {defect.location && <span>{defect.location}</span>}
              {pageLabel && (
                <span
                  title="Where this finding was discussed in your inspector's PDF"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--navy)',
                    background: 'var(--slate)',
                    border: '1px solid var(--border)',
                    borderRadius: 5,
                    padding: '2px 7px',
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: 0.2,
                  }}
                >
                  📄 Inspector ref: {pageLabel}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="severity-badge">{badge}</div>
          <div className="defect-chevron">{expanded[key] ? '▲' : '▼'}</div>
        </div>
      </div>
      {expanded[key] && (
        <div className="defect-body">
          {description && <p className="defect-desc">{description}</p>}
          {whyItMatters && (
            <p className="defect-desc" style={{ marginTop: 12, fontStyle: 'italic' }}>
              <strong>
                {isHandover
                  ? 'Why include for sign-off:'
                  : defect.why_it_matters ? 'Why it matters:' : 'Recommendation:'}
              </strong>{' '}
              {whyItMatters}
            </p>
          )}
          {hasCosts && (
            isHandover ? (
              // Handover: builder pays under contract. Cost is reference-only.
              // Render as a tiny muted right-aligned line so it doesn't
              // dominate the card or read as the buyer's "ask number".
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 6,
                  marginBottom: 8,
                  fontSize: 11.5,
                  color: 'var(--muted)',
                  fontStyle: 'italic',
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Builder reference cost:&nbsp;
                <span style={{ color: 'var(--text)' }}>
                  {fmt$(defect.repair_cost_low)}–{fmt$(defect.repair_cost_high)}
                </span>
              </div>
            ) : (
              // Pre-purchase: cost is the negotiation lever. Keep prominent.
              <div className="cost-chip">
                💰 Estimated repair cost:{' '}
                <strong>
                  {fmt$(defect.repair_cost_low)} – {fmt$(defect.repair_cost_high)}
                </strong>
              </div>
            )
          )}
          {/* Trade-specific advisory. When we can infer the trade(s) from
              the defect text (bricklayer for mortar, concreter for slab,
              etc), surface them explicitly + give a Google Maps fallback
              link so the buyer always has a way to find the right
              specialist even if HERE Maps returned the wrong category
              for this region. When a defect spans two trades (slab edge
              affecting brickwork DPC, framing carrying a glazed
              balustrade, etc), both are shown — the buyer picks
              whichever is easier to reach. HERE results remain below as
              nearby starting points. */}
          {primaryTrade && (
            <div className="tradies-section" style={{ marginBottom: tradies.length > 0 ? 12 : 0 }}>
              <TradeChip
                trade={primaryTrade}
                suburb={suburb}
                accent="primary"
              />
              {secondaryTrade && (
                <div style={{ marginTop: 8 }}>
                  <TradeChip
                    trade={secondaryTrade}
                    suburb={suburb}
                    accent="secondary"
                  />
                </div>
              )}
            </div>
          )}
          {tradies.length > 0 && (
            <div className="tradies-section">
              <div className="tradies-label">
                {primaryTrade
                  ? `📍 Nearby ${primaryTrade.label.toLowerCase()}s — verify before engaging`
                  : `📍 Nearby tradies — verify specialty before engaging`}
              </div>
              <div className="tradie-cards">
                {tradies.map((t) => (
                  <TradieCard key={t.id} tradie={t} suburb={suburb} />
                ))}
              </div>
            </div>
          )}
          {hadTradiesButNoneMatched && (
            <div
              style={{
                marginTop: 10,
                padding: '10px 14px',
                background: 'var(--cream2)',
                border: '1px dashed var(--border)',
                borderRadius: 8,
                fontSize: 12.5,
                color: 'var(--muted)',
                lineHeight: 1.5,
              }}
            >
              No nearby <strong style={{ color: 'var(--text)' }}>{primaryTrade.label.toLowerCase()}</strong>{' '}
              found in our HERE Maps cache — use the Google Maps search above to find a local
              specialist.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Extract suburb from an AU address by matching the word(s) just before
// an AU state code. Used to scope tradie Google searches to the right
// city so generic business names ('Matrix Bathrooms', 'Plumb Point')
// land on the correct branch. Returns null when no state code present,
// in which case the tradie button falls back to name-only search.
function extractSuburb(address) {
  if (!address || typeof address !== 'string') return null;
  const m = address.match(/([A-Za-z][A-Za-z\s]*?)\s+(VIC|NSW|QLD|WA|SA|TAS|NT|ACT)\b/);
  return m ? m[1].trim() : null;
}

// Shared 5-year capex forecast card. Same content rendered in two
// different positions depending on report type — pre-purchase shows
// it higher up (forward planning sits with negotiation guidance);
// handover shows it as the closing content card (action first,
// planning last). Extracting to a single component keeps the
// markup in sync if either position is later restyled.
function CapexForecastCard({ forecast }) {
  if (!forecast) return null;
  return (
    <div className="panel-card">
      <div className="panel-title">📅 5-Year Cost Forecast</div>
      <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 14, lineHeight: 1.5 }}>
        Forward-looking budget so you know what to set aside — not just the urgent stuff.
      </div>
      {[
        { key: 'year_1_urgent', label: 'Year 1 — urgent', color: 'var(--red)' },
        { key: 'year_1_to_3', label: 'Year 1–3 — planned', color: 'var(--gold)' },
        { key: 'year_3_to_5', label: 'Year 3–5 — anticipated', color: 'var(--teal)' },
      ].map(({ key, label, color }) => {
        const b = forecast[key];
        if (!b) return null;
        return (
          <div key={key} style={{ marginBottom: 14, paddingBottom: 12, borderBottom: key === 'year_3_to_5' ? 'none' : '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--navy)' }}>{label}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color, fontWeight: 700, whiteSpace: 'nowrap' }}>
                {fmt$(b.low)} – {fmt$(b.high)}
              </div>
            </div>
            {b.summary && <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{b.summary}</div>}
          </div>
        );
      })}
    </div>
  );
}

function PriceContextCard({ negotiationAmount }) {
  const hasNego = typeof negotiationAmount === 'number' && negotiationAmount > 0;
  return (
    <div className="panel-card" style={{ marginBottom: 28 }}>
      <div className="panel-title">💰 Is the asking price fair?</div>
      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
        The best way to sanity-check the asking price
        {hasNego ? <> — and whether asking <strong>{fmt$(negotiationAmount)}</strong> off it is reasonable —</> : ''}{' '}
        is to compare against recent sales of <strong>similar homes</strong>. Ask your agent for 3 recent sales of{' '}
        <strong>same-bedroom houses</strong>{' '}within about 1&nbsp;km, or check the “Sold” listings on
        realestate.com.au or Domain. If this property is priced <strong>at or above</strong> those
        comparable sales, the estimated rectification cost is a fair amount to negotiate off. If it's already{' '}
        <strong>below</strong> them by roughly that much, some of the defects may already be reflected in the
        price — so factor that in before asking for the full amount.
      </div>
    </div>
  );
}

function ResultsView({ analysis, tradies, reportType, expanded, toggle, copied, setCopied, reportId, agentId }) {
  const isHandover = reportType === 'new_build_handover';
  if (!analysis) return null;
  const majors = analysis.major_defects || [];
  const minors = analysis.minor_defects || [];
  const pests = analysis.pest_findings || [];
  const totalDefects = majors.length + minors.length + pests.length;
  const tradiesBy = tradies || {};
  const tradieCount = Object.values(tradiesBy).reduce((n, list) => n + (list?.length || 0), 0);
  const suburb = extractSuburb(analysis.property_address);
  // True when the analysis surfaced defects with trade categories but we
  // couldn't return any tradies for them. Almost always means the address
  // didn't geocode (typo, made-up address, or no street-level detail). We
  // surface a friendly note so the user understands what's missing.
  const hasTradeableDefects =
    [...majors, ...minors, ...pests].some((d) => d?.trade_category);
  const tradiesMissingButExpected = hasTradeableDefects && tradieCount === 0;

  const copyText = analysis.builder_rectification_letter || analysis.negotiation_language || '';
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="results-screen fade-up">
      <div className="prop-bar">
        <div>
          <div className="prop-addr">
            {analysis.property_address || 'Property address pending'}
          </div>
          <div className="prop-meta">
            Building + Pest Inspection
            {analysis.inspection_date ? ` · ${analysis.inspection_date}` : ''}
            {analysis.building_era ? ` · ${analysis.building_era}` : ''}
          </div>
        </div>
      </div>

      <div className={verdictCardClass(analysis.overall_verdict)}>
        <VerdictBadge verdict={analysis.overall_verdict} reportType={reportType} />
        <div className="verdict-text">{analysis.verdict_summary}</div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Defects Found</div>
          <div className="stat-val">{totalDefects}</div>
          <div className="stat-sub">
            {majors.length} major · {minors.length} minor · {pests.length} pest
          </div>
        </div>
        {/* Handover: the dollar amount is reference-only (builder pays
            under contract) so it's removed from the stats row entirely.
            It still lives — at small size — at the bottom of the
            Rectification Letter card below. Stats row becomes 3 tiles
            (Defects Found · Items to Rectify · Verdict) → buyer's eye
            lands on actionable counts, not dollar amounts. */}
        {!isHandover && (
          <div className="stat-card">
            <div className="stat-label">Est. Repair Cost</div>
            <div className="stat-val">
              {fmt$(Math.round(((analysis.total_repair_cost_low || 0) + (analysis.total_repair_cost_high || 0)) / 2))}
            </div>
            <div className="stat-sub">
              most likely · range {fmt$(analysis.total_repair_cost_low)}–{fmt$(analysis.total_repair_cost_high)}
            </div>
          </div>
        )}
        <div className="stat-card">
          {isHandover ? (
            <>
              {/* Handover: leverage is the COUNT of items the builder must
                  rectify, not a dollar value (builder pays under contract).
                  The dollar amount is still available in the letter card
                  below as a reference figure, but it's not what the buyer
                  actions on. */}
              <div className="stat-label">Items to Rectify</div>
              <div className="stat-val">{totalDefects}</div>
              <div className="stat-sub">
                Builder must complete before sign-off
              </div>
            </>
          ) : (
            <>
              <div className="stat-label">Negotiation Target</div>
              <div className="stat-val">{fmt$(analysis.negotiation_amount)}</div>
              <div className="stat-sub">Based on repair cost midpoint</div>
            </>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-label">Verdict</div>
          <div className="stat-val">{analysis.overall_verdict || '—'}</div>
          <div className="stat-sub">AS4349.1 assessment</div>
        </div>
      </div>

      {!isHandover && (
        <PriceContextCard negotiationAmount={analysis.negotiation_amount} />
      )}

      <div className="two-col">
        <div>
          {majors.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div className="section-label">
                {isHandover ? '🔧  Rectification Items' : '🔴  Major Defects'}
              </div>
              {majors.map((d, i) => (
                <DefectCard
                  key={i}
                  kind="major"
                  defect={d}
                  index={i}
                  expanded={expanded}
                  toggle={toggle}
                  tradiesByKey={tradiesBy}
                  reportType={reportType}
                  suburb={suburb}
                />
              ))}
            </div>
          )}
          {minors.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div className="section-label">
                {isHandover ? '✨  Cosmetic Items' : '🟡  Minor Defects'}
              </div>
              {minors.map((d, i) => (
                <DefectCard
                  key={i}
                  kind="minor"
                  defect={d}
                  index={i}
                  expanded={expanded}
                  toggle={toggle}
                  tradiesByKey={tradiesBy}
                  reportType={reportType}
                  suburb={suburb}
                />
              ))}
            </div>
          )}
          {pests.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div className="section-label">
                {isHandover ? '🐜  Pest Findings' : '🟤  Pest Findings'}
              </div>
              {pests.map((d, i) => (
                <DefectCard
                  key={i}
                  kind="pest"
                  defect={d}
                  index={i}
                  expanded={expanded}
                  toggle={toggle}
                  tradiesByKey={tradiesBy}
                  reportType={reportType}
                  suburb={suburb}
                />
              ))}
            </div>
          )}

          {tradieCount > 0 && (
            <div
              style={{
                marginTop: 8,
                padding: '14px 18px',
                background: 'var(--cream2)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                fontSize: 12,
                color: 'var(--muted)',
                lineHeight: 1.5,
              }}
            >
              Tradies above sourced from public business listings near the property address.
              Listings are not endorsements — always verify a tradesperson's licence and
              insurance before engaging. Verified Report Decoded partners will replace these
              listings in your region as our marketplace rolls out.
              <span style={{ display: 'block', marginTop: 6 }}>Powered by HERE Maps</span>
            </div>
          )}

          {tradiesMissingButExpected && (
            <div
              style={{
                marginTop: 8,
                padding: '14px 18px',
                background: 'var(--cream2)',
                border: '1px dashed var(--border)',
                borderRadius: 10,
                fontSize: 13,
                color: 'var(--muted)',
                lineHeight: 1.55,
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                🔍 Local tradies couldn't be matched
              </div>
              We couldn't find tradies near{' '}
              <strong style={{ color: 'var(--ink)' }}>
                {analysis.property_address || 'this property'}
              </strong>
              . This usually means the address didn't include a recognisable street or
              suburb — try editing the upload with a full address (e.g. "12 Smith St,
              Yarraville VIC 3013") to get local matches.
            </div>
          )}
        </div>

        <div className="right-panel">
          <div className="panel-card">
            <div className="panel-title">📄 Download Report</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.55, marginBottom: 14 }}>
              {agentId
                ? "Branded PDF with your agency logo + colour. Email or print for your client."
                : "Save a polished PDF copy of this report to your computer or email."}
            </div>
            <a
              href={`/api/report-pdf?reportId=${reportId}${agentId ? `&agent=${agentId}` : ''}`}
              className="download-btn"
              style={{ textDecoration: 'none' }}
              onClick={() => {
                try { track('report_pdf_downloaded', { is_branded: !!agentId }); } catch {}
              }}
            >
              ⬇ Download PDF
            </a>
          </div>

          {analysis.negotiation_language && (
            <div className="panel-card">
              <div className="panel-title">💬 Negotiation Language</div>
              <div className="negs-amount">
                –{fmt$(analysis.negotiation_amount)}
              </div>
              <div className="negs-sub">
                Recommended price reduction based on repair cost midpoint. Copy and send
                directly to your agent.
              </div>
              <div style={{ fontSize: 12, color: 'rgba(10,22,40,0.5)', lineHeight: 1.55, marginBottom: 12, fontStyle: 'italic' }}>
                ⚠️ If this property appears already priced below comparable sales to reflect
                its condition, adjust this figure down — negotiating the full repair cost
                on a discounted listing may not be realistic.
              </div>
              <div className="negs-text">{analysis.negotiation_language}</div>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? '✓ Copied to clipboard' : 'Copy to Clipboard'}
              </button>
            </div>
          )}

          {analysis.builder_rectification_letter && (
            <div className="panel-card">
              <div className="panel-title">🔧 Rectification Letter to Builder</div>

              {/* Action metadata box — what to do, who to send to, when.
                  These are the FIRST things a buyer needs to act on; the
                  dollar value (which the BUILDER pays under contract) is
                  reference information that lives below as a small line. */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: 12,
                  margin: '12px 0 16px',
                  padding: '14px 16px',
                  background: 'var(--gold-bg)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold)', fontWeight: 700, marginBottom: 3 }}>
                    Send to
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, lineHeight: 1.35 }}>
                    Site supervisor /<br />Builder rep
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold)', fontWeight: 700, marginBottom: 3 }}>
                    Rectify within
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, lineHeight: 1.35 }}>
                    21 days
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gold)', fontWeight: 700, marginBottom: 3 }}>
                    Items
                  </div>
                  <div className="tabular" style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, lineHeight: 1.35, fontFamily: "'DM Mono',monospace" }}>
                    {totalDefects} defects
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 14, fontStyle: 'italic' }}>
                Builder pays for rectification under your contract.
                <span style={{ marginLeft: 4 }}>
                  Reference value <span style={{ fontFamily: "'DM Mono',monospace", color: 'var(--muted)' }}>{fmt$(analysis.negotiation_amount)}</span>.
                </span>
              </div>

              <div className="negs-text">{analysis.builder_rectification_letter}</div>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? '✓ Copied to clipboard' : 'Copy to Clipboard'}
              </button>
            </div>
          )}

          {analysis.if_builder_refuses_note && (
            <div className="panel-card">
              <div className="panel-title">⚠️ If your builder refuses</div>
              <div style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {analysis.if_builder_refuses_note}
              </div>
            </div>
          )}

          {/* 5-year capex forecast — PRE-PURCHASE position. Sits here in
              the flow so pre-purchase buyers see forward maintenance
              planning right after the negotiation guidance. The handover
              variant renders this same block at the BOTTOM of the page
              instead (see below) because new-build buyers care about
              builder-rectification first and planning last. */}
          {!isHandover && analysis.capex_forecast && (
            <CapexForecastCard forecast={analysis.capex_forecast} />
          )}

          {/* Investor-only: rental compliance gaps */}
          {Array.isArray(analysis.rental_compliance_gaps) &&
            analysis.rental_compliance_gaps.length > 0 && (
              <div className="panel-card">
                <div className="panel-title">🏠 Rental Compliance Gaps</div>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
                  Items from this inspection that may block legal letting or breach state minimum rental standards. Fix before signing a lease.
                </div>
                {analysis.rental_compliance_gaps.map((g, i) => {
                  const sev = g.severity === 'blocks_letting' ? { bg: 'var(--red-bg)', fg: 'var(--red)', label: 'BLOCKS LETTING' }
                            : g.severity === 'risk' ? { bg: 'var(--gold-bg)', fg: 'var(--gold)', label: 'RISK' }
                            : { bg: 'var(--cream2)', fg: 'var(--muted)', label: 'RECOMMENDED' };
                  const pages = Array.isArray(g.source_pages) ? g.source_pages.filter(Number.isFinite) : [];
                  const pageLabel = pages.length === 0 ? null : pages.length === 1 ? `p.${pages[0]}` : `pp.${pages.join(', ')}`;
                  return (
                    <div key={i} style={{ marginBottom: 14, paddingBottom: 12, borderBottom: i === analysis.rental_compliance_gaps.length - 1 ? 'none' : '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--navy)', flex: 1 }}>{g.item}</div>
                        <span style={{
                          fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                          background: sev.bg, color: sev.fg, letterSpacing: 0.3, whiteSpace: 'nowrap',
                        }}>{sev.label}</span>
                      </div>
                      {g.regulation && <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 4 }}>{g.regulation}</div>}
                      {pageLabel && (
                        <span style={{
                          display: 'inline-block', fontSize: 10.5, fontWeight: 600,
                          color: 'var(--navy)', background: 'var(--slate)', border: '1px solid var(--border)',
                          borderRadius: 4, padding: '1px 6px', fontFamily: "'DM Mono',monospace", marginBottom: 6,
                        }}>📄 Inspector ref: {pageLabel}</span>
                      )}
                      {g.rectification_action && <div style={{ fontSize: 12.5, lineHeight: 1.55, color: '#374151', marginTop: 4 }}>{g.rectification_action}</div>}
                      {Number.isFinite(g.estimated_cost_low) && g.estimated_cost_low > 0 && (
                        <div style={{ fontSize: 11.5, fontFamily: "'DM Mono',monospace", color: 'var(--navy)', marginTop: 5 }}>
                          Cost: {fmt$(g.estimated_cost_low)} – {fmt$(g.estimated_cost_high)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          {/* Investor-only: separate inspections to commission */}
          {Array.isArray(analysis.compliance_inspections_recommended) &&
            analysis.compliance_inspections_recommended.length > 0 && (
              <div className="panel-card">
                <div className="panel-title">📋 Commission separately before letting</div>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
                  Compliance checks the building/pest inspection does NOT cover — but you still need before legally letting this property.
                </div>
                {analysis.compliance_inspections_recommended.map((c, i) => (
                  <div key={i} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: i === analysis.compliance_inspections_recommended.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--navy)', marginBottom: 3 }}>{c.type}</div>
                    {c.why_needed && <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, marginBottom: 4 }}>{c.why_needed}</div>}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11.5, color: 'var(--muted)' }}>
                      {c.who_performs && <span>👤 {c.who_performs}</span>}
                      {c.typical_cost && <span>💰 {c.typical_cost}</span>}
                      {c.frequency && <span>🔄 {c.frequency}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

          {Array.isArray(analysis.conveyancer_questions) &&
            analysis.conveyancer_questions.length > 0 && (
              <div className="panel-card">
                <div className="panel-title">❓ Ask Your Conveyancer</div>
                {analysis.conveyancer_questions.map((q, i) => (
                  <div className="question-item" key={i}>
                    <span className="q-num">Q{i + 1}</span>
                    <span style={{ color: '#374151' }}>{q}</span>
                  </div>
                ))}
              </div>
            )}

          {analysis.what_report_does_not_cover && (
            <div className="panel-card">
              <div className="panel-title">⚠️ What this doesn't cover</div>
              <div style={{ color: '#374151', fontSize: 14, lineHeight: 1.6 }}>
                {analysis.what_report_does_not_cover}
              </div>
            </div>
          )}

          {/* 5-year capex forecast — HANDOVER position. Sits at the
              bottom of the right panel because new-build buyers care
              about builder-rectification action items first; forward
              planning is the closing content card. Pre-purchase
              variant renders this same block higher up (see above). */}
          {isHandover && analysis.capex_forecast && (
            <CapexForecastCard forecast={analysis.capex_forecast} />
          )}

          {analysis.disclaimer && (
            <div
              style={{
                color: '#6B7280',
                fontSize: 12,
                lineHeight: 1.6,
                padding: '8px 4px',
              }}
            >
              {analysis.disclaimer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <>
          <style>{STYLES}</style>
          <LoadingState loadStep={0} />
        </>
      }
    >
      <ResultsBody />
    </Suspense>
  );
}
