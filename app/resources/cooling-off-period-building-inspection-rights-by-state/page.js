import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('cooling-off-period-building-inspection-rights-by-state');

const faqs = [
  {
    q: 'Does cooling-off apply if I bought at auction?',
    a: 'No — in every Australian state except WA (which has no statutory cooling-off), auction purchases waive cooling-off rights. The moment your bid is accepted at auction, you have an unconditional contract. This is why getting the building inspection commissioned BEFORE auction day is critical for auction buyers — the inspection report becomes your maximum-bid decision tool, not your post-purchase escape hatch.',
  },
  {
    q: 'Can I extend the cooling-off period to wait for the building inspection?',
    a: 'Sometimes, but only by mutual agreement with the vendor before exchange. The standard cooling-off period is statutory and can\'t be unilaterally extended. Some vendors will agree to a "subject to building inspection" clause with an extended timeline if you ask before signing — but most won\'t in competitive markets. The practical solution is to book the inspection BEFORE you sign the contract, so the report lands in your inbox on the same day cooling-off starts, not three days into it.',
  },
  {
    q: 'How much does it cost to walk away during cooling-off?',
    a: 'In most states there\'s a small penalty — typically 0.20% to 0.25% of the purchase price, capped. For a $900,000 property in NSW that\'s $1,800-$2,250 forfeited. In VIC the penalty is $100 or 0.20% of the price, whichever is greater. SA charges no penalty. QLD doesn\'t penalise but you forfeit any deposit paid. Walking away outside cooling-off forfeits the full deposit, which is typically 10% of the contract price.',
  },
  {
    q: 'Can I waive my cooling-off rights?',
    a: 'Yes, in most states, but it requires a separate signed document and (in VIC and NSW) usually a "Section 66W" certificate from your conveyancer or solicitor. Vendors sometimes ask you to waive cooling-off as a condition of accepting your offer — this is risky because it removes your only legal escape hatch if the building inspection comes back bad. Never waive cooling-off rights unless you\'ve already received and acted on the building inspection.',
  },
  {
    q: 'My building inspection isn\'t ready until after cooling-off ends. What do I do?',
    a: 'Three options, in order of preference: (1) Ask the vendor for a written extension of cooling-off — costs nothing, vendors often agree if the property has been on market a while. (2) Use the cooling-off window to walk away anyway if you have ANY concern, accepting the small penalty (~0.2% in most states). (3) Commission specialist follow-ups DURING cooling-off based on the inspector\'s preliminary verbal feedback. The worst option is to do nothing — once cooling-off ends without a result, you\'re bound by the contract regardless of what the report says.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Cooling-off period building inspection rights by state (Australia, 2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Statutory cooling-off periods in 2026:</strong>{' '}
            VIC <strong>3 business days</strong>; NSW{' '}
            <strong>5 business days</strong>; QLD <strong>5 business
            days</strong>; SA <strong>2 clear business days</strong>;
            WA <strong>no statutory cooling-off</strong> (contract
            clauses only); ACT <strong>5 business days</strong>; TAS
            no statutory cooling-off; NT <strong>4 business days</strong>.
            All cooling-off periods <strong>waive at auction</strong> in
            every state. The practical play: book your{' '}
            <Link href="/resources/building-inspection-vs-pest-inspection-difference">
              building and pest inspection
            </Link>{' '}
            BEFORE you sign the contract so the report lands on Day 1
            of cooling-off, not Day 3.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-much-to-negotiate-after-building-inspection',
        'building-inspection-vs-pest-inspection-difference',
        'what-is-as4349-1',
      ]}
      related_suburbs={['yarraville', 'brunswick', 'newtown', 'paddington', 'new-farm']}
    >
      <p>
        You just signed the contract. The agent congratulated you and
        said cooling-off &ldquo;started today.&rdquo; Your building
        inspector is booked for Tuesday. The report will come back
        Wednesday.
      </p>
      <p>
        Whether that gives you any actual rights to walk away — or
        even to negotiate — depends entirely on which Australian state
        you bought in, what type of sale it was, and what your
        conveyancer put in the contract. The same circumstance can give
        you a clean escape in NSW and zero options in WA.
      </p>
      <p>
        Here&apos;s the state-by-state breakdown, in plain English,
        with the specific rules that matter for AU property buyers in
        2026.
      </p>

      <h2>Victoria (VIC)</h2>
      <ul>
        <li><strong>Statutory cooling-off period:</strong> 3 clear business days from the date you signed the contract (excluding weekends and public holidays).</li>
        <li><strong>Auction:</strong> No cooling-off if purchased at public auction OR within 3 business days before/after a scheduled auction.</li>
        <li><strong>Penalty to walk away:</strong> The greater of $100 or 0.2% of the purchase price. For a $1M property: $2,000.</li>
        <li><strong>How you exercise it:</strong> Written notice to the vendor or their agent before the end of cooling-off. Get a conveyancer to draft the notice.</li>
        <li><strong>Practical play for VIC buyers:</strong> The Section 32 vendor statement (Sale of Land Act) should have been provided before you signed. Read it carefully on Day 1 — anything missing from the Section 32 is grounds to rescind without penalty during cooling-off (Section 32 of the SLA covers vendor disclosures including building permits, planning overlays, owners corp obligations, etc).</li>
        <li><strong>Building inspection timing:</strong> 3 business days is tight. If you sign Monday, cooling-off ends Thursday. Most inspectors can deliver within 48 hours of inspection, but you need to book the inspection BEFORE signing if you want the report inside the window.</li>
      </ul>

      <h2>New South Wales (NSW)</h2>
      <ul>
        <li><strong>Statutory cooling-off period:</strong> 5 business days from the date the contract was exchanged.</li>
        <li><strong>Auction:</strong> No cooling-off applies to auction purchases or any sale where the vendor and purchaser have signed a Section 66W certificate (which waives cooling-off — common in negotiated post-auction sales).</li>
        <li><strong>Penalty to walk away:</strong> 0.25% of the purchase price. For a $1.2M Sydney house: $3,000.</li>
        <li><strong>How you exercise it:</strong> Written notice to the vendor&apos;s solicitor before 5pm on the last day. Your conveyancer drafts it.</li>
        <li><strong>Building inspection timing:</strong> 5 business days is the most generous statutory period in Australia. Booking the inspection within 24 hours of exchange gives you time for follow-up specialist reports if needed.</li>
        <li><strong>NSW-specific risk:</strong> Section 66W certificates are sometimes presented as &ldquo;standard&rdquo; by aggressive selling agents. NEVER sign one until your conveyancer has reviewed the contract AND you&apos;ve received the building inspection.</li>
      </ul>

      <h2>Queensland (QLD)</h2>
      <ul>
        <li><strong>Statutory cooling-off period:</strong> 5 business days from when the buyer receives a fully signed copy of the contract.</li>
        <li><strong>Auction:</strong> No cooling-off if purchased at public auction OR if the contract was formed at the same time/place as a scheduled auction.</li>
        <li><strong>Penalty to walk away:</strong> 0.25% of the purchase price. For a $900K Brisbane property: $2,250.</li>
        <li><strong>How you exercise it:</strong> Written notice to the seller or their agent before 5pm on the fifth business day.</li>
        <li><strong>Building inspection timing:</strong> Same 5 business days as NSW — comfortable enough to get a building + pest report + a specialist follow-up if needed.</li>
        <li><strong>QLD-specific note:</strong> Queensland contracts often include a &ldquo;subject to satisfactory building and pest inspection&rdquo; clause as standard — this gives you an additional contractual right to terminate beyond statutory cooling-off, usually with no penalty if exercised in writing within 7-14 days. Read your contract&apos;s Clause 30 carefully.</li>
      </ul>

      <h2>South Australia (SA)</h2>
      <ul>
        <li><strong>Statutory cooling-off period:</strong> 2 clear business days from the date the contract was made AND the &ldquo;Form 1&rdquo; vendor statement was received (whichever is later).</li>
        <li><strong>Auction:</strong> No cooling-off applies to auction purchases.</li>
        <li><strong>Penalty to walk away:</strong> None. SA buyers can rescind during cooling-off at zero cost.</li>
        <li><strong>How you exercise it:</strong> Written notice to the vendor before the end of the cooling-off period.</li>
        <li><strong>Building inspection timing:</strong> 2 business days is the tightest window in Australia. The Form 1 disclosure includes a lot of property-specific information that requires reading carefully on Day 1.</li>
        <li><strong>SA-specific practical play:</strong> Because cooling-off is so short, SA buyers should commission the building inspection IMMEDIATELY upon contract signing (or ideally before). Most Adelaide inspectors can deliver within 24 hours if booked at short notice.</li>
      </ul>

      <h2>Western Australia (WA)</h2>
      <ul>
        <li><strong>Statutory cooling-off period:</strong> None. WA is the only Australian state with no statutory cooling-off period for residential property purchases.</li>
        <li><strong>Auction:</strong> Same as any other sale — no cooling-off.</li>
        <li><strong>Penalty to walk away outside contract clauses:</strong> Forfeit your full deposit (typically 10% of purchase price). For a $700K Perth property: $70,000.</li>
        <li><strong>WA-specific protection:</strong> Most WA contracts include &ldquo;subject to satisfactory building inspection&rdquo; and &ldquo;subject to finance&rdquo; clauses as standard, usually with 7-14 day windows. These give you contractual rather than statutory escape rights.</li>
        <li><strong>Building inspection timing:</strong> Without statutory cooling-off, the &ldquo;subject to building inspection&rdquo; clause IS your cooling-off — read its exact wording carefully. The clause must say &ldquo;subject to a building inspection report SATISFACTORY TO THE PURCHASER&rdquo; for you to have meaningful walk-away rights. Without the &ldquo;satisfactory to the purchaser&rdquo; language, you can only terminate if the report finds major structural defects defined narrowly in the contract.</li>
      </ul>

      <h2>Australian Capital Territory (ACT)</h2>
      <ul>
        <li><strong>Statutory cooling-off period:</strong> 5 business days from contract exchange.</li>
        <li><strong>Auction:</strong> No cooling-off applies to auction purchases or properties sold within 5 business days of a scheduled auction.</li>
        <li><strong>Penalty to walk away:</strong> 0.25% of purchase price.</li>
        <li><strong>How you exercise it:</strong> Written notice to vendor or their representative.</li>
        <li><strong>ACT-specific feature:</strong> Vendors must provide a pre-contract building and pest inspection report (commissioned by the vendor) under the ACT Conveyancing Act 2001. You should commission your OWN independent inspection regardless — the vendor&apos;s report has obvious bias risks.</li>
      </ul>

      <h2>Tasmania (TAS)</h2>
      <ul>
        <li><strong>Statutory cooling-off period:</strong> None. TAS, like WA, has no statutory cooling-off.</li>
        <li><strong>Contractual protection:</strong> The standard REIT (Real Estate Institute of Tasmania) contract includes &ldquo;subject to building inspection&rdquo; and &ldquo;subject to finance&rdquo; clauses as default, typically with 7-21 day windows.</li>
        <li><strong>Auction:</strong> Same as any sale — no cooling-off.</li>
        <li><strong>Building inspection timing:</strong> Whatever timeframe is written into your contract&apos;s building inspection clause is your effective cooling-off window. Read it carefully.</li>
      </ul>

      <h2>Northern Territory (NT)</h2>
      <ul>
        <li><strong>Statutory cooling-off period:</strong> 4 business days from contract acceptance.</li>
        <li><strong>Auction:</strong> No cooling-off for auction purchases.</li>
        <li><strong>Penalty to walk away:</strong> Forfeit any deposit paid (typically just an initial holding deposit, not the full 10%).</li>
        <li><strong>How you exercise it:</strong> Written notice to vendor or agent.</li>
      </ul>

      <h2>How to actually use the time inside cooling-off</h2>
      <p>
        Knowing your statutory window is just the start. Inside the
        cooling-off period, here&apos;s what you should be doing every
        day:
      </p>
      <ul>
        <li>
          <strong>Day 1 — Inspections commissioned, report ordered.</strong>{' '}
          Confirm your building inspector and (separate) pest
          inspector are coming. Order the bank&apos;s formal valuation
          if your finance approval depends on it.
        </li>
        <li>
          <strong>Day 2 — Property visit and inspection day.</strong>{' '}
          Ideally you&apos;re at the property with the inspector. They
          let you in on what they&apos;re finding as they go. Take notes.
        </li>
        <li>
          <strong>Day 3 — Reports received, triage.</strong> Read both
          the AS4349.1 building report and the AS4349.3 pest report.
          Identify any &ldquo;further investigation recommended&rdquo;
          items and book specialists immediately.{' '}
          <Link href="/resources/what-to-do-if-building-inspection-finds-major-problems">
            The decision framework here walks through exactly how to
            triage the findings
          </Link>.
        </li>
        <li>
          <strong>Day 4 — Specialist follow-ups + cost it.</strong>{' '}
          Get structural engineer / damp specialist / electrician /
          pest specialist quotes for every flagged item. Add up
          documented rectification cost.
        </li>
        <li>
          <strong>Day 5 (if NSW/QLD/ACT) — Decision.</strong> Apply
          the 5% rule:{' '}
          <Link href="/resources/how-much-to-negotiate-after-building-inspection">
            our negotiation framework here
          </Link>.{' '}
          Negotiate, walk, or proceed.
        </li>
      </ul>
      <p>
        For VIC (3 days) or SA (2 days) buyers: compress everything by
        starting the inspector booking BEFORE you sign the contract.
        The clock is too tight to start booking on Day 1.
      </p>

      <h2>The auction trap (and how to avoid it)</h2>
      <p>
        Every Australian state waives cooling-off at auction. This
        means the moment your bid is accepted with the auctioneer&apos;s
        gavel, you have a fully binding unconditional contract — and
        the building inspection is no longer a negotiation tool, just
        an information tool for what you&apos;ve already bought.
      </p>
      <p>
        Practical play for auction buyers: <strong>commission the
        building and pest inspection BEFORE auction day.</strong> Yes,
        you might spend $500 on a property you don&apos;t end up buying.
        That&apos;s the cost of doing business at AU auctions. The
        alternative — bidding blind on a $1M+ purchase — is the most
        expensive mistake first-home buyers make in Australia.
      </p>
      <p>
        Most inspectors will do a pre-auction inspection for $50-$100
        more than standard. Some vendors provide a pre-auction
        inspection report (commissioned by them) — treat these as
        useful but not definitive; the inspector is being paid by the
        seller, so the wording is usually softened. Get your own
        independent inspection wherever possible.
      </p>

      <h2>How Report Decoded fits</h2>
      <p>
        The thing that takes most buyers from &ldquo;the report is in
        my inbox&rdquo; to &ldquo;I know exactly what to do&rdquo; is
        time they don&apos;t have inside a 2-5 business day cooling-off
        window. Report Decoded compresses that decision into 2 minutes:
        upload your AS4349.1 building report PDF, get a plain-English
        verdict, defect-by-defect repair cost estimates, the right
        specialist trade to call for each &ldquo;further investigation
        recommended&rdquo; item, and a drafted negotiation letter you
        can edit and send. $39 per report. No subscription. Full
        refund if the analysis can&apos;t anchor every claim to a
        specific page of the inspector&apos;s PDF.
      </p>
      <p>
        Whether you use Report Decoded or do the decoding yourself,
        the key point is this: <strong>cooling-off is the only chance
        you get to act on inspection findings without forfeiting your
        full deposit</strong>. Whatever you do inside it matters more
        than anything else in the purchase process.
      </p>
    </ArticleLayout>
  );
}
