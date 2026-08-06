// scripts/ad-bold.mjs
//
// BOLD 1-second ad — 1080x1080. Huge headline, two-tone navy/amber
// colour-block for energy, one instant message: building report ->
// decoded -> $39. Big text, high contrast, grasp-in-a-second.
// Compliance: "in 2 minutes" / "$39" / "$59" only.

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const W = 1080, H = 1080;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const SPLIT = 560; // navy top / amber bottom

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1.1" fill="rgba(255,255,255,0.06)"/>
    </pattern>
  </defs>

  <!-- Navy top -->
  <rect width="${W}" height="${SPLIT}" fill="${NAVY}"/>
  <rect width="${W}" height="${SPLIT}" fill="url(#dots)"/>

  <!-- Huge headline -->
  <text x="${W/2}" y="185" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="92" font-weight="500" fill="${CREAM}" letter-spacing="-2.5">Your building</text>
  <text x="${W/2}" y="285" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="92" font-weight="500" fill="${CREAM}" letter-spacing="-2.5">report,</text>
  <text x="${W/2}" y="392" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="98" font-weight="500" fill="${AMBER}" letter-spacing="-2.5">decoded.</text>

  <!-- One punchy line -->
  <text x="${W/2}" y="480" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="34" font-weight="600" fill="rgba(247,243,238,0.9)" letter-spacing="0.2">Plain-English verdict in 2 minutes.</text>

  <!-- Amber block -->
  <rect y="${SPLIT}" width="${W}" height="${H - SPLIT}" fill="${AMBER}"/>

  <!-- FOUNDER OFFER -->
  <text x="${W/2}" y="655" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="26" font-weight="800" fill="${NAVY}" letter-spacing="3">FOUNDER OFFER</text>

  <!-- Huge price: struck 59 + big 39 -->
  <text x="378" y="850" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="86" font-weight="500" fill="rgba(10,22,40,0.4)">$59</text>
  <line x1="315" y1="820" x2="441" y2="820" stroke="rgba(10,22,40,0.55)" stroke-width="5"/>
  <text x="640" y="885" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="210" font-weight="600" fill="${NAVY}" letter-spacing="-5">$39</text>

  <!-- URL -->
  <text x="${W/2}" y="1010" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="38" font-weight="800" fill="${NAVY}" letter-spacing="0.3">reportdecoded.com.au</text>
</svg>
`;

const dir = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts`;
const fallback = String.raw`C:\Users\morga\Downloads\02-Report-Decoded`;
const outDir = existsSync(dir) ? dir : fallback;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const OUT = `${outDir}\\ad-bold-39.png`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`Wrote ${OUT} (${W}x${H})`);
