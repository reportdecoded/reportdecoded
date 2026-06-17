import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('restumping-reblocking-cost-australia');

const faqs = [
  {
    q: 'How much does it cost to restump a house in Australia?',
    a: 'A full restump of a typical Australian home runs roughly $15,000-$35,000, rising to $40,000-$50,000+ for large homes, heritage construction, poor under-floor access, or an upgrade to galvanised steel stumps. A partial restump — replacing a handful of failed stumps rather than the whole house — is usually $2,000-$10,000. The big cost drivers are the number of stumps, how easy the subfloor is to get into, and whether the floor needs significant re-levelling.',
  },
  {
    q: 'What is the difference between restumping and reblocking?',
    a: 'Nothing — they are the same job under different regional names. "Restumping" is the common term in Victoria and most of Australia; "reblocking" is used more in some areas and historically referred to replacing concrete "blocks." Both mean replacing the stumps (footings) that support a house with a suspended timber floor. You may also see "underpinning," but that is a different repair — underpinning strengthens existing concrete-slab footings, whereas restumping replaces the stumps under a timber-floored house.',
  },
  {
    q: 'How do I know if my house needs restumping?',
    a: 'The classic signs are sloping or bouncy floors, doors and windows that stick or won\'t close square, gaps opening between walls and cornices, and internal cracking that gets worse over time. Under the house, failed stumps look rotted, cracked, leaning, sinking, or packed up with timber offcuts and bricks (a tell-tale sign someone has already band-aided movement). Your building inspector will note these as "stumps deteriorated," "subfloor movement," "floors out of level," or "packing evident to stumps."',
  },
  {
    q: 'Do I need a permit to restump a house?',
    a: 'Usually yes. In most states restumping is regulated building work that requires a building permit and, in many cases, a registered building practitioner plus engineering sign-off — because it temporarily lifts and re-supports the entire house. In Victoria, for example, a building permit is generally required. A reputable restumping contractor handles the permit and inspections as part of the job; if a quote is suspiciously cheap and makes no mention of permits, that is a red flag.',
  },
  {
    q: 'Can I live in the house during restumping?',
    a: 'Often yes, but with disruption. The house is jacked up in stages, so you may get cracked plaster, doors that need re-hanging, and temporary loss of access. Most full restumps take 1-3 weeks depending on size and access. Budget separately for cosmetic make-good — re-levelling an old house almost always opens up some plaster and cornice cracks that need patching and repainting afterwards.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Restumping and reblocking cost in Australia: what it really costs (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Restumping (a.k.a. reblocking) replaces the failing
            stumps under a house with a suspended timber floor.</strong>{' '}
            A partial restump of a few stumps runs{' '}
            <strong>$2,000-$10,000</strong>. A full restump of a typical
            home is <strong>$15,000-$35,000</strong>, rising to{' '}
            <strong>$40,000-$50,000+</strong> for large homes, poor
            under-floor access, or a concrete-to-galvanised-steel
            upgrade. Sloping floors, sticking doors, and cracking that
            keeps moving are the visible signs. It is regulated building
            work — expect a permit and engineering. Budget separately
            for plaster make-good after re-levelling. It is rarely a
            walk-away, but it is big-ticket — get it costed before you
            negotiate.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'structural-cracks-building-inspection-australia',
        'termite-damage-cost-australia',
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={[
        'west-footscray',
        'new-farm',
        'st-kilda',
        'mount-gravatt',
      ]}
    >
      <p>
        You&apos;re reading the building inspection report and you hit
        a line like this:
      </p>
      <p>
        <em>&ldquo;Subfloor stumps deteriorated in several locations.
        Floors noted to be out of level. Evidence of movement.
        Restumping recommended &mdash; further assessment
        advised.&rdquo;</em>
      </p>
      <p>
        For a lot of older Australian homes &mdash; weatherboard
        cottages, Queenslanders, period terraces &mdash; this is one of
        the most common big-ticket findings there is. And like most
        things in a building report, the cost swings wildly depending on
        the detail: it&apos;s the difference between a{' '}
        <strong>$3,000 partial fix and a $40,000 full reblock</strong>.
        Here&apos;s how to tell which one you&apos;re looking at.
      </p>

      <h2>What restumping actually is</h2>
      <p>
        Many older Australian houses don&apos;t sit on a concrete slab.
        They have a <strong>suspended timber floor</strong> held up by
        a grid of <strong>stumps</strong> (also called footings or
        piers) driven into the ground beneath the house. Over decades,
        those stumps fail &mdash; and when they do, the floor above them
        sinks, tilts, or bounces.
      </p>
      <p>
        <strong>Restumping</strong> (called <strong>reblocking</strong>{' '}
        in some areas &mdash; same job) is the process of jacking the
        house up, removing the old stumps, and replacing them with new
        ones, then re-levelling the floor. It&apos;s major structural
        work, but it&apos;s routine and well understood &mdash; thousands
        of homes are restumped in Australia every year.
      </p>
      <p>
        Note this is different from <strong>underpinning</strong>, which
        strengthens the footings under a concrete-slab or brick home.
        Restumping is specifically for houses on stumps.
      </p>

      <h2>Why stumps fail</h2>
      <ul>
        <li>
          <strong>Timber rot.</strong> Original stumps were often red
          gum or other hardwood timber. After 50-100 years in damp
          ground they rot, especially where subfloor drainage and
          ventilation are poor.
        </li>
        <li>
          <strong>Termite damage.</strong> Timber stumps are a prime
          target. If your report also flags{' '}
          <Link href="/resources/termite-damage-cost-australia">
            termite activity
          </Link>
          , the stumps are often where it started.
        </li>
        <li>
          <strong>Reactive soil movement.</strong> Clay soils swell and
          shrink with moisture, heaving and dropping stumps over the
          seasons.
        </li>
        <li>
          <strong>Concrete stump deterioration.</strong> Even mid-20th-
          century concrete stumps can crack, spall, or sink if they were
          undersized or poorly footed.
        </li>
      </ul>

      <h2>The signs in your report (and your walk-through)</h2>
      <p>
        Standard{' '}
        <Link href="/resources/what-is-as4349-1">
          AS4349.1 building inspections
        </Link>{' '}
        flag stump problems through a mix of subfloor and above-floor
        clues:
      </p>
      <ul>
        <li>
          <strong>&ldquo;Floors out of level&rdquo; / sloping or bouncy
          floors</strong> &mdash; the classic symptom. A marble that
          rolls across the room is the folk test.
        </li>
        <li>
          <strong>&ldquo;Stumps deteriorated / rotted / cracked&rdquo;</strong>{' '}
          &mdash; noted from the subfloor inspection.
        </li>
        <li>
          <strong>&ldquo;Packing evident to stumps&rdquo;</strong>{' '}
          &mdash; timber offcuts or bricks wedged on top of stumps to
          re-level the floor. A sign someone has band-aided movement
          rather than fixed it.
        </li>
        <li>
          <strong>Doors and windows that stick</strong> or won&apos;t
          close square.
        </li>
        <li>
          <strong>Gaps between walls and cornices/skirtings</strong>, and
          internal cracking &mdash; sometimes confused with{' '}
          <Link href="/resources/structural-cracks-building-inspection-australia">
            structural cracking
          </Link>
          , but driven by the floor moving underneath.
        </li>
      </ul>

      <h2>What restumping actually costs in 2026</h2>
      <p>
        Cost is driven far more by the <strong>number of stumps</strong>,{' '}
        <strong>under-floor access</strong>, and{' '}
        <strong>how much re-levelling</strong> is needed than by anything
        else. Real 2026 Australian ranges by scenario:
      </p>
      <ul>
        <li>
          <strong>Partial restump (a few failed stumps):</strong>{' '}
          $2,000-$10,000. Replacing 5-15 stumps where movement is
          localised.
        </li>
        <li>
          <strong>Full restump &mdash; small/medium home, good
          access:</strong> $15,000-$25,000.
        </li>
        <li>
          <strong>Full restump &mdash; larger home or restricted
          access:</strong> $25,000-$40,000.
        </li>
        <li>
          <strong>Full restump &mdash; large/heritage, poor access, or
          steel-stump upgrade:</strong> $40,000-$50,000+.
        </li>
        <li>
          <strong>Permit + engineering:</strong> $500-$2,000 (usually
          included in a proper contractor&apos;s quote).
        </li>
        <li>
          <strong>Cosmetic make-good after re-levelling:</strong>{' '}
          $1,000-$5,000 in plaster/cornice patching and repainting.
        </li>
      </ul>
      <p>
        <em>These are typical ranges to guide you, not quotes &mdash;
        always get 2-3 written quotes from licensed, insured restumping
        contractors for your specific property.</em>
      </p>

      <h2>Concrete vs galvanised steel stumps</h2>
      <p>
        You&apos;ll be offered a choice of replacement stump material,
        and it affects both cost and longevity:
      </p>
      <ul>
        <li>
          <strong>Concrete stumps</strong> &mdash; the standard,
          cheapest option. Long-lasting if correctly footed. The default
          for most full restumps.
        </li>
        <li>
          <strong>Galvanised steel stumps</strong> &mdash; typically
          20-40% more, but adjustable (they can be re-levelled later
          without major work) and highly durable. Worth considering on
          reactive clay sites where future movement is likely.
        </li>
      </ul>

      <h2>The bit buyers forget: it&apos;s regulated work</h2>
      <p>
        Restumping temporarily lifts and re-supports your entire house,
        so in most states it&apos;s <strong>regulated building work</strong>{' '}
        &mdash; requiring a building permit, a registered practitioner,
        and often engineering sign-off. A reputable contractor builds
        the permit and inspections into the quote. If a price looks too
        good and there&apos;s no mention of permits or insurance, that&apos;s
        your warning sign &mdash; cut-price restumping that skips the
        paperwork can cause problems at resale and with insurers.
      </p>

      <h2>Is it a dealbreaker?</h2>
      <p>
        Usually <strong>no</strong>. Restumping is routine, fixable, and
        predictable once it&apos;s been quoted. The danger isn&apos;t the
        stumps &mdash; it&apos;s buying without knowing the number. A
        report that says &ldquo;restumping recommended&rdquo; with no
        cost leaves you guessing whether it&apos;s a $4,000 partial or a
        $40,000 full reblock.
      </p>
      <p>
        The move: get it costed, then decide whether to{' '}
        <Link href="/resources/what-to-do-if-building-inspection-finds-major-problems">
          proceed, renegotiate, or walk
        </Link>
        .
      </p>

      <h2>How to use it to negotiate</h2>
      <p>
        Restumping is one of the stronger negotiation levers in a
        building report, because the scope is quotable and the cost is
        defensible. The framework:
      </p>
      <ul>
        <li>
          <strong>Partial restump:</strong> $3,000-$10,000 ask,
          quote-based.
        </li>
        <li>
          <strong>Full restump:</strong> $15,000-$40,000 ask, backed by a
          licensed restumper&apos;s written quote.
        </li>
        <li>
          Anchor the number to the report and the quote &mdash; not a
          round guess. See our{' '}
          <Link href="/resources/how-much-to-negotiate-after-building-inspection">
            negotiation framework
          </Link>{' '}
          for the full structure.
        </li>
      </ul>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded reads your AS4349.1 building &amp; pest PDF and
        pulls out every stump-related finding &mdash; &ldquo;stumps
        deteriorated,&rdquo; &ldquo;floors out of level,&rdquo;{' '}
        &ldquo;packing evident,&rdquo; &ldquo;subfloor movement&rdquo;{' '}
        &mdash; then assigns it a likely severity and an indicative 2026
        cost range, so you walk into the negotiation knowing whether
        you&apos;re looking at a partial fix or a full reblock.
      </p>
      <p>
        <Link href="/">Upload your report to Report Decoded</Link> and
        every defect &mdash; stumps included &mdash; comes back in plain
        English, costed, with ready-to-send negotiation wording.{' '}
        <strong>One report, $59. No subscription.</strong>
      </p>
    </ArticleLayout>
  );
}
