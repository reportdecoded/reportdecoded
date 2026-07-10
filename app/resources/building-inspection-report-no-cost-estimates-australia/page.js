import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('building-inspection-report-no-cost-estimates-australia');

const faqs = [
  {
    q: 'Can my inspector add cost estimates to their report if I ask?',
    a: 'Some inspectors will add indicative cost ranges if you request it before the inspection — not after, as they need to factor this into their professional liability. However, many inspectors decline entirely because they are not licensed tradespeople and do not want to be held responsible for cost estimates that turn out to be inaccurate. It is worth asking when you book, but do not rely on it. If your inspector does include estimates, treat them as rough ballpark figures rather than precise quotes.',
  },
  {
    q: 'Should I wait for trade quotes before negotiating or can I negotiate based on an estimate?',
    a: 'You can and often should negotiate based on estimates if you are inside a cooling-off period or under time pressure. Most vendors and agents understand that a buyer cannot obtain formal trade quotes in 24-48 hours. Present your estimates clearly, note they are based on current AU trade rates, and make your request in writing. If the vendor agrees to a reduction, get it in writing immediately. You can still obtain formal trade quotes before exchange to confirm the amounts were reasonable.',
  },
  {
    q: 'My inspector gave some estimates — are those accurate enough to use?',
    a: 'Inspector-provided estimates vary considerably in quality. An experienced inspector who has worked in construction may give you figures that are close to real trade quotes. A general inspector with limited trade background may give numbers that are significantly off. Treat any inspector estimates as a starting point, not a final figure. For any defect likely to cost more than $5,000 to rectify, it is worth either getting a trade quote or cross-referencing against current AU trade rate data before using the number in a formal negotiation.',
  },
  {
    q: 'How far off the mark are AI-generated cost estimates likely to be?',
    a: 'AI-generated cost estimates based on current AU trade rate data are typically within 20-35% of actual trade quotes for common defects — which is accurate enough for negotiation purposes. The variance is higher for unusual or complex defects, or for properties in regional areas where trade rates differ significantly from capital city benchmarks. The right way to use AI-generated estimates is as a negotiation baseline: present them to establish that costs exist and are substantial, then get formal trade quotes before exchange to confirm the final figure before you are legally committed.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Why your building inspection report has no cost estimates — and how to get them"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            AS4349.1 building inspection reports in Australia are legally required to describe defects but are <strong>not required to include cost estimates</strong>. The NSW Government&apos;s own guidance confirms this. You have three practical options for getting the dollar figures you need to negotiate — a digital analysis service like Report Decoded delivers estimates <strong>under 2 minutes</strong>, while trade quotes take 5-10 business days.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'just-got-building-inspection-report-australia',
        'how-much-to-negotiate-after-building-inspection',
        'building-inspection-negotiation-letter-template-australia',
        'what-to-do-if-building-inspection-finds-major-problems',
      ]}
      related_suburbs={[
        'sydney',
        'melbourne',
        'brisbane',
        'perth',
        'canberra',
      ]}
    >
      <p>
        You&apos;ve just received your building inspection report. Ninety pages, fourteen defects, detailed descriptions of cracking, water ingress, roof damage, and timber deterioration. Not a single dollar figure anywhere. Was that an oversight? Did you get the wrong inspector? Did you pay for a report that is missing half the information you need?
      </p>
      <p>
        No. This is by design — and it catches almost every first-time buyer completely off guard.
      </p>
      <p>
        Understanding why your report has no cost estimates, and knowing exactly how to get those figures quickly, is the difference between negotiating confidently and either overpaying for a damaged property or walking away from one you didn&apos;t need to walk away from.
      </p>

      <h2>Why there are no cost estimates: the AS4349.1 standard</h2>
      <p>
        Pre-purchase building inspections in Australia are governed by <strong>AS4349.1</strong>, the Australian Standard for inspection of buildings. This standard defines what a building inspector must inspect, how they must classify defects, and what must appear in the written report.
      </p>
      <p>
        Cost estimates are explicitly not part of the standard. AS4349.1 requires inspectors to identify and describe defects — their location, their nature, their likely cause, and their severity. It does not require inspectors to estimate what those defects will cost to repair.
      </p>
      <p>
        This is confirmed by state consumer protection agencies across the country. NSW Fair Trading guidance states that building inspectors are not required to provide cost estimates for rectification work. Consumer Affairs Victoria says the same. This is not a loophole or an industry quirk — it is a deliberate feature of the inspection framework.
      </p>
      <p>
        The reasoning is sensible once you understand it. Building inspectors are not licensed tradespeople. A building inspector is qualified to identify that a roof has damage — to see it, categorise it, and describe it. They are not a licensed roofer qualified to assess the full scope of work required and price it accurately. An inspector who provides a cost estimate is operating outside their professional lane, and if that estimate turns out to be significantly wrong, they face real liability exposure.
      </p>
      <p>
        The standard deliberately separates two distinct functions: the <strong>what</strong> (identifying and describing defects — the inspector&apos;s job) and the <strong>how much</strong> (estimating repair costs — a tradesperson&apos;s job). Both functions require professional expertise; they just require different expertise.
      </p>
      <p>
        Some inspectors do include indicative cost ranges as a courtesy. Many don&apos;t. Neither approach violates the standard — both are within the rules. If your report has no dollar figures at all, your inspector is not cutting corners. They are simply delivering exactly what the standard requires.
      </p>

      <h2>Why this creates a serious problem for buyers</h2>
      <p>
        Understanding why there are no cost estimates is reassuring in one sense. But it does not solve your actual problem: <strong>you cannot negotiate without dollar figures</strong>.
      </p>
      <p>
        &ldquo;There&apos;s some cracking to the rear retaining wall&rdquo; is not a negotiation. &ldquo;The rear retaining wall requires structural assessment and likely full reconstruction at an estimated cost of $18,000-$28,000&rdquo; is a negotiation.
      </p>
      <p>
        Most conveyancers and solicitors handling your purchase are focused on legal compliance — title searches, contract terms, special conditions. Very few have the building knowledge or professional scope to advise on repair costs. The legal side of your transaction is covered. The cost side is a gap that most buyers are expected to fill themselves.
      </p>
      <p>
        This is exactly where buyers get hurt. A property sells at market price. The buyer pays that price. Six months later, they discover the defects listed in the inspection report are going to cost $45,000 to rectify. A price reduction of $30,000-$40,000 was entirely achievable at the time of negotiation — if the buyer had known the numbers.
      </p>
      <p>
        The cost estimate gap is not a minor inconvenience. It is a structural problem in the property buying process that costs Australian buyers real money every day.
      </p>

      <h2>Your three options for getting repair cost estimates</h2>
      <p>
        Once you understand the problem, the question becomes practical: how do you get the dollar figures you need, and how quickly can you get them? There are three realistic options, each with different trade-offs.
      </p>

      <h3>Option 1: Get trade quotes yourself</h3>
      <p>
        The most accurate method is to contact each relevant trade directly — builder, roofer, waterproofer, electrician, structural engineer — share the relevant pages of your inspection report, and request a quote for the work described. Getting 2-3 quotes per defect category gives you a reliable range.
      </p>
      <p>
        The problem is time. Most tradespeople need to attend the property to provide a formal quote, and most won&apos;t attend without the vendor&apos;s co-operation. Arranging access, getting tradespeople to attend, and receiving written quotes typically takes 5-10 business days. If you&apos;re in a standard 5-business-day cooling-off period in NSW or a similar window in other states, that timeline does not work.
      </p>
      <p>
        Trade quotes are the right approach for larger defects before exchange, when you have more time. They are not realistic as your sole strategy during cooling-off.
      </p>

      <h3>Option 2: Ask your conveyancer or solicitor for ballpark figures</h3>
      <p>
        Some solicitors who specialise in property and have handled many defect-related negotiations will give you rough estimates based on experience. Most won&apos;t — it is outside their professional scope and they are not insured for building cost advice.
      </p>
      <p>
        If you have a building-savvy solicitor with genuine construction knowledge, this can be a useful supplementary input. It is not reliable enough to anchor a formal negotiation for most buyers with most solicitors.
      </p>

      <h3>Option 3: Use a digital analysis service</h3>
      <p>
        Services like <strong>Report Decoded</strong> ($39) accept your building inspection PDF and return cost estimates for every defect within under 2 minutes. The analysis is based on current 2026 Australian trade rates across capital city and regional markets, and it returns plain-English explanations of each defect alongside the cost estimates.
      </p>
      <p>
        Report Decoded also generates a negotiation letter you can send directly to the vendor&apos;s agent, with the defects and estimated costs already documented — removing the need to draft the letter yourself under time pressure.
      </p>
      <p>
        The important limitation: AI-generated estimates based on trade rate data are not on-site quotes. They are accurate enough for negotiation purposes — typically within 20-35% of actual trade quotes for common defects — but you should treat them as a negotiation baseline and obtain formal trade quotes before exchange for any major defect. Use the AI estimates to establish the conversation and secure a price reduction in principle; use formal quotes to confirm the amount before you commit legally.
      </p>
      <p>
        For buyers inside a cooling-off period with 2-4 days remaining, the under-2-minute turnaround from a digital service is often the only realistic path to getting cost data in time to act on it.
      </p>

      <h2>What do &ldquo;further investigation recommended&rdquo; items cost to assess?</h2>
      <p>
        Many inspection reports include items flagged as &ldquo;further investigation recommended&rdquo; rather than a clear defect description. This language means the inspector has identified something concerning but cannot fully assess it without a specialist — often because it requires invasive investigation, specialist equipment, or trade-specific expertise.
      </p>
      <p>
        For these items, you need specialist assessment before you can get a repair cost quote. The most common specialists and their assessment fee ranges in 2026:
      </p>
      <ul>
        <li><strong>Structural engineer</strong> — $1,500-$3,500 for a structural assessment report. Required for cracking that may indicate foundation movement, retaining wall failure, or load-bearing structural concerns.</li>
        <li><strong>Pest specialist (termite confirmation)</strong> — $400-$800 for a targeted termite inspection and assessment. Required when the building inspector flags active or historical termite activity.</li>
        <li><strong>Licensed electrician (compliance check)</strong> — $200-$400 for an electrical compliance inspection. Required when the building inspector flags outdated wiring, non-compliant switchboard, or absence of safety switches.</li>
        <li><strong>Licensed plumber</strong> — $200-$500 for a drainage CCTV inspection. Required when the inspector flags drainage concerns or tree root intrusion risk.</li>
      </ul>
      <p>
        Each of these specialists can then provide a rectification cost quote as part of their assessment — or at minimum, you will have a clear picture of what you are dealing with before you commit to the purchase.
      </p>

      <h2>Using cost estimates to negotiate</h2>
      <p>
        Once you have cost estimates — whether from trade quotes, a digital analysis service, or a combination — the next step is presenting them formally to the vendor&apos;s agent in writing.
      </p>
      <p>
        A strong negotiation request documents: the specific defects identified in the inspection report, the estimated cost to rectify each defect, the total estimated rectification cost, and a clear request — either a price reduction equal to the rectification cost, or vendor rectification prior to settlement.
      </p>
      <p>
        Most vendors prefer price reduction over rectification. Organising and managing trades is time-consuming and stressful, and vendors who are already planning to move on have little appetite for it. A clean price reduction is usually the path of least resistance for everyone.
      </p>
      <p>
        Real estate agents report that properly documented negotiation requests — with specific defects and dollar amounts — receive at least partial acceptance in the majority of cases. Vague requests (&ldquo;the report found some issues, can we discuss the price?&rdquo;) are far less effective. The documentation is not just about being professional — it is what makes the request credible and hard to dismiss.
      </p>

      <h2>Typical repair cost ranges for common defects (2026 AU)</h2>
      <p>
        To give you a rough frame of reference, the following are typical cost ranges for common defects identified in Australian building inspections. These are 2026 ranges for capital city markets — regional areas may vary:
      </p>
      <ul>
        <li><strong>Waterproofing failure (bathroom/balcony)</strong> — $3,000-$18,000 depending on area size and substrate condition</li>
        <li><strong>Ridge repointing (roof)</strong> — $500-$2,500 for a standard single-storey dwelling</li>
        <li><strong>Full re-roof replacement</strong> — $15,000-$45,000 depending on roof area, pitch, and material</li>
        <li><strong>Structural crack investigation</strong> — $1,500-$3,500 for assessment only; rectification costs vary widely</li>
        <li><strong>Full rewiring</strong> — $8,000-$25,000 depending on property size and existing wiring configuration</li>
        <li><strong>Smoke alarm upgrade to current standard</strong> — $500-$1,500 for a standard dwelling</li>
        <li><strong>Rising damp treatment</strong> — $3,000-$10,000 depending on affected wall length and method used</li>
        <li><strong>Subfloor drainage improvement</strong> — $2,000-$8,000 depending on access and scope</li>
        <li><strong>Retaining wall replacement</strong> — $5,000-$30,000+ depending on height, length, and material</li>
      </ul>
      <p>
        These ranges are starting points. Your specific defects, your property&apos;s construction type, and your location will all affect actual trade quotes. Use these ranges to sense-check estimates you receive and to understand the scale of what you may be dealing with before you have specific numbers.
      </p>

      <h2>The bottom line</h2>
      <p>
        Your building inspection report has no cost estimates because the Australian Standard does not require them — not because your inspector did a poor job. The report gave you exactly what it was designed to give you: a clear, professional assessment of what defects exist and how serious they are.
      </p>
      <p>
        Getting the cost figures is your job as the buyer, and it is a job worth doing carefully. A $39 digital analysis through <Link href="/resources/just-got-building-inspection-report-australia">Report Decoded</Link> gives you cost estimates within under 2 minutes — fast enough to use during cooling-off, detailed enough to anchor a real negotiation. For major defects, follow up with formal trade quotes before exchange.
      </p>
      <p>
        The buyers who negotiate well are not the ones with the sharpest negotiating instincts. They are the ones who arrive at the conversation with specific, documented, credible numbers. Getting those numbers is now a straightforward step — and it is one most buyers skip entirely.
      </p>
    </ArticleLayout>
  );
}
