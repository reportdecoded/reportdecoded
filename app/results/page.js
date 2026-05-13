'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { STYLES } from '@/components/ReportDecoded';

const LOAD_STEPS = [
  'Reading inspection report…',
  'Identifying major defects (AS4349.1)…',
  'Classifying minor defects…',
  'Assessing pest and termite findings…',
  'Estimating repair costs (AU rates)…',
  'Generating negotiation position…',
  'Drafting conveyancer questions…',
  'Building your report…',
];

function ResultsBody() {
  const params = useSearchParams();
  const reportId = params.get('reportId');
  const isSample = params.get('sample') === '1';
  const agentId = params.get('agent');

  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loadStep, setLoadStep] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState(false);
  const [brand, setBrand] = useState(null); // { business_name, logo_url, accent_color }

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
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>
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
        <LoadingState loadStep={loadStep} />
      )}
      {reportId && !error && report?.status === 'failed' && (
        <FailedState reason={report.failure_reason} />
      )}
      {reportId && !error && report?.status === 'complete' && (
        <ResultsView
          analysis={report.analysis}
          tradies={report.tradies}
          expanded={expanded}
          toggle={toggle}
          copied={copied}
          setCopied={setCopied}
        />
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
          <div style={{ marginBottom: 10 }}>
            <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', margin: '0 12px' }}>
              Privacy Policy
            </Link>
            ·
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', margin: '0 12px' }}>
              Terms of Service
            </Link>
            ·
            <a href="mailto:info@reportdecoded.com.au" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', margin: '0 12px' }}>
              Contact
            </a>
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

function ErrorState({ message }) {
  return (
    <div className="loading-screen">
      <h2 className="loading-h">Something went wrong.</h2>
      <p className="loading-sub">{message}</p>
    </div>
  );
}

function FailedState({ reason }) {
  return (
    <div className="loading-screen">
      <h2 className="loading-h">We couldn't analyse this report.</h2>
      <p className="loading-sub">
        {reason ||
          'The file may be a scanned image instead of a text PDF. A full refund has been processed.'}
      </p>
    </div>
  );
}

function LoadingState({ loadStep }) {
  return (
    <div className="loading-screen">
      <div className="loading-ring">
        <div className="loading-ring-outer" />
        <div className="loading-ring-inner" />
      </div>
      <h2 className="loading-h">Analysing your report…</h2>
      <p className="loading-sub">This usually takes 30–60 seconds.</p>
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
    </div>
  );
}

function VerdictBadge({ verdict }) {
  if (verdict === 'PROCEED')
    return (
      <div className="verdict-left">
        <span className="verdict-emoji">✅</span>
        <div className="verdict-badge">Proceed</div>
      </div>
    );
  if (verdict === 'WALK AWAY')
    return (
      <div className="verdict-left">
        <span className="verdict-emoji">🛑</span>
        <div className="verdict-badge">Walk Away</div>
      </div>
    );
  return (
    <div className="verdict-left">
      <span className="verdict-emoji">⚖️</span>
      <div className="verdict-badge">Negotiate</div>
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

function TradieCard({ tradie }) {
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
        {tradie.website && (
          <a
            href={tradie.website}
            target="_blank"
            rel="noopener noreferrer"
            className="tradie-quote-btn"
            style={{ textDecoration: 'none', display: 'inline-block', background: 'var(--cream2)', color: 'var(--text)' }}
          >
            Visit website →
          </a>
        )}
      </div>
    </div>
  );
}

function DefectCard({ kind, defect, index, expanded, toggle, tradiesForCategory }) {
  const key = `${kind}-${index}`;
  const badge =
    kind === 'major' ? 'MAJOR DEFECT' : kind === 'minor' ? 'MINOR DEFECT' : 'PEST RISK';
  const tradies = Array.isArray(tradiesForCategory) ? tradiesForCategory : [];
  return (
    <div className={`defect-card ${kind}`}>
      <div className="defect-header" onClick={() => toggle(key)}>
        <div className="defect-title-row">
          <div className="severity-dot" />
          <div>
            <div className="defect-name">{defect.name}</div>
            <div className="defect-loc">{defect.location}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="severity-badge">{badge}</div>
          <div className="defect-chevron">{expanded[key] ? '▲' : '▼'}</div>
        </div>
      </div>
      {expanded[key] && (
        <div className="defect-body">
          <p className="defect-desc">{defect.plain_english}</p>
          {defect.why_it_matters && (
            <p className="defect-desc" style={{ marginTop: 12, fontStyle: 'italic' }}>
              <strong>Why it matters:</strong> {defect.why_it_matters}
            </p>
          )}
          <div className="cost-chip">
            💰 Estimated repair cost:{' '}
            <strong>
              {fmt$(defect.repair_cost_low)} – {fmt$(defect.repair_cost_high)}
            </strong>
          </div>
          {tradies.length > 0 && (
            <div className="tradies-section">
              <div className="tradies-label">✅ Recommended Local Tradies</div>
              <div className="tradie-cards">
                {tradies.map((t) => (
                  <TradieCard key={t.id} tradie={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultsView({ analysis, tradies, expanded, toggle, copied, setCopied }) {
  if (!analysis) return null;
  const majors = analysis.major_defects || [];
  const minors = analysis.minor_defects || [];
  const pests = analysis.pest_findings || [];
  const totalDefects = majors.length + minors.length + pests.length;
  const tradiesBy = tradies || {};
  const tradieCount = Object.values(tradiesBy).reduce((n, list) => n + (list?.length || 0), 0);

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
        <VerdictBadge verdict={analysis.overall_verdict} />
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
        <div className="stat-card">
          <div className="stat-label">Est. Repair Cost</div>
          <div className="stat-val">
            {fmt$(analysis.total_repair_cost_low)} – {fmt$(analysis.total_repair_cost_high)}
          </div>
          <div className="stat-sub">Independent tradie estimates</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Negotiation Target</div>
          <div className="stat-val">{fmt$(analysis.negotiation_amount)}</div>
          <div className="stat-sub">Based on repair cost midpoint</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Verdict</div>
          <div className="stat-val">{analysis.overall_verdict || '—'}</div>
          <div className="stat-sub">AS4349.1 assessment</div>
        </div>
      </div>

      <div className="two-col">
        <div>
          {majors.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div className="section-label">🔴  Major Defects</div>
              {majors.map((d, i) => (
                <DefectCard
                  key={i}
                  kind="major"
                  defect={d}
                  index={i}
                  expanded={expanded}
                  toggle={toggle}
                  tradiesForCategory={tradiesBy[d.trade_category]}
                />
              ))}
            </div>
          )}
          {minors.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div className="section-label">🟡  Minor Defects</div>
              {minors.map((d, i) => (
                <DefectCard
                  key={i}
                  kind="minor"
                  defect={d}
                  index={i}
                  expanded={expanded}
                  toggle={toggle}
                  tradiesForCategory={tradiesBy[d.trade_category]}
                />
              ))}
            </div>
          )}
          {pests.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div className="section-label">🟤  Pest Findings</div>
              {pests.map((d, i) => (
                <DefectCard
                  key={i}
                  kind="pest"
                  defect={d}
                  index={i}
                  expanded={expanded}
                  toggle={toggle}
                  tradiesForCategory={tradiesBy[d.trade_category]}
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
        </div>

        <div className="right-panel">
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
              <div className="negs-text">{analysis.negotiation_language}</div>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? '✓ Copied to clipboard' : 'Copy to Clipboard'}
              </button>
            </div>
          )}

          {analysis.builder_rectification_letter && (
            <div className="panel-card">
              <div className="panel-title">🔧 Rectification Letter to Builder</div>
              <div className="negs-amount">
                {fmt$(analysis.negotiation_amount)}
              </div>
              <div className="negs-sub">
                Estimated value of rectification work outstanding. Send to your builder /
                site supervisor before signing off practical completion.
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
