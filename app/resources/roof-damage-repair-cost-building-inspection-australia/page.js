import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('roof-damage-repair-cost-building-inspection-australia');

const faqs = [
  {
    q: 'My inspection said "roof tiles at end of life" — do I need a full re-roof?',
    a: 'Not necessarily right now, but plan for it. "End of life" means the tiles are in the final stage of their serviceable lifespan — typically cracking, spalling, or becoming porous. A licensed roofer can confirm whether you have 1 year or 5 years left. For negotiation purposes, treat it as a $15,000–$45,000 item even if the roof is not yet actively leaking.',
  },
  {
    q: 'How long do terracotta roof tiles last in Australia?',
    a: 'Terracotta tiles generally last 50–100 years depending on quality, climate, and maintenance. Concrete tiles typically last 30–50 years. The mortar, sarking, valley iron, and flashings supporting the tiles often fail well before the tiles themselves — which is why inspectors will flag those components separately even on a roof where the tiles look serviceable.',
  },
  {
    q: 'Can I negotiate roof replacement costs even if the tiles aren\'t actually leaking yet?',
    a: 'Yes. A building inspection finding of "tiles approaching end of service life" or "full roof assessment recommended" is a legitimate defect regardless of whether water is currently entering the property. Vendors and their agents know this. You can negotiate on the basis of a future cost that you, as the buyer, will be required to bear. Get a roofing contractor quote before exchange to strengthen your position.',
  },
  {
    q: 'What\'s the difference between ridge repointing and a full re-roof?',
    a: 'Ridge repointing is a targeted repair to the mortar holding the capping tiles at the roof peak. It costs $500–$5,000 and leaves the main tile surface untouched. A full re-roof involves removing all tiles, replacing the battens and sarking, and re-laying new or recycled tiles across the entire surface — costing $15,000–$45,000. Your inspector\'s language will tell you which applies: "ridge cap mortar deteriorating" points to repointing; "tiles approach end of service life across roof surface" points toward a full re-roof discussion.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Roof damage in your building inspection: repair costs and what to do next (Australia, 2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            Roof defects appear in roughly <strong>60–70% of Australian building inspections</strong> and are the most misunderstood major finding. &ldquo;Roof requires attention&rdquo; can mean $800 in ridge repointing or $35,000 in a full re-roof. The difference lies in which specific defect your inspector documented. This guide breaks down what each common roof finding costs at 2026 Australian trade rates and how to use them in a price negotiation.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'how-to-read-as4349-1-inspection-report',
        'just-got-building-inspection-report-australia',
        'building-inspection-report-no-cost-estimates-australia',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={[
        'templestowe',
        'wahroonga',
        'kenmore',
        'norwood',
        'subiaco',
      ]}
    >
      <p>
        Roof findings are the single most common major defect category in Australian building inspection reports. They appear in roughly 60–70% of reports, yet they are also the category buyers most frequently misread. The problem is that inspector language is deliberately conservative and non-specific — &ldquo;roof requires attention&rdquo; or &ldquo;further investigation recommended&rdquo; tells you almost nothing about cost or urgency.
      </p>
      <p>
        The actual range is enormous. A single line about the roof in your report could represent a $500 mortar repair or a $45,000 full re-roof. Your inspector&apos;s specific wording — the component named, the language used to describe its condition, and whether a specialist referral is recommended — is the key to understanding where you sit on that spectrum.
      </p>
      <p>
        This guide covers the most common roof defect types found in Australian building inspections, what each costs to repair or replace at 2026 trade rates, and how to use those numbers when negotiating with the vendor.
      </p>

      <h2>Common roof defect types and what they cost (2026 AU trade rates)</h2>

      <h3>Ridge capping and ridge mortar</h3>
      <p>
        The ridge is the apex of your pitched roof — the highest point where two roof planes meet. Ridge capping tiles sit along this line, held in place by mortar. Over time, that mortar cracks, shrinks, and pulls away from the tiles, creating gaps where water can enter. It is one of the most common findings in homes over 20 years old.
      </p>
      <p>
        <strong>Inspector language to look for:</strong> &ldquo;ridge cap mortar deteriorating,&rdquo; &ldquo;ridge requires repointing,&rdquo; &ldquo;hollow ridge capping noted,&rdquo; &ldquo;mortar bedding failed to ridge.&rdquo;
      </p>
      <p>
        <strong>Cost to repair:</strong> $500–$2,500 for a partial repoint of the worst sections; $1,500–$5,000 for a full ridge repoint across the entire roof length. Prices vary by roof pitch, ridge length, and access difficulty.
      </p>
      <p>
        <strong>Urgency:</strong> Medium. Ridge mortar failure is not a structural problem, but it is an active water entry risk during heavy rain. It tends to worsen faster once deterioration begins.
      </p>

      <h3>Valley iron and valley flashing</h3>
      <p>
        Where two roof planes meet at a V-shaped angle, a metal channel called a valley iron (or valley flashing) directs rainwater down and off the roof. In homes built before the 1980s, these are often galvanised steel that has long since corroded. When valley iron fails, water tracks sideways under adjacent tiles rather than down the channel.
      </p>
      <p>
        <strong>Inspector language to look for:</strong> &ldquo;valley iron corroded,&rdquo; &ldquo;valley iron at end of service life,&rdquo; &ldquo;rusted valley flashing,&rdquo; &ldquo;valley flashings require replacement.&rdquo;
      </p>
      <p>
        <strong>Cost to repair:</strong> $800–$3,000 per valley, depending on valley length and roof access. A home with multiple valleys (common in Queenslander or hip-roofed homes) can accumulate $5,000–$10,000 in valley work alone.
      </p>
      <p>
        <strong>Urgency:</strong> Medium-high. A failed valley is an active water entry point during any rain event. Inspectors will often flag this as a priority repair.
      </p>

      <h3>Broken, cracked, or slipped tiles</h3>
      <p>
        Individual tiles can crack from impact (hail, falling branches), slip out of position when the nailing or bedding fails, or simply degrade at end of life. The key question is whether damage is isolated to a small area or widespread across the roof surface.
      </p>
      <p>
        <strong>Inspector language to look for:</strong> &ldquo;cracked tiles observed to front elevation,&rdquo; &ldquo;several tiles displaced,&rdquo; &ldquo;multiple slipped tiles to north slope,&rdquo; &ldquo;tile breakage noted.&rdquo;
      </p>
      <p>
        <strong>Cost to repair:</strong> $300–$1,500 for isolated tile replacement (a few tiles in one area); $5,000–$15,000 if damage is extensive across multiple elevations.
      </p>
      <p>
        <strong>Urgency:</strong> Medium. Localised water entry occurs at the cracked or displaced tile until repaired. Widespread tile damage combined with other findings (deteriorated mortar, failed valley iron) typically prompts a full re-roof assessment.
      </p>

      <h3>Sarking (roof underlay)</h3>
      <p>
        Sarking is the foil or felt layer installed under roof tiles, sitting between the tiles and the timber battens. It provides a secondary weather barrier — if water gets past the tiles, sarking redirects it to the gutters rather than into the ceiling. Pre-1980s homes were often built without sarking, or have sarking that has degraded beyond function.
      </p>
      <p>
        <strong>Inspector language to look for:</strong> &ldquo;no sarking installed,&rdquo; &ldquo;sarking absent,&rdquo; &ldquo;sarking deteriorated and not providing secondary weather protection.&rdquo;
      </p>
      <p>
        <strong>Cost:</strong> Retrofitting sarking is expensive and disruptive — $8,000–$20,000 — because it requires removing all existing tiles, laying new sarking, and re-laying the tiles. For this reason it is rarely done as a standalone repair. Instead, sarking is typically addressed when a full re-roof is already scheduled for other reasons.
      </p>
      <p>
        <strong>In a negotiation context:</strong> An absent sarking finding alone is not typically a negotiation anchor unless paired with other findings that justify a full re-roof. Note it in your <Link href="/resources/how-much-to-negotiate-after-building-inspection">negotiation list</Link> as a cumulative cost item.
      </p>

      <h3>Roof membrane (flat and low-pitched roofs)</h3>
      <p>
        Flat or low-pitched roofs — common in 1960s–1980s residential buildings and in commercial-influenced residential designs — rely on membrane systems rather than tiles. These membranes have a finite lifespan and degrade through UV exposure, thermal movement, and ponding water.
      </p>
      <p>
        <strong>Inspector language to look for:</strong> &ldquo;membrane blistering observed,&rdquo; &ldquo;flat roof membrane at end of service life,&rdquo; &ldquo;membrane repairs required,&rdquo; &ldquo;evidence of previous membrane patching.&rdquo;
      </p>
      <p>
        <strong>Cost:</strong> $3,000–$12,000 for section repairs or partial replacement; $15,000–$40,000 for a full membrane replacement, depending on roof area and system type (torch-on, PVC, TPO).
      </p>
      <p>
        <strong>Urgency:</strong> High once membrane failure is confirmed. Flat roofs allow water to pond rather than drain, and a failed membrane means direct water ingress into the building structure.
      </p>

      <h3>Full re-roof (terracotta and concrete tiles)</h3>
      <p>
        A full re-roof is recommended when the tile surface is approaching or at end of life across the majority of the roof, when multiple defect types combine to make targeted repairs uneconomical, or when the inspector identifies widespread structural issues with the tile bedding system.
      </p>
      <p>
        <strong>Inspector language to look for:</strong> &ldquo;roof tiles approach end of service life,&rdquo; &ldquo;recommend full roof assessment by licensed roofing contractor,&rdquo; &ldquo;roofing in overall poor condition requiring further investigation.&rdquo;
      </p>
      <p>
        <strong>Cost:</strong> $15,000–$45,000 depending on roof area, pitch complexity, tile material, and whether new or recycled tiles are used. Larger homes (four-bedroom+) in markets like Wahroonga or Templestowe with complex hip roofs regularly reach the upper end of this range.
      </p>
      <p>
        <strong>Urgency:</strong> Plan within 1–3 years if tiles are at end of life but not yet actively failing. Budget accordingly from day one of ownership.
      </p>

      <h3>Gutters and downpipes</h3>
      <p>
        Gutter and downpipe defects are extremely common and often appear alongside roof findings. Common issues include rusted gutters, blocked or missing downpipes, inadequate fall causing ponding, and discharge to incorrect locations.
      </p>
      <p>
        <strong>Cost:</strong> $1,000–$5,000 depending on linear metres of guttering and downpipe configuration. Colorbond replacement guttering at the higher end.
      </p>
      <p>
        Gutter findings alone rarely anchor a negotiation, but they add meaningfully to your total roof-related repair figure.
      </p>

      <h2>How to read roof findings in a negotiation context</h2>
      <p>
        Not every roof finding carries equal negotiating weight. Here is how to tier what you have found:
      </p>
      <ul>
        <li><strong>Isolated, localised findings (1–3 tiles, partial ridge section):</strong> $500–$3,000 range. Include in your overall defect list but these are not primary negotiation anchors. They support a broader claim but will not move a vendor on price by themselves.</li>
        <li><strong>Valley iron + ridge mortar + gutters (common combination in 1960s–1980s homes):</strong> $3,000–$8,000 total. This is a solid, defensible negotiation line item. A single email quoting three specific defects and a combined repair estimate is reasonable and common.</li>
        <li><strong>Full re-roof recommendation:</strong> $15,000–$45,000. This is a primary negotiation anchor. Vendors and their solicitors understand what a roofing contractor quote means. You can legitimately request a price reduction, a vendor-funded repair before settlement, or a contribution to a roofing escrow held by both parties&apos; conveyancers.</li>
      </ul>
      <p>
        The key to any roof negotiation is specificity. &ldquo;The roof needs work&rdquo; gets dismissed. &ldquo;The inspector identified deteriorated valley iron to two valleys, hollow ridge capping across the full ridge length, and rusted gutters — combined repair estimate $5,500–$8,000&rdquo; is a different conversation entirely. See our guide on <Link href="/resources/how-much-to-negotiate-after-building-inspection">how much to negotiate after a building inspection</Link> for how to structure the full request.
      </p>

      <h2>When &ldquo;further investigation recommended&rdquo; appears for the roof</h2>
      <p>
        Building inspectors are generalists working under AS 4349.1. When a roof is steep-pitched, partially obstructed, or shows signs of concealed defects, an inspector will often defer to a licensed roofing contractor rather than speculate. This is not a red flag — it is the inspector doing their job correctly.
      </p>
      <p>
        If your report includes language like &ldquo;recommend assessment by licensed roofing contractor,&rdquo; treat this seriously. A roofing contractor inspection costs $300–$600 and can be arranged within a few days in most capital cities. If you are still within your due diligence period, this is worth doing before exchange — especially on homes built before 1985 where tile and sarking life expectancy is genuinely uncertain.
      </p>
      <p>
        If the vendor is unwilling to extend the inspection period to allow for a roofing contractor assessment, factor that resistance into your decision-making. A vendor who will not allow a $400 roof check on a $900,000 property is sending a signal.
      </p>
      <p>
        For more on how AS 4349.1 shapes what inspectors can and cannot say, see our guide to <Link href="/resources/how-to-read-as4349-1-inspection-report">reading an AS 4349.1 inspection report</Link>.
      </p>

      <h2>Roof replacement vs roof repair — getting the right quote</h2>
      <p>
        A building inspector&apos;s role is to identify defects, not to quote repairs. This means the inspector who wrote your report is not the right person to call for a repair price — a licensed roofing contractor is.
      </p>
      <p>
        Before anchoring a negotiation on a full re-roof cost, get at least one roofing contractor to inspect and quote. Many conveyancers will advise holding a major re-roof negotiation until a contractor quote exists — and they&apos;re right. A contractor quote transforms your negotiation from &ldquo;the inspector mentioned the roof&rdquo; to &ldquo;we have a $28,000 quote for a full re-roof.&rdquo;
      </p>
      <p>
        When seeking quotes, be specific about what the inspector found. Share the relevant pages of your inspection report. Ask the contractor to quote on the specific defects identified, not just a general &ldquo;how much to re-roof.&rdquo; You want a line-itemised quote you can attach to your negotiation correspondence.
      </p>
      <p>
        If you have just received your inspection report and are still working out where to start, our guide for buyers who have <Link href="/resources/just-got-building-inspection-report-australia">just received a building inspection report</Link> covers the full process step by step.
      </p>

      <h2>What Report Decoded does for roof findings</h2>
      <p>
        Building inspection reports use technical shorthand that is written for other building professionals, not for buyers. &ldquo;Valley iron at end of service life to W elevation — refer licensed roofing contractor&rdquo; is accurate and defensible inspector language. It is also nearly useless to someone trying to decide whether to proceed with a $780,000 purchase.
      </p>
      <p>
        Report Decoded reads your full inspection PDF and, for $59, returns a plain-English breakdown of every finding — including roof defects — with:
      </p>
      <ul>
        <li><strong>Plain-English explanation</strong> — what the finding actually means, in language that does not require a building background to understand</li>
        <li><strong>2026 cost ranges</strong> — for each specific defect type identified, based on current Australian trade rates</li>
        <li><strong>Urgency rating</strong> — which findings need attention before settlement and which can wait</li>
        <li><strong>Tradie contacts</strong> — roofing contractors and relevant tradespeople in your area who handle the specific defect types found</li>
        <li><strong>Negotiation letter</strong> — a draft letter to your agent or the vendor&apos;s solicitor with roof-specific line items and cost estimates ready to use</li>
      </ul>
      <p>
        Analysis takes under 2 minutes. If the PDF cannot be analysed, you get a full refund. There are no subscriptions.
      </p>
      <p>
        If your report came back without cost estimates — which is standard under AS 4349.1 — our guide on <Link href="/resources/building-inspection-report-no-cost-estimates-australia">why building inspection reports don&apos;t include costs</Link> explains why, and how to get those numbers without waiting weeks for contractor quotes.
      </p>
    </ArticleLayout>
  );
}
