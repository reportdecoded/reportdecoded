// Per-suburb metadata + canonical URL + OG tags. Server-rendered so
// Next emits metadata to <head> before the client component takes over.
import { suburbMetadata } from '@/lib/suburbs';
export const metadata = suburbMetadata('wynnum');
export default function Layout({ children }) { return children; }
