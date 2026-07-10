import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('structural-cracks-building-inspection-australia');

const faqs = [
  {
    q: 'How wide does a crack need to be to be structural?',
    a: 'There is no single magic number, but inspectors and structural engineers use 3mm as a key threshold. Cracks under 1mm (hairline) are almost always cosmetic. Cracks between 1mm and 3mm warrant monitoring and further description context. Cracks above 3mm — especially if they show displacement (one side is higher or further out than the other) or are actively widening — should be assessed by a structural engineer. Width alone is not the whole story; a 4mm crack through soft render is far less serious than a 2mm crack through a structural brick wall that is also displacing.',
  },
  {
    q: 'My inspector wrote "monitor" for cracks — what does that mean?',
    a: '"Monitor" means the inspector saw a crack that was not severe enough to call structural, but they could not confirm it was fully settled either. In practice, it means: photograph the crack with a ruler and date stamp, check it again in three to six months, and look for any change in width or length. If you are buying the property, "monitor" is not a reason to walk away, but it is a reason to factor potential future investigation costs into your negotiation. If the report says "monitor and seek further advice," that is a stronger signal to get a structural engineer involved before you exchange.',
  },
  {
    q: 'What is underpinning and how much does it cost?',
    a: 'Underpinning is the process of strengthening or deepening a building&apos;s foundation to stop ongoing movement. It is used when soil underneath a slab or strip footing has moved, eroded, or become unstable. The most common methods in Australia are concrete underpinning (cutting sections under the existing footing and filling with concrete) and screw pile underpinning (drilling steel piles deep into stable ground). Cost varies enormously by access, soil type, and the number of piers required. As a rough guide: $5,000 to $15,000 for minor localised underpinning; $20,000 to $60,000 for moderate foundation failure across one or two sides of a dwelling; $60,000+ for severe or whole-perimeter foundation failure. A structural engineer&apos;s report will give you the actual scope and quote range.',
  },
  {
    q: 'My house is 50 years old — are cracks normal?',
    a: 'Yes, a 50-year-old Australian house will almost certainly have some cracking, and most of it will be cosmetic. Brick veneer homes built from the 1960s to the 1980s commonly show hairline render cracks and minor mortar joint cracking due to decades of thermal movement and seasonal soil moisture changes. A building inspector who says a 50-year-old house has zero cracks would be unusual. What matters is not the presence of cracks, but their type, location, width, and whether they are active. A well-built 1970s home with a dozen hairline render cracks and one repaired stair-step crack is less concerning than a 2010 home with a single 5mm diagonal crack through a structural wall that shows brick displacement.',
  },
  {
    q: 'Can I ask for a price reduction based on cracks the inspector found?',
    a: 'Yes, and you should. Crack findings — particularly those classified as structural or flagged for further investigation — are among the strongest negotiation items in a building inspection. For cosmetic cracks, collect two or three repair quotes and negotiate the midpoint off the price. For suspected structural cracks with an unresolved classification, negotiate the cost of a structural engineer&apos;s assessment ($1,500 to $3,500) and an allowance for potential rectification. For confirmed structural cracks with a rectification cost estimate, that full cost range is your negotiation anchor. Vendors who refuse to negotiate on documented structural defects are a red flag in themselves — a genuine seller understands that a competent buyer will have this information.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Structural cracks vs cosmetic cracks: what your building inspection is really saying (Australia)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            Not all cracks in a building inspection report are equal. A hairline crack in render costs <strong>$200 to patch</strong>. Stair-step cracking through brickwork at a corner can mean <strong>$20,000&ndash;$60,000 in underpinning</strong>. The difference lies in four things: crack type, location, width, and whether it&apos;s active or settled. Here&apos;s how to read crack findings in your Australian building inspection report.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'concrete-cancer-spalling-cost-australia',
        'how-to-read-as4349-1-inspection-report',
        'just-got-building-inspection-report-australia',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={[
        'richmond',
        'glebe',
        'balmain',
        'brunswick',
        'northcote',
      ]}
    >
      <p>
        Your building inspection report mentions cracks. It uses terms like &ldquo;step cracking,&rdquo; &ldquo;diagonal cracking,&rdquo; and &ldquo;settlement cracking.&rdquo; You don&apos;t know if you should be immediately on the phone to your solicitor or if this is the kind of thing every 30-year-old Australian house has. The answer, frustratingly, is: it depends — but it depends on four very specific things that your report should give you enough information to assess.
      </p>
      <p>
        This guide explains how to distinguish cosmetic cracking from structural cracking, what the common crack types in Australian buildings actually mean, what they cost to fix, and how to use crack findings in a price negotiation. If your report has crack findings that are classified as &ldquo;further investigation recommended,&rdquo; read this before you do anything else.
      </p>

      <h2>The four signals that distinguish cosmetic from structural cracks</h2>
      <p>
        Building inspectors and structural engineers use four criteria when assessing any crack. You can apply the same framework to your report findings.
      </p>
      <ul>
        <li>
          <strong>Crack pattern</strong> — The shape and direction of a crack tells you what forces created it. Horizontal cracks indicate lateral pressure. Diagonal cracks indicate differential settlement (one side of the structure moving more than the other). Stair-step cracks follow mortar joints in brickwork and can be either cosmetic or structural. Vertical cracks in concrete are often shrinkage-related. Each pattern points to a different cause, and some causes are far more serious than others.
        </li>
        <li>
          <strong>Location</strong> — A diagonal crack radiating from the corner of a window frame is common and usually cosmetic. The same diagonal crack appearing through a structural wall with no nearby opening is a different story. Location also matters in terms of exposure: cracks in retaining walls, at foundation junctions, or on the lower courses of external brickwork carry more risk than cracks in internal plasterboard or render on a non-load-bearing partition wall.
        </li>
        <li>
          <strong>Width</strong> — Hairline cracks under 1mm are almost always cosmetic. Cracks between 1mm and 3mm need contextual assessment. Cracks wider than 3mm — particularly in masonry — are a serious signal, especially if they also show displacement. Width is necessary but not sufficient on its own.
        </li>
        <li>
          <strong>Active vs settled</strong> — A crack that is still moving is structurally more significant than an identical crack that stopped moving 20 years ago. Active cracks are often tapered (wider at one end, narrower at the other), may have fresh dust or debris inside them, or may show recent paint bridging that has itself cracked. Settled cracks tend to be uniform in width throughout, with weathering and paint fully integrated into the crack edges. Your inspector should describe whether a crack appears active or historic — if they don&apos;t, that&apos;s a gap worth querying.
        </li>
      </ul>

      <h2>Crack types and what they indicate</h2>

      <h3>Hairline cracks in render or plaster</h3>
      <p>
        This is the most common crack finding in Australian building inspection reports, and the least alarming. Hairline cracking in external render or internal plaster is found in virtually all Australian properties over ten years old. It is especially prevalent in brick veneer construction (the dominant form in Australian suburban housing from the 1960s onwards) where the timber frame and the brick outer skin move independently in response to temperature and moisture.
      </p>
      <p>
        A building inspection report that lists hairline render cracks as a defect is doing its job — it is documenting everything. It does not mean the building has a problem. Unless the inspector has noted that the hairline cracking is widespread, is concentrated at structural junctions, or is accompanied by other defects, treat it as routine maintenance.
      </p>
      <p>
        <strong>Repair cost:</strong> $100&ndash;$500 per affected area, depending on extent and whether the surface requires repainting.
      </p>
      <p>
        <strong>Action:</strong> Patch, repaint, and monitor at your next annual inspection.
      </p>

      <h3>Stair-step cracking through mortar joints</h3>
      <p>
        Stair-step cracking is diagonal cracking that follows the mortar joints in a brick wall — stepping from one horizontal joint to the next vertical joint in a zigzag pattern. This is one of the most discussed crack types in Australian inspection reports, and for good reason: it can be entirely benign or it can indicate serious ongoing foundation movement.
      </p>
      <p>
        The key differentiator is <strong>displacement</strong>. If the bricks on either side of the crack are still flush with each other — same plane, same level — the crack has likely settled and the building has found equilibrium. This is common in older homes that went through an active settlement period decades ago. If the bricks are displaced — one side is pushed outward, or one course is higher than the other — the foundation is still moving, and that is a structural finding.
      </p>
      <p>
        Stair-step cracking at corners (where two walls meet at 90 degrees) is more common and more serious than stair-step cracking in the middle of a wall run, because corner junctions are where differential movement between two wall sections tends to concentrate.
      </p>
      <p>
        <strong>Repair cost if cosmetic (settled, no displacement):</strong> $500&ndash;$2,000 to repoint affected mortar joints.
      </p>
      <p>
        <strong>Repair cost if structural (active, displacement present):</strong> $5,000&ndash;$60,000+ depending on the extent of foundation movement and whether underpinning is required.
      </p>

      <h3>Horizontal cracking in masonry walls</h3>
      <p>
        Horizontal cracking in a brick wall is the most serious pattern you can encounter in a masonry building inspection finding. Unlike diagonal or stair-step cracks (which follow the path of least resistance through mortar joints), horizontal cracks cut across the structural integrity of the wall itself and almost always indicate lateral forces — pressure from the side rather than from above.
      </p>
      <p>
        The two most common sources are: soil pressure on a retaining wall that is also a building wall (common in properties with split-level construction or sloped sites), and thermal expansion forces on a parapet wall (the short brick wall above a roof line, exposed on both faces). In either case, a horizontal crack through a structural masonry wall requires structural engineering assessment before purchase.
      </p>
      <p>
        <strong>Repair cost:</strong> $5,000&ndash;$40,000 depending on extent, cause, and access.
      </p>

      <h3>Diagonal cracking from window and door corners</h3>
      <p>
        A 45-degree crack radiating from the corner of a window or door opening is arguably the most common crack finding in Australian residential inspection reports. It is caused by stress concentration at the corners of openings — these are the weakest points in a masonry or rendered wall, and any thermal movement, minor settlement, or shrinkage will express itself first at these corners.
      </p>
      <p>
        In most cases, this cracking is cosmetic. It typically develops within the first five to fifteen years of a building&apos;s life and then stops. The tell is again displacement and width: if the crack is hairline to 2mm and both faces of the crack are flush, this is a repair item, not a structural concern.
      </p>
      <p>
        It becomes structural when: the crack is wider than 3mm and still growing; when the door or window is binding or sticking in the frame (indicating the frame itself has distorted, which only happens if the surrounding structure has moved significantly); or when displacement is visible across the crack faces.
      </p>
      <p>
        <strong>Repair cost if cosmetic:</strong> $200&ndash;$800 per crack location.
      </p>
      <p>
        <strong>Repair cost if structural:</strong> $5,000&ndash;$25,000 depending on cause.
      </p>

      <h3>Cracking in concrete (slabs and beams)</h3>
      <p>
        Concrete cracks. This is not a design flaw — it is a physical property of the material. Concrete shrinks as it cures, and hairline cracking in a concrete slab surface is standard. Your inspector will note it; it is not a defect in the meaningful sense unless it crosses certain thresholds.
      </p>
      <p>
        The structural red flags in concrete cracking are: rust staining along a crack line (indicating the steel reinforcing bar inside the concrete is corroding, which is associated with <Link href="/resources/concrete-cancer-spalling-cost-australia">concrete cancer</Link>); cracks wider than 3mm in a structural element; and cracking accompanied by displacement or spalling (chunks of concrete breaking away from the surface).
      </p>
      <p>
        Concrete cancer — the progressive corrosion of reinforcing steel causing concrete to delaminate — is a significant issue in older Australian apartment buildings and post-tension concrete slabs. If your report mentions rust staining on concrete, treat it with the same seriousness as a structural crack finding.
      </p>

      <h2>What &ldquo;further investigation recommended&rdquo; means for cracks</h2>
      <p>
        Building inspectors are generalists. They are qualified to identify defects and classify their likely severity, but they are not structural engineers, and most operate under Australian Standard AS4349.1, which explicitly limits the scope of a standard building inspection. When an inspector writes &ldquo;further investigation recommended&rdquo; next to a crack finding, it means they have seen something that cannot be resolved within the scope of a visual inspection — they cannot tell you whether it is active or settled, cosmetic or structural, without specialist tools or expertise.
      </p>
      <p>
        This is the point at which you need a structural engineer. A structural engineering assessment typically costs $1,500&ndash;$3,500 for a residential property inspection. The engineer will examine the crack directly, may use monitoring equipment to assess whether it is active, will assess the surrounding structure, and will give you one of three verdicts: settled and stable (just repair it); active but manageable (monitor with crack gauges and reassess in 12 months); or active and requiring rectification (which will come with a scope of works and cost estimate).
      </p>
      <p>
        Do not proceed to exchange on a property with an unresolved structural crack classification. If you are under contract pressure, use that pressure to negotiate either a vendor-funded engineering report or a price reduction that accounts for the full range of potential rectification costs.
      </p>

      <h2>How to use crack findings in a negotiation</h2>
      <p>
        Crack findings from a building inspection are negotiable. How hard you push, and how much you can realistically ask for, depends on how the cracks are classified.
      </p>
      <ul>
        <li>
          <strong>Confirmed cosmetic cracks</strong> — Get two to three repair quotes. Negotiate the midpoint off the purchase price, or ask the vendor to repair before settlement. This is a routine negotiation; most vendors accept it without resistance.
        </li>
        <li>
          <strong>Suspected structural with &ldquo;further investigation recommended&rdquo;</strong> — Negotiate the cost of a structural engineering assessment as a minimum. Depending on the severity of the findings, you can also negotiate an allowance for potential rectification — typically $10,000&ndash;$30,000 as a contingency — or make the contract conditional on a satisfactory engineering report. Alternatively, ask the vendor to commission the engineering report themselves before you exchange.
        </li>
        <li>
          <strong>Confirmed structural cracks with rectification costs</strong> — This is your strongest negotiating position. A confirmed structural defect with a documented cost range of $20,000&ndash;$60,000 gives you clear, unambiguous leverage. Negotiate the full midpoint of the range. If the vendor refuses to move meaningfully, walk-away is a rational option — not an emotional one. A building with a documented structural problem that the vendor won&apos;t discount for will not become easier to deal with after you own it.
        </li>
      </ul>

      <h2>The defect categories with the strongest negotiation leverage</h2>
      <p>
        According to Australian buyer&apos;s agents and conveyancers with experience across hundreds of pre-purchase negotiations, structural cracking consistently ranks as one of the top six defect categories for negotiation leverage. The others are termite activity or damage, active roof leaks, waterproofing failures, electrical safety defects, and non-compliant or unapproved renovations.
      </p>
      <p>
        The reason structural cracking carries such weight is the combination of high cost, clear documentation, and unambiguous liability. Unlike a &ldquo;worn carpet&rdquo; finding (which a vendor can dismiss as cosmetic and subjective), a building inspector&apos;s written finding of stair-step cracking with brick displacement at a structural wall is a documented defect with a known cost range. It is hard to argue with, and competent vendors understand that.
      </p>
      <p>
        If you are reading an AS4349.1 inspection report for the first time and want to understand how all defect categories are classified and what each section means, see our guide on <Link href="/resources/how-to-read-as4349-1-inspection-report">how to read an AS4349.1 building inspection report</Link>.
      </p>

      <h2>What Report Decoded does with crack findings</h2>
      <p>
        When you upload your building inspection PDF to Report Decoded, the analysis specifically looks for crack-related findings and applies the same four-factor framework described in this article. For each crack finding in your report, the analysis will:
      </p>
      <ul>
        <li>
          <strong>Classify it</strong> — Likely cosmetic, likely structural, or unresolved (requires specialist assessment), based on the inspector&apos;s description of type, location, width, and activity.
        </li>
        <li>
          <strong>Estimate the cost range</strong> — Both for the crack repair itself and for any specialist follow-up (structural engineering assessment, underpinning scope) that the classification warrants.
        </li>
        <li>
          <strong>Flag negotiation leverage</strong> — Crack findings that meet the threshold for meaningful price negotiation are called out explicitly, with suggested negotiation language.
        </li>
        <li>
          <strong>Draft a negotiation letter</strong> — If you want to go back to the vendor, the output includes a letter with specific line items for each crack-related defect, with dollar amounts attached. You can hand this to your buyer&apos;s agent or solicitor directly.
        </li>
      </ul>
      <p>
        Analysis takes under 2 minutes and costs $39. If the PDF cannot be analysed, you get a refund. You can also use the negotiation letter on its own without engaging a buyer&apos;s agent — the letter is written to be used directly by the buyer in an email to the selling agent.
      </p>
      <p>
        If you have just received your report and are not sure where to start, see our guide on <Link href="/resources/just-got-building-inspection-report-australia">what to do when you get a building inspection report in Australia</Link>.
      </p>
    </ArticleLayout>
  );
}
