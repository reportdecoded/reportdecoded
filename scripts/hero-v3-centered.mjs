// scripts/hero-v3-centered.mjs
//
// Compose a v3 launch hero where ALL critical text + brand elements
// sit within the central 600px column of a 1080x1080 square. This
// guarantees the image survives Instagram's profile grid crop — even
// the aggressive ~9:16 vertical crop some 2026 IG markets use.
//
// Output: 01_hero_centered.png

import sharp from 'sharp';

const W = 1080;
const H = 1080;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)"/>
    </pattern>
    <linearGradient id="hairline" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${AMBER}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${AMBER}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Navy background + subtle dot grid -->
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- AI badge — centered above the headline (was corner, now safe-zone) -->
  <g transform="translate(${W/2 - 50}, 120)">
    <rect width="100" height="100" rx="14" fill="${AMBER}"/>
    <text x="50" y="68" text-anchor="middle"
          font-family="Fraunces, Georgia, serif"
          font-size="44" font-weight="500" fill="${NAVY}"
          letter-spacing="-1">AI</text>
  </g>

  <!-- Brand label below AI badge -->
  <text x="${W/2}" y="270" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="18" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="3">REPORT DECODED</text>

  <!-- Main headline — fully centered, smaller than v1 so it fits safe zone -->
  <text x="${W/2}" y="430" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="84" font-weight="500" fill="${AMBER}"
        font-style="italic"
        letter-spacing="-2">Finally.</text>

  <text x="${W/2}" y="540" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="58" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">Your building report,</text>

  <text x="${W/2}" y="615" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-style="italic" font-size="58" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">decoded.</text>

  <!-- Hairline divider -->
  <rect x="${W/2 - 200}" y="660" width="400" height="2" fill="url(#hairline)"/>

  <!-- Sub-headline — wrapped to fit safe zone -->
  <text x="${W/2}" y="720" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="400" fill="rgba(247,243,238,0.82)"
        letter-spacing="0.1">Upload your AU building inspection PDF.</text>
  <text x="${W/2}" y="754" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="400" fill="rgba(247,243,238,0.82)"
        letter-spacing="0.1">Plain-English verdict, repair costs &amp; local</text>
  <text x="${W/2}" y="788" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="24" font-weight="400" fill="rgba(247,243,238,0.82)"
        letter-spacing="0.1">tradies — in 60 seconds.</text>

  <!-- Price chip centered -->
  <g transform="translate(${W/2 - 150}, 850)">
    <rect width="300" height="48" rx="24" fill="${AMBER}"/>
    <text x="150" y="32" text-anchor="middle"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="18" font-weight="700" fill="#ffffff"
          letter-spacing="0.4">$59 · NO SUBSCRIPTION</text>
  </g>

  <!-- URL centered at bottom -->
  <text x="${W/2}" y="980" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace"
        font-size="22" font-weight="500" fill="rgba(247,243,238,0.7)"
        letter-spacing="0.5">reportdecoded.com.au</text>
</svg>
`;

const buffer = await sharp({
  create: { width: W, height: H, channels: 4, background: NAVY },
})
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toBuffer();

const OUT = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts\01_hero_centered.png`;
await sharp(buffer).png().toFile(OUT);
console.log(`✓ Wrote ${OUT} (${W}×${H})`);
console.log('All critical text + badge within central 600px safe zone — survives any IG grid crop.');
