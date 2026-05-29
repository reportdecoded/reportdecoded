// scripts/ig-02-problem.mjs
//
// Recompose IG Post #2 ("The Problem") as a 1080x1080 square with all
// text centred in a tight safe-zone — guarantees nothing gets cropped
// by Instagram's narrow profile-grid display.

import sharp from 'sharp';

const W = 1080;
const H = 1080;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';
const ORANGE_RED = '#E5634A';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)"/>
    </pattern>
    <linearGradient id="redLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${ORANGE_RED}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${ORANGE_RED}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${ORANGE_RED}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Navy background + dot grid -->
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Brand label top centre -->
  <text x="${W/2}" y="100" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="18" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="3">REPORT DECODED</text>

  <!-- Huge stat number — centred -->
  <text x="${W/2}" y="320" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="180" font-weight="300" fill="${ORANGE_RED}"
        letter-spacing="-4">60</text>

  <!-- Stacked headline lines, centred -->
  <text x="${W/2}" y="430" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="52" font-weight="400" fill="${CREAM}"
        letter-spacing="-1">pages of jargon.</text>
  <text x="${W/2}" y="500" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="52" font-weight="400" fill="${AMBER}"
        letter-spacing="-1">36 hours to decide.</text>
  <text x="${W/2}" y="570" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="52" font-weight="400" fill="${CREAM}"
        letter-spacing="-1">$700,000 on the line.</text>

  <!-- Red underline divider -->
  <rect x="${W/2 - 220}" y="600" width="440" height="3" fill="url(#redLine)"/>

  <!-- Body text — wrapped -->
  <text x="${W/2}" y="680" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="400" fill="rgba(247,243,238,0.78)"
        letter-spacing="0.1">Every year, 420,000 Australians receive</text>
  <text x="${W/2}" y="716" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="400" fill="rgba(247,243,238,0.78)"
        letter-spacing="0.1">a building inspection report they cannot</text>
  <text x="${W/2}" y="752" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="400" fill="rgba(247,243,238,0.78)"
        letter-spacing="0.1">interpret. Most just guess.</text>

  <!-- "Sound familiar?" pill — centred -->
  <g transform="translate(${W/2 - 130}, 820)">
    <rect width="260" height="56" rx="28" fill="${ORANGE_RED}"/>
    <text x="130" y="38" text-anchor="middle"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="22" font-weight="700" fill="#ffffff"
          letter-spacing="0.4">SOUND FAMILIAR?</text>
  </g>

  <!-- URL bottom centre -->
  <text x="${W/2}" y="990" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace"
        font-size="22" font-weight="500" fill="rgba(247,243,238,0.55)"
        letter-spacing="0.5">reportdecoded.com.au</text>
</svg>
`;

const buffer = await sharp({
  create: { width: W, height: H, channels: 4, background: NAVY },
})
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toBuffer();

const OUT = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts\02_problem_centered.png`;
await sharp(buffer).png().toFile(OUT);
console.log(`✓ Wrote ${OUT} (${W}×${H})`);
