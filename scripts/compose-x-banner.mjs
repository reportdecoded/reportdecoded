// scripts/compose-x-banner.mjs
//
// Compose a 1500 × 500 px (3:1) Twitter/X header banner using Sharp.
// Navy background + amber accents + logo + tagline. Brand consistent
// with the rest of the site (uses the same --navy / --amber / --cream
// palette as components/ReportDecoded.jsx).
//
// Output: C:\Users\morga\Downloads\x-banner.png

import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 1500;
const H = 500;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';

// Find logo
const logoPath = join(__dirname, '..', 'public', 'logo-dark.png');

// Composite SVG with all the typography + dot-grid texture matching the
// hero section of the live site
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.045)"/>
    </pattern>
    <linearGradient id="hairline" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${AMBER}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${AMBER}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Navy background + dot grid texture -->
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Amber hairline at the bottom (matches hero-section::after on the live site) -->
  <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#hairline)"/>

  <!-- AU flag badge top-left -->
  <g transform="translate(60, 60)">
    <rect width="280" height="38" rx="19" fill="rgba(201,122,58,0.18)" stroke="rgba(201,122,58,0.42)" stroke-width="1"/>
    <text x="20" y="24" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="13" font-weight="500" fill="${FAINT_AMBER}" letter-spacing="0.4">
      🇦🇺 BUILT FOR AUSTRALIAN BUYERS
    </text>
  </g>

  <!-- Main headline -->
  <text x="60" y="200" font-family="Fraunces, Georgia, serif" font-size="56" font-weight="500" fill="#ffffff" letter-spacing="-0.6">
    Your building report,
  </text>
  <text x="60" y="270" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="56" font-weight="500" fill="${AMBER}" letter-spacing="-0.6">
    decoded.
  </text>

  <!-- Tagline -->
  <text x="60" y="330" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="20" font-weight="400" fill="rgba(255,255,255,0.85)" letter-spacing="0.1">
    Plain-English verdict + repair costs + tradies + negotiation letter
  </text>
  <text x="60" y="362" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="20" font-weight="400" fill="rgba(255,255,255,0.85)" letter-spacing="0.1">
    in under 2 minutes. AS4349.1 compliant.
  </text>

  <!-- Price tags moved to the RIGHT side — Twitter overlays the
       avatar circle on the bottom-left ~280×280 of the banner, so
       anything there gets hidden. Putting the chips on the right
       keeps the pricing visible. -->
  <g transform="translate(${W - 60 - 200}, 200)">
    <rect width="200" height="40" rx="8" fill="${AMBER}"/>
    <text x="100" y="26" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="14" font-weight="600" fill="#ffffff" letter-spacing="0.3">
      $59 PER BUYER REPORT
    </text>
  </g>
  <g transform="translate(${W - 60 - 200}, 250)">
    <rect width="200" height="40" rx="8" fill="transparent" stroke="rgba(255,255,255,0.42)" stroke-width="1.5"/>
    <text x="100" y="26" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="14" font-weight="600" fill="rgba(255,255,255,0.9)" letter-spacing="0.3">
      $79/MO FOR AGENTS
    </text>
  </g>

  <!-- URL bottom-right -->
  <text x="${W - 60}" y="455" text-anchor="end" font-family="DM Mono, Courier New, monospace" font-size="18" font-weight="500" fill="rgba(255,255,255,0.7)" letter-spacing="0.5">
    reportdecoded.com.au
  </text>
</svg>
`;

// Compose: base navy + svg overlay + logo top-right
const baseImage = await sharp({
  create: { width: W, height: H, channels: 4, background: NAVY },
})
  .composite([
    { input: Buffer.from(svg), top: 0, left: 0 },
  ])
  .png()
  .toBuffer();

// Overlay the logo top-right (resize first)
let logoBuffer;
try {
  logoBuffer = await sharp(logoPath)
    .resize({ width: 280, withoutEnlargement: true })
    .png()
    .toBuffer();
} catch (e) {
  console.warn('Logo not found — skipping logo overlay:', e.message);
  logoBuffer = null;
}

let final = sharp(baseImage);
if (logoBuffer) {
  const logoMeta = await sharp(logoBuffer).metadata();
  final = final.composite([
    { input: logoBuffer, top: 60, left: W - logoMeta.width - 60 },
  ]);
}

const outPath = 'C:\\Users\\morga\\Downloads\\x-banner.png';
await final.png().toFile(outPath);
console.log(`✓ Wrote ${outPath} (${W}×${H})`);
