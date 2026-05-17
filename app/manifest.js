// app/manifest.js
// PWA manifest — served at /manifest.webmanifest by Next.js metadata API.
// Makes the site installable on iOS (Add to Home Screen) and Android
// (Install App prompt) with our brand colors + icon.

export default function manifest() {
  return {
    name: 'Report Decoded',
    short_name: 'Report Decoded',
    description:
      'AI-powered Australian building & pest inspection report interpreter. Plain-English verdicts, repair cost ranges, negotiation language, and local tradies in under 2 minutes.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F7F3EE', // cream — matches body background, smooth splash
    theme_color: '#0A1628',      // navy — matches sticky nav
    lang: 'en-AU',
    categories: ['business', 'productivity', 'finance'],
    icons: [
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      // Apple touch icon used as the maskable variant — gives Android adaptive
      // launchers a non-transparent canvas to apply their device-specific mask.
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
