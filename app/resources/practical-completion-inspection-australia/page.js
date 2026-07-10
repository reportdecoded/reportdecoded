import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('practical-completion-inspection-australia');

const faqs = [
  {
    q: 'Do I have to sign off on Practical Completion if there are defects?',
    a: 'No. Practical Completion means the work is reasonably ready for occupation, with only MINOR defects remaining. If the inspection finds major defects (structural, waterproofing, electrical compliance), you have legal grounds to refuse PC and require rectification before sign-off. Most state Domestic Building Contracts legislation (Vic DBC Act, NSW Home Building Act) backs this. Get a lawyer if the builder pressures you to sign with major items unresolved.',
  },
  {
    q: 'When in the build do I commission the PCI?',
    a: 'Within 1–3 days of the builder declaring Practical Completion is reached — BEFORE you sign the PC certificate or pay the final progress payment. Once you\'ve signed PC, your leverage drops dramatically. Most contracts give you 5–10 business days to inspect after the builder declares PC; use the start of that window for the inspection.',
  },
  {
    q: 'What\'s the Defects Liability Period and how long is it?',
    a: 'The DLP is a contractual period after PC during which the builder must rectify any defects you identify. Standard contracts: 13–26 weeks (3–6 months). HIA contracts default to 13 weeks; Master Builders contracts often 26 weeks. Use this window aggressively — once it expires, you\'re relying on statutory warranties (6 years structural, 2 years non-structural under most state legislation) which are much harder to enforce.',
  },
  {
    q: 'Can I use my own inspector or do I have to use the builder\'s?',
    a: 'Always use your own independent inspector. The builder\'s "in-house QA" exists to protect the builder, not you. Independent PCI inspections cost $650–$1,200 depending on property size — small money against the average $40K–$120K of legitimate rectification work a typical new-build PCI surfaces.',
  },
  {
    q: 'What if the builder refuses to rectify after PCI?',
    a: 'Three escalation steps. (1) Written notice quoting the contract\'s DLP clause and listing each item with AS standards breached. (2) Lodge a complaint with the state building authority (VBA in Victoria, NSW Fair Trading, QBCC in Queensland). (3) If the builder is in financial trouble or refuses, claim under Domestic Building Insurance (Vic DBI / NSW HBCF / equivalent) — that\'s the insurance every licensed Australian builder is required to carry for exactly this scenario.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="New-build Practical Completion Inspection (PCI): the Australian buyer's guide"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            The <strong>Practical Completion Inspection</strong> is the most
            important inspection you&apos;ll commission as a new-build buyer
            — it&apos;s the one moment where you can require the builder to
            rectify defects before you sign off PC and release final payment.
            Commission an <strong>independent</strong> inspector ($650–$1,200)
            within the 5-10 day window the builder gives you after declaring
            PC. A typical PCI surfaces <strong>40–80 defects</strong> on a
            standard new build, with $40K–$120K of legitimate rectification
            work the builder owes you under contract. Don&apos;t sign PC until
            major items are rectified.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={['what-is-as4349-1', 'how-much-to-negotiate-after-building-inspection', 'termite-damage-cost-australia']}
      related_suburbs={['footscray', 'spotswood', 'sunshine', 'frankston', 'ocean-grove', 'mornington']}
    >
      <p>
        Your builder is about to declare Practical Completion. They&apos;ll
        send you a notice, ask you to inspect, and tell you when the final
        progress payment is due. <strong>This is the single moment of leverage
        you have over the build quality.</strong>
      </p>
      <p>
        Most first-time new-build buyers don&apos;t know what a PCI actually
        is, when to commission it, or what their rights are. The result:
        they sign off on PC under builder pressure, then spend the next
        five years chasing rectification work that should have been done
        before they took possession.
      </p>
      <p>Here&apos;s how to do it properly.</p>

      <h2>What Practical Completion actually means</h2>
      <p>
        Under Australian Domestic Building Contracts legislation (Vic DBC
        Act 1995, NSW Home Building Act 1989, QLD Domestic Building
        Contracts Act 2000, equivalent in other states), <strong>Practical
        Completion (PC)</strong> means the building work is <em>reasonably
        ready for occupation</em>, with only <em>minor</em> defects remaining.
      </p>
      <p>The PC certificate triggers three things:</p>
      <ul>
        <li><strong>Final progress payment</strong> — typically 5–10% of the contract price</li>
        <li><strong>Defects Liability Period (DLP) begins</strong> — 13–26 weeks in which the builder must rectify items you identify</li>
        <li><strong>Possession of the property</strong> — keys hand over</li>
      </ul>
      <p>
        Critically: PC does NOT mean &quot;the build is finished and
        defect-free.&quot; It means the builder claims it&apos;s ready for
        occupation. Your job at PCI is to verify that claim — and require
        rectification of anything that&apos;s NOT minor before you accept PC.
      </p>

      <h2>When to commission the PCI</h2>
      <p>The timeline is tight. From your builder&apos;s perspective:</p>
      <ol>
        <li>Builder declares PC reached — sends you a written notice</li>
        <li>Your contract gives you 5–10 business days to inspect (varies by contract)</li>
        <li>You either accept PC and pay the final progress payment, OR raise defects in writing and require rectification before accepting</li>
        <li>Once you accept PC, the DLP clock starts; the builder must rectify items within the period</li>
      </ol>
      <p>
        <strong>Commission your independent PCI inspection within 1–3 days
        of receiving the PC notice.</strong> You want the inspector on site
        as early in your inspection window as possible so:
      </p>
      <ul>
        <li>You have time to escalate to the builder if major items are found</li>
        <li>The builder has time to rectify before your contract&apos;s acceptance deadline</li>
        <li>You aren&apos;t pressured to sign by the final-payment deadline</li>
      </ul>

      <h2>What a PCI inspector looks for</h2>
      <p>
        A thorough PCI runs AS4349.0 (general inspection of buildings) and
        sometimes AS4349.1 (pre-purchase) but in a NEW-BUILD context. Unlike
        pre-purchase inspections, the focus is on <em>workmanship and
        compliance with the build contract</em>, not natural wear.
      </p>

      <h3>External</h3>
      <ul>
        <li><strong>Brickwork:</strong> mortar joints to AS 3700 (8–12mm typical), no excess perpend gaps, articulation joints clear, weep holes unobstructed, no efflorescence</li>
        <li><strong>Roof:</strong> tile/sheet alignment, ridge capping, flashings, valley irons, gutter slope and downpipe connections, sarking visible from inside</li>
        <li><strong>External cladding:</strong> Hardies/Linea boards spaced correctly, expansion joints, sealant condition, paint coverage</li>
        <li><strong>Windows and doors:</strong> sashes operate freely, locks work, weatherseals present, flashings around openings</li>
        <li><strong>Slab edges:</strong> no blowouts past brickwork (concrete needs to be flush so paving and DPC clearance work), no spalling, no honeycomb</li>
        <li><strong>External taps and meter boxes:</strong> mounted level, weatherproof, accessible</li>
      </ul>

      <h3>Internal</h3>
      <ul>
        <li><strong>Walls and ceilings:</strong> flat (within AS 2589 tolerance), no nail pops, no drummy plaster, cornices straight, paint finish even with no holidays, runs, or pinholes</li>
        <li><strong>Floor coverings:</strong> tiles flat (no lippage), no drummy tiles, grout consistent, carpet stretched + tucked, floorboards no creaks or gaps</li>
        <li><strong>Doors:</strong> hung straight, gap clearances within tolerance, latches engage cleanly, no scratches or damage</li>
        <li><strong>Wet areas:</strong> waterproofing verified (membrane test if accessible), grout sealed, silicone runs continuous, drainage falls correct</li>
        <li><strong>Kitchen and joinery:</strong> cabinet doors aligned, drawers operate, benchtop joints sealed, splashback complete</li>
        <li><strong>Stairs:</strong> riser/tread compliance NCC 3.9.1, balustrade height 1m+ AS 1657, slip-resistant nosing on hard-surface treads</li>
      </ul>

      <h3>Services</h3>
      <ul>
        <li><strong>Electrical:</strong> all outlets working, switchboard labelled, RCDs on every circuit, smoke alarms hardwired + interconnected, AS 3000 compliance</li>
        <li><strong>Plumbing:</strong> all taps run hot + cold to spec, no leaks under sinks, hot water service commissioned, gas pressure tested (if applicable), AS/NZS 3500 compliance</li>
        <li><strong>HVAC:</strong> heating + cooling functional, ducts insulated, thermostat operates</li>
        <li><strong>NCC Energy Efficiency:</strong> insulation gaps, sealing at wall junctions, downlight insulation gaps, energy rating maintained</li>
      </ul>

      <h3>Documentation handed over</h3>
      <ul>
        <li>Occupation Certificate / Certificate of Final Inspection</li>
        <li>Termite barrier certificate (AS 3660 management plan)</li>
        <li>Electrical safety certificate</li>
        <li>Plumbing compliance certificate</li>
        <li>Domestic Building Insurance policy details (insurer name + policy number — crucial if the builder later goes into liquidation)</li>
        <li>Energy rating certificate</li>
        <li>Warranties for appliances + finishes</li>
      </ul>
      <p>Don&apos;t accept PC without ALL of these documents. Missing paperwork is grounds to refuse PC.</p>

      <h2>What &quot;minor defect&quot; means (and where builders push)</h2>
      <p>
        The legal definition of a minor defect is one that doesn&apos;t make
        the building unfit for use and can be rectified during the DLP
        without major disruption. In practice, the line gets blurry, and
        builders often try to classify obvious-major items as &quot;minor&quot;
        so you accept PC and pay the final.
      </p>
      <p><strong>Genuinely minor (won&apos;t block PC):</strong></p>
      <ul>
        <li>Paint touch-ups</li>
        <li>Small cracks &lt; 1mm in plaster</li>
        <li>Single squeaky hinge</li>
        <li>One sticky door</li>
        <li>Minor scratches on benchtops or skirting</li>
      </ul>
      <p><strong>NOT minor — should be rectified before you accept PC:</strong></p>
      <ul>
        <li>Wet area waterproofing not certified (could leak into framing)</li>
        <li>Mortar joints outside AS 3700 tolerance (structural workmanship breach)</li>
        <li>Articulation joints blocked (could cause cracking)</li>
        <li>Roof flashings not sealed (water ingress risk)</li>
        <li>Electrical without RCDs (safety + AS 3000)</li>
        <li>Stair nosing without slip-resistance (NCC 3.9.1 + safety)</li>
        <li>Smoke alarms not interconnected (safety + compliance)</li>
        <li>Slab edge blowouts that prevent DPC compliance</li>
        <li>Brick piers out of plumb (structural)</li>
        <li>Missing termite management documentation (statutory)</li>
        <li>Any AS standard breach affecting safety</li>
      </ul>
      <p>
        If your inspector flags any of the second list, you have legal
        grounds to refuse PC. Put it in writing to the builder citing the
        specific contract clause + AS standard. They&apos;re required to
        rectify before PC can be reached.
      </p>

      <h2>The Defects Liability Period (DLP)</h2>
      <p>
        The DLP is the contractual window AFTER you&apos;ve accepted PC
        during which the builder must rectify items you identify. Standard
        durations:
      </p>
      <ul>
        <li><strong>HIA New Homes Contract:</strong> 13 weeks (3 months)</li>
        <li><strong>Master Builders New Home Contract:</strong> 26 weeks (6 months)</li>
        <li><strong>Custom contracts:</strong> negotiable — push for 26 weeks if you can</li>
      </ul>
      <p>
        During the DLP, document EVERY defect you notice in writing to the
        builder. Photograph each item with the date. Use the contract&apos;s
        defect notification template if there is one. Build a single running
        list and send updates weekly. The builder typically schedules a
        single &quot;defects rectification visit&quot; toward the end of the
        DLP — make sure your list is complete by then.
      </p>

      <h2>What happens after the DLP expires?</h2>
      <p>
        After the DLP, you can still claim against the builder under
        <strong> statutory warranties</strong> — typically:
      </p>
      <ul>
        <li><strong>6 years:</strong> structural defects, major waterproofing, major electrical</li>
        <li><strong>2 years:</strong> non-structural defects (cracks &lt; 2mm, paint, finishes, fittings)</li>
      </ul>
      <p>
        Specific durations vary by state. But statutory warranties are HARDER
        to enforce than DLP claims — you have to prove the defect existed at
        completion, not from later wear. Use the DLP aggressively.
      </p>

      <h2>If the builder refuses to rectify</h2>
      <p>Three escalation paths:</p>
      <ol>
        <li>
          <strong>Written notice to the builder citing the contract
          clause</strong> + AS standard breached. Keep tone professional;
          most builders rectify once the documentation is unambiguous.
        </li>
        <li>
          <strong>Complaint to your state building authority:</strong>{' '}
          Victorian Building Authority (VBA), NSW Fair Trading, QBCC
          (Queensland), Consumer Building Services (WA), Consumer &amp;
          Business Services (SA). They mediate disputes and can compel
          rectification.
        </li>
        <li>
          <strong>Claim against Domestic Building Insurance:</strong> every
          licensed AU builder must carry DBI (Vic), HBCF (NSW), or state
          equivalent. If the builder is insolvent or refuses, you claim
          against the insurance policy. This is what protected millions of
          new-build buyers when major builders like Porter Davis went into
          liquidation.
        </li>
      </ol>

      <h2>Typical PCI findings — what to expect</h2>
      <p>
        Realistic ranges for a standard 4-bedroom Australian new build at
        PCI:
      </p>
      <ul>
        <li><strong>Total defect count:</strong> 40–80 items</li>
        <li><strong>Major (should block PC if unrectified):</strong> 3–10 items</li>
        <li><strong>Cosmetic / minor:</strong> 30–60 items</li>
        <li><strong>Total estimated rectification value:</strong> $25K–$120K</li>
      </ul>
      <p>
        Don&apos;t panic at the number. A good builder rectifies most items
        between PC declaration and your final acceptance. The point of PCI
        is to create the documented list — the builder owes the work under
        contract regardless.
      </p>

      <h2>How Report Decoded helps</h2>
      <p>
        Upload your PCI report PDF and Report Decoded:
      </p>
      <ul>
        <li>Extracts every defect into a structured list</li>
        <li>Classifies severity (major / minor) per AS4349 framework</li>
        <li>Maps each item to the right rectification trade (cabinetmaker for joinery, stair specialist for nosing, painter for cosmetic finish, handyman for adjustments)</li>
        <li>Generates a <strong>Builder Rectification Letter</strong> — a formal but professional written request listing every defect, contract clause referenced, AS standards breached, with a 14-21 day rectification deadline. Copy, paste, send.</li>
        <li>Includes the <strong>&quot;If your builder refuses&quot;</strong> escalation path — statutory warranties, building authority complaint, DBI claim — tailored to your state</li>
        <li>Cites every claim to a specific page in your inspector&apos;s PDF so the builder can&apos;t hand-wave items away</li>
      </ul>
      <p>
        $39 per report. Same engine, different framing — handover reports
        use cooperative language (you and the builder are both meant to
        deliver the house to standard) but with the documentation rigour
        you need if cooperation breaks down.
      </p>

      <h2>The short version</h2>
      <ul>
        <li>PCI is the single most important moment of buyer leverage on a new build</li>
        <li>Use your own independent inspector ($650–$1,200) — never the builder&apos;s</li>
        <li>Commission within 1–3 days of the builder&apos;s PC notice</li>
        <li>Refuse to sign PC if there are major (not minor) defects</li>
        <li>Document every item during the DLP (13–26 weeks)</li>
        <li>Keep the DBI policy details — that&apos;s your safety net if the builder goes under</li>
        <li>Statutory warranties (6 years structural / 2 years non-structural) are your post-DLP fallback</li>
      </ul>
      <p>
        New-build buyers who do PCI properly typically get $40K–$120K of
        legitimate rectification work done by the builder for free — work
        that would be expensive owner-funded repairs five years later if
        skipped today.
      </p>
    </ArticleLayout>
  );
}
