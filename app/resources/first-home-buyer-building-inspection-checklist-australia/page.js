import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('first-home-buyer-building-inspection-checklist-australia');

const faqs = [
  {
    q: 'Do I really need a building inspection as a first home buyer?',
    a: 'Yes — it is the single cheapest insurance you will ever buy. A pre-purchase building and pest inspection costs roughly $400–$700 and routinely uncovers defects worth tens of thousands: rising damp, concrete cancer, termite damage, failed waterproofing, structural cracking. For a first home buyer stretching to afford the deposit, an unexpected $30,000 repair after settlement can be catastrophic. The inspection either gives you the confidence to proceed, the evidence to negotiate the price down, or the reason to walk away before you are locked in. Skipping it to save a few hundred dollars is the most expensive mistake first home buyers make.',
  },
  {
    q: 'What is the difference between a building inspection and a pest inspection?',
    a: 'A building (structural) inspection covers the condition of the building — roof, walls, foundations, wet areas, cracking, moisture, safety hazards — under Australian Standard AS4349.1. A pest (timber pest) inspection specifically looks for termites, borers and fungal decay under AS4349.3. They are two different reports, often bundled as a "building and pest inspection". As a first home buyer you want BOTH — termite damage is one of the most expensive and most commonly missed problems, and a building inspection alone will not properly cover it.',
  },
  {
    q: 'When should I book the inspection — before or after making an offer?',
    a: 'It depends how you are buying. For a private-treaty sale with a cooling-off period, you can make an offer subject to a satisfactory building and pest inspection, then book it during cooling-off. For an auction, there is NO cooling-off period in any Australian state once the hammer falls — so you must inspect BEFORE you bid, or you are committed with no way out. Either way, book early: good inspectors get booked out, and cooling-off periods are short (as little as 2 business days in some states).',
  },
  {
    q: 'What are the biggest red flags in a building inspection report?',
    a: 'The defects that genuinely matter for a first home buyer are structural and safety issues, active moisture, and timber pest activity: significant cracking or movement, sagging floors or ceilings, active termites or timber damage, rising damp, concrete cancer, failed bathroom waterproofing, and electrical safety hazards. These are the ones that cost thousands and can compromise the home. Cosmetic items — chipped paint, worn carpet, minor gaps, tired kitchens — read as a long list but are cheap and normal for the age of the home. The skill is telling the two apart, which is exactly what most first home buyers struggle with.',
  },
  {
    q: 'The report has no dollar figures — how do I know what anything costs?',
    a: 'This is the number one frustration for first home buyers. AS4349.1 inspectors identify and describe defects but are not required to (and usually do not) provide repair cost estimates — it is outside their scope. So you get a 40–90 page report full of technical language and no numbers, right when you have days to decide. You can get quotes from trades (slow, and hard to arrange before cooling-off ends) or use a tool like Report Decoded, which reads your inspection PDF and attaches plain-English explanations plus repair cost ranges to every defect in a couple of minutes.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="First home buyer's building inspection checklist (Australia, 2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>The first home buyer inspection checklist, in short:</strong>{' '}
            (1) book a combined <strong>building AND pest inspection</strong>{' '}
            ($400–$700) — before auction, or during cooling-off for a
            private sale; (2) on the day, walk it with the inspector and
            ask about the big-ticket items; (3) read the report for{' '}
            <strong>structural, moisture, pest and safety</strong> defects
            — not the cosmetic long-tail; (4) get repair costs so you know
            what the findings actually mean for your budget; (5) use those
            costs to <strong>negotiate the price down, or walk away</strong>{' '}
            before you are committed. The inspection is your one chance to
            avoid a five-figure surprise after settlement.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'how-to-read-as4349-1-inspection-report',
        'building-inspection-vs-pest-inspection-difference',
        'how-much-to-negotiate-after-building-inspection',
        'cooling-off-period-building-inspection-rights-by-state',
        'what-to-do-if-building-inspection-finds-major-problems',
        'just-got-building-inspection-report-australia',
      ]}
      related_suburbs={[
        'st-kilda',
        'surry-hills',
        'new-farm',
      ]}
    >
      <p>
        Buying your first home is the biggest financial decision most
        Australians ever make — and the building inspection is the one
        step standing between you and a very expensive mistake. Yet no
        one hands first home buyers a guide on how to actually use it.
        This is that guide: a straight, practical checklist for the whole
        inspection process, from booking to negotiation.
      </p>

      <h2>Step 1 — Book the right inspection (building AND pest)</h2>
      <p>
        The most common first-home-buyer mistake is booking only a
        building inspection and skipping pest. Termite damage is among the
        most expensive and most frequently missed problems in Australian
        homes, and a structural inspection alone will not properly cover
        it. You want both — usually bundled as a{' '}
        <Link href="/resources/building-inspection-vs-pest-inspection-difference">
          building and pest inspection
        </Link>.
      </p>
      <ul>
        <li>
          <strong>Get a combined building + pest inspection</strong> to
          AS4349.1 (building) and AS4349.3 (pest). Budget $400–$700
          depending on the property and location.
        </li>
        <li>
          <strong>Use an independent, licensed inspector</strong> — not
          one recommended by the selling agent. You want someone working
          for you, not the vendor.
        </li>
        <li>
          <strong>Check they carry professional indemnity insurance</strong>{' '}
          and provide a full written report (not a verbal summary).
        </li>
      </ul>

      <h2>Step 2 — Get the timing right (this is where buyers get trapped)</h2>
      <p>
        When you inspect depends entirely on how the property is being
        sold, and getting this wrong can leave you legally committed to a
        home with serious defects.
      </p>
      <ul>
        <li>
          <strong>Auction:</strong> there is <strong>no cooling-off
          period</strong> in any Australian state once the hammer falls.
          You must inspect <em>before</em> you bid. No exceptions.
        </li>
        <li>
          <strong>Private treaty (normal sale):</strong> you can make your
          offer subject to a satisfactory building and pest inspection,
          then inspect during the{' '}
          <Link href="/resources/cooling-off-period-building-inspection-rights-by-state">
            cooling-off period
          </Link>{' '}
          — which can be as short as 2 business days depending on your
          state.
        </li>
        <li>
          <strong>Book early.</strong> Good inspectors get booked out, and
          a tight cooling-off window leaves no room to wait.
        </li>
      </ul>

      <h2>Step 3 — On inspection day</h2>
      <p>
        You do not have to attend, but as a first home buyer it is worth
        it — walking the property with the inspector teaches you more than
        the report ever will. If you can be there:
      </p>
      <ul>
        <li>
          <strong>Walk it with the inspector</strong> and ask them to show
          you anything they flag. Ask the blunt question:{' '}
          <em>&ldquo;If this were your money, what would worry you here?&rdquo;</em>
        </li>
        <li>
          <strong>Focus on the big-ticket areas:</strong> roof and
          gutters, subfloor/foundations, wet areas (bathrooms, laundry),
          external walls and cracking, the meter box and wiring, and any
          signs of moisture or termites.
        </li>
        <li>
          <strong>Take your own photos</strong> of anything discussed — a
          useful reference when the written report lands.
        </li>
      </ul>

      <h2>Step 4 — Read the report for what actually matters</h2>
      <p>
        The report will be 40–90 pages of technical language, and it can
        read like a horror story to a first-timer. It is not. The skill is
        separating the defects that matter from the cosmetic long-tail.
        Full walkthrough here:{' '}
        <Link href="/resources/how-to-read-as4349-1-inspection-report">
          how to read an AS4349.1 building inspection report
        </Link>.
      </p>
      <p>
        <strong>The defects that genuinely matter</strong> (structural,
        moisture, pest, safety):
      </p>
      <ul>
        <li>Significant cracking, movement, or sagging floors/ceilings</li>
        <li>Active termites or timber pest damage</li>
        <li>
          <Link href="/resources/rising-damp-australia-how-much-to-fix">
            Rising damp
          </Link>{' '}
          and other active moisture / water ingress
        </li>
        <li>
          <Link href="/resources/concrete-cancer-spalling-cost-australia">
            Concrete cancer
          </Link>{' '}
          (spalling) in balconies, slabs or foundations
        </li>
        <li>
          <Link href="/resources/bathroom-waterproofing-failure-building-inspection-australia">
            Failed bathroom waterproofing
          </Link>
        </li>
        <li>
          <Link href="/resources/electrical-safety-building-inspection-australia">
            Electrical safety hazards
          </Link>{' '}
          (no RCDs, unsafe wiring)
        </li>
      </ul>
      <p>
        <strong>The defects that read scary but usually don&apos;t
        matter:</strong> chipped paint, worn carpet, minor gaps to seal,
        tired kitchens and bathrooms, weathered timber, small cosmetic
        cracks. A long list of these is normal for any established home —
        do not let the sheer volume panic you into overpaying or walking
        from a good property.
      </p>

      <h2>Step 5 — Get the costs (the report won&apos;t give them to you)</h2>
      <p>
        Here is the trap: AS4349.1 inspectors identify defects but{' '}
        <Link href="/resources/building-inspection-report-no-cost-estimates-australia">
          do not provide repair costs
        </Link>{' '}
        — it is outside their scope. So you have a report full of problems,
        no dollar figures, and days to decide. You have three options:
      </p>
      <ul>
        <li>
          <strong>Get trade quotes</strong> — accurate, but slow and hard
          to arrange before cooling-off ends.
        </li>
        <li>
          <strong>Guess</strong> — which is how first home buyers either
          overpay for repairs that were cheap, or walk away from homes that
          were fine.
        </li>
        <li>
          <strong>Use a decoding tool</strong> — Report Decoded reads your
          inspection PDF and attaches plain-English explanations and repair
          cost ranges to every defect in a couple of minutes, so you know
          what the report actually means for your budget.
        </li>
      </ul>

      <h2>Step 6 — Negotiate (or walk away) with the evidence</h2>
      <p>
        The inspection is not just a pass/fail — it is leverage. Once you
        know which defects are real and what they cost, you can put a
        number in front of the agent. See the full framework in{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          how much to negotiate after a building inspection
        </Link>{' '}
        and{' '}
        <Link href="/resources/what-to-do-if-building-inspection-finds-major-problems">
          what to do if it finds major problems
        </Link>.
      </p>
      <ul>
        <li>
          <strong>Quote the cost, don&apos;t just ask for a discount.</strong>{' '}
          &ldquo;The report identifies rising damp and failed waterproofing
          costing $18,000 to rectify&rdquo; is far stronger than &ldquo;can
          you come down a bit?&rdquo;
        </li>
        <li>
          <strong>Prioritise the structural/safety items</strong> in your
          ask — vendors and agents expect cosmetic wear, but a defensible
          repair figure on real defects moves the price.
        </li>
        <li>
          <strong>Be willing to walk.</strong> If the remediation
          approaches or exceeds any discount you can get, the best move as
          a first home buyer is often the next property.
        </li>
      </ul>

      <h2>The first home buyer inspection checklist (quick version)</h2>
      <ul>
        <li>☐ Book a combined <strong>building + pest</strong> inspection ($400–$700)</li>
        <li>☐ Use an <strong>independent</strong> licensed inspector (not the agent&apos;s)</li>
        <li>☐ Inspect <strong>before auction</strong> / during <strong>cooling-off</strong> for private sale</li>
        <li>☐ Attend the inspection and walk it with the inspector</li>
        <li>☐ Read the report for <strong>structural, moisture, pest, safety</strong> — ignore the cosmetic long-tail</li>
        <li>☐ Get <strong>repair costs</strong> for the defects that matter</li>
        <li>☐ Use the costs to <strong>negotiate the price down — or walk away</strong></li>
      </ul>

      <h2>Where Report Decoded fits</h2>
      <p>
        For a first home buyer, the hard part isn&apos;t getting the
        inspection — it&apos;s understanding the report and knowing what to
        do with it, on a deadline, with your biggest-ever purchase on the
        line. Report Decoded reads your building and pest PDF and gives you
        a plain-English verdict (proceed, negotiate, or walk away), repair
        cost estimates for every defect, a ready-to-send negotiation
        letter, and local tradies matched to each problem — in under 2
        minutes. It turns a 60-page document you can&apos;t decode into a
        clear decision you can act on before cooling-off ends.
      </p>
    </ArticleLayout>
  );
}
