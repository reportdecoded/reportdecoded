import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('how-much-to-negotiate-after-building-inspection');

const faqs = [
  {
    q: 'How much can I usually negotiate off a contract price after a building inspection?',
    a: 'Typical Australian negotiation ranges by property type: pre-1940 character homes with deferred maintenance: $30K–$80K. Post-war brick veneer (1950s–80s) with maintenance backlog: $10K–$30K. Modern (post-2000) home with minor defects: $3K–$15K. New build at PCI: builder rectifies under contract rather than buyer negotiating off price. Coastal / heritage properties scale higher.',
  },
  {
    q: 'Can I walk away from a contract if the building inspection is bad?',
    a: 'Depends on your contract. Most Australian standard contracts include a Building Inspection clause giving you a cooling-off / pre-exchange window to walk away if the inspection finds significant defects (often defined as costing > $X to remediate, typically $5K–$20K threshold). Read your specific clause + check with your conveyancer. Cooling-off periods vary by state.',
  },
  {
    q: 'What\'s the difference between a "Major Defect" and a "Minor Defect" in terms of negotiation?',
    a: 'Major Defects (safety, structural, or significant expenditure) are the primary negotiation drivers — vendors usually expect to compensate or rectify these. Minor Defects (cosmetic, maintenance, wear) are still legitimate negotiation items in aggregate but vendors push back harder on each one individually. Bundle minors into a single capex-backlog number rather than itemising.',
  },
  {
    q: 'Should I ask the vendor to FIX defects or just take money off?',
    a: 'Almost always take money off rather than asking the vendor to fix. Vendor-arranged rectification work is rarely done to your standard, often uses cheapest-trade-available, and you have no recourse if work is poor. Take the dollars and arrange your own trades post-settlement — exactly to your specification.',
  },
  {
    q: 'My agent said the vendor won\'t negotiate. Now what?',
    a: 'Three options. (1) Walk away if you have a cooling-off / inspection clause and the defects exceed your tolerance. (2) Stick to your number and let the vendor decide whether to take a lower offer now or risk re-listing. (3) Use Report Decoded\'s ready-to-send negotiation letter — citing the inspector\'s PDF pages directly puts the vendor in a harder position because the evidence is documented.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="How much should I negotiate after a building inspection?"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Rule of thumb:</strong> the midpoint of your inspector&apos;s
            defect repair-cost estimates is the floor of your negotiation ask.
            On a $1M–$1.5M Australian property with typical pre-purchase findings,
            buyers negotiate <strong>$15K–$80K</strong> off contract price using
            documented inspection evidence. Negotiate in dollars (not vague
            &quot;the place needs work&quot;) and back every number to a page in
            your inspector&apos;s PDF.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={['what-is-as4349-1', 'termite-damage-cost-australia']}
      related_suburbs={['yarraville', 'brunswick', 'hawthorn', 'newtown', 'paddington-sydney']}
    >
      <p>
        Your building inspection report came back. It&apos;s 95 pages. There&apos;s
        termite evidence, a cracked slab edge, deteriorating mortar, and the
        electrical isn&apos;t to current spec. <strong>What number do you put on
        all that?</strong>
      </p>
      <p>
        Most Australian buyers either don&apos;t negotiate (leaving $20–80K on
        the table) or pull a number out of thin air (which the vendor&apos;s
        agent shoots down). Here&apos;s how to do it properly.
      </p>

      <h2>Step 1: Classify every defect into a negotiation bucket</h2>
      <p>Your inspector&apos;s defects fall into three negotiation tiers:</p>

      <h3>Tier A — Hard negotiation items</h3>
      <ul>
        <li><strong>Safety + structural Major Defects</strong> classified per AS4349.1 — termite damage, foundation movement, structural cracking, roof framing failure, asbestos in deteriorated condition.</li>
        <li><strong>Code non-compliance</strong> — electrical without RCDs, smoke alarms not interconnected, balustrade height &lt; 1m, stair tread compliance.</li>
        <li><strong>Items the inspector explicitly says require specialist further investigation</strong> — these often hide bigger costs than the inspector can quantify.</li>
      </ul>
      <p>
        Tier A items demand specific dollar negotiation backed by inspector
        evidence. Vendors expect to compensate or rectify these.
      </p>

      <h3>Tier B — Maintenance backlog negotiation items</h3>
      <ul>
        <li>Deferred painting (especially exterior on timber clad homes)</li>
        <li>Hot water service / gas heater near end-of-life</li>
        <li>Tile-roof restoration overdue</li>
        <li>Original electrical wiring (pre-RCD) needing safety upgrade</li>
        <li>Gutter / downpipe replacement overdue</li>
      </ul>
      <p>
        Tier B items individually look small. Bundle them. Three Tier B
        items × $4K each = $12K of negotiation room hidden as &quot;just
        maintenance.&quot;
      </p>

      <h3>Tier C — Vendor will push back hard</h3>
      <ul>
        <li>Cosmetic items — paint touch-ups, sealant gaps</li>
        <li>Wear and tear on fittings the vendor isn&apos;t replacing</li>
        <li>Anything &quot;you knew this when you offered&quot;</li>
      </ul>
      <p>
        Tier C items are real but vendors will refuse to discount on them.
        Use them as throwaway gives — drop them in the negotiation in
        exchange for a bigger concession on Tier A.
      </p>

      <h2>Step 2: Put a dollar figure on every Tier A + Tier B item</h2>
      <p>
        Your inspector probably WON&apos;T have given you costs (AS4349.1
        doesn&apos;t require it). You need to do this yourself OR use a tool
        like Report Decoded that estimates AU repair costs by defect category.
      </p>

      <p>Some rough Australian benchmarks for typical Tier A defects:</p>
      <ul>
        <li><strong>Termite treatment + AS3660 management plan:</strong> $3K–$8K</li>
        <li><strong>Termite structural damage repair:</strong> $5K–$30K depending on extent (joists / studs / wall plates affected)</li>
        <li><strong>Re-stumping a Queenslander / Victorian cottage:</strong> $15K–$32K</li>
        <li><strong>Slate roof restoration:</strong> $25K–$50K</li>
        <li><strong>Colorbond roof replacement:</strong> $18K–$28K</li>
        <li><strong>Tile-roof restoration (point + paint):</strong> $4K–$10K</li>
        <li><strong>Rising damp DPC injection (per affected wall):</strong> $3K–$8K</li>
        <li><strong>Structural underpinning (front porch / corner):</strong> $15K–$30K</li>
        <li><strong>Foundation engineer&apos;s structural report:</strong> $1.5K–$3K</li>
        <li><strong>Asbestos removal (kitchen / bathroom sheeting):</strong> $1.5K–$6K</li>
        <li><strong>Electrical safety upgrade (full house RCDs):</strong> $1.5K–$3K</li>
        <li><strong>Interconnected smoke alarms (per home):</strong> $400–$900</li>
        <li><strong>Hot water service replacement (gas / electric):</strong> $2K–$4K</li>
        <li><strong>Hydronic / ducted heating service or replace:</strong> $3K–$15K</li>
      </ul>
      <p>
        These are 2025–2026 Australian rates. Coastal properties + heritage
        properties typically run 1.5x–2x higher because of corrosion-grade
        materials + heritage-spec replacement rules.
      </p>

      <h2>Step 3: Build your negotiation number</h2>
      <p>
        Add up all Tier A items at the <strong>midpoint</strong> of each
        repair-cost range. Add 50% of your Tier B total (vendor will haggle
        you down to roughly half). This is your <strong>starting ask</strong>.
      </p>
      <p>
        Example: $750K Yarraville cottage with deferred maintenance:
      </p>
      <ul>
        <li>Termite treatment + 5-yr plan (Tier A): $5K midpoint</li>
        <li>Fungal decay on weatherboards (Tier A): $20K midpoint</li>
        <li>Foundation underpinning at front porch (Tier A): $22K midpoint</li>
        <li>Asbestos eaves removal (Tier A): $3K midpoint</li>
        <li>Electrical safety upgrade (Tier B): $2.5K × 0.5 = $1.25K</li>
        <li>Tile-roof restoration overdue (Tier B): $7K × 0.5 = $3.5K</li>
        <li>Exterior repaint overdue (Tier B): $15K × 0.5 = $7.5K</li>
      </ul>
      <p>
        Starting ask: <strong>$62,250 off contract price.</strong> Realistic
        landing: $40K–$55K.
      </p>

      <h2>Step 4: Write the actual negotiation letter</h2>
      <p>
        The vendor&apos;s agent will assess your seriousness by HOW you present
        the negotiation. Two emails get totally different responses:
      </p>

      <blockquote>
        &quot;The inspection came back with a few issues. We&apos;d like to
        negotiate $50K off.&quot;
      </blockquote>
      <p>vs:</p>

      <blockquote>
        &quot;Following the AS4349.1 inspection completed [date] by [Inspector
        Pty Ltd, licence #1234], the following major defects were identified
        on pages 12, 18, 24, 41, 52, 67, and 81 of the attached report:
        [bulleted list with estimated repair costs].
        Total documented rectification cost is $62,250. We are formally
        requesting a price reduction of $50,000, bringing our offer to
        $700,000. We are in a position to exchange promptly if we can reach
        agreement.&quot;
      </blockquote>

      <p>
        The second one gets taken seriously. Report Decoded auto-generates
        this letter from your inspection PDF, including the page citations.
        Copy-paste-send.
      </p>

      <h2>Step 5: Know your walk-away number</h2>
      <p>
        Before you send the negotiation letter, decide: what&apos;s the LOWEST
        discount you&apos;ll accept and still proceed? What&apos;s the maximum
        rectification cost you&apos;d swallow personally to get the property?
      </p>
      <p>
        Most buyers fail here. They negotiate from emotion (&quot;we love this
        house&quot;) without setting a walk-away. Vendor smells it and refuses.
        Set the line BEFORE you negotiate.
      </p>

      <h2>Tips that matter</h2>
      <ul>
        <li><strong>Always negotiate via the agent in writing.</strong> Email beats text beats phone call. Creates a paper trail and forces the agent to relay your number accurately to the vendor.</li>
        <li><strong>Don&apos;t reveal your walk-away.</strong> Lead with your starting ask. If the agent says &quot;the vendor won&apos;t move,&quot; counter once at a lower number — don&apos;t collapse to your walk-away on the first push-back.</li>
        <li><strong>Cite specific inspector pages, not vague defect categories.</strong> &quot;Termite damage in roof void (p. 47)&quot; beats &quot;structural issues.&quot;</li>
        <li><strong>Use cooling-off / pre-exchange period.</strong> Your contract probably gives you a window. Negotiate INSIDE that window so &quot;walk away&quot; is a real option.</li>
        <li><strong>Don&apos;t apologise.</strong> The defects are documented. You&apos;re not being difficult; you&apos;re being a normal buyer with eyes open.</li>
      </ul>

      <h2>What about new builds (PCI / handover)?</h2>
      <p>
        New-build practical completion inspections work differently. You&apos;re
        already in contract with the builder. You don&apos;t negotiate price down
        — you require the builder to <strong>rectify</strong> the defects
        before sign-off, using the Defects Liability Period (DLP) clause in
        your contract.
      </p>
      <p>
        Report Decoded generates a Builder Rectification Letter instead of a
        Negotiation Letter when you select &quot;new build / handover&quot; at
        upload. It cites every defect against the relevant Australian
        Standard breach so the builder can&apos;t hand-wave away items.
      </p>

      <h2>One more thing</h2>
      <p>
        The single most common mistake: buyers either don&apos;t negotiate at
        all (leaving $20K–$80K on the table on a typical $1M+ purchase) or
        they negotiate too aggressively without evidence (vendor refuses,
        buyer either capitulates or walks).
      </p>
      <p>
        Evidence-led negotiation almost always wins. Your inspector did the
        hard work — finding the defects. Your job is to translate that into
        a dollar number, document it, and put it in front of the vendor in
        a way they can&apos;t dismiss.
      </p>
      <p>
        That&apos;s exactly what Report Decoded does in 2 minutes for $59. But
        even if you do it manually using this guide, the principle is the
        same: <strong>specific defects + specific pages + specific dollar
        amounts = serious negotiation.</strong>
      </p>
    </ArticleLayout>
  );
}
