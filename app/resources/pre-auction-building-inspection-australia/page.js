import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('pre-auction-building-inspection-australia');

const faqs = [
  {
    q: 'Do I have any cooling-off rights after winning at auction?',
    a: 'No — auction contracts have no cooling-off period in any Australian state. The moment the hammer falls and you sign the contract on the day, the sale is unconditional. This is the most misunderstood aspect of auction buying. Cooling-off rights exist in VIC, NSW, QLD, ACT, and SA for private-treaty sales (with conditions), but every state explicitly excludes auction sales. The result: every defect you didn\'t discover before auction day is now your responsibility to fund. The only protection is doing the inspection BEFORE you bid.',
  },
  {
    q: 'Should I inspect every property I bid on?',
    a: 'Honest answer: it\'s the safest approach, but not always practical. A serious auction campaign typically involves bidding on 3-5 properties over 4-8 weeks before winning one. At $550-$750 per building & pest inspection, that\'s $2,500-$3,500 in inspection costs you might never recover. The compromise most experienced buyers use: get a Stage 1 (visual walk-through with the agent) on every property of serious interest, but only commission a full AS4349.1 inspection on properties where you\'re seriously planning to bid AND the auction is more than 5 days away. Skipping inspection on auction-day to "save money" is the single most expensive mistake AU auction buyers make.',
  },
  {
    q: 'Can I get a building inspection done in 2 days before auction?',
    a: 'Yes, in most major AU metro markets. Most inspection firms operate 6-day rosters and can typically deliver within 24-48 hours for a $50-$150 expedite fee. The harder constraint is access — the property must be available for inspection, and many vendors restrict access to open-for-inspection windows. Your buyer\'s agent or solicitor can request a private access slot for the inspector, but this needs to be arranged 3-5 days in advance during peak auction season. If you only have 48 hours, prioritise: book the inspection first thing in the morning, request access through the listing agent for any available slot in the next 24 hours, and accept that a rushed inspection is better than no inspection.',
  },
  {
    q: 'Should I trust the vendor-supplied building report?',
    a: 'Read it, don\'t rely on it. Vendor-supplied (also called pre-sale or pre-auction) building reports are commissioned by the vendor and paid for by the vendor. The inspector\'s scope and reporting style are influenced by who hires them. Vendor reports tend to be technically accurate but presented in language that minimises the impact of findings — defects are framed as "maintenance items," remediation costs are rarely included, and the executive summary tends to highlight positives. Best practice: read the vendor report to understand the property\'s known issues (you have to disclose if you knew about a defect when negotiating), but commission your own independent inspector for the parts that matter — particularly subfloor, roof void, and any area where the vendor report is light on detail. A second inspection runs $400-$650 typically and is well worth it for a 7-figure purchase.',
  },
  {
    q: 'What if I find serious issues but I really want the property?',
    a: 'You have three options before auction day. Option 1: Reduce your maximum bid by the quantified cost of the issues (use the inspector\'s findings + a contractor quote if you can get one in time). This is the standard play and most experienced auction buyers do this automatically. Option 2: Try to negotiate a pre-auction private sale with the vendor at a price below the auction reserve. Vendors sometimes accept this if your offer is firm and your inspection has identified material issues — it removes their auction risk. Option 3: Walk away. The hardest option emotionally, but the right one if the issues are structural, the budget is tight, and there\'s no realistic price at which the property makes sense. Auction FOMO is the single biggest driver of buyer regret in AU property.',
  },
  {
    q: 'How much does pre-auction inspection cost vs post-contract inspection?',
    a: 'Same headline price — $550-$750 for combined building & pest inspection on a typical 3-bed AU house in a metro market. The difference is risk profile. A post-contract inspection (private-treaty purchase) lets you renegotiate or rescind during cooling-off. A pre-auction inspection has no such backstop — you either bid below the reserve, walk away, or accept the issues. The functional cost of skipping pre-auction inspection is the average defect-related cost you might inherit: typically $15,000-$45,000 in unbudgeted repairs across a 5-year holding period, sometimes much more. The $550 inspection is the cheapest piece of insurance you can buy on auction day.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Pre-auction building inspection in Australia: the 2026 buyer's guide"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Auction contracts have no cooling-off period in
            any Australian state.</strong> Every defect you don&apos;t
            discover before bidding becomes your problem to fund — no
            backstop. Cost of pre-auction building & pest inspection
            is <strong>$550-$750</strong> ($50-$150 expedite fee if
            within 48 hours). Most experienced auction buyers spend
            $2,500-$3,500 across a campaign inspecting 3-5
            properties. Vendor-supplied reports are useful context
            but not a substitute for your own inspection.
            Auction-day decision: bid less by the quantified defect
            cost, negotiate a pre-auction private sale, or walk away.
            Auction FOMO is the biggest driver of buyer regret in AU
            property.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'cooling-off-period-building-inspection-rights-by-state',
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-much-to-negotiate-after-building-inspection',
        'what-is-as4349-1',
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
        Auction day. 25 minutes of bidding. Hammer drops. You sign
        the contract on the bonnet of the auctioneer&apos;s car. The
        sale is unconditional from that signature onward.
      </p>
      <p>
        No cooling-off period. No subject-to-inspection clause. No
        renegotiation. No walk-away. Every defect you didn&apos;t
        discover before bidding is now yours to fund — out of pocket,
        post-settlement, with no recovery options.
      </p>
      <p>
        Pre-auction inspection is the only protection auction buyers
        get in any Australian state. This guide covers how to inspect
        properly when you might be bidding on multiple properties,
        what vendor reports are worth, how to handle the 48-hour
        access window, and how to read findings against an auction-
        day decision clock.
      </p>

      <h2>Auction = no cooling-off, in every state</h2>
      <p>
        This is the single most misunderstood point in Australian
        auction buying. Every state excludes auction sales from its
        cooling-off provisions:
      </p>
      <ul>
        <li>
          <strong>Victoria</strong> — Sale of Land Act 1962. Three
          business days cooling-off for private treaty; explicitly
          excluded for auction sales and sales within 3 business
          days before or after a scheduled auction.
        </li>
        <li>
          <strong>NSW</strong> — Conveyancing Act 1919. Five business
          days for private treaty (can be waived); auction sales
          excluded entirely.
        </li>
        <li>
          <strong>Queensland</strong> — Property Occupations Act 2014.
          Five business days for private treaty; auction sales excluded
          (and sales within 2 business days after an auction).
        </li>
        <li>
          <strong>ACT</strong> — Civil Law (Sale of Residential
          Property) Act 2003. Five business days; auction excluded.
        </li>
        <li>
          <strong>South Australia</strong> — Land and Business (Sale
          and Conveyancing) Act 1994. Two clear business days; auction
          excluded.
        </li>
        <li>
          <strong>WA</strong> — No statutory cooling-off; contracts
          rely on inspection clauses inserted during private treaty.
          Auction = unconditional from hammer fall.
        </li>
        <li>
          <strong>Tasmania, NT</strong> — No statutory cooling-off
          period.
        </li>
      </ul>
      <p>
        See{' '}
        <Link href="/resources/cooling-off-period-building-inspection-rights-by-state">
          cooling-off rights by state
        </Link>{' '}
        for the broader framework. The auction-day rule is the same
        everywhere: <strong>you cannot rescind after winning</strong>.
      </p>

      <h2>The auction campaign maths</h2>
      <p>
        Experienced Australian auction buyers don&apos;t inspect one
        property. A typical campaign looks like:
      </p>
      <ul>
        <li>
          <strong>Identify 15-30 properties</strong> matching your
          criteria across a 4-8 week search window.
        </li>
        <li>
          <strong>Visit 8-12 open-for-inspections</strong> to short-list
          to genuine contenders.
        </li>
        <li>
          <strong>Bid on 3-5 properties</strong> at separate auctions,
          most of which you&apos;ll lose to other bidders.
        </li>
        <li>
          <strong>Win one</strong>, often the 4th or 5th auction you
          attend.
        </li>
      </ul>
      <p>
        Inspection cost is the constraint. At $550-$750 per
        property for combined building &amp; pest inspection, fully
        inspecting 5 properties costs $2,750-$3,750 — most of which
        you don&apos;t recover. Most buyers therefore use a tiered
        approach:
      </p>
      <ul>
        <li>
          <strong>Tier 1 — Visual walk-through (free).</strong>{' '}
          Open-for-inspection visit. Look for obvious red flags —
          cracking, damp staining, sloping floors, sagging roofs,
          DIY-quality finishes. Disqualify properties at this stage.
        </li>
        <li>
          <strong>Tier 2 — Stage 1 inspection ($250-$400).</strong>{' '}
          Inspector spends 60-90 minutes walking through with you,
          provides a verbal summary and short written list of major
          concerns. No formal AS4349.1 report. Useful for shortlisting
          but won&apos;t support detailed negotiation.
        </li>
        <li>
          <strong>Tier 3 — Full AS4349.1 building &amp; pest
          inspection ($550-$750).</strong> Comprehensive defect report,
          AS4349.1 scope, formal PDF deliverable. Commission this on
          properties you&apos;re actually planning to bid on.
        </li>
      </ul>
      <p>
        The compromise most buyers settle on: Tier 1 on every property
        of interest, Tier 3 only on properties where you&apos;ve
        decided to bid AND the auction is far enough away to use the
        report. Tier 2 is a middle option when you want more than a
        walk-through but aren&apos;t committed.
      </p>

      <h2>The 48-hour access problem</h2>
      <p>
        Pre-auction inspections face a constraint not present in
        private treaty: <strong>limited access</strong>. The property
        is still being marketed, the vendor is conducting open-for-
        inspections for other buyers, and your inspector needs a slot
        without disrupting the campaign.
      </p>
      <p>
        Typical access patterns:
      </p>
      <ul>
        <li>
          <strong>Open-for-inspection slot</strong> — Your inspector
          attends a public OFI window (30-45 minutes). Inadequate for
          a full AS4349.1 scope. Useful only for Tier 1/2.
        </li>
        <li>
          <strong>Private access by appointment</strong> — Listing
          agent arranges 60-90 minutes outside OFI hours. Standard
          for Tier 3 inspections. Requires 3-5 days&apos; notice in
          peak auction season.
        </li>
        <li>
          <strong>Same-day access (48 hours pre-auction)</strong> —
          Possible but pressured. Most inspection firms charge a
          $50-$150 expedite fee. Listing agents will usually
          accommodate genuine buyers, but the time pressure means the
          inspector has less time on-site.
        </li>
      </ul>
      <p>
        Practical sequence for a property auctioning in 5 days:
      </p>
      <ol>
        <li>Day 5 — Book inspector. Confirm expedite available.</li>
        <li>
          Day 5 — Email/call listing agent requesting private access
          for inspector at preferred slot in next 48 hours.
        </li>
        <li>Day 3-4 — Inspector attends, conducts full inspection.</li>
        <li>
          Day 2-3 — Report delivered. Read it carefully. Commission
          structural engineer follow-up if anything was flagged for
          further investigation.
        </li>
        <li>
          Day 1 — Make bidding decision. Adjust maximum bid by
          quantified defect cost.
        </li>
        <li>Auction day — Bid, win, walk away, or hold position.</li>
      </ol>

      <h2>Vendor-supplied reports: read, don&apos;t rely</h2>
      <p>
        Most vendors at auction commission their own pre-sale
        building &amp; pest report and make it available to bidders
        through the listing agent or the contract pack. These are
        commonly called &ldquo;vendor reports,&rdquo; &ldquo;pre-sale
        reports,&rdquo; or &ldquo;Section 32 inspection reports&rdquo;
        (in Victoria).
      </p>
      <p>
        The honest read on vendor-supplied reports:
      </p>
      <ul>
        <li>
          <strong>Technically accurate, presentationally optimistic.</strong>{' '}
          The inspector is paid by the vendor. The findings are real
          but the framing tends to soften impact. Defects get described
          as &ldquo;maintenance items&rdquo; or &ldquo;normal wear for
          property age.&rdquo; Remediation costs are rarely included.
        </li>
        <li>
          <strong>Useful for understanding known issues.</strong> The
          vendor cannot legally hide defects they know about. If their
          inspector found something material, it&apos;s in the report —
          you just need to read carefully to find it.
        </li>
        <li>
          <strong>Not a substitute for your own.</strong> Vendor
          reports tend to skip subfloor, roof void, and inaccessible
          areas unless the vendor specifically scoped them in. Your
          inspector commissioned independently has different access
          incentives.
        </li>
      </ul>
      <p>
        Best practice on a high-stakes auction property:
      </p>
      <ol>
        <li>Read the vendor report cover-to-cover.</li>
        <li>
          Mark any reference to: &ldquo;further investigation
          recommended,&rdquo; &ldquo;limited access,&rdquo;{' '}
          &ldquo;not inspected,&rdquo; &ldquo;exclusion zone,&rdquo;
          &ldquo;outside scope.&rdquo;
        </li>
        <li>
          Commission your own focused inspection covering those
          excluded/uncertain areas, plus any major defect category
          flagged in the vendor report. $400-$650 typical cost for a
          targeted re-inspection.
        </li>
      </ol>

      <h2>Reading findings against the auction clock</h2>
      <p>
        Once your report lands, you have 24-72 hours to make a
        bidding decision. The framework:
      </p>
      <ul>
        <li>
          <strong>Minor defects ($0-$5,000 total):</strong> Proceed
          to auction at planned maximum bid. Defects are normal for
          AU stock and don&apos;t materially shift value.
        </li>
        <li>
          <strong>Moderate defects ($5,000-$25,000 total):</strong>{' '}
          Reduce maximum bid by 70-80% of the quantified cost
          (leaving margin for cost overruns). Calculate from
          contractor quotes where possible, inspector-suggested
          ranges otherwise.
        </li>
        <li>
          <strong>Major defects ($25,000-$100,000 total):</strong>{' '}
          Reduce maximum bid by the full quantified cost, AND make
          a final go/no-go call. If your reduced max is below where
          you reasonably expect the auction to settle, walk away.
          Don&apos;t bid hoping for a soft auction.
        </li>
        <li>
          <strong>Critical defects ($100,000+ or structural
          uncertainty):</strong> Walk away unless you specifically
          have the cash flow, project-management capacity, and risk
          appetite to take on a major rectification. Auction is the
          wrong mechanism for buying a renovation project — too much
          competition, no due-diligence backstop.
        </li>
        <li>
          <strong>Defects requiring follow-up specialist:</strong>{' '}
          If your inspector recommends &ldquo;further investigation
          by structural engineer/pest specialist/electrician&rdquo;
          AND you can&apos;t get that follow-up before auction day,
          treat it as a critical-uncertainty signal. Walk away or
          dramatically reduce your maximum.
        </li>
      </ul>
      <p>
        See{' '}
        <Link href="/resources/what-to-do-if-building-inspection-finds-major-problems">
          what to do when inspection finds major problems
        </Link>{' '}
        for the deeper decision tree, and{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          how much to negotiate
        </Link>{' '}
        for the cost-to-action translation.
      </p>

      <h2>The pre-auction private sale option</h2>
      <p>
        If your inspection turns up material defects but you still
        want the property, there&apos;s a third path between bidding
        and walking away: a <strong>pre-auction private sale offer
        to the vendor</strong>.
      </p>
      <p>
        The mechanics:
      </p>
      <ul>
        <li>
          You make a written offer through the listing agent at a
          price below the publicly-known auction guide.
        </li>
        <li>
          The offer is conditional on contract acceptance within
          24-48 hours and unconditional (no further inspections,
          finance pre-approved).
        </li>
        <li>
          You explicitly reference the defects you&apos;ve identified
          through inspection as justification for the price.
        </li>
        <li>
          The vendor either accepts (removing auction risk for them),
          declines (you continue to auction or walk), or
          counter-offers.
        </li>
      </ul>
      <p>
        When this works: vendors who are risk-averse, vendors whose
        auction guide is already meeting market resistance, or
        properties where the defects you&apos;ve found genuinely
        change the value calculus. When it doesn&apos;t: highly
        sought-after properties with multiple confirmed bidders.
      </p>
      <p>
        Estimated success rate for pre-auction private offers in AU:
        15-25% on properties where defects have been identified,
        higher in soft auction markets, lower during sustained boom
        periods.
      </p>

      <h2>Auction-day emotional management</h2>
      <p>
        The single biggest driver of buyer regret in Australian
        property is bidding past your inspection-adjusted maximum
        because of auction-day emotion. The reasons buyers blow their
        limit:
      </p>
      <ul>
        <li>
          <strong>Sunk-cost commitment</strong> — &ldquo;I&apos;ve
          spent $750 on inspection and 6 weeks searching, I need to
          win this.&rdquo;
        </li>
        <li>
          <strong>Fear of starting over</strong> — &ldquo;If I lose
          this, I have to start the campaign again.&rdquo;
        </li>
        <li>
          <strong>Public commitment / partner pressure</strong> —
          &ldquo;I told everyone we&apos;d be buying this weekend.&rdquo;
        </li>
        <li>
          <strong>Marginal-dollar thinking</strong> — &ldquo;Another
          $5,000 isn&apos;t much over 30 years.&rdquo;
        </li>
      </ul>
      <p>
        Counter-strategies that work:
      </p>
      <ul>
        <li>
          Write your maximum bid (defect-adjusted) on paper before
          the auction. Sign it.
        </li>
        <li>
          Bring a partner or buyer&apos;s agent with explicit
          authority to call &ldquo;stop&rdquo; if you cross your
          maximum.
        </li>
        <li>
          Set the maximum at a clean number (not $872,000 — use
          $870,000) so you can&apos;t talk yourself into &ldquo;one
          more bid.&rdquo;
        </li>
        <li>
          Have a second property identified as a backup. The campaign
          continues whether you win or lose this one.
        </li>
      </ul>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded reads your pre-auction building &amp; pest
        inspection PDF (whether vendor-supplied or your own
        commission) and extracts every defect with cost estimates
        and trade recommendations. For auction buyers, the most
        valuable output is the bottom-line negotiation number — the
        figure to subtract from your maximum bid.
      </p>
      <p>
        Auction-day workflow with Report Decoded:
      </p>
      <ol>
        <li>
          Day 2-3 pre-auction — your inspection PDF arrives.
        </li>
        <li>
          Upload to Report Decoded. 60 seconds later you have:
          plain-English defect summary, cost-banded findings, trade-
          by-trade recommendations, and a total quantified
          rectification cost.
        </li>
        <li>
          Day 1 pre-auction — subtract that total from your planned
          maximum bid. Write the new number down.
        </li>
        <li>
          Auction day — bid against the adjusted maximum, not the
          original.
        </li>
      </ol>
      <p>
        The product was built specifically for the time pressure of
        pre-auction decisions — a 60-100 page inspection report
        turned into a defensible negotiation position in less time
        than it takes to read the executive summary. For auction
        buyers in particular, that compression is the difference
        between a confident bid and an emotional one.
      </p>
    </ArticleLayout>
  );
}
