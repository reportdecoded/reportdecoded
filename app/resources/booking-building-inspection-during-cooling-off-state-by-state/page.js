import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('booking-building-inspection-during-cooling-off-state-by-state');

const faqs = [
  {
    q: 'When does the cooling-off period actually start?',
    a: 'It starts on the day the contract is signed (most states) — not when you receive a copy back, not when the deposit clears. Specifically: VIC, QLD, ACT, SA — clock starts the day contract is signed. NSW — clock starts when you receive a copy of the signed contract. The distinction matters in NSW because a delay in the agent returning the signed contract pushes back the clock. Always confirm with your conveyancer which date applies — they have the contract paperwork and can confirm exactly when the window closes.',
  },
  {
    q: 'Can I extend the cooling-off period if I need more time for the inspection?',
    a: 'Sometimes, by agreement with the vendor. Most agents will grant a 24-48 hour cooling-off extension when the buyer is genuinely engaged and needs time for legitimate inspection findings. Ask early (within 24 hours of signing) rather than at the deadline. The request needs to come through your conveyancer in writing — informal phone calls don\'t count. Some vendors refuse; if so, you either commit to a tight timeline or rescind under the standard cooling-off. Worth remembering: you can rescind under cooling-off for ANY reason — including "we didn\'t get the inspection done in time" — at the cost of the cooling-off forfeit (typically 0.25% of contract price).',
  },
  {
    q: 'Do business days include public holidays?',
    a: 'No — public holidays are excluded from the business day count. Each state\'s cooling-off legislation specifies "business days" which means: not weekends, not public holidays (state + national). The practical implication: a contract signed on the Friday before Easter or Christmas can have its cooling-off window pushed substantially. Sydney Royal Show, AFL Grand Final, Melbourne Cup, Queen\'s Birthday, ANZAC Day, Christmas/Boxing Day/New Year all add days to your window. Confirm with your conveyancer which days count.',
  },
  {
    q: 'What if the agent says cooling-off doesn\'t apply because it\'s an auction?',
    a: 'They\'re right — auction sales have no cooling-off in any AU state. If you signed a contract on auction day (or within 3 business days before in VIC), there is no statutory cooling-off period. Your only protection is the inspection you commissioned BEFORE bidding. See our pre-auction building inspection guide for the full strategy. Once the hammer falls, the contract is unconditional. Any defects discovered post-auction become your responsibility to fund or negotiate informally with the vendor (rarely successful).',
  },
  {
    q: 'What if my inspection finds defects but cooling-off has already ended?',
    a: 'Your formal exit options are extremely limited at that point. Three potential paths: (1) Negotiate informally with the vendor — possible but rare success unless defects are severe AND the market is soft. (2) If the vendor or agent FAILED to disclose known material defects (e.g. Section 32 omission in VIC, vendor disclosure failure in NSW), you may have grounds for rescission via court — expensive and slow. (3) Build the rectification cost into your post-settlement budget and proceed. Most buyers who end up in this position choose option 3, but it\'s the most expensive option in the long run because the rectification cost is borne entirely by you.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Booking a building inspection during cooling-off: state-by-state Australia (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            Cooling-off windows by state: <strong>VIC 3
            business days</strong>, <strong>NSW 5 business days</strong>,{' '}
            <strong>QLD 5 business days</strong>,{' '}
            <strong>ACT 5 business days</strong>,{' '}
            <strong>SA 2 business days</strong>,{' '}
            <strong>WA — none (contract clause only)</strong>,{' '}
            <strong>TAS — none</strong>,{' '}
            <strong>NT — none</strong>. Auction sales have NO
            cooling-off anywhere. To fit an inspection inside cooling-
            off, book within 24 hours of signing, pay the expedite
            premium, allow 2-3 days for report delivery, leave 1 day
            to read + decide. Tight in VIC (3 days), comfortable in
            NSW/QLD/ACT (5 days), impossible in SA without an
            extension or pre-signed-day booking.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'cooling-off-period-building-inspection-rights-by-state',
        'how-fast-book-building-inspection-australia',
        'pre-auction-building-inspection-australia',
        'what-to-do-if-building-inspection-finds-major-problems',
      ]}
      related_suburbs={[
        'brunswick',
        'newtown',
        'bondi',
        'toowong',
        'sandringham',
      ]}
    >
      <p>
        You signed the contract on Tuesday. The agent confirmed
        cooling-off ends Friday at 5pm. That&apos;s 3 business days
        — barely enough to commission an inspection, get the
        report, read it, and decide whether to rescind.
      </p>
      <p>
        Each state runs cooling-off differently. VIC is 3 days. NSW
        is 5. SA is 2. WA has none at all. Here&apos;s the
        operational booking guide by state — and what to do when
        the window is too tight.
      </p>

      <h2>Cooling-off windows by state</h2>

      <h3>Victoria — 3 business days</h3>
      <p>
        Shortest of the eastern states. Sale of Land Act 1962
        Section 31. Clock starts the day the contract is signed.
        Cooling-off forfeit: 0.2% of purchase price or $100,
        whichever is greater.
      </p>
      <p>
        Booking strategy:
      </p>
      <ul>
        <li>
          <strong>Day 0 (Tuesday signing):</strong> Contact 3 inspectors
          immediately. Request 24-hour expedite. Confirm with agent
          that property access is available
        </li>
        <li>
          <strong>Day 1 (Wednesday):</strong> Inspector attends. Report
          typed overnight
        </li>
        <li>
          <strong>Day 2 (Thursday):</strong> Report delivered AM.
          Upload to{' '}
          <Link href="/resources/how-to-read-as4349-1-inspection-report">
            decode the report
          </Link>
          {' '}or read carefully. Draft negotiation letter or rescission notice
        </li>
        <li>
          <strong>Day 3 (Friday before 5pm):</strong> Send to agent +
          conveyancer. Decision made
        </li>
      </ul>
      <p>
        Expedite cost: +$100-$150 over standard. Total inspection
        spend: $650-$850.
      </p>

      <h3>New South Wales — 5 business days</h3>
      <p>
        Conveyancing Act 1919 Section 66W. Clock starts when buyer
        RECEIVES a copy of the signed contract (subtle but important —
        gives you potentially an extra day if the agent is slow).
        Cooling-off forfeit: 0.25% of purchase price.
      </p>
      <p>
        Section 66W can be waived if the buyer&apos;s solicitor signs
        a certificate at exchange — common in auction-day purchases
        but uncommon in private treaty. If 66W is waived, you have NO
        cooling-off. Confirm with your conveyancer whether 66W is
        included or waived.
      </p>
      <p>
        Booking strategy:
      </p>
      <ul>
        <li>
          <strong>Day 0:</strong> Contact inspectors. Standard booking
          (no expedite needed) — 5 days is enough
        </li>
        <li>
          <strong>Day 1-2:</strong> Inspector schedules + attends
        </li>
        <li>
          <strong>Day 3-4:</strong> Report delivered
        </li>
        <li>
          <strong>Day 5:</strong> Decision made + sent
        </li>
      </ul>
      <p>
        Cost: standard $600-$750 with no expedite premium.
      </p>

      <h3>Queensland — 5 business days</h3>
      <p>
        Property Occupations Act 2014. Clock starts the day the
        contract is signed. Cooling-off forfeit: 0.25% of purchase
        price. Auction sales within 2 business days BEFORE the
        auction are also excluded from cooling-off.
      </p>
      <p>
        Booking strategy:
      </p>
      <ul>
        <li>
          <strong>Day 0:</strong> Contact inspectors. Allow standard
          booking
        </li>
        <li>
          <strong>Day 2-3:</strong> Inspection completed
        </li>
        <li>
          <strong>Day 4:</strong> Report received + reviewed
        </li>
        <li>
          <strong>Day 5:</strong> Action — accept, negotiate, or
          rescind
        </li>
      </ul>
      <p>
        QLD also has the &ldquo;subject to building & pest&rdquo;
        condition (REIQ Clause 4.1) which adds a separate inspection
        window typically running 7-14 days from contract date,
        separate from cooling-off. Many QLD buyers use this clause
        for the inspection rather than cooling-off.
      </p>

      <h3>ACT — 5 business days</h3>
      <p>
        Civil Law (Sale of Residential Property) Act 2003. Clock
        starts the day the contract is signed. Cooling-off forfeit:
        0.25% of purchase price. Comfortable booking window — same
        strategy as NSW/QLD.
      </p>

      <h3>South Australia — 2 business days</h3>
      <p>
        Land and Business (Sale and Conveyancing) Act 1994. Shortest
        cooling-off in the country. Practically impossible to fit a
        standard inspection inside the window — same-day or
        24-hour expedite required, or pre-signed inspection.
      </p>
      <p>
        SA buyers commonly insert a &ldquo;subject to building
        inspection&rdquo; clause in the contract (with a 7-14 day
        window) rather than relying on cooling-off. Discuss with your
        conveyancer at contract review.
      </p>

      <h3>Western Australia — no statutory cooling-off</h3>
      <p>
        WA has no cooling-off at all. Your only inspection-based exit
        is the &ldquo;subject to building inspection&rdquo; clause
        that must be in the contract before signing. Standard REIWA
        Joint Form clause allows for buyer-inserted inspection terms.
        Walk away from any WA contract that doesn&apos;t include this
        clause. See{' '}
        <Link href="/resources/perth-building-inspection-wa-buyer-guide">
          Perth building inspection — WA buyer&apos;s playbook
        </Link>
        {' '}for full WA strategy.
      </p>

      <h3>Tasmania — no statutory cooling-off</h3>
      <p>
        Like WA, Tasmania has no cooling-off. The exit lives in the
        contract&apos;s inspection clause. Tasmanian REI contracts
        typically include a building & pest condition by default
        with a 14-day window — but confirm with your conveyancer
        before signing.
      </p>

      <h3>Northern Territory — no statutory cooling-off</h3>
      <p>
        Same as WA and TAS. Contract-clause-based protection only.
        The NT property market is smaller and inspection availability
        is tighter — some Darwin buyers book inspectors before
        signing the contract, with the contract signing conditional
        on positive inspection.
      </p>

      <h2>Practical booking sequence</h2>
      <p>
        Regardless of state, the optimal sequence is:
      </p>
      <ol>
        <li>
          <strong>Hour 1 after signing:</strong> Email 3 inspection
          firms with property address, intended inspection date,
          urgency note. Request quotes + availability
        </li>
        <li>
          <strong>Hour 2-4:</strong> Email the listing agent
          requesting private access for inspector. Specify preferred
          time window
        </li>
        <li>
          <strong>Hour 4-6:</strong> Compare quotes, book the
          inspector who can deliver fastest within budget
        </li>
        <li>
          <strong>Day 1-3:</strong> Inspector attends, conducts
          inspection. You receive a verbal summary if you ask
        </li>
        <li>
          <strong>Day 2-4:</strong> Written report delivered as PDF
        </li>
        <li>
          <strong>Day 3-5:</strong> Read or decode the report,
          decide, send written response to agent + conveyancer
        </li>
      </ol>

      <h2>If the window is too tight</h2>
      <p>
        Five options when you can&apos;t fit the inspection inside
        cooling-off:
      </p>
      <ol>
        <li>
          <strong>Request an extension.</strong> Through your
          conveyancer in writing. 24-48h typically granted for
          good-faith buyers
        </li>
        <li>
          <strong>Pay the same-day expedite premium.</strong> Adds
          $200-$400 but compresses 5-day window to 24 hours
        </li>
        <li>
          <strong>Use a verbal report.</strong> Some inspectors will
          give you a verbal summary on-site (no written report yet).
          Enough for a yes/no decision but no negotiation evidence
        </li>
        <li>
          <strong>Rescind under cooling-off, then re-engage.</strong>{' '}
          Forfeit the cooling-off penalty (0.2-0.25%), pay it as the
          cost of buying time. Re-engage at a lower offer if the
          property comes back to market
        </li>
        <li>
          <strong>Walk away entirely.</strong> The cleanest option if
          the timing is genuinely impossible
        </li>
      </ol>

      <h2>Where Report Decoded fits</h2>
      <p>
        The critical bottleneck inside cooling-off is the &ldquo;read
        the 60-page PDF, understand what the defects mean, decide
        whether to act&rdquo; step. For most buyers that takes 2-3
        hours of careful reading + Googling unfamiliar terms.
      </p>
      <p>
        Report Decoded compresses that step to 2 minutes:
      </p>
      <ul>
        <li>Upload the inspection PDF</li>
        <li>
          Receive plain-English defect breakdown + cost-banded
          estimates + drafted negotiation letter
        </li>
        <li>
          Decide and send the response to the agent within hours, not
          days
        </li>
      </ul>
      <p>
        For VIC&apos;s 3-day cooling-off in particular, the time
        saving is the difference between &ldquo;decision made by
        deadline&rdquo; and &ldquo;had to rescind because we
        couldn&apos;t read the report in time.&rdquo;
      </p>
    </ArticleLayout>
  );
}
