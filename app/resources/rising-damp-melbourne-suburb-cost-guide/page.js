import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('rising-damp-melbourne-suburb-cost-guide');

const faqs = [
  {
    q: 'Why is rising damp so common in Melbourne specifically?',
    a: 'Three reasons. First: a huge proportion of Melbourne housing stock pre-dates 1940, when damp-proof course (DPC) was not standard in residential construction. Inner-north suburbs like Brunswick, Carlton, and Fitzroy are particularly concentrated in pre-DPC Victorian and Edwardian terraces. Second: Melbourne\'s reactive clay soils create movement at the brick courses where DPC would normally sit, breaking down whatever ad-hoc damp coursing was installed during 20th-century renovations. Third: Melbourne has higher annual rainfall and ground moisture than the eastern Australian average — more water available to wick up.',
  },
  {
    q: 'My Melbourne inspector said "evidence of rising damp" — does that mean active or historical?',
    a: 'The inspector\'s language is the clue. "Evidence of rising damp" typically means visible historical signs (efflorescence, salt staining, mortar deterioration) without confirming whether the source is still active. "Active rising damp evident" specifically means current elevated moisture readings. The cost difference is significant: historical damp that\'s been arrested by past treatment usually needs cosmetic remediation only ($2,000-$5,000). Active rising damp requires source rectification first ($4,000-$15,000 chemical DPC injection or mechanical replacement), then the cosmetic finish. Ask the inspector or commission specialist follow-up to confirm active vs historical.',
  },
  {
    q: 'Which Melbourne suburbs have the worst rising damp issues?',
    a: 'Pre-1940 terrace stock in the inner-north and inner-east is the highest-risk: Brunswick, Carlton, Fitzroy, Northcote, Collingwood, Richmond, North Melbourne, Kensington, Princes Hill. These are solid double-brick Victorian and Edwardian construction, often without any original DPC. Inner-west weatherboard cottages (Yarraville, Footscray, Seddon) have a different but related issue: subfloor moisture rising into timber framing rather than masonry, with similar visible symptoms but different remediation. Eastern Victorian (Hawthorn, Camberwell, Kew) and bayside (Brighton, Sandringham) have less prevalent rising damp because more of the stock is post-1950 with proper DPC.',
  },
  {
    q: 'Can I just paint over rising damp signs to cover them up?',
    a: 'No — and any agent who tells you "just paint over it before settlement" is selling you a deferred problem. Paint over efflorescence and the moisture continues wicking up, the paint blisters within 6-18 months, the underlying issue worsens, and the cost to remediate grows. Only acceptable cosmetic treatments AFTER source treatment is complete: salt-resistant render, breathable lime-based plaster, or full re-plastering once the wall has dried out (typically 3-6 months post-treatment). Painting over active rising damp is the AU residential equivalent of putting tape on a leaking pipe.',
  },
  {
    q: 'How much does it cost to retrofit DPC in a Brunswick terrace?',
    a: 'For a typical double-storey Victorian terrace in Brunswick, Fitzroy, or Carlton: chemical DPC injection runs $3,500-$8,000 (front and rear walls, contractor-applied through pre-drilled holes). Mechanical DPC replacement (cutting out a course, inserting physical damp barrier, reinstating) is more thorough but significantly more expensive at $15,000-$30,000+ per terrace, requires structural engineer involvement, and 6-12 weeks site time. Most buyers go with chemical injection unless the terrace has structural movement issues that need addressing simultaneously. Add $5,000-$15,000 for re-plastering once walls have dried.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Rising damp in Melbourne: cost to fix by suburb (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Melbourne has Australia&apos;s highest concentration
            of rising-damp-affected housing stock</strong> — particularly
            pre-1940 terraces in the inner-north (Brunswick, Carlton,
            Fitzroy, Northcote, Collingwood, Richmond). Cost ranges
            by suburb cluster: <strong>inner-north terraces $3.5-$8K
            DPC injection + $5-$15K re-plastering</strong>;{' '}
            <strong>inner-west weatherboard cottages $4-$10K subfloor
            + $3-$6K cosmetic</strong>;{' '}
            <strong>eastern post-1950 stock $1-$3K (minor cases
            only)</strong>;{' '}
            <strong>bayside $2-$5K (salt-driven, not classical rising
            damp)</strong>. Active damp needs source rectification first;
            historical damp can sometimes get cosmetic-only treatment.
            Never paint over without source treatment.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'rising-damp-australia-how-much-to-fix',
        'mould-in-australian-homes-remediation-cost',
        'concrete-cancer-spalling-cost-australia',
        'how-to-read-as4349-1-inspection-report',
      ]}
      related_suburbs={[
        'brunswick',
        'northcote',
        'thornbury',
        'hawthorn',
        'camberwell',
      ]}
    >
      <p>
        Buying a pre-1940 Melbourne terrace? Your inspector almost
        certainly flagged rising damp. The question isn&apos;t whether
        it&apos;s there — it&apos;s how much it costs to fix and
        whether you should negotiate for it.
      </p>
      <p>
        The cost depends massively on which Melbourne suburb. Brunswick
        double-brick terraces with no original DPC need different
        treatment to Yarraville weatherboard cottages with subfloor
        moisture. Brighton brick-veneer post-1960 stock rarely sees
        classical rising damp at all. Here&apos;s the actual 2026
        repair cost ranges by Melbourne suburb cluster.
      </p>

      <h2>Cluster 1 — Inner-north terraces (Brunswick, Carlton, Fitzroy, Northcote, Collingwood, Richmond)</h2>
      <p>
        The Melbourne suburbs with the highest rising-damp incidence.
        Construction era: 1880s-1930s Victorian and Edwardian double-
        brick terraces, mostly without original damp-proof course.
        Repair complexity: medium-high. Average defect cost: $8,000-
        $25,000 total.
      </p>
      <p>
        Cost breakdown for a typical 2-storey Victorian terrace:
      </p>
      <ul>
        <li>
          <strong>Chemical DPC injection (front + rear walls):</strong>{' '}
          $3,500-$8,000
        </li>
        <li>
          <strong>Mortar repointing where deteriorated:</strong>{' '}
          $2,500-$5,500
        </li>
        <li>
          <strong>Re-plastering affected areas (after 3-6 month drying):</strong>{' '}
          $5,000-$15,000
        </li>
        <li>
          <strong>Salt-resistant render coat:</strong> $2,000-$5,000
        </li>
        <li>
          <strong>Optional: mechanical DPC retrofit (if injection
          unsuitable):</strong> $15,000-$30,000+
        </li>
      </ul>
      <p>
        Properties on busy roads (Sydney Road Brunswick, Smith Street
        Collingwood, Brunswick Street Fitzroy) often have ground-level
        wall damage from a century of vehicle salt + moisture exposure
        — push the upper end of these ranges.
      </p>

      <h2>Cluster 2 — Inner-west cottages (Yarraville, Footscray, Seddon, Spotswood, Newport)</h2>
      <p>
        Construction era: 1900s-1930s weatherboard cottages on timber
        stumps with subfloor space. The &ldquo;rising damp&rdquo; in
        these properties is technically subfloor moisture rising into
        timber framing rather than classical masonry rising damp —
        different mechanism, similar visual symptoms, different
        treatment.
      </p>
      <p>
        Cost breakdown:
      </p>
      <ul>
        <li>
          <strong>Subfloor ventilation installation (additional vents
          + fans):</strong> $2,000-$5,000
        </li>
        <li>
          <strong>Stormwater drainage rectification:</strong>{' '}
          $1,500-$4,500
        </li>
        <li>
          <strong>Subfloor framing treatment (where rot/decay):</strong>{' '}
          $3,000-$10,000
        </li>
        <li>
          <strong>Floor and skirting refinishing:</strong>{' '}
          $2,000-$6,000
        </li>
      </ul>
      <p>
        Yarraville cottages adjacent to the Maribyrnong River and
        wetlands (e.g. Footscray Lake area) sit on consistently high
        water tables — these need ongoing subfloor ventilation
        management as part of regular property maintenance.
      </p>

      <h2>Cluster 3 — Eastern suburbs (Hawthorn, Camberwell, Kew, Glen Iris, Surrey Hills)</h2>
      <p>
        Mixed stock. Pre-1940 Victorian + Edwardian houses in these
        suburbs have the same rising-damp risks as inner-north
        terraces, but they&apos;re typically larger properties on
        bigger blocks with better drainage. Post-1940 stock (which is
        more of the area) has proper DPC and rarely shows classical
        rising damp.
      </p>
      <p>
        For pre-1940 stock: same cost ranges as Cluster 1 ($8K-$25K
        total). For post-1940 stock: typically $1,000-$3,000 for
        isolated minor cases (small efflorescence patches, surface
        plaster repair).
      </p>

      <h2>Cluster 4 — Bayside (Brighton, Sandringham, Hampton, Mentone)</h2>
      <p>
        Bayside rising damp is often misdiagnosed — what looks like
        rising damp is frequently SALT-driven moisture from sea
        spray penetrating brickwork on west-facing exteriors. Same
        visual symptoms, different cause, different treatment.
      </p>
      <p>
        Cost breakdown:
      </p>
      <ul>
        <li>
          <strong>Salt-driven brick remediation (cleaning + sealing):</strong>{' '}
          $2,000-$5,000
        </li>
        <li>
          <strong>Re-pointing salt-damaged mortar:</strong>{' '}
          $3,000-$8,000
        </li>
        <li>
          <strong>External salt-protective coating:</strong>{' '}
          $1,500-$4,000
        </li>
      </ul>
      <p>
        Bayside properties within 200m of the beach should be
        assessed by a specialist who can differentiate salt-driven
        moisture from classical rising damp — the two require
        different treatment.
      </p>

      <h2>Cluster 5 — Outer suburbs (Frankston, Mornington, Sunbury, Werribee)</h2>
      <p>
        Predominantly post-1970 stock with proper DPC. Classical
        rising damp is rare here — when it appears it&apos;s usually
        a specific localised issue (failed downpipe, broken plumbing,
        damaged DPC).
      </p>
      <p>
        Cost: typically $1,000-$3,000 for localised repair.
        Comprehensive treatment of rising damp across a whole house
        in these suburbs is rare.
      </p>

      <h2>Treatment options ranked by cost</h2>

      <h3>1. Cosmetic-only (historical, dried-out damp)</h3>
      <p>
        $1,500-$5,000. Salt-resistant render coat + repaint. Only
        acceptable when (a) source is confirmed inactive, (b)
        moisture meter readings are consistently low, (c) the
        affected area has fully dried (3-6 months post-active).
      </p>

      <h3>2. Chemical DPC injection</h3>
      <p>
        $3,500-$8,000 for typical Melbourne terrace. Specialist
        contractor injects silicone-based damp-proofing chemicals
        into pre-drilled holes at the lowest brick course.
        Effectiveness depends on installer quality + product —
        choose contractors with at least 10 years experience.
      </p>

      <h3>3. Mechanical DPC retrofit</h3>
      <p>
        $15,000-$30,000+. Cutting out a course of brickwork, inserting
        a physical damp-proof barrier, reinstating brickwork. Most
        reliable long-term solution but disruptive, expensive, and
        requires structural engineer involvement. Used when chemical
        injection is unsuitable (e.g. solid sandstock walls, listed
        properties).
      </p>

      <h3>4. Salt-resistant render + re-plastering</h3>
      <p>
        $5,000-$15,000 for typical Melbourne terrace. Applied AFTER
        source treatment. Modern lime-based plasters are breathable
        and allow ongoing moisture management.
      </p>

      <h2>Negotiation framework</h2>
      <p>
        Rising damp in a Melbourne pre-1940 terrace IS negotiable —
        every experienced agent expects it to come up. Reasonable
        negotiation positions:
      </p>
      <ul>
        <li>
          <strong>Historical damp, no active source:</strong>{' '}
          $2,000-$5,000 ask (covers cosmetic remediation)
        </li>
        <li>
          <strong>Active damp confirmed, limited extent:</strong>{' '}
          $5,000-$10,000 ask (covers DPC injection)
        </li>
        <li>
          <strong>Active damp confirmed, full-house extent:</strong>{' '}
          $15,000-$25,000 ask (covers full DPC + re-plastering)
        </li>
        <li>
          <strong>Mechanical DPC required:</strong> $25,000-$40,000+
          ask (covers full retrofit)
        </li>
      </ul>
      <p>
        See{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          how much to negotiate after a building inspection
        </Link>
        {' '}for the broader framework, and{' '}
        <Link href="/resources/building-inspection-negotiation-letter-template-australia">
          building inspection negotiation letter template
        </Link>
        {' '}for the letter structure.
      </p>

      <h2>Where Report Decoded fits</h2>
      <p>
        For Melbourne buyers in pre-1940 terrace stock, the rising
        damp question is almost always &ldquo;how much is it going
        to cost?&rdquo; — not &ldquo;is it there?&rdquo;
      </p>
      <p>
        Report Decoded analyses your inspection report and translates
        the rising damp finding into a specific Melbourne suburb
        cost range:
      </p>
      <p>
        <em>&ldquo;Rising damp evident to front and rear walls (page
        18, photos 24-28). Brunswick terrace context: typical DPC
        injection + re-plastering range $8,500-$23,000. Recommended
        specialist follow-up before settlement: damp specialist
        assessment $400-$800 to confirm active vs historical
        status.&rdquo;</em>
      </p>
      <p>
        That converts the inspector&apos;s technical wording into
        a defensible negotiation number — within minutes of the
        report arriving.
      </p>
    </ArticleLayout>
  );
}
