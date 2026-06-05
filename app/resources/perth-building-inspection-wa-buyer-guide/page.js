import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('perth-building-inspection-wa-buyer-guide');

const faqs = [
  {
    q: 'Does WA have a cooling-off period like the eastern states?',
    a: 'No — Western Australia has no statutory cooling-off period for residential property purchases. This is unique to WA among major AU states. Your only protection is the inspection clause you negotiate INTO the contract BEFORE signing. The standard REIWA Joint Form of General Conditions includes a "subject to building inspection" clause for buyers to fill in, but the buyer is responsible for ensuring it\'s actually inserted and the timeframe (typically 7-14 business days) is enforceable. Auction sales in WA, like everywhere else in AU, have no cooling-off at all — pre-auction inspection is mandatory. Walk away from any WA private treaty contract that doesn\'t have an inspection clause and a clear exit if the inspection finds material defects.',
  },
  {
    q: 'What are jarrah white ants and how are they different from termites?',
    a: 'Jarrah white ants (Coptotermes acinaciformis and similar species) are the dominant timber-destroying organism in WA — distinct from the eastern states\' subterranean termite species in distribution and treatment. Functionally, they do the same damage (consume cellulose in structural timber), but Perth\'s climate (Mediterranean, dry summer + wet winter) creates different activity patterns than Sydney or Brisbane. WA inspectors are trained to look for: mud tubes inside subfloor and roof voids, frass (excreta) under floorboards, hollow-sounding timber, and the distinctive moisture-trail patterns left in older jarrah hardwood. Treatment for active WA infestations is usually $3,500-$7,500 (chemical barrier + bait stations) — sometimes higher in older Perth Hills properties where access is restricted.',
  },
  {
    q: 'My Perth building is on sand — why does the inspector keep mentioning "reactive sand"?',
    a: 'Perth and most of the WA coast are built on sand-based soils. Unlike the reactive clay of Melbourne or Sydney inner-west, sand doesn\'t swell with moisture — but it does SHIFT with moisture changes, particularly during long dry summers followed by wet winters. The pattern affects: brick veneer construction (the most common Perth building style), with footings sometimes settling unevenly; subfloor structures where stumps or piers shift; concrete slabs that develop cracking from differential movement. Inspectors flag this as "evidence of foundation movement on reactive sand site" or similar. Most cases are manageable (cosmetic crack repair + drainage improvements, $2,000-$8,000). Active or severe cases may require underpinning ($25,000-$60,000) — though underpinning in sand is more straightforward than in clay because access is easier.',
  },
  {
    q: 'Are coastal Perth properties more expensive to inspect or insure?',
    a: 'Yes, both. Inspection: typically $50-$100 premium for properties within 1km of the coast because the inspector spends more time looking at salt-related issues (rusted metal fixings, accelerated paint deterioration on west-facing exteriors, mortar deterioration on brickwork facing prevailing weather). Insurance: depends on suburb but coastal Perth properties (Cottesloe, Scarborough, Trigg, Mullaloo) typically carry a 15-30% premium loaded onto standard home & contents insurance for salt-related claim risk. Significant: properties within 200m of the surf line can be premium-loaded up to 50% by some insurers — worth comparing 5+ quotes before settling.',
  },
  {
    q: 'What about asbestos in Perth homes?',
    a: 'Asbestos is everywhere in pre-1990 Perth stock — possibly more visible than in eastern states because Hardies (originally Australian-made James Hardie products) was particularly common in WA construction. Common locations: external wall sheeting on 1960s-1980s brick-veneer homes, fibro garages, eaves linings, vinyl floor tile backing, kitchen splashbacks, even cement floor patching. Perth inspectors are well-versed in identifying suspect ACM (asbestos-containing materials) by visual appearance, but only lab testing confirms. Removal in WA is governed by the WHS Regulations and requires a licensed removalist for material above 10sqm — typical cost $80-$150/sqm for non-friable removal, significantly more for friable. The presence of asbestos alone shouldn\'t kill a deal but should inform your renovation budget and the negotiation. See our broader guide on asbestos in AU homes.',
  },
  {
    q: 'How much does a Perth building & pest inspection cost?',
    a: 'Standard 3-bed Perth metro house: $550-$700 for combined building & pest inspection by a licensed inspector. Older inner-suburbs (Subiaco, Mount Lawley, North Perth) and larger homes (200+ sqm) at $700-$900. Perth Hills (Kalamunda, Mundaring, Roleystone) often $700-$850 due to travel time + bushfire considerations. Regional WA (Bunbury, Geraldton, Albany, Margaret River) typically $650-$900 with travel surcharge. Expedited (24-48 hour turnaround) adds $100-$200. Pre-auction expedited inspection on a Saturday morning auction can run $150 premium. See the AU pre-auction inspection guide for the broader auction strategy.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Perth building inspection: the WA buyer's playbook (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>WA buyers face a different inspection landscape
            than the eastern states.</strong> Key differences:{' '}
            <strong>no statutory cooling-off</strong> (your only
            protection is the inspection clause in your contract),
            jarrah white ants instead of east-coast termites
            (treatment <strong>$3.5-7.5K</strong>), sand-based
            foundation movement instead of reactive clay (cosmetic{' '}
            <strong>$2-8K</strong>, structural{' '}
            <strong>$25-60K</strong>), coastal salt damage on
            west-facing exteriors, and widespread asbestos in
            pre-1990 Hardies-clad stock. Standard Perth inspection{' '}
            <strong>$550-$700</strong>. Coastal properties (within
            1km of beach) add an inspection premium. Auction = no
            cooling-off (same as everywhere) — inspect before bidding.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'pre-auction-building-inspection-australia',
        'cooling-off-period-building-inspection-rights-by-state',
        'building-inspection-vs-pest-inspection-difference',
        'asbestos-australian-homes-buyer-guide',
      ]}
      related_suburbs={[
        'brighton',
        'frankston',
        'cheltenham',
        'mornington',
        'torquay',
      ]}
    >
      <p>
        Perth building stock has problems East Coast inspectors rarely
        see. Jarrah white ants instead of subterranean termites.
        Sand-base reactive movement instead of clay-driven heave. Salt
        damage from coastal exposure that aggressively eats fixings
        and mortar on west-facing exteriors. Widespread Hardies
        sheeting that often pre-dates the 1987 asbestos cutoff.
      </p>
      <p>
        Plus WA has no statutory cooling-off period — uniquely
        among major AU states. Your only protection is the inspection
        clause you negotiate INTO the contract before signing.
      </p>
      <p>
        Here&apos;s the WA-specific playbook: what to expect, what
        costs to budget, and where the local defect patterns differ
        from generic AU building inspection advice.
      </p>

      <h2>The cooling-off issue</h2>
      <p>
        Most generic Australian property advice says &ldquo;use your
        cooling-off period to commission the inspection and decide
        whether to proceed.&rdquo; That advice does NOT apply in WA.
      </p>
      <p>
        Western Australia has{' '}
        <strong>no statutory cooling-off period</strong> for
        residential property purchases. The Real Estate Institute of
        WA (REIWA) Joint Form of General Conditions — the standard
        contract — includes a clause where buyers can insert a
        &ldquo;subject to building inspection&rdquo; condition with
        their preferred timeframe (typically 7-14 business days).
      </p>
      <p>
        Critical points for WA buyers:
      </p>
      <ul>
        <li>
          <strong>The inspection clause is NOT automatic.</strong> If
          you don&apos;t insert it before signing, you have no exit
          for adverse inspection findings
        </li>
        <li>
          <strong>The clause needs to specify a timeframe.</strong>{' '}
          Standard is 14 business days; tight markets see this
          compressed to 7-10
        </li>
        <li>
          <strong>The clause needs to specify the exit grounds.</strong>{' '}
          &ldquo;Subject to satisfactory building inspection&rdquo; is
          weak — vendors can argue any inspection is
          &ldquo;satisfactory&rdquo;. Better: &ldquo;subject to
          building inspection at buyer&apos;s sole discretion&rdquo;
        </li>
        <li>
          <strong>Auction sales have no equivalent.</strong> If you
          win at auction in WA, the contract is unconditional from
          hammer fall. Same as every other state. See{' '}
          <Link href="/resources/cooling-off-period-building-inspection-rights-by-state">
            cooling-off rights by state
          </Link>{' '}
          for the broader framework.
        </li>
      </ul>
      <p>
        Walk away from any WA private-treaty contract that
        doesn&apos;t have a clear inspection clause with a defined
        timeframe and unambiguous exit grounds.
      </p>

      <h2>WA termites — jarrah white ants</h2>
      <p>
        Termites are the largest single defect risk in Perth building
        inspections. WA jurisdictions treat them under the Termite Risk
        Management protocols, and inspectors here are particularly
        attuned to them.
      </p>
      <p>
        Key Perth-specific points:
      </p>
      <ul>
        <li>
          <strong>Species:</strong> Coptotermes acinaciformis is the
          dominant species — same as the east coast, but Perth&apos;s
          dry-summer climate creates distinct activity patterns
          (activity concentrated in autumn moisture)
        </li>
        <li>
          <strong>Risk zones:</strong> Inner Perth suburbs with mature
          gardens, established Perth Hills properties, and any home
          with significant timber decay around eaves or subfloor are
          high-risk. Sand-base soils don&apos;t reduce risk —
          termites travel underground regardless of soil type
        </li>
        <li>
          <strong>Common findings:</strong> Mud tubes inside subfloor
          and roof voids, frass under floorboards, hollow-sounding
          jarrah hardwood floors, moisture-trail patterns in older
          construction
        </li>
        <li>
          <strong>Treatment costs:</strong> Active infestation: chemical
          barrier + bait stations $3,500-$7,500. Severe (multiple
          colonies, extensive damage): $8,000-$15,000+ including
          structural timber replacement
        </li>
      </ul>
      <p>
        Standard WA practice is annual termite re-inspection. Any
        Perth property without a documented termite treatment
        history should be assumed at risk until inspected.
      </p>

      <h2>Sand-base foundation movement</h2>
      <p>
        Most Perth and WA coastal properties are built on sand-based
        soils. Unlike the reactive clay of Melbourne or Sydney
        inner-west, sand doesn&apos;t swell with moisture — but it
        does SHIFT with moisture changes, particularly during long
        dry summers followed by wet winters.
      </p>
      <p>
        Effects on Perth building stock:
      </p>
      <ul>
        <li>
          <strong>Brick veneer (the dominant Perth build style):</strong>{' '}
          Footings can settle unevenly, producing diagonal step
          cracking in external brickwork. Common but usually
          manageable
        </li>
        <li>
          <strong>Subfloor structures with stumps or piers:</strong>{' '}
          Differential movement causes floor unevenness,
          door-frame misalignment, internal cornice cracking
        </li>
        <li>
          <strong>Concrete slab homes:</strong> Edge slab cracking,
          internal slab heave or settlement, particularly in homes
          with poor drainage around the perimeter
        </li>
      </ul>
      <p>
        Inspector terminology to watch for: &ldquo;evidence of
        foundation movement on reactive sand site,&rdquo; &ldquo;step
        cracking consistent with differential settlement,&rdquo;
        &ldquo;subfloor stump rotation observed.&rdquo;
      </p>
      <p>
        Repair cost ranges:
      </p>
      <ul>
        <li>
          <strong>Cosmetic crack repair + drainage improvement:</strong>{' '}
          $2,000-$8,000
        </li>
        <li>
          <strong>Stump replacement and re-levelling:</strong>{' '}
          $8,000-$25,000
        </li>
        <li>
          <strong>Underpinning for active foundation movement:</strong>{' '}
          $25,000-$60,000 in WA. Slightly cheaper than equivalent
          clay-soil underpinning in Melbourne because sand allows
          easier access for screw-pile or mass-pour systems
        </li>
      </ul>

      <h2>Coastal salt damage</h2>
      <p>
        Properties within 1km of the WA coast — particularly the
        western Perth coastal strip (Cottesloe, Swanbourne, City Beach,
        Trigg, Scarborough, Hillarys), Mandurah, Geraldton, Albany,
        and Margaret River area — face accelerated salt-driven
        degradation.
      </p>
      <p>
        What inspectors look for:
      </p>
      <ul>
        <li>
          <strong>Rusted steel fixings:</strong> Lintels, nails,
          embedded brackets, balcony railings. Surface rust is normal;
          structural rust loss is a problem
        </li>
        <li>
          <strong>Paint deterioration on west-facing exteriors:</strong>{' '}
          Salt-laden onshore winds eat paint coatings 2-3x faster than
          inland properties
        </li>
        <li>
          <strong>Mortar deterioration in brickwork:</strong> Salt
          crystallisation in mortar joints causes erosion (efflorescence
          + spalling). See{' '}
          <Link href="/resources/concrete-cancer-spalling-cost-australia">
            concrete cancer guide
          </Link>{' '}
          for the broader mechanism
        </li>
        <li>
          <strong>Window frame degradation:</strong> Older aluminum
          frames pit and corrode; timber frames swell and split
        </li>
      </ul>
      <p>
        Inspection premium for coastal properties: $50-$100 extra.
        Insurance premium loaded 15-30%, sometimes higher for
        oceanfront positions. Budget for ongoing maintenance —
        coastal Perth properties require painting every 7-10 years
        vs 12-15 inland.
      </p>

      <h2>Asbestos in Perth stock</h2>
      <p>
        Pre-1990 Perth construction is heavily asbestos-affected,
        possibly more visibly than eastern states because Hardies
        products were especially common in WA. See the broader{' '}
        <Link href="/resources/asbestos-australian-homes-buyer-guide">
          asbestos in AU homes guide
        </Link>{' '}
        for the full framework — Perth specifics below.
      </p>
      <p>
        Common Perth asbestos locations:
      </p>
      <ul>
        <li>
          <strong>External wall sheeting:</strong> 1960s-1980s
          brick-veneer homes commonly have fibro/Hardies cladding
          panels under or alongside brick
        </li>
        <li>
          <strong>Garages and outbuildings:</strong> Stand-alone fibro
          structures are common
        </li>
        <li>
          <strong>Eaves linings:</strong> Older asbestos cement sheets
          commonly mistaken for modern fibrous cement
        </li>
        <li>
          <strong>Vinyl floor tiles (kitchen, bathroom):</strong>{' '}
          Tile backing contains asbestos in pre-1990 installations
        </li>
        <li>
          <strong>Cement floor patching:</strong> Older garage and
          laundry floors often have asbestos-containing patch repairs
        </li>
      </ul>
      <p>
        WA removal regulation: governed by the Work Health and Safety
        Regulations 2022. Friable asbestos (loose, easily crumbled)
        requires licensed Class A removalist. Non-friable (bonded
        sheeting) requires licensed Class B for any area over 10sqm.
        Typical Perth removal costs:
      </p>
      <ul>
        <li>
          <strong>Non-friable removal:</strong> $80-$150/sqm
        </li>
        <li>
          <strong>Friable removal:</strong> $200-$400/sqm
        </li>
        <li>
          <strong>Disposal levy:</strong> $50-$100/sqm at Perth landfill
          sites
        </li>
      </ul>

      <h2>What WA inspectors typically catch</h2>
      <p>
        Standard{' '}
        <Link href="/resources/what-is-as4349-1">AS4349.1 inspection</Link>{' '}
        scope applies in WA the same as elsewhere — visual inspection,
        no invasive testing. Common Perth-specific findings:
      </p>
      <ol>
        <li>
          <strong>Termite activity or risk indicators</strong> —
          typically flagged with recommendation for specialist pest
          control follow-up
        </li>
        <li>
          <strong>Brickwork step cracking</strong> — assessed for
          severity, may recommend structural engineer if multi-location
          + through-brick
        </li>
        <li>
          <strong>Salt-related rust + paint failure on west-facing
          exteriors</strong> — assessed for maintenance vs repair
        </li>
        <li>
          <strong>Suspect ACM (asbestos-containing materials)</strong>{' '}
          — flagged for lab testing if buyer plans renovation
        </li>
        <li>
          <strong>Sand-base foundation evidence</strong> — settlement
          patterns assessed for active vs historical
        </li>
        <li>
          <strong>Subfloor moisture + ventilation issues</strong> —
          common in Perth Hills + south-east Perth older stock
        </li>
        <li>
          <strong>Roof tile and ridge cap deterioration</strong> —
          accelerated in coastal zones
        </li>
      </ol>

      <h2>Cost reference table</h2>
      <p>
        Approximate 2026 Perth dollar ranges for common defects
        flagged in inspection reports:
      </p>
      <ul>
        <li>
          <strong>Termite treatment (active):</strong> $3,500-$7,500
        </li>
        <li>
          <strong>Termite damage repair (localised):</strong>{' '}
          $5,000-$25,000
        </li>
        <li>
          <strong>Cosmetic brickwork crack repair:</strong>{' '}
          $1,500-$5,000
        </li>
        <li>
          <strong>Underpinning (sand-base, perimeter section):</strong>{' '}
          $25,000-$45,000
        </li>
        <li>
          <strong>Underpinning (whole structure):</strong>{' '}
          $45,000-$80,000
        </li>
        <li>
          <strong>Asbestos removal (non-friable, 50sqm garage):</strong>{' '}
          $4,000-$8,000
        </li>
        <li>
          <strong>Roof restoration (concrete tile, 150sqm):</strong>{' '}
          $7,000-$15,000
        </li>
        <li>
          <strong>Full re-roof (Colorbond, 150sqm):</strong>{' '}
          $14,000-$22,000
        </li>
        <li>
          <strong>Bathroom waterproofing rectification:</strong>{' '}
          $4,000-$10,000
        </li>
        <li>
          <strong>Stump replacement + relevelling (entire house):</strong>{' '}
          $15,000-$35,000
        </li>
      </ul>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded analyses AS4349.1 inspection reports for any
        Australian property — Perth included. The cost benchmarks
        used in the analysis are calibrated to AU repair rates by
        region, so Perth-specific cost ranges are surfaced for
        WA-specific issues like jarrah white ant treatment or
        sand-base underpinning.
      </p>
      <p>
        For a Perth buyer in cooling-off-free WA, the inspection +
        analysis + negotiation sequence is even more critical than
        for eastern-state buyers — your only protection is what you
        do with the inspection findings within the contract&apos;s
        inspection-clause timeframe. Upload the PDF, get the
        decoded output in 2 minutes, draft your negotiation or
        exit position before the clause window closes.
      </p>
      <p>
        Report Decoded won&apos;t identify termites — that&apos;s
        your pest inspector&apos;s scope. But once the inspector has
        flagged &ldquo;evidence of active termite workings to subfloor
        framing,&rdquo; Report Decoded turns that into a specific
        cost band (&ldquo;treatment $3.5-7.5K, repair $5-25K
        depending on extent — structural engineer follow-up
        recommended&rdquo;) so you can make the proceed/exit/negotiate
        call inside the clause timeframe.
      </p>
    </ArticleLayout>
  );
}
