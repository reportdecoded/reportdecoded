import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('asbestos-australian-homes-buyer-guide');

const faqs = [
  {
    q: 'Is it illegal to buy a house with asbestos in Australia?',
    a: 'No. Asbestos in good condition is legal in Australian residential properties and very common — about 1 in 3 homes built before 1990 contain it somewhere. The law only kicks in when you disturb it (renovating, drilling, sanding, removing). At that point you need licensed removal under state OHS regulations.',
  },
  {
    q: 'How much does asbestos lab testing cost in Australia?',
    a: 'A single-sample friction test (sent to a NATA-accredited lab) is $80–$180. A full hazardous-materials survey of a residential property — where a specialist walks through and samples 5–15 suspect locations — is $700–$1,400 depending on property size. A pre-purchase inspection won\'t do this by default; ask explicitly if you want it.',
  },
  {
    q: 'Will my home insurance cover asbestos removal?',
    a: 'Generally no for routine removal. Most policies exclude asbestos as a "known condition" once present. Some policies will cover removal if it\'s damaged by a covered event (storm tears off asbestos eaves, for example). Read your PDS carefully or ask your broker. Plan to fund removal yourself.',
  },
  {
    q: 'Should I avoid buying any house with asbestos?',
    a: 'No — that would rule out most pre-1990 Australian housing stock, which includes a huge chunk of inner-city character homes. The pragmatic approach: (1) accept asbestos is likely present, (2) budget $5K–$25K for removal during any major renovation, (3) leave undisturbed asbestos in good condition alone (it\'s safe), (4) get a hazardous-materials survey if you\'re planning significant works in the first 5 years.',
  },
  {
    q: 'Where is asbestos most commonly found in Australian homes?',
    a: 'Eaves and soffit linings (the boards under your roof overhang), fence sheeting (Super Six corrugated), garage walls, kitchen and bathroom splashbacks, vinyl floor tiles (and the black mastic underneath), behind ceramic tiles, in old electrical meter boards, and as backing on vinyl flooring or sheet linoleum. Less commonly: pipe lagging, hot water service insulation, textured "popcorn" ceilings.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Asbestos in Australian homes: what building inspections catch and what they miss"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            About <strong>1 in 3 Australian homes built before 1990</strong>{' '}
            contain asbestos somewhere. Your AS4349.1 building inspector will
            note visual indicators — &quot;suspected asbestos cement sheeting in
            eaves&quot; — but cannot confirm asbestos without lab testing. A
            single sample is $80–$180; a full hazardous-materials survey is
            $700–$1,400. <strong>Undisturbed asbestos in good condition is
            safe and legal to live with.</strong> The cost concern is removal
            during any future renovation — budget $5K–$25K for a typical
            residential job. Don&apos;t panic, do plan.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={['what-is-as4349-1', 'termite-damage-cost-australia', 'how-much-to-negotiate-after-building-inspection']}
      related_suburbs={['yarraville', 'brunswick', 'newtown', 'marrickville', 'preston']}
    >
      <p>
        If you&apos;re buying any Australian house built before 1990, the
        building inspection will probably mention asbestos. Most buyers panic.
        Most panic is unwarranted. Here&apos;s what asbestos in a pre-purchase
        report actually means, what your inspector can and can&apos;t tell you,
        and what to budget.
      </p>

      <h2>The base rate: it&apos;s everywhere in pre-1990 housing</h2>
      <p>
        Australia was one of the world&apos;s biggest asbestos consumers per
        capita until the late 1980s. James Hardie&apos;s Camellia and
        Newstead-area factories pumped out asbestos cement sheeting,
        corrugated roof + fence panels, and pipe lagging for forty years.
        Most of it went into housing.
      </p>
      <p>By era:</p>
      <ul>
        <li><strong>Pre-1980 houses:</strong> assume asbestos is somewhere unless the property has been comprehensively renovated with documented removal.</li>
        <li><strong>1980–1990:</strong> partial transition period. Builders were starting to switch to fibre-cement (no asbestos), but stock crossover meant houses up to about 1990 can still contain asbestos in some elements.</li>
        <li><strong>1990–1996:</strong> diminishing but possible. Friable products (lagging, low-density insulation) banned 1989; bonded asbestos (cement sheet) phased out by mid-1990s.</li>
        <li><strong>Post-1996:</strong> banned completely in Australia. Newer homes are asbestos-free.</li>
      </ul>

      <h2>Where asbestos actually hides</h2>
      <p>
        Asbestos in residential housing is almost always &quot;bonded&quot;
        (mixed with cement) — meaning it&apos;s only a hazard when disturbed.
        Common locations:
      </p>

      <h3>Eaves and soffit linings</h3>
      <p>
        The boards under your roof overhang. By far the most common asbestos
        location in pre-1990 Australian houses. Standard 6mm thickness, often
        painted. Identifiable by small dimples on the surface and a fibrous
        edge when broken.
      </p>

      <h3>Fence sheeting</h3>
      <p>
        &quot;Super Six&quot; corrugated asbestos cement was the dominant
        backyard fence material from the 1950s to early 1980s. If your
        property has a grey corrugated fence or shed wall and it&apos;s
        pre-1990 — assume asbestos until tested.
      </p>

      <h3>Wet area splashbacks</h3>
      <p>
        Kitchen, bathroom, laundry. Asbestos cement sheets behind ceramic
        tiles or as exposed splashbacks were standard. A renovation that
        removes the tile work disturbs the asbestos beneath. This is the
        single most common reason buyers do unplanned removal.
      </p>

      <h3>Vinyl flooring + black mastic</h3>
      <p>
        Pre-1980 vinyl floor tiles often contained asbestos AND were laid in
        an asbestos-containing black mastic adhesive. Both are hazardous if
        sanded, scraped, or removed without proper containment.
      </p>

      <h3>Less common but worth knowing</h3>
      <ul>
        <li><strong>Electrical meter boards:</strong> pre-1985 backing panels often asbestos. Electrician compliance work usually includes replacement.</li>
        <li><strong>Hot water service insulation:</strong> very old tanks may have asbestos lagging.</li>
        <li><strong>Textured &quot;popcorn&quot; ceilings:</strong> rare in Australia but seen in some 1960s–70s homes.</li>
        <li><strong>Old pipe lagging:</strong> wrapped around hot water pipes in subfloor or roof voids.</li>
      </ul>

      <h2>What AS4349.1 inspectors can and can&apos;t tell you</h2>
      <p>
        Standard pre-purchase inspectors are NOT licensed asbestos assessors.
        They flag <em>visual indicators</em> — &quot;suspected asbestos
        cement sheeting in eaves&quot; — but cannot confirm asbestos without
        lab testing. The standard limitations in your AS4349.1 report
        explicitly state this.
      </p>
      <p>What they WILL include:</p>
      <ul>
        <li>Note suspected asbestos-containing materials they can see (typically eaves, fences, sheds)</li>
        <li>Flag if any suspected material is damaged, weathered, or deteriorating</li>
        <li>Recommend further investigation by a licensed assessor</li>
      </ul>
      <p>What they WON&apos;T do:</p>
      <ul>
        <li>Take samples</li>
        <li>Confirm what&apos;s asbestos vs fibre-cement (modern asbestos-free)</li>
        <li>Inspect inside walls, ceilings, or behind tiles</li>
        <li>Check for vinyl flooring asbestos</li>
        <li>Give you a remediation cost</li>
      </ul>

      <h2>When to get a hazardous-materials survey (and when not to)</h2>
      <p>A separate <strong>hazardous-materials survey</strong> by a NATA-accredited assessor is worth the $700–$1,400 if any of:</p>
      <ul>
        <li>You&apos;re planning <strong>significant renovations</strong> in the first 5 years (kitchen, bathroom, extension, knock-down rebuild)</li>
        <li>The property has obviously deteriorated asbestos (cracked / friable eaves, broken fence panels)</li>
        <li>You have <strong>children or asthma sufferers</strong> moving in and want certainty</li>
        <li>The vendor is dropping the price specifically because of asbestos concerns</li>
      </ul>
      <p>For most buyers planning to live in the property as-is, a hazardous-materials survey isn&apos;t needed. Assume asbestos is present, budget for it during any future renovation, and leave undisturbed material alone.</p>

      <h2>Removal costs (2025 Australian rates)</h2>
      <p>Licensed asbestos removal is regulated under state Work Health &amp; Safety acts. DIY removal of more than 10m² of bonded asbestos is illegal in most states. Realistic costs:</p>
      <ul>
        <li><strong>Eaves replacement (whole house):</strong> $4,000–$9,000 depending on house size + access</li>
        <li><strong>Super Six fence replacement (per linear metre):</strong> $80–$140</li>
        <li><strong>Kitchen splashback removal + new substrate:</strong> $1,800–$4,500</li>
        <li><strong>Bathroom asbestos cement walls removal + replacement:</strong> $3,500–$8,000</li>
        <li><strong>Vinyl flooring + mastic removal (per room):</strong> $1,500–$3,500</li>
        <li><strong>Roof sheeting replacement (small shed/garage):</strong> $4,000–$12,000</li>
        <li><strong>Whole-house comprehensive removal (rare):</strong> $25,000–$60,000+</li>
      </ul>
      <p>All prices include the licensed remover, waste transport, and disposal at a licensed asbestos waste facility. Cheaper quotes typically mean illegal disposal — avoid.</p>

      <h2>The buyer&apos;s pragmatic playbook</h2>
      <ol>
        <li>
          <strong>Don&apos;t walk away just because the report mentions asbestos.</strong>
          That eliminates 30%+ of Australian housing. Asbestos in good
          condition is safe and legal.
        </li>
        <li>
          <strong>If you&apos;re planning renovations in the first 5 years,</strong>
          commission a hazardous-materials survey BEFORE exchange. Use the
          findings as negotiation leverage if there&apos;s significant material
          present.
        </li>
        <li>
          <strong>Build a 5-year capex line</strong> for likely asbestos
          encounters during routine maintenance: $5K–$15K for a typical
          pre-1990 weatherboard or brick veneer.
        </li>
        <li>
          <strong>Use licensed removers — never DIY beyond 10m².</strong>{' '}
          The risk and the liability aren&apos;t worth saving $1,500.
        </li>
        <li>
          <strong>Document any removal work done.</strong> Keeps the
          property&apos;s asbestos profile clean for the next buyer + insurer.
        </li>
      </ol>

      <h2>What Report Decoded surfaces</h2>
      <p>
        When your AS4349.1 inspection report mentions asbestos, Report Decoded
        extracts:
      </p>
      <ul>
        <li>Where in the property asbestos is suspected (eaves, fences, splashbacks, etc.)</li>
        <li>The inspector&apos;s assessment of condition (intact / weathered / damaged)</li>
        <li>Recommended next steps (lab testing, hazardous-materials survey, immediate removal)</li>
        <li>Estimated AU removal cost range for that defect type</li>
        <li>Whether the finding is a negotiation lever or just a maintenance budget item</li>
      </ul>
      <p>
        Every claim is cited to the page in your inspector&apos;s PDF, so
        you can verify and use the analysis directly in your negotiation
        with the vendor&apos;s agent.{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          Our negotiation guide
        </Link>
        {' '}walks through how to translate findings like this into a dollar
        ask off the contract price.
      </p>

      <h2>One myth worth busting</h2>
      <p>
        &quot;The presence of asbestos drops a property&apos;s value
        significantly.&quot; In practice — for properties where the asbestos
        is intact and undisturbed — the discount is minimal. Vendors and
        agents in pre-1990 markets (inner Melbourne, inner Sydney, all of
        Brisbane) price the typical asbestos load into the asking price
        already. What DOES drop value: visibly damaged asbestos, large
        quantities of friable material, or a property with NO disclosure +
        a buyer who discovers it late.
      </p>
      <p>
        Don&apos;t over-negotiate on asbestos unless the report identifies
        damaged or friable material, OR you&apos;re going to disturb it via
        renovation soon. For undisturbed, intact bonded asbestos: factor
        in a small reno-capex line and move on.
      </p>
    </ArticleLayout>
  );
}
