import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('termite-damage-cost-australia');

const faqs = [
  {
    q: 'Does home insurance cover termite damage in Australia?',
    a: 'Almost never. Standard Australian home & contents policies explicitly exclude termite damage as a "preventable" condition. Some specialist policies cover treatment after first detection, but never historical damage. This is one of the biggest reasons termite findings in a pre-purchase inspection are negotiation leverage — once you own the home, the cost falls on you.',
  },
  {
    q: 'How can I tell if termite damage is active or historical?',
    a: 'Visual inspection alone often can\'t — the tunnels look similar whether termites are still inside or long gone. A pest controller uses thermal imaging, moisture meters, and acoustic detection (Termatrac) to confirm activity. Cost for a definitive Active vs Historical assessment is $250–$500 — well worth it before buying.',
  },
  {
    q: 'I found termite damage AFTER buying. Can I sue the inspector or vendor?',
    a: 'Possible but difficult. Inspectors limit liability via AS4349.1 scope (visual only, accessible areas). Vendors generally can\'t be held liable unless they actively concealed known damage. Your strongest pre-purchase protection is a thorough pest inspection BEFORE exchange + an inspection clause in the contract.',
  },
  {
    q: 'How long does termite treatment take?',
    a: 'Initial chemical treatment is usually 1 day. Termite bait system installation is 1-2 days. A full AS3660-compliant treatment + 5-year management plan takes 1-2 weeks of inspections + paperwork. Most treatments are completed before you move in if commissioned at exchange.',
  },
  {
    q: 'What\'s the best termite prevention for a new home?',
    a: 'Three layers: (1) Physical barrier per AS3660.1 (Termimesh, Kordon, HomeGuard) installed during construction. (2) Chemical soil treatment around the perimeter. (3) Annual visual inspections + 5-yearly comprehensive inspection. New homes built post-2000 should have a barrier; check your warranty paperwork for what was installed.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Termite damage cost to repair in Australia: what buyers should budget"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Typical Australian termite costs:</strong> AS3660-compliant
            treatment + 5-year management plan: <strong>$3,500–$8,000</strong>.
            Cosmetic damage repair (skirtings, architraves, door frames):
            <strong> $2,000–$8,000</strong>. Structural damage repair (joists,
            studs, wall plates): <strong>$5,000–$30,000+</strong>. Brisbane
            and Sydney Queenslanders / Federation homes cost more than
            Melbourne brick veneer because more timber is exposed. If active
            termites are found, get a specialist assessment BEFORE
            exchange — repair cost is the negotiation lever.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={['what-is-as4349-1', 'how-much-to-negotiate-after-building-inspection']}
      related_suburbs={['yarraville', 'new-farm', 'toowong', 'wynnum', 'sunshine']}
    >
      <p>
        Termites cause more property damage in Australia than fire, flood, and
        storms combined. The CSIRO estimates one in five Australian homes will
        experience termite damage in its lifetime. In Queensland and northern
        NSW, that risk is closer to one in three.
      </p>
      <p>
        If your pre-purchase building inspection finds termite evidence — or if
        you&apos;ve already bought and just discovered some — the next question
        is always the same: <strong>how much is this going to cost?</strong>
      </p>
      <p>The answer depends on five things.</p>

      <h2>Factor 1: Active vs Historical</h2>
      <p>
        Inspectors classify termite findings in two buckets:
      </p>
      <ul>
        <li><strong>Active workings:</strong> live termites observed, fresh mud tubes, audible activity (Termatrac detection), recent damage. This is the more expensive scenario because treatment must precede repair.</li>
        <li><strong>Historical damage / past workings:</strong> evidence of previous termite activity but no live colony detected. The damage is done; the question is structural impact + whether the property has a current termite management system to prevent re-entry.</li>
      </ul>
      <p>
        Most pre-1990 Australian homes have SOME historical evidence somewhere
        — it&apos;s incredibly common. What matters is (a) is it active right
        now, and (b) is the damage structural or cosmetic.
      </p>

      <h2>Factor 2: Where the damage is</h2>
      <p>Termites attack timber. The cost-of-repair scales with what timber:</p>

      <h3>Cosmetic damage ($2,000–$8,000)</h3>
      <ul>
        <li>Skirting boards, architraves, door frames</li>
        <li>Window reveals + sills (non-structural)</li>
        <li>Decorative cornices, picture rails</li>
        <li>Internal door cores (hollow-core doors compromised)</li>
      </ul>
      <p>
        These are unsightly but don&apos;t threaten the house. A carpenter
        replaces the affected elements; a painter touches up the surrounding
        finish. Half a day&apos;s work for a competent tradie.
      </p>

      <h3>Sub-structural damage ($5,000–$15,000)</h3>
      <ul>
        <li>Floor joists, bearers, sub-floor framing</li>
        <li>Stair stringers</li>
        <li>Pergola + verandah posts that aren&apos;t load-bearing on the main structure</li>
      </ul>
      <p>
        These need structural assessment — affected timber must be replaced
        with new (or sister-jointed where partial replacement is structurally
        adequate). A carpenter does the work; an engineer&apos;s sign-off is
        often required.
      </p>

      <h3>Major structural damage ($15,000–$35,000+)</h3>
      <ul>
        <li>Wall studs in load-bearing walls</li>
        <li>Wall plates (top + bottom plates of stud-frame construction)</li>
        <li>Roof rafters, ceiling joists, ridge beams</li>
        <li>Roof trusses</li>
        <li>Window + door lintels carrying significant load</li>
      </ul>
      <p>
        This is the worst-case scenario. Replacement requires temporary
        support during work, an engineer&apos;s scope, potential matching
        building permits. On a heritage property it can easily push past
        $50,000 because replacement timber must match original species +
        section size + heritage spec.
      </p>

      <h3>Whole-house structural compromise ($50,000+)</h3>
      <p>
        Extreme cases — termites have travelled the entire framing system
        undetected for years. This is rare but happens, especially in:
      </p>
      <ul>
        <li>Vacant rental properties with deferred inspections</li>
        <li>Holiday homes left vacant 9+ months/year</li>
        <li>Properties where moisture issues (leaking shower, sub-floor damp) created continuous termite-friendly conditions</li>
      </ul>
      <p>
        At this end of the scale, demolition is sometimes more economical
        than rectification. Pre-purchase inspections aim to catch these
        before exchange — your inspector should specifically note timber
        sounding tests (light tapping reveals hollow-feeling damaged timber)
        and any restricted-access areas flagged for follow-up investigation.
      </p>

      <h2>Factor 3: Treatment vs damage repair</h2>
      <p>Two separate cost lines you need to budget:</p>

      <h3>1. Termite TREATMENT — stopping the colony</h3>
      <ul>
        <li><strong>Chemical soil treatment (perimeter):</strong> $2,500–$5,500</li>
        <li><strong>Termite bait system (Sentricon, Exterra):</strong> $2,500–$4,500 installation + annual monitoring $400–$700</li>
        <li><strong>Combined treatment + 5-year AS3660 management plan:</strong> $4,000–$8,000 all-in</li>
      </ul>
      <p>
        Treatment doesn&apos;t repair damage. It stops more from happening.
        AS3660 compliance is the minimum standard your pest controller
        should be quoting against.
      </p>

      <h3>2. Damage REPAIR — fixing what termites already chewed</h3>
      <p>
        This depends entirely on what was damaged (see Factor 2). The
        carpenter and pest controller work together — pest controller
        kills the colony first, carpenter repairs once the timber is
        certified clear.
      </p>

      <h2>Factor 4: Where in Australia you are</h2>
      <p>
        Termite pressure varies dramatically by region. The CSIRO maps risk
        in classes:
      </p>
      <ul>
        <li><strong>Class A (highest):</strong> Brisbane + SE Queensland, northern NSW coast, Top End NT, parts of WA. Multi-species pressure (Coptotermes, Schedorhinotermes, Mastotermes), year-round activity, fastest-moving colonies.</li>
        <li><strong>Class B (moderate-high):</strong> Sydney inner ring, western Melbourne basalt corridor, Perth metro. Coptotermes acinaciformis is the primary species.</li>
        <li><strong>Class C (moderate):</strong> Eastern Melbourne, Tasmania north coast, Adelaide metro. Pressure exists but slower colony growth.</li>
        <li><strong>Class D (low):</strong> Alpine regions, far southern Tasmania, very arid areas.</li>
      </ul>
      <p>
        Brisbane / SE Queensland homes need ongoing termite management as a
        cost of ownership, not an optional extra. Melbourne homes can be
        more relaxed (still needs inspection, just less frequent treatment).
        Your suburb&apos;s class affects your forward 5-year capex
        forecast significantly.
      </p>

      <h2>Factor 5: Property age + construction type</h2>
      <ul>
        <li><strong>Pre-1995 homes:</strong> usually no termite management system installed at construction. Higher risk + first-time treatment cost.</li>
        <li><strong>1995–2010 homes:</strong> AS3660.1 became enforced in this era — most should have a physical barrier (Termimesh, Kordon) but the protection lasts only as long as it&apos;s undisturbed. Check whether any renovations breached the barrier.</li>
        <li><strong>Post-2010 homes:</strong> should have AS3660-compliant protection. Verify the warranty paperwork came with the property.</li>
        <li><strong>Queenslanders + Federation timber homes:</strong> highest risk by construction type. Timber stumps, bearers, joists, framing — lots of timber to attack.</li>
        <li><strong>Slab-on-ground brick veneer:</strong> lower risk because less timber is in ground contact, but termites still attack frame timbers via the wall-cavity-from-slab-edge route.</li>
      </ul>

      <h2>The buyer&apos;s playbook when termites are found</h2>
      <ol>
        <li>
          <strong>Get a specialist pest inspection</strong> (separate from your
          building inspector) by an AS3660-certified pest controller. Cost:
          $300–$500. They&apos;ll confirm active vs historical and identify
          the species.
        </li>
        <li>
          <strong>Get an engineering assessment</strong> if the inspector noted
          structural damage. $1,500–$3,000 for a residential engineer&apos;s
          report. Necessary if any load-bearing timber is affected.
        </li>
        <li>
          <strong>Get treatment quotes</strong> from 2-3 pest controllers.
          Quotes should reference AS3660 + state the 5-year management plan.
        </li>
        <li>
          <strong>Get repair quotes</strong> from 2-3 carpenters once you know
          the damage scope. Itemise: cosmetic vs sub-structural vs structural.
        </li>
        <li>
          <strong>Negotiate off contract price using documented costs.</strong>
          Treatment + repair + your time + risk discount = your negotiation
          floor. See our{' '}
          <Link href="/resources/how-much-to-negotiate-after-building-inspection">
            negotiation guide
          </Link>
          {' '}for how to structure the ask.
        </li>
      </ol>

      <h2>What if you&apos;ve already bought?</h2>
      <p>
        Three immediate actions:
      </p>
      <ul>
        <li>
          <strong>Don&apos;t panic, don&apos;t delay.</strong> Active termites
          can do significant damage in 3–6 months but won&apos;t take down a
          house overnight. You have time to assess properly.
        </li>
        <li>
          <strong>Get treatment + a 5-year management plan in place.</strong>
          Critical. Untreated active termites WILL keep eating.
        </li>
        <li>
          <strong>Get structural assessment + repair quotes.</strong> Once
          treatment is done, you can prioritise repairs by urgency — cosmetic
          can wait, structural cannot.
        </li>
      </ul>

      <h2>The cost of NOT treating</h2>
      <p>
        Untreated active termite colonies double their consumption rate every
        6–12 months as the colony grows. A &quot;minor&quot; finding ignored
        for 18 months can mean the difference between $5K repair and $35K
        repair. Don&apos;t kick this down the road.
      </p>

      <h2>What Report Decoded does with termite findings</h2>
      <p>
        When your AS4349.1 / AS4349.3 building + pest inspection mentions
        termites — past or active — we extract:
      </p>
      <ul>
        <li>What kind of evidence was found (active workings, mud tubes, past damage)</li>
        <li>Where in the property (roof void, sub-floor, internal areas)</li>
        <li>What the inspector recommended (specialist inspection, treatment, structural assessment)</li>
        <li>Estimated AU repair cost range for that defect type</li>
        <li>Recommended trade (pest controller for treatment, carpenter for repairs, engineer if structural)</li>
      </ul>
      <p>
        Then we plug it into the negotiation amount and the ready-to-send
        negotiation letter to the vendor&apos;s agent. Every claim cites the
        page in your inspector&apos;s PDF so the evidence is right there.
      </p>
      <p>
        $59 per report. No subscription. Under 2 minutes.
      </p>
    </ArticleLayout>
  );
}
