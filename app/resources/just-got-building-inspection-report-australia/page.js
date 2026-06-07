import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('just-got-building-inspection-report-australia');

const faqs = [
  {
    q: 'How long should it take to read a building inspection report?',
    a: 'A thorough reading of a 60-100 page AS4349.1 report takes most buyers 2-4 hours if they read every page. But the decision-relevant content — Major Defects, Significant Defects, and the Summary — is typically 10-15 pages and takes 30-45 minutes. Focus there first. The area-by-area section at the back largely repeats what the defects sections already told you.',
  },
  {
    q: "My report says 'further investigation recommended' — is that bad?",
    a: "It depends on what triggered the recommendation. Inspectors use this phrase when they can see evidence of a problem but can't fully assess it without destructive access (opening walls, lifting flooring) or a specialist. Common triggers include: suspected termite activity, inaccessible subfloor, roof space with signs of moisture, or electrical and plumbing concerns beyond their scope. One 'further investigation' flag in a 20-year-old home is normal. Three or more, or one relating to structure or termites, warrants serious attention before you proceed.",
  },
  {
    q: 'Can I use the building inspection to negotiate the price down?',
    a: 'Yes — and it works more often than most buyers expect. Agents report that 70% or more of properly documented negotiation requests get at least partial acceptance from vendors. The key word is documented. A vague request to &ldquo;come down because of the report&rdquo; rarely lands. A written request citing specific defects, specific rectification costs at current trade rates, and a specific dollar figure is taken seriously. Your inspector&apos;s report lists the defects — but it almost never includes cost estimates. That&apos;s the gap you need to fill before you can negotiate effectively.',
  },
  {
    q: 'What if my cooling-off period ends before I can get the report analysed?',
    a: 'This is a real risk and it happens more than people realise. Getting three separate tradie quotes for the defects in your report typically takes 5-7 business days — longer than cooling-off in most states. Your options are: (1) Ask your conveyancer or solicitor whether cooling-off can be extended by agreement with the vendor (sometimes possible, rarely guaranteed). (2) Use Report Decoded ($59, under 2 minutes) to get cost estimates and a negotiation letter immediately, then call your conveyancer with specific figures rather than waiting for tradies. (3) Proceed without cost estimates and negotiate later — which weakens your position considerably.',
  },
  {
    q: "My conveyancer says the report looks fine — should I trust that?",
    a: "Your conveyancer is a legal expert, not a building expert. When they say a report &ldquo;looks fine&rdquo; they typically mean there are no findings so severe they&apos;d recommend you walk away on legal grounds. They are not assessing whether the $18,000 in deferred maintenance is acceptable at the purchase price, or whether the failed waterproofing in the ensuite is a $4,000 or a $22,000 problem. Both assessments are valid — they&apos;re just answering different questions. Trust your conveyancer on the contract and legal risk. Get a separate opinion on the cost and condition risk.",
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Just got your building inspection report? Here&apos;s what to do first (Australia)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            Your building inspection report is 60-100 pages — but only 10-15 pages are actually decision-relevant. Read <strong>Major Defects first</strong>, then get cost estimates (the report won&apos;t include them — that&apos;s by design), then decide: proceed, negotiate, or walk away. If you&apos;re in cooling-off, you have <strong>3-5 business days depending on your state</strong> — here is the fastest path through it.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'how-to-read-as4349-1-inspection-report',
        'building-inspection-report-no-cost-estimates-australia',
        'how-much-to-negotiate-after-building-inspection',
        'building-inspection-negotiation-letter-template-australia',
      ]}
      related_suburbs={[
        'melbourne',
        'sydney',
        'brisbane',
        'perth',
        'adelaide',
      ]}
    >
      <p>
        The PDF just arrived. It&apos;s 85 pages. Cooling-off ends in three business days. You don&apos;t know what &ldquo;drummy render&rdquo; means. Your conveyancer has seen it but hasn&apos;t called back yet. Your partner wants to know if it&apos;s a deal-breaker. Your agent is already asking when you want to proceed.
      </p>
      <p>
        This is the moment most Australian buyers make expensive mistakes — either panicking and walking away from a manageable property, or proceeding blind without understanding what the defects will actually cost to fix. Here is the exact sequence, step by step.
      </p>

      <h2>Step 1 — Don&apos;t read it cover-to-cover (yet)</h2>
      <p>
        Australian building inspection reports are prepared under the AS4349.1 standard. That standard requires inspectors to document every observable condition across every accessible area of the property. The result is thorough, methodical, and — for a first-time reader under time pressure — genuinely overwhelming.
      </p>
      <p>
        Here is what the report actually contains and how to navigate it:
      </p>
      <ul>
        <li><strong>Pages 1-7 (approximately): Boilerplate</strong> — Methodology, Statement of Limitations, Scope of Inspection, Inspector Credentials. Read this once to understand what was and wasn&apos;t inspected (subfloor accessible? Roof space entered?). Then move on.</li>
        <li><strong>Pages 8-20 (approximately): Major Defects</strong> — This is your first stop. Major defects are defined as defects that are likely to be dangerous, prevent use of the building, or require significant remediation if left unattended. Start here every time.</li>
        <li><strong>Significant Defects section</strong> — Read this second. These are conditions that are beyond normal wear and tear and require attention, but don&apos;t meet the Major threshold.</li>
        <li><strong>Minor Defects section</strong> — Read third. These are maintenance items normal for the property&apos;s age.</li>
        <li><strong>Area-by-area summary (last 30-40 pages)</strong> — This section lists every room and area with its condition. It is comprehensive and repetitive. Almost everything significant in it has already appeared in the defect sections above. Save this for later, once you have made your decision and need to understand the full scope of work.</li>
      </ul>
      <p>
        The goal of your first pass is to get a clear picture of the Major and Significant defects. That typically takes 30-45 minutes of focused reading, not four hours.
      </p>

      <h2>Step 2 — Triage the defects into three buckets</h2>
      <p>
        Once you have read the Major and Significant sections, sort everything you found into three buckets. This is the most important thinking work you will do.
      </p>
      <p>
        <strong>Bucket 1 — Potential deal-breakers:</strong>
      </p>
      <ul>
        <li><strong>Active termite activity</strong> or evidence of current infestation (not just old damage)</li>
        <li><strong>Major structural failure</strong> — cracked or compromised footings, significant movement in load-bearing walls, subsidence</li>
        <li><strong>Fire safety hazards</strong> — non-compliant or absent fire separation in dual-occupancy or units</li>
        <li><strong>Friable asbestos</strong> (loose, powdery, or damaged asbestos-containing materials — different from intact bonded asbestos)</li>
        <li><strong>Illegal structures</strong> — major additions built without permits that cannot be retrospectively approved</li>
      </ul>
      <p>
        If any of these appear in your report, call your solicitor or conveyancer immediately — before you do anything else. These findings may change the legal and financial calculus of the purchase entirely. Don&apos;t try to cost these yourself first.
      </p>
      <p>
        <strong>Bucket 2 — Negotiate on these:</strong>
      </p>
      <ul>
        <li><strong>Failed waterproofing</strong> in bathrooms, wet areas, or balconies</li>
        <li><strong>Roof at or near end of life</strong> — tile cracking, significant valley iron deterioration, aged metal roofing</li>
        <li><strong>Failed flashings</strong> — around chimneys, skylights, parapet walls</li>
        <li><strong>Significant cracking</strong> — stair-step cracking in brick, wide cracking in renders or plasterwork indicating movement</li>
        <li><strong>Non-compliant smoke alarms</strong> (required to be rectified on sale in QLD, VIC, and other states)</li>
        <li><strong>Non-compliant renovations</strong> — unapproved additions, decks, or alterations</li>
        <li><strong>Significant timber decay</strong> in structural or semi-structural members</li>
      </ul>
      <p>
        These items belong in your negotiation letter. They are real costs that the vendor may not have priced into the sale figure.
      </p>
      <p>
        <strong>Bucket 3 — Accept or plan for future maintenance:</strong>
      </p>
      <ul>
        <li>Minor cosmetic cracks in plasterwork or render (hairline, non-movement)</li>
        <li>Gutter debris and minor gutter maintenance</li>
        <li>Minor paint deterioration on external surfaces</li>
        <li>Ageing caulking around windows or wet areas</li>
        <li>Tap washers, minor drainage flow issues, general wear</li>
      </ul>
      <p>
        These items are normal for virtually any established Australian home. Including them in a negotiation request weakens your position — they signal to the vendor&apos;s agent that you are an inexperienced buyer reaching for anything. Focus your negotiation entirely on Bucket 2.
      </p>

      <h2>Step 3 — The number your report is missing</h2>
      <p>
        Here is something most buyers don&apos;t find out until they are already frustrated: the AS4349.1 standard does <strong>not</strong> require building inspectors to include cost estimates in their reports. This is documented guidance from NSW Fair Trading and equivalent state bodies across Australia. It is not an oversight. It is intentional — inspectors are not quantity surveyors or licensed tradespersons, and the standard sensibly keeps those roles separate.
      </p>
      <p>
        What this means in practice: your 90-page report lists 14 defects and contains zero dollar figures. You know the failed bathroom waterproofing is a &ldquo;Major Defect requiring urgent attention.&rdquo; You do not know if that means $3,500 or $28,000.
      </p>
      <p>
        That gap is the core problem. You cannot negotiate without numbers. You cannot make a rational proceed-or-walk decision without numbers. And you have three business days.
      </p>
      <p>
        Your options for filling that gap:
      </p>
      <ul>
        <li><strong>Get tradies in for quotes yourself</strong> — The right approach if you have time. A waterproofer, a roofer, and a builder each coming to the property to quote will typically take 5-7 business days minimum. That is longer than cooling-off in most Australian states.</li>
        <li><strong>Ask your conveyancer</strong> — They can ballpark common items from experience, and it is worth asking. But they are not tradespersons, and they will appropriately hedge. You will get a range, not a figure you can put in a negotiation letter.</li>
        <li><strong>Use <Link href="/">Report Decoded</Link></strong> — Upload your PDF for $59. In under 2 minutes you receive every defect explained in plain English, every defect priced at 2026 Australian trade rates, and a negotiation letter already drafted and ready to send to the vendor&apos;s agent. That gives you the numbers you need to act today — within cooling-off, with specific figures, with something your conveyancer can work with.</li>
      </ul>
      <p>
        The cost estimates are the unlock. Everything else — the negotiation, the decision, the conversation with your solicitor — flows from having actual numbers attached to each defect.
      </p>

      <h2>Step 4 — Build your negotiation number</h2>
      <p>
        Once you have cost estimates for your Bucket 2 items, the negotiation arithmetic is straightforward.
      </p>
      <p>
        Add up the rectification costs for every item in your negotiation bucket. Then apply a <strong>20-30% contingency</strong> on top. This contingency exists because building work almost always uncovers additional scope once walls are opened or roofing is lifted — your inspector has documented what they could observe, not what lies behind surfaces. A 20-30% buffer is conservative and defensible.
      </p>
      <p>
        The total becomes your negotiation figure. You can present it as a price reduction request (&ldquo;We are seeking a $X reduction in the purchase price to reflect the cost of rectifying the defects identified in the inspection report&rdquo;) or as a vendor-rectify request (&ldquo;We request the vendor rectify the following items prior to settlement at their cost&rdquo;). Price reductions are generally easier to execute and more commonly accepted.
      </p>
      <p>
        For a detailed walkthrough of drafting the letter itself, see our guide on <Link href="/resources/building-inspection-negotiation-letter-template-australia">building inspection negotiation letters</Link> and our article on <Link href="/resources/how-much-to-negotiate-after-building-inspection">how much to negotiate after a building inspection</Link>.
      </p>

      <h2>Step 5 — Make the decision</h2>
      <p>
        With your triage complete and your cost estimates in hand, the decision comes down to three outcomes:
      </p>
      <ul>
        <li><strong>Proceed</strong> — Major defects are within the normal range for the property&apos;s age and construction type, total rectification cost is acceptable relative to the purchase price and the market, and no Bucket 1 deal-breakers are present. You proceed, potentially with a maintenance plan for the Bucket 2 items budgeted into your first year.</li>
        <li><strong>Negotiate</strong> — There are clear Bucket 2 items with quantifiable costs that the purchase price has not accounted for. You present a documented request. Most buyers underestimate how often this works: agents consistently report that 70% or more of properly documented negotiation requests — citing specific defects, specific costs, specific figures — receive at least partial acceptance from vendors. The vendor has already accepted you as a buyer. Re-listing carries its own risks and costs for them.</li>
        <li><strong>Walk away</strong> — Bucket 1 findings are present, the vendor will not negotiate, or the total cost of the Bucket 2 defects makes the purchase unviable at any price the vendor will accept. Walking during cooling-off means forfeiting your cooling-off fee (typically 0.25% of the purchase price in most states) — a significant but often rational cost when the alternative is a financially damaging purchase.</li>
      </ul>
      <p>
        The majority of purchases with inspection reports land in &ldquo;negotiate.&rdquo; Very few are genuinely &ldquo;walk.&rdquo; But you cannot make that call confidently without knowing what things cost.
      </p>

      <h2>If you&apos;re in cooling-off right now</h2>
      <p>
        Cooling-off periods vary by state and the clock is running from exchange:
      </p>
      <ul>
        <li><strong>Victoria:</strong> 3 clear business days</li>
        <li><strong>New South Wales:</strong> 5 business days</li>
        <li><strong>Queensland:</strong> 5 business days</li>
        <li><strong>South Australia:</strong> 2 clear business days</li>
        <li><strong>Western Australia &amp; Tasmania:</strong> No statutory cooling-off for standard residential contracts (some limited protections exist — confirm with your solicitor)</li>
      </ul>
      <p>
        If you are in Victoria or South Australia, your window is tight. Do not wait for tradespeople. Do not wait for your conveyancer to call back unprompted.
      </p>
      <p>
        The fastest path: <strong>Upload your report to Report Decoded now</strong> ($59). In under 2 minutes you will have your defects explained, your costs estimated at 2026 AU trade rates, and your negotiation letter drafted. Then call your conveyancer with specific dollar figures — &ldquo;the inspection has identified $22,000 in rectification work, here is the breakdown&rdquo; — rather than &ldquo;the report has some things in it and I&apos;m not sure.&rdquo; Specific figures make the conversation shorter, clearer, and more actionable.
      </p>
      <p>
        If you genuinely need more time and you are not in WA or TAS, ask your conveyancer whether the cooling-off period can be extended by mutual agreement with the vendor. This is not always possible but it is sometimes granted, particularly if you can demonstrate you are proceeding in good faith and simply need time to get specialist quotes.
      </p>

      <h2>What Report Decoded gives you</h2>
      <p>
        When you upload your building inspection PDF to <Link href="/">Report Decoded</Link>, you receive:
      </p>
      <ul>
        <li><strong>A plain-English verdict</strong> — Proceed, Negotiate, or Walk Away — based on the defect profile in your specific report</li>
        <li><strong>Every defect explained in plain English</strong> — no jargon, no &ldquo;drummy render&rdquo; without explanation, no undefined trade terms</li>
        <li><strong>Cost estimates in 2026 Australian dollars</strong> — every Bucket 2 and Major defect priced at current trade rates for your state</li>
        <li><strong>A drafted negotiation letter</strong> — ready to copy and send to the vendor&apos;s agent today, with the specific defects and costs already populated</li>
        <li><strong>Local tradie contacts</strong> for the major defect categories, so you know who to call for rectification quotes or further investigation</li>
        <li><strong>Every finding cited back to the page in your inspector&apos;s PDF</strong> — so you can verify everything against the source document</li>
      </ul>
      <p>
        The report your inspector provided is thorough, professional, and exactly what AS4349.1 requires. What it doesn&apos;t include — by design and by standard — is the cost context you need to make decisions. That&apos;s the gap Report Decoded fills.
      </p>
      <p>
        If for any reason your PDF cannot be analysed, you get a full refund. No exceptions, no questions.
      </p>
      <p>
        You have the report. You have the cooling-off window. The question is whether you use it with the full picture or without it.
      </p>
    </ArticleLayout>
  );
}
