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
];

export function allArticleSlugs() {
  return ARTICLES.map((a) => a.slug);
}

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}
