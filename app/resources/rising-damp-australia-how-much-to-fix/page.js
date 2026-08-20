import ArticleLayout from '@/components/ArticleLayout';
import Link from 'next/link';
import { getArticle } from '@/lib/articles';

const a = getArticle('rising-damp-australia-how-much-to-fix');

const faqs = [
  {
    q: 'What causes rising damp in Australian homes?',
    a: 'Rising damp happens when ground moisture travels upward through concrete or brick foundations without a waterproof barrier (called a damp-proof course or DPC). Water moves through the pores in masonry using capillary action — the same process that makes a paper towel absorb water from both ends. In Australian homes, rising damp typically climbs 1–1.5m up internal walls before it stabilizes. The moisture carries dissolved salts from the soil; these salts accumulate in the plaster and weaken it, causing soft, crumbling plaster and musty smells. Pre-1960s Australian homes are the highest-risk category — many were built without any DPC, or the existing DPC failed.',
  },
  {
    q: 'How is rising damp different from salt damp?',
    a: 'They\'re the same root problem — ground moisture rising into the walls. "Salt damp" is just the more specific term describing the visible damage: the salts that come up with the moisture crystallize in the plaster and brick, causing efflorescence (white salt deposits), soft crumbling plaster, and rust stains where steel fixings corrode. Inspectors use both terms. The treatment is identical regardless of which name the report uses.',
  },
  {
    q: 'Can I just paint over rising damp?',
    a: 'No — paint will trap moisture behind it and accelerate plaster breakdown. The moisture will push the paint off, and the underlying plaster will continue to crumble. Any professional remediation starts by identifying and stopping the moisture source (chemical injection or physical barrier), then removing salt-damaged plaster and re-plastering with salt-resistant plaster only after the moisture is gone. Paint is the final step, not a substitute for treatment.',
  },
  {
    q: 'Why does rising damp take so long to fix?',
    a: 'Chemical injection and physical barrier installation are quick (2–4 weeks), but you can\'t replaster immediately after — the walls need to dry out completely. After injection or barrier work, walls typically need 4–8 weeks to dry before any re-plastering starts. Some builders recommend even longer drying times (12+ weeks) in humid climates or if damp has penetrated very deep. Re-plastering itself takes 2–4 weeks including undercoat, final coat, and curing. Total project timeline: 8–16 weeks from start to finish, depending on extent and climate.',
  },
  {
    q: 'What\'s the difference between chemical injection and physical barrier?',
    a: 'Chemical injection: silicone-based resin is forced into drilled holes along the foundation, blocks capillary moisture movement, costs \–\, lasts 10–15 years, fastest to install (2–4 weeks). Physical barrier: the foundation is partially excavated/jackhammered, a plastic or bitumen membrane is installed at the DPC level, and brickwork is reinstituted, costs \–\+, lasts 20+ years, more disruptive and slower (3–6 weeks installation). Chemical is the industry workhorse for moderate damp; physical is the permanent fix but requires space/access and budget.',
  },
  {
    q: 'If I do chemical injection, will I ever need it again?',
    a: 'Yes, typically 10–15 years later. Chemical DPC effectiveness fades over time as the injected resin degrades. Some providers offer lifetime warranty riders (\,500–\,000 extra) that cover reapplication if damp returns within the warranty period. Most buyers negotiate chemical + lifetime warranty rather than choosing physical barrier upfront — it spreads the cost and lets you upgrade to physical barrier later if needed.',
  },
  {
    q: 'Is rising damp in apartments my responsibility or the strata body\'s?',
    a: 'Depends on the location. Rising damp on external walls or shared foundations is common-property defect — the strata body is liable and would fund remediation through a special levy. Rising damp inside your unit only (internal brick walls, or localized moisture from roof/window leaks) is your responsibility. Most disputes center on borderline cases: is the damp from the shared building envelope or from your plumbing/appliances? Get a moisture specialist to map the moisture gradient and damp extent; that clarifies liability. If the strata has already approved a special levy for damp, factor that cost into your offer negotiation — it\'s your future liability even if you don\'t own the building.',
  },
  {
    q: 'How much will rising damp cost to negotiate off the price?',
    a: 'Minor damp (patchy, <0.8m, light efflorescence): \,000–\,000 off. Moderate damp (0.8–1.5m on multiple walls, soft plaster): \,000–\,000 off. Severe damp (>1.5m, structural concerns, whole-wall damage): \,000–\,000+ off, OR walk away. The rule of thumb: get a damp specialist quote (\–\,200), add 20% for contingency, and negotiate that figure off the asking price. Many buyers try to negotiate chemical only (\) when the inspector flagged "full remediation" (\+); a quantified scope prevents this mismatch.',
  },
];

export default function Page() {
  return (
    <ArticleLayout
      slug={a.slug}
      title={a.title}
      h1="Rising Damp Treatment Cost in Australia: 2026 Pricing Guide"
      description={a.description}
      published={a.published}
      updated={a.updated}
      category={a.category}
      readTime={a.readTime}
      tldr={
        <>
          <p style={{ margin: 0 }}>
            <strong>Rising damp is the #1 negotiation point in older Australian homes — but most buyers don&apos;t know what treatment actually costs.</strong> Chemical injection (fastest): <strong>\,000–\,000</strong>, lasts 10–15 years. Physical barrier (permanent): <strong>\,000–\,000+</strong>, lasts 20+ years. Full remediation (rare): <strong>\,000–\,000+</strong>. Most buyers negotiate chemical injection + lifetime warranty rider. Get a damp specialist quote before negotiating.
          </p>
        </>
      }
      faqs={faqs}
      related_articles={[
        'concrete-cancer-spalling-cost-australia',
        'strata-report-explained-australia',
        'how-much-to-negotiate-after-building-inspection',
        'what-is-as4349-1',
        'mould-in-australian-homes-remediation-cost',
        'what-to-do-if-building-inspection-finds-major-problems',
      ]}
      related_suburbs={[
        'south-yarra',
        'fitzroy',
        'redfern',
        'glebe',
        'paddington',
      ]}
    >
      <p>Your building inspector notes: <em>&ldquo;Evidence of rising damp to lower wall courses. Salt-damaged plaster evident.&rdquo;</em></p>
      <p>Rising damp is the #1 negotiation point in older Australian homes. Treatment costs range \,000 to \,000+ depending on method and extent.</p>
      <h2>How much does rising damp treatment cost?</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Treatment Type</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cost</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Timeline</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Lasts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>Chemical injection</strong></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>\,000–\,000</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>2–4 weeks</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>10–15 years</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>Physical barrier</strong></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>\,000–\,000</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>3–6 weeks</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>20+ years</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>Combination</strong></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>\,000–\,000</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>4–8 weeks</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>25+ years</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>Full facade remediation</strong></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>\,000–\,000+</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>8–16 weeks</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Permanent</td>
          </tr>
        </tbody>
      </table>
      <h2>Treatment methods explained</h2>
      <h3>Chemical Injection (fastest &amp; cheapest)</h3>
      <p>Drilling ~500 holes in perimeter walls, injecting hydrophobic resin. Costs \–\. Lasts 10–15 years. Best for minor damp and tight budgets.</p>
      <h3>Physical Barrier (permanent solution)</h3>
      <p>Jackhammer out foundation, install plastic/bitumen membrane, reinstate brickwork. Costs \–\+. Lasts 20+ years. More disruptive but permanent.</p>
      <h3>Strata alert</h3>
      <p>If the building has common-property rising damp, check the strata meeting minutes. A special levy could be coming: \–\ per unit. If already approved, that's your liability — negotiate \–15K off the price to cover it.</p>
      <h2>Key takeaway</h2>
      <p>Get a damp specialist quote (\–\,200) before negotiating. Chemical injection + lifetime warranty is the smart play for most buyers.</p>
    </ArticleLayout>
  );
}
