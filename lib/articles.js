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
];

export function allArticleSlugs() {
  return ARTICLES.map((a) => a.slug);
}

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}
