// components/SuburbPage.jsx
//
// Shared template for programmatic SEO suburb landing pages. Reads
// from lib/suburbs.js for localised content. Per-page metadata is
// exported from the suburb's layout.js (which calls suburbMetadata()
// from lib/suburbs.js — that file owns title/description/canonical/OG).
//
// What this component renders:
//   • Nav (consistent with main site)
//   • Hero with suburb-specific h1 + sub
//   • CTAs: see a sample report, upload your own
//   • "What to look out for in {suburb}" — localised defect list
//   • Localised data card (era / median / council)
//   • FAQ accordion (with FAQPage JSON-LD schema)
//   • Adjacent suburb links (internal linking for SEO + UX)
//   • BreadcrumbList JSON-LD
//
// Why suburb pages matter for SEO:
//   - Each page targets a long-tail intent: "[suburb] building inspection",
//     "[suburb] pre-purchase inspection help", "[suburb] termite inspection".
//   - Unique localised content avoids the duplicate-content penalty.
//   - FAQPage rich results take more SERP real estate than a plain blue link.
//   - Internal links to adjacent suburbs distribute link equity AND give
//     users a natural next step.
//
// Add a suburb by:
//   1. Add entry to SUBURBS in lib/suburbs.js
//   2. Create app/{slug}-building-inspection-help/page.js that
//      renders <SuburbPage slug="..." />
//   3. Create app/{slug}-building-inspection-help/layout.js that
//      exports suburbMetadata(slug) from lib/suburbs.js
//   4. Add the slug to app/sitemap.js

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';
import { SUBURBS, suburbBreadcrumbs } from '@/lib/suburbs';
import { faqPageSchema, breadcrumbSchema, serviceSchema, JsonLd } from '@/lib/schema';

const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';
const SAMPLE_URL = `/results?reportId=${SAMPLE_REPORT_ID}&sample=1`;
const SAMPLE_PDF = `/api/report-pdf?reportId=${SAMPLE_REPORT_ID}`;

export default function SuburbPage({ slug }) {
  const s = SUBURBS[slug];
  const [openFaq, setOpenFaq] = useState(null);

  if (!s) {
    return (
      <main style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>Suburb not configured</h1>
        <p>Slug "{slug}" not found in SUBURBS.</p>
      </main>
    );
  }

  const adjacent = (s.adjacent || []).map((k) => SUBURBS[k]).filter(Boolean);

  return (
    <>
      <style>{STYLES}</style>

      {/* SEO: page-specific schemas. FAQPage for rich-result eligibility,
          BreadcrumbList for the breadcrumb rich result above page title,
          Service for "this page is offering analysis in {suburb}". */}
      <JsonLd data={faqPageSchema(s.faqs)} />
      <JsonLd data={breadcrumbSchema(suburbBreadcrumbs(slug))} />
      <JsonLd data={serviceSchema({ suburb: s.name, state: s.state })} />

      {/* ── NAV ────────────────────────────────────────── */}
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>For Buyers</Link>
          <Link href="/agents" className="nav-link" style={{ textDecoration: 'none' }}>For Agents</Link>
          <Link href="/signin" className="nav-cta" style={{ textDecoration: 'none' }}>Agent Sign In</Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <div className="hero-section">
        <div className="hero-badge">🏘 For {s.name} Buyers</div>
        <h1 className="hero-h">
          Got your {s.name}<br/>building report? <em>Decoded.</em>
        </h1>
        <p className="hero-sub">
          Upload any AS4349.1 building &amp; pest inspection PDF for a {s.name} {s.state} property
          and get a plain-English verdict, AU repair costs, local tradies, and exactly how much
          to negotiate — in under 2 minutes. Every claim cites the inspector&apos;s page so nothing&apos;s
          made up.
        </p>

        <div style={{ marginTop: 22, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={SAMPLE_URL}
            style={hero_btn_primary}
            onClick={() => { try { track('suburb_landing_cta', { suburb: slug, type: 'sample_view' }); } catch {} }}
          >
            See a real inspection analysis →
          </Link>
          <a
            href={SAMPLE_PDF}
            style={hero_btn_secondary}
            onClick={() => { try { track('suburb_landing_cta', { suburb: slug, type: 'sample_pdf' }); } catch {} }}
          >
            ⬇ Download sample PDF
          </a>
        </div>
      </div>

      {/* ── UPLOAD CTA ──────────────────────────────────── */}
      <div className="upload-area">
        <div className="upload-zone" style={{ cursor: 'default', textAlign: 'center' }}>
          <div className="upload-icon">📄</div>
          <div className="upload-title">Upload your {s.name} inspection PDF</div>
          <div className="upload-sub" style={{ marginBottom: 14 }}>
            Building, pest &amp; combined reports · AS4349.1 compliant
          </div>
          <Link
            href={`/?utm_source=suburb&utm_medium=organic&utm_campaign=${slug}`}
            style={{
              display: 'inline-block',
              background: 'var(--amber)',
              color: '#fff',
              fontWeight: 600,
              padding: '12px 26px',
              borderRadius: 11,
              textDecoration: 'none',
              boxShadow: '0 6px 16px rgba(201,122,58,0.32)',
            }}
            onClick={() => { try { track('suburb_landing_cta', { suburb: slug, type: 'upload' }); } catch {} }}
          >
            Upload your PDF →
          </Link>
          <div className="upload-filetypes" style={{ marginTop: 14 }}>
            $39 per analysis · No subscription · Results in under 2 minutes
          </div>
        </div>
      </div>

      {/* ── LOCALISED DATA CARD ─────────────────────────── */}
      <section style={{ maxWidth: 920, margin: '48px auto 0', padding: '0 24px' }}>
        <div className="section-label" style={{ textAlign: 'center', marginBottom: 8 }}>
          📍 About {s.name}, {s.state} {s.postcode}
        </div>
        <h2 style={{
          fontFamily: "var(--font-serif),serif",
          fontSize: 28,
          margin: '0 0 24px',
          textAlign: 'center',
          color: 'var(--text)',
          letterSpacing: -0.3,
        }}>
          Why {s.name} inspections matter
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 28,
        }}>
          <SuburbStatCard label="Median house price" value={s.median_price} />
          <SuburbStatCard label="Housing era" value={s.era} />
          <SuburbStatCard label="Local council" value={s.council} />
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '24px 28px',
          boxShadow: '0 4px 14px rgba(10,22,40,0.04)',
        }}>
          <h3 style={{
            fontFamily: "var(--font-serif),serif",
            fontSize: 20,
            margin: '0 0 14px',
            color: 'var(--navy)',
            letterSpacing: -0.2,
          }}>
            What buyers in {s.name} should look out for
          </h3>
          <ul style={{
            paddingLeft: 22,
            margin: 0,
            color: 'var(--text)',
            fontSize: 14.5,
            lineHeight: 1.7,
          }}>
            {s.common_defects.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section style={{ maxWidth: 760, margin: '56px auto 0', padding: '0 24px' }}>
        <div className="section-label" style={{ textAlign: 'center', marginBottom: 8 }}>
          ❓ {s.name} buyer questions
        </div>
        <h2 style={{
          fontFamily: "var(--font-serif),serif",
          fontSize: 28,
          margin: '0 0 24px',
          textAlign: 'center',
          color: 'var(--text)',
          letterSpacing: -0.3,
        }}>
          What buyers ask before uploading
        </h2>

        {s.faqs.map((f, i) => {
          const isOpen = openFaq === i;
          return (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 10,
                marginBottom: 8,
                overflow: 'hidden',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : i)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 0,
                  padding: '16px 18px',
                  minHeight: 48,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: 14.5,
                  color: 'var(--navy)',
                  textAlign: 'left',
                }}
              >
                <span>{f.q}</span>
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-flex',
                    width: 28,
                    height: 28,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 7,
                    background: 'var(--cream2)',
                    color: 'var(--navy)',
                    fontSize: 11,
                    flexShrink: 0,
                  }}
                >{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div style={{ padding: '0 18px 16px', fontSize: 13.5, lineHeight: 1.65, color: '#374151' }}>
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ── ADJACENT SUBURBS (internal linking) ─────────── */}
      {adjacent.length > 0 && (
        <section style={{ maxWidth: 920, margin: '56px auto 0', padding: '0 24px' }}>
          <div className="section-label" style={{ textAlign: 'center', marginBottom: 8 }}>
            🔗 Nearby suburbs we also cover
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
          }}>
            {adjacent.map((a) => {
              const aSlug = Object.keys(SUBURBS).find((k) => SUBURBS[k] === a);
              return (
                <Link
                  key={aSlug}
                  href={`/${aSlug}-building-inspection-help`}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '10px 16px',
                    color: 'var(--navy)',
                    textDecoration: 'none',
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  {a.name} inspection help →
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── FINAL CTA ──────────────────────────────────── */}
      <section style={{ maxWidth: 720, margin: '56px auto 0', padding: '0 24px 56px', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "var(--font-serif),serif",
          fontSize: 26,
          margin: '0 0 14px',
          color: 'var(--text)',
          letterSpacing: -0.3,
        }}>
          Ready to decode your {s.name} report?
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 22 }}>
          $39 per report. No subscription. Auto-refunded if we can&apos;t analyse your PDF.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: 'var(--amber)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            padding: '14px 32px',
            borderRadius: 11,
            textDecoration: 'none',
            boxShadow: '0 6px 18px rgba(201,122,58,0.32)',
          }}
        >
          Upload your PDF →
        </Link>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
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
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            © 2026 Report Decoded · {s.name} building inspection help · AI analysis is general information, not professional advice.
          </div>
        </div>
      </footer>
    </>
  );
}

function SuburbStatCard({ label, value }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{
        fontSize: 11,
        color: 'var(--muted)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 600,
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 14,
        color: 'var(--text)',
        fontWeight: 500,
        lineHeight: 1.45,
      }}>
        {value}
      </div>
    </div>
  );
}

const hero_btn_primary = {
  display: 'inline-block',
  background: 'var(--amber)',
  color: '#fff',
  fontWeight: 600,
  fontSize: 15.5,
  padding: '13px 26px',
  borderRadius: 11,
  textDecoration: 'none',
  boxShadow: '0 6px 16px rgba(201,122,58,0.36)',
};

const hero_btn_secondary = {
  display: 'inline-block',
  color: 'rgba(255,255,255,0.85)',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.32)',
  padding: '12px 22px',
  borderRadius: 11,
  fontSize: 13.5,
  fontWeight: 500,
};
