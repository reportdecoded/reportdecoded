import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('black-mould-vs-other-mould-australian-homes');

const faqs = [
  {
    q: 'Is all black mould toxic?',
    a: 'No. "Black mould" is a colloquial term covering dozens of mould species — most of which are NOT the toxic stachybotrys chartarum that media coverage focuses on. Aspergillus niger (also black), cladosporium (olive-black), alternaria (dark brown to black) are common indoor moulds that are allergenic but not toxigenic. Stachybotrys is a specific species requiring sustained high moisture and cellulose substrate to grow — far less common than panic suggests. Visual identification alone cannot distinguish stachybotrys from look-alikes — lab testing required. Most "black mould" findings in AU homes turn out to be cladosporium or aspergillus, both DIY-cleanable with proper PPE.',
  },
  {
    q: 'How do I know if mould in my house is stachybotrys?',
    a: 'You cannot tell by visual inspection alone — that\'s a key part of the diagnostic problem. Stachybotrys looks similar to several harmless dark moulds when growing on plasterboard, timber, or wallpaper. Confirmation requires either: (1) a surface swab sample sent to a lab ($80-$200 per sample, results in 5-7 days), or (2) air sampling with spore identification ($300-$600 per location). If you\'re seeing dark mould patches in a damp area and want certainty about species, commission a swab. Most cases turn out to be common species, but the test removes the uncertainty.',
  },
  {
    q: 'Can I clean black mould myself with bleach?',
    a: 'For small patches (under 1m²) on non-porous surfaces (tile, glass, sealed paint) with the moisture source already addressed — yes, with fungicidal cleaner (not bleach). Bleach kills surface mould but doesn\'t penetrate porous materials, so re-growth is common within 6-12 months. Better products: Concrobium Mold Control, Selleys Rapid Mould Killer, or vinegar + bicarbonate for sensitive areas. PPE essential: P2 mask, gloves, goggles. Larger patches, porous materials (plasterboard, timber), or any HVAC contamination — call a Category 2 or Category 3 remediation specialist. See our broader mould remediation cost guide.',
  },
  {
    q: 'My building inspector flagged mould in the bathroom — should I worry?',
    a: 'Depends on the severity and the source. Bathroom mould is the most common location for mould flags in AU inspections — usually condensation-driven from inadequate exhaust ventilation. If it\'s localised to ceiling above shower (surface staining only, fungicidal cleanable, exhaust upgrade required): typical fix $500-$2,500 (Category 1 cleaning + exhaust install). If it extends into adjoining bedroom wall or attic space (cavity contamination suspected): potential Category 2-3 remediation at $3,500-$15,000+. Inspector wording is the clue: "mould evident" alone = local issue; "elevated moisture readings to adjoining wall" or "further investigation recommended" = potential hidden contamination.',
  },
  {
    q: 'Will my home insurance cover mould remediation?',
    a: 'Almost certainly no, with limited exceptions. Standard AU home and contents policies exclude damage from "gradual deterioration" and "pre-existing damage" — which captures most mould findings discovered during pre-purchase inspections. The narrow exceptions: sudden water damage (burst pipe, fallen tree puncturing roof) where mould forms as a consequence of the sudden event AND the buyer notifies within typically 72 hours. Slow-leak mould, condensation mould, rising-damp mould — all excluded. Treat mould remediation cost as out-of-pocket, factor it into negotiation, and don\'t assume insurance will catch it later. Most buyers also can\'t insure AGAINST mould going forward once it\'s documented in an inspection report.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Black mould vs other mould in Australian homes: when to panic, when to clean (2026)"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>&ldquo;Black mould&rdquo; is a colloquial term for
            many species — most are NOT the toxic stachybotrys that
            media coverage focuses on.</strong> Cladosporium and
            aspergillus niger are common dark moulds that are
            allergenic but not toxigenic, and DIY-cleanable with
            proper PPE. Visual identification cannot distinguish
            species — lab testing ($80-$200/swab) required for
            certainty. For most AU homes: small patches on non-porous
            surfaces = DIY OK; larger patches, porous materials, or
            HVAC contamination = specialist remediation $3,500-$15,000+.
            Insurance rarely covers mould. The moisture source is
            always the root cause — cleaning without fixing the source
            guarantees regrowth.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'mould-in-australian-homes-remediation-cost',
        'rising-damp-australia-how-much-to-fix',
        'how-to-read-as4349-1-inspection-report',
        'what-to-do-if-building-inspection-finds-major-problems',
      ]}
      related_suburbs={[
        'bondi',
        'manly',
        'mornington',
        'toowong',
        'sunnybank',
      ]}
    >
      <p>
        &ldquo;Black mould.&rdquo; The two words trigger panic in
        property buyer culture. News coverage focuses on the toxic
        stachybotrys variant. Real estate forums fill with stories of
        $30,000 remediation bills and houses unsellable for life.
      </p>
      <p>
        The reality is much more nuanced. Most &ldquo;black
        mould&rdquo; found in Australian homes is NOT stachybotrys.
        It&apos;s cladosporium or aspergillus — common species that
        are allergenic but not toxigenic. Many cases are DIY-cleanable.
        Some genuinely warrant Category 3 remediation. Visual
        identification can&apos;t tell you which is which.
      </p>
      <p>
        Here&apos;s the honest framework: which species, when to
        panic, when to clean, and how much remediation actually costs.
      </p>

      <h2>The five mould species you&apos;ll encounter</h2>

      <h3>1. Cladosporium (the most common)</h3>
      <p>
        <strong>Appearance:</strong> Olive-green to black patches.
        Often confused with stachybotrys at a glance.
      </p>
      <p>
        <strong>Where it grows:</strong> Damp areas with cellulose —
        plasterboard, wallpaper, timber, painted surfaces. Common
        on bathroom ceilings, window seals, behind built-in furniture
        against external walls.
      </p>
      <p>
        <strong>Health impact:</strong> Allergenic (can trigger hay
        fever-style symptoms, asthma in sensitive individuals).{' '}
        <strong>NOT toxigenic.</strong>
      </p>
      <p>
        <strong>Remediation:</strong> Standard cleaning. DIY-acceptable
        for under 1m² on non-porous surfaces with PPE.
      </p>

      <h3>2. Aspergillus (multiple species, including niger)</h3>
      <p>
        <strong>Appearance:</strong> Variable. Aspergillus niger is
        black, others are green/yellow/white. Velvety texture when
        mature.
      </p>
      <p>
        <strong>Where it grows:</strong> Dust accumulations on damp
        organic material. Common in dusty disused rooms, behind
        wardrobes, in roof voids.
      </p>
      <p>
        <strong>Health impact:</strong> Mostly allergenic. Some
        species (aspergillus fumigatus) can cause respiratory
        infections in immune-compromised people.
      </p>
      <p>
        <strong>Remediation:</strong> Standard cleaning. DIY for small
        amounts; specialist if widespread.
      </p>

      <h3>3. Stachybotrys chartarum (the toxic one)</h3>
      <p>
        <strong>Appearance:</strong> Dark green to black. Slimy or
        wet texture when fresh, powdery when dry. Often grows in
        specific patterns following cellulose materials.
      </p>
      <p>
        <strong>Where it grows:</strong> Requires SUSTAINED high
        moisture and cellulose-rich materials. Wet plasterboard
        following extended leaks, wet wallpaper, water-soaked timber
        floors. Less common than panic suggests because the moisture
        requirements are specific.
      </p>
      <p>
        <strong>Health impact:</strong> Allergenic AND produces
        mycotoxins under certain growing conditions. The mycotoxins
        can cause respiratory + neurological symptoms in extended
        exposure. The genuine reason for caution.
      </p>
      <p>
        <strong>Remediation:</strong> Category 3 specialist required.
        Containment, HEPA filtration, full removal of affected
        materials. Cost $12,000-$40,000+ depending on extent.
      </p>

      <h3>4. Penicillium</h3>
      <p>
        <strong>Appearance:</strong> Blue-green velvety patches.
        Distinctive — looks like the mould on old bread.
      </p>
      <p>
        <strong>Where it grows:</strong> Water-damaged materials, food
        spillages, damp shoe storage. Common in mudrooms + laundries.
      </p>
      <p>
        <strong>Health impact:</strong> Allergenic. Not toxigenic
        (despite the name penicillin being derived from a relative —
        the drug is not the same as the mould).
      </p>
      <p>
        <strong>Remediation:</strong> Standard cleaning.
      </p>

      <h3>5. Alternaria</h3>
      <p>
        <strong>Appearance:</strong> Dark brown to black. Velvet or
        cotton-like texture.
      </p>
      <p>
        <strong>Where it grows:</strong> Damp showers, around window
        frames, on damp carpet. Tracked indoors from outdoors on
        clothing.
      </p>
      <p>
        <strong>Health impact:</strong> Strong allergen — common
        asthma trigger. Not toxigenic.
      </p>
      <p>
        <strong>Remediation:</strong> Standard cleaning.
      </p>

      <h2>How to actually identify what you have</h2>
      <p>
        Visual identification is unreliable. Three diagnostic options:
      </p>
      <ul>
        <li>
          <strong>Surface swab sample:</strong> $80-$200 per sample
          sent to an accredited lab (NATA-certified). Results in 5-7
          days. Best for identifying species growing on a specific
          visible patch
        </li>
        <li>
          <strong>Air sampling (spore trap):</strong> $300-$600 per
          location. Identifies airborne spore concentration and
          species. Best for detecting hidden contamination (cavity
          mould)
        </li>
        <li>
          <strong>ERMI DNA testing (Environmental Relative Moldiness
          Index):</strong> $400-$800 per sample. Dust sample analyses
          DNA from 36 mould species. Most sensitive, best for
          litigation or insurance disputes
        </li>
      </ul>
      <p>
        For typical buyer-side due diligence: one surface swab on
        the most concerning patch + one air sample of the room is
        sufficient ($400-$800 total). ERMI is overkill for residential
        transactions.
      </p>

      <h2>When to panic vs when to clean</h2>

      <h3>DIY-cleanable (most cases)</h3>
      <ul>
        <li>Patch under 1m²</li>
        <li>Non-porous surface (tile, glass, sealed paint)</li>
        <li>Moisture source already addressed or being addressed</li>
        <li>
          Species confirmed common (cladosporium, aspergillus,
          alternaria, penicillium) OR not species-tested but matches
          common patterns
        </li>
        <li>No HVAC contamination suspected</li>
      </ul>
      <p>
        <strong>Cost:</strong> $50-$300 in fungicidal cleaner + PPE.
        Time: 1-2 hours per patch.
      </p>

      <h3>Call Category 1 specialist (medium cases)</h3>
      <ul>
        <li>Multiple rooms affected</li>
        <li>Porous materials need replacement (plasterboard, carpet)</li>
        <li>Moisture source not yet identified</li>
        <li>Behind built-in cabinetry or wardrobes</li>
      </ul>
      <p>
        <strong>Cost:</strong> $800-$3,500 for Category 1 cleaning +
        moisture source rectification.
      </p>

      <h3>Call Category 3 specialist (genuine concern)</h3>
      <ul>
        <li>Confirmed stachybotrys</li>
        <li>Widespread hidden cavity contamination</li>
        <li>HVAC system contamination</li>
        <li>Whole-room or whole-house spread</li>
        <li>Occupants with documented health symptoms attributed to mould</li>
      </ul>
      <p>
        <strong>Cost:</strong> $12,000-$40,000+ including containment,
        HEPA filtration, material removal, post-remediation clearance
        testing.
      </p>

      <h2>The moisture source — always the root cause</h2>
      <p>
        Mould grows because moisture is present. Killing visible mould
        without addressing the moisture source guarantees regrowth
        within 6-12 months. This is the single most important rule.
      </p>
      <p>
        Common moisture sources in AU homes:
      </p>
      <ul>
        <li>
          <strong>Bathroom condensation</strong> — inadequate exhaust
          ventilation. Fix: install ducted exhaust to roof or eaves.
          Cost $400-$1,200
        </li>
        <li>
          <strong>Failed shower waterproofing</strong> — membrane
          breach. Fix: re-waterproof. Cost $3,500-$8,000
        </li>
        <li>
          <strong>Roof leak</strong> — flashing failure or tile
          deterioration. Cost $500-$25,000+
        </li>
        <li>
          <strong>Plumbing leak (concealed)</strong> — slow drip
          behind cabinetry. Cost $800-$4,000
        </li>
        <li>
          <strong>Subfloor moisture (inner-west cottages)</strong> —
          inadequate ventilation. Cost $1,500-$5,000
        </li>
        <li>
          <strong>Rising damp</strong> — see{' '}
          <Link href="/resources/rising-damp-australia-how-much-to-fix">
            rising damp cost guide
          </Link>
          {' '}for treatment + cost
        </li>
        <li>
          <strong>Building envelope condensation</strong> — structural
          cold bridge. Cost $3,000-$15,000+
        </li>
      </ul>
      <p>
        Remediation quotes that do not include moisture source
        rectification are incomplete. The mould will return.
      </p>

      <h2>What inspection reports actually flag</h2>
      <p>
        Inspector language is the key signal — &ldquo;mould
        evident&rdquo; vs &ldquo;further investigation
        recommended.&rdquo; Compared:
      </p>
      <ul>
        <li>
          &ldquo;Mould evident to bathroom ceiling&rdquo; → localised,
          surface, condensation-driven. $500-$2,500 remediation
        </li>
        <li>
          &ldquo;Mould evident to bathroom ceiling. Elevated moisture
          readings to adjoining bedroom wall.&rdquo; → potential
          hidden contamination. $3,500-$12,000 remediation
        </li>
        <li>
          &ldquo;Suspected mould to subfloor framing. Further
          investigation recommended.&rdquo; → potential structural
          impact. Commission specialist assessment $400-$1,500
        </li>
        <li>
          &ldquo;Widespread mould to multiple rooms. HVAC system
          inspection recommended.&rdquo; → Category 2-3 territory.
          $8,000-$30,000+
        </li>
      </ul>

      <h2>Where Report Decoded fits</h2>
      <p>
        Report Decoded reads your inspection report and surfaces
        every mould reference plus moisture-source indicators. The
        analysis cross-references inspector findings against typical
        AU moisture sources to surface what&apos;s likely the root
        cause — not just what&apos;s visible on the surface.
      </p>
      <p>
        For a typical &ldquo;mould evident to bathroom ceiling&rdquo;
        finding, Report Decoded&apos;s output typically reads:
      </p>
      <p>
        <em>&ldquo;Mould flagged to bathroom ceiling above shower.
        Likely root cause: condensation from inadequate exhaust
        ventilation combined with failing waterproofing membrane.
        Recommended next step: specialist mould assessment ($400-
        $800) + bathroom waterproofing quote. Indicative remediation
        cost: $3,500-$8,000 inclusive of moisture rectification. If
        inspector also noted elevated moisture readings to adjoining
        bedroom wall, consider Category 2 scope with hidden
        contamination ($6,000-$12,000).&rdquo;</em>
      </p>
      <p>
        That translates the panic word (&ldquo;mould&rdquo;) into a
        defensible cost range you can act on within the cooling-off
        window.
      </p>
    </ArticleLayout>
  );
}
