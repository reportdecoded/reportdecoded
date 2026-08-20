// scripts/ad-gold-39.mjs
//
// "Gold standard" static ad — 1080x1080. Vector-rendered version of the
// Gemini concept: same layout, but exact palette, correct kerning,
// consistent weights and perfectly balanced margins.
//
// Compliance: "in under 2 minutes" (never "60 seconds"); $39 only.

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const W = 1080, H = 1080;
const NAVY  = '#0A1628';
const CREAM = '#F7F3EE';
const AMBER = '#C97A3A';
const M = 96; // uniform margin, all four sides

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${NAVY}"/>

  <!-- Wordmark -->
  <text x="${M}" y="${M + 26}" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="30" font-weight="700" fill="${CREAM}" letter-spacing="-0.3">Report Decoded</text>

  <!-- Headline -->
  <text x="${M}" y="368" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="104" font-weight="700" fill="${CREAM}" letter-spacing="-3.6">Your building</text>
  <text x="${M}" y="484" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="104" font-weight="700" fill="${CREAM}" letter-spacing="-3.6">report,</text>
  <text x="${M}" y="600" font-family="DM Sans, Helvetica, Arial, sans-serif" font-style="italic"
        font-size="104" font-weight="700" fill="${AMBER}" letter-spacing="-3.6">decoded.</text>

  <!-- Amber rule: single accent tying headline to the offer -->
  <rect x="${M}" y="656" width="112" height="5" rx="2.5" fill="${AMBER}"/>

  <!-- Body -->
  <text x="${M}" y="740" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="35" font-weight="400" fill="rgba(247,243,238,0.92)">Plain-English verdict, repair costs and a</text>
  <text x="${M}" y="792" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="35" font-weight="400" fill="rgba(247,243,238,0.92)">negotiation letter &#8212; in under 2 minutes.</text>

  <!-- Price pill: single weight, single colour -->
  <rect x="${M}" y="${H - M - 74}" width="340" height="74" rx="37" fill="${AMBER}"/>
  <text x="${M + 170}" y="${H - M - 26}" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="33" font-weight="700" fill="${CREAM}" letter-spacing="0.2">$39 per report</text>

  <!-- URL, baseline-aligned with the pill -->
  <text x="${W - M}" y="${H - M - 26}" text-anchor="end"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="29" font-weight="500" fill="rgba(247,243,238,0.78)">reportdecoded.com.au</text>
</svg>
`;

const dir = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts`;
const fallback = String.raw`C:\Users\morga\Downloads\02-Report-Decoded`;
const outDir = existsSync(dir) ? dir : fallback;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const OUT = `${outDir}\\ad-gold-39.png`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`Wrote ${OUT} (${W}x${H})`);
