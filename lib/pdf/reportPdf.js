// lib/pdf/reportPdf.js
// Server-side PDF template for Report Decoded analyses, rendered with
// @react-pdf/renderer. Designed for paper (8.5x11"/A4) — different layout
// from /results which is a web view.
//
// Brand:
//   - Navy headings, amber accents, cream/white surfaces
//   - Serif for headlines (Times — bundled with react-pdf, no font fetch)
//   - Sans-serif for body
//   - Page numbers in footer
//
// Agent branding (white-label):
//   - When called with agent.logo_url + accent_color, swaps in agent's
//     logo + tints the accent throughout
//   - Otherwise uses Report Decoded's brand

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from '@react-pdf/renderer';

// ── Palette ──────────────────────────────────────────
const C = {
  navy: '#0A1628',
  navy2: '#1C3050',
  amber: '#C97A3A',
  amberBg: '#FEF3E8',
  amberBorder: '#F4C9A0',
  cream: '#F7F3EE',
  cream2: '#EDE8DF',
  white: '#FFFFFF',
  text: '#1C1917',
  muted: '#6B7280',
  border: '#E5E0D8',
  teal: '#0D6B5E',
  tealLight: '#E6F7F5',
  gold: '#B45309',
  goldBg: '#FFFBEB',
  red: '#BE3A2F',
  redBg: '#FEF0EE',
};

const VERDICT_META = {
  PROCEED: { bg: C.tealLight, fg: C.teal, label: 'PROCEED', tone: 'Good news — only minor issues found.' },
  NEGOTIATE: { bg: C.goldBg, fg: C.gold, label: 'NEGOTIATE', tone: "There are real issues — here's what to push back on." },
  'WALK AWAY': { bg: C.redBg, fg: C.red, label: 'WALK AWAY', tone: 'Serious concerns. Read carefully before signing.' },
  WALK_AWAY: { bg: C.redBg, fg: C.red, label: 'WALK AWAY', tone: 'Serious concerns. Read carefully before signing.' },
};

const formatAud = (n) => {
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return '—';
  return '$' + Math.round(n).toLocaleString('en-AU');
};

// Format a source_pages array like [12, 38, 40] → "pp. 12, 38, 40"
const formatPages = (pages) => {
  if (!Array.isArray(pages) || pages.length === 0) return null;
  const clean = pages.filter(Number.isFinite);
  if (clean.length === 0) return null;
  return clean.length === 1 ? `p. ${clean[0]}` : `pp. ${clean.join(', ')}`;
};

// ── Styles ───────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    // paddingTop reserves room for the fixed brand bar (~70pt incl. margin)
    // on every printed page — when content overflows to a continuation page
    // react-pdf re-renders the fixed brandBar inside this padding zone, so
    // the body needs to start BELOW it. 50pt was too tight on long sections
    // (15–20-page reports) — bumped to 96pt for safety.
    paddingTop: 96,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontSize: 10.5,
    fontFamily: 'Helvetica',
    color: C.text,
    backgroundColor: C.white,
  },
  // ── Brand header bar — `fixed` on every page. Position is computed from
  //    inside the page padding, so it sits in the top 96pt zone reserved
  //    via page.paddingTop above. Total visible height ~70pt (logo 22 +
  //    paddingBottom 16 + border 1 + marginBottom 28).
  brandBar: {
    position: 'absolute',
    top: 28,
    left: 44,
    right: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  brandLogo: { height: 22 },
  brandText: { fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: 'Times-Bold' },
  brandTagline: { fontSize: 9, color: C.muted, marginTop: 2 },
  // ── Section heads
  h1: {
    fontFamily: 'Times-Roman',
    fontSize: 26,
    color: C.navy,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Times-Bold',
    fontSize: 14,
    color: C.navy,
    marginTop: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 5,
  },
  small: { fontSize: 9.5, color: C.muted },
  // ── Verdict badge block
  verdictBlock: {
    marginTop: 8,
    marginBottom: 18,
    padding: '16 18',
    borderRadius: 8,
  },
  verdictLabel: {
    fontSize: 22,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.8,
  },
  verdictTone: { fontSize: 11, marginTop: 4, lineHeight: 1.4 },
  // ── Stats grid (4 cards across)
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.cream,
    borderRadius: 6,
    padding: '10 8',
    alignItems: 'center',
  },
  statValue: { fontFamily: 'Times-Bold', fontSize: 18, color: C.navy },
  statLabel: { fontSize: 8.5, color: C.muted, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.6 },
  // ── Negotiation hero (page 1 highlight)
  negHero: {
    backgroundColor: C.amberBg,
    borderWidth: 1,
    borderColor: C.amberBorder,
    borderRadius: 8,
    padding: '14 18',
    marginBottom: 16,
  },
  negHeroLabel: {
    fontSize: 9,
    color: C.gold,
    fontFamily: 'Times-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  negHeroValue: { fontFamily: 'Times-Bold', fontSize: 26, color: C.navy, letterSpacing: -0.5 },
  negHeroSub: { fontSize: 10, color: C.muted, marginTop: 4 },
  // ── Defect card
  defectCard: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: '12 14',
    marginBottom: 10,
  },
  defectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  // NOTE: flex:1 is NOT baked in. It's applied inline only inside defectHeader
  // (the row flexbox where name + badge sit side-by-side). Used standalone in
  // a column-direction card, flex:1 would force the heading to have flexBasis:0
  // (zero layout height) while still rendering glyphs — body text below then
  // lands on top of it.
  defectName: { fontFamily: 'Helvetica-Bold', fontSize: 11.5, color: C.navy },
  defectBadge: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    backgroundColor: C.red,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginLeft: 8,
  },
  defectBadgeMinor: { backgroundColor: C.gold },
  defectBadgePest: { backgroundColor: '#92400E' },
  defectMeta: { fontSize: 9.5, color: C.muted, marginBottom: 6 },
  defectRef: {
    fontSize: 8.5,
    fontFamily: 'Courier-Bold',
    color: C.navy,
    backgroundColor: C.cream2,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  defectDesc: { fontSize: 10, lineHeight: 1.5, color: C.text, marginBottom: 5 },
  defectWhy: { fontSize: 9.5, lineHeight: 1.5, color: C.muted, fontStyle: 'italic', marginBottom: 6 },
  defectCost: {
    fontFamily: 'Courier-Bold',
    fontSize: 10,
    color: C.navy,
    backgroundColor: C.cream,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  // ── Long-form blocks (negotiation letter, builder rectification, etc.)
  longBlock: {
    backgroundColor: C.cream,
    borderRadius: 6,
    padding: '14 16',
    fontSize: 10.5,
    lineHeight: 1.55,
    marginBottom: 12,
  },
  // ── List items
  bullet: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 8,
  },
  bulletDot: { width: 10, color: C.amber, fontFamily: 'Helvetica-Bold' },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.5 },
  // ── Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 44,
    right: 44,
    fontSize: 8.5,
    color: C.muted,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
  },
});

// ── Components ────────────────────────────────────────

function BrandHeader({ agent, brandUrl }) {
  return (
    <View style={styles.brandBar} fixed>
      <View>
        {agent?.business_name ? (
          <>
            <Text style={[styles.brandText, agent.accent_color ? { color: agent.accent_color } : null]}>
              {agent.business_name}
            </Text>
            <Text style={styles.brandTagline}>Inspection analysis · powered by Report Decoded</Text>
          </>
        ) : (
          <>
            <Text style={styles.brandText}>Report Decoded</Text>
            <Text style={styles.brandTagline}>Australian inspection report analysis</Text>
          </>
        )}
      </View>
      {agent?.logo_url ? (
        <Image src={agent.logo_url} style={[styles.brandLogo, { maxWidth: 120 }]} />
      ) : null}
    </View>
  );
}

function Footer({ brandUrl }) {
  return (
    <View style={styles.footer} fixed>
      <Text>{brandUrl || 'reportdecoded.com.au'}</Text>
      <Text
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
}

function DefectCardView({ defect, kind }) {
  const displayName = defect.name || defect.pest_type || 'Finding';
  const description = defect.plain_english || defect.damage_description || defect.summary || '';
  const why = defect.why_it_matters || defect.recommendation || '';
  const pageRef = formatPages(defect.source_pages);
  const hasCosts = Number.isFinite(defect.repair_cost_low) && defect.repair_cost_low > 0;
  const badgeStyle = kind === 'minor' ? styles.defectBadgeMinor : kind === 'pest' ? styles.defectBadgePest : null;
  const badgeLabel = kind === 'minor' ? 'MINOR' : kind === 'pest' ? 'PEST' : 'MAJOR';

  return (
    <View style={styles.defectCard} wrap={false}>
      <View style={styles.defectHeader}>
        <Text style={[styles.defectName, { flex: 1 }]}>{displayName}</Text>
        <Text style={[styles.defectBadge, badgeStyle]}>{badgeLabel}</Text>
      </View>
      {defect.location ? (
        // No 📍 emoji prefix — @react-pdf's fontkit doesn't have an emoji
        // font registered so it renders the pin glyph with broken metrics
        // that overlap the first letter of the location text. The bare
        // location string is cleaner and matches the on-screen treatment.
        <Text style={styles.defectMeta}>{defect.location}</Text>
      ) : null}
      {pageRef ? (
        <Text style={styles.defectRef}>INSPECTOR REF: {pageRef}</Text>
      ) : null}
      {description ? <Text style={styles.defectDesc}>{description}</Text> : null}
      {why ? (
        <Text style={styles.defectWhy}>
          {defect.why_it_matters ? 'Why it matters: ' : 'Recommendation: '}
          {why}
        </Text>
      ) : null}
      {hasCosts ? (
        <Text style={styles.defectCost}>
          {/* assessment_only: the range is the SPECIALIST ASSESSMENT cost,
              not a guessed repair figure — label it honestly. */}
          {defect.cost_basis === 'assessment_only'
            ? `SPECIALIST ASSESSMENT: ${formatAud(defect.repair_cost_low)} – ${formatAud(defect.repair_cost_high)} (true repair cost unknown until assessed)`
            : `REPAIR COST: ${formatAud(defect.repair_cost_low)} – ${formatAud(defect.repair_cost_high)}${defect.cost_confidence ? ` · ${defect.cost_confidence} confidence` : ''}`}
        </Text>
      ) : null}
    </View>
  );
}

// ── Main Document ─────────────────────────────────────
export function ReportDocument({ report, agent, brandUrl = 'reportdecoded.com.au' }) {
  const analysis = report.result_json || {};
  const verdict = analysis.overall_verdict || 'COMPLETE';
  const v0 = VERDICT_META[verdict] || { bg: C.cream, fg: C.muted, label: verdict, tone: '' };
  // For new build handover, the buyer is in contract — "Negotiate" / "Walk
  // Away" vocabulary doesn't apply. Detect via the presence of a builder
  // rectification letter (the canonical signal that handover mode was used)
  // and swap to rectification-appropriate labels + tone.
  const isHandoverPdf = !!analysis.builder_rectification_letter;
  const v = isHandoverPdf
    ? {
        ...v0,
        label:
          verdict === 'NEGOTIATE' ? 'RECTIFY'
          : verdict === 'PROCEED' ? 'READY FOR SIGN-OFF'
          : (verdict === 'WALK_AWAY' || verdict === 'WALK AWAY') ? 'ESCALATE'
          : v0.label,
        tone:
          verdict === 'NEGOTIATE' ? 'Defects to rectify before sign-off / final payment.'
          : verdict === 'PROCEED' ? 'Clean handover — ready to sign off.'
          : (verdict === 'WALK_AWAY' || verdict === 'WALK AWAY') ? 'Major contract breach — escalate to the VBA or your contract administrator.'
          : v0.tone,
      }
    : v0;
  const majorDefects = Array.isArray(analysis.major_defects) ? analysis.major_defects : [];
  const minorDefects = Array.isArray(analysis.minor_defects) ? analysis.minor_defects : [];
  const pestFindings = Array.isArray(analysis.pest_findings) ? analysis.pest_findings : [];
  const conveyancerQs = Array.isArray(analysis.conveyancer_questions) ? analysis.conveyancer_questions : [];
  const complianceGaps = Array.isArray(analysis.rental_compliance_gaps) ? analysis.rental_compliance_gaps : [];
  const complianceInspections = Array.isArray(analysis.compliance_inspections_recommended) ? analysis.compliance_inspections_recommended : [];
  const capex = analysis.capex_forecast || null;

  const longCopy =
    analysis.builder_rectification_letter ||
    analysis.negotiation_language ||
    null;
  const longCopyLabel = analysis.builder_rectification_letter
    ? 'Builder Rectification Letter'
    : 'Negotiation Letter (ready to send to your agent)';
  const address = analysis.property_address || report.property_address || 'Property address not detected';
  const inspectionDate = analysis.inspection_date || '';
  const era = analysis.building_era || '';
  const negotiation = analysis.negotiation_amount;

  return (
    <Document
      title={`Report Decoded — ${address}`}
      author={agent?.business_name || 'Report Decoded'}
      creator="Report Decoded"
    >
      {/* ───────── PAGE 1: COVER + VERDICT + SUMMARY ───────── */}
      <Page size="A4" style={styles.page}>
        <BrandHeader agent={agent} brandUrl={brandUrl} />

        <Text style={styles.h1}>{address}</Text>
        <Text style={styles.small}>
          {inspectionDate ? `Inspected ${inspectionDate}` : 'Inspection report'}
          {era ? ` · ${era}` : ''}
        </Text>

        {/* Verdict block */}
        <View style={[styles.verdictBlock, { backgroundColor: v.bg }]}>
          <Text style={[styles.verdictLabel, { color: v.fg }]}>{v.label}</Text>
          {v.tone ? <Text style={[styles.verdictTone, { color: C.text }]}>{v.tone}</Text> : null}
        </View>

        {/* Summary 4-up */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: C.red }]}>{majorDefects.length}</Text>
            <Text style={styles.statLabel}>Major</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: C.gold }]}>{minorDefects.length}</Text>
            <Text style={styles.statLabel}>Minor</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#92400E' }]}>{pestFindings.length}</Text>
            <Text style={styles.statLabel}>Pest</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: C.navy, fontSize: 14 }]}>
              {/* Headline = likely total (sum of midpoints) when present;
                  fall back to the naive band midpoint for older reports. */}
              {formatAud(
                Number.isFinite(analysis.total_repair_cost_likely) && analysis.total_repair_cost_likely > 0
                  ? analysis.total_repair_cost_likely
                  : Math.round(((analysis.total_repair_cost_low || 0) + (analysis.total_repair_cost_high || 0)) / 2)
              )}
            </Text>
            <Text style={styles.statLabel}>
              Likely repair cost ({formatAud(analysis.total_repair_cost_low)} – {formatAud(analysis.total_repair_cost_high)})
            </Text>
          </View>
        </View>

        {/* Negotiation hero — only for pre-purchase */}
        {Number.isFinite(negotiation) && negotiation > 0 && analysis.negotiation_language ? (
          <View style={styles.negHero}>
            <Text style={styles.negHeroLabel}>SUGGESTED NEGOTIATION</Text>
            <Text style={styles.negHeroValue}>{formatAud(negotiation)} off the contract price</Text>
            <Text style={styles.negHeroSub}>
              Based on the midpoint of repair-cost estimates, adjusted for severity.
            </Text>
          </View>
        ) : null}

        {analysis.verdict_summary ? (
          <View>
            <Text style={styles.h2}>Summary</Text>
            <Text style={{ fontSize: 11, lineHeight: 1.6 }}>{analysis.verdict_summary}</Text>
          </View>
        ) : null}

        {capex ? (
          <View>
            <Text style={styles.h2}>5-Year Cost Forecast</Text>
            {[
              { key: 'year_1_urgent', label: 'Year 1 — urgent', color: C.red },
              { key: 'year_1_to_3', label: 'Year 1–3 — planned', color: C.gold },
              { key: 'year_3_to_5', label: 'Year 3–5 — anticipated', color: C.teal },
            ].map(({ key, label, color }) => {
              const b = capex[key];
              if (!b) return null;
              return (
                <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, paddingBottom: 6, borderBottomWidth: key === 'year_3_to_5' ? 0 : 0.5, borderBottomColor: C.border, gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: C.navy, marginBottom: 2 }}>{label}</Text>
                    {b.summary ? <Text style={{ fontSize: 9.5, color: C.muted, lineHeight: 1.4 }}>{b.summary}</Text> : null}
                  </View>
                  <Text style={{ fontFamily: 'Courier-Bold', fontSize: 11, color, whiteSpace: 'nowrap' }}>
                    {formatAud(b.low)} – {formatAud(b.high)}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}

        <Footer brandUrl={brandUrl} />
      </Page>

      {/* ───────── PAGE 2+: MAJOR DEFECTS ───────── */}
      {majorDefects.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <BrandHeader agent={agent} brandUrl={brandUrl} />
          <Text style={styles.h2}>Major Defects</Text>
          {majorDefects.map((d, i) => (
            <DefectCardView key={`major-${i}`} defect={d} kind="major" />
          ))}
          <Footer brandUrl={brandUrl} />
        </Page>
      ) : null}

      {/* ───────── MINOR DEFECTS ───────── */}
      {minorDefects.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <BrandHeader agent={agent} brandUrl={brandUrl} />
          <Text style={styles.h2}>Minor Defects</Text>
          {minorDefects.map((d, i) => (
            <DefectCardView key={`minor-${i}`} defect={d} kind="minor" />
          ))}
          <Footer brandUrl={brandUrl} />
        </Page>
      ) : null}

      {/* ───────── PEST FINDINGS ───────── */}
      {pestFindings.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <BrandHeader agent={agent} brandUrl={brandUrl} />
          <Text style={styles.h2}>Pest Findings</Text>
          {pestFindings.map((d, i) => (
            <DefectCardView key={`pest-${i}`} defect={d} kind="pest" />
          ))}
          <Footer brandUrl={brandUrl} />
        </Page>
      ) : null}

      {/* ───────── INVESTOR COMPLIANCE (only if populated) ───────── */}
      {(complianceGaps.length > 0 || complianceInspections.length > 0) ? (
        <Page size="A4" style={styles.page}>
          <BrandHeader agent={agent} brandUrl={brandUrl} />

          {complianceGaps.length > 0 ? (
            <>
              <Text style={styles.h2}>Rental Compliance Gaps</Text>
              <Text style={{ fontSize: 9.5, color: C.muted, marginBottom: 10, lineHeight: 1.4 }}>
                Items from this inspection that may block legal letting or breach state minimum rental standards. Fix before signing a lease.
              </Text>
              {complianceGaps.map((g, i) => {
                const sev = g.severity === 'blocks_letting' ? { bg: C.redBg, fg: C.red, label: 'BLOCKS LETTING' }
                          : g.severity === 'risk' ? { bg: C.goldBg, fg: C.gold, label: 'RISK' }
                          : { bg: C.cream2, fg: C.muted, label: 'RECOMMENDED' };
                const pageRef = formatPages(g.source_pages);
                const hasCosts = Number.isFinite(g.estimated_cost_low) && g.estimated_cost_low > 0;
                return (
                  <View key={`gap-${i}`} style={styles.defectCard} wrap={false}>
                    <View style={styles.defectHeader}>
                      <Text style={[styles.defectName, { flex: 1 }]}>{g.item}</Text>
                      <Text style={[styles.defectBadge, { backgroundColor: sev.fg }]}>{sev.label}</Text>
                    </View>
                    {g.regulation ? (
                      <Text style={[styles.defectMeta, { fontStyle: 'italic' }]}>{g.regulation}</Text>
                    ) : null}
                    {pageRef ? (
                      <Text style={styles.defectRef}>INSPECTOR REF: {pageRef}</Text>
                    ) : null}
                    {g.rectification_action ? (
                      <Text style={styles.defectDesc}>{g.rectification_action}</Text>
                    ) : null}
                    {hasCosts ? (
                      <Text style={styles.defectCost}>
                        COST: {formatAud(g.estimated_cost_low)} – {formatAud(g.estimated_cost_high)}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </>
          ) : null}

          {complianceInspections.length > 0 ? (
            <>
              <Text style={styles.h2}>Commission separately before letting</Text>
              <Text style={{ fontSize: 9.5, color: C.muted, marginBottom: 10, lineHeight: 1.4 }}>
                Compliance checks the building/pest inspection does NOT cover — but still required before legally letting.
              </Text>
              {complianceInspections.map((c, i) => (
                <View key={`cir-${i}`} style={styles.defectCard} wrap={false}>
                  <Text style={[styles.defectName, { marginBottom: 4 }]}>{c.type}</Text>
                  {c.why_needed ? (
                    <Text style={styles.defectDesc}>{c.why_needed}</Text>
                  ) : null}
                  {/* No emojis — @react-pdf's fontkit has no emoji font registered, so 👤/💰/🔄 render with broken metrics that corrupt the card height and cause heading overlap on subsequent cards. */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
                    {c.who_performs ? <Text style={{ fontSize: 9.5, color: C.muted }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Who: </Text>{c.who_performs}</Text> : null}
                    {c.typical_cost ? <Text style={{ fontSize: 9.5, color: C.muted }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Cost: </Text>{c.typical_cost}</Text> : null}
                    {c.frequency ? <Text style={{ fontSize: 9.5, color: C.muted }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Frequency: </Text>{c.frequency}</Text> : null}
                  </View>
                </View>
              ))}
            </>
          ) : null}

          <Footer brandUrl={brandUrl} />
        </Page>
      ) : null}

      {/* ───────── NEGOTIATION / RECTIFICATION LETTER + QUESTIONS ───────── */}
      {(longCopy || conveyancerQs.length > 0) ? (
        <Page size="A4" style={styles.page}>
          <BrandHeader agent={agent} brandUrl={brandUrl} />

          {longCopy ? (
            <>
              <Text style={styles.h2}>{longCopyLabel}</Text>
              <View style={styles.longBlock}>
                <Text>{longCopy}</Text>
              </View>
            </>
          ) : null}

          {conveyancerQs.length > 0 ? (
            <>
              <Text style={styles.h2}>Questions to ask your conveyancer / solicitor</Text>
              {conveyancerQs.map((q, i) => (
                <View key={`q-${i}`} style={styles.bullet}>
                  <Text style={styles.bulletDot}>{i + 1}.</Text>
                  <Text style={styles.bulletText}>{q}</Text>
                </View>
              ))}
            </>
          ) : null}

          {analysis.if_builder_refuses_note ? (
            <>
              <Text style={styles.h2}>If the builder refuses to rectify</Text>
              <View style={styles.longBlock}>
                <Text>{analysis.if_builder_refuses_note}</Text>
              </View>
            </>
          ) : null}

          {analysis.what_report_does_not_cover ? (
            <>
              <Text style={styles.h2}>What this report doesn't cover</Text>
              <Text style={{ fontSize: 10, lineHeight: 1.5 }}>{analysis.what_report_does_not_cover}</Text>
            </>
          ) : null}

          <Text style={styles.h2}>Disclaimer</Text>
          <Text style={{ fontSize: 9.5, lineHeight: 1.5, color: C.muted }}>
            This analysis is generated by AI from the inspector's report. It is for general
            information only and is not a substitute for professional building advice. Always
            consult a licensed builder, structural engineer, or pest inspector before making
            final purchase decisions. Cost estimates are based on Australian market rates and
            may vary by location, severity, and trade availability.
            {agent?.business_name ? ` Provided by ${agent.business_name}.` : ' Provided by Report Decoded.'}
          </Text>

          <Footer brandUrl={brandUrl} />
        </Page>
      ) : null}
    </Document>
  );
}
