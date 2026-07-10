import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('electrical-safety-building-inspection-australia');

const faqs = [
  {
    q: 'What is an RCD and do I need one?',
    a: 'An RCD (residual current device), also called a safety switch, monitors the flow of electricity through a circuit and cuts power within 30 milliseconds if it detects a fault — fast enough to prevent electrocution. Circuit breakers protect against overloads and short circuits, but they are not fast enough to prevent a fatal electric shock. Australian standards have required RCDs on new homes since 1991 and on all power circuits since 2000. If your building inspection report notes no RCD protection, this is a genuine safety issue that must be rectified. A licensed electrician can install RCDs on all power and lighting circuits for approximately $300–$600.',
  },
  {
    q: 'My inspector recommended a licensed electrician assessment — how much does that cost?',
    a: 'A licensed electrician safety inspection typically costs $150–$400 depending on the size of the property and your location. This is separate from any rectification work. After the inspection, the electrician can provide a written report detailing required work and costs — exactly what you need to negotiate with the vendor. It is worth arranging this before exchange, not after, so you have specific dollar figures and can use them in your negotiation or make an informed decision about whether to proceed.',
  },
  {
    q: 'Can I negotiate electrical issues even though they are just maintenance?',
    a: 'Absolutely — and electrical issues are actually among the strongest negotiation items you can raise. Unlike cosmetic defects, electrical safety issues are mandatory to rectify under Australian standards. Vendors cannot argue that RCD installation or smoke alarm compliance is optional or purely aesthetic. The fact that licensed rectification is required (not DIY) means costs are documented and verifiable. A clear negotiation letter citing specific findings, applicable standards, and written quotes from a licensed electrician is highly effective. Include each electrical item as a separate line with its estimated rectification cost.',
  },
  {
    q: 'What are the smoke alarm rules for buying a house in Queensland?',
    a: 'Queensland has the most stringent smoke alarm requirements in Australia. Since 1 January 2022, properties being sold must have interconnected photoelectric smoke alarms installed in every bedroom, in hallways connecting bedrooms to the rest of the home, and on every storey. They must be hardwired if the property was built or substantially renovated after 1 January 1997, or 10-year lithium battery powered if older. Sellers are legally required to ensure compliance before settlement. If a Queensland building inspection flags non-compliant smoke alarms, this is the vendor&apos;s obligation to rectify — raise it with your conveyancer as well as in your building negotiation.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Electrical safety findings on your building inspection report: what Australian buyers need to know"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            Electrical findings in Australian building inspection reports range from <strong>no RCD protection ($300–$600 to install)</strong> to <strong>unsafe rubber-insulated wiring requiring a full rewire ($8,000–$25,000)</strong>. The type of finding determines the risk and cost. Here&apos;s what each common electrical finding means, what it costs to rectify, and whether it&apos;s a negotiation point, a safety concern, or a routine maintenance item.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'how-to-read-as4349-1-inspection-report',
        'just-got-building-inspection-report-australia',
        'non-compliant-renovations-building-inspection-australia',
        'building-inspection-report-no-cost-estimates-australia',
      ]}
      related_suburbs={[
        'west-footscray',
        'annerley',
        'nundah',
        'spearwood',
        'tea-tree-gully',
      ]}
    >
      <p>
        Your building inspection report mentions something electrical. Maybe it&apos;s &ldquo;no RCD protection observed at the switchboard.&rdquo; Maybe it&apos;s &ldquo;smoke alarms do not comply with current Australian standards.&rdquo; Or perhaps the inspector has written &ldquo;wiring inspected appears to be original — assessment by a licensed electrician is recommended.&rdquo; You are now trying to work out whether this is a serious safety problem, an expensive repair, a negotiation lever, or something you can simply note and move on from.
      </p>
      <p>
        The answer depends almost entirely on which finding it is. Electrical findings in Australian building inspections cover an enormous range — from a $300 safety switch installation to a $25,000 full rewire. Here is how to read and respond to each of the most common electrical findings in an Australian building inspection report.
      </p>

      <h2>What building inspectors can and can&apos;t assess for electrical</h2>
      <p>
        Before interpreting any electrical finding, it helps to understand the limits of a standard building inspection. Under <Link href="/resources/how-to-read-as4349-1-inspection-report">AS4349.1</Link> — the Australian standard that governs residential building inspections — inspectors conduct a visual assessment only. They are not licensed electricians and are not authorised to perform electrical testing or certify electrical compliance.
      </p>
      <p>
        What a building inspector can observe and report on includes: the general condition and age of the switchboard, whether RCDs (safety switches) are present, smoke alarm locations and apparent type, any visible wiring condition, and any wiring that is obviously unsafe or non-compliant in a way that is accessible to the naked eye.
      </p>
      <p>
        What a building inspector cannot do: open walls to inspect concealed wiring, test circuit loading or capacity, measure voltage or continuity, or issue any form of electrical compliance certificate. This is important because it means an inspector saying &ldquo;wiring appears original&rdquo; is an observation, not a diagnosis. The definitive assessment — and the cost figure — comes from a licensed electrician.
      </p>
      <p>
        If your report contains a significant electrical finding, the standard recommended next step is an assessment by a licensed electrician before exchange. This costs $150–$400 for most properties and gives you a specific, costed report you can use to negotiate.
      </p>

      <h2>The five most common electrical findings — what each means and costs</h2>

      <h3>Finding 1: No RCD (safety switch) protection</h3>
      <p>
        This is one of the most frequently flagged electrical findings in older Australian homes, and it is also one of the most important. An RCD — residual current device, also called a safety switch — monitors the flow of electricity through a circuit and cuts power within 30 milliseconds if it detects a fault. That is fast enough to prevent electrocution. A standard circuit breaker protects against overloads and short circuits, but it reacts far too slowly to prevent a fatal shock from a faulty appliance or damaged cord.
      </p>
      <ul>
        <li><strong>Australian standard</strong> — RCDs have been mandatory in all new homes since 1991, and mandatory on all power circuits since approximately 2000. Requirements vary slightly by state.</li>
        <li><strong>Risk level</strong> — High. This is a genuine safety deficiency, not a cosmetic issue.</li>
        <li><strong>Cost to rectify</strong> — $300–$600 for a licensed electrician to install RCDs across all power and lighting circuits. This is a defined, fixed-scope job.</li>
        <li><strong>Negotiation potential</strong> — Strong. This is a safety-mandatory item with a clear, documented cost. Include it as a line item in any negotiation letter.</li>
      </ul>

      <h3>Finding 2: Smoke alarms non-compliant</h3>
      <p>
        Smoke alarm requirements in Australia have become significantly more stringent over the past decade, and compliance requirements at the point of sale vary by state. A building inspection report flagging non-compliant smoke alarms could mean any of the following: the alarms are the wrong type (ionisation rather than the now-required photoelectric); there are insufficient alarms for the layout; they are not correctly located; or they are not interconnected as required.
      </p>
      <ul>
        <li><strong>Risk level</strong> — Medium to high. Smoke alarms are critical life safety equipment. Non-compliance is not a minor maintenance item.</li>
        <li><strong>Cost to rectify</strong> — $500–$1,500 depending on the number of alarms required, whether hardwiring is needed, and the property&apos;s age and layout.</li>
        <li><strong>State rules vary significantly</strong> — Queensland has the most aggressive requirements (see the FAQ below). NSW, VIC, WA, and SA each have their own compliance timeframes and requirements. Your conveyancer can confirm what applies to the specific property.</li>
        <li><strong>Negotiation potential</strong> — Strong in states where compliance is a vendor obligation at settlement. In Queensland, in particular, this is the vendor&apos;s problem to fix, not yours to negotiate — raise it with your conveyancer.</li>
      </ul>

      <h3>Finding 3: Old wiring — rubber-insulated or TRS wiring</h3>
      <p>
        This is the most serious electrical finding a building inspector can flag. Homes built before the 1970s — and some built into the early 1980s — may contain rubber-insulated wiring, also described in reports as &ldquo;TRS wiring&rdquo; (tough rubber sheathed) or &ldquo;original wiring.&rdquo; Rubber insulation becomes brittle and cracks with age. Cracked insulation exposes live conductors, creating a genuine fire and electrocution hazard that worsens over time.
      </p>
      <ul>
        <li><strong>Inspector language to look for</strong> — &ldquo;original wiring observed throughout,&rdquo; &ldquo;rubber-insulated wiring noted,&rdquo; &ldquo;TRS wiring observed,&rdquo; &ldquo;wiring appears consistent with original installation — licensed electrician assessment strongly recommended.&rdquo;</li>
        <li><strong>Risk level</strong> — High. Aged rubber wiring is one of the leading causes of electrical fires in older Australian homes.</li>
        <li><strong>Cost to rectify</strong> — A full rewire costs $8,000–$25,000 depending on property size, the number of circuits, and access difficulty. This is a major cost item, and it is the reason why this finding, above almost any other electrical finding, warrants a licensed electrician assessment before exchange — not after.</li>
        <li><strong>Negotiation potential</strong> — Very high. This is a legitimate deal-level negotiation item. A written electrician&apos;s quote for a full rewire, presented alongside the inspection report finding, is a strong basis for a price reduction or vendor contribution. At minimum, use it to negotiate the electrician assessment cost off the purchase price while you decide whether to proceed.</li>
      </ul>

      <h3>Finding 4: Switchboard issues</h3>
      <p>
        The switchboard is where your home&apos;s electrical supply is distributed to individual circuits. Older switchboards — particularly those with ceramic fuse carriers rather than circuit breakers — are a common finding in pre-1980s Australian homes. Ceramic fuse carriers are unreliable, can be replaced with incorrect fuse wire (creating fire risk), and do not offer the protection of modern circuit breakers. Other switchboard findings include insufficient capacity for modern electrical loads (increasingly relevant as homes add air conditioning, EV chargers, and solar) or overloaded circuits.
      </p>
      <ul>
        <li><strong>Cost to rectify</strong> — A switchboard upgrade typically costs $2,000–$5,000 for a standard residential property. This is also the point at which RCDs and modern circuit breakers are installed.</li>
        <li><strong>Risk level</strong> — Medium to high, particularly for ceramic fuse boards.</li>
        <li><strong>Negotiation potential</strong> — Good. A switchboard upgrade is a documented, licensed-tradesperson job with a clear cost. Include it as a line item.</li>
      </ul>

      <h3>Finding 5: Non-compliant wiring or evidence of unlicensed electrical work</h3>
      <p>
        Inspectors are trained to recognise signs of electrical work that was not done by a licensed electrician — added power points with non-standard fittings, circuits extended without proper installation, junction boxes in accessible locations without appropriate covers, or wiring runs that do not follow standard practice. This category also includes the aftermath of DIY renovations where electrical circuits were modified without permits or licensed tradespeople.
      </p>
      <ul>
        <li><strong>Risk level</strong> — Variable, but potentially high. Unlicensed electrical work is a fire risk from overloaded circuits and loose connections, and it creates permit and compliance issues that affect your ability to insure and eventually sell the property.</li>
        <li><strong>Cost to rectify</strong> — Ranges from $500 for isolated rectification of minor unlicensed additions to $5,000 or more if the non-compliant work is widespread. This finding often overlaps with <Link href="/resources/non-compliant-renovations-building-inspection-australia">non-compliant renovation issues</Link> more broadly.</li>
        <li><strong>Negotiation potential</strong> — Strong, but the scope needs to be established by a licensed electrician first. Get a written assessment and quote before negotiating.</li>
      </ul>

      <h2>Electrician follow-up — what to ask for</h2>
      <p>
        If your building inspection report flags any of the findings above — particularly old wiring, switchboard issues, or non-compliant work — the right next step is an assessment by a licensed electrician before exchange. This is different from the building inspection: a licensed electrician can open switchboards, test circuits, and identify the full scope of what needs rectifying.
      </p>
      <p>
        When booking the inspection, ask for a &ldquo;safety inspection&rdquo; or &ldquo;pre-purchase electrical assessment.&rdquo; The electrician should provide a written report listing specific defects, applicable standards, and estimated rectification costs. After any required work is done, they can issue a safety certificate. That written report — even if you don&apos;t proceed with the rectification — is the document you need to negotiate with the vendor.
      </p>
      <p>
        Cost: $150–$400 for the inspection, depending on property size and your state. Rectification costs are additional and depend entirely on what the inspection finds. Arrange this before exchange, not after — once you have exchanged contracts, your negotiating position is gone.
      </p>

      <h2>Electrical findings and negotiation</h2>
      <p>
        Electrical findings are among the most negotiation-friendly items in any building inspection report. There are three reasons for this.
      </p>
      <p>
        First, they are safety-related. A vendor cannot credibly argue that RCD installation or a switchboard upgrade is cosmetic or optional. These are mandatory safety requirements under Australian standards. Second, they are clearly documentable — a licensed electrician will give you a written quote that the vendor cannot easily dispute. Third, licensed rectification is required; this is not work a homeowner can do themselves, so the cost is verifiable and defensible.
      </p>
      <p>
        Here is a rough guide to how each electrical finding should be treated in negotiation:
      </p>
      <ul>
        <li><strong>No RCD protection</strong> — Include as a specific line item. Estimated cost $300–$600. This is a straightforward, low-cost negotiation point that vendors rarely resist.</li>
        <li><strong>Non-compliant smoke alarms</strong> — Include as a line item. Estimated cost $500–$1,500. In states where this is a vendor obligation at sale, escalate to your conveyancer.</li>
        <li><strong>Old rubber-insulated wiring</strong> — This is a major negotiation item. Obtain an electrician&apos;s written quote for a full rewire ($8,000–$25,000) before negotiating. Use this to seek a meaningful price reduction or vendor contribution. If the vendor refuses to engage, consider whether the property is appropriately priced for its condition.</li>
        <li><strong>Switchboard upgrade</strong> — Include as a line item. Estimated cost $2,000–$5,000. Ceramic fuse boards are a documented safety deficiency; this is not a grey area.</li>
        <li><strong>Non-compliant or unlicensed wiring</strong> — Get a written quote for rectification first. Use the quote in negotiation. Also ask your conveyancer whether the unlicensed work affects permit history or insurance.</li>
      </ul>

      <h2>State-specific smoke alarm requirements</h2>
      <p>
        Smoke alarm compliance requirements at the point of property sale are set by each state and territory, and they are not uniform. Here is a brief overview:
      </p>
      <ul>
        <li><strong>Queensland</strong> — The most stringent in Australia. Since 1 January 2022, all properties being sold must have interconnected photoelectric smoke alarms in every bedroom, in hallways serving bedrooms, and on every storey. Hardwired where the property was built or substantially renovated after 1 January 1997. This is a vendor obligation.</li>
        <li><strong>New South Wales</strong> — Smoke alarms must be installed on every level of the home. Photoelectric alarms have been required since 2006. Interconnection requirements apply to new builds and significant renovations. Check specific obligations with your conveyancer for the property&apos;s construction date.</li>
        <li><strong>Victoria</strong> — Smoke alarms must be installed on every level. From 1 May 2014, new and replacement alarms must be photoelectric. Hardwiring requirements apply to new builds and major renovations.</li>
        <li><strong>Western Australia</strong> — Alarms required on each storey and in each sleeping area. Photoelectric alarms required for new installations since 2009.</li>
        <li><strong>South Australia</strong> — Alarms required on each level and in corridors adjacent to sleeping areas. Photoelectric alarms required for new installations since 2014.</li>
      </ul>
      <p>
        State requirements change and compliance obligations at sale vary. Your conveyancer is the right person to confirm what specifically applies to the property you are buying. If your building inspection report flags smoke alarm non-compliance, raise it with your conveyancer as well as including it in your building negotiation.
      </p>

      <h2>What Report Decoded does with electrical findings</h2>
      <p>
        If the electrical findings in your building inspection report are leaving you uncertain about risk, cost, or what to do next, Report Decoded can help. Upload your PDF at <strong>reportdecoded.com.au</strong> and in under 2 minutes you get a plain-English breakdown of every finding in the report — including electrical items.
      </p>
      <p>
        For each electrical finding, Report Decoded explains what it means, flags whether it is a mandatory safety item or advisory observation, provides cost estimates for rectification based on current Australian trades pricing, and identifies whether it is a strong, medium, or weak negotiation point. The output also includes a negotiation letter you can send directly to the vendor&apos;s agent, with electrical findings listed as specific line items alongside cost estimates. Where the report recommends a licensed electrician follow-up, that recommendation is flagged clearly so you know the exact next step.
      </p>
      <p>
        A single report costs $39. If your PDF cannot be analysed, you get a full refund. It is the fastest way to turn a confusing inspection report into a clear action plan — and a negotiation-ready letter.
      </p>
    </ArticleLayout>
  );
}
