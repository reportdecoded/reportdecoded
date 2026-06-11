// app/footscray-building-inspection-help/page.js
//
// Local SEO landing page targeting Footscray (3011) buyers searching
// for "building inspection report help footscray" and related queries.
//
// Footscray picked as the third SEO suburb because:
//   1. Directly adjacent to Yarraville (our public sample). The
//      housing stock is the same era + same patterns â€” pre-1960
//      timber on stumps mixed with post-war brick â€” so our proof
//      anchor is even more directly relevant than for Brunswick
//   2. High first-home buyer activity at the $800Kâ€“$1.1M band
//   3. Sunbury train line cuts through the suburb at high speed = a
//      band of properties near the rail corridor have vibration-
//      related defects that inspectors flag with caveats
//   4. Industrial heritage = soft-soil settlement, prior fill, and
//      occasional historical contamination concerns
//
// Same structure as yarraville/brunswick â€” only the localised copy
// (hero subtitle, "why tougher" cards, FAQs) changes.

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';
import { faqPageSchema, breadcrumbSchema, serviceSchema, JsonLd } from '@/lib/schema';

const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';
const SAMPLE_URL = `/results?reportId=${SAMPLE_REPORT_ID}&sample=1`;
const SAMPLE_PDF = `/api/report-pdf?reportId=${SAMPLE_REPORT_ID}`;

export default function FootscrayLandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <style>{STYLES}</style>

      {/* SEO: FAQPage / BreadcrumbList / Service JSON-LD. */}
      <JsonLd data={faqPageSchema(FAQS)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Footscray Building Inspection Help', url: '/footscray-building-inspection-help' },
      ])} />
      <JsonLd data={serviceSchema({ suburb: 'Footscray', state: 'VIC' })} />

      {/* â”€â”€ NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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

      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="hero-section">
        <div className="hero-badge">ðŸ˜ For Footscray Buyers</div>
        <h1 className="hero-h">
          Got your Footscray<br/>building report? <em>Decoded.</em>
        </h1>
        <p className="hero-sub">
          Upload any AS4349.1 building & pest inspection PDF for a Footscray property and get a
          plain-English verdict, AU repair costs, local tradies, and exactly how much to negotiate â€”
          in under 2 minutes. Every claim cites the inspector's page so nothing's made up.
        </p>
        <div style={{ marginTop: 22, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href={SAMPLE_URL}
            style={hero_btn_primary}
            onClick={() => { try { track('footscray_landing_cta', { type: 'sample_view' }); } catch {} }}
          >
            See a real inner-west analysis â†’
          </Link>
          <a
            href={SAMPLE_PDF}
            style={hero_btn_secondary}
            onClick={() => { try { track('footscray_landing_cta', { type: 'sample_pdf' }); } catch {} }}
          >
            â¬‡ Download sample PDF
          </a>
        </div>
      </div>

      {/* â”€â”€ UPLOAD CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="upload-area">
        <div className="upload-zone" style={{ cursor: 'default' }}>
          <div className="upload-icon">ðŸ“„</div>
          <div className="upload-title">Got your own Footscray inspection report?</div>
          <div className="upload-sub">
            Upload it on the homepage. Single report $59 AUD Â· results in under 2 minutes Â· branded PDF emailed to you.
          </div>
          <Link
            href="/#buyer-upload"
            className="upload-btn"
            style={{ textDecoration: 'none' }}
            onClick={() => { try { track('footscray_landing_cta', { type: 'upload' }); } catch {} }}
          >
            Upload your PDF â†’
          </Link>
          <div className="upload-filetypes">
            PDF only Â· max 25 MB Â· Australian Standard AS4349.1 reports
          </div>
        </div>

        {/* â”€â”€ REAL ANCHOR STATS â”€â”€ */}
        <div style={{ marginTop: 56, marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            ðŸ“Š From a real inner-west inspection we analysed
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
              Public sample: <span className="redact-soft">â–ˆâ–ˆâ–ˆ</span> Loch Street, Yarraville VIC 3013 (next suburb over)
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>
              c.1940 timber weatherboard on stumps Â· the exact same housing stock you'll see on Barkly St, Footscray West, and Maidstone
            </div>
            <div className="stats-row" style={{ marginBottom: 18 }}>
              <div className="stat-card">
                <div className="stat-label">Inspector pages</div>
                <div className="stat-val">95</div>
                <div className="stat-sub">â†’ 5-page analysis</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Major defects</div>
                <div className="stat-val">11</div>
                <div className="stat-sub">All cited to PDF page</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Repair cost</div>
                <div className="stat-val" style={{ fontSize: 18 }}>$36Kâ€“$117K</div>
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
                Read the full analysis â†’
              </Link>
              <a href={SAMPLE_PDF} style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                â¬‡ Download as PDF
              </a>
            </div>
          </div>
        </div>

        {/* â”€â”€ WHY FOOTSCRAY BUYERS NEED THIS â”€â”€ */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            ðŸš‚ Why Footscray reports are tougher than most
          </div>
          <div className="how-strip" style={{ marginTop: 18 }}>
            {[
              {
                num: '01',
                label: 'Older timber on stumps, often re-stumped',
                desc: 'Half of Footscray\'s pre-1960s stock has been re-stumped at least once. Inspectors flag inconsistent stump heights, sagging joists, and rising damp â€” the kind of defects that need careful reading to know if they\'re serious or cosmetic.',
              },
              {
                num: '02',
                label: 'Train-line vibration band',
                desc: 'Properties within ~200m of the Sunbury / Williamstown / Werribee lines often show diagonal wall cracking, loose plaster, and door-frame drift. Inspectors note it but rarely quote remediation â€” we estimate what reasonable monitoring + tuck-pointing should cost.',
              },
              {
                num: '03',
                label: 'Brownfield + reactive clay',
                desc: 'Footscray\'s industrial history means some lots sit on imported fill or organic-clay soil. Movement cracks in newer brickwork can be alarming on first read. Our analysis separates "monitor" defects from "fix now" defects.',
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

        {/* â”€â”€ PRICING â”€â”€ */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            ðŸ’° Simple pricing
          </div>
          <div className="pricing-row" style={{ marginTop: 18 }}>
            <div className="price-card">
              <div className="price-label">Single Report</div>
              <div className="price-amount">$59</div>
              <div className="price-desc">Full Footscray analysis with citations, tradies, negotiation language.</div>
            </div>
            <div className="price-card featured">
              <div className="price-label">3-Report Pack</div>
              <div className="price-amount">$149</div>
              <div className="price-desc">For buyers comparing multiple inner-west properties (Footscray, Seddon, Yarraville, Spotswood).</div>
              <div className="price-tag">Most Popular</div>
            </div>
            <Link href="/agents" className="price-card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <div className="price-label">For Buyer's Agents</div>
              <div className="price-amount">From $79<span style={{ fontSize: 17, fontWeight: 300 }}>/mo</span></div>
              <div className="price-desc">White-label PDFs with your branding for your Footscray buyer clients.</div>
              <div style={{ marginTop: 8, color: 'var(--amber)', fontSize: 13, fontWeight: 600 }}>Learn more â†’</div>
            </Link>
          </div>
        </div>

        {/* â”€â”€ FAQ â”€â”€ */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ textAlign: 'center' }}>
            â“ Common questions from Footscray buyers
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
                  <span style={{ color: 'var(--subtle)', fontSize: 12 }}>{openFaq === i ? 'â–²' : 'â–¼'}</span>
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

        {/* â”€â”€ BOTTOM CTA â”€â”€ */}
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
            Ready to decode your Footscray report?
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
            onClick={() => { try { track('footscray_landing_cta', { type: 'bottom_upload' }); } catch {} }}
          >
            Upload your PDF â†’
          </Link>
        </div>
      </div>

      {/* â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
            Â© 2026 Report Decoded Â· Australian property inspection report interpreter Â·
            AI analysis is general information, not professional advice.
          </div>
        </div>
      </footer>
    </>
  );
}

const FAQS = [
  {
    q: 'Why do you have a Footscray-specific page?',
    a: "Footscray sits at the intersection of three things that make inspection reports hard to read: pre-1960 timber housing stock, an industrial-heritage soil profile, and active train infrastructure. Buyers here see inspector caveats about settlement, vibration cracks, and remediated fill that read scarier than they really are. We built this page because Footscray reports are typical of where buyers most need the translation help.",
  },
  {
    q: 'My property is near the train line â€” should I be worried about the cracking the inspector flagged?',
    a: "Usually no, but it depends on the pattern. Diagonal cracks above doors and windows that stay open under 5mm are almost always cosmetic â€” caused by minor cyclical movement from train vibration. Stepped cracks through brick mortar joints, cracks that have moved recently (you can see fresh dust), or cracks wider than 5mm at any point need engineering assessment. Our analysis classifies these for you and recommends the right next step.",
  },
  {
    q: 'Is the AI actually accurate?',
    a: "Yes â€” and verifiable. Every major and minor defect we identify includes a citation to the page in your inspector's PDF where it was discussed. So you can flip to page 40 of your report and check that the inspector did say what we attribute. We don't extract claims we can't anchor.",
  },
  {
    q: 'How is the negotiation amount calculated?',
    a: "We sum all major and minor defects' repair-cost midpoints (using Australian 2026 tradie rates), adjust for severity, and propose a sensible negotiation figure. The number isn't a guarantee â€” it's a defensible starting position for your conversation with the vendor's agent. The report shows how we got there.",
  },
  {
    q: 'Will this replace getting a building inspection?',
    a: "No â€” and it shouldn't. You should always commission a licensed AS4349.1 inspector for the actual inspection. This tool sits AFTER the inspection: it interprets the report you receive. Think of it as having a builder friend translate the 95-page document for you in under 2 minutes.",
  },
  {
    q: "The previous owner did a major renovation. Does that change things?",
    a: "Yes. Renovated properties in Footscray often have additions that don't match the original era's construction standards, and we flag where the inspector has noted differential settlement, mismatched roof lines, or compliance gaps between the old + new sections. The negotiation language we generate reflects these specifically â€” they're some of the strongest pushback points you have.",
  },
  {
    q: "I'm in Footscray West / Maidstone / Seddon / Spotswood â€” still works?",
    a: "Yes â€” the tool works for any Australian property. The Footscray-specific framing on this page is for SEO; the underlying analysis is identical for Footscray West, Maidstone, Seddon, Spotswood, Yarraville, Williamstown, or anywhere else. Local tradie matching uses your property's actual address.",
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
