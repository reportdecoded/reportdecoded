import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('non-compliant-renovations-building-inspection-australia');

const faqs = [
  {
    q: 'Does the vendor have to tell me about non-compliant renovations?',
    a: 'Vendor disclosure obligations vary by state. Victoria (Section 32) and South Australia have the strongest requirements, where vendors must disclose known non-compliant structures. In NSW, the rules differ and disclosure is less comprehensive. Regardless of state, your conveyancer should specifically ask the vendor to confirm whether building permits exist for any visible additions, decks, carports, or extensions. If a vendor knowingly conceals non-compliant work and you discover it after purchase, you may have legal recourse — but enforcement and remedies vary significantly by jurisdiction.',
  },
  {
    q: 'Can I back out of a sale because of non-compliant renovations?',
    a: 'It depends on the contract and the state you are buying in. If you are still within a cooling-off period, you can generally withdraw (with a small penalty). After exchange, your ability to exit depends on whether the contract contains special conditions around building inspections or council compliance. If the non-compliance is severe — for example, a large unapproved extension in breach of boundary setbacks — your conveyancer may be able to argue the vendor is in breach of their disclosure obligations. Always get legal advice specific to your contract and state before making any decision to withdraw.',
  },
  {
    q: 'What is indemnity insurance for non-compliant structures?',
    a: 'Non-compliant structure indemnity insurance (also called building indemnity or compliance indemnity insurance) is a one-time premium policy that provides financial protection if a council takes enforcement action against an unapproved or non-compliant structure on the property. It does not fix the compliance issue, and it does not mean the structure is approved — it simply means you have cover if the council requires demolition or rectification work. Premiums typically range from $500 to $2,000 depending on the structure, its value, and the insurer. Your conveyancer can arrange this as part of settlement.',
  },
  {
    q: 'How do I find out if a building permit exists for a renovation?',
    a: 'Your conveyancer can submit a formal request to the local council for a copy of all building permits and occupancy certificates associated with the property. This is sometimes called a Section 10.7 certificate (NSW), a building information certificate request, or a planning and building records search depending on the state. Private building certifiers who issued permits also hold records, but the council is the primary source. Turnaround times vary — typically 5 to 15 business days. If no permits are on file for visible additions or renovations, that is strong evidence the work was never approved.',
  },
  {
    q: 'My deck has no permit — will the council definitely come after me?',
    a: 'Not necessarily, but the risk is real and ongoing. Councils rarely conduct proactive audits of every property, but enforcement is most commonly triggered by: a neighbour complaint, a sale transaction (some councils check records when a property is sold), a subsequent development application on the property, or an insurance claim that draws attention to the structure. If you buy without addressing it, the risk never disappears — it transfers to you and remains until the structure is regularised, demolished, or the council formally acknowledges it. Getting retrospective approval where possible is the cleanest way to eliminate the risk.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Non-compliant renovations found in your building inspection: what it means and what to do (Australia)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            &ldquo;Non-compliant renovation&rdquo; or &ldquo;no evidence of council permit&rdquo; on a building inspection report means work was done without proper council approval. As a buyer, you <strong>inherit this liability</strong> — including potential council enforcement, insurance exclusions, and future resale complications. This is one of the defect types with the strongest negotiation leverage. Here&apos;s what your legal exposure is and how to handle it.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'how-to-read-as4349-1-inspection-report',
        'just-got-building-inspection-report-australia',
        'electrical-safety-building-inspection-australia',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={[
        'doncaster',
        'campbelltown',
        'sunnybank',
        'wanneroo',
        'glenelg',
      ]}
    >
      <p>
        Your building inspection report has flagged a deck, carport, bathroom renovation, or extension with language like &ldquo;no evidence of building permit&rdquo; or &ldquo;appears to have been constructed without council approval.&rdquo; You might be tempted to treat this the same way you&apos;d treat a leaking roof or a cracked tile — as a repair cost to negotiate. It isn&apos;t. Non-compliant work is a different category of problem, because it carries <strong>legal liability</strong>, not just a repair bill. Here&apos;s exactly what you&apos;re dealing with, and what your options are before you commit to buying.
      </p>

      <h2>What &ldquo;non-compliant&rdquo; and &ldquo;unapproved work&rdquo; actually means</h2>
      <p>
        In Australia, building work above a certain cost or complexity threshold requires a building permit before work starts and an inspection certificate or occupancy certificate after work completes. These thresholds vary by state and territory — but as a general rule, any structural work, any addition that creates new floor area, any deck more than 1 metre above ground level, and any plumbing or electrical work requires a licensed tradesperson and formal approval.
      </p>
      <p>
        When your inspector writes &ldquo;no evidence of permit,&rdquo; they are telling you they found no documentation, no council records visible, and no compliance plate or certificate attached to the structure. This could mean several things: no permit was ever obtained, a permit was obtained but records have been lost or not passed on, or the work is old enough that records have been archived or destroyed. The inspector cannot definitively determine which — that requires a formal council records search.
      </p>
      <p>
        &ldquo;Non-compliant&rdquo; is a related but distinct problem. It means the work <em>appears</em> to not meet the requirements of the National Construction Code (NCC, formerly called the BCA) or local council requirements — regardless of whether a permit exists. A deck can have a permit but still be non-compliant if it was built differently from the approved plans, or if code requirements changed after the permit was issued. These two issues often appear together, but they don&apos;t always.
      </p>

      <h2>The four types of non-compliant work most commonly found in Australian building inspections</h2>

      <p>
        <strong>Decks and patios</strong> are the single most common non-compliant finding in Australian building inspections. A widespread misconception among homeowners is that &ldquo;small&rdquo; decks don&apos;t need permits. In reality, thresholds vary by state — in many jurisdictions, any deck over 3 square metres or higher than 1 metre above natural ground level requires a building permit. The risk to you as a buyer: if the structure is non-compliant, council can issue an enforcement notice requiring either demolition or rectification. That cost lands with the owner at the time of enforcement — which, after settlement, is you.
      </p>
      <p>
        <strong>Extensions and room additions</strong> — particularly enclosed garages, granny flats, and extensions that added floor area — are the second most common category. These are especially prevalent in homes built or modified between the 1970s and 2000s, when owner-builders and informal trades were common. Extensions built over boundary setbacks (closer to a fence or boundary than council bylaws allow) are particularly problematic, because retrospective approval may be refused outright if the setback breach is significant.
      </p>
      <p>
        <strong>Carports and garages</strong> are frequently found without permits, particularly freestanding or attached structures built close to side boundaries. Without engineering certification and council approval, there is no verified evidence the structure can withstand wind loads or that its footings are adequate. Insurers take this seriously — a carport that collapses onto a car or a person is a significant liability exposure if the structure was never approved.
      </p>
      <p>
        <strong>Bathroom, kitchen, and laundry renovations</strong> done before 2000 were frequently completed by homeowners or unlicensed trades without permits. Plumbing work in Australia must be carried out by a licensed plumber, and electrical work by a licensed electrician — both require compliance certificates. An uninspected bathroom renovation can conceal water damage, incorrect drainage falls, or unsafe electrical work inside walls. When your inspector flags this, it is not a bureaucratic issue — it is a practical signal that the quality of the work has never been independently verified.
      </p>

      <h2>Your liability as a buyer — what you inherit</h2>
      <p>
        This is the part most buyers underestimate. When you purchase a property, you inherit the compliance status of all work done on it. The fact that the previous owner built the deck without a permit does not protect you from council enforcement after you take ownership. The four categories of exposure you need to understand are:
      </p>
      <ul>
        <li>
          <strong>Council enforcement</strong> — Council can issue a notice requiring you to either bring the work into compliance or remove it. This can happen years after you purchase. The most common triggers are neighbour complaints, a subsequent development application on the same property, or an insurance claim that draws attention to the structure.
        </li>
        <li>
          <strong>Insurance exclusions</strong> — Most standard home insurance policies in Australia exclude coverage for structures built without council approval. If the unapproved deck collapses and injures someone, or the unapproved extension catches fire, you may find your insurer declines the claim on the basis that the structure was never approved. This is not a hypothetical — it is standard policy language.
        </li>
        <li>
          <strong>Future resale complications</strong> — When you sell, you will face the same disclosure issue the current vendor is (or should be) facing right now. A building inspection on your sale will flag the same non-compliance. You will either need to have addressed it by then or disclose it to your buyer — and potentially accept a reduced price.
        </li>
        <li>
          <strong>Finance complications</strong> — Some lenders will not settle on properties with significant non-compliant work without either a compliance certificate or a non-compliant structure indemnity insurance policy in place. If you are buying with finance, your solicitor or conveyancer should flag this to your lender early.
        </li>
      </ul>

      <h2>What the vendor is required to disclose</h2>
      <p>
        Vendor disclosure obligations vary significantly across Australian states and territories. Victoria&apos;s Section 32 Vendor Statement and South Australia&apos;s disclosure regime are the most comprehensive — vendors in these states are required to disclose known non-compliant structures. New South Wales has different rules, and in some other states disclosure requirements are less formalised.
      </p>
      <p>
        Regardless of state, your conveyancer should specifically request confirmation from the vendor (in writing, before exchange) that building permits exist for all visible additions, decks, carports, and renovations. If the vendor asserts permits exist, your conveyancer should obtain copies. If the vendor cannot produce permits, this is material information that affects the price you should be paying.
      </p>
      <p>
        If a vendor knowingly conceals non-compliant work — particularly in states with formal disclosure obligations — you may have legal recourse after settlement. However, pursuing this is costly and time-consuming, and the burden of proof (establishing what the vendor knew and when) is not trivial. The better approach is to identify and address this before exchange, not after.
      </p>

      <h2>The three paths for handling a non-compliant renovation finding</h2>
      <p>
        Once your inspection has flagged non-compliant work, you have three realistic options. Each has different cost, timeline, and risk implications.
      </p>
      <p>
        <strong>Path 1: Regularise (retrospective approval)</strong>. Many councils allow retrospective building approval for older works, particularly if the structure is structurally sound and can be shown to meet current code requirements. The process involves engaging a private building surveyor or certifier to assess the work and, if it meets code, issue a certificate of compliance. Cost for certification alone typically ranges from $1,500 to $5,000. If the structure needs structural upgrades to reach compliance — additional footings, balustrade height changes, waterproofing rectification — costs can reach $5,000 to $25,000 or more. Timeline is typically 4 to 12 weeks minimum, which means it is rarely achievable before exchange unless the vendor has already initiated it.
      </p>
      <p>
        <strong>Path 2: Demolish and remove</strong>. If the work cannot be brought to code, or the cost of regularisation is prohibitive, demolition and removal is the alternative. For a deck or carport, demolition costs typically range from $2,000 to $15,000 depending on size and access. In some cases, council will require demolition of non-compliant work as a condition of approving a new development application on the property — so if the buyer plans to renovate or extend, addressing this early is important.
      </p>
      <p>
        <strong>Path 3: Buy as-is with negotiation and indemnity insurance</strong>. The third path is to accept the non-compliance risk but account for it in the price, and obtain non-compliant structure indemnity insurance before settlement. This insurance provides financial protection if council takes enforcement action after you purchase. It does not fix the compliance issue and does not mean the structure is approved — but it does mean you have cover. Premiums typically range from $500 to $2,000 as a one-time cost. Your conveyancer can arrange this. This path is most appropriate for older, stable structures where the practical enforcement risk is low — not for structures with active structural defects.
      </p>

      <h2>Using non-compliant renovations in a negotiation</h2>
      <p>
        Non-compliant renovations are one of the defect categories with the strongest negotiation leverage in Australian property transactions. Here&apos;s why: the legal liability is unambiguous, the cost range is substantial and can be documented, and the vendor cannot credibly argue that a structure built without permits is &ldquo;acceptable as-is.&rdquo; Unlike a cosmetic crack or a dated kitchen, there is no &ldquo;it&apos;s priced in&rdquo; response to a finding with genuine enforcement risk.
      </p>
      <p>
        The practical negotiation approach is:
      </p>
      <ul>
        <li>Have your conveyancer formally request all building permits from council for the property before exchange</li>
        <li>If permits are absent for a visible addition or renovation, document it in writing</li>
        <li>Request that the vendor either regularise the work before settlement (at their cost), reduce the purchase price to reflect regularisation or indemnity insurance costs, or both</li>
        <li>Get a written quote from a private building certifier on the regularisation cost to support your negotiation position</li>
      </ul>
      <p>
        Typical negotiation outcomes for non-compliant renovation findings range from $5,000 to $25,000 in price reductions, depending on the type of structure, its size, whether retrospective approval is feasible, and the vendor&apos;s motivation to sell. Larger unapproved extensions in breach of setbacks can justify substantially higher adjustments.
      </p>
      <p>
        If you are dealing with multiple defect findings from your inspection — which is common — non-compliant renovations should be listed as a specific, separate line item in any negotiation communication. Lumping it in with general &ldquo;defects&rdquo; understates its significance and makes it easier for a vendor to dismiss.
      </p>

      <h2>What Report Decoded does with non-compliant renovation findings</h2>
      <p>
        If your building inspection report has flagged unapproved work, <Link href="/">Report Decoded</Link> will identify and explain those findings in plain English — including what type of structure is affected, what the likely compliance pathway is, and what cost range you should factor into your negotiation. The analysis takes under 2 minutes and costs $39 for a single report.
      </p>
      <p>
        Specifically, for non-compliant renovation findings, Report Decoded:
      </p>
      <ul>
        <li>Extracts and flags all permit and compliance findings from the inspector&apos;s language</li>
        <li>Provides cost context for regularisation, demolition, or indemnity insurance depending on what is flagged</li>
        <li>Drafts a negotiation letter with non-compliance findings as a specific, documented line item — not buried in a general defect list</li>
        <li>Includes local tradie and certifier contacts relevant to the type of work identified</li>
      </ul>
      <p>
        Non-compliant renovations are exactly the kind of finding where having the right language and the right cost context in your negotiation communication makes a material difference to the outcome. Upload your PDF and get your full analysis — including a ready-to-send negotiation letter — in under 2 minutes.
      </p>
      <p>
        Not sure how to read the rest of your inspection report? See our guide on <Link href="/resources/how-to-read-as4349-1-inspection-report">how to read an AS 4349.1 inspection report</Link>, or if you&apos;ve just received your report and don&apos;t know where to start, read <Link href="/resources/just-got-building-inspection-report-australia">what to do after you get a building inspection report in Australia</Link>.
      </p>
    </ArticleLayout>
  );
}
