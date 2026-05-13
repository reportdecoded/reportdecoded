// Next.js auto-serves this as /sitemap.xml
// Lists every public, indexable page. Private pages (/dashboard, /results)
// are deliberately excluded.

const BASE = 'https://www.reportdecoded.com.au';

export default function sitemap() {
  const today = new Date().toISOString().split('T')[0];
  return [
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
}
