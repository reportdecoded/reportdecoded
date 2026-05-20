// app/geelong-building-inspection-help/page.js
//
// Local SEO landing page targeting Geelong buyers searching for
// "building inspection report help geelong" and related queries.
//
// Geelong picked as the fourth SEO suburb because:
//   1. Huge regional centre with high transaction volume — Newtown,
//      Belmont, Highton, Bell Park, Armstrong Creek, Lara, Curlewis
//   2. Massive housing-stock variation (Federation in old town through
//      to brand-new estate releases in Armstrong Creek + Curlewis) =
//      buyers can't generalise what their report should say
//   3. Lots of Melbourne expats relocating — they don't know local
//      builders or what regional Geelong defects look like (coastal
//      salt corrosion, reactive-clay soil heave, mixed termite risk)
//   4. Both pre-purchase AND new-build handover use cases are common
//      (we cover both report types under the same analysis engine)
//
// Structure mirrors yarraville/brunswick/footscray. Localised content
// reflects Geelong's housing-stock breadth + Melbourne-expat audience.

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';
import { faqPageSchema, breadcrumbSchema, serviceSchema, JsonLd } from '@/lib/schema';

const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';
const SAMPLE_URL = `/results?reportId=${SAMPLE_REPORT_ID}&sample=1`;
const SAMPLE_PDF = `/api/report-pdf?reportId=${SAMPLE_REPORT_ID}`;

export default function GeelongLandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <style>{STYLES}</style>

      {/* SEO: FAQPage / BreadcrumbList / Service JSON-LD. */}
      <JsonLd data={faqPageSchema(FAQS)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Geelong Building Inspection Help', url: '/geelong-building-inspection-help' },
      ])} />
      <JsonLd data={serviceSchema({ suburb: 'Geelong', state: 'VIC' })} />

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
        <div className="hero-badge">🌊 For Geelong & Bellarine Buyers</div>
        <h1 className="hero-h">
          Got your Geelong<br/>building report? <em>Decoded.</em>
        </h1>
        <p className="hero-sub">
          Upload any AS4349.1 building & pest inspection (or new-build handover) PDF for a Geelong
          property and get a plain-English verdict, AU repair costs, local tradies, and exactly how
          much to negotiate — in under 2 minutes. Every claim cites the inspector's page so nothing's made up.
        </p>
        <div style={{ marginTop: 22, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={SAMPLE_URL}
            style={hero_btn_primary}
            onClick={() => { try { track('geelong_landing_cta', { type: 'sample_view' }); } catch {} }}
          >
            See a real Victorian analysis →
          </Link>
          <a
            href={SAMPLE_PDF}
            style={hero_btn_secondary}
            onClick={() => { try { track('geelong_landing_cta', { type: 'sample_pdf' }); } catch {} }}
          >
            ⬇ Download sample PDF
          </a>
        </div>
      </div>

      {/* ── UPLOAD CTA ────────────────────────────────── */}
      <div className="upload-area">
        <div className="upload-zone" style={{ cursor: 'default' }}>
          <div className="upload-icon">📄</div>
          <div className="upload-title">Got your own Geelong inspection report?</div>
          <div className="upload-sub">
            Upload it on the homepage. Single report $59 AUD · results in under 2 minutes · branded PDF emailed to you.
          </div>
          <Link
            href="/#buyer-upload"
            className="upload-btn"
            style={{ textDecoration: 'none' }}
            onClick={() => { try { track('geelong_landing_cta', { type: 'upload' }); } catch {} }}
          >
            Upload your PDF →
          </Link>
          <div className="upload-filetypes">
            PDF only · max 25 MB · pre-purchase OR new-build handover reports
          </div>
        </div>

        {/* ── REAL ANCHOR STATS ── */}
        <div style={{ marginTop: 56, marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            📊 What a real Victorian analysis looks like
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
              Public sample: <span className="redact-soft">███</span> Loch Street, Yarraville VIC 3013
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>
              c.1940 timber weatherboard · same era as much of Newtown, Geelong West, and East Geelong
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

        {/* ── WHY GEELONG BUYERS NEED THIS ── */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            🏗 Why Geelong reports are tougher than most
          </div>
          <div className="how-strip" style={{ marginTop: 18 }}>
            {[
              {
                num: '01',
                label: 'Two completely different housing markets',
                desc: 'Old Geelong (Newtown, Geelong West, East Geelong) is pre-1960 timber on stumps with all the era\'s defect patterns. New Geelong (Armstrong Creek, Curlewis, Mount Duneed) is 2015+ estate-build with handover defects. Same suburb code, totally different report patterns.',
              },
              {
                num: '02',
                label: 'Reactive clay + coastal salt',
                desc: 'Bellarine peninsula has reactive-clay soil that lifts and shrinks with seasons — newer brick veneer estates show diagonal cracking that looks alarming on first read. Older coastal suburbs see salt-corrosion on metal roofing, gutters, and external fixtures. Inspectors flag both heavily.',
              },
              {
                num: '03',
                label: 'New-build handover reports work too',
                desc: 'If you bought off the plan in Armstrong Creek, Curlewis, or Lara and a handover inspector gave you a defects list, we analyse that the same way — major vs minor, cost ranges, and the right language to put to the builder before final settlement.',
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
              <div className="price-amount">$59</div>
              <div className="price-desc">Full Geelong analysis with citations, tradies, negotiation language.</div>
            </div>
            <div className="price-card featured">
              <div className="price-label">3-Report Pack</div>
              <div className="price-amount">$149</div>
              <div className="price-desc">For Melbourne expats comparing multiple Geelong / Bellarine properties.</div>
              <div className="price-tag">Most Popular</div>
            </div>
            <Link href="/agents" className="price-card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <div className="price-label">For Buyer's Agents</div>
              <div className="price-amount">From $79<span style={{ fontSize: 17, fontWeight: 300 }}>/mo</span></div>
              <div className="price-desc">White-label PDFs with your branding for your Geelong buyer clients.</div>
              <div style={{ marginTop: 8, color: 'var(--amber)', fontSize: 13, fontWeight: 600 }}>Learn more →</div>
            </Link>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            ❓ Common questions from Geelong buyers
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
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26, marginBottom: 10, letterSpacing: -0.3 }}>
            Ready to decode your Geelong report?
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 22, maxWidth: 520, margin: '0 auto 22px' }}>
            Upload your PDF and have a plain-English analysis in under 2 minutes. Works for both pre-purchase and new-build handover reports. No account needed.
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
            onClick={() => { try { track('geelong_landing_cta', { type: 'bottom_upload' }); } catch {} }}
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
    q: 'Why do you have a Geelong-specific page?',
    a: "Geelong is a buyer's market with extreme variety — buyers might be looking at a 1920s timber Federation in Newtown one weekend and a 2024 brick-veneer in Armstrong Creek the next. Each comes with its own kind of inspection report, its own defect patterns, and its own typical inspector caveats. We built this page because Geelong buyers (especially Melbourne expats new to the region) need help separating local norms from genuine red flags.",
  },
  {
    q: "We're buying a new-build in Armstrong Creek / Curlewis / Lara. Does this work for handover inspection reports?",
    a: "Yes — we specifically support new-build handover reports as a separate report type when you upload. Handover defect lists are different in shape from pre-purchase reports (more cosmetic items, more compliance vs liveability items, builder-defects-at-warranty-stage) and we tailor the analysis accordingly. The output includes the negotiation language you can put to your builder before final settlement.",
  },
  {
    q: 'Is the AI actually accurate?',
    a: "Yes — and verifiable. Every major and minor defect we identify includes a citation to the page in your inspector's PDF where it was discussed. So you can flip to page 40 of your report and check that the inspector did say what we attribute. We don't extract claims we can't anchor.",
  },
  {
    q: "We're Melbourne-based but buying in Geelong. Do you know local building rates?",
    a: "Yes. Our cost benchmarks use Australian 2026 tradie rates and are not Melbourne-CBD-inflated. Geelong building rates run roughly 10-15% below inner-Melbourne for most trades, and our negotiation amounts reflect that. We also do local tradie matching using your specific property address — so if your inspector recommends a damp specialist, we pull names from Geelong, not Carlton.",
  },
  {
    q: 'Will this replace getting a building inspection?',
    a: "No — and it shouldn't. You should always commission a licensed AS4349.1 inspector for the actual inspection. This tool sits AFTER the inspection: it interprets the report you receive. Think of it as having a builder friend translate the 95-page document for you in under 2 minutes.",
  },
  {
    q: 'The inspector flagged reactive-clay soil / movement cracks. How seriously should I take that?',
    a: "Reactive clay is common across Bellarine and parts of greater Geelong, especially the newer-estate areas. Inspectors will almost always note potential soil movement on a slab-on-ground new build. Most movement is cosmetic and stabilises within 18-24 months of construction. We classify the cracks the inspector flagged (cosmetic / monitor / structural) and recommend the right next step — usually a slab inspection or engineering opinion before signing off.",
  },
  {
    q: "I'm in Newtown / Belmont / Highton / Geelong West / Lara / Curlewis — still works?",
    a: "Yes — the tool works for any Australian property. The Geelong-specific framing on this page is for SEO; the underlying analysis is identical for Newtown, Belmont, Highton, Geelong West, Bell Park, Armstrong Creek, Lara, Curlewis, Ocean Grove, or anywhere else. Local tradie matching uses your property's actual address.",
  },
  {
    q: 'How does the refund policy work?',
    a: "If we can't read your PDF (e.g. it's a scanned image with no extractable text, or it's not actually an inspection report) we automatically refund the $59. You'll get an email explaining what we tried and what to upload instead. We catch most non-inspection uploads (Section 32s, vendor statements, contracts of sale) before you're even charged.",
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
