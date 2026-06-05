import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('how-to-read-as4349-1-inspection-report');

const faqs = [
  {
    q: 'What\'s the most important section of the report to read first?',
    a: 'The Major Defects + Significant Defects sections — usually pages 8-35 in a typical 60-100 page report. Skip past the Methodology, Statement of Limitations, and General Description sections (pages 1-7) on first read. The Defect sections are where every item that affects your buying decision lives. Each entry usually has: defect description, location, photo reference, severity rating, recommendation. Read all Major Defects first (the deal-impact items), then Significant Defects (the budget-impact items), then Minor Defects (the future-maintenance items).',
  },
  {
    q: 'What does "drummy render" mean in plain English?',
    a: 'When the inspector taps a render-coated wall with a hammer or knuckle and it sounds hollow (drum-like) rather than solid, that\'s "drummy." It means the render coat has separated from the brickwork or substrate underneath — usually due to moisture infiltration, age, or original poor installation. Repair: the drummy area is cut out and re-rendered. Cost typically $50-$150/m² for small areas; $5,000-$15,000+ for whole-wall re-render on a typical AU house. Not structural unless very widespread, but it\'s an active deterioration pattern that gets worse without treatment.',
  },
  {
    q: 'What\'s the difference between "Major Defect," "Significant Defect," and "Minor Defect"?',
    a: 'AS4349.1 doesn\'t mandate exact category names but most inspectors use a 3-4 tier system: (1) Major Defect — items that affect structural integrity, safety, or the immediate habitability of the property. Examples: active termite damage to load-bearing framing, severe concrete cancer to balcony slabs, electrical safety failures. Repair typically $5,000+ AND/OR requires specialist follow-up. (2) Significant Defect — items that don\'t threaten immediate use but represent meaningful cost or compliance issues. Examples: failed bathroom waterproofing, roof tile end-of-life, non-compliant smoke alarms. Repair typically $1,500-$8,000. (3) Minor Defect — maintenance items typical for the property age. Examples: paint peeling, gutter debris, small cracks in non-load-bearing walls. Repair typically under $1,500.',
  },
  {
    q: 'Why are there so many pages and so much repeated content?',
    a: 'AS4349.1 requires inspectors to document their methodology, scope of inspection, items NOT inspected (with reasons), and limitations — this is the boilerplate that fills pages 1-7 of most reports. It\'s legally important (protects the inspector + you), but contains no defect-specific information. Most reports also include a summary of each room/area inspected (typically pages 36-60), which restates findings from the Major/Significant/Minor Defect sections in a different format. The actual decision-relevant content is concentrated in 10-15 pages buried inside a 60-100 page document. Skim past the boilerplate.',
  },
  {
    q: 'Should I worry if the inspector wrote "further investigation recommended" a lot?',
    a: 'Yes, but not necessarily as a deal-breaker. "Further investigation recommended" means the inspector noted something that exceeds the AS4349.1 visual-only scope and needs a specialist follow-up — typically structural engineer ($1,500-$3,500), pest specialist ($400-$800), or licensed plumber/electrician ($150-$400 callout). Common items: concrete spalling (structural engineer), suspected ACM/asbestos (lab testing), borer activity in timber (pest specialist), borderline electrical compliance (electrician). Cost of follow-ups for a typical pre-purchase: $500-$2,000 total. Worth it because the specialist clarifies "$5K patch repair or $80K major work" — exactly the kind of certainty you need to negotiate or walk.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="How to read an Australian building inspection report (AS4349.1): a buyer's guide"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>AS4349.1 inspection reports run 60-100 pages with
            only 10-15 pages of decision-relevant content.</strong>{' '}
            Skip the Methodology + Limitations boilerplate (pages 1-7).
            Read Major Defects FIRST (deal-impact), then Significant
            Defects (budget-impact), then skim Minor Defects (future
            maintenance). Each defect entry has location + photo
            reference + severity + recommendation. Watch for:{' '}
            &ldquo;further investigation recommended&rdquo; (commission
            specialist), &ldquo;drummy&rdquo; (hollow render), &ldquo;
            spalling&rdquo; (concrete deterioration),&ldquo;efflorescence&rdquo;
            (salt + moisture), &ldquo;evidence of...&rdquo; (historical,
            not necessarily active). Triage time:{' '}
            <strong>under 1 hour</strong> if you focus on the
            decision-relevant pages.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'what-is-as4349-1',
        'building-inspection-vs-pest-inspection-difference',
        'how-much-to-negotiate-after-building-inspection',
        'what-to-do-if-building-inspection-finds-major-problems',
      ]}
      related_suburbs={[
        'brunswick',
        'newtown',
        'bondi',
        'toowong',
        'frankston',
      ]}
    >
      <p>
        The PDF lands in your inbox. 87 pages. You scroll to page 1.
        It&apos;s a &ldquo;Statement of Limitations.&rdquo; You scroll
        to page 4. It&apos;s a description of inspection methodology.
        By page 8 you&apos;re reading &ldquo;drummy render to lower
        wing wall plaster, monitor for progression&rdquo; and your
        eyes glaze over.
      </p>
      <p>
        Most buyers spend 2-3 hours trying to extract meaning from
        this document, give up, and either trust their conveyancer&apos;s
        4-sentence summary or proceed on vibes. Both are mistakes.
      </p>
      <p>
        Here&apos;s the section-by-section anatomy of an AS4349.1
        report, what the technical terminology actually means, and
        how to triage 60-100 pages in under an hour.
      </p>

      <h2>Report structure — what&apos;s where</h2>
      <p>
        Every AS4349.1 inspection report follows roughly the same
        anatomy. The page numbers below are typical for a mid-sized
        AU house inspection (75 page report):
      </p>
      <ul>
        <li>
          <strong>Pages 1-3 — Cover + Contents + Inspector Details.</strong>{' '}
          Skim. Confirm the property address matches your contract.
        </li>
        <li>
          <strong>Pages 4-5 — Statement of Limitations.</strong>{' '}
          Boilerplate. The inspector is documenting what they did
          NOT inspect (e.g. inside wall cavities, under floor
          coverings, inaccessible roof voids) and why. Read once,
          then skip on future reports
        </li>
        <li>
          <strong>Pages 5-7 — Methodology / Scope.</strong> More
          boilerplate. AS4349.1 requires this. Skim
        </li>
        <li>
          <strong>Pages 8-10 — General Description.</strong> Property
          type, construction era, dimensions, condition overview.
          Useful 1-page snapshot of the property
        </li>
        <li>
          <strong>Pages 10-18 — MAJOR DEFECTS.</strong> {' '}
          <strong>Read every word.</strong> This is where the deal-
          impact items live
        </li>
        <li>
          <strong>Pages 18-30 — SIGNIFICANT DEFECTS.</strong>{' '}
          <strong>Read every word.</strong> Budget-impact items
        </li>
        <li>
          <strong>Pages 30-45 — MINOR DEFECTS / MAINTENANCE.</strong>{' '}
          Skim. These are future maintenance items, not deal-breakers
        </li>
        <li>
          <strong>Pages 45-65 — Area-by-Area Inspection Summary.</strong>{' '}
          Restates findings room-by-room. Useful for cross-reference
          but mostly redundant
        </li>
        <li>
          <strong>Pages 65-75 — Photo Annexure.</strong>{' '}
          Photographs referenced from the defect sections above
        </li>
        <li>
          <strong>Pages 75+ — Appendices.</strong> Glossary, standard
          definitions, contact information. Skim
        </li>
      </ul>

      <h2>Triage in under an hour</h2>
      <p>
        Optimal reading sequence:
      </p>
      <ol>
        <li>
          <strong>2 min — General Description.</strong> Confirm
          construction era + construction type. Sets your mental model
        </li>
        <li>
          <strong>15-20 min — Major Defects.</strong> Read every
          entry. For each: write down location + cost estimate (from
          inspector if provided, or your own rough guess)
        </li>
        <li>
          <strong>10-15 min — Significant Defects.</strong> Same
          process
        </li>
        <li>
          <strong>5 min — Minor Defects.</strong> Skim for any item
          that might escalate (large numbers of related minor items
          suggest systemic issue)
        </li>
        <li>
          <strong>5 min — Photo Annexure.</strong> Cross-reference the
          photos to the defect entries — particularly for any items
          where the description was unclear
        </li>
        <li>
          <strong>10 min — Tally + decision.</strong> Total estimated
          rectification cost. Triage to {' '}
          <Link href="/resources/what-to-do-if-building-inspection-finds-major-problems">
            decision framework
          </Link>
          : proceed / negotiate / walk
        </li>
      </ol>
      <p>
        Total time: 45-60 minutes for a 75-page report. The pages you
        actually read = 10-15. Everything else is boilerplate or
        redundant.
      </p>

      <h2>Inspector terminology — plain English</h2>
      <p>
        Common AS4349.1 phrases and what they actually mean:
      </p>

      <h3>Structural + Brickwork</h3>
      <ul>
        <li>
          <strong>&ldquo;Drummy render&rdquo;</strong> — render that
          sounds hollow when tapped (separated from substrate). Cost:
          $50-$150/m². See FAQ above
        </li>
        <li>
          <strong>&ldquo;Spalling&rdquo;</strong> — concrete or
          masonry surface deteriorating, often forming flakes or
          chunks. Concrete spalling often = concrete cancer. See{' '}
          <Link href="/resources/concrete-cancer-spalling-cost-australia">
            concrete cancer guide
          </Link>
        </li>
        <li>
          <strong>&ldquo;Step cracking&rdquo;</strong> — diagonal
          cracking through mortar joints in brickwork. Indicates
          foundation movement. May be active (ongoing) or historical
          (settled)
        </li>
        <li>
          <strong>&ldquo;Differential settlement&rdquo;</strong> —
          parts of the building have sunk at different rates,
          producing structural distress
        </li>
      </ul>

      <h3>Moisture + Mould</h3>
      <ul>
        <li>
          <strong>&ldquo;Efflorescence&rdquo;</strong> — white salt
          crystal deposits on brickwork or mortar. Indicates moisture
          is moving through the masonry, bringing dissolved salts to
          the surface. Linked to rising damp or salt-water exposure
        </li>
        <li>
          <strong>&ldquo;Elevated moisture readings&rdquo;</strong> —
          the inspector&apos;s pin or non-invasive moisture meter
          showed values above 18% (timber) or 5% (masonry surface)
        </li>
        <li>
          <strong>&ldquo;Fungal decay&rdquo;</strong> — wet rot or
          dry rot in timber, caused by sustained moisture
        </li>
        <li>
          <strong>&ldquo;Suspect mould growth&rdquo;</strong> —
          visible discoloration consistent with mould, species not
          confirmed. See{' '}
          <Link href="/resources/black-mould-vs-other-mould-australian-homes">
            black mould vs other mould guide
          </Link>
        </li>
      </ul>

      <h3>Pest + Termite</h3>
      <ul>
        <li>
          <strong>&ldquo;Mud tubes&rdquo;</strong> — termites build
          earthen tubes for protected travel. Visible evidence of
          termite activity, current or past
        </li>
        <li>
          <strong>&ldquo;Frass&rdquo;</strong> — termite excrement.
          Small grain-like piles under or beside affected timber
        </li>
        <li>
          <strong>&ldquo;Subterranean termite workings&rdquo;</strong>{' '}
          — evidence of termite damage from below-ground species
          (Coptotermes, Mastotermes). Most common AU termite type
        </li>
        <li>
          <strong>&ldquo;Borer activity&rdquo;</strong> — wood-boring
          insects (often called &ldquo;woodworm&rdquo;). Smaller
          damage scale than termites but can be widespread
        </li>
      </ul>

      <h3>Roof + Waterproofing</h3>
      <ul>
        <li>
          <strong>&ldquo;Flashing failure&rdquo;</strong> — the metal
          weather seals around roof penetrations (chimneys, valleys,
          eaves) are degraded, allowing water entry
        </li>
        <li>
          <strong>&ldquo;Ridge cap deterioration&rdquo;</strong> —
          the mortar holding ridge tiles is failing, causing
          potential leaks + falling tiles
        </li>
        <li>
          <strong>&ldquo;Slipped tile&rdquo; / &ldquo;cracked
          tile&rdquo;</strong> — common roof tile issues. Localised
          repair $300-$800; whole-roof issue may require partial or
          full re-roof
        </li>
        <li>
          <strong>&ldquo;Waterproofing membrane breach&rdquo;</strong>{' '}
          — bathroom or balcony waterproofing has failed, allowing
          water entry into substrate
        </li>
      </ul>

      <h3>Electrical + Plumbing</h3>
      <ul>
        <li>
          <strong>&ldquo;Non-compliant smoke alarms&rdquo;</strong> —
          alarms don&apos;t meet current AS3786 standard. Cost
          $500-$1,500 to upgrade
        </li>
        <li>
          <strong>&ldquo;Perished wiring insulation&rdquo;</strong> —
          old rubber-insulated wiring (pre-1970) has degraded.
          Rewiring required. Cost $4,000-$15,000
        </li>
        <li>
          <strong>&ldquo;Galvanised pipe&rdquo; / &ldquo;polybutylene
          pipe&rdquo;</strong> — outdated plumbing materials. Both
          have known failure modes. Replacement typically required
        </li>
      </ul>

      <h3>The escalation signals</h3>
      <ul>
        <li>
          <strong>&ldquo;Further investigation recommended&rdquo;</strong>{' '}
          — beyond AS4349.1 visual scope. Specialist follow-up needed
          (structural engineer, pest specialist, electrician, etc.)
        </li>
        <li>
          <strong>&ldquo;Limited access&rdquo;</strong> — inspector
          couldn&apos;t fully inspect this area. Risk of undiscovered
          defects. Particularly important for subfloor and roof void
        </li>
        <li>
          <strong>&ldquo;Suspect &lt;X&gt; — not confirmed&rdquo;</strong>{' '}
          — visual evidence consistent with the named condition but
          definitive confirmation requires testing. Most common with
          asbestos, lead paint, and active termites
        </li>
        <li>
          <strong>&ldquo;Outside scope&rdquo;</strong> — explicitly
          excluded from this inspection (often septic systems, pool
          equipment, electrical compliance certificates, structural
          engineering assessment)
        </li>
      </ul>

      <h2>What to write down as you read</h2>
      <p>
        Keep a simple table while reading. Each row is one defect:
      </p>
      <ul>
        <li><strong>Page reference</strong></li>
        <li><strong>Defect description (short)</strong></li>
        <li><strong>Severity (Major / Significant / Minor)</strong></li>
        <li><strong>Estimated cost range</strong></li>
        <li><strong>Specialist follow-up needed? (Y/N + which)</strong></li>
        <li><strong>Negotiable? (Y/N)</strong></li>
      </ul>
      <p>
        At the end you&apos;ll have a 1-2 page summary of the entire
        report that becomes the input for{' '}
        <Link href="/resources/building-inspection-negotiation-letter-template-australia">
          your negotiation letter
        </Link>
        {' '}or your walk-away decision.
      </p>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded does this section-by-section reading for you in
        2 minutes. Upload the PDF and receive:
      </p>
      <ul>
        <li>
          Plain-English summary of every Major + Significant defect
        </li>
        <li>
          Cost-banded estimate per defect (in 2026 AU dollars,
          location-calibrated)
        </li>
        <li>
          Specialist follow-up recommendations where needed
        </li>
        <li>
          Drafted negotiation letter with all findings pre-populated
        </li>
        <li>
          Citations back to the inspector&apos;s page numbers so you
          can verify any specific item
        </li>
      </ul>
      <p>
        For a typical 75-page report, the analysis compresses 45-60
        minutes of reading into a 5-minute decision-ready summary.
        Particularly useful in cooling-off where time is the
        constraint, and{' '}
        <Link href="/resources/how-fast-book-building-inspection-australia">
          inspection turnaround
        </Link>
        {' '}has already eaten most of your window.
      </p>
    </ArticleLayout>
  );
}
