// Next.js auto-serves this as /sitemap.xml
// Lists every public, indexable page. Private pages (/dashboard, /results)
// are deliberately excluded.
//
// May 2026: programmatic SEO expansion. All suburb landing pages are
// generated from lib/suburbs.js — so adding a suburb auto-adds it to
// the sitemap. No manual list to keep in sync.

import { allSuburbSlugs } from '@/lib/suburbs';
import { allArticleSlugs } from '@/lib/articles';

const BASE = 'https://www.reportdecoded.com.au';

export default function sitemap() {
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    {
      url: `${BASE}/`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/agents`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE}/contact`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE}/signin`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${BASE}/terms`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ];

  const suburbPages = allSuburbSlugs().map((slug) => ({
    url: `${BASE}/${slug}-building-inspection-help`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const articlePages = [
    {
      url: `${BASE}/resources`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...allArticleSlugs().map((slug) => ({
      url: `${BASE}/resources/${slug}`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.75,
    })),
  ];

  // Public sample report is intentionally surfaced as an indexable
  // URL so Google can crawl the live analysis output as a working
  // example — strong proof-of-concept for ranking + dwell time.
  const sampleReport = {
    url: `${BASE}/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1`,
    lastModified: today,
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  return [...staticPages, ...suburbPages, ...articlePages, sampleReport];
}
