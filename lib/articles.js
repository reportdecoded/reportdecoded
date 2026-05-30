// lib/articles.js
//
// Registry of /resources/{slug} long-form articles. Used by:
//   • app/resources/page.js — index listing
//   • app/sitemap.js — auto-add to sitemap
//   • internal cross-links between articles
//
// Each article's actual body content lives in app/resources/{slug}/page.js
// (it's JSX, not data). This file just keeps metadata in one place.

export const ARTICLES = [
  {
    slug: 'what-is-as4349-1',
    title: 'What is AS4349.1? The Australian Standard for Building Inspections, Explained',
    description: 'Plain-English breakdown of Australian Standard AS4349.1 — what it covers, what it doesn\'t, how to read the report, and what to do next.',
    category: 'Buyer guide',
    published: '2026-05-20',
    updated: '2026-05-20',
    readTime: '6 min',
    excerpt: 'Every Australian pre-purchase building inspection is meant to be done to AS4349.1. Most buyers have no idea what that standard actually requires — or what it leaves out.',
  },
  {
    slug: 'how-much-to-negotiate-after-building-inspection',
    title: 'How Much Should I Negotiate After a Building Inspection? (Real Australian Numbers)',
    description: 'A practical framework + benchmark dollar ranges for negotiating off contract price after your AS4349.1 building inspection comes back.',
    category: 'Buyer guide',
    published: '2026-05-20',
    updated: '2026-05-20',
    readTime: '8 min',
    excerpt: 'Your building inspection came back. There are issues. Now what? Here\'s how Australian buyers turn defect lists into defensible dollar amounts off the price.',
  },
  {
    slug: 'termite-damage-cost-australia',
    title: 'Termite Damage Cost to Repair in Australia: What Buyers Should Budget',
    description: 'How much it costs to repair termite damage in Australian homes — by damage extent, by trade, by state, with realistic ranges from real inspection reports.',
    category: 'Buyer guide',
    published: '2026-05-20',
    updated: '2026-05-20',
    readTime: '7 min',
    excerpt: 'Termites cause more property damage in Australia than fire, flood, and storms combined. If your inspection finds termite evidence, the cost question depends on five things.',
  },
  {
    slug: 'asbestos-australian-homes-buyer-guide',
    title: 'Asbestos in Australian Homes: What Building Inspections Catch and What They Miss',
    description: 'Plain-English guide to asbestos in Australian houses — where it hides, what inspectors can and can\'t identify, removal costs, and when it\'s safe to leave alone.',
    category: 'Buyer guide',
    published: '2026-05-21',
    updated: '2026-05-21',
    readTime: '8 min',
    excerpt: 'About 1 in 3 Australian homes built before 1990 contains asbestos somewhere. Your building inspection will flag visual indicators but can\'t confirm without lab testing. Here\'s what that actually means for buyers.',
  },
  {
    slug: 'practical-completion-inspection-australia',
    title: 'New-Build Practical Completion Inspection (PCI): The Australian Buyer\'s Guide',
    description: 'What a PCI covers, when to do it, the Defects Liability Period, builder rectification rights, and how to use the inspection to hold the builder accountable.',
    category: 'Buyer guide',
    published: '2026-05-21',
    updated: '2026-05-21',
    readTime: '9 min',
    excerpt: 'Your new-build is almost done. The builder wants you to sign off on Practical Completion. This is the most important inspection you\'ll commission as a new-build buyer — and the only chance to require builder rectification before final payment.',
  },
  {
    slug: 'rising-damp-australia-how-much-to-fix',
    title: 'Rising Damp in Australia: How Much It Actually Costs to Fix in 2026',
    description: 'Real Australian rising damp repair costs — chemical DPC injection, mechanical replacement, replastering, and what your building inspector\'s "rising damp evident" note actually means for your wallet.',
    category: 'Buyer guide',
    published: '2026-05-29',
    updated: '2026-05-29',
    readTime: '8 min',
    excerpt: 'If your building inspection report uses the phrase "evidence of rising damp," "efflorescence to lower courses," or "elevated moisture meter readings at floor level" — you\'re looking at a repair bill that can range from $4,000 to over $40,000. Here\'s how to tell which end of that range your property sits at.',
  },
  {
    slug: 'what-to-do-if-building-inspection-finds-major-problems',
    title: 'What to Do If Your Building Inspection Finds Major Problems (Australia, 2026)',
    description: 'A step-by-step decision framework for Australian buyers whose pre-purchase inspection has come back with serious defects — how to triage, cost, negotiate, walk away, or proceed with confidence.',
    category: 'Buyer guide',
    published: '2026-05-29',
    updated: '2026-05-29',
    readTime: '9 min',
    excerpt: 'The report just landed. There are red flags. Cooling-off ends in days. Here\'s exactly what to do — in what order — to turn an alarming inspection report into either a defensible price drop, a clean walk-away, or a confident proceed.',
  },
  {
    slug: 'building-inspection-vs-pest-inspection-difference',
    title: 'Building Inspection vs Pest Inspection: What\'s the Difference in Australia?',
    description: 'Plain-English breakdown of the two AS4349 inspections every Australian buyer needs — what each covers, what they miss, why you need both, and how much each actually costs.',
    category: 'Buyer guide',
    published: '2026-05-29',
    updated: '2026-05-29',
    readTime: '7 min',
    excerpt: 'Your conveyancer told you to get "a building and pest inspection." Most buyers assume that\'s one document. It\'s actually two completely different inspections done to two different Australian Standards — and skipping the second one is the most expensive mistake AU buyers make.',
  },
  {
    slug: 'cooling-off-period-building-inspection-rights-by-state',
    title: 'Cooling-Off Period Building Inspection Rights by State (Australia, 2026)',
    description: 'State-by-state guide to your cooling-off rights as an Australian property buyer — VIC, NSW, QLD, SA, WA, ACT, TAS, NT. When the clock starts, what you can do inside it, when you can\'t walk away, and how the building inspection fits.',
    category: 'Buyer guide',
    published: '2026-05-29',
    updated: '2026-05-29',
    readTime: '10 min',
    excerpt: 'You just signed the contract. The agent says the cooling-off period started today. Your building inspector is booked for Tuesday. Will the report come back in time? What happens if it\'s bad? Here\'s exactly what your rights are, state by state.',
  },
  {
    slug: 'section-32-vendor-statement-building-inspection-victoria',
    title: 'Section 32 Vendor Statement and Your Building Inspection (Victoria, 2026)',
    description: 'What the Victorian Section 32 vendor statement legally must contain, how it interacts with your AS4349.1 building inspection, the most common omissions and gotchas, and what to do if you find a defect that should have been disclosed.',
    category: 'Buyer guide',
    published: '2026-05-29',
    updated: '2026-05-29',
    readTime: '11 min',
    excerpt: 'Every Victorian property sale comes with a Section 32 — a mandatory pre-contract vendor disclosure document. Most buyers receive it, skim it, and sign. Inside the 30-100 pages are the items that could give you legal grounds to rescind without penalty, regardless of cooling-off — IF you know what to look for.',
  },
];

export function allArticleSlugs() {
  return ARTICLES.map((a) => a.slug);
}

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}
