// scripts/article-story.mjs
//
// Compose a 1080x1920 Instagram Story slide promoting the new
// "what to do if your building inspection finds major problems"
// article. Brand-matched navy + amber + cream. Bottom third
// intentionally left light so an IG Link sticker can sit on top
// without competing with the text.

import sharp from 'sharp';

const W = 1080;
const H = 1920;
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

  <!-- Navy bg + dot grid -->
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Top eyebrow -->
  <text x="${W/2}" y="240" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="30" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="6">NEW ON THE BLOG</text>

  <!-- Pre-hook line -->
  <text x="${W/2}" y="360" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="36" font-weight="400" fill="rgba(247,243,238,0.7)"
        letter-spacing="0.2">Building report came back ugly?</text>

  <!-- Big serif headline -->
  <text x="${W/2}" y="540" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="92" font-weight="500" fill="${CREAM}"
        letter-spacing="-2">Cooling-off</text>
  <text x="${W/2}" y="650" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-style="italic" font-size="92" font-weight="500" fill="${AMBER}"
        letter-spacing="-2">ends Friday.</text>

  <!-- Hairline divider -->
  <rect x="${W/2 - 200}" y="730" width="400" height="2" fill="url(#hairline)"/>

  <!-- Framework intro -->
  <text x="${W/2}" y="830" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="32" font-weight="400" fill="rgba(247,243,238,0.82)"
        letter-spacing="0.2">5-step framework before you call the agent:</text>

  <!-- 5 numbered steps, centered -->
  <g font-family="DM Sans, Helvetica, Arial, sans-serif"
     font-size="32" font-weight="500" fill="${CREAM}"
     letter-spacing="0.2">
    <text x="${W/2}" y="940" text-anchor="middle">
      <tspan fill="${AMBER}" font-weight="700">1 </tspan>· Don't reply tonight
    </text>
    <text x="${W/2}" y="1010" text-anchor="middle">
      <tspan fill="${AMBER}" font-weight="700">2 </tspan>· Triage every finding A / B / C
    </text>
    <text x="${W/2}" y="1080" text-anchor="middle">
      <tspan fill="${AMBER}" font-weight="700">3 </tspan>· Commission specialist follow-ups
    </text>
    <text x="${W/2}" y="1150" text-anchor="middle">
      <tspan fill="${AMBER}" font-weight="700">4 </tspan>· Apply the 5% rule
    </text>
    <text x="${W/2}" y="1220" text-anchor="middle">
      <tspan fill="${AMBER}" font-weight="700">5 </tspan>· Document in writing
    </text>
  </g>

  <!-- CTA hint pointing down to where the link sticker will sit -->
  <text x="${W/2}" y="1380" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="28" font-style="italic" font-weight="400" fill="rgba(247,243,238,0.55)"
        letter-spacing="0.2">Full article + email template →</text>
  <text x="${W/2}" y="1440" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="36" font-weight="600" fill="${AMBER}"
        letter-spacing="0.4">Tap the link sticker 👇</text>

  <!-- Brand mark bottom -->
  <text x="${W/2}" y="1820" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace"
        font-size="26" font-weight="500" fill="rgba(247,243,238,0.55)"
        letter-spacing="0.5">reportdecoded.com.au</text>
</svg>
`;

const buffer = await sharp({
  create: { width: W, height: H, channels: 4, background: NAVY },
})
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toBuffer();

const OUT = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts\story-article-framework.png`;
await sharp(buffer).png().toFile(OUT);
console.log(`✓ Wrote ${OUT} (${W}×${H})`);
