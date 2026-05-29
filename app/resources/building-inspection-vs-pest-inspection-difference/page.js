import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('building-inspection-vs-pest-inspection-difference');

const faqs = [
  {
    q: 'Can the same inspector do both the building inspection and the pest inspection?',
    a: 'Yes, often. Most Australian inspection companies offer a "Combined Building and Timber Pest Inspection" — usually delivered as either one combined PDF or two separate PDFs from the same site visit. The combined inspection is typically $50-$100 cheaper than booking them separately. However, the inspector needs two separate qualifications: AS4349.1 (building) and AS4349.3 (timber pest). Verify both qualifications on their licence before booking. A small number of inspectors are only qualified for one standard, in which case you\'ll need two separate site visits.',
  },
  {
    q: 'How much does a combined building and pest inspection cost in Australia?',
    a: '2026 typical ranges: Melbourne / Sydney metro $450-$700 for a standard house, $550-$850 for a Federation or Victorian terrace, $650-$1,000 for a large modern home. Regional rates ~$50-$150 less. The cheapest option ($350-$400) is usually a generalist with limited insurance — for a $1M+ purchase, paying $200 more for a thorough inspector with $1M-$2M professional indemnity insurance is a no-brainer.',
  },
  {
    q: 'Do I need a pest inspection on a new build?',
    a: 'Less critical but still recommended. New-build homes built post-2000 should have an AS3660.1 termite barrier installed during construction (Termimesh, Kordon, HomeGuard, or equivalent). Ask the builder for the barrier installation certificate and warranty documents. A pest inspection on a new build mainly verifies the barrier is correctly installed and hasn\'t been compromised during landscaping. Cost: $200-$400. Worth it.',
  },
  {
    q: 'Can a pest inspection find termites inside the walls?',
    a: 'Not directly — visual pest inspection per AS4349.3 is limited to accessible areas. However, a thorough inspector uses moisture meters, thermal imaging cameras, and Termatrac (acoustic detection) to identify activity behind walls and inside timber elements without cutting access. Active termite workings produce characteristic moisture signatures and acoustic signals. This is why paying for a specialist pest inspector rather than a generalist building inspector for the pest report matters — the equipment is the difference.',
  },
  {
    q: 'What\'s the difference between AS4349.1 and AS4349.3?',
    a: 'AS4349.1 — "Inspection of buildings - Pre-purchase inspections - Residential buildings" — is the Australian Standard for the general building inspection: structural, weatherproofing, finishes, plumbing, electrical safety, etc. AS4349.3 — "Inspection of buildings - Timber pest inspections" — is specifically about live and historical termite activity, wood-decay fungi, and timber-attacking borers. They are written as companion standards but each requires separate inspector training and certification. If your report cites only AS4349.1, you have a building report but not a pest report.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Building inspection vs pest inspection: what's the difference in Australia?"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            They are <strong>two separate inspections</strong> done to
            two separate Australian Standards. AS4349.1 covers the
            building (structure, weatherproofing, plumbing,
            electrical). AS4349.3 covers timber pests (termites, wood
            borers, fungal decay). One report doesn&apos;t cover the
            other. The combined inspection is typically{' '}
            <strong>$450-$700 metro</strong>; booking separately is
            $50-$100 more expensive. Skipping the pest inspection is
            the single most expensive mistake Australian buyers make —
            average undetected termite damage cost is{' '}
            <strong>$8,000-$30,000+</strong>, and termite damage is
            specifically excluded from every standard AU home
            insurance policy.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'what-is-as4349-1',
        'termite-damage-cost-australia',
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={['yarraville', 'brunswick', 'new-farm', 'toowong', 'wynnum']}
    >
      <p>
        Your conveyancer told you to &ldquo;get a building and pest
        inspection.&rdquo; The phrase rolls off the tongue like
        it&apos;s one thing. It&apos;s not. It&apos;s two completely
        different inspections done to two different Australian
        Standards, and they each look for completely different things
        in the property you&apos;re about to spend hundreds of thousands
        of dollars on.
      </p>
      <p>
        Most Australian buyers don&apos;t realise this until they read
        the actual reports — by which point it&apos;s too late if they
        only ordered one of the two.
      </p>
      <p>
        Here&apos;s what each one actually covers, why you need both,
        what they each cost in 2026, and how to make sure you&apos;re
        getting the right kind of inspector for each.
      </p>

      <h2>The building inspection (AS4349.1)</h2>
      <p>
        The general pre-purchase building inspection is governed by{' '}
        <Link href="/resources/what-is-as4349-1">
          Australian Standard AS4349.1
        </Link>{' '}
        — &ldquo;Inspection of buildings - Pre-purchase inspections -
        Residential buildings.&rdquo;
      </p>
      <p>
        It&apos;s a <strong>visual-only</strong> inspection of
        accessible areas. The inspector spends 1-3 hours at the
        property looking at:
      </p>
      <ul>
        <li>
          <strong>Structural elements:</strong> footings, walls, roof
          framing, floor structure. Cracking, movement, deflection.
        </li>
        <li>
          <strong>Weatherproofing:</strong> roof cladding, flashings,
          gutters, downpipes, external walls, window seals.
        </li>
        <li>
          <strong>Internal finishes:</strong> walls, ceilings, floors,
          doors, windows. Damage, deterioration, fitness for purpose.
        </li>
        <li>
          <strong>Plumbing (visual only):</strong> tap operation,
          drainage flow, visible pipework, wet area waterproofing
          indicators.
        </li>
        <li>
          <strong>Electrical safety:</strong> switchboard, RCDs,
          smoke alarms, visible wiring, earth bonding indicators. NOT
          a full electrical compliance test.
        </li>
        <li>
          <strong>Site:</strong> retaining walls, drainage falls,
          paving, fencing.
        </li>
        <li>
          <strong>Outbuildings:</strong> garage, sheds (if requested).
        </li>
      </ul>
      <p>
        What an AS4349.1 building inspection does NOT cover:
      </p>
      <ul>
        <li>Anything behind walls, under floors, or inside ceiling voids unless safely accessible.</li>
        <li>Active termite or pest activity beyond noting visible indicators (that&apos;s the pest report&apos;s job).</li>
        <li>Compliance testing — electrical certification, plumbing certification, gas safety, smoke alarm certification.</li>
        <li>Definitive repair cost estimates (most inspectors won&apos;t quantify because liability follows the number).</li>
        <li>Anything the inspector deems unsafe to access (steep roofs, confined subfloors, etc).</li>
      </ul>
      <p>
        Output: a written report (typically 30-80 pages) with photos,
        observations, defect classifications (Major / Minor / Safety
        Hazard), and &ldquo;further investigation recommended&rdquo;
        flags for items the inspector saw but couldn&apos;t fully
        assess.
      </p>

      <h2>The pest inspection (AS4349.3)</h2>
      <p>
        The pest inspection — sometimes called a &ldquo;timber pest
        inspection&rdquo; or &ldquo;termite inspection&rdquo; — is
        governed by Australian Standard{' '}
        <strong>AS4349.3</strong>, a completely separate standard
        from the building inspection.
      </p>
      <p>
        It specifically looks for:
      </p>
      <ul>
        <li>
          <strong>Live termite activity</strong> in structural
          timbers and ancillary elements (fences, decks, retaining
          walls).
        </li>
        <li>
          <strong>Historical termite damage</strong> with assessment
          of whether the colony is still active.
        </li>
        <li>
          <strong>Wood-decay fungi</strong> — rot in structural timbers
          caused by moisture.
        </li>
        <li>
          <strong>Wood-attacking borers</strong> — Anobium punctatum
          (furniture beetle), Lyctus borer, and other species.
        </li>
        <li>
          <strong>Termite-conducive conditions</strong> — moisture,
          ventilation, ground level, vegetation, drainage that
          increases the risk of future infestation.
        </li>
        <li>
          <strong>Existing termite management systems</strong> —
          barriers, chemical treatments, monitoring stations. Are
          they current and effective?
        </li>
      </ul>
      <p>
        A thorough AS4349.3 inspector uses additional tools that a
        general building inspector typically doesn&apos;t carry:
      </p>
      <ul>
        <li>
          <strong>Moisture meters</strong> — termites need ~30%+
          timber moisture to thrive. Wet timber gets investigated.
        </li>
        <li>
          <strong>Thermal imaging cameras</strong> — active termite
          colonies produce characteristic heat signatures behind walls.
        </li>
        <li>
          <strong>Termatrac (acoustic detection)</strong> — listens
          for termite movement inside timber elements without cutting
          access.
        </li>
        <li>
          <strong>Sounding hammers</strong> — physical tapping to
          identify hollow (eaten) timber.
        </li>
      </ul>
      <p>
        Output: a written report (typically 15-40 pages) with photos,
        moisture readings, classifications (Active / Historical / High
        Risk / Low Risk), and recommended management approach.
      </p>

      <h2>Why the building inspector usually can&apos;t do the pest report</h2>
      <p>
        AS4349.1 and AS4349.3 require <em>separate</em> inspector
        certifications. A building inspector qualified for AS4349.1
        may or may not also hold AS4349.3 — and many don&apos;t.
        Verifying both certifications matters:
      </p>
      <ul>
        <li>Check the inspector&apos;s licence card or company website for both AS4349.1 and AS4349.3 certifications.</li>
        <li>If the inspector is only qualified for AS4349.1 and they offer a &ldquo;pest comment,&rdquo; it&apos;s not a real AS4349.3 inspection — it&apos;s informal observation and carries less weight in negotiation + zero protection if the pest report is later challenged.</li>
        <li>Many AU inspection companies have one inspector who does both. Some have separate building + pest inspectors who visit together — that&apos;s actually preferable as each specialist is more thorough in their domain.</li>
      </ul>

      <h2>Combined building and pest inspection — is it the same quality?</h2>
      <p>
        A combined inspection is usually a single inspector visiting
        once, holding both certifications, producing two reports (one
        AS4349.1, one AS4349.3) or a combined report split into
        sections.
      </p>
      <p>
        Pros: cheaper ($50-$100 less than booking separately), faster
        scheduling, one person to follow up with.
      </p>
      <p>
        Cons: a generalist combined inspector spends less time on
        each specialty than a specialist pair would. The pest portion
        of a combined inspection is sometimes thinner than a
        dedicated pest specialist would provide.
      </p>
      <p>
        For a standard suburban brick veneer in good condition: combined
        inspection is fine. For pre-1960 timber stock, Queenslanders,
        or any property in a high-risk termite area (Brisbane, northern
        NSW, tropical Queensland): consider a dedicated pest specialist
        even if you also use a combined building+pest inspector. Cost
        of overlap: $300-$500. Cost of a missed active termite
        infestation:{' '}
        <Link href="/resources/termite-damage-cost-australia">
          $8,000 to $80,000+ depending on extent
        </Link>.
      </p>

      <h2>What it costs in 2026</h2>
      <p>Typical AU rates for combined building and pest inspection:</p>
      <ul>
        <li>
          <strong>Metro (Melbourne, Sydney, Brisbane, Perth, Adelaide):</strong> $450-$700 for a standard 3-bed brick veneer; $550-$850 for a Federation / Victorian terrace; $650-$1,000 for a large modern home or multi-storey.
        </li>
        <li>
          <strong>Regional capitals (Geelong, Newcastle, Wollongong, Sunshine Coast):</strong> Roughly metro rates -$50-$100.
        </li>
        <li>
          <strong>Regional / rural:</strong> $400-$650 depending on travel.
        </li>
      </ul>
      <p>
        Booked separately, expect to add $100-$200 to the total. The
        cheapest combined inspections ($350-$400) are typically
        generalists with limited professional indemnity insurance.
        Verify the inspector carries at least $1M-$2M PI cover before
        booking — for a $1M+ purchase, $200 more for proper insurance
        is the bargain of the entire transaction.
      </p>

      <h2>Why skipping the pest report is the most expensive AU mistake</h2>
      <p>
        Termites cause more property damage in Australia than fire,
        flood, and storms <em>combined</em>. They are explicitly
        excluded from every standard AU home and contents insurance
        policy — classified as a &ldquo;preventable&rdquo; condition.
        Once you own the property, every dollar of termite damage
        repair comes out of your pocket.
      </p>
      <p>
        The pest inspection is the only chance you get to discover
        active or recent termite activity BEFORE you become legally
        responsible for it. It&apos;s also the only documentation that
        gives you negotiation grounds: an AS4349.3 finding of active
        termites is worth tens of thousands off the contract price
        when documented and presented through the agent in writing.
      </p>
      <p>
        For specifics on how to turn pest findings into a negotiation
        position,{' '}
        <Link href="/resources/what-to-do-if-building-inspection-finds-major-problems">
          our decision framework here walks through it step by step
        </Link>.
      </p>

      <h2>Both reports decoded in 2 minutes — what Report Decoded does</h2>
      <p>
        Once you have one or both reports back, the next step is
        translating what they actually mean into a buyer&apos;s
        decision. Most reports use AS4349-compliant language that&apos;s
        deliberately cautious for liability reasons —
        &ldquo;efflorescence indicative of capillary moisture rise,&rdquo;
        &ldquo;subterranean termite workings to bearer timbers,&rdquo;
        &ldquo;moderate defect requiring further investigation by a
        licensed specialist.&rdquo; None of that tells you what to
        actually do about it or what it costs.
      </p>
      <p>
        Report Decoded takes either inspection PDF — building, pest,
        or both — and gives you a plain-English verdict, repair cost
        estimates per defect in 2026 AU dollars, the right specialist
        trade to call, and a drafted negotiation letter ready to send.
        $59 per report. No subscription.
      </p>
      <p>
        The point isn&apos;t the tool — it&apos;s that on a $700K-$1.5M
        decision, you don&apos;t want to leave the interpretation of
        two technical documents to chance.
      </p>
    </ArticleLayout>
  );
}
