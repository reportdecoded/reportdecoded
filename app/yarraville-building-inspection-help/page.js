// app/yarraville-building-inspection-help/page.js
//
// Local SEO landing page targeting Yarraville buyers searching for
// "building inspection report help yarraville" and related long-tail
// queries. Yarraville was a deliberate first pick because:
//   1. Our public sample analysis is a real Yarraville property
//      (███ Loch Street, 1940s weatherboard, $75K negotiation), so we
//      have authentic local proof to anchor to
//   2. Yarraville housing stock is overwhelmingly pre-1960s, which is
//      exactly where defect risk + asbestos + termite concerns peak —
//      a buyer here genuinely benefits from this product
//   3. Inner-west Melbourne prices ($800K–$1.5M typical) make a $39
//      buyer-side report financially trivial vs negotiation upside
//
// Pattern is reusable for future suburbs (Ocean Grove, Torquay, Geelong)
// by duplicating this file with localised hero copy + sample stats.

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';
import { faqPageSchema, breadcrumbSchema, serviceSchema, JsonLd } from '@/lib/schema';

// Public Yarraville sample — same one linked from homepage
const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';
const SAMPLE_URL = `/results?reportId=${SAMPLE_REPORT_ID}&sample=1`;
const SAMPLE_PDF = `/api/report-pdf?reportId=${SAMPLE_REPORT_ID}`;

export default function YarravilleLandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <style>{STYLES}</style>

      {/* SEO: page-specific JSON-LD schemas. FAQPage unlocks Google's
          expandable-FAQ rich result. BreadcrumbList enables the
          breadcrumb trail above the page title in SERPs. Service tells
          Google this page offers a service to Yarraville buyers. */}
      <JsonLd data={faqPageSchema(FAQS)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Yarraville Building Inspection Help', url: '/yarraville-building-inspection-help' },
      ])} />
      <JsonLd data={serviceSchema({ suburb: 'Yarraville', state: 'VIC' })} />

      {/* ── NAV ────────────────────────────────────────── */}
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
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
        <div className="hero-badge">🏘 For Yarraville Buyers</div>
        <h1 className="hero-h">
          Got your Yarraville<br/>building report? <em>Decoded.</em>
        </h1>
        <p className="hero-sub">
          Upload any AS4349.1 building & pest inspection PDF for a Yarraville property and get a
          plain-English verdict, AU repair costs, local tradies, and exactly how much to negotiate —
          in under 2 minutes. Every claim cites the inspector's page so nothing's made up.
        </p>
        <div style={{ marginTop: 22, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={SAMPLE_URL}
            style={hero_btn_primary}
            onClick={() => { try { track('yarraville_landing_cta', { type: 'sample_view' }); } catch {} }}
          >
            See a real Yarraville analysis →
          </Link>
          <a
            href={SAMPLE_PDF}
            style={hero_btn_secondary}
            onClick={() => { try { track('yarraville_landing_cta', { type: 'sample_pdf' }); } catch {} }}
          >
            ⬇ Download sample PDF
          </a>
        </div>
      </div>

      {/* ── UPLOAD CTA ────────────────────────────────── */}
      <div className="upload-area">
        <div className="upload-zone" style={{ cursor: 'default' }}>
          <div className="upload-icon">📄</div>
          <div className="upload-title">Got your own Yarraville inspection report?</div>
          <div className="upload-sub">
            Upload it on the homepage. Single report $39 AUD · results in under 2 minutes · branded PDF emailed to you.
          </div>
          <Link
            href="/#buyer-upload"
            className="upload-btn"
            style={{ textDecoration: 'none' }}
            onClick={() => { try { track('yarraville_landing_cta', { type: 'upload' }); } catch {} }}
          >
            Upload your PDF →
          </Link>
          <div className="upload-filetypes">
            PDF only · max 25 MB · Australian Standard AS4349.1 reports
          </div>
        </div>

        {/* ── REAL YARRAVILLE STATS (anchored to actual analysis) ── */}
        <div style={{ marginTop: 56, marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            📊 From a real Yarraville inspection we analysed
          </div>
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '24px 28px',
              marginTop: 18,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--navy)', marginBottom: 4 }}>
              <span className="redact-soft">███</span> Loch Street, Yarraville VIC 3013
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>
              c.1940 timber weatherboard on stumps · pre-purchase building & pest inspection
            </div>
            <div className="stats-row" style={{ marginBottom: 18 }}>
              <div className="stat-card">
                <div className="stat-label">Inspector pages</div>
                <div className="stat-val">95</div>
                <div className="stat-sub">→ 5-page analysis</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Major defects</div>
                <div className="stat-val">11</div>
                <div className="stat-sub">All cited to PDF page</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Repair cost</div>
                <div className="stat-val" style={{ fontSize: 18 }}>$36K–$117K</div>
                <div className="stat-sub">AU 2026 rates</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Negotiation</div>
                <div className="stat-val" style={{ color: 'var(--teal)' }}>$45K</div>
                <div className="stat-sub">Off contract price</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href={SAMPLE_URL} style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                Read the full analysis →
              </Link>
              <a href={SAMPLE_PDF} style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                ⬇ Download as PDF
              </a>
            </div>
          </div>
        </div>

        {/* ── WHY YARRAVILLE BUYERS NEED THIS ── */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            🪵 Why Yarraville reports are tougher than most
          </div>
          <div className="how-strip" style={{ marginTop: 18 }}>
            {[
              {
                num: '01',
                label: 'Pre-1960s housing stock',
                desc: 'Yarraville is dominated by 1900s-1950s weatherboards on stumps — high asbestos, termite, and rising-damp risk. Reports here are dense.',
              },
              {
                num: '02',
                label: 'Inner-west prices',
                desc: 'Median around $1.1–1.4M (2026). Missing a $40K negotiation opportunity hurts. Knowing exactly what to push back on changes the deal.',
              },
              {
                num: '03',
                label: 'Reports run 80–120 pages',
                desc: 'Older Yarraville stock means more defects, more photos, more conducive-conditions noted. Reading it all yourself = 3+ hours.',
              },
            ].map((s) => (
              <div className="how-step" key={s.num}>
                <div className="how-num">{s.num}</div>
                <div>
                  <div className="how-label">{s.label}</div>
                  <div className="how-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PRICING ── */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            💰 Simple pricing
          </div>
          <div className="pricing-row" style={{ marginTop: 18 }}>
            <div className="price-card">
              <div className="price-label">Single Report</div>
              <div className="price-amount">$39</div>
              <div className="price-desc">Full Yarraville analysis with citations, tradies, negotiation language.</div>
            </div>
            <div className="price-card featured">
              <div className="price-label">3-Report Pack</div>
              <div className="price-amount">$149</div>
              <div className="price-desc">For buyers considering multiple Yarraville (or other inner-west) properties.</div>
              <div className="price-tag">Most Popular</div>
            </div>
            <Link href="/agents" className="price-card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <div className="price-label">For Buyer's Agents</div>
              <div className="price-amount">From $79<span style={{ fontSize: 17, fontWeight: 300 }}>/mo</span></div>
              <div className="price-desc">White-label PDFs with your branding for your Yarraville buyer clients.</div>
              <div style={{ marginTop: 8, color: 'var(--amber)', fontSize: 13, fontWeight: 600 }}>Learn more →</div>
            </Link>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            ❓ Common questions from Yarraville buyers
          </div>
          <div style={{ marginTop: 18 }}>
            {FAQS.map((f, i) => (
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
                <div
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    padding: '14px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    fontWeight: 600,
                    fontSize: 14.5,
                    color: 'var(--navy)',
                  }}
                >
                  <span>{f.q}</span>
                  <span style={{ color: 'var(--subtle)', fontSize: 12 }}>{openFaq === i ? '▲' : '▼'}</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 18px 16px', fontSize: 13.5, lineHeight: 1.65, color: '#374151' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div
          style={{
            background: 'var(--navy)',
            borderRadius: 16,
            padding: '32px 28px',
            textAlign: 'center',
            color: '#fff',
            marginBottom: 56,
          }}
        >
          <div style={{ fontFamily: "var(--font-serif),serif", fontSize: 26, marginBottom: 10, letterSpacing: -0.3 }}>
            Ready to decode your Yarraville report?
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 22, maxWidth: 520, margin: '0 auto 22px' }}>
            Upload your PDF and have a plain-English analysis in under 2 minutes. No account needed. $39 single, refunded if we can't read your PDF.
          </div>
          <Link
            href="/#buyer-upload"
            style={{
              display: 'inline-block',
              background: 'var(--amber)',
              color: '#fff',
              textDecoration: 'none',
              padding: '14px 32px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 15,
            }}
            onClick={() => { try { track('yarraville_landing_cta', { type: 'bottom_upload' }); } catch {} }}
          >
            Upload your PDF →
          </Link>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer
        style={{
          background: 'var(--navy)',
          color: 'rgba(255,255,255,0.6)',
          padding: '32px 24px',
          textAlign: 'center',
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="rd-footer-links">
            <Link href="/">Home</Link>
            <Link href="/agents">For Agents</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>
            © 2026 Report Decoded · Australian property inspection report interpreter ·
            AI analysis is general information, not professional advice.
          </div>
        </div>
      </footer>
    </>
  );
}

const FAQS = [
  {
    q: 'Why do you have a Yarraville-specific page?',
    a: "Yarraville housing stock is overwhelmingly pre-1960s — 1900s to 1950s weatherboards and brick veneer on stumps. That era is exactly where the defect-rich, jargon-heavy inspection reports come from. Our public sample is a real Yarraville analysis (Loch Street — specific number redacted for owner privacy) so you can see how the tool handles the kind of report you'll get on the property you're considering.",
  },
  {
    q: 'Is the AI actually accurate?',
    a: "Yes — and verifiable. Every major and minor defect we identify includes a citation to the page in your inspector's PDF where it was discussed. So you can flip to page 40 of your report and check that the inspector did say what we attribute. We don't extract claims we can't anchor.",
  },
  {
    q: 'How is the negotiation amount calculated?',
    a: "We sum all major and minor defects' repair-cost midpoints (using Australian 2026 tradie rates), adjust for severity, and propose a sensible negotiation figure. The number isn't a guarantee — it's a defensible starting position. You're free to use a different number; the report shows how we got there.",
  },
  {
    q: 'Will this replace getting a building inspection?',
    a: "No — and it shouldn't. You should always commission a licensed AS4349.1 inspector for the actual inspection. This tool sits AFTER the inspection: it interprets the report you receive. Think of it as having a builder friend translate the 95-page document for you in under 2 minutes.",
  },
  {
    q: 'What about asbestos / pest / electrical / gas — those need separate inspections, right?',
    a: "Yes. The building inspection is a visual assessment under AS4349.1 — it cannot certify asbestos, gas safety, electrical compliance, or pool safety. We flag these gaps in your analysis (especially for investor properties) and recommend the right separate inspections with typical Australian costs.",
  },
  {
    q: 'Is my data private?',
    a: "Yes. Your PDF is stored encrypted on UploadThing (Singapore region, AU-adjacent). The analysis result is stored in our Supabase database, scoped to your unique report ID. We don't share, sell, or reuse your inspection data. Only people you share your report link with can view it.",
  },
  {
    q: "I'm in Footscray / Spotswood / Seddon, not Yarraville — still works?",
    a: "Yes — the tool works for any Australian property. The Yarraville-specific framing on this page is for SEO; the underlying analysis is identical for Footscray, Spotswood, Seddon, Williamstown, or anywhere else. Local tradie matching uses your property's actual address.",
  },
  {
    q: 'How does the refund policy work?',
    a: "If we can't read your PDF (e.g. it's a scanned image with no extractable text, or it's not actually an inspection report) we automatically refund the $39. You'll get an email explaining what we tried and what to upload instead.",
  },
];

const hero_btn_primary = {
  display: 'inline-block',
  background: 'var(--amber)',
  color: '#fff',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 15,
};

const hero_btn_secondary = {
  display: 'inline-block',
  color: 'rgba(255,255,255,0.85)',
  textDecoration: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.4)',
  paddingBottom: 3,
  fontSize: 14,
  alignSelf: 'center',
};
