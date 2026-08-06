// scripts/ig-founder-offer.mjs
//
// Founder Offer sale post — 1080x1080 IG square, brand-consistent with
// the rest of the Instagram_Posts set. Price (~~$59~~ $39) is the hero.
// Compliance: "under 2 minutes" (never "60 seconds"); no generic
// money-back claim; no Agency tier / Pro $199 / first-report-free.

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const W = 1080, H = 1080;
const NAVY = '#0A1628';
const NAVY2 = '#16233A';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';
const MUTED = 'rgba(247,243,238,0.55)';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Brand label -->
  <text x="${W/2}" y="118" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="18" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="4">REPORT DECODED</text>

  <!-- FOUNDER OFFER pill -->
  <g transform="translate(${W/2 - 150}, 168)">
    <rect width="300" height="56" rx="28" fill="${AMBER}"/>
    <text x="150" y="37" text-anchor="middle"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="22" font-weight="700" fill="#ffffff"
          letter-spacing="1.5">FOUNDER OFFER</text>
  </g>

  <!-- Price hero: struck $59 + big $39, baseline-aligned -->
  <text x="405" y="430" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="72" font-weight="400" fill="rgba(247,243,238,0.42)">$59</text>
  <line x1="352" y1="405" x2="458" y2="405" stroke="rgba(247,243,238,0.5)" stroke-width="4"/>
  <text x="615" y="445" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="168" font-weight="400" fill="${AMBER}"
        letter-spacing="-3">$39</text>

  <!-- Value headline -->
  <text x="${W/2}" y="560" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="46" font-weight="400" fill="${CREAM}"
        letter-spacing="-0.8">Your building report,</text>
  <text x="${W/2}" y="620" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="46" font-weight="400" fill="${AMBER}"
        letter-spacing="-0.8">decoded.</text>

  <!-- Decoded-line divider (brand signature: amber dash + grey dashes) -->
  <rect x="${W/2 - 60}" y="668" width="44" height="3" rx="1.5" fill="${AMBER}"/>
  <rect x="${W/2 + 16}" y="668" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.22)"/>

  <!-- What you get -->
  <text x="${W/2}" y="738" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="25" font-weight="500" fill="rgba(247,243,238,0.82)"
        letter-spacing="0.2">Plain-English verdict &#183; repair costs</text>
  <text x="${W/2}" y="776" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="25" font-weight="500" fill="rgba(247,243,238,0.82)"
        letter-spacing="0.2">&#183; a ready-to-send negotiation letter</text>

  <!-- Speed line -->
  <text x="${W/2}" y="838" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace"
        font-size="21" font-weight="500" fill="${FAINT_AMBER}"
        letter-spacing="0.5">Upload your PDF &#183; answers in under 2 minutes</text>

  <!-- Limited note + URL -->
  <text x="${W/2}" y="928" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="17" font-weight="600" fill="${MUTED}"
        letter-spacing="1.5">LIMITED LAUNCH PRICE</text>
  <text x="${W/2}" y="992" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace"
        font-size="24" font-weight="500" fill="${CREAM}"
        letter-spacing="0.5">reportdecoded.com.au</text>
</svg>
`;

const dir = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts`;
const fallback = String.raw`C:\Users\morga\Downloads\02-Report-Decoded`;
const outDir = existsSync(dir) ? dir : fallback;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const OUT = `${outDir}\\founder-offer-39.png`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`Wrote ${OUT} (${W}x${H})`);
