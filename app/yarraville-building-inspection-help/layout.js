// Per-suburb metadata — added May 2026 SEO pass. Previously these
// pages inherited the homepage's <title> and <meta description>,
// making them look like near-duplicates to Google. Each suburb now
// gets its own metadata via lib/suburbs.js > suburbMetadata().
import { suburbMetadata } from '@/lib/suburbs';
export const metadata = suburbMetadata('yarraville');
export default function Layout({ children }) { return children; }
