import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('what-is-as4349-1');

const faqs = [
  {
    q: 'Is an AS4349.1 inspection legally required before buying a house in Australia?',
    a: 'No — but in practice most lenders, buyer\'s agents, and conveyancers strongly recommend (or require) one before unconditional exchange. AS4349.1 is the technical standard your inspector should be working to. It\'s not a law, but if an inspector does NOT work to AS4349.1, you have very little to compare their report to or hold them accountable on.',
  },
  {
    q: 'What\'s the difference between AS4349.1, AS4349.2, and AS4349.3?',
    a: 'AS4349.1 covers pre-purchase building inspections — the most common one buyers commission. AS4349.2 covers acquired property reports (typically post-purchase / for insurance). AS4349.3 covers timber pest inspections (termites, borers, fungal decay). A "Building + Pest" combined inspection is usually AS4349.1 + AS4349.3 in one report.',
  },
  {
    q: 'How much should an AS4349.1 inspection cost?',
    a: 'Australian AS4349.1 building + pest inspection costs typically range $450–$850 depending on property size, region, and inspector. Free or sub-$300 inspections are usually too good to be true — corners get cut on access, photographs, and report depth. Pay for quality once.',
  },
  {
    q: 'What does AS4349.1 NOT cover?',
    a: 'It does NOT cover: interior wall cavities, sub-floor or roof spaces with restricted access, swimming pool integrity (separate AS1926 inspection), soil conditions, asbestos confirmation (visual indicators only), electrical compliance (separate electrician report), or BAL bushfire-rating compliance (separate inspector). The standard explicitly notes what falls outside scope — usually in Section 6 of the report.',
  },
  {
    q: 'My inspection report is 95 pages of jargon — what do I actually do with it?',
    a: 'That\'s why Report Decoded exists. Upload your AS4349.1 PDF and we extract every defect, classify severity, estimate Australian repair costs, and generate a ready-to-send negotiation letter — in under 2 minutes. Every claim cites the inspector\'s page so it\'s verifiable. $59, no subscription.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="What is AS4349.1?"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>AS4349.1</strong> is the Australian Standard your building inspector should be
            working to when they do a pre-purchase inspection. It defines what they
            look at, how they assess it, and how they report findings. It does <strong>not</strong> mandate
            quality &mdash; cheap inspectors still claim to follow it. What it gives you is a known
            framework to read your report against and to push back on if the inspector
            cut corners.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={['how-much-to-negotiate-after-building-inspection', 'termite-damage-cost-australia']}
      related_suburbs={['yarraville', 'brunswick', 'newtown', 'new-farm']}
    >
      <p>
        Every Australian pre-purchase building inspection is meant to be done to
        <strong> Australian Standard 4349.1</strong>. Buyers see it referenced
        on the first page of their report — usually buried in the disclaimer
        section — and assume it&apos;s just bureaucratic boilerplate.
      </p>
      <p>
        It&apos;s not. AS4349.1 is the playbook your inspector should be following.
        Knowing what it actually requires (and what it deliberately leaves out)
        is the difference between trusting your inspection and being blindsided
        three weeks after settlement.
      </p>

      <h2>What AS4349.1 actually covers</h2>
      <p>
        AS4349.1-2007 is titled <em>&quot;Inspection of buildings — Pre-purchase
        inspections — Residential buildings.&quot;</em> Published by Standards
        Australia, it&apos;s the technical baseline for the most common kind of
        building inspection you&apos;ll commission as a buyer.
      </p>
      <p>The standard requires the inspector to assess:</p>
      <ul>
        <li><strong>Site:</strong> drainage falls, retaining walls, fencing, surface conditions, paths</li>
        <li><strong>Sub-floor space:</strong> ventilation, moisture, framing, stumps, joists, bearers — IF accessible</li>
        <li><strong>Exterior:</strong> walls, cladding, windows, doors, roof, gutters, downpipes, eaves, fascias</li>
        <li><strong>Roof space:</strong> framing, sarking, insulation, plumbing penetrations — IF accessible</li>
        <li><strong>Interior:</strong> walls, ceilings, floors, windows, doors, joinery, wet areas, kitchen</li>
        <li><strong>Services:</strong> visible plumbing, visible electrical, hot water service, heating &mdash; visual only</li>
        <li><strong>Outbuildings:</strong> garages, sheds, carports, fences</li>
      </ul>

      <p>
        Note the word <strong>accessible</strong>. AS4349.1 is a <em>visual</em> inspection of what
        the inspector can safely access on the day. They&apos;re not allowed to lift
        carpets, drill holes, or break into wall cavities. If your sub-floor is
        sealed off, that gets a &quot;not inspected&quot; note in the report.
      </p>

      <h2>What it deliberately leaves out</h2>
      <p>
        The standard is just as important for what it <em>doesn&apos;t</em> cover. These
        gaps catch buyers out constantly:
      </p>
      <ul>
        <li><strong>Asbestos identification:</strong> the inspector flags visual indicators but cannot confirm asbestos without lab testing. If your pre-1990 home has asbestos cement sheeting somewhere (most do), you need a separate hazardous-materials survey ($700–$1,200) for certainty.</li>
        <li><strong>Electrical compliance:</strong> the inspector notes obvious safety concerns (no RCDs, exposed wiring) but isn&apos;t a licensed electrician. For full compliance certification you need a separate electrical safety check (~$250).</li>
        <li><strong>Plumbing pressure / function testing:</strong> visual only. They won&apos;t actually pressure-test pipes or run drainage cameras unless commissioned separately.</li>
        <li><strong>Pool integrity:</strong> separate AS1926 pool barrier inspection required.</li>
        <li><strong>Soil / foundation engineering:</strong> structural cracks get flagged but engineering assessment is separate.</li>
        <li><strong>BAL bushfire rating:</strong> separate Bushfire Attack Level assessment if you&apos;re in a BAL zone.</li>
        <li><strong>Pest inspection:</strong> AS4349.1 doesn&apos;t cover termites. That&apos;s AS4349.3, usually a separate but often combined report.</li>
      </ul>

      <p>
        These exclusions live in your report&apos;s &quot;Scope &amp; Limitations&quot; section.
        Most buyers skip it. Read it.
      </p>

      <h2>How the inspector classifies findings</h2>
      <p>AS4349.1 asks inspectors to classify defects in three tiers:</p>
      <ul>
        <li>
          <strong>Major defects:</strong> issues that pose a safety risk, structural
          concern, or are likely to require significant expenditure. These are the
          negotiation drivers.
        </li>
        <li>
          <strong>Minor defects:</strong> wear-and-tear items, cosmetic issues,
          maintenance backlog. Cumulative cost matters here even if individual items
          are small.
        </li>
        <li>
          <strong>Items requiring further investigation:</strong> things the
          inspector saw but couldn&apos;t fully assess from visual evidence. Common
          examples: suspected termite damage (needs invasive inspection), cracked
          tiles in wet areas (needs membrane test), foundation movement (needs
          engineer).
        </li>
      </ul>
      <p>
        Items in the third bucket are easy to gloss over but are often where the
        biggest costs hide. If your inspector says &quot;recommend further investigation
        by a structural engineer,&quot; that recommendation might be $20K–$50K of
        rectification work in disguise.
      </p>

      <h2>What a quality AS4349.1 report looks like</h2>
      <p>A good AS4349.1 inspection report should have:</p>
      <ul>
        <li><strong>40+ pages</strong> for a standard residential property. Anything under 25 pages on a typical 3-bedroom house is suspicious.</li>
        <li><strong>Photos of every defect</strong> — annotated where helpful. No photos = the inspector either didn&apos;t look or didn&apos;t document.</li>
        <li><strong>Specific locations</strong> — &quot;crack in eastern wall of master bedroom, approximately 1.2m from corner&quot; not &quot;crack in wall.&quot;</li>
        <li><strong>Severity classifications</strong> matched to AS4349.1 terminology (Major / Minor / Further Investigation).</li>
        <li><strong>An accessible &quot;Scope &amp; Limitations&quot; section</strong> listing every area NOT inspected and why.</li>
        <li><strong>Recommended trades</strong> for rectification of each defect.</li>
        <li><strong>The inspector&apos;s licence number + insurance details</strong> on the front page.</li>
      </ul>

      <h2>Common report problems to watch for</h2>
      <h3>Hedging language designed to limit liability</h3>
      <p>
        Inspectors are sued more than any other trade. As a result, reports are
        littered with phrases like &quot;could be indicative of...&quot; or &quot;may require
        further inspection&quot; that obscure how serious the issue is. AS4349.1
        doesn&apos;t require severity scores or repair-cost estimates, so most
        reports give neither.
      </p>
      <p>
        This is the gap Report Decoded fills — we re-read your AS4349.1 report
        and surface the actual severity + estimated repair cost in plain English,
        without the liability hedging.
      </p>

      <h3>&quot;Restricted access&quot; entries</h3>
      <p>
        When sub-floor or roof space is noted as &quot;restricted access&quot; or &quot;not
        inspected,&quot; that&apos;s a flag — not a deal-breaker. Decide whether to
        commission a follow-up access inspection (borescope, $400–$800) or
        proceed knowing the gap exists.
      </p>

      <h3>The infamous &quot;recommendation to engage a specialist&quot;</h3>
      <p>
        If the report says &quot;recommend further inspection by a [structural
        engineer / pest controller / plumber / electrician],&quot; the inspector
        is telling you something they noticed but couldn&apos;t fully assess. Read
        these carefully. They&apos;re often the most important items.
      </p>

      <h2>What to do once you&apos;ve got the report</h2>
      <p>Three immediate actions:</p>
      <ol>
        <li>
          <strong>Read the &quot;Scope &amp; Limitations&quot; section first.</strong> Know
          what was NOT inspected. Decide if any of those gaps need filling
          before exchange.
        </li>
        <li>
          <strong>List every Major Defect with an estimated repair cost.</strong>
          This becomes your negotiation list. Most buyers either don&apos;t
          translate the report into a dollar amount or under-cost the items.
          We have a separate guide on{' '}
          <Link href="/resources/how-much-to-negotiate-after-building-inspection">
            how much to negotiate after a building inspection
          </Link>
          .
        </li>
        <li>
          <strong>Identify which trade fixes each defect.</strong> A bricklayer for
          mortar, a concreter for slab edges, a stair specialist for nosing
          compliance, a pest controller for termites. Generic &quot;builder&quot; is
          rarely the right call. Report Decoded matches the right tradie to
          each defect automatically — across 22 trade categories.
        </li>
      </ol>

      <h2>Why this matters financially</h2>
      <p>
        On a typical $850K–$1.5M Australian residential purchase, a properly-read
        AS4349.1 inspection surfaces $15K–$80K of legitimate negotiation room.
        Vendors price their property assuming average buyer due diligence. Better
        due diligence = better outcomes.
      </p>
      <p>
        The $550–$750 you pay for the inspection AND the $59 for Report Decoded&apos;s
        analysis are rounding errors against the negotiation upside. The buyers
        who walk away from inspections without negotiating are leaving money on
        the table — sometimes tens of thousands.
      </p>

      <h2>The short version</h2>
      <p>
        AS4349.1 is the playbook your inspector follows. Knowing what it requires
        (and what it leaves out) means you can:
      </p>
      <ul>
        <li>Tell a thorough inspection from a perfunctory one.</li>
        <li>Spot the &quot;restricted access&quot; gaps and decide whether to fill them.</li>
        <li>Read past the liability-hedging language to the actual findings.</li>
        <li>Convert defect lists into negotiation dollar amounts.</li>
        <li>Match the right specialist trade to each rectification.</li>
      </ul>
      <p>
        Report Decoded automates the last four. Upload your PDF and we&apos;ll do
        the heavy lifting in under 2 minutes — $59, no subscription, every claim
        cited to your inspector&apos;s page.
      </p>
    </ArticleLayout>
  );
}
