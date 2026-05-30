import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('section-32-vendor-statement-building-inspection-victoria');

const faqs = [
  {
    q: 'Is the Section 32 the same as the contract of sale?',
    a: 'No — they\'re two separate documents bundled together. The Section 32 (Vendor Statement) is the legally required pre-contract DISCLOSURE document under the Victorian Sale of Land Act 1962. The Contract of Sale is the actual contract you sign. The Section 32 must be given to you BEFORE you sign the contract; if it wasn\'t, that itself is grounds for rescission. Many buyers find them stapled together and treat them as one document — they\'re not, and the legal protections attaching to each are different.',
  },
  {
    q: 'What\'s the difference between Section 32 disclosure and what the building inspector finds?',
    a: 'The Section 32 is what the vendor must legally tell you on paper. The AS4349.1 building inspection is what an independent inspector visually finds on site. They cover different things: the Section 32 discloses planning overlays, building permits, easements, owners corp obligations, and known notices/orders against the property. The building inspection finds physical defects — cracking, damp, electrical issues, etc. Both matter, and a defect not disclosed in the Section 32 that should have been (e.g. an unapproved extension) can give you rescission rights regardless of what the inspector finds.',
  },
  {
    q: 'Can I rescind the contract because the Section 32 is incomplete?',
    a: 'Yes, in many cases — and this right is independent of cooling-off. Under Section 32K of the Sale of Land Act, if the Section 32 contains a material misrepresentation OR omits required information AND the vendor knew (or should have known), you can rescind the contract at any time before settlement. The remedy is full refund of any deposit, plus possible damages. Common grounds: undisclosed building permits, planning overlays missed, unapproved structures, known notices/orders not disclosed. Always get a Victorian conveyancer to review the Section 32 — they catch omissions that don\'t look like omissions to non-lawyers.',
  },
  {
    q: 'What\'s a "Section 32 due diligence checklist" — do I need one?',
    a: 'It\'s a structured checklist of items to verify against the Section 32 before signing. Most Victorian conveyancers provide one as part of their pre-contract review (~$150-$400). Key items: confirm planning zone matches what the agent told you, check for building permits that suggest an extension was done (and verify it was finalised), look for Section 173 agreements (binding owner obligations), check the owners corp insurance and contingency fund for strata, look for any current notices or orders. DIY checklists exist online but most buyers benefit from professional review for the $150-$400 spend.',
  },
  {
    q: 'My Section 32 mentions a "building permit" — should I worry?',
    a: 'Not by itself, but verify two things. First: was the permit issued and FINALISED (i.e., the building inspector issued a Certificate of Final Inspection / Occupancy Permit)? An open building permit means work was approved but never legally completed — and the obligation to finalise transfers to you on settlement, sometimes triggering rectification work to bring the structure up to current code. Second: does the permit match the visible structures on site? Permits for extensions or pools that don\'t appear to exist (or vice versa) are red flags. The Section 32 should include copies of relevant building permits; if not, request them in writing through the agent before signing.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Section 32 vendor statement and your building inspection (Victoria, 2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>The Section 32 is the vendor&apos;s mandatory
            pre-contract disclosure</strong> under Victoria&apos;s Sale
            of Land Act 1962 — separate from the contract of sale, and
            you must receive it BEFORE you sign anything. Inside its
            30-100 pages: planning zone, easements, building permits,
            owners corp obligations, current notices/orders, services,
            and Section 173 agreements. If the Section 32 has{' '}
            <strong>material omissions or misrepresentations</strong>{' '}
            you can rescind the contract under{' '}
            <strong>Section 32K</strong> — independent of cooling-off,
            up to settlement. This is your biggest legal protection in
            a VIC purchase. Read it the SAME day you receive it, and
            cross-check every disclosure against what your AS4349.1
            inspector finds on site.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'cooling-off-period-building-inspection-rights-by-state',
        'what-to-do-if-building-inspection-finds-major-problems',
        'how-much-to-negotiate-after-building-inspection',
        'what-is-as4349-1',
      ]}
      related_suburbs={[
        'yarraville',
        'brunswick',
        'footscray',
        'st-kilda',
        'northcote',
      ]}
    >
      <p>
        The agent emails you the &ldquo;Contract Pack.&rdquo; You open
        the PDF. It&apos;s 87 pages. You skim it for 20 minutes, see
        nothing that looks alarming, sign the second-to-last page,
        and email it back.
      </p>
      <p>
        What you just did was contractually accept a property based on
        the contents of a legally-required disclosure document you
        didn&apos;t read properly. In Victoria, that document is the
        Section 32 — and what&apos;s in (or not in) it matters more
        than almost anything else in the purchase.
      </p>
      <p>
        This is the document that gives you legal grounds to rescind
        the contract without penalty if the vendor failed to disclose
        something they should have. It&apos;s also the document that
        most first-home buyers skim and most experienced investors
        read four times. The difference between the two is usually
        $30,000-$150,000 of avoided post-settlement surprises.
      </p>
      <p>
        Here&apos;s what&apos;s in it, what to look for, what the
        building inspector cannot see that the Section 32 should
        disclose, and what to do if you find a gap.
      </p>

      <h2>What the Section 32 legally must contain</h2>
      <p>
        The Sale of Land Act 1962 (VIC) Section 32 prescribes a list
        of items the vendor must disclose to you in writing BEFORE you
        sign the contract. The headline categories:
      </p>
      <ul>
        <li>
          <strong>Title particulars:</strong> copy of the registered
          title, lot/plan number, any encumbrances on title (easements,
          covenants, mortgages).
        </li>
        <li>
          <strong>Easements, covenants, and other restrictions:</strong>{' '}
          rights-of-way, drainage easements, restrictive covenants
          (e.g., &ldquo;no fence higher than 1.8m,&rdquo;
          &ldquo;single-storey only&rdquo;).
        </li>
        <li>
          <strong>Planning information:</strong> zoning (residential
          general / residential growth / mixed-use / etc), overlays
          (heritage, vegetation, design and development, environmental
          significance, bushfire management), local planning scheme
          reference.
        </li>
        <li>
          <strong>Building permits in the last 7 years:</strong> copies
          of all building permits issued for the property in the past
          7 years, plus Certificates of Occupancy or Final Inspection.
        </li>
        <li>
          <strong>Owners corporation information (for strata):</strong>{' '}
          owners corp register details, financial statements, insurance
          certificates, levies, minutes of recent meetings, contracts
          of management.
        </li>
        <li>
          <strong>Notices and orders:</strong> any current notices or
          orders against the property from any authority — local
          council, EPA, water authority, etc.
        </li>
        <li>
          <strong>Services:</strong> connection status for water,
          sewerage, electricity, gas, telecommunications.
        </li>
        <li>
          <strong>Section 173 agreements:</strong> any binding
          agreements with council under Section 173 of the Planning
          and Environment Act — these create ongoing obligations on
          the property owner (e.g., maintain a tree, restrict
          subdivision).
        </li>
        <li>
          <strong>Outgoings:</strong> rates, water charges, owners
          corp fees, land tax.
        </li>
        <li>
          <strong>GST:</strong> whether the property is sold with or
          without GST included.
        </li>
        <li>
          <strong>Default interest rate:</strong> what you&apos;ll pay
          if you delay settlement.
        </li>
      </ul>

      <h2>What to actually look for as a buyer</h2>
      <p>
        Reading a Section 32 cover-to-cover is a 2-hour job and you
        won&apos;t catch most omissions. What you CAN catch on a
        45-minute read is the obvious stuff. The five highest-value
        items to verify:
      </p>

      <h3>1. Planning zone + overlays — does it match what the agent told you?</h3>
      <p>
        Agents commonly say &ldquo;it&apos;s residential&rdquo; without
        being specific about zone. The Section 32 will name the zone
        precisely. If it says &ldquo;Mixed Use Zone&rdquo; or
        &ldquo;Residential Growth Zone,&rdquo; you might be sitting
        next to a 5-storey apartment site rezoning. Heritage Overlay,
        Vegetation Protection Overlay, and Design and Development
        Overlays all restrict what you can do with the property. If an
        overlay applies, your renovation budget should assume permit
        complications.
      </p>

      <h3>2. Building permits in the last 7 years</h3>
      <p>
        This is the most common Section 32 surprise. If you see a
        building permit listed (e.g., &ldquo;Permit 12345 — Extension
        and alterations, issued 2021&rdquo;), check two things:
      </p>
      <ul>
        <li>
          Was a <strong>Certificate of Final Inspection</strong> or{' '}
          <strong>Occupancy Permit</strong> issued? If yes, the work
          is legally complete. If no, the work was approved but never
          legally finalised — and the obligation transfers to you on
          settlement. Bringing a 5-year-old half-finished extension up
          to current code can run $20,000-$80,000.
        </li>
        <li>
          Does the permit MATCH the visible structures? A permit for a
          single-storey rear extension where you can see a
          double-storey extension means there was unpermitted work.
          Same the other way — permits for structures that don&apos;t
          appear to exist suggest the work was approved but never built
          (less of an issue, but worth asking about).
        </li>
      </ul>

      <h3>3. Notices and orders</h3>
      <p>
        Any current notice or order against the property is a red flag.
        Common ones in inner-Melbourne stock: council orders to remove
        an unauthorised structure, building order from VBA (Victorian
        Building Authority), drainage orders from Yarra Valley Water.
        These typically transfer to the new owner on settlement and
        the cost of compliance comes out of your pocket.
      </p>

      <h3>4. Easements and covenants</h3>
      <p>
        Easements give other parties rights over your land — most
        commonly a 1-3m drainage easement at the rear, an
        electricity easement along a boundary, or a shared driveway
        easement. The Section 32 must include a copy of the plan
        showing exactly where each easement runs. Cross-check against
        any extension you might want to do — building over an easement
        is restricted and council approval is rarely granted.
      </p>
      <p>
        Restrictive covenants are private restrictions on what you can
        do with the property (single-storey only, no front fence over
        1.2m, brick construction only, etc). These are recorded against
        title and bind successive owners. They&apos;re most common on
        post-2000 estate lots and 1920s-1940s Edwardian/Federation
        estates.
      </p>

      <h3>5. Owners corporation details (for strata)</h3>
      <p>
        For apartments, townhouses, and any property under an Owners
        Corporation, dig into:
      </p>
      <ul>
        <li>
          <strong>Annual budget and levies:</strong> is the OC running
          a surplus, breakeven, or losing money? Underfunded OCs
          eventually hit owners with special levies for major
          works.
        </li>
        <li>
          <strong>Capital works fund / sinking fund balance:</strong>{' '}
          should be enough to handle major upcoming works. A near-empty
          fund + an aging roof = a $30K-$100K special levy in your
          future.
        </li>
        <li>
          <strong>Minutes of recent meetings:</strong> any disputes,
          planned works, insurance claims, or unresolved issues.
          Owners corps with active litigation are red flags.
        </li>
        <li>
          <strong>Insurance certificate:</strong> verify the building
          is adequately insured. Under-insured strata buildings can
          leave individual owners exposed in a major loss.
        </li>
      </ul>

      <h2>How the Section 32 interacts with your building inspection</h2>
      <p>
        The Section 32 tells you what the vendor MUST disclose on
        paper. The{' '}
        <Link href="/resources/what-is-as4349-1">
          AS4349.1 building inspection
        </Link>{' '}
        tells you what an independent inspector visually finds on site.
        They&apos;re complementary, and discrepancies between them are
        your biggest negotiation lever.
      </p>
      <p>
        Examples of Section-32-vs-inspection cross-checks that
        regularly surface problems:
      </p>
      <ul>
        <li>
          Inspector finds a clearly-extended rear of the house. Section
          32 building permit history shows no extension permit. Result:
          unpermitted work. This is grounds for both negotiation and,
          in some cases, rescission under Section 32K.
        </li>
        <li>
          Inspector flags structural cracking. Section 32 contains a
          council notice about the structure that the vendor downplayed
          to the agent. Result: documented evidence the vendor knew
          about an issue and didn&apos;t adequately disclose.
        </li>
        <li>
          Inspector flags wet-area waterproofing failure. Section 32
          shows a recent bathroom renovation permit. Result: defective
          recent work, potentially still under builder&apos;s warranty
          which you may inherit.
        </li>
        <li>
          Inspector notes an old asbestos cement garage. Section 32
          shows planning overlays restricting demolition. Result: your
          removal options are more constrained and more expensive than
          a typical asbestos job.
        </li>
      </ul>

      <h2>What to do if you find a Section 32 problem</h2>
      <p>
        The remedies depend on what kind of problem and when you find
        it.
      </p>
      <p>
        <strong>Before signing the contract:</strong> The cheapest
        time. Either decline to sign until the vendor amends the
        Section 32, or negotiate a price reduction reflecting the
        issue. If the agent pushes you to sign now and &ldquo;sort it
        out later,&rdquo; refuse — &ldquo;sort it out later&rdquo;
        almost always means &ldquo;eat the cost.&rdquo;
      </p>
      <p>
        <strong>During cooling-off (3 business days for VIC private
        sales — never auction):</strong> Rescind the contract using
        the cooling-off notice. Forfeits $100 or 0.2% of contract
        (whichever greater) but releases you from the deal. See our{' '}
        <Link href="/resources/cooling-off-period-building-inspection-rights-by-state">
          cooling-off rights article
        </Link>{' '}
        for the exact mechanics.
      </p>
      <p>
        <strong>After cooling-off but before settlement:</strong> If
        the Section 32 contains material omissions or misrepresentations,
        Section 32K of the Sale of Land Act gives you the right to
        rescind the contract — independent of cooling-off, up to
        settlement. Remedy is return of deposit plus possible damages.
        This is a powerful right but requires a Victorian conveyancer
        or property lawyer to enforce; DIY rescission notices are
        risky.
      </p>
      <p>
        <strong>Negotiate vs rescind:</strong> Most documented Section
        32 issues end up as negotiation leverage rather than full
        rescission, because rescission is litigious and slow.{' '}
        <Link href="/resources/how-much-to-negotiate-after-building-inspection">
          Our negotiation framework
        </Link>{' '}
        treats Section 32 findings + building inspection findings as a
        combined documented dollar ask.
      </p>

      <h2>Practical workflow for VIC buyers</h2>
      <p>
        The right sequence to actually use the Section 32 effectively:
      </p>
      <ul>
        <li>
          <strong>Day -7 (before signing):</strong> Receive the Section
          32. Forward it to a Victorian conveyancer for review
          ($150-$400 for pre-contract review). They&apos;ll catch
          omissions you won&apos;t.
        </li>
        <li>
          <strong>Day -3 (before signing):</strong> Receive
          conveyancer&apos;s notes. If problems were flagged, address
          them with the agent in writing BEFORE signing.
        </li>
        <li>
          <strong>Day 0 (signing):</strong> Sign the contract with
          Section 32 issues addressed. Cooling-off period begins.
        </li>
        <li>
          <strong>Day 1-3 (cooling-off):</strong> Commission AS4349.1
          building inspection +{' '}
          <Link href="/resources/building-inspection-vs-pest-inspection-difference">
            AS4349.3 pest inspection
          </Link>. Cross-check findings against Section 32.
        </li>
        <li>
          <strong>End of Day 3 (cooling-off ends):</strong> Decide:
          proceed, negotiate, or rescind. Use{' '}
          <Link href="/resources/what-to-do-if-building-inspection-finds-major-problems">
            the 5-step framework
          </Link>{' '}
          to make the call.
        </li>
      </ul>

      <h2>How Report Decoded fits</h2>
      <p>
        Report Decoded analyses your AS4349.1 PDF and gives you the
        building-side cost breakdown + negotiation language. The
        Section 32 review is a conveyancer&apos;s job — you should
        always have a Victorian conveyancer doing that pre-contract
        review, regardless of any tool. What Report Decoded does is
        compress the building-inspection-to-decision time from the 3-6
        hours most buyers spend down to 2 minutes, so you have more of
        the cooling-off window left for the cross-checks against the
        Section 32 that actually win you negotiations or rescission
        rights.
      </p>
      <p>
        The combined play — conveyancer reviews Section 32 + Report
        Decoded analyses AS4349.1 PDF + buyer does the cross-check — is
        the strongest pre-purchase due diligence position any VIC buyer
        can take, for under $400 total.
      </p>
    </ArticleLayout>
  );
}
