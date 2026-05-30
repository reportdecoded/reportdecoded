import { getArticle } from '@/lib/articles';

const a = getArticle('buyers-agent-technical-due-diligence-tools-2026');
const url = `https://www.reportdecoded.com.au/resources/${a.slug}`;

export const metadata = {
  title: `${a.title} | Report Decoded`,
  description: a.description,
  alternates: { canonical: url },
  openGraph: {
    title: a.title,
    description: a.description,
    url,
    siteName: 'Report Decoded',
    locale: 'en_AU',
    type: 'article',
    publishedTime: a.published,
    modifiedTime: a.updated,
  },
  twitter: { card: 'summary_large_image', title: a.title, description: a.description },
};

export default function Layout({ children }) { return children; }
