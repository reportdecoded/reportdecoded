import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('hidden-costs-buying-house-australia-2026');

const faqs = [
  {
    q: 'How much do I actually need beyond the deposit to buy a house in Australia?',
    a: 'Budget $8,000-$15,000 beyond the deposit for an average AU purchase under $800,000, and $15,000-$30,000+ above $800,000 (mostly because of stamp duty scaling). The biggest line items are stamp duty (varies $0-$50K+ depending on price + state + FHB status), conveyancing + disbursements ($1,500-$3,500), building & pest inspection ($550-$750), lender setup fees + valuation ($800-$1,500), Lenders Mortgage Insurance if borrowing >80% ($3,000-$25,000), and home/contents insurance starter ($800-$2,000). Apartment buyers add a strata report ($300-$500). New-build buyers may add a Practical Completion Inspection ($550-$750). Most buyers also leave $5,000-$15,000 in a post-settlement repair buffer for issues the inspection surfaced.',
  },
  {
    q: 'Can I roll any of these costs into my mortgage?',
    a: 'Some, not all. LMI is typically capitalised into the loan (added to the borrowed amount, not paid upfront). Stamp duty can sometimes be borrowed against (if your LVR allows) — but most lenders prefer you pay it from savings. Conveyancing, building & pest, lender setup, and insurance are upfront cash costs and cannot be rolled into the loan. That means your "cash needed at settlement" is: deposit + stamp duty (typically) + conveyancing + inspection + lender setup + insurance + buffer = significantly more than just the deposit. A buyer with a $600K target purchase and a 10% deposit ($60K) typically needs an additional $35-55K cash on hand for a non-FHB purchase in most states.',
  },
  {
    q: 'Which costs can I negotiate or reduce?',
    a: 'Most of the upfront costs are NEGOTIABLE within bounds: conveyancing quotes vary 2-3x for the same scope (always get 3 quotes), building & pest can sometimes be cheaper if you book inspector directly rather than through agent\'s referral list, lender setup fees can sometimes be waived if you have a strong mortgage broker, home insurance shop around at least 5 providers (savings of $400+/yr are common). What\'s NOT negotiable: stamp duty (state set), LMI (lender set, formula-driven), council rates adjustment at settlement (statutory), Section 32/contract preparation cost on vendor side. What you CAN do for stamp duty: time the purchase to take advantage of FHB concessions if eligible, or buy under threshold prices in your state.',
  },
  {
    q: 'What\'s the most commonly underestimated cost?',
    a: 'Three tie for first place: (1) Stamp duty — buyers see "estimated stamp duty $24,000" on the calculator and assume that\'s exact; the actual figure can be 5-10% higher due to land transfer fees, mortgage registration fees, and other state-specific add-ons that calculators omit. (2) Conveyancer disbursements — these are pass-through costs (title searches, council certificates, water authority searches, etc.) on top of the conveyancing quote, typically $400-$1,200 not always included in the "fixed fee" quote. (3) Post-settlement repair budget — buyers focus on the purchase number and forget the building inspection identified $8,000 in deferred maintenance. The first 12 months in any AU house typically requires $3,000-$10,000 in repairs the previous owner didn\'t do.',
  },
  {
    q: 'Are first-home buyer concessions actually worth claiming?',
    a: 'Yes, when eligible — sometimes by a LOT. Each state runs its own FHB program: VIC stamp duty exemption for purchases under $600K + concession to $750K; NSW exemption under $800K + concession to $1M (for new builds); QLD concession + transfer duty exemption to $800K; SA stamp duty exemption for new builds to $650K; WA exemption to $530K + concession to $640K; ACT discount for under threshold; TAS 50% discount on stamp duty for new builds to $500K. Specific eligibility depends on property type (new vs established), price, residency intent, prior ownership, and citizenship. Worth confirming with your conveyancer BEFORE making an offer — the difference between qualifying and not can be $20K+.',
  },
  {
    q: 'Do I need a buffer above all these costs?',
    a: 'Yes — every conveyancer will tell you the same. Standard practice: keep at least $10,000-$20,000 in liquid reserves at settlement, regardless of how tight the deal looks. Real-world reasons: a lender valuation comes back low and you need to top up the deposit at the last minute; the building inspection surfaces a $15K issue you need to address pre-settlement; settlement gets delayed and you owe additional interest; the vendor leaves the property in worse condition than expected and you need to remediate before moving in. The buyers who get burned at settlement are the ones who allocated every dollar to the contract price + standard costs and have nothing in reserve for surprises.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Hidden costs of buying a house in Australia (2026): the full stack"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Most Australian buyers spend $8,000-$15,000 beyond
            the deposit before they get the keys</strong> — and
            $15,000-$30,000+ for purchases above $800K. Biggest
            line items: stamp duty (varies wildly by state + price +
            FHB status), conveyancing + disbursements{' '}
            <strong>$1,500-$3,500</strong>, building & pest{' '}
            <strong>$550-$750</strong>, lender setup + valuation{' '}
            <strong>$800-$1,500</strong>, LMI if borrowing
            {'>'}80% LVR <strong>$3,000-$25,000</strong>, home
            insurance <strong>$800-$2,000/yr</strong>. Apartments add
            a strata report. Most can&apos;t be rolled into the
            mortgage — they&apos;re upfront cash. Keep a{' '}
            <strong>$10,000-$20,000 buffer</strong> in reserves
            regardless.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'how-much-to-negotiate-after-building-inspection',
        'building-inspection-vs-pest-inspection-difference',
        'cooling-off-period-building-inspection-rights-by-state',
        'strata-report-explained-australia',
      ]}
      related_suburbs={[
        'brunswick',
        'newtown',
        'bondi',
        'toowong',
        'frankston',
      ]}
    >
      <p>
        You&apos;ve saved the deposit. You think you&apos;re ready. You
        sign the contract on a Thursday. By Monday morning, your
        conveyancer has emailed you about $1,640 in disbursements you
        hadn&apos;t budgeted for. The inspection invoice lands at $725.
        Stamp duty turns out to be $14,000 higher than the calculator
        suggested because the calculator didn&apos;t include the
        transfer registration fee. The lender wants $1,295 for their
        valuation. Home insurance for the first year is $1,840.
      </p>
      <p>
        Add it all up and most Australian buyers spend{' '}
        <strong>$8,000 to $15,000 beyond the deposit</strong> before
        they have the keys. For purchases above $800,000 that figure
        often pushes <strong>$15,000 to $30,000+</strong>, mostly
        because stamp duty scales aggressively.
      </p>
      <p>
        Here&apos;s the full cost stack — every line item, real 2026
        AU dollar ranges, what can be reduced or rolled into the
        loan, and which buffers to hold.
      </p>

      <h2>The big four — the costs that dominate</h2>

      <h3>1. Stamp duty (the biggest variable)</h3>
      <p>
        Stamp duty (formally &ldquo;transfer duty&rdquo; in most states)
        is the largest single non-deposit cost for most buyers. It&apos;s
        a percentage of the purchase price, with rates and concessions
        that vary dramatically by state and FHB status.
      </p>
      <p>
        Rough ranges for an established (not new-build) home with a
        non-FHB buyer:
      </p>
      <ul>
        <li>
          <strong>$500K purchase:</strong> $12,000-$22,000 stamp duty
          depending on state
        </li>
        <li>
          <strong>$700K purchase:</strong> $22,000-$38,000 depending on
          state
        </li>
        <li>
          <strong>$1M purchase:</strong> $40,000-$60,000 depending on
          state
        </li>
        <li>
          <strong>$1.5M purchase:</strong> $65,000-$90,000+ depending on
          state
        </li>
      </ul>
      <p>
        NSW and VIC have the highest rates above $1M. QLD, SA, and WA
        are generally lower. ACT has its own unique &ldquo;lease
        duty&rdquo; structure. NT is lowest. Each state also charges:
      </p>
      <ul>
        <li>
          <strong>Transfer registration fee:</strong> $150-$300 (often
          missing from online stamp duty calculators)
        </li>
        <li>
          <strong>Mortgage registration fee:</strong> $150-$250
        </li>
      </ul>
      <p>
        <strong>First-home buyer concessions</strong> can reduce stamp
        duty to $0 if you qualify and the purchase is under the
        threshold. Each state runs its own program — confirm
        eligibility with your conveyancer BEFORE making an offer. The
        difference between qualifying and not can be $20K+.
      </p>

      <h3>2. Lenders Mortgage Insurance (LMI)</h3>
      <p>
        If you&apos;re borrowing more than 80% of the property value,
        most lenders require LMI — a one-off insurance premium that
        protects the LENDER (not you) if you default. Cost is roughly:
      </p>
      <ul>
        <li>
          <strong>85% LVR:</strong> $3,000-$6,000 on a $600K purchase
        </li>
        <li>
          <strong>90% LVR:</strong> $8,000-$14,000 on a $600K purchase
        </li>
        <li>
          <strong>95% LVR:</strong> $15,000-$25,000 on a $600K purchase
        </li>
      </ul>
      <p>
        LMI scales with loan size + LVR + lender. It can usually be{' '}
        <strong>capitalised into the loan</strong> (added to your
        borrowing) rather than paid upfront — which means you don&apos;t
        need cash for it at settlement, but you do pay interest on it
        over the loan term.
      </p>
      <p>
        Some buyer cohorts can avoid LMI entirely: doctors, accountants,
        lawyers, and other &ldquo;low-risk professions&rdquo; (lender
        specific) can get 90%+ LVR without LMI. First-home buyers
        accessing the federal Home Guarantee Scheme can avoid LMI on
        eligible properties.
      </p>

      <h3>3. Conveyancing + disbursements</h3>
      <p>
        Conveyancing is the legal work of transferring property
        ownership — title searches, contract review, settlement
        coordination. Cost typically splits into:
      </p>
      <ul>
        <li>
          <strong>Conveyancer&apos;s professional fee:</strong>{' '}
          $700-$1,800 depending on conveyancer + complexity
        </li>
        <li>
          <strong>Disbursements (pass-through costs):</strong>{' '}
          $400-$1,200. Includes title searches, council rates
          certificate, water rates certificate, planning certificate
          (NSW Section 10.7 or VIC Section 32 review costs), strata
          search if apartment, owner-builder warranty insurance check,
          land tax certificate, etc.
        </li>
      </ul>
      <p>
        Combined: <strong>$1,500-$3,500 total</strong>. Always get
        3 conveyancing quotes specifying inclusions — the gap between
        cheap and expensive is often disbursements being quoted
        separately vs included.
      </p>

      <h3>4. Building & pest inspection</h3>
      <p>
        Standard{' '}
        <Link href="/resources/what-is-as4349-1">AS4349.1 building
        inspection</Link>{' '}
        + AS4349.3 pest inspection runs $550-$750 in most metro
        markets. Cheaper in regional, more expensive for unusual
        builds or large homes. See{' '}
        <Link href="/resources/building-inspection-vs-pest-inspection-difference">
          building vs pest inspection
        </Link>{' '}
        for what each covers.
      </p>
      <p>
        <strong>Apartment / strata-titled properties</strong> add a
        strata records inspection at $300-$500 — see{' '}
        <Link href="/resources/strata-report-explained-australia">
          strata report explained
        </Link>
        . Skip it at your peril.
      </p>
      <p>
        <strong>New builds</strong> add a Practical Completion
        Inspection at $550-$750.
      </p>

      <h2>The medium costs</h2>

      <h3>5. Lender setup fees + valuation</h3>
      <p>
        Most lenders charge:
      </p>
      <ul>
        <li>
          <strong>Application/establishment fee:</strong> $0-$800. Often
          waivable with a mortgage broker negotiation.
        </li>
        <li>
          <strong>Valuation fee:</strong> $300-$700. The lender sends
          a valuer to verify the property is worth what you&apos;re
          paying.
        </li>
        <li>
          <strong>Settlement/PEXA fees:</strong> $150-$300. Electronic
          settlement platform charge.
        </li>
        <li>
          <strong>Discharge fee on the seller&apos;s side:</strong> $300-$400.
          Sometimes you bear this if buying from a related party.
        </li>
      </ul>
      <p>
        Combined: typically $800-$2,000. A mortgage broker can often
        get application fees waived as part of negotiating your loan
        package.
      </p>

      <h3>6. Home + contents insurance</h3>
      <p>
        Insurance is required by your lender as a condition of
        settlement. Annual premiums:
      </p>
      <ul>
        <li>
          <strong>Standard home + contents:</strong> $800-$2,000/yr
          depending on location, building value, and contents value
        </li>
        <li>
          <strong>High flood/bushfire zones (NSW Northern Rivers, QLD
          coast, Vic East Gippsland):</strong> $3,000-$8,000/yr — often a
          deal-breaker if not factored in
        </li>
        <li>
          <strong>Heritage / weatherboard older stock:</strong> Premium
          loaded 15-30% above standard
        </li>
      </ul>
      <p>
        Shop around at least 5 providers. Compare excesses + inclusions
        carefully. The premium variance is enormous.
      </p>

      <h3>7. Council + water rates (pro-rata at settlement)</h3>
      <p>
        At settlement, you reimburse the vendor for any council rates
        and water authority charges they&apos;ve already paid covering
        the period after settlement date. Typically:
      </p>
      <ul>
        <li>
          <strong>Council rates pro-rata:</strong> $200-$1,500
          depending on settlement timing + council
        </li>
        <li>
          <strong>Water authority pro-rata:</strong> $50-$400
        </li>
        <li>
          <strong>Strata levies pro-rata (apartments):</strong>{' '}
          $0-$2,000+ depending on cycle + special levies
        </li>
      </ul>

      <h2>The often-missed costs</h2>

      <h3>8. Mortgage broker commission (usually free to you)</h3>
      <p>
        Most AU mortgage brokers are paid commission by the lender,
        not by you. Zero cost. BUT — make sure they declare the
        commission disclosure (legally required) so you can confirm
        no conflict of interest. Some &ldquo;fee for service&rdquo;
        brokers do charge: $500-$1,500. Worth asking upfront.
      </p>

      <h3>9. Conveyancing extras</h3>
      <p>
        Costs that hit when there are complications:
      </p>
      <ul>
        <li>
          <strong>Section 27 release of deposit (VIC):</strong>{' '}
          $200-$400 if you want early release of deposit to the vendor
        </li>
        <li>
          <strong>Caveat lodgement:</strong> $150-$500 if you need to
          protect your interest before settlement
        </li>
        <li>
          <strong>Contract amendment:</strong> $300-$800 if changes
          needed
        </li>
        <li>
          <strong>Settlement delay penalty:</strong> Interest charged
          by vendor if you push the date — usually 8-12% pa applied to
          balance over the delay period
        </li>
      </ul>

      <h3>10. Moving + setup</h3>
      <ul>
        <li>
          <strong>Removalist:</strong> $800-$3,000 depending on volume +
          distance
        </li>
        <li>
          <strong>Bond cleaning at previous rental:</strong> $200-$600
        </li>
        <li>
          <strong>Connection fees (electricity, gas, internet,
          water):</strong> $100-$500 combined
        </li>
        <li>
          <strong>New locks/security:</strong> $200-$800
        </li>
        <li>
          <strong>Initial property setup (curtains, basic
          furniture):</strong> $0-$20,000+ depending on your situation
        </li>
      </ul>

      <h2>The buffer you should hold (and why)</h2>
      <p>
        Standard professional advice: hold{' '}
        <strong>$10,000-$20,000 in liquid reserves at settlement</strong>,
        regardless of how tight the deal looks. Real-world reasons it
        gets used:
      </p>
      <ul>
        <li>
          <strong>Low valuation</strong> — lender values the property
          below contract price; you have to top up the deposit at the
          last minute
        </li>
        <li>
          <strong>Inspection-driven repair</strong> — building
          inspection surfaces a structural issue that needs urgent
          rectification pre-settlement
        </li>
        <li>
          <strong>Settlement delay interest</strong> — vendor delay
          costs you 8-12% pa on contract balance for each day
        </li>
        <li>
          <strong>Vendor leaves property poorly</strong> — appliance
          missing, damage not declared, removal of fixtures you thought
          were included
        </li>
        <li>
          <strong>Surprise repair within 30 days</strong> — first month
          in any AU house typically requires $1,000-$5,000 in
          immediate fixes
        </li>
      </ul>
      <p>
        See{' '}
        <Link href="/resources/what-to-do-if-building-inspection-finds-major-problems">
          what to do if building inspection finds major problems
        </Link>{' '}
        for the deeper framework on managing pre-settlement defect
        rectification.
      </p>

      <h2>Worked examples</h2>

      <h3>Example A — Melbourne first-home buyer</h3>
      <ul>
        <li>Purchase: $580,000 (under VIC FHB threshold)</li>
        <li>Deposit: $58,000 (10%)</li>
        <li>Stamp duty: $0 (FHB exemption under $600K) ✓</li>
        <li>Conveyancing + disbursements: $1,900</li>
        <li>Building & pest: $650</li>
        <li>Lender setup + valuation: $700</li>
        <li>LMI (capitalised, paid via loan): not cash needed</li>
        <li>Council/water pro-rata: $600</li>
        <li>Home + contents insurance (paid annually): $1,200</li>
        <li>Moving + setup: $1,800</li>
      </ul>
      <p>
        <strong>Total cash needed beyond deposit: ~$6,850.</strong>{' '}
        Plus $58K deposit = $64,850 total. Plus $10-20K buffer = $75-85K
        all-in cash at settlement.
      </p>

      <h3>Example B — Sydney mid-market non-FHB</h3>
      <ul>
        <li>Purchase: $1,150,000</li>
        <li>Deposit: $230,000 (20%)</li>
        <li>Stamp duty: $50,710 (NSW)</li>
        <li>Conveyancing + disbursements: $2,800</li>
        <li>Building & pest: $750</li>
        <li>Strata report: $400 (apartment)</li>
        <li>Lender setup + valuation: $1,400</li>
        <li>LMI: $0 (20% deposit)</li>
        <li>Council/water/strata pro-rata: $1,500</li>
        <li>Home + contents insurance: $1,400</li>
        <li>Moving + setup: $2,500</li>
      </ul>
      <p>
        <strong>Total cash needed beyond deposit: ~$61,460.</strong>{' '}
        Plus $230K deposit = $291,460 at settlement. Buffer adds
        another $10-20K to that. Total ~$300-310K cash on hand needed
        for a $1.15M purchase.
      </p>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded handles one of these line items — the building
        & pest inspection analysis ($59 per report). When your
        inspector&apos;s 50-100 page PDF lands, you upload it to
        Report Decoded and 2 minutes later you have a plain-English
        defect summary, cost-banded rectification estimates, and a
        drafted negotiation letter. See{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          how much to negotiate after a building inspection
        </Link>{' '}
        for the negotiation framework.
      </p>
      <p>
        It doesn&apos;t replace your inspector ($550-$750 — non-
        negotiable), conveyancer ($1,500-$3,500 — non-negotiable), or
        broker (free — non-negotiable). It replaces the 2-4 hours
        you&apos;d otherwise spend reading the PDF and trying to
        translate &ldquo;drummy render to lower wing wall
        plaster&rdquo; into &ldquo;is this a $500 fix or a $15,000
        fix?&rdquo;
      </p>
      <p>
        For most AU buyers, that translation is the difference
        between negotiating $20,000 off the price and missing it
        entirely.
      </p>
    </ArticleLayout>
  );
}
