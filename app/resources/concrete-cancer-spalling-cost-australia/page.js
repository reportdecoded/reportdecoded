import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('concrete-cancer-spalling-cost-australia');

const faqs = [
  {
    q: 'What\'s the difference between concrete cancer and concrete spalling?',
    a: 'They\'re different stages of the same problem. Concrete cancer is the underlying disease — embedded steel reinforcement (rebar) corrodes, expands to roughly 6 times its original volume, and forces the surrounding concrete apart. Spalling is the visible symptom — chunks of concrete cracking off, falling away, or exposing the rust-coloured rebar underneath. By the time you see spalling, the concrete cancer has been progressing internally for years. Inspectors use both terms; some use them interchangeably, but technically "spalling" describes the visible effect and "concrete cancer" describes the cause.',
  },
  {
    q: 'Is concrete cancer fixable or do I need to walk away?',
    a: 'Almost always fixable — the question is cost. Cosmetic spalling on a non-structural element (a render finish on a wall, a balcony nosing) is a $1,500-$5,000 patch-and-paint repair. Localised structural spalling (one balcony slab edge, a section of a retaining wall) is $5,000-$25,000 depending on access. Widespread cancer affecting an entire suspended slab, structural columns, or multiple balconies typically runs $40,000-$200,000+ and may require engineering, scaffolding, and significant access works. The walk-away scenarios are rare: extreme cases where the structural integrity of a whole building element is compromised AND the building has no scheme funds to remediate.',
  },
  {
    q: 'How much does concrete cancer repair cost in an apartment vs a house?',
    a: 'Houses: typically $3,000-$25,000 for the common scenarios (balcony spalling, retaining wall sections, garage slab edges). The cost driver is access and finish matching, not the actual repair area. Apartments: the unit you\'re buying is usually unaffected directly, but the concrete cancer on common property (suspended slabs, lift cores, balconies, building facade) is funded through special levies on the owners corporation. Common per-lot exposure: $8,000-$45,000 depending on building size, severity, and what proportion of remediation insurance/HBCF/builders\' warranty covers. The strata report meeting minutes is where you find out what the OC is planning.',
  },
  {
    q: 'Will my building inspector identify concrete cancer?',
    a: 'They\'ll identify it where it\'s visually obvious — exposed rust-stained rebar, rust bleeding through concrete surfaces, hollow-sounding concrete (tested with a hammer), efflorescence (white salt deposits) at crack lines, surface delamination. What AS4349.1 inspectors can\'t do: confirm extent without invasive testing (concrete cores, half-cell potential survey, chloride/carbonation testing) and quantify how much rebar is affected internally. The inspector\'s note will typically read "evidence of concrete spalling — further investigation by a structural engineer recommended." That triggered investigation costs $1,200-$3,500 and gives you a quantified repair scope.',
  },
  {
    q: 'Why is concrete cancer worse in coastal Australian homes?',
    a: 'Chloride ions from sea spray penetrate concrete and accelerate rebar corrosion dramatically. Concrete cancer on a property 200m from the surf line in Bondi or Burleigh can progress 5-10x faster than identical concrete inland. Coastal AU stock — particularly 1960s-1990s suspended slab construction, balcony nosings, and unpainted concrete fences in the salt-spray zone — is the highest-risk category. Pre-1990 coastal apartments are the single biggest driver of strata special levies for concrete remediation. If you\'re buying within 500m of the coast in NSW, QLD, VIC, WA — expect concrete cancer to come up in due diligence regardless of building age.',
  },
  {
    q: 'What happens if I ignore concrete cancer?',
    a: 'It progresses, never reverses. Untreated concrete cancer on a balcony slab will typically progress from cosmetic spalling to structural compromise over 5-15 years depending on environment. The eventual repair becomes 3-5x more expensive than early intervention because the scope grows from patch repair to partial slab replacement. In severe cases — particularly on cantilevered balconies — the slab can fail catastrophically (there have been recorded balcony collapses in Australian apartments where concrete cancer was left untreated for decades). Insurance implications: most home and strata insurance policies exclude damage from gradual concrete deterioration, so the eventual repair is owner-funded regardless. Catching it early is materially cheaper than reactive repair.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Concrete cancer in Australian homes: what it is, what it costs to fix (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>&ldquo;Concrete cancer&rdquo; sounds catastrophic
            but is almost always fixable.</strong> It&apos;s rebar
            corrosion inside concrete that expands and forces the
            concrete to crack and spall. Cosmetic patch repair:{' '}
            <strong>$1,500-$5,000</strong>. Localised structural
            repair (one balcony, a retaining wall section):{' '}
            <strong>$5,000-$25,000</strong>. Widespread cancer across
            an entire slab, multiple balconies, or building facade:{' '}
            <strong>$40,000-$200,000+</strong>. For apartments, the
            cost lands as a special levy ($8K-$45K typical per-lot
            exposure). Coastal AU stock progresses 5-10x faster. Get a
            structural engineer&apos;s quantified scope before
            negotiating ($1,200-$3,500). Early intervention is
            3-5x cheaper than deferred repair.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'strata-report-explained-australia',
        'what-is-as4349-1',
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={[
        'bondi',
        'manly',
        'mosman',
        'mentone',
        'chatswood',
      ]}
    >
      <p>
        Your building inspector&apos;s report lands. You scan it for
        red flags. There it is, page 14:
      </p>
      <p>
        <em>&ldquo;Evidence of concrete cancer to underside of
        balcony slab — rust staining and surface spalling visible.
        Further investigation by a structural engineer recommended.
        Estimated repair cost: indeterminate without intrusive
        investigation.&rdquo;</em>
      </p>
      <p>
        &ldquo;Cancer.&rdquo; &ldquo;Structural engineer.&rdquo;{' '}
        &ldquo;Indeterminate cost.&rdquo; Most buyers see those three
        phrases and assume the worst. The reality is much more
        manageable — but the cost difference between a cosmetic patch
        and a structural rebuild is roughly $3,000 versus $80,000,
        so it&apos;s worth understanding which one you&apos;re
        looking at before you negotiate or walk away.
      </p>
      <p>
        Here&apos;s what concrete cancer actually is, how AS4349.1
        inspectors flag it, the severity levels, real repair costs,
        and how to translate the finding into a negotiation
        position.
      </p>

      <h2>What concrete cancer actually is</h2>
      <p>
        Reinforced concrete works because steel rebar embedded in the
        concrete handles tensile loads (pulling forces) while the
        concrete handles compression. The concrete also protects the
        steel from corrosion — fresh concrete is highly alkaline (pH
        ~12-13), which keeps a passive oxide layer on the steel that
        prevents rusting.
      </p>
      <p>
        Two things eventually compromise that protection:
      </p>
      <ul>
        <li>
          <strong>Carbonation</strong> — atmospheric CO₂ slowly
          penetrates the concrete surface over decades, reacting with
          the alkalinity and dropping the pH. Once carbonation reaches
          the depth of the rebar, the steel loses its passive
          protection and starts to rust.
        </li>
        <li>
          <strong>Chloride ingress</strong> — salt from sea spray,
          de-icing salts, or admixed contaminants penetrates the
          concrete and attacks the passive layer directly. Coastal
          properties are the high-risk category.
        </li>
      </ul>
      <p>
        Once the rebar starts corroding, the chemistry becomes
        destructive: iron oxide (rust) occupies roughly{' '}
        <strong>6 times the volume</strong> of the original steel. The
        rebar effectively swells from inside the concrete, applying
        enormous outward pressure on the surrounding material.
      </p>
      <p>
        The concrete can&apos;t absorb that expansion. It cracks. The
        cracks let more moisture, oxygen, and salts in. Corrosion
        accelerates. Cracking widens. Eventually chunks of concrete
        delaminate or fall away — exposing more rebar, which corrodes
        faster, in a self-reinforcing cycle.
      </p>
      <p>
        That&apos;s concrete cancer. The visible result — cracking,
        delamination, falling chunks — is called <strong>spalling
        </strong>. Inspectors use both terms; technically &ldquo;cancer&rdquo;
        describes the cause and &ldquo;spalling&rdquo; describes the symptom.
      </p>

      <h2>Where it shows up in Australian homes</h2>
      <p>
        Concrete cancer doesn&apos;t appear randomly — it follows
        moisture, salt, and shallow concrete cover over rebar. The
        common-location list for AU stock:
      </p>
      <ul>
        <li>
          <strong>Balcony slabs and nosings</strong> — particularly
          cantilevered balconies in 1960s-1990s apartments. The
          underside of the slab is the classic concrete-cancer
          location.
        </li>
        <li>
          <strong>Suspended slab edges and soffits</strong> — exposed
          underside concrete on multi-storey buildings.
        </li>
        <li>
          <strong>Retaining walls</strong> — particularly older
          rendered concrete retaining walls without proper drainage
          behind them.
        </li>
        <li>
          <strong>Concrete fences and walls in coastal zones</strong>{' '}
          — unpainted concrete within salt-spray distance of the
          coast.
        </li>
        <li>
          <strong>Garage slab edges and driveway concrete</strong>{' '}
          where rebar cover is shallow.
        </li>
        <li>
          <strong>Pool surrounds and pool shells</strong> — chlorinated
          water + repeated wet-dry cycles + rebar = high-risk area.
        </li>
        <li>
          <strong>Concrete window sills and lintels</strong> in
          older buildings.
        </li>
        <li>
          <strong>Underground basement walls and roofs</strong> where
          waterproofing has failed and moisture is migrating through
          the concrete.
        </li>
      </ul>

      <h2>How AS4349.1 inspectors flag concrete cancer</h2>
      <p>
        Standard{' '}
        <Link href="/resources/what-is-as4349-1">
          AS4349.1 building inspections
        </Link>{' '}
        identify concrete cancer through visual indicators:
      </p>
      <ul>
        <li>
          <strong>Rust staining bleeding through the concrete
          surface</strong> — orange-brown streaks on otherwise grey or
          painted concrete.
        </li>
        <li>
          <strong>Exposed rebar</strong> — sections where concrete
          has already fallen away, revealing rusted reinforcement
          underneath.
        </li>
        <li>
          <strong>Hollow-sounding concrete</strong> — inspector taps
          surfaces with a hammer; healthy concrete sounds solid,
          delaminated concrete sounds hollow. Indicates internal
          spalling before it&apos;s reached the surface.
        </li>
        <li>
          <strong>Surface cracking patterns</strong> — particularly
          parallel cracks following rebar lines, or cracks radiating
          from a corrosion point.
        </li>
        <li>
          <strong>Efflorescence at cracks</strong> — white calcium
          salt deposits where moisture is moving through the concrete.
        </li>
        <li>
          <strong>Surface delamination</strong> — concrete surface
          separating from the substrate, visible as a hollow patch or
          bulge.
        </li>
      </ul>
      <p>
        What AS4349.1 inspectors <em>cannot</em> do under standard
        scope:
      </p>
      <ul>
        <li>
          Confirm the extent of internal corrosion without intrusive
          investigation.
        </li>
        <li>
          Quantify the percentage of rebar affected.
        </li>
        <li>
          Test concrete chloride content, carbonation depth, or
          half-cell potential (these are specialist tests).
        </li>
        <li>
          Provide structural repair scope or cost — that&apos;s a
          structural engineer&apos;s job.
        </li>
      </ul>
      <p>
        The standard inspector note is therefore: &ldquo;Concrete
        spalling evident to [location]. Further investigation by a
        suitably qualified structural engineer recommended.&rdquo;
        That&apos;s your trigger to commission the next-tier
        assessment.
      </p>

      <h2>Severity levels: cosmetic to structural</h2>
      <p>
        Four bands cover most real-world concrete cancer findings in
        AU residential stock:
      </p>
      <ul>
        <li>
          <strong>Level 1 — Cosmetic, non-structural element.</strong>{' '}
          Spalling on a render finish, a concrete fence, a pool
          coping. Doesn&apos;t affect load-bearing capacity. Repair
          is patch + finish match.
        </li>
        <li>
          <strong>Level 2 — Localised, structural element, early
          stage.</strong> Surface rust bleed and minor spalling on a
          balcony slab edge or single retaining wall section.
          Rebar visible but not significantly section-loss-affected.
          Repair is rebar treatment + patch + protective coating.
        </li>
        <li>
          <strong>Level 3 — Advanced, structural element, single
          location.</strong> Significant concrete loss, visible rebar
          with measurable cross-section reduction. Engineering
          required to confirm load capacity. Repair involves cutting
          back to sound concrete, replacing rebar where compromised,
          new high-strength concrete patch.
        </li>
        <li>
          <strong>Level 4 — Widespread, multiple elements.</strong>{' '}
          Concrete cancer across an entire suspended slab, multiple
          balconies, or building facade. Common in pre-1980 apartment
          buildings on the coast. Repair is a major project: scaffold,
          full element rectification, often partial replacement.
        </li>
      </ul>

      <h2>What concrete cancer actually costs to fix</h2>
      <p>
        Cost depends on access difficulty, scope, and finish-matching
        requirements far more than on the chemistry. Real 2026 AU
        repair cost ranges by scenario:
      </p>
      <ul>
        <li>
          <strong>Level 1 — cosmetic spalling, easy access</strong>{' '}
          (e.g. spalling on a low retaining wall, garage slab edge):{' '}
          <strong>$1,500-$5,000</strong>. Patch with polymer-modified
          mortar, paint or render to match.
        </li>
        <li>
          <strong>Level 2 — localised structural, one balcony or
          wall section</strong>:{' '}
          <strong>$5,000-$15,000</strong>. Includes scope of works,
          rebar treatment with corrosion inhibitor or replacement
          where needed, high-strength repair mortar, anti-carbonation
          coating.
        </li>
        <li>
          <strong>Level 3 — advanced single location, scaffolded
          access</strong>:{' '}
          <strong>$15,000-$40,000</strong>. Scaffolding, more
          extensive concrete removal back to sound substrate, rebar
          replacement, structural engineer sign-off.
        </li>
        <li>
          <strong>Level 4 — widespread, multiple elements (whole
          building facade or all balconies)</strong>:{' '}
          <strong>$80,000-$400,000+</strong> for a typical
          apartment block. Usually funded through strata special
          levies — see the per-lot maths in the strata report
          findings section below.
        </li>
      </ul>
      <p>
        These ranges assume reputable contractors using current
        concrete repair products (epoxy-bonded patches, anti-
        carbonation coatings, sacrificial anodes where appropriate).
        Lowball quotes are common and almost always involve cosmetic
        patches that don&apos;t address the underlying corrosion —
        the repair re-fails within 3-5 years.
      </p>

      <h2>Apartments and strata implications</h2>
      <p>
        For apartment buyers, concrete cancer is almost always a
        common-property issue rather than a lot-specific one — the
        building structure, balcony slabs, and facade are funded by
        the owners corporation, not individual owners. The cost
        therefore arrives as a special levy.
      </p>
      <p>
        Typical per-lot exposure for concrete cancer remediation:
      </p>
      <ul>
        <li>
          <strong>Small building (10-20 lots), localised
          remediation:</strong> $3,000-$8,000 per lot.
        </li>
        <li>
          <strong>Medium building (20-40 lots), facade or balcony
          rectification:</strong> $8,000-$25,000 per lot.
        </li>
        <li>
          <strong>Large building (40-80 lots), major coastal
          remediation:</strong> $15,000-$45,000 per lot.
        </li>
      </ul>
      <p>
        Before settlement on any pre-1995 apartment, particularly
        within 1km of the coast, read the{' '}
        <Link href="/resources/strata-report-explained-australia">
          full strata records inspection
        </Link>{' '}
        meeting minutes carefully. References to &ldquo;facade
        rectification,&rdquo; &ldquo;concrete remediation,&rdquo;{' '}
        &ldquo;balcony works,&rdquo; or &ldquo;structural engineer
        engagement&rdquo; in the last 24 months of minutes are the
        warning signs that a special levy is coming.
      </p>

      <h2>The coastal premium</h2>
      <p>
        Chloride ingress from sea spray accelerates rebar corrosion
        dramatically — typically 5-10x faster than identical concrete
        inland. The exposure gradient roughly:
      </p>
      <ul>
        <li>
          <strong>0-100m from coast:</strong> Very high risk. Salt
          spray reaches exposed concrete directly. Pre-1990 stock in
          this band almost always has some level of concrete cancer.
        </li>
        <li>
          <strong>100-500m from coast:</strong> High risk. Salt
          deposition still significant. Most pre-1980 unprotected
          concrete shows cancer indicators.
        </li>
        <li>
          <strong>500m-2km from coast:</strong> Moderate risk.
          Affects exposed concrete on north-east facing elevations
          where wind carries salt inland.
        </li>
        <li>
          <strong>2km+ inland:</strong> Lower risk. Carbonation-driven
          rather than chloride-driven. Slower progression. Common
          mainly in pre-1960 concrete with shallow rebar cover.
        </li>
      </ul>
      <p>
        Coastal AU buying due diligence for any concrete-construction
        property pre-1995: always assume some concrete cancer is
        present. Budget for a structural engineer&apos;s assessment
        ($1,500-$3,500) before settlement.
      </p>

      <h2>Negotiation framework</h2>
      <p>
        Concrete cancer findings produce one of the strongest
        negotiation positions in property due diligence because the
        repair scope is engineerable and the cost is defensible. The
        framework:
      </p>
      <ul>
        <li>
          <strong>Level 1 (cosmetic):</strong> $2,000-$5,000
          negotiation ask. Quote-based.
        </li>
        <li>
          <strong>Level 2 (localised structural):</strong>{' '}
          $5,000-$15,000 ask, backed by structural engineer&apos;s
          report and contractor quote.
        </li>
        <li>
          <strong>Level 3 (advanced single location):</strong>{' '}
          $15,000-$40,000 ask, full engineer scope of works.
        </li>
        <li>
          <strong>Level 4 (widespread) — house:</strong> Walk-away
          consideration unless price reflects $80K+ remediation.
        </li>
        <li>
          <strong>Level 4 (widespread) — apartment:</strong>{' '}
          Negotiate per-lot exposure off the strata report minutes;
          alternatively, demand a contractual clause assigning the
          first $X of any concrete remediation levy to the vendor for
          24 months post-settlement.
        </li>
      </ul>
      <p>
        See{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          our negotiation framework
        </Link>{' '}
        for the wider structure. Concrete cancer is one of the
        defects where the buyer should always commission the
        specialist follow-up assessment before settling — the cost
        ($1,500-$3,500) is small relative to the negotiation leverage
        it creates.
      </p>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded reads your AS4349.1 building inspection PDF
        and extracts concrete-cancer-related findings — every
        reference to spalling, exposed rebar, rust staining, hollow
        concrete, surface delamination — and assigns them severity
        level + indicative cost range based on current 2026 AU
        repair rates.
      </p>
      <p>
        It surfaces the language inspectors use that buyers
        commonly skip past:{' '}
        &ldquo;Localised concrete spalling and surface delamination
        evident to underside of front balcony slab. Approximate area
        2m². Exposed corroded reinforcement visible. Further
        investigation by suitably qualified structural engineer
        strongly recommended prior to settlement.&rdquo;
      </p>
      <p>
        The output translates that to: &ldquo;Concrete cancer (Level
        2 — localised structural). Likely repair cost: $5,000-$15,000
        with engineer involvement. Recommended next step: commission
        structural engineer scope ($1,500-$3,500) before
        settlement.&rdquo;
      </p>
      <p>
        That&apos;s the kind of plain-English translation that takes
        a panic-inducing technical note and turns it into a
        defensible negotiation position before cooling-off ends.
      </p>
    </ArticleLayout>
  );
}
