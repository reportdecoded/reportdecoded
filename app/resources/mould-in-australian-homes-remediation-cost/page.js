import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('mould-in-australian-homes-remediation-cost');

const faqs = [
  {
    q: 'Is all black mould stachybotrys / "toxic"?',
    a: 'No. "Black mould" is colloquial — many mould species appear black or dark, including harmless cladosporium and aspergillus niger. Stachybotrys chartarum (the "toxic black mould" of media coverage) is a specific species that produces mycotoxins under certain conditions, requires sustained moisture, and is less common than people assume. Identification requires lab testing — visual inspection alone can\'t distinguish stachybotrys from other dark moulds. Practical implication: don\'t panic at any black mould, but DO take it seriously enough to identify the moisture source and remediate properly. The species matters less than the moisture problem behind it.',
  },
  {
    q: 'Will my building inspector test for mould?',
    a: 'No. AS4349.1 inspections are visual-only — inspectors will note where mould is visible ("mould evident to bathroom ceiling," "fungal growth on subfloor framing," "discoloration consistent with mould to wardrobe wall") but won\'t identify the species or quantify the contamination. Most inspectors also won\'t inspect inside wall cavities, behind built-in cabinetry, under floor coverings, or in concealed roof voids where most "hidden" mould lives. Testing — air sampling, surface swabs, or ERMI DNA testing — is a separate $400-$1,500 specialist service commissioned through a licensed mould remediation company or environmental hygienist.',
  },
  {
    q: 'Can I just clean mould myself with bleach?',
    a: 'For small surface mould (under 1m², on a non-porous surface, with the moisture source already eliminated) — yes, but use a fungicidal cleaner rather than bleach. Bleach kills surface mould but doesn\'t penetrate porous materials like plasterboard, timber, or grout, so re-growth from below the surface is common within 6-12 months. Commercial fungicidal products (Concrobium, Selleys Rapid Mould Killer, vinegar + bicarb for sensitive areas) work better. The bigger rule: surface cleaning ONLY works if the moisture source is fixed. Mould grows because moisture is there. Kill the moisture, the mould doesn\'t come back. Clean the mould without fixing the moisture, you\'re wasting your time.',
  },
  {
    q: 'What does mould remediation actually cost?',
    a: 'Three tiers. DIY surface cleaning (small bathroom, kitchen, window frame mould): $50-$200 in products. Professional Category 1 cleaning (single room, surface mould, moisture source already addressed): $800-$2,500. Category 2 remediation (multiple rooms, materials need replacement, e.g. mouldy plasterboard, carpet, insulation): $3,500-$12,000. Category 3 full remediation (extensive hidden mould, contaminated cavities, HVAC system contamination, requires containment and HEPA filtration): $12,000-$40,000+. Costs are dominated by the moisture rectification work (waterproofing, plumbing, ventilation), not the mould cleaning itself — typically 60-70% of total project cost is the cause-fix, not the symptom-fix.',
  },
  {
    q: 'Does mould always come back after cleaning?',
    a: 'Only if the moisture source isn\'t fixed. Mould requires three things to grow: organic material to feed on (plasterboard, timber, dust, soap residue — abundant in any house), the right temperature (10-35°C — all Australian homes), and moisture. The first two are unavoidable. Moisture is the only controllable variable. If a mould remediation contractor cleans the surface but doesn\'t address what caused the moisture — a leaking shower seal, a blocked weep hole, inadequate bathroom extraction, a downpipe disconnection — the mould reliably returns within 6-12 months. Reputable contractors will refuse to do remediation without addressing the moisture cause. If a quote doesn\'t include moisture rectification, it\'s incomplete.',
  },
  {
    q: 'Will mould affect my home insurance or future resale?',
    a: 'Insurance: most AU home and contents policies exclude damage caused by "gradual deterioration" or "lack of maintenance," which is how insurers classify most mould claims. Sudden water-damage-driven mould (burst pipe, storm flooding) is generally covered. Slow-leak or condensation-driven mould generally isn\'t. Check your specific policy wording. Resale: mould remediation history isn\'t legally required disclosure in most AU states (it\'s not on standard vendor disclosure forms), but inspectors will identify residual moisture indicators, and savvy buyers will ask. Practical impact on sale price: $0-$10,000 reduction for a property with a credible past-remediation paper trail (invoices, fixed moisture source, current dry readings), $20K-$80K+ reduction for active mould visible at inspection.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Mould in Australian homes: remediation cost and what inspections miss (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Visible mould is a symptom — the real question is
            what&apos;s feeding it.</strong> Surface cleaning without
            fixing the moisture source guarantees regrowth within 6-12
            months. Cost tiers: DIY{' '}
            <strong>$50-$200</strong>, professional Category 1
            cleaning <strong>$800-$2,500</strong>, Category 2
            remediation with material replacement{' '}
            <strong>$3,500-$12,000</strong>, Category 3 full
            remediation with containment{' '}
            <strong>$12,000-$40,000+</strong>. 60-70% of project cost
            is moisture rectification, not mould removal. AS4349.1
            inspections only catch visible mould; species and hidden
            contamination require specialist testing ($400-$1,500).
            For negotiation, the leverage is the documented moisture
            cause, not the mould itself.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'rising-damp-australia-how-much-to-fix',
        'what-is-as4349-1',
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-much-to-negotiate-after-building-inspection',
        'concrete-cancer-spalling-cost-australia',
      ]}
      related_suburbs={[
        'bondi',
        'manly',
        'mornington',
        'toowong',
        'sunnybank',
      ]}
    >
      <p>
        Your building inspector flagged it. &ldquo;Mould evident to
        bathroom ceiling.&rdquo; &ldquo;Fungal growth observed on
        subfloor framing.&rdquo; &ldquo;Discoloration consistent with
        mould to wardrobe wall.&rdquo;
      </p>
      <p>
        You start Googling. Within ten minutes you&apos;ve found
        articles saying it&apos;s a $300 fix, articles saying it&apos;s
        a $40,000 nightmare, and articles saying you&apos;ll die from
        toxic mould syndrome. None of them tell you what to actually
        do about your specific finding.
      </p>
      <p>
        Here&apos;s the honest version. Mould is one of the most
        misunderstood inspection findings in Australian property due
        diligence. The visible mould isn&apos;t the problem — it&apos;s
        a symptom of a moisture problem that&apos;s already been
        running long enough to feed organic growth. The cost of
        addressing it depends almost entirely on what&apos;s causing
        the moisture, not on how much mould you can see.
      </p>

      <h2>Why mould grows where it grows</h2>
      <p>
        Mould needs three things to colonise a surface:
      </p>
      <ul>
        <li>
          <strong>Organic material to feed on.</strong> Plasterboard
          paper backing, timber, dust, soap residue, fabric, carpet,
          adhesives. Every house has these in abundance.
        </li>
        <li>
          <strong>The right temperature.</strong> Mould grows
          actively between 10-35°C. Every habitable Australian
          building falls inside this range year-round.
        </li>
        <li>
          <strong>Moisture.</strong> Specifically, surface relative
          humidity above 70% sustained for 24-48 hours. This is the
          only controllable variable.
        </li>
      </ul>
      <p>
        Mould grows because moisture is there. Kill the moisture, the
        mould doesn&apos;t come back. Clean the mould without fixing
        the moisture, it reliably returns within 6-12 months. This is
        the single most important sentence in this article.
      </p>

      <h2>Where mould hides in Australian homes</h2>
      <p>
        Visible mould is the obvious case. The expensive cases are
        usually hidden — moisture migrating through cavities, growing
        on the back side of materials, only becoming visible when
        bulk material is removed.
      </p>
      <p>
        The places mould typically hides in AU stock:
      </p>
      <ul>
        <li>
          <strong>Wet area ceilings and walls</strong> — bathroom
          ceilings above showers (failing exhaust + condensation),
          laundry walls behind washing machines.
        </li>
        <li>
          <strong>Behind built-in kitchen cabinets and pantry</strong>{' '}
          — particularly where plumbing penetrations weren&apos;t
          properly sealed. Slow under-sink leaks feed mould on the
          cabinet back panel for years before becoming visible.
        </li>
        <li>
          <strong>Under floor coverings</strong> — vinyl or carpet
          over a poorly-sealed wet slab, or in subfloor cavities
          where ground moisture is rising.
        </li>
        <li>
          <strong>Subfloor framing</strong> — particularly inadequate
          subfloor ventilation in Victorian-era cottages, or where
          stormwater is dispersing under the slab.
        </li>
        <li>
          <strong>Roof voids</strong> — after even a small roof leak
          or eaves penetration. The roof void becomes a humid
          chamber that supports mould on rafters, trusses, and
          insulation paper.
        </li>
        <li>
          <strong>Cool-side wall cavities</strong> — south or
          south-east facing external walls in cooler climates where
          warm internal air condenses on the cold wall surface.
          Particularly bedrooms in poorly-insulated double-brick
          construction.
        </li>
        <li>
          <strong>HVAC ducting</strong> — older ducted heating/cooling
          systems where condensation has formed inside the ductwork.
          Mould spores then circulate through the entire house.
        </li>
        <li>
          <strong>Behind wardrobes against external walls</strong>{' '}
          — particularly when the wardrobe blocks air circulation
          against a cold external wall.
        </li>
      </ul>

      <h2>What inspectors catch vs miss</h2>
      <p>
        Standard{' '}
        <Link href="/resources/what-is-as4349-1">
          AS4349.1 building inspections
        </Link>{' '}
        are visual-only and non-invasive. The inspector will identify:
      </p>
      <ul>
        <li>
          Visible mould on accessible surfaces.
        </li>
        <li>
          Staining and discoloration consistent with current or past
          mould.
        </li>
        <li>
          Elevated moisture meter readings on visible surfaces
          (most inspectors carry a pin-type or non-invasive moisture
          meter).
        </li>
        <li>
          Conditions conducive to mould — poor ventilation, failed
          waterproofing, condensation patterns, inadequate eaves
          drainage.
        </li>
      </ul>
      <p>
        Standard scope does <em>not</em> include:
      </p>
      <ul>
        <li>
          Species identification (requires lab testing).
        </li>
        <li>
          Hidden mould inside wall cavities, behind cabinets, under
          floor coverings, or in inaccessible roof voids.
        </li>
        <li>
          Quantification of contamination (spore counts, ERMI scores).
        </li>
        <li>
          Air quality assessment.
        </li>
        <li>
          Specific remediation cost estimates.
        </li>
      </ul>
      <p>
        When an inspector writes &ldquo;mould evident — further
        investigation recommended&rdquo; that&apos;s your trigger to
        commission a specialist mould assessment ($400-$1,500) before
        settlement. Without it you have no quantified scope to
        negotiate against.
      </p>

      <h2>The species question: does it matter?</h2>
      <p>
        Mould species matters less than the moisture problem behind
        it, but here&apos;s the brief version of what the lab might
        find:
      </p>
      <ul>
        <li>
          <strong>Cladosporium</strong> — most common AU indoor
          mould. Visible as olive-green to black patches on damp
          surfaces. Allergenic but not toxigenic. Remediation is
          standard cleaning + moisture rectification.
        </li>
        <li>
          <strong>Aspergillus</strong> — many species, common in
          household dust, growing on damp materials. Some species are
          allergenic, a few can cause respiratory infections in
          immune-compromised people. Standard remediation applies.
        </li>
        <li>
          <strong>Penicillium</strong> — blue-green velvety
          appearance, often on water-damaged materials. Allergenic.
          Standard remediation.
        </li>
        <li>
          <strong>Stachybotrys chartarum</strong> — the &ldquo;toxic
          black mould&rdquo; of media coverage. Requires sustained
          moisture and cellulose substrate. Produces mycotoxins under
          certain growing conditions. Less common than reported.
          When confirmed, treat as Category 3 remediation with
          containment.
        </li>
        <li>
          <strong>Alternaria</strong> — common outdoor mould that
          comes inside on dust. Strong allergen. Standard remediation.
        </li>
      </ul>
      <p>
        Practical takeaway: don&apos;t panic at colour. Visual
        identification is unreliable. Lab speciation matters only
        when you&apos;re deciding between Category 2 and Category 3
        remediation, or when health-sensitive occupants (asthma,
        immune-compromised, infants) are involved.
      </p>

      <h2>What testing actually costs</h2>
      <p>
        Three testing methods, three price points:
      </p>
      <ul>
        <li>
          <strong>Surface swab</strong> — $80-$200 per sample. Lab
          identifies species growing on a specific spot. Useful when
          visible mould needs species confirmation for remediation
          scoping.
        </li>
        <li>
          <strong>Air sampling (spore trap)</strong> — $300-$600 per
          location plus lab analysis. Measures airborne spore
          concentration and species. Useful for comparing indoor vs
          outdoor counts and identifying hidden contamination.
        </li>
        <li>
          <strong>ERMI / mycotoxin DNA testing</strong> — $400-$800
          per sample. Dust sample analysed for DNA from 36 mould
          species. Most sensitive method; detects hidden contamination
          not visible to the eye.
        </li>
      </ul>
      <p>
        For most buyer due diligence: a surface swab on the visible
        mould plus one air sample is sufficient ($400-$800 total).
        ERMI is overkill for typical residential transactions.
      </p>

      <h2>Remediation cost tiers</h2>
      <p>
        The mould industry uses three categories (drawn from US IICRC
        S520 standard, widely adopted in AU). Real 2026 AU pricing:
      </p>
      <ul>
        <li>
          <strong>DIY surface cleaning</strong> — small visible
          mould (under 1m²), non-porous surface, moisture source
          already addressed. Fungicidal cleaner, microfibre cloth,
          PPE. <strong>$50-$200 in products.</strong>
        </li>
        <li>
          <strong>Category 1 — professional cleaning</strong> —
          single room, surface mould on washable materials, moisture
          source already rectified. Pre-clean, fungicidal treatment,
          HEPA vacuum, post-clean verification.{' '}
          <strong>$800-$2,500.</strong>
        </li>
        <li>
          <strong>Category 2 — partial remediation</strong> — multiple
          affected rooms, OR porous materials need replacement
          (mouldy plasterboard, soaked insulation, carpet underlay).
          Containment of work area, controlled material removal,
          replacement of affected materials, fungicidal treatment,
          HEPA filtration, clearance testing.{' '}
          <strong>$3,500-$12,000.</strong>
        </li>
        <li>
          <strong>Category 3 — full remediation</strong> — extensive
          hidden mould, cavity contamination, HVAC system
          contamination, confirmed stachybotrys. Full containment with
          negative air pressure, PPE, protected disposal, HEPA
          filtration, multiple verification rounds, post-remediation
          clearance certificate.{' '}
          <strong>$12,000-$40,000+.</strong>
        </li>
      </ul>
      <p>
        Critical: 60-70% of total project cost is moisture
        rectification, not mould cleaning. A Category 2 mould job
        with a $7,500 total cost typically breaks down as $2,500
        cleaning + $5,000 plumbing/waterproofing/ventilation work to
        eliminate the source. Quotes that don&apos;t include
        moisture work are incomplete — the mould will return.
      </p>

      <h2>The moisture-source checklist</h2>
      <p>
        Before agreeing to any remediation quote, the contractor should
        identify the moisture source. Common AU sources:
      </p>
      <ul>
        <li>
          <strong>Failed shower waterproofing</strong> — bathroom
          membrane breach. $3,500-$8,000 to re-waterproof
          (remove and replace tile + screed + membrane).
        </li>
        <li>
          <strong>Failed shower seal / silicone</strong> — minor
          source. $300-$800 to re-seal correctly.
        </li>
        <li>
          <strong>Inadequate bathroom exhaust ventilation</strong>{' '}
          — install ducted exhaust to roof or eaves. $400-$1,200.
        </li>
        <li>
          <strong>Roof leak</strong> — varies wildly. $500 for a
          flashing repair to $25,000+ for a full re-roof.
        </li>
        <li>
          <strong>Plumbing leak (concealed pipe, slow drip)</strong>{' '}
          — $800-$4,000 typically, varies by location and access.
        </li>
        <li>
          <strong>Inadequate subfloor ventilation</strong> — install
          additional vents or subfloor fans. $1,500-$5,000.
        </li>
        <li>
          <strong>Rising damp</strong> — see{' '}
          <Link href="/resources/rising-damp-australia-how-much-to-fix">
            rising damp repair costs
          </Link>
          .
        </li>
        <li>
          <strong>Stormwater dispersal failure</strong> — disconnected
          downpipes, blocked stormwater, leaking gutters. $800-$5,000.
        </li>
        <li>
          <strong>Building envelope condensation</strong> —
          structural cold-bridge issue. $3,000-$15,000 depending on
          extent. Often requires improved insulation + ventilation
          strategy.
        </li>
      </ul>

      <h2>Negotiation framework</h2>
      <p>
        Mould findings are reasonable negotiation territory but
        require specialist follow-up to quantify properly. The
        framework:
      </p>
      <ul>
        <li>
          <strong>Visible mould, single room, no specialist
          assessment:</strong> Conservative $2,000-$5,000 ask.
          Reflects moisture rectification + Category 1 cleaning.
        </li>
        <li>
          <strong>Specialist assessment confirms Category 2
          remediation:</strong> $5,000-$15,000 ask. Backed by
          remediation company quote.
        </li>
        <li>
          <strong>Specialist assessment confirms Category 3 with
          hidden contamination:</strong> $15,000-$40,000+ ask, OR
          walk-away consideration depending on severity and your
          renovation appetite.
        </li>
        <li>
          <strong>Mould + clear unaddressed moisture source still
          active:</strong> Demand vendor rectifies the source pre-
          settlement OR negotiate the full quoted moisture work in
          addition to remediation.
        </li>
      </ul>
      <p>
        See{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          our negotiation framework
        </Link>{' '}
        for the broader structure. The leverage in mould negotiations
        is always the documented moisture cause + quoted remediation
        scope — not the visible mould patch itself.
      </p>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded reads your AS4349.1 building inspection PDF
        and extracts every reference to mould, fungal growth,
        moisture, elevated readings, and conducive conditions. It
        cross-references the inspector&apos;s notes against typical
        moisture sources to surface what the likely root cause is —
        not just what&apos;s visible on the surface.
      </p>
      <p>
        For a typical &ldquo;mould evident to bathroom ceiling&rdquo;
        finding, Report Decoded&apos;s output reads something like:
      </p>
      <p>
        <em>&ldquo;Mould flagged to bathroom ceiling above shower.
        Likely root cause: condensation from inadequate exhaust
        ventilation combined with failing waterproofing membrane.
        Recommended next step: specialist mould assessment ($400-
        $800) + bathroom waterproofing quote. Indicative remediation
        cost: $3,500-$8,000 inclusive of moisture rectification. If
        the inspector also noted elevated moisture readings to the
        adjoining bedroom wall, consider Category 2 scope with hidden
        contamination ($6,000-$12,000).&rdquo;</em>
      </p>
      <p>
        That&apos;s the kind of plain-English translation that turns
        a one-line inspector note into a defensible scope of works
        and a negotiating position — before cooling-off ends.
      </p>
    </ArticleLayout>
  );
}
