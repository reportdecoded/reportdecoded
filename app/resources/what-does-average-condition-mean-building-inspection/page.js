import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('what-does-average-condition-mean-building-inspection');

const faqs = [
  {
    q: 'Is &ldquo;average condition&rdquo; a pass or fail?',
    a: 'Neither. &ldquo;Average condition&rdquo; is a relative rating, not a verdict. It means the property has defects and wear consistent with comparable properties of the same age and construction type. It does not mean the property is safe to buy without scrutiny, and it does not mean you should walk away. It means you need to read the actual defect list and understand the costs.',
  },
  {
    q: 'Can I still negotiate if the report says &ldquo;average&rdquo;?',
    a: 'Absolutely. &ldquo;Average condition&rdquo; reports frequently contain $15,000&ndash;$40,000 in legitimate rectification costs. Those costs are real regardless of what the condition rating says. A negotiation letter backed by specific dollar amounts for specific defects is entirely appropriate &mdash; and effective &mdash; even when the inspector has rated the property average.',
  },
  {
    q: 'My report says &ldquo;below average&rdquo; &mdash; what does that mean?',
    a: '&ldquo;Below average&rdquo; means the inspector found defects or deterioration worse than what they would typically expect in a comparable property of the same age and construction type. This is a meaningful flag. It does not automatically mean walk away, but it does mean the defect list is likely to be more extensive or more severe than normal, and the rectification costs are likely to be higher. Read every defect entry carefully and get specialist quotes before proceeding.',
  },
  {
    q: 'How many defects is typical for an &ldquo;average condition&rdquo; property?',
    a: 'There is no fixed number, but a typical average-condition report on a 20&ndash;40 year old Australian home might list anywhere from 10 to 40 individual defect items across categories including roofing, drainage, structure, electrical, plumbing, and finishes. The number matters less than the severity and cost. Two defects requiring $30,000 in rectification is far more significant than 25 cosmetic items totalling $2,000.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="What does &ldquo;average condition&rdquo; mean on an Australian building inspection report?"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>&ldquo;Average condition&rdquo;</strong> on an Australian building inspection report means the property has defects and wear <strong>consistent with comparable properties of similar age and construction type</strong>. It does <strong>not</strong> mean the property is in good condition, safe to buy without negotiation, or free from significant defects. Here&apos;s what inspectors actually mean when they write it &mdash; and what to do next.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'how-to-read-as4349-1-inspection-report',
        'just-got-building-inspection-report-australia',
        'building-inspection-report-no-cost-estimates-australia',
        'what-to-do-if-building-inspection-finds-major-problems',
      ]}
      related_suburbs={[
        'fitzroy',
        'paddington',
        'newtown',
        'northcote',
        'west-end',
      ]}
    >
      <p>
        Your building inspection report has arrived and somewhere near the front page it says the property is in &ldquo;average condition.&rdquo; You read that and feel uncertain. Does average mean normal? Does it mean half the properties on the market are better than this one? Does it mean you should proceed, or pause, or negotiate?
      </p>
      <p>
        The confusion is understandable and extremely common. The term &ldquo;average condition&rdquo; is doing something very specific in the context of an Australian building inspection report, and it is not what most buyers instinctively assume. Understanding what it actually means &mdash; and what it does not mean &mdash; is the difference between using your report effectively and making a $500,000 decision based on a misread.
      </p>

      <h2>What &ldquo;average condition&rdquo; actually means</h2>
      <p>
        Australian building inspections are conducted under AS 4349.1, the standard that governs pre-purchase property inspections. Under this standard, condition ratings are not absolute grades &mdash; they are <strong>relative assessments</strong> compared to properties of the same age, construction type, and use.
      </p>
      <p>
        When an inspector writes &ldquo;average condition,&rdquo; they are saying: the defects and deterioration I found in this property are broadly consistent with what I would expect to find in a comparable property of the same era and build type. Nothing I found is dramatically better or worse than the peer group.
      </p>
      <p>
        What it does <em>not</em> mean:
      </p>
      <ul>
        <li><strong>Few defects</strong> &mdash; an average-condition report can list 30 or more individual defect items</li>
        <li><strong>Safe to buy without scrutiny</strong> &mdash; the condition rating is a summary, not a clearance</li>
        <li><strong>No significant costs</strong> &mdash; average for the age can still mean $20,000&ndash;$40,000 in rectification work</li>
        <li><strong>Nothing to negotiate on</strong> &mdash; defects are defects regardless of how typical they are</li>
      </ul>
      <p>
        Consider a 1960s weatherboard terrace in inner Melbourne. An inspector might rate it &ldquo;average condition&rdquo; while the report documents failed bathroom waterproofing, roof tiles at end-of-life, the absence of RCD protection on the electrical system, and multiple cracks in the mortar between brickwork. Every single one of those findings is entirely typical for a property of that age and construction type. So the condition rating is &ldquo;average.&rdquo; But the rectification costs are still real, and they are still yours to carry once you settle.
      </p>
      <p>
        The condition rating is relative to the peer group &mdash; not relative to a perfect or even a good property.
      </p>

      <h2>The condition rating scale</h2>
      <p>
        Most Australian building inspectors use a condition rating scale with five levels, typically:
      </p>
      <ul>
        <li><strong>Very Good</strong> &mdash; significantly better than comparable properties of the same age</li>
        <li><strong>Good</strong> &mdash; better than average for the age and type</li>
        <li><strong>Average</strong> &mdash; consistent with comparable properties of the same age and type</li>
        <li><strong>Poor</strong> &mdash; worse than typical for comparable properties</li>
        <li><strong>Very Poor</strong> &mdash; significantly worse than comparable properties, often with serious structural or safety concerns</li>
      </ul>
      <p>
        &ldquo;Average&rdquo; sits exactly in the middle. It means the inspector did not find anything dramatically worse than expected &mdash; but also nothing better. It is a neutral midpoint, not a positive endorsement.
      </p>
      <p>
        The critical thing to understand is that the condition rating is a <strong>summary judgment</strong>, not a substitute for reading the actual defect findings. It collapses an entire report &mdash; sometimes 30 to 60 pages &mdash; into a single label. Two properties can both be rated &ldquo;average condition&rdquo; with very different underlying defect lists.
      </p>
      <p>
        Property A: &ldquo;Average condition&rdquo; &mdash; three cosmetic defects, one minor drainage issue, total estimated rectification $2,500.
      </p>
      <p>
        Property B: &ldquo;Average condition&rdquo; &mdash; failed bathroom waterproofing, roof membrane at end-of-life, electrical non-compliance, cracking to external cladding, blocked subfloor drainage. Total estimated rectification $38,000.
      </p>
      <p>
        Both average. Completely different situations. The condition rating alone tells you almost nothing.
      </p>

      <h2>Why &ldquo;average&rdquo; can still be a strong negotiation position</h2>
      <p>
        Here is the piece that most buyers miss: &ldquo;average condition&rdquo; does not mean &ldquo;acceptable condition.&rdquo; It means &ldquo;typical condition.&rdquo; Those are not the same thing.
      </p>
      <p>
        In a housing market where the majority of properties of a given age have failed waterproofing in the bathroom, finding failed waterproofing in your target property does not push it into the &ldquo;poor&rdquo; category &mdash; it keeps it at &ldquo;average,&rdquo; because that defect is statistically normal for the peer group. But failed waterproofing still costs $5,000&ndash;$15,000 to rectify. That cost does not disappear because it is typical.
      </p>
      <p>
        This is why &ldquo;average condition&rdquo; reports are frequently still strong negotiation material. The defects listed are real. The costs are real. The vendor&apos;s agent cannot reasonably argue that you should absorb those costs simply because they are common in similar properties &mdash; you are the one writing the cheque to fix them.
      </p>
      <p>
        An &ldquo;average condition&rdquo; report on a 1980s brick veneer in suburban Sydney might reasonably include:
      </p>
      <ul>
        <li><strong>Roof restoration or partial re-tiling</strong> &mdash; $8,000&ndash;$18,000</li>
        <li><strong>Bathroom waterproofing</strong> &mdash; $6,000&ndash;$12,000</li>
        <li><strong>Electrical switchboard upgrade and RCD installation</strong> &mdash; $1,500&ndash;$3,500</li>
        <li><strong>Subfloor ventilation and drainage works</strong> &mdash; $2,000&ndash;$6,000</li>
        <li><strong>External caulking and minor crack repairs</strong> &mdash; $800&ndash;$2,500</li>
      </ul>
      <p>
        That is $18,000&ndash;$42,000 in a single &ldquo;average condition&rdquo; report. Every dollar of that is negotiable.
      </p>

      <h2>What to look at after seeing &ldquo;average&rdquo;</h2>
      <p>
        Do not stop at the condition rating. Treat it as the headline of a story you still need to read in full. Here is what to focus on:
      </p>
      <ul>
        <li>
          <strong>Major Defects</strong> &mdash; these are the deal-impact items. Structural cracking, active subsidence, serious roof failure, major timber pest damage. Even in an &ldquo;average&rdquo; rated report, a single major defect can change your calculus entirely.
        </li>
        <li>
          <strong>Significant Defects</strong> &mdash; these are the budget-impact items. Waterproofing failures, drainage issues, electrical non-compliance, roofing at end-of-life. These are the costs that accumulate and that you need to quantify before you can make a sensible offer.
        </li>
        <li>
          <strong>&ldquo;Further investigation recommended&rdquo; flags</strong> &mdash; this is the inspector telling you they found something they could not fully assess. Every single one of these requires a specialist follow-up before you exchange. Do not gloss over them.
        </li>
      </ul>
      <p>
        Work through the report section by section. Count the defects. Categorise them by severity. Note every item where a specialist &mdash; structural engineer, electrician, plumber, waterproofing contractor &mdash; has been recommended. Then start adding up costs.
      </p>
      <p>
        For most Australian buyers, reading a building inspection report in this level of detail requires either professional experience or a significant time investment. The terminology is technical, the severity language is inconsistent between inspectors, and the reports deliberately avoid dollar figures. That is why most buyers either over-react (treating an average-condition report as a disaster) or under-react (treating it as a clearance). Neither serves them well.
      </p>
      <p>
        If you want a faster path through this, <Link href="/resources/building-inspection-report-no-cost-estimates-australia">Australian building inspection reports do not include cost estimates</Link> by design &mdash; but that does not mean you have to guess.
      </p>

      <h2>When &ldquo;average&rdquo; is fine to proceed versus when to dig deeper</h2>
      <p>
        Not every &ldquo;average condition&rdquo; report should give you pause. Here is a practical framework:
      </p>
      <p>
        <strong>Average condition is likely fine to proceed when:</strong>
      </p>
      <ul>
        <li>The defect list is genuinely routine &mdash; paint touch-ups, gutter cleaning, minor weathering, isolated hairline cracks in plasterboard</li>
        <li>There are no &ldquo;further investigation recommended&rdquo; items, or the ones flagged have already been assessed and resolved</li>
        <li>You factored a maintenance buffer into your buying decision and the total estimated costs sit within that buffer</li>
        <li>The property is older and you purchased knowing ongoing maintenance would be part of ownership</li>
      </ul>
      <p>
        <strong>Dig deeper when &ldquo;average&rdquo; appears alongside any of the following:</strong>
      </p>
      <ul>
        <li><strong>Structural cracking</strong> &mdash; diagonal cracks from window corners, cracking at structural connections, or any crack that an inspector flags as requiring engineer assessment</li>
        <li><strong>Any waterproofing failure</strong> &mdash; bathrooms, balconies, wet areas. Water damage is one of the most expensive and most underestimated repair categories in Australian residential property</li>
        <li><strong>Roof at end-of-life</strong> &mdash; whether terracotta tiles, concrete tiles, Colorbond, or other materials, a full roof replacement is a $15,000&ndash;$40,000 item that cannot be deferred indefinitely</li>
        <li><strong>Electrical compliance flags</strong> &mdash; absent RCDs, non-compliant wiring, outdated switchboards. These are both a cost and a safety issue</li>
        <li><strong>Any &ldquo;further investigation recommended&rdquo; item that has not been resolved</strong> &mdash; treat these as open questions, not minor footnotes</li>
      </ul>
      <p>
        The condition rating does not tell you the cost. Only the defect list &mdash; carefully read and costed &mdash; tells you the cost. And the cost is the number that actually matters for your negotiation and your buying decision.
      </p>
      <p>
        For a fuller guide on how to work through a report from scratch, see <Link href="/resources/just-got-building-inspection-report-australia">what to do when you first receive your building inspection report</Link>, and for understanding what the most serious findings mean, <Link href="/resources/what-is-a-major-defect-building-inspection-australia">here is what counts as a major defect under Australian standards</Link>.
      </p>

      <h2>How Report Decoded helps with an &ldquo;average condition&rdquo; report</h2>
      <p>
        Report Decoded is built specifically for this situation. You have a report in front of you. It says &ldquo;average condition.&rdquo; You need to know what that actually costs, and you need to know it before you make a decision or send an offer.
      </p>
      <p>
        Upload your building inspection PDF and Report Decoded&apos;s AI reads every defect entry, assigns cost estimates based on current Australian trade rates, and produces a plain-English summary of what you are actually dealing with. The whole process takes under 2 minutes.
      </p>
      <p>
        You also receive a negotiation letter with specific dollar amounts for specific defects &mdash; ready to send to the vendor&apos;s agent. Not a vague request for a price reduction, but a line-by-line case built from your own report.
      </p>
      <p>
        A single report costs $59. That is less than one hour of a conveyancer&apos;s time, and it gives you the cost clarity that your inspection report deliberately withholds.
      </p>
      <p>
        &ldquo;Average condition&rdquo; is not the end of the analysis. It is the beginning. The question that matters is not what the inspector rated the property &mdash; it is what it will actually cost you to own it. Report Decoded answers that question.
      </p>
    </ArticleLayout>
  );
}
