// scripts/ad-founder-offer.mjs
//
// Static ad — 1080x1080. Founder Offer ($39, was $59) + the 4 things you
// get, as a scannable checklist. Same brand system + sharp/SVG pipeline as
// ig-founder-offer.mjs, so text + price render pixel-perfect.
// Compliance: "under 2 minutes" (never "60 seconds"); $39/$59 only.

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const W = 1080, H = 1080;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';
const MUTED = 'rgba(247,243,238,0.55)';

// A benefit row: amber check + label, left-aligned, block roughly centred.
const BENEFITS = [
  'Plain-English verdict — proceed or walk away',
  'Repair cost estimates for every defect',
  'A ready-to-send negotiation letter',
  'Local tradies matched to each problem',
];
const BX = 210;          // check x
const TX = 250;          // label x
const B_Y0 = 590;        // first row baseline
const B_GAP = 74;

const benefitRows = BENEFITS.map((label, i) => {
  const y = B_Y0 + i * B_GAP;
  return `
    <polyline points="${BX},${y - 8} ${BX + 7},${y - 1} ${BX + 20},${y - 20}"
      fill="none" stroke="${AMBER}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${TX}" y="${y}" font-family="DM Sans, Helvetica, Arial, sans-serif"
      font-size="27" font-weight="500" fill="rgba(247,243,238,0.9)" letter-spacing="0.2">${label}</text>`;
}).join('');

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
  <text x="${W/2}" y="108" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="18" font-weight="600" fill="${FAINT_AMBER}" letter-spacing="4">REPORT DECODED</text>

  <!-- Headline -->
  <text x="${W/2}" y="190" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="52" font-weight="400"
        fill="${CREAM}" letter-spacing="-1">Your building report,</text>
  <text x="${W/2}" y="256" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic" font-size="52" font-weight="400"
        fill="${AMBER}" letter-spacing="-1">decoded.</text>

  <!-- Price hero -->
  <text x="415" y="392" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="60" font-weight="400"
        fill="rgba(247,243,238,0.42)">$59</text>
  <line x1="372" y1="372" x2="458" y2="372" stroke="rgba(247,243,238,0.5)" stroke-width="3.5"/>
  <text x="580" y="405" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-size="128" font-weight="400"
        fill="${AMBER}" letter-spacing="-2">$39</text>
  <g transform="translate(${W/2 - 118}, 435)">
    <rect width="236" height="46" rx="23" fill="${AMBER}"/>
    <text x="118" y="31" text-anchor="middle"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="18" font-weight="700" fill="#fff" letter-spacing="1.4">FOUNDER OFFER</text>
  </g>

  <!-- Decoded-line divider -->
  <rect x="${W/2 - 60}" y="525" width="44" height="3" rx="1.5" fill="${AMBER}"/>
  <rect x="${W/2 + 16}" y="525" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.22)"/>

  <!-- Benefits checklist -->
  ${benefitRows}

  <!-- Speed line -->
  <text x="${W/2}" y="928" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace" font-size="21" font-weight="500"
        fill="${FAINT_AMBER}" letter-spacing="0.4">Upload your PDF &#183; answers in under 2 minutes</text>

  <!-- URL -->
  <text x="${W/2}" y="1002" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace" font-size="24" font-weight="500"
        fill="${CREAM}" letter-spacing="0.5">reportdecoded.com.au</text>
</svg>
`;

const dir = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts`;
const fallback = String.raw`C:\Users\morga\Downloads\02-Report-Decoded`;
const outDir = existsSync(dir) ? dir : fallback;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const OUT = `${outDir}\\ad-founder-offer-39.png`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`Wrote ${OUT} (${W}x${H})`);
