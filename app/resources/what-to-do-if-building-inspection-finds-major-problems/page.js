import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('what-to-do-if-building-inspection-finds-major-problems');

const faqs = [
  {
    q: 'Can I cancel a property purchase after a bad building inspection?',
    a: 'In most Australian states, yes — provided you\'re inside the cooling-off period AND the contract is conditional on inspection. Victoria gives 3 business days statutory cooling-off (waived at auction). NSW gives 5 business days (waived at auction). QLD gives 5 business days (residential only). SA gives 2 clear business days. WA has no statutory cooling-off but most contracts include "subject to satisfactory building inspection" clauses. If you bought at auction with no inspection clause, walking away forfeits your deposit (usually 10% of purchase price). Get a conveyancer to advise on your specific contract before exchange — by the time you have the inspection, your legal options are already set.',
  },
  {
    q: 'How many "major defects" is too many?',
    a: 'There is no fixed number — it\'s about cost-to-repair versus the contract price. A house with one major structural defect costing $80,000 to fix is in worse shape than one with twelve minor defects costing $25,000 combined. The benchmark we use: if total documented rectification cost exceeds 5% of the contract price, you have legitimate negotiation grounds. Over 10% and most buyers should walk unless they have the cash to fix everything themselves. Over 15% and you\'re buying a renovation project, not a home — price accordingly.',
  },
  {
    q: 'My inspector said "further investigation recommended" — should I be worried?',
    a: 'Yes, more than buyers usually realise. "Further investigation recommended" is the phrase inspectors use when they\'ve identified a visual indicator but the actual extent or cause is hidden behind walls, under floors, or in the roof void. These items are where the biggest unknown costs hide — a $200 inspector recommendation can lead to a $30,000 specialist finding. Always commission the follow-up before exchange if the contract allows it. Common follow-ups: structural engineer ($500–$1,500), pest specialist ($300–$600), plumber leak detection ($400–$800), damp specialist ($500–$1,500), electrician compliance check ($300–$700).',
  },
  {
    q: 'Should I get a second building inspection if the first one is bad?',
    a: 'Almost never. Two inspections from different inspectors usually surface different problems rather than confirming the first inspector\'s findings — and you end up with TWO lists of defects to deal with. Instead, commission specialist follow-ups for the specific items the first inspector flagged for "further investigation." A structural engineer report, pest specialist report, or damp specialist report each carries far more weight in negotiations than a second generalist building inspection.',
  },
  {
    q: 'How do I document a building inspection finding for the agent?',
    a: 'In writing, never by phone, with specific dollar amounts attached to specific page references in the inspector\'s PDF. Generic complaints ("the report found a lot of issues") get refused. Documented asks ("pages 18, 23, and 41 identify rising damp, electrical compliance failures, and roof flashing failures with combined rectification cost of $34,200 per attached specialist quotes — we request a $28,000 vendor adjustment or vendor-funded rectification before settlement") get taken seriously. The written paper trail also protects you if the vendor later disputes that issues were raised.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="What to do if your building inspection finds major problems (Australia, 2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Five-step framework when your inspection comes back
            ugly:</strong> (1) Don&apos;t panic and don&apos;t reply
            yet — read it once, sleep on it. (2) Triage every finding
            into Tier A (walk-away threats), Tier B (negotiation
            ammunition), Tier C (lifecycle / cosmetic). (3) Commission
            specialist follow-ups for every &ldquo;further investigation
            recommended&rdquo; item BEFORE cooling-off ends. (4) Add up
            real rectification costs — if the total exceeds 5% of
            contract, you have negotiation grounds; over 10%, consider
            walking; over 15%, you&apos;re buying a renovation project,
            not a home. (5) Document everything in writing to the
            agent with specific dollar asks and inspector page
            references. Vague complaints get refused; documented asks
            get taken seriously.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'what-is-as4349-1',
        'how-much-to-negotiate-after-building-inspection',
        'rising-damp-australia-how-much-to-fix',
        'termite-damage-cost-australia',
      ]}
      related_suburbs={['yarraville', 'brunswick', 'newtown', 'paddington', 'toowong']}
    >
      <p>
        The report just landed in your inbox. It&apos;s 47 pages long.
        Three things jumped out: &ldquo;active termite workings to
        bearer timbers,&rdquo; &ldquo;rising damp evident to four
        external walls,&rdquo; and &ldquo;electrical wiring
        non-compliant with AS/NZS 3000 — further investigation
        recommended.&rdquo;
      </p>
      <p>
        Your cooling-off period ends Friday.
      </p>
      <p>
        It&apos;s 11:48 PM. You don&apos;t know whether you&apos;ve
        just dodged a $200,000 mistake or whether the vendor will
        eat $30,000 off the price tomorrow morning. The agent
        won&apos;t answer your call until 9 AM. The inspector said
        &ldquo;all my contact details are in the report&rdquo; and
        signed off.
      </p>
      <p>
        Here&apos;s exactly what to do, in what order, to turn an
        alarming inspection report into a defensible decision —
        whether that decision is to walk, negotiate, or proceed with
        eyes open.
      </p>

      <h2>Step 1 — Don&apos;t reply tonight. Sleep on it.</h2>
      <p>
        The single biggest mistake first-home buyers make at this
        moment is firing off a panicked email to the agent. Don&apos;t.
        Whatever&apos;s in the report has been true for years already
        — one more night of you NOT replying changes nothing.
      </p>
      <p>
        What sleeping on it gives you: emotional separation from the
        document. When you re-read it in the morning, you&apos;ll
        notice the inspector&apos;s tone shifts — the phrasing on
        truly serious defects is different from the phrasing on
        lifecycle items the inspector is just noting for the record.
        Tired-at-11pm reading levels everything to maximum alarm.
        Coffee-at-8am reading sorts it back into proper tiers.
      </p>

      <h2>Step 2 — Triage every finding into three tiers</h2>
      <p>
        Open the report fresh in the morning. Use a highlighter or a
        spreadsheet. Every &ldquo;Major Defect&rdquo; and &ldquo;Minor
        Defect&rdquo; in the report goes into one of three categories:
      </p>

      <h3>Tier A — Walk-away threats</h3>
      <p>
        These are findings where the cost or risk of rectification
        outweighs the deal. Tier A items include:
      </p>
      <ul>
        <li>
          <strong>Active termite damage to structural timbers</strong>{' '}
          with no current management system. Treatment + repair can
          run $30K-$80K and the property is at ongoing risk.
        </li>
        <li>
          <strong>Structural cracking with no identified cause.</strong>{' '}
          Reactive clay subsidence, footing failure, or undermining
          can require $50K-$150K of engineering work.
        </li>
        <li>
          <strong>Roof system failure</strong> — split ridge beam,
          rotted rafters, ceiling joist removed and not reinstated.
          $20K-$60K structural work.
        </li>
        <li>
          <strong>Asbestos disturbance risk</strong> in occupied
          living areas that wasn&apos;t disclosed. Friable asbestos
          removal alone runs $20K-$80K.
        </li>
        <li>
          <strong>Cumulative defects totalling more than 15% of the
          contract price</strong> — at this point you&apos;re buying a
          renovation project, and the vendor should be pricing it as
          such.
        </li>
      </ul>

      <h3>Tier B — Negotiation ammunition</h3>
      <p>
        These are documented, quantifiable defects that justify a
        specific dollar reduction. Tier B items include:
      </p>
      <ul>
        <li>
          <Link href="/resources/rising-damp-australia-how-much-to-fix">
            Rising damp
          </Link>{' '}
          to defined sections of wall — $8K-$30K rectification.
        </li>
        <li>
          Subfloor decay, bearer rot — $5K-$20K.
        </li>
        <li>
          Roof flashing or membrane failure — $5K-$15K.
        </li>
        <li>
          Electrical safety upgrades (RCD, switchboard,
          AS/NZS 3000 non-compliance) — $3K-$10K.
        </li>
        <li>
          <Link href="/resources/termite-damage-cost-australia">
            Past termite damage with no active workings
          </Link>{' '}
          — $5K-$25K rectification + future-proofing.
        </li>
        <li>
          Plumbing — failed waterproofing in wet areas, deteriorated
          pipework. $5K-$20K.
        </li>
      </ul>

      <h3>Tier C — Lifecycle / cosmetic</h3>
      <p>
        These are defects that exist on every house of a certain age
        and don&apos;t justify negotiation on their own. Tier C
        items include:
      </p>
      <ul>
        <li>End-of-life hot water systems, old air conditioners.</li>
        <li>Faded paintwork, worn carpet, minor wall cracking.</li>
        <li>Aged but functional appliances.</li>
        <li>Cosmetic timber wear, minor architrave damage, scuffed skirting boards.</li>
      </ul>
      <p>
        Tier C items are best used as &ldquo;throwaway gives&rdquo; in
        the negotiation — you list them, the vendor refuses them,
        you concede them in exchange for harder concessions on Tier B.
      </p>

      <h2>Step 3 — Commission specialist follow-ups BEFORE cooling-off ends</h2>
      <p>
        Look back through the report for any phrase that says
        &ldquo;further investigation by a [specialist] recommended.&rdquo;
        These are where the biggest unknown costs hide.
      </p>
      <p>
        Standard AS4349.1 inspection is visual only — the inspector
        can&apos;t cut walls, lift floors, or test electrical
        components beyond visible safety items. When they flag
        &ldquo;further investigation,&rdquo; they&apos;re pointing at a
        red flag they can see but can&apos;t quantify.
      </p>
      <p>
        Common specialist follow-ups + 2026 AU rates:
      </p>
      <ul>
        <li><strong>Structural engineer report:</strong> $500-$1,500. Essential for any cracking, movement, or footing concern.</li>
        <li><strong>Pest specialist (separate from generalist inspector):</strong> $300-$600. Definitive Active vs Historical termite assessment with Termatrac thermal imaging.</li>
        <li><strong>Plumber leak detection:</strong> $400-$800. Identifies hidden plumbing leaks before you spend $30K on a wrong-diagnosis DPC injection.</li>
        <li><strong>Damp specialist report:</strong> $500-$1,500. Pinpoints actual cause of wall moisture (rising damp vs bridging vs plumbing vs subfloor).</li>
        <li><strong>Electrician compliance check:</strong> $300-$700. Tests switchboard, RCDs, smoke alarms, earth bonding against AS/NZS 3000.</li>
        <li><strong>Asbestos sampling + lab analysis:</strong> $250-$500 per sample. Definitive identification before disturbance.</li>
      </ul>
      <p>
        Total specialist follow-up budget for a complex AS4349.1
        result: <strong>$1,500-$4,000</strong>. This is the best money
        you&apos;ll spend in the entire transaction. A $400 plumber
        leak detection has saved buyers from $30,000 unnecessary DPC
        injection jobs more times than the AU industry will admit.
      </p>
      <p>
        Crucially: <strong>all of these must be commissioned and
        completed before your cooling-off period ends</strong>. After
        cooling-off, the legal position resets to caveat emptor — what
        you don&apos;t know is on you, not the vendor.
      </p>

      <h2>Step 4 — Cost it. Then make the proceed / negotiate / walk
        call.</h2>
      <p>
        Once you have the specialist reports back, add up the
        documented rectification costs. Compare to contract price.
      </p>
      <p>
        The decision framework:
      </p>
      <ul>
        <li>
          <strong>&lt; 3% of contract price:</strong> Proceed without
          negotiating. Most established homes carry this level of
          deferred maintenance — you&apos;re not getting a better deal
          on a similar property and the vendor will refuse the
          adjustment.
        </li>
        <li>
          <strong>3-5% of contract price:</strong> Proceed, but
          negotiate at the midpoint. Vendors expect minor adjustments
          at this level and budget for them.
        </li>
        <li>
          <strong>5-10% of contract price:</strong> Negotiate hard,
          document everything. This is the textbook
          inspection-finding-to-price-reduction conversion. Buyers
          regularly extract this level of price adjustment with proper
          documentation.
        </li>
        <li>
          <strong>10-15% of contract price:</strong> Consider walking
          unless you have the cash to fix everything and the renovation
          appetite. At this level, the property is meaningfully
          mis-priced relative to its condition.
        </li>
        <li>
          <strong>&gt; 15% of contract price:</strong> Walk. The
          property is being sold as if it&apos;s in better condition
          than it actually is. Cooling-off exists for exactly this
          scenario.
        </li>
      </ul>

      <h2>Step 5 — Document everything to the agent in writing</h2>
      <p>
        Once you&apos;ve made the call, communicate it through the
        agent in writing — never on the phone. Two reasons:
      </p>
      <ol>
        <li>
          <strong>Specificity is what gets results.</strong> Generic
          phone complaints (&ldquo;there are issues with the place&rdquo;)
          are easy to dismiss. Documented asks with specific page
          references and dollar amounts are taken seriously.
        </li>
        <li>
          <strong>You create a paper trail.</strong> If the vendor later
          claims they didn&apos;t know about an issue, your written
          inspection-finding-with-quote email is your protection.
        </li>
      </ol>
      <p>
        Example wording for the agent email:
      </p>
      <blockquote style={{
        borderLeft: '3px solid var(--amber)',
        paddingLeft: 16,
        margin: '20px 0',
        fontStyle: 'italic',
        color: 'var(--muted)'
      }}>
        Hi [agent name], we&apos;ve received the AS4349.1 pre-purchase
        inspection and commissioned specialist follow-ups on items the
        inspector flagged for further investigation. Combined documented
        rectification: $34,200 (specialist quotes attached). This is
        approximately 4.1% of the contract price.
        <br /><br />
        We&apos;re requesting a $28,000 vendor adjustment to the
        contract price, OR vendor-funded rectification of items 1
        (rising damp DPC injection per attached quote), 3 (electrical
        compliance), and 5 (subfloor pest treatment) prior to
        settlement. Happy to discuss timing.
        <br /><br />
        Please respond by [48 hours before cooling-off ends] so we have
        time to confirm with our conveyancer.
      </blockquote>
      <p>
        Specific. Quantified. Cited. Time-bounded. This is what the
        vendor&apos;s side takes seriously.
      </p>

      <h2>The shortcut: get the report decoded for you</h2>
      <p>
        Doing the above manually takes most buyers 4-6 hours. It
        requires reading a 47-page technical document, knowing which
        defects matter, knowing what 2026 AU repair rates actually are,
        and translating findings into defensible negotiation language.
      </p>
      <p>
        That&apos;s exactly what Report Decoded was built to do. Upload
        your AS4349.1 PDF. Two minutes later you get the tiered defect
        breakdown, repair cost estimates, the right specialist trade
        for each &ldquo;further investigation&rdquo; item, and a
        drafted negotiation letter you can edit and send. $59 per
        report. No subscription. Full refund if the analysis can&apos;t
        anchor every claim to a specific page of the inspector&apos;s
        PDF.
      </p>
      <p>
        The point isn&apos;t the tool — it&apos;s that you don&apos;t
        get a do-over on this decision. Whatever happens between now
        and Friday, make sure the decision is made on documented numbers,
        not 11pm panic.
      </p>
    </ArticleLayout>
  );
}
