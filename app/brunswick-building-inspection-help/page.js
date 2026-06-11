// app/brunswick-building-inspection-help/page.js
//
// Local SEO landing page targeting Brunswick (3056/3057) buyers
// searching for "building inspection report help brunswick" and
// related long-tail queries.
//
// Brunswick was picked as the second SEO suburb because:
//   1. Sydney Road corridor, Brunswick West, Coburg-adjacent — high
//      transaction volume + gentrifying = lots of first-home buyers
//      who haven't seen an inspection report before
//   2. Mixed housing stock: Victorian terraces, Federation cottages,
//      1950s-60s workers' cottages on stumps, layered renovations.
//      Old + altered = the worst kind of inspection report to read
//   3. Heritage overlays are common, which adds compliance language
//      that buyers don't understand and inspectors flag conservatively
//
// Structure mirrors yarraville-building-inspection-help: hero, stats
// anchor, "why tougher", pricing, FAQ, CTA. Adjust suburb-specific
// language ONLY — keep the structure identical so we can scale this
// pattern to more suburbs.

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';
import { faqPageSchema, breadcrumbSchema, serviceSchema, JsonLd } from '@/lib/schema';

// Same Yarraville sample — we don't have a Brunswick sample yet, so we
// link to the live Yarraville one as a worked example. Inner-west and
// inner-north Melbourne housing stock overlap enough that the proof
// reads as relevant to a Brunswick buyer.
const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';
const SAMPLE_URL = `/results?reportId=${SAMPLE_REPORT_ID}&sample=1`;
const SAMPLE_PDF = `/api/report-pdf?reportId=${SAMPLE_REPORT_ID}`;

export default function BrunswickLandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <style>{STYLES}</style>

      {/* SEO: FAQPage / BreadcrumbList / Service JSON-LD. */}
      <JsonLd data={faqPageSchema(FAQS)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Brunswick Building Inspection Help', url: '/brunswick-building-inspection-help' },
      ])} />
      <JsonLd data={serviceSchema({ suburb: 'Brunswick', state: 'VIC' })} />

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
        <div className="hero-badge">🏘 For Brunswick Buyers</div>
        <h1 className="hero-h">
          Got your Brunswick<br/>building report? <em>Decoded.</em>
        </h1>
        <p className="hero-sub">
          Upload any AS4349.1 building & pest inspection PDF for a Brunswick property and get a
          plain-English verdict, AU repair costs, local tradies, and exactly how much to negotiate —
          in under 2 minutes. Every claim cites the inspector's page so nothing's made up.
        </p>
        <div style={{ marginTop: 22, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={SAMPLE_URL}
            style={hero_btn_primary}
            onClick={() => { try { track('brunswick_landing_cta', { type: 'sample_view' }); } catch {} }}
          >
            See a real inner-Melbourne analysis →
          </Link>
          <a
            href={SAMPLE_PDF}
            style={hero_btn_secondary}
            onClick={() => { try { track('brunswick_landing_cta', { type: 'sample_pdf' }); } catch {} }}
          >
            ⬇ Download sample PDF
          </a>
        </div>
      </div>

      {/* ── UPLOAD CTA ────────────────────────────────── */}
      <div className="upload-area">
        <div className="upload-zone" style={{ cursor: 'default' }}>
          <div className="upload-icon">📄</div>
          <div className="upload-title">Got your own Brunswick inspection report?</div>
          <div className="upload-sub">
            Upload it on the homepage. Single report $59 AUD · results in under 2 minutes · branded PDF emailed to you.
          </div>
          <Link
            href="/#buyer-upload"
            className="upload-btn"
            style={{ textDecoration: 'none' }}
            onClick={() => { try { track('brunswick_landing_cta', { type: 'upload' }); } catch {} }}
          >
            Upload your PDF →
          </Link>
          <div className="upload-filetypes">
            PDF only · max 25 MB · Australian Standard AS4349.1 reports
          </div>
        </div>

        {/* ── REAL ANCHOR STATS ── */}
        <div style={{ marginTop: 56, marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            📊 What a real inner-Melbourne analysis looks like
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
              c.1940 timber weatherboard on stumps · the exact era of housing you'll see on Sydney Rd, Brunswick West, and Coburg
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

        {/* ── WHY BRUNSWICK BUYERS NEED THIS ── */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            🧱 Why Brunswick reports are tougher than most
          </div>
          <div className="how-strip" style={{ marginTop: 18 }}>
            {[
              {
                num: '01',
                label: 'Heritage overlays + layered renos',
                desc: 'Most Brunswick streets sit inside heritage overlays. Decades of renovations under different rules = hidden defects, non-compliant additions, and inspector caveats that read like legal disclaimers.',
              },
              {
                num: '02',
                label: 'Victorian + Federation + post-war mix',
                desc: 'A typical Brunswick block can have 1890s brickwork at the front, a 1950s timber sleepout at the back, and a 2010s upstairs addition. Three eras of materials = three sets of defect patterns.',
              },
              {
                num: '03',
                label: 'Tight lots = subfloor access nightmare',
                desc: '4-5m frontages, terraced rears, party walls. Inspectors flag "limited access" constantly and write conservatively. We translate what that actually means for your purchase risk.',
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
              <div className="price-desc">Full Brunswick analysis with citations, tradies, negotiation language.</div>
            </div>
            <div className="price-card featured">
              <div className="price-label">3-Report Pack</div>
              <div className="price-amount">$149</div>
              <div className="price-desc">For buyers comparing multiple inner-north properties (Brunswick, Coburg, Northcote).</div>
              <div className="price-tag">Most Popular</div>
            </div>
            <Link href="/agents" className="price-card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <div className="price-label">For Buyer's Agents</div>
              <div className="price-amount">From $79<span style={{ fontSize: 17, fontWeight: 300 }}>/mo</span></div>
              <div className="price-desc">White-label PDFs with your branding for your Brunswick buyer clients.</div>
              <div style={{ marginTop: 8, color: 'var(--amber)', fontSize: 13, fontWeight: 600 }}>Learn more →</div>
            </Link>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            ❓ Common questions from Brunswick buyers
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
            Ready to decode your Brunswick report?
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, marginBottom: 22, maxWidth: 520, margin: '0 auto 22px' }}>
            Upload your PDF and have a plain-English analysis in under 2 minutes. No account needed. $59 single, refunded if we can't read your PDF.
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
            onClick={() => { try { track('brunswick_landing_cta', { type: 'bottom_upload' }); } catch {} }}
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
    q: 'Why do you have a Brunswick-specific page?',
    a: "Brunswick's housing stock is unusually layered — Victorian-era brick on the streetfront, post-war timber out the back, and 2010s-2020s upstairs additions under heritage overlay rules. That mix is exactly where defect risk + interpretation difficulty peak. We built this page because Brunswick reports are some of the densest we see, and a typical buyer doesn't have the context to read them without help.",
  },
  {
    q: 'Heritage overlay applies to my property — does that change what I should be looking for?',
    a: "Yes. Heritage overlays (extensive across Brunswick) restrict what you can change to the streetscape-visible portions of the building. If the inspector flags a defect to a front-facing element (verandah cast-iron, original sash windows, slate roof) the rectification quote needs to factor in heritage-compliant materials and a permit process. Our analysis flags this where relevant.",
  },
  {
    q: 'Is the AI actually accurate?',
    a: "Yes — and verifiable. Every major and minor defect we identify includes a citation to the page in your inspector's PDF where it was discussed. So you can flip to page 40 of your report and check that the inspector did say what we attribute. We don't extract claims we can't anchor.",
  },
  {
    q: 'How is the negotiation amount calculated?',
    a: "We sum all major and minor defects' repair-cost midpoints (using Australian 2026 tradie rates, adjusted for inner-north Melbourne premium where relevant), adjust for severity, and propose a sensible negotiation figure. The number isn't a guarantee — it's a defensible starting position for your conversation with the vendor's agent. The report shows how we got there.",
  },
  {
    q: 'Will this replace getting a building inspection?',
    a: "No — and it shouldn't. You should always commission a licensed AS4349.1 inspector for the actual inspection. This tool sits AFTER the inspection: it interprets the report you receive. Think of it as having a builder friend translate the 95-page document for you in under 2 minutes.",
  },
  {
    q: 'My property has Victorian-era plumbing (lead, galvanised). Does the inspection cover that?',
    a: "Partially. AS4349.1 building inspections are visual only — the inspector will flag visible plumbing concerns (corrosion, leaks, sagging pipes) but cannot test pipe interiors. Our analysis recommends a separate plumbing inspection when we detect these red flags. Galvanised pipes in original Brunswick homes are typically end-of-life and budget should be set aside for a full replumb.",
  },
  {
    q: "I'm in Brunswick East / West / Coburg / Pascoe Vale — still works?",
    a: "Yes — the tool works for any Australian property. The Brunswick-specific framing on this page is for SEO; the underlying analysis is identical for Brunswick East, Brunswick West, Coburg, Pascoe Vale, Fitzroy, Northcote, or anywhere else. Local tradie matching uses your property's actual address.",
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
