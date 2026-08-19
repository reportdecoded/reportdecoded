import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('rising-damp-treatment-cost-sydney');

const faqs = [
  {
    q: 'Why is rising damp so common in Sydney\'s inner suburbs?',
    a: 'Two big reasons. First, the housing stock: Sydney\'s inner ring — Paddington, Surry Hills, Newtown, Glebe, Balmain, Redfern — is dominated by 1880s-1915 Victorian and Federation terraces built from porous sandstock brick and, in the oldest cases, Sydney sandstone. Most pre-date the era when a damp-proof course (DPC) was standard, so groundwater wicks straight up the wall. Second, sandstone itself is highly porous and holds moisture, so sandstone foundations and cottages draw damp even where later brickwork above has a DPC. Add Sydney\'s humidity and you get classic rising-damp symptoms — efflorescence, salt staining, blistering paint and mortar decay 600mm-1m up the wall.',
  },
  {
    q: 'My Sydney inspector flagged rising damp — is it the brick or the sandstone?',
    a: 'It matters for cost, so it\'s worth confirming. In sandstock-brick terraces, chemical DPC injection into the lowest brick course is usually viable ($4,000-$9,000). In solid Sydney sandstone (foundations, whole cottages, garden and retaining walls), chemical injection is far less reliable because sandstone doesn\'t take the injection evenly — the fix leans toward mechanical/atmospheric drainage, breathable lime render and improved ground drainage, which is a specialist job. Sealing sandstone with a non-breathable coating is the classic mistake: it traps moisture and spalls the stone. If your report says "sandstone", get a heritage-experienced damp specialist, not a general waterproofer.',
  },
  {
    q: 'Which Sydney suburbs have the worst rising damp?',
    a: 'The pre-1915 terrace belt: Paddington, Surry Hills, Darlinghurst, Newtown, Erskineville, Redfern, Glebe, and inner-west Balmain, Leichhardt, Annandale, Rozelle. These are solid double-brick and sandstone, often with no original DPC and a century of raised ground levels, paving and rendered-over walls bridging whatever damp course existed. Harbourside and eastern-beaches stock (Bondi, Coogee, Bronte, Vaucluse) shows similar symptoms but the cause is frequently salt-driven moisture from sea spray rather than classical rising damp — different treatment. Post-war brick-veneer suburbs in the west, south and Hills district rarely see true rising damp; they have proper DPC.',
  },
  {
    q: 'Is my Bondi or Coogee "rising damp" actually rising damp?',
    a: 'Often not. Within roughly 500m of the coast, wind-driven salt spray penetrates brick and mortar and crystallises inside the wall, producing efflorescence and blistering that looks identical to rising damp but is salt-driven from the outside, not groundwater from below. The treatment is different — external salt remediation, re-pointing and a breathable protective coating rather than a DPC. Getting the diagnosis right saves you paying $6,000+ for a chemical DPC that won\'t fix a salt problem. A specialist damp assessment ($400-$800) distinguishes the two before you negotiate or commit.',
  },
  {
    q: 'How much does it cost to retrofit DPC in a Paddington or Surry Hills terrace?',
    a: 'For a typical two-storey Victorian terrace in Paddington, Surry Hills, Newtown or Glebe: chemical DPC injection to the affected front and rear walls runs $4,000-$9,000 (Sydney trade rates sit a little above Melbourne). Mechanical DPC replacement — cutting out a brick course, inserting a physical barrier and reinstating — is the durable option at $18,000-$35,000+ per terrace, needs a structural engineer, and 6-12 weeks on site. Budget a further $6,000-$16,000 to re-plaster with salt-resistant/lime render once the walls have dried (3-6 months). Most buyers choose chemical injection unless the wall is sandstone or has structural movement that must be addressed at the same time.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Rising damp treatment cost in Sydney: what to pay by suburb (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Sydney&apos;s pre-1915 terrace belt — Paddington,
            Surry Hills, Newtown, Glebe, Balmain, Leichhardt — has some
            of Australia&apos;s highest rising-damp incidence</strong>,
            thanks to porous sandstock brick and sandstone built without
            a damp-proof course. Typical 2026 costs:{' '}
            <strong>chemical DPC injection $4-$9K</strong> +{' '}
            <strong>re-plastering $6-$16K</strong> for a terrace;{' '}
            <strong>mechanical DPC retrofit $18-$35K+</strong> where
            injection won&apos;t work;{' '}
            <strong>sandstone cottages need specialist breathable
            treatment</strong> (never seal). Coastal &ldquo;rising
            damp&rdquo; in Bondi/Coogee is often salt-driven, not
            groundwater — different fix. Confirm active vs historical,
            and brick vs sandstone, before you negotiate.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'rising-damp-australia-how-much-to-fix',
        'rising-damp-melbourne-suburb-cost-guide',
        'mould-in-australian-homes-remediation-cost',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={[
        'paddington-sydney',
        'surry-hills',
      ]}
    >
      <p>
        Buying a Victorian or Federation terrace in Sydney&apos;s inner
        suburbs? Your inspector almost certainly flagged rising damp.
        The question isn&apos;t whether it&apos;s there — in pre-1915
        sandstock-brick stock it usually is — it&apos;s how much it
        costs to fix and how much you can negotiate for it.
      </p>
      <p>
        The cost swings hugely with the suburb and the material. A
        Paddington double-brick terrace with no original damp-proof
        course needs different treatment to a Glebe sandstone cottage
        or a Bondi wall that&apos;s actually got a salt problem, not a
        groundwater one. Here&apos;s the realistic 2026 treatment-cost
        ranges by Sydney suburb cluster.
      </p>

      <h2>Cluster 1 — Inner-city terraces (Paddington, Surry Hills, Darlinghurst, Newtown, Erskineville, Redfern, Glebe)</h2>
      <p>
        The Sydney suburbs with the highest rising-damp incidence.
        Construction era: 1880s-1915 Victorian and Federation
        double-brick terraces in porous sandstock, mostly without
        original DPC, many with sandstone footings. Repair complexity:
        medium-high. Typical total: $10,000-$28,000.
      </p>
      <p>
        Cost breakdown for a typical two-storey terrace:
      </p>
      <ul>
        <li>
          <strong>Chemical DPC injection (front + rear walls):</strong>{' '}
          $4,000-$9,000
        </li>
        <li>
          <strong>Mortar re-pointing where deteriorated:</strong>{' '}
          $3,000-$6,500
        </li>
        <li>
          <strong>Re-plastering affected areas (after 3-6 month drying):</strong>{' '}
          $6,000-$16,000
        </li>
        <li>
          <strong>Salt-resistant / breathable lime render:</strong>{' '}
          $2,500-$6,000
        </li>
        <li>
          <strong>Optional: mechanical DPC retrofit (if injection
          unsuitable):</strong> $18,000-$35,000+
        </li>
      </ul>
      <p>
        Terraces on the old tram and traffic routes (Oxford Street,
        King Street Newtown, Glebe Point Road) often carry extra
        ground-level wall damage from a century of road moisture and
        salt — push the upper end of these ranges.
      </p>

      <h2>Cluster 2 — Inner-west terraces (Balmain, Leichhardt, Annandale, Rozelle, Marrickville, Dulwich Hill, Stanmore)</h2>
      <p>
        Similar stock to the inner city — Victorian and Federation
        terraces and workers&apos; cottages, sandstock brick with some
        sandstone — but often on more sloping, moisture-holding ground
        toward the harbour and Cooks River. The mechanism is classical
        rising damp, sometimes compounded by poor site drainage.
      </p>
      <p>
        Cost breakdown:
      </p>
      <ul>
        <li>
          <strong>Chemical DPC injection:</strong> $4,000-$8,500
        </li>
        <li>
          <strong>Site / stormwater drainage rectification:</strong>{' '}
          $2,000-$6,000
        </li>
        <li>
          <strong>Re-plastering + breathable render:</strong>{' '}
          $6,000-$14,000
        </li>
      </ul>
      <p>
        Balmain and Rozelle cottages built into sandstone slopes
        frequently have damp entering through sandstone foundation
        walls — that needs the sandstone approach below, not brick
        injection.
      </p>

      <h2>Cluster 3 — Sandstone cottages and foundations (harbour foreshore, Glebe, Balmain, lower North Shore)</h2>
      <p>
        Sydney is the one Australian city where solid sandstone
        construction is common — whole cottages, foundation walls,
        garden and retaining walls. Sandstone is highly porous and
        draws moisture readily, and it does <em>not</em> respond well
        to chemical DPC injection.
      </p>
      <p>
        The right approach is drainage and breathability, not sealing:
      </p>
      <ul>
        <li>
          <strong>External ground drainage + agricultural drain
          install:</strong> $4,000-$12,000
        </li>
        <li>
          <strong>Breathable lime-render / lime-wash system (never
          cement or acrylic seal):</strong> $5,000-$15,000
        </li>
        <li>
          <strong>Sandstone repair / repointing with lime mortar:</strong>{' '}
          $3,000-$10,000+
        </li>
      </ul>
      <p>
        The costly mistake here is a general waterproofer sealing the
        stone with a non-breathable coating — it traps moisture inside
        and causes the sandstone to spall and crumble. If your report
        mentions sandstone, insist on a heritage-experienced damp
        specialist.
      </p>

      <h2>Cluster 4 — Eastern beaches and harbourside (Bondi, Coogee, Bronte, Randwick, Vaucluse, Mosman)</h2>
      <p>
        Here, what reads as rising damp is often SALT-driven moisture:
        wind-blown sea spray penetrating brick and mortar and
        crystallising inside the wall. Same efflorescence and blistering,
        completely different cause — and a chemical DPC won&apos;t fix it.
      </p>
      <p>
        Cost breakdown for genuine salt-driven damp:
      </p>
      <ul>
        <li>
          <strong>Salt remediation (cleaning + neutralising):</strong>{' '}
          $2,500-$6,000
        </li>
        <li>
          <strong>Re-pointing salt-damaged mortar:</strong>{' '}
          $3,500-$9,000
        </li>
        <li>
          <strong>External breathable protective coating:</strong>{' '}
          $2,000-$5,000
        </li>
      </ul>
      <p>
        Any property within ~500m of the surf should be assessed by a
        specialist who can separate salt attack from classical rising
        damp — paying for the wrong one is the single most common waste
        of money on the eastern beaches.
      </p>

      <h2>Cluster 5 — North Shore and outer brick-veneer (Chatswood, Lane Cove, the Hills, western and southern Sydney)</h2>
      <p>
        Mixed. Pre-1940 Federation homes on the lower North Shore carry
        the same rising-damp risk as inner terraces (use Cluster 1
        ranges). But the bulk of post-war and modern brick-veneer stock
        across western, southern and north-western Sydney has a proper
        DPC — classical rising damp is rare and usually points to a
        specific fault (failed downpipe, broken plumbing, damaged DPC,
        garden bed built up over the damp course).
      </p>
      <p>
        Cost for post-1960 stock: typically $1,500-$4,000 for a
        localised repair once the specific cause is fixed.
      </p>

      <h2>Treatment options ranked by cost</h2>

      <h3>1. Cosmetic-only (historical, dried-out damp)</h3>
      <p>
        $2,000-$6,000. Salt-resistant render + repaint. Only valid when
        the source is confirmed inactive, moisture-meter readings are
        consistently low, and the wall has fully dried (3-6 months after
        the source was stopped).
      </p>

      <h3>2. Chemical DPC injection</h3>
      <p>
        $4,000-$9,000 for a typical Sydney terrace. A specialist injects
        silicone-based damp-proofing into pre-drilled holes at the
        lowest brick course. Works well in sandstock brick; unreliable
        in sandstone. Use contractors with 10+ years&apos; experience.
      </p>

      <h3>3. Sandstone drainage + breathable system</h3>
      <p>
        $9,000-$25,000+. For sandstone cottages and foundations:
        external drainage to move groundwater away, plus breathable
        lime render/wash so the stone can dry outward. Never seal
        sandstone.
      </p>

      <h3>4. Mechanical DPC retrofit</h3>
      <p>
        $18,000-$35,000+. Cutting out a brick course, inserting a
        physical damp barrier, reinstating. The most reliable long-term
        fix but disruptive and expensive; needs a structural engineer.
        Used where chemical injection can&apos;t work.
      </p>

      <h2>Negotiation framework</h2>
      <p>
        Rising damp in a pre-1915 Sydney terrace is expected and fully
        negotiable — every experienced agent has seen it. Reasonable
        positions:
      </p>
      <ul>
        <li>
          <strong>Historical damp, no active source:</strong>{' '}
          $2,500-$6,000 ask (cosmetic remediation)
        </li>
        <li>
          <strong>Active damp, limited extent:</strong>{' '}
          $6,000-$12,000 ask (DPC injection)
        </li>
        <li>
          <strong>Active damp, full-house extent:</strong>{' '}
          $16,000-$28,000 ask (full DPC + re-plastering)
        </li>
        <li>
          <strong>Sandstone or mechanical DPC required:</strong>{' '}
          $25,000-$40,000+ ask
        </li>
      </ul>
      <p>
        See{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          how much to negotiate after a building inspection
        </Link>
        {' '}for the broader framework, the{' '}
        <Link href="/resources/building-inspection-negotiation-letter-template-australia">
          negotiation letter template
        </Link>
        {' '}for the wording, and the{' '}
        <Link href="/resources/rising-damp-melbourne-suburb-cost-guide">
          Melbourne suburb cost guide
        </Link>
        {' '}if you&apos;re comparing markets.
      </p>

      <h2>Where Report Decoded fits</h2>
      <p>
        For Sydney buyers in the inner-terrace belt, the rising-damp
        question is almost always &ldquo;how much?&rdquo; — not
        &ldquo;is it there?&rdquo;
      </p>
      <p>
        Report Decoded reads your inspection PDF and turns the rising-damp
        finding into a specific Sydney cost range:
      </p>
      <p>
        <em>&ldquo;Rising damp evident to front and party walls (page 16,
        photos 21-27). Paddington sandstock-brick terrace context: typical
        DPC injection + re-plastering range $10,000-$24,000. Confirm active
        vs historical and brick vs sandstone before settlement — damp
        specialist assessment $400-$800.&rdquo;</em>
      </p>
      <p>
        That converts the inspector&apos;s technical wording into a
        defensible number you can put in front of the agent — within
        minutes of the report landing, in{' '}
        <Link href="/resources/rising-damp-australia-how-much-to-fix">
          plain English
        </Link>.
      </p>
    </ArticleLayout>
  );
}
