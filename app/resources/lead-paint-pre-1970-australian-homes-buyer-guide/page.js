import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('lead-paint-pre-1970-australian-homes-buyer-guide');

const faqs = [
  {
    q: 'When was lead paint banned in Australia?',
    a: 'Lead paint hasn\'t been fully banned — but the maximum permitted lead content was reduced progressively. Domestic paints were limited to 1% lead by weight in 1965, reduced to 0.25% in 1992, and 0.1% (1,000 ppm) in 1997. Anything painted before 1965 likely contains very high lead content (some pre-WWII paints were 50%+ lead by weight). Paint from 1965-1992 is moderate-risk. Post-1992 paint is generally safe unless industrial-grade paint was used domestically. The practical rule: any AU home built before 1970 should be assumed to have lead paint somewhere until proven otherwise.',
  },
  {
    q: 'Does my building inspector test for lead paint?',
    a: 'No. AS4349.1 is a visual-only inspection — inspectors can flag suspicious paint (chalky, peeling, alligator-cracked, distinctive thick layers from era-appropriate painting) but they can\'t confirm lead content without lab testing. Some inspectors offer optional lead paint screening as a separate service using XRF (X-ray fluorescence) handheld devices — $250-$600 per inspection. Definitive confirmation requires sending paint chips to a lab (NATA-accredited laboratory) — $80-$150 per sample, results in 1-2 weeks.',
  },
  {
    q: 'Can I just paint over lead paint to make it safe?',
    a: 'Yes, if you do it correctly — and most cosmetic paint failures are NOT caused by the original lead layer. Encapsulation (painting over with a specialist encapsulant paint that bonds and seals the lead layer) is the standard remediation for intact lead paint. Cost: $20-$40/sqm for materials plus labour. Total room-by-room cost: $1,500-$5,000 depending on size. Critical caveat: encapsulation only works if the underlying lead paint is INTACT — i.e., not flaking, peeling, or chalking. Lead paint that\'s already failing must be carefully stripped (by a licensed remover) before encapsulation, which is significantly more expensive.',
  },
  {
    q: 'Is lead paint a problem for adults or just kids?',
    a: 'Primarily kids and pregnant women, but adults aren\'t exempt. Lead exposure causes neurological damage that\'s most severe in developing brains — children under 6 are most at risk because they absorb lead at 4-5x the adult rate AND their nervous systems are still developing. For adults, chronic exposure causes hypertension, kidney damage, and cognitive decline. The exposure pathway that matters in homes isn\'t the intact paint on a wall — it\'s the dust generated when the paint deteriorates or is disturbed during renovation. Single-occupancy adults in a property with intact lead paint are at low day-to-day risk. The same property becomes high-risk the moment renovation starts or kids/pregnant women move in.',
  },
  {
    q: 'I want to renovate a pre-1970 home. What\'s my actual obligation around lead paint?',
    a: 'In most Australian jurisdictions, lead paint disturbance during renovation is regulated under state WHS (Work Health and Safety) legislation. If you employ a licensed tradesperson, THEY have an obligation to test for and manage lead-containing materials. As a DIY renovator, your obligations are softer — but the health risk is the same. Best practice: get an XRF screening done before any sanding, scraping, or wall removal in a pre-1970 home. If lead is confirmed, either encapsulate (cheaper) or have a licensed remover strip it before your renovation work begins. Sanding lead paint with a domestic orbital sander generates lead dust that contaminates the entire property for weeks.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Lead paint in pre-1970 Australian homes: what building inspections catch and what they miss"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>About 70% of Australian homes built before 1970
            contain lead paint somewhere.</strong> Paint pre-1965 can
            be 50%+ lead by weight; 1965-1992 paint is moderate; post-
            1997 paint is generally safe. Your AS4349.1 building
            inspection can flag suspicious paint but can&apos;t
            confirm lead content — testing costs <strong>$250-$600
            for XRF screening</strong> or <strong>$80-$150 per
            sample</strong> for lab analysis. Health risk is mostly to
            kids under 6 and pregnant women, and the exposure pathway
            that matters is dust from deteriorating or disturbed paint
            — not intact wall surfaces. If you&apos;re buying a pre-
            1970 home and not renovating, intact lead paint is
            manageable. The moment you renovate, the risk and cost
            profile changes dramatically.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'asbestos-australian-homes-buyer-guide',
        'what-is-as4349-1',
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={[
        'yarraville',
        'brunswick',
        'paddington',
        'newtown',
        'toowong',
      ]}
    >
      <p>
        Walk into any Australian house built before 1970 and there&apos;s
        roughly a <strong>70% chance lead paint is somewhere on the
        property</strong>. Behind a layer of more recent paint on a
        skirting board. Under the eaves where original paint was never
        repainted. On the inside of original window frames. On a
        garden shed door that hasn&apos;t been touched in 50 years.
      </p>
      <p>
        Lead paint isn&apos;t the boogeyman it&apos;s sometimes made
        out to be. In an intact, undisturbed state it&apos;s
        essentially inert — it sits on a wall, you can&apos;t absorb
        it through your skin, and you can&apos;t inhale it. The risk
        comes from <strong>dust</strong> — generated when the paint
        deteriorates (chalking, flaking, peeling) or is mechanically
        disturbed (sanding, scraping, drilling, wall demolition).
      </p>
      <p>
        Most Australian buyers of pre-1970 stock have no idea whether
        their property contains lead paint. The building inspector
        usually doesn&apos;t test for it (AS4349.1 is visual-only).
        The vendor doesn&apos;t disclose it (because they often
        don&apos;t know). And the buyer renovates a few years later
        without ever finding out — generating significant lead dust
        contamination in the process.
      </p>
      <p>
        Here&apos;s what the actual risk is, when to test, what
        testing costs, and what to do when lead is confirmed.
      </p>

      <h2>How lead paint regulation changed in Australia</h2>
      <p>
        Lead paint hasn&apos;t been outright banned in Australia. The
        maximum permitted lead content in domestic paint was reduced
        progressively over four decades:
      </p>
      <ul>
        <li>
          <strong>Pre-1965:</strong> No domestic limit. Many era-
          appropriate paints contained 30-50%+ lead by weight. This
          is the highest-risk paint era.
        </li>
        <li>
          <strong>1965-1992:</strong> Maximum 1% lead by weight in
          domestic paint. Significantly safer than pre-1965 but still
          well above modern levels. Moderate risk.
        </li>
        <li>
          <strong>1992-1997:</strong> Maximum 0.25% lead by weight.
          Lower risk but still exists.
        </li>
        <li>
          <strong>Post-1997:</strong> Maximum 0.1% (1,000 ppm) lead
          content. Generally considered safe. This aligns with US EPA
          and EU lead-safe paint standards.
        </li>
      </ul>
      <p>
        Practical implication: any layer of paint applied before 1997
        could legally contain lead, but paint applied before 1965 is
        where the high-lead-content stock lives. Pre-1965 Australian
        housing — Federation, Edwardian, interwar, early postwar —
        should be assumed to have meaningful lead paint until tested
        otherwise.
      </p>

      <h2>Where lead paint typically hides in AU homes</h2>
      <p>
        The places original lead paint most commonly survives in
        pre-1970 Australian stock:
      </p>
      <ul>
        <li>
          <strong>Window frames and sashes</strong> — particularly
          inside the sash channel where it&apos;s rubbed against by
          the moving sash, generating fine dust.
        </li>
        <li>
          <strong>Door frames and door edges</strong> — same
          mechanical-wear principle.
        </li>
        <li>
          <strong>Skirting boards and architraves</strong> — the
          original lead paint is usually buried under multiple
          repaint layers but exposed at any chip or scrape.
        </li>
        <li>
          <strong>Eaves linings and external timber</strong> — often
          never repainted from original. Externally weathered paint
          chalks and washes lead into the soil below — affecting
          garden soil safety.
        </li>
        <li>
          <strong>Inside cupboards, pantries, wardrobes</strong> —
          interior surfaces that were painted once and never touched
          again often retain their original lead layer fully intact
          underneath any subsequent repaints.
        </li>
        <li>
          <strong>Verandah floors and posts</strong> — heritage
          colours containing lead were standard for Federation and
          Edwardian verandahs.
        </li>
        <li>
          <strong>Garden sheds, garages, outbuildings</strong> —
          often missed entirely during repainting cycles.
        </li>
        <li>
          <strong>Original metal items</strong> — wrought-iron lace,
          original gates, balcony railings, downpipes. Lead-based
          anti-rust primers were standard pre-1965.
        </li>
      </ul>

      <h2>How AS4349.1 inspectors handle lead paint</h2>
      <p>
        Standard{' '}
        <Link href="/resources/what-is-as4349-1">
          AS4349.1 building inspections
        </Link>{' '}
        are visual-only. Inspectors will note:
      </p>
      <ul>
        <li>The property&apos;s age (pre-1970 = lead-paint-suspect).</li>
        <li>
          Visible paint failure modes that suggest deteriorating lead
          paint: alligator cracking (distinctive square pattern), thick
          chalky surfaces, flaking adhesion failure, paint that
          appears to have been painted over many times.
        </li>
        <li>
          A note recommending lead paint testing if the property is
          pre-1970 and the buyer plans to renovate.
        </li>
      </ul>
      <p>
        What inspectors typically <em>cannot</em> do under standard
        AS4349.1 scope:
      </p>
      <ul>
        <li>Confirm lead content without lab testing.</li>
        <li>
          Quantify the extent of lead contamination across the
          property.
        </li>
        <li>
          Recommend specific remediation approaches (that&apos;s a
          licensed lead remediation specialist&apos;s scope).
        </li>
      </ul>
      <p>
        Some inspectors offer optional XRF screening as an additional
        service — $250-$600 on top of the standard inspection. This
        uses a handheld X-ray fluorescence device to detect lead
        through multiple paint layers, with results on the spot. Most
        buyers in pre-1970 stock with renovation plans benefit from
        commissioning this.
      </p>

      <h2>When you actually need to test for lead</h2>
      <p>
        Not every pre-1970 property needs a lead paint assessment.
        The decision framework:
      </p>
      <ul>
        <li>
          <strong>Buying and not renovating, no kids under 6, no
          pregnancy planned, intact paint:</strong> Low priority.
          Skip testing. Just don&apos;t sand, scrape, or drill
          painted surfaces without professional advice.
        </li>
        <li>
          <strong>Buying with kids under 6 or pregnancy:</strong>{' '}
          Test. XRF screening on accessible painted surfaces +
          dust wipes on horizontal surfaces near where kids play.
          Total cost ~$400-$800.
        </li>
        <li>
          <strong>Buying with renovation plans:</strong> Test BEFORE
          starting any work. Identify which surfaces contain lead and
          remediate or remove before sanding/scraping anything.
          Cost: $250-$800 for screening; $1,500-$8,000 if remediation
          required.
        </li>
        <li>
          <strong>Visible paint failure on a pre-1970 property:</strong>{' '}
          Test the failing surfaces. Failed paint produces lead dust
          regardless of whether you&apos;re actively renovating.
        </li>
        <li>
          <strong>Suspected soil contamination (gardens against
          external timber painted before 1965):</strong> Soil
          testing for vegetable gardens. Cost: $200-$400 for a soil
          analysis at NATA-accredited lab. Critical if you plan to
          grow edibles.
        </li>
      </ul>

      <h2>What testing actually costs</h2>
      <p>
        Three testing methods, three price points:
      </p>
      <ul>
        <li>
          <strong>Visual screening</strong> — included in standard
          AS4349.1 inspection. Identifies suspect surfaces but
          can&apos;t confirm.
        </li>
        <li>
          <strong>XRF (handheld) screening</strong> — $250-$600 for
          a property-wide screen. Results on the spot. Detects lead
          through multiple paint layers. Most cost-effective for
          comprehensive screening.
        </li>
        <li>
          <strong>Lab analysis (paint chip samples)</strong> —
          $80-$150 per sample, NATA-accredited laboratory. Results in
          1-2 weeks. Definitive quantification of lead content.
          Required for legal proceedings or if you&apos;re challenging
          a vendor disclosure.
        </li>
        <li>
          <strong>Dust wipe analysis</strong> — $150-$300 per
          location. Measures lead loading on surfaces (windowsills,
          floors). Useful for confirming whether contamination has
          already occurred from deteriorating paint.
        </li>
        <li>
          <strong>Soil testing</strong> — $200-$400 per location.
          NATA lab. Necessary for vegetable garden plans on pre-1965
          properties.
        </li>
      </ul>

      <h2>Remediation options and costs</h2>
      <p>
        If lead is confirmed, four general remediation approaches in
        order of cost:
      </p>
      <ul>
        <li>
          <strong>Leave it intact + monitor</strong> — $0 ongoing if
          paint is intact and not in a high-friction area. Annual
          visual inspection. Acceptable when no renovation planned
          and no kids/pregnancy in the household.
        </li>
        <li>
          <strong>Encapsulation</strong> — specialist encapsulant
          paint applied over intact lead paint. Bonds and seals the
          lead layer. $20-$40/sqm materials + labour. Total room-by-
          room cost: $1,500-$5,000. Only works on intact paint;
          failing paint must be removed first.
        </li>
        <li>
          <strong>Enclosure</strong> — covering the lead-painted
          surface with new cladding (gyprock, panel cladding, etc).
          $80-$200/sqm. Higher cost but separates occupants completely
          from the lead surface.
        </li>
        <li>
          <strong>Removal (licensed remediation)</strong> — chemical
          stripping or careful mechanical removal by a licensed lead
          remediation contractor. $100-$300/sqm depending on
          substrate. Whole-property removal: $20,000-$60,000+. The
          most thorough option, required if paint is already failing
          or if renovation will disturb it.
        </li>
      </ul>
      <p>
        Whole-property remediation is rare — most owners selectively
        remediate the surfaces that pose actual exposure risk
        (window sashes, door edges, kids&apos; rooms) and leave low-
        contact areas (eaves, garden shed) intact.
      </p>

      <h2>What this means for negotiation</h2>
      <p>
        Lead paint findings in a pre-1970 property are rarely a
        deal-breaker but can be a meaningful negotiation lever. The
        framework:
      </p>
      <ul>
        <li>
          <strong>Confirmed lead + intact paint:</strong> $2,000-
          $5,000 negotiation ask. Reflects cost of encapsulation
          across high-contact surfaces.
        </li>
        <li>
          <strong>Confirmed lead + visible deterioration:</strong>{' '}
          $5,000-$15,000 negotiation ask. Reflects cost of
          remediating failed paint + encapsulating the rest.
        </li>
        <li>
          <strong>Confirmed lead + renovation plans:</strong> Cost the
          required remediation as part of your total renovation budget
          and negotiate accordingly. Use a licensed lead remediation
          quote rather than rough estimates.
        </li>
      </ul>
      <p>
        Vendors of pre-1970 stock generally expect lead paint to come
        up in due diligence and aren&apos;t surprised by reasonable
        negotiation asks. Documented test results + a written quote
        from a licensed remediator are the leverage that gets these
        adjustments accepted. Use{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          our negotiation framework
        </Link>{' '}
        to structure the ask.
      </p>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded reads your AS4349.1 building inspection and
        extracts findings — including any &ldquo;suspect lead paint,
        further testing recommended&rdquo; notes — and assigns them
        rectification cost ranges based on current 2026 AU rates.
        It won&apos;t test for lead (that&apos;s a specialist scope)
        but it will surface every reference to suspect lead paint in
        the inspector&apos;s text, flag the typical remediation cost
        bracket, and recommend the right next-step trade
        (licensed lead remediation contractor).
      </p>
      <p>
        For pre-1970 stock specifically, the typical Report Decoded
        output for a property with lead paint indicators reads
        something like: &ldquo;Inspector noted thick chalky paint
        surfaces to original window frames consistent with pre-1965
        lead paint. Recommend XRF screening before any renovation
        ($250-$600). If confirmed: encapsulation $2,000-$5,000 or
        full remediation $20,000-$60,000+ depending on extent.&rdquo;
      </p>
      <p>
        That&apos;s the kind of plain-English translation that turns
        a vague &ldquo;further testing recommended&rdquo; inspector
        note into a defensible dollar amount for negotiation.
      </p>
    </ArticleLayout>
  );
}
