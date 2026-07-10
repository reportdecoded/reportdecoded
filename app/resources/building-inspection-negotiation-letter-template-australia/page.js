import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('building-inspection-negotiation-letter-template-australia');

const faqs = [
  {
    q: 'Do I send the negotiation letter to the agent or directly to the vendor?',
    a: 'Always to the agent, never directly to the vendor. The selling agent is the vendor\'s legal representative for the transaction — direct contact with the vendor can be construed as bypassing the agent\'s authority and is poor practice. Send the letter via email to the agent with cc: to your conveyancer (so your legal representative has a record). The agent then forwards to the vendor and discusses on your behalf. If you have a buyer\'s agent representing you, they send the letter on your behalf to the selling agent. Don\'t phone-call the negotiation — written is essential because it creates evidence + forces specific responses.',
  },
  {
    q: 'How specific should the dollar amounts be in the letter?',
    a: 'Very specific. Vague asks ("can we knock off something to account for the issues") get vague rejections. Specific asks ("the inspector found 7 items totaling $24,800 in rectification cost — we propose a price reduction of $20,000 against these specific findings") get either accepted, negotiated, or rejected with a counter-offer. Where to get the dollar amounts: from contractor quotes (gold standard, takes 24-48h to obtain), from inspector cost suggestions (silver standard, ranges typical), or from cost-banded analysis tools like Report Decoded ($39, instant). The more verifiable the dollar amount, the less the vendor can push back on it being inflated.',
  },
  {
    q: 'What if my cooling-off period ends before I get contractor quotes?',
    a: 'You have three options: (1) Use inspector-suggested ranges and the AS4349.1 report findings to draft the letter immediately, with quotes to follow within 7 days if the vendor accepts in principle. (2) Use a cost-banded analysis tool to generate quoted ranges instantly. (3) Request a cooling-off extension from the vendor — most agents will grant 24-48h if you\'re engaging in good faith, particularly when major defects have been surfaced. Don\'t let cooling-off run out without a written letter — even an interim letter ("we are commissioning quotes; subject to those, we propose a price reduction in the range of $X-$Y") preserves your negotiating position.',
  },
  {
    q: 'Should I mention specific inspector page references in the letter?',
    a: 'Yes. Inspector page references are the single strongest credibility move in a negotiation letter. Instead of saying "the inspector found termite damage," say "the inspector noted active termite workings to subfloor framing (page 24, photos 47-49) with estimated rectification at $12,000-$18,000." Page references prove you (or your agent) actually read the report and aren\'t making it up. They also force the agent + vendor to verify the claim against the actual inspector\'s findings, which generally lands in your favour. Vendors who get a page-anchored letter take it seriously; vendors who get a "trust me, there are issues" letter dismiss it.',
  },
  {
    q: 'Can I use the negotiation letter to exit the contract entirely?',
    a: 'In states with cooling-off (VIC, NSW, QLD, ACT, SA, TAS), yes — your negotiation letter can be structured to say "we propose either a $X price reduction OR rescission of contract under cooling-off." This gives the vendor a choice between accepting your reduced offer or losing the deal entirely. Powerful when defects are significant. In states without cooling-off (WA, NT, and any auction sale in any state), exit requires either (a) a "subject to building inspection" clause in your contract that you can invoke, (b) statutory defects beyond what the vendor disclosed (rare grounds for rescission via court), or (c) vendor agreement to release. Always have your conveyancer review the exit clause before sending the letter.',
  },
  {
    q: 'What\'s the typical success rate for a negotiation letter?',
    a: 'Buyer\'s agents we\'ve talked to report 60-80% acceptance rates for well-structured letters in normal markets (not boom). Acceptance comes in three forms: full accept (15-25%), partial accept / counter-offer (40-50%), reject (20-35%). The variance depends on: how strong the buyer demand is for that property, how realistic the buyer\'s dollar amount is, how clear the inspector evidence is, and the vendor\'s motivation to sell. Critical findings (structural, termites, asbestos) get better outcomes than cosmetic findings. In a hot market, vendors are more likely to call your bluff; in a soft market, they\'ll engage. Walk in with a defensible number and a willingness to walk away — the buyers who get the biggest reductions are the ones genuinely prepared to exit.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Building inspection negotiation letter template (Australia) — with state examples"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>The buyers who get $20-50K off after a building
            inspection are not the ones who say &ldquo;can we knock
            something off.&rdquo;</strong> They&apos;re the ones who
            send a written, page-anchored, dollar-specific letter
            within cooling-off. Letter structure: subject line + RE
            block + opening + specific findings + total cost + proposed
            adjustment + deadline. Send to the AGENT (never the
            vendor) with conveyancer cc&apos;d. Use inspector page
            references — they&apos;re the strongest credibility move.
            Cost figures from contractor quotes (best) or cost-banded
            analysis (instant). Typical acceptance rate{' '}
            <strong>60-80%</strong> for well-structured letters in
            normal markets. Full sample letters for VIC, NSW, QLD
            below — copy, edit, send.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'how-much-to-negotiate-after-building-inspection',
        'cooling-off-period-building-inspection-rights-by-state',
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-to-write-builder-rectification-letter-australia',
      ]}
      related_suburbs={[
        'brunswick',
        'hawthorn',
        'newtown',
        'bondi',
        'toowong',
      ]}
    >
      <p>
        Your building inspection has landed. There are $34,000 of
        defects across 7 findings. You&apos;re in cooling-off. You
        have until Wednesday at 5pm to send a written response that
        either secures a price reduction or gets you a clean exit.
      </p>
      <p>
        Most Australian buyers in this situation send something like:
      </p>
      <blockquote
        style={{
          borderLeft: '3px solid var(--amber)',
          paddingLeft: 16,
          margin: '16px 0',
          color: 'var(--muted)',
          fontStyle: 'italic',
        }}
      >
        Hi [agent], thanks for sending through the inspection report. There are a few issues we&apos;re concerned about. Can we have a discussion about a possible price adjustment? Looking forward to hearing back.
      </blockquote>
      <p>
        That letter gets rejected 90% of the time. It&apos;s vague.
        It doesn&apos;t prove the buyer has read the report. It
        doesn&apos;t name a number. It gives the vendor no concrete
        thing to accept or reject.
      </p>
      <p>
        The letter that gets accepted looks different. Here&apos;s
        the structure that works, what NOT to include, plus full
        ready-to-use sample letters for VIC, NSW, and QLD.
      </p>

      <h2>Structure of a letter that works</h2>

      <h3>1. Subject line — be direct</h3>
      <p>
        Examples:
      </p>
      <ul>
        <li>
          <em>&ldquo;Re: [Property Address] — Building Inspection
          Findings + Proposed Price Adjustment&rdquo;</em>
        </li>
        <li>
          <em>&ldquo;[Property Address] — Cooling-off Notice +
          Negotiation Proposal&rdquo;</em>
        </li>
      </ul>
      <p>
        Avoid &ldquo;Hi&rdquo; or &ldquo;Quick question&rdquo; — those
        get triaged as low priority.
      </p>

      <h3>2. RE block — give it a paper trail feel</h3>
      <p>
        Three lines at the top of the email body:
      </p>
      <ul>
        <li>Property: [Full address]</li>
        <li>Contract date: [Date]</li>
        <li>Cooling-off period ends: [Date and time]</li>
      </ul>
      <p>
        This signals to the agent that you understand the legal
        framework — vendors and agents engage more seriously when
        the buyer demonstrates contractual awareness.
      </p>

      <h3>3. Opening — set the tone</h3>
      <p>
        Two sentences. Acknowledge the contract is in force. State
        that the inspection has surfaced material findings that require
        commercial resolution. Avoid emotional language
        (&ldquo;we&apos;re really disappointed&rdquo;,
        &ldquo;we love the house but&rdquo;).
      </p>

      <h3>4. The specific findings — page-anchored</h3>
      <p>
        This is the section that drives outcomes. List 3-7 specific
        findings with:
      </p>
      <ul>
        <li>The inspector&apos;s exact wording (in quotes)</li>
        <li>Page reference</li>
        <li>Photo reference if available</li>
        <li>Estimated rectification cost range</li>
      </ul>
      <p>
        Example: <em>&ldquo;Major Defect 2 — Brickwork Step Cracking
        at Multiple Locations (page 18). Inspector notes
        &lsquo;diagonal step cracking through mortar joints at
        several separate points...recommends structural engineer
        assessment.&rsquo; Rectification cost range: $25,000-$80,000
        contingent on engineer&apos;s findings.&rdquo;</em>
      </p>
      <p>
        Don&apos;t list every minor defect — only the items that drive
        the negotiation. List 3-7 substantial findings. Throwing
        in 30 minor items dilutes the impact.
      </p>

      <h3>5. The total + proposed adjustment</h3>
      <p>
        After listing findings, sum them and propose the adjustment:
      </p>
      <p>
        <em>&ldquo;The above 5 items total $54,300-$118,500 in
        estimated rectification cost (engineer-contingent for items
        2 and 3). We propose a price adjustment of $42,000, which
        reflects the mid-range estimated cost of the structural
        items plus full cost of the cosmetic/maintenance items.&rdquo;</em>
      </p>
      <p>
        Three rules:
      </p>
      <ol>
        <li>
          <strong>Don&apos;t ask for the maximum.</strong> Negotiation
          space is essential. Asking for 70-80% of total estimated
          cost gives the vendor room to accept or counter
        </li>
        <li>
          <strong>Be explicit about contingent items.</strong>{' '}
          &ldquo;Engineer-contingent&rdquo; tells the vendor you
          understand which items might come in lower than estimated
        </li>
        <li>
          <strong>Make the number specific.</strong> &ldquo;$42,000&rdquo;
          beats &ldquo;around $40K&rdquo; beats &ldquo;$30-$50K&rdquo;
        </li>
      </ol>

      <h3>6. The deadline + alternatives</h3>
      <p>
        Set an explicit response deadline tied to cooling-off:
      </p>
      <p>
        <em>&ldquo;We require a response by [date and time, at least
        24h before cooling-off ends]. If accepted, we will proceed
        to settlement at the adjusted price of $X. If declined, we
        will exercise our cooling-off rights and rescind the
        contract.&rdquo;</em>
      </p>
      <p>
        This is the &ldquo;or walk&rdquo; option. It signals seriousness
        without being threatening. Vendors get the choice:
        adjusted-price-or-no-sale.
      </p>

      <h3>7. Sign-off — leave it warm</h3>
      <p>
        Final sentence is collaborative: <em>&ldquo;We remain genuinely
        interested in proceeding at an adjusted price that reflects
        the findings. Available for a call to discuss.&rdquo;</em>
      </p>
      <p>
        This isn&apos;t adversarial — it&apos;s commercial. The vendor
        is more likely to accept if they feel the buyer wants to
        close the deal at a fair number, not punish them.
      </p>

      <h2>What NOT to include</h2>
      <ul>
        <li>
          <strong>Personal financial circumstances.</strong> Don&apos;t
          mention what you&apos;ve had to borrow, deposit size, or that
          you&apos;re a first-home buyer. Irrelevant + weakens position
        </li>
        <li>
          <strong>Emotional language.</strong> &ldquo;Heartbroken,&rdquo;
          &ldquo;devastated,&rdquo; &ldquo;love this property&rdquo; —
          all signal you won&apos;t walk away
        </li>
        <li>
          <strong>Justifications for your number.</strong> Don&apos;t
          explain why you can&apos;t afford the original price. The
          basis is the defects, not your finances
        </li>
        <li>
          <strong>Direct attacks on the vendor.</strong> Don&apos;t say
          they hid defects. Even if they did, your remedy is via the
          contract, not the letter
        </li>
        <li>
          <strong>Vague threats.</strong> &ldquo;Lawyers will be
          involved if not resolved&rdquo; sounds amateur. Either
          you&apos;re prepared to act or you&apos;re not
        </li>
        <li>
          <strong>Counter-offers within counter-offers.</strong>{' '}
          &ldquo;We&apos;d accept $40K, but could go down to $30K if
          needed&rdquo; — telegraphs your bottom line. State one
          number
        </li>
      </ul>

      <h2>Sample letter — VIC (private treaty, cooling-off)</h2>
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '20px 22px',
          margin: '16px 0',
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <p style={{ marginTop: 0 }}>
          <strong>Subject:</strong> 47 Sample Street, Brunswick VIC 3056 — Building Inspection Findings + Negotiation Proposal
        </p>
        <p>
          Hi [Agent name],
        </p>
        <p>
          Re: 47 Sample Street, Brunswick VIC 3056<br />
          Contract date: 28 May 2026<br />
          Cooling-off period ends: 4 June 2026, 5:00 PM (3 business days)
        </p>
        <p>
          The independent building & pest inspection completed by [Inspector name, license number] on 30 May 2026 has surfaced findings that require commercial resolution before we can proceed to settlement.
        </p>
        <p>
          <strong>Material findings:</strong>
        </p>
        <ol style={{ paddingLeft: 18 }}>
          <li>
            Major Defect 1 — Rising damp to lower courses of front and rear walls (page 14, photos 22-26). Inspector notes &ldquo;elevated moisture readings 800mm above floor level...recommend chemical DPC injection treatment.&rdquo; Rectification cost range: $4,500-$8,500.
          </li>
          <li>
            Major Defect 2 — Active termite workings to subfloor stumps (page 21, photos 34-37). Inspector notes &ldquo;mud tubes and frass to three subfloor stumps in north-east corner...active treatment required.&rdquo; Rectification cost range: $3,500-$7,500.
          </li>
          <li>
            Major Defect 3 — Asbestos cement sheeting to garage and eaves (page 28). Inspector notes &ldquo;suspect ACM material...recommend lab testing prior to renovation. Removal required if renovation planned.&rdquo; If removal required: $4,000-$8,000.
          </li>
          <li>
            Significant Defect 4 — Substandard electrical wiring to original portion of house (page 33). Inspector notes &ldquo;exposed/perished insulation, no RCD on lighting circuit, requires upgrade.&rdquo; Rectification: $4,000-$6,500.
          </li>
          <li>
            Significant Defect 5 — Roof tile failure across western elevation (page 35, photos 48-52). Inspector notes &ldquo;cracked and slipped tiles, lead flashing deterioration, partial re-roof recommended.&rdquo; Rectification: $7,500-$14,000.
          </li>
        </ol>
        <p>
          The above 5 items total $23,500-$44,500 in estimated rectification cost. We propose a price adjustment of <strong>$26,000</strong>, which reflects the mid-range cost of these defects.
        </p>
        <p>
          Please confirm acceptance, counter-offer, or rejection by <strong>3 June 2026, 5:00 PM</strong> (24h before cooling-off ends). If accepted, we will proceed to settlement at the adjusted price. If declined, we will exercise our cooling-off rights and rescind the contract under Section 31 of the Sale of Land Act 1962 (VIC).
        </p>
        <p>
          We remain genuinely interested in proceeding at an adjusted price that reflects the findings. Available for a call to discuss.
        </p>
        <p>
          Regards,<br />
          [Buyer name]<br />
          cc: [Conveyancer name + email]
        </p>
      </div>

      <h2>Sample letter — NSW (private treaty, cooling-off)</h2>
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '20px 22px',
          margin: '16px 0',
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <p style={{ marginTop: 0 }}>
          <strong>Subject:</strong> 12/85 Sample Road, Newtown NSW 2042 — Building Inspection + Strata Findings + Adjustment Proposal
        </p>
        <p>
          Hi [Agent name],
        </p>
        <p>
          Re: 12/85 Sample Road, Newtown NSW 2042<br />
          Contract date: 27 May 2026<br />
          Cooling-off period ends: 3 June 2026, 5:00 PM (5 business days — Section 66W not waived)
        </p>
        <p>
          The independent building inspection completed by [Inspector name, license number] on 30 May 2026, combined with the strata records inspection completed by [Inspector name] on 31 May 2026, have together surfaced findings that require resolution before we can proceed to settlement.
        </p>
        <p>
          <strong>Material findings (building inspection):</strong>
        </p>
        <ol style={{ paddingLeft: 18 }}>
          <li>
            Major Defect 1 — Concrete cancer to underside of balcony slab (page 11, photos 18-21). Inspector notes &ldquo;exposed rebar with rust staining...further investigation by structural engineer recommended.&rdquo; Rectification cost range (subject to engineer): $8,000-$25,000.
          </li>
          <li>
            Major Defect 2 — Water ingress evidence to bathroom waterproofing (page 16). Inspector notes &ldquo;efflorescence and mould growth to adjoining wall...waterproofing rectification required.&rdquo; Rectification: $5,500-$10,000.
          </li>
          <li>
            Significant Defect 3 — Window seal degradation across western facade (page 22). Inspector notes &ldquo;rubber seals perished, water entry risk during southerly weather.&rdquo; Rectification: $3,500-$6,500.
          </li>
        </ol>
        <p>
          <strong>Material findings (strata records):</strong>
        </p>
        <ol start={4} style={{ paddingLeft: 18 }}>
          <li>
            Special levy approved at AGM on 12 April 2026 for cladding rectification across building facade — not yet billed. Per-lot exposure: $14,500. (Reference: AGM minutes page 47, Motion 7.)
          </li>
          <li>
            Sinking fund deficit of approximately $180,000 against 10-year maintenance plan. Future special levy probability: high within 24 months.
          </li>
        </ol>
        <p>
          The above items total $31,500-$55,000 in estimated immediate exposure (excluding sinking fund risk). We propose a price adjustment of <strong>$32,500</strong>.
        </p>
        <p>
          Please confirm acceptance, counter-offer, or rejection by <strong>2 June 2026, 5:00 PM</strong> (24h before cooling-off ends). If accepted, we will proceed to settlement at the adjusted price. If declined, we will exercise our cooling-off rights and rescind under Section 66W of the Conveyancing Act 1919 (NSW), forfeiting 0.25% as per statute.
        </p>
        <p>
          We remain genuinely interested in proceeding at an adjusted price that reflects the findings. Available for a call to discuss.
        </p>
        <p>
          Regards,<br />
          [Buyer name]<br />
          cc: [Conveyancer name + email]
        </p>
      </div>

      <h2>Sample letter — QLD (private treaty, conditional contract)</h2>
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '20px 22px',
          margin: '16px 0',
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <p style={{ marginTop: 0 }}>
          <strong>Subject:</strong> 22 Sample Lane, Toowong QLD 4066 — Building & Pest Findings + Adjustment Proposal
        </p>
        <p>
          Hi [Agent name],
        </p>
        <p>
          Re: 22 Sample Lane, Toowong QLD 4066<br />
          Contract date: 28 May 2026<br />
          Subject to building & pest condition ends: 4 June 2026 (Standard REIQ Clause 4.1 condition)
        </p>
        <p>
          The independent building & pest inspection completed by [Inspector name, BSA license number] on 31 May 2026 has surfaced findings that require commercial resolution before we satisfy the building & pest condition and proceed to settlement.
        </p>
        <p>
          <strong>Material findings:</strong>
        </p>
        <ol style={{ paddingLeft: 18 }}>
          <li>
            Major Defect 1 — Active termite activity to subfloor framing (page 19, photos 28-32). Inspector notes &ldquo;visible mud tubes and frass to bearer/joist intersection...immediate chemical barrier treatment required, structural timber replacement likely.&rdquo; Treatment + repair cost: $8,500-$22,000.
          </li>
          <li>
            Major Defect 2 — Roof tile widespread deterioration (page 24). Inspector notes &ldquo;multiple cracked and slipped tiles, lead flashing failure...partial or full re-roof required.&rdquo; Rectification: $14,000-$24,000.
          </li>
          <li>
            Significant Defect 3 — Stumping subsidence to rear corner (page 31). Inspector notes &ldquo;floor unevenness consistent with stump rotation, replacement and relevelling required.&rdquo; Rectification: $8,000-$15,000.
          </li>
          <li>
            Significant Defect 4 — Hardwired smoke alarm non-compliance with QFRS standards (page 36). Inspector notes &ldquo;battery-only alarms, photoelectric upgrade required to current standard.&rdquo; Rectification: $1,500-$2,500.
          </li>
        </ol>
        <p>
          The above 4 items total $32,000-$63,500 in estimated rectification cost. We propose a price adjustment of <strong>$38,000</strong>, which reflects the mid-range cost of the termite + roof items plus the stump and compliance items.
        </p>
        <p>
          Please confirm acceptance, counter-offer, or rejection by <strong>3 June 2026, 5:00 PM</strong> (24h before the building & pest condition expires). If accepted, we will satisfy the building & pest condition and proceed to settlement at the adjusted price. If declined, we will terminate the contract under Clause 4.1 of the standard REIQ contract.
        </p>
        <p>
          We remain genuinely interested in proceeding at an adjusted price that reflects the findings. Available for a call to discuss.
        </p>
        <p>
          Regards,<br />
          [Buyer name]<br />
          cc: [Conveyancer/solicitor name + email]
        </p>
      </div>

      <h2>WA-specific note (no cooling-off)</h2>
      <p>
        Western Australia has no statutory cooling-off period. Your
        exit lives in the contract&apos;s &ldquo;subject to building
        inspection&rdquo; clause. The letter structure is identical
        except the deadline + exit grounds reference the inspection
        clause specifically rather than cooling-off. See{' '}
        <Link href="/resources/perth-building-inspection-wa-buyer-guide">
          Perth building inspection — WA buyer&apos;s playbook
        </Link>{' '}
        for the contract-clause framework.
      </p>

      <h2>What happens after you send it</h2>
      <p>
        Three typical outcomes:
      </p>
      <ol>
        <li>
          <strong>Vendor accepts (15-25%):</strong> Agent comes back
          with &ldquo;vendor accepts at $X.&rdquo; Conveyancer prepares
          contract variation. Settlement proceeds at adjusted price.
        </li>
        <li>
          <strong>Vendor counter-offers (40-50%):</strong> Agent comes
          back with &ldquo;vendor will accept $Y&rdquo; where Y is
          between original price and your proposed adjustment. You
          counter-counter once, then accept or walk
        </li>
        <li>
          <strong>Vendor rejects (20-35%):</strong> Agent comes back
          with &ldquo;vendor declines, expects you to proceed at full
          price.&rdquo; You exercise cooling-off + rescind, or
          surrender the small forfeit and walk. Most agents will then
          come back with a softer position within 24h if the property
          isn&apos;t hot
        </li>
      </ol>

      <h2>The discipline that gets you paid</h2>
      <p>
        Buyers who walk away from inadequate counters end up with
        better outcomes than buyers who accept anything. The
        psychology: vendors with the property re-listed at the same
        price come back to you within weeks with terms closer to your
        original ask. The buyer who got &ldquo;rejected&rdquo; on
        Monday often gets &ldquo;reconsidered, vendor will accept&rdquo;
        on Thursday.
      </p>
      <p>
        That only works if you&apos;re genuinely prepared to walk.
        The buyers who lose are the ones who broadcast attachment
        (&ldquo;we love it, please anything&rdquo;) or panic
        (&ldquo;we&apos;ll accept anything to avoid losing it&rdquo;).
        Stay commercial. The transaction either works at a price that
        reflects the defects or it doesn&apos;t.
      </p>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded reads your inspection PDF and produces the
        page-anchored, dollar-quantified findings list that goes
        into the &ldquo;material findings&rdquo; section of the
        letter. Instead of you spending 2-4 hours translating the
        inspector&apos;s technical terms into cost figures, the
        analysis arrives in your inbox 2 minutes after upload — with
        each finding broken down as:
      </p>
      <p>
        <em>&ldquo;Major Defect 2 — Brickwork Step Cracking at Multiple
        Locations (page 18). Inspector cited multi-location through-brick
        cracking pattern. Cost band: $25,000-$80,000 contingent on
        structural engineer (recommended). Specialist follow-up cost:
        $1,500-$3,500.&rdquo;</em>
      </p>
      <p>
        You then copy-paste those findings into the letter template
        above, total the figures, propose your adjustment, and send.
        The total time from inspection PDF to letter sent is about
        45 minutes instead of an evening.
      </p>
      <p>
        For the broader framework on translating defects to
        negotiation dollar amounts, see{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          how much to negotiate after a building inspection
        </Link>
        .
      </p>
    </ArticleLayout>
  );
}
