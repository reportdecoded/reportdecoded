import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('strata-report-explained-australia');

const faqs = [
  {
    q: 'What\'s the difference between a strata report and an Owners Corporation certificate?',
    a: 'They\'re related but not identical. An Owners Corporation certificate (Victoria) or Section 184 certificate (NSW) is a short statutory document — typically 2-5 pages — that the OC/strata manager is legally required to issue on request. It lists current levies, unpaid amounts, insurance status, and notice of any pending special levies. A full strata report (also called a strata records inspection in NSW or an OC records inspection in VIC) goes much deeper — a third-party inspector reviews the scheme\'s records (AGM minutes, committee minutes, financials, sinking fund, building defects history, insurance claims, by-laws, special levy history) and writes a 30-100 page summary. The certificate is a snapshot. The full report is a forensic audit. For a meaningful purchase decision you want both, or at minimum a full inspection.',
  },
  {
    q: 'Who pays for the strata report — buyer or vendor?',
    a: 'In practice it varies by state and contract. NSW: the buyer almost always pays — typical cost $250-$450 for a strata records inspection commissioned through a specialist firm. Victoria: the vendor must provide a current OC certificate as part of the Section 32 vendor statement (vendor pays for that), but if you want a deeper OC records inspection, the buyer commissions it ($300-$500). QLD: the vendor typically provides a body corporate disclosure statement at their cost; buyer can commission a more detailed search if they want. The headline number: budget $300-$500 for proper strata due diligence on any AU apartment purchase. It\'s the cheapest insurance you\'ll buy in the transaction.',
  },
  {
    q: 'Can I rely on the vendor\'s strata report or do I need my own?',
    a: 'Vendor-supplied certificates (the short statutory ones — VIC OC certificate, QLD body corp disclosure, NSW S184 if provided) are reliable for what they cover. But they\'re snapshots — they tell you what levies are owing today, not what\'s coming. A vendor-commissioned full strata report is technically usable but you\'re relying on their inspector\'s scope, their date of inspection (often months old by settlement), and their willingness to highlight unflattering issues. Best practice: always commission your own full strata records inspection if the vendor hasn\'t provided one less than 30 days old, and even if they have, read it yourself rather than relying on the conveyancer\'s summary.',
  },
  {
    q: 'What\'s a Section 184 certificate (NSW)?',
    a: 'Section 184 of the NSW Strata Schemes Management Act 2015 requires the owners corporation to issue a certificate to any owner or buyer on request. It must include: current quarterly levies for the lot, any unpaid contributions, the insurance details for the common property, and any notice of pending special levies or by-law changes. Cost is regulated — currently around $32 for the certificate itself, though most strata managers charge a service fee on top. The S184 is the bare minimum NSW disclosure. The full strata records inspection (which a NSW buyer commissions privately) is where the real diligence happens — minutes, financials, defect history, sinking fund adequacy.',
  },
  {
    q: 'What if there\'s a special levy already approved but not yet billed?',
    a: 'This is the single most expensive thing buyers miss in strata reports. A special levy approved at a recent general meeting but not yet billed will appear in the OC/body corp meeting minutes — which is why the FULL strata report (which includes minutes review) matters more than the short certificate. Common scenarios: building defects rectification approved for $400,000 across 40 lots = $10,000 per lot pending. Lift replacement approved for $180,000 across 24 lots = $7,500 per lot. Waterproofing remediation $250,000 across 30 lots = $8,300 per lot. If the levy is approved before settlement, the legal question of whether buyer or vendor pays depends on your contract — but you can negotiate it. If you miss the approval entirely and find out post-settlement, you\'re paying.',
  },
  {
    q: 'How recent does the strata report need to be?',
    a: 'For meaningful due diligence: less than 30 days old at the time you make your offer, refreshed before settlement if more than 60 days have passed between offer and settlement. Strata schemes can hold extraordinary general meetings at any time. A report dated 3 months before settlement could miss a special levy approved last week. Most strata reports include a "currency clause" stating they\'re only current as of the inspection date — the inspector isn\'t liable for changes after that. If your contract is going to a long settlement (60+ days), include a clause requiring a refreshed strata report 5 business days before settlement at vendor\'s cost.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Strata report explained: the Australian apartment buyer's guide (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>If you&apos;re buying any AU apartment, unit, or
            townhouse in a strata/OC scheme, the strata report is the
            most expensive document you can skip.</strong> The short
            statutory certificate (VIC OC certificate, NSW S184, QLD
            body corp disclosure) is a snapshot of current levies. The
            full strata records inspection ($300-$500, buyer-
            commissioned) is the forensic audit — meeting minutes,
            sinking fund, special levies, defect history, by-laws,
            insurance claims. <strong>The single most expensive miss
            is a special levy approved at a meeting but not yet billed
            </strong> — $5,000-$15,000+ per lot is common. Get a full
            report less than 30 days old. Read it yourself. Refresh it
            before settlement if it ages.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'building-inspection-vs-pest-inspection-difference',
        'cooling-off-period-building-inspection-rights-by-state',
        'section-32-vendor-statement-building-inspection-victoria',
        'how-much-to-negotiate-after-building-inspection',
      ]}
      related_suburbs={[
        'chatswood',
        'parramatta',
        'bondi',
        'toowong',
        'brunswick',
      ]}
    >
      <p>
        You&apos;ve found the apartment. You&apos;ve put in the offer.
        Your conveyancer tells you to commission a{' '}
        &ldquo;strata report.&rdquo; The bill is around $400. It
        arrives — 60 pages of minutes, financial statements, by-laws,
        and insurance details. You skim it, see no obvious
        catastrophes, and proceed to settlement.
      </p>
      <p>
        Three months later, you receive a letter from the owners
        corporation: a special levy of <strong>$12,400 per lot</strong>{' '}
        to fund waterproofing remediation across the building. You go
        back to the strata report. There it is, on page 38, in the
        minutes from the EGM held six weeks before you signed:{' '}
        <em>&ldquo;Motion 4 passed — special levy of $450,000 across
        36 lots to fund Stage 1 waterproofing remediation, payable
        within 90 days of invoice.&rdquo;</em>
      </p>
      <p>
        That&apos;s the kind of mistake that gets made every week in
        Australian apartment purchases. The information was in the
        report. It just wasn&apos;t in the part of the report most
        buyers actually read.
      </p>
      <p>
        Here&apos;s what a strata report actually is, what to look for,
        what it&apos;s called in each state, what it costs, and where
        most buyers go wrong.
      </p>

      <h2>What a strata report actually is</h2>
      <p>
        &ldquo;Strata report&rdquo; is shorthand. In practice there are
        two different documents that get conflated:
      </p>
      <ul>
        <li>
          <strong>Statutory disclosure certificate</strong> — a short
          (2-5 page) document the owners corporation / body corporate
          / strata manager is legally required to issue on request.
          Contents are prescribed by state legislation. It tells you
          current levies, unpaid amounts, insurance details, and any
          formally-notified pending levies. Vendor often supplies this
          as part of the contract package.
        </li>
        <li>
          <strong>Full strata records inspection</strong> — a buyer-
          commissioned third-party inspection where a specialist firm
          attends the strata manager&apos;s office, reviews the
          scheme&apos;s records (minutes, financials, sinking fund
          forecast, defect history, insurance claims, by-laws,
          correspondence) and writes a 30-100 page summary report.
          This is where the real diligence happens.
        </li>
      </ul>
      <p>
        Buyers who only rely on the statutory certificate are reading
        the executive summary of a much larger document. The certificate
        will tell you the levies are $1,200/quarter. It won&apos;t tell
        you the building has an active defect dispute with the original
        builder, the lift was replaced after a $90,000 special levy two
        years ago, and the next general meeting agenda includes a motion
        to fund cladding rectification.
      </p>

      <h2>State-by-state: what it&apos;s called and what you get</h2>
      <p>
        Strata legislation is state-based, so terminology and contents
        differ. The principles are similar; the labels and statutory
        scope are not.
      </p>

      <h3>Victoria — Owners Corporation certificate + OC records inspection</h3>
      <p>
        Under the Owners Corporations Act 2006, every Victorian
        strata-titled property has an Owners Corporation (OC). When
        selling, the vendor must provide a current OC certificate as
        part of the{' '}
        <Link href="/resources/section-32-vendor-statement-building-inspection-victoria">
          Section 32 vendor statement
        </Link>
        . The certificate must disclose:
      </p>
      <ul>
        <li>Current annual fees / levies for the lot.</li>
        <li>Any unpaid contributions on the lot.</li>
        <li>Insurance details for the common property.</li>
        <li>
          Notice of any current proceedings, special levies, or
          significant decisions.
        </li>
        <li>
          A copy of the OC rules and any committee meeting minutes
          referenced.
        </li>
      </ul>
      <p>
        The certificate is the legal minimum. The deeper OC records
        inspection — buyer-commissioned, $300-$500 — accesses the full
        records: 5-7 years of meeting minutes, sinking fund forecasts,
        maintenance plan, insurance claims history, defect
        rectification history, and current correspondence.
      </p>

      <h3>NSW — Section 184 certificate + strata records inspection</h3>
      <p>
        Under Section 184 of the Strata Schemes Management Act 2015,
        the owners corporation must issue a certificate on request
        containing current levies, unpaid contributions, insurance
        details, and notice of pending levies or by-law changes. The
        statutory fee is around $32 (most strata managers add a
        service fee).
      </p>
      <p>
        The S184 is rarely sufficient on its own. NSW buyers almost
        always commission a separate strata records inspection through
        a specialist firm ($250-$450) — the inspector attends the
        strata manager&apos;s office and reviews 5-7 years of records,
        producing a detailed report. NSW has the most mature ecosystem
        of strata inspection firms (Strata Inspection Australia, SI
        Reports, Lannock, etc).
      </p>

      <h3>Queensland — body corporate disclosure + records search</h3>
      <p>
        QLD strata schemes are governed by the Body Corporate and
        Community Management Act 1997. Sellers must provide a body
        corporate disclosure statement (BCCM Form 8) at their cost,
        covering levies, contributions, insurance, and committee
        decisions. Buyers can commission a more detailed records
        search through a body corp records inspection firm ($350-
        $600).
      </p>

      <h3>WA — strata company certificate + records inspection</h3>
      <p>
        WA uses the Strata Titles Act 1985 (amended 2018). The strata
        company must issue an information certificate covering levies,
        unpaid amounts, insurance, and by-laws. Buyer can commission a
        records inspection for full meeting minutes and financial
        history.
      </p>

      <h3>SA, ACT, TAS, NT</h3>
      <p>
        Each has its own strata/community titles legislation with
        similar disclosure requirements — short statutory certificate
        plus buyer-commissioned records inspection where the
        ecosystem exists. Smaller states have fewer specialist
        inspection firms; in some cases the conveyancer will arrange a
        records review directly with the strata manager.
      </p>

      <h2>What&apos;s in a full strata records inspection</h2>
      <p>
        A proper strata records inspection report — regardless of
        state — typically covers:
      </p>
      <ul>
        <li>
          <strong>Levies and contributions</strong> — current
          quarterly/annual amounts, any arrears, payment history of
          the lot you&apos;re buying.
        </li>
        <li>
          <strong>Sinking fund (capital works fund) balance and
          forecast</strong> — how much is saved for major repairs, what
          the 10-year forecast says is coming, whether the fund is
          adequate.
        </li>
        <li>
          <strong>Administrative fund balance</strong> — operating
          budget for day-to-day expenses.
        </li>
        <li>
          <strong>Special levies — past, current, and notified
          pending</strong> — the most important section. Includes
          motions passed at recent meetings but not yet invoiced.
        </li>
        <li>
          <strong>Meeting minutes summary (AGM + EGM + committee,
          5-7 years)</strong> — major decisions, ongoing disputes,
          building issues raised by owners.
        </li>
        <li>
          <strong>Insurance details</strong> — current sum insured,
          policy renewal date, claims history (claims indicate
          recurring building issues).
        </li>
        <li>
          <strong>By-laws / rules</strong> — pet rules, short-stay
          rules, noise rules, renovation rules, smoking rules.
          Increasingly important post-Airbnb legislation.
        </li>
        <li>
          <strong>Building defects history</strong> — any current or
          past disputes with the original builder, NSW Strata
          Building Bond status (newer NSW buildings), rectification
          orders.
        </li>
        <li>
          <strong>Maintenance plan</strong> — long-term works
          schedule, which feeds the sinking fund forecast.
        </li>
        <li>
          <strong>Correspondence summary</strong> — owner complaints,
          contractor disputes, council notices.
        </li>
      </ul>

      <h2>The seven red flags to scan for</h2>
      <p>
        Most buyers skim a strata report for &ldquo;anything alarming&rdquo;
        and miss the things that matter. Here&apos;s the targeted scan
        list:
      </p>
      <ol>
        <li>
          <strong>Special levies pending or recently approved.</strong>{' '}
          Check the most recent 12 months of meeting minutes for any
          motion containing &ldquo;special levy,&rdquo; &ldquo;capital
          works contribution,&rdquo; &ldquo;additional contribution,&rdquo;
          or specific dollar amounts spread across lots. If a motion
          passed before your contract date, that levy is coming.
        </li>
        <li>
          <strong>Sinking fund well below the 10-year forecast.</strong>{' '}
          If the maintenance plan says $400,000 needed in five years
          and the sinking fund holds $80,000, a future special levy is
          mathematically inevitable. Read the sinking fund forecast
          against current balance.
        </li>
        <li>
          <strong>Active building defect disputes.</strong> Particularly
          newer buildings (under 10 years). NSW has the Strata Building
          Bond and Inspections Scheme for buildings 4 storeys+; check
          its status. Other states: look for references to builder
          rectification, claims under HBCF (NSW) / DBI (VIC) /
          QBCC (QLD) home building warranties.
        </li>
        <li>
          <strong>Recurring insurance claims for water damage.</strong>{' '}
          Multiple water-related claims over 3-5 years usually
          indicates a chronic waterproofing or plumbing issue not yet
          fully rectified. Future special levies likely.
        </li>
        <li>
          <strong>By-law disputes about pets, short-stays, or
          renovations.</strong> If you have a dog, want to Airbnb, or
          plan to renovate — read the by-laws section carefully. Some
          schemes have hard prohibitions that override what the
          listing agent told you.
        </li>
        <li>
          <strong>Levy arrears across the building.</strong> If 10%+
          of lots are in arrears, the OC has cash flow problems and
          may struggle to fund maintenance. Higher likelihood of
          special levies hitting paid-up owners.
        </li>
        <li>
          <strong>Cladding-related references (post-2017).</strong> Any
          mention of non-conforming cladding, ACP, cladding audit,
          rectification grant applications. Buildings caught up in
          state-by-state cladding rectification schemes can face
          $10,000-$50,000+ per lot in remediation costs.
        </li>
      </ol>

      <h2>What strata reports don&apos;t cover</h2>
      <p>
        The strata report covers the <em>scheme</em> — the common
        property and the management of it. It does <em>not</em> cover
        the condition of the lot you&apos;re actually buying. For that
        you still need a building inspection on the lot itself, which
        is a different document with a different scope. See{' '}
        <Link href="/resources/building-inspection-vs-pest-inspection-difference">
          building vs pest inspection
        </Link>{' '}
        for the building inspection scope, and{' '}
        <Link href="/resources/what-is-as4349-1">
          AS4349.1 inspection standard
        </Link>{' '}
        for what an inspector covers.
      </p>
      <p>
        For apartments specifically, AS4349.1 inspections have a
        narrower scope than free-standing house inspections — the
        inspector can&apos;t access common property, can&apos;t inspect
        the roof, can&apos;t open up walls into adjoining lots. The
        strata report fills in the building-wide picture; the AS4349.1
        inspection fills in the unit-specific picture. You need both.
      </p>

      <h2>What strata findings cost</h2>
      <p>
        Common strata report findings and their financial implications:
      </p>
      <ul>
        <li>
          <strong>Levy increase pending</strong> — 5-15% increase often
          discussed in minutes 6-12 months before formal adoption.
          Budget the higher number, not the current.
        </li>
        <li>
          <strong>Special levy for routine maintenance</strong> (paint,
          carpet, lift servicing) — typically $1,500-$5,000 per lot.
        </li>
        <li>
          <strong>Special levy for major capital works</strong> (lift
          replacement, waterproofing, structural) — typically $5,000-
          $25,000 per lot. Higher for buildings with fewer lots
          (smaller denominator).
        </li>
        <li>
          <strong>Cladding rectification</strong> — varies wildly. Many
          buildings receiving state government grants; uncovered cost
          can range $10,000-$60,000+ per lot.
        </li>
        <li>
          <strong>Building defects litigation outcome unknown</strong>{' '}
          — open exposure. The OC may recover costs from the builder,
          or may not. Plan for the downside scenario.
        </li>
        <li>
          <strong>Sinking fund significantly underfunded</strong> — no
          immediate cost but signals future special levies. Calculate
          the shortfall and assume it will eventually hit your lot.
        </li>
      </ul>

      <h2>Using strata findings in negotiation</h2>
      <p>
        Unlike building inspection defects (which are physical
        attributes of the property), strata issues are often
        liability-based — a pending special levy is a known future cost
        you can quantify and negotiate against. The framework:
      </p>
      <ul>
        <li>
          <strong>Pending special levy already approved:</strong> Full
          dollar-for-dollar negotiation. The amount is known. You
          inheriting the liability is a transfer of value. Negotiate
          the price down by the full levy amount, or have the vendor
          pay the levy at settlement.
        </li>
        <li>
          <strong>Special levy proposed but not yet approved:</strong>{' '}
          Partial negotiation reflecting probability. Discount the
          expected levy by likelihood of approval (50-90% typical
          range).
        </li>
        <li>
          <strong>Sinking fund shortfall, no specific levy yet:</strong>{' '}
          Soft negotiation lever. Note the shortfall, calculate per-lot
          exposure, propose a 20-30% recovery as price adjustment.
          Harder to win but often successful for material shortfalls.
        </li>
        <li>
          <strong>Active building defects litigation:</strong> Walk-away
          consideration depending on severity. If proceeding, demand
          vendor warranty + contract clause assigning any future
          rectification cost in the next 24 months.
        </li>
      </ul>
      <p>
        Strata-driven negotiations use the same framework as physical
        defect negotiations — see{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          how much to negotiate after a building inspection
        </Link>{' '}
        for the broader structure. The leverage is documented evidence
        from the strata report itself.
      </p>

      <h2>Timing: when to get the strata report</h2>
      <p>
        For most contracts, the strata report sits inside the same
        due-diligence window as the building inspection — generally the
        cooling-off period or a contract subject-to clause. See{' '}
        <Link href="/resources/cooling-off-period-building-inspection-rights-by-state">
          cooling-off rights by state
        </Link>{' '}
        for the state-by-state timeline.
      </p>
      <p>
        Practical sequence:
      </p>
      <ol>
        <li>
          Contract signed / offer accepted.
        </li>
        <li>
          Within 24-48 hours: commission strata records inspection
          AND building inspection in parallel. Both take 3-7 days.
        </li>
        <li>
          Strata report typically arrives day 4-7. Building inspection
          day 2-5.
        </li>
        <li>
          Read both reports yourself, not just the conveyancer&apos;s
          summary. Conveyancers commonly miss buried special levy
          references in long minutes.
        </li>
        <li>
          Decision point before cooling-off ends: proceed, negotiate,
          or rescind.
        </li>
        <li>
          If proceeding to long settlement (60+ days), insert clause
          requiring refreshed strata certificate 5 business days
          before settlement, at vendor&apos;s cost.
        </li>
      </ol>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded reads your building inspection PDF (AS4349.1
        scope — the report on the lot itself) and extracts findings
        with cost estimates and trade recommendations. For apartments
        specifically, the AS4349.1 report covers what the inspector
        could access in your unit — internal walls, floors, ceilings,
        plumbing within the lot, electrical fittings within the lot,
        balcony surfaces where accessible.
      </p>
      <p>
        Strata reports themselves (the records inspection covering the
        whole scheme) aren&apos;t currently parsed by Report Decoded —
        their content is more narrative and less defect-list, which is
        a different parsing problem. For now: use a specialist strata
        inspection firm for the records report, and use Report Decoded
        for the building inspection on your unit. The two together
        give you the complete picture: the building-wide future
        liability (strata) + the unit-specific current condition
        (Report Decoded&apos;s building inspection analysis).
      </p>
      <p>
        If you&apos;re an apartment buyer reading both documents,
        Report Decoded compresses the AS4349.1 analysis from a 40-
        page PDF to a 5-minute read with dollar-figure context on
        every flagged defect — so you can spend your reading time on
        the strata minutes, where the real cost surprises live.
      </p>
    </ArticleLayout>
  );
}
