// Per-suburb metadata + canonical URL + OG tags. Server-rendered
// (this file has no 'use client') so Next emits the metadata to <head>
// before the client component takes over.
import { suburbMetadata } from '@/lib/suburbs';
export const metadata = suburbMetadata('northcote');
export default function Layout({ children }) { return children; }
