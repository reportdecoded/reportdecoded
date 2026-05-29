// scripts/ph-story.mjs
//
// Compose a 1080x1920 Instagram Story slide announcing the Product Hunt
// launch. Same brand language as the rest of the launch creative.

import sharp from 'sharp';

const W = 1080;
const H = 1920;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';
const PH_ORANGE = '#DA552F';

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

  <!-- Navy background + dot grid -->
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Top eyebrow -->
  <text x="${W/2}" y="320" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="32" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="6">WE'RE LIVE ON</text>

  <!-- Big PH badge / wordmark — orange circle with cat icon vibe -->
  <g transform="translate(${W/2 - 110}, 400)">
    <circle cx="110" cy="110" r="110" fill="${PH_ORANGE}"/>
    <text x="110" y="138" text-anchor="middle"
          font-family="Fraunces, Georgia, serif"
          font-size="120" font-weight="600" fill="#ffffff"
          letter-spacing="-4">P</text>
  </g>

  <!-- Headline -->
  <text x="${W/2}" y="780" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="98" font-weight="500" fill="${CREAM}"
        letter-spacing="-2">Product</text>
  <text x="${W/2}" y="900" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-style="italic" font-size="98" font-weight="500" fill="${AMBER}"
        letter-spacing="-2">Hunt.</text>

  <!-- Hairline -->
  <rect x="${W/2 - 240}" y="970" width="480" height="2" fill="url(#hairline)"/>

  <!-- Sub -->
  <text x="${W/2}" y="1060" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="34" font-weight="400" fill="rgba(247,243,238,0.82)"
        letter-spacing="0.1">Report Decoded is launching today.</text>
  <text x="${W/2}" y="1110" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="34" font-weight="400" fill="rgba(247,243,238,0.82)"
        letter-spacing="0.1">Every upvote in the first 24h matters.</text>

  <!-- Big CTA chip — "TAP UP TO SUPPORT" -->
  <g transform="translate(${W/2 - 280}, 1280)">
    <rect width="560" height="120" rx="60" fill="${AMBER}"/>
    <text x="280" y="78" text-anchor="middle"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="42" font-weight="700" fill="#ffffff"
          letter-spacing="0.6">UPVOTE ON PH →</text>
  </g>

  <!-- Hint -->
  <text x="${W/2}" y="1480" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="28" font-style="italic" font-weight="400" fill="rgba(247,243,238,0.55)"
        letter-spacing="0.2">Tap the link sticker below 👇</text>

  <!-- Bottom brand line -->
  <text x="${W/2}" y="1760" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace"
        font-size="28" font-weight="500" fill="rgba(247,243,238,0.6)"
        letter-spacing="0.5">reportdecoded.com.au</text>
</svg>
`;

const buffer = await sharp({
  create: { width: W, height: H, channels: 4, background: NAVY },
})
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toBuffer();

const OUT = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts\ph-story.png`;
await sharp(buffer).png().toFile(OUT);
console.log(`✓ Wrote ${OUT} (${W}×${H})`);
