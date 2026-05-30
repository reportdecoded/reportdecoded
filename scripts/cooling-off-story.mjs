// scripts/cooling-off-story.mjs
//
// Compose a 1080x1920 Instagram Story slide for the cooling-off
// rights by state article. Tight state-list format with statutory
// cooling-off days per jurisdiction — high info density, scannable
// in 3 seconds (the only window Story viewers give you).

import sharp from 'sharp';

const W = 1080;
const H = 1920;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';

const states = [
  { code: 'VIC', days: '3 days' },
  { code: 'NSW', days: '5 days' },
  { code: 'QLD', days: '5 days' },
  { code: 'SA',  days: '2 days' },
  { code: 'WA',  days: 'none statutory' },
  { code: 'ACT', days: '5 days' },
  { code: 'TAS', days: 'none statutory' },
  { code: 'NT',  days: '4 days' },
];

const startY = 880;
const rowH = 70;

const stateRows = states.map((s, i) => {
  const y = startY + i * rowH;
  return `
    <text x="380" y="${y}" text-anchor="end"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="40" font-weight="700" fill="${AMBER}"
          letter-spacing="0.4">${s.code}</text>
    <text x="430" y="${y}" text-anchor="start"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="36" font-weight="400" fill="${CREAM}"
          letter-spacing="0.2">${s.days}</text>
  `;
}).join('');

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

  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Top eyebrow -->
  <text x="${W/2}" y="240" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="30" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="6">NEW ON THE BLOG</text>

  <!-- Big serif headline -->
  <text x="${W/2}" y="420" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="80" font-weight="500" fill="${CREAM}"
        letter-spacing="-2">Cooling-off rights</text>
  <text x="${W/2}" y="510" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-style="italic" font-size="80" font-weight="500" fill="${AMBER}"
        letter-spacing="-2">state by state.</text>

  <!-- Hairline divider -->
  <rect x="${W/2 - 200}" y="600" width="400" height="2" fill="url(#hairline)"/>

  <!-- Sub-header -->
  <text x="${W/2}" y="680" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="28" font-weight="400" fill="rgba(247,243,238,0.7)"
        letter-spacing="0.2">Statutory cooling-off window after exchange:</text>

  <!-- State rows -->
  ${stateRows}

  <!-- Footer warning -->
  <text x="${W/2}" y="1500" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="32" font-style="italic" font-weight="500" fill="${AMBER}"
        letter-spacing="0.2">All waive at auction.</text>

  <!-- CTA hint -->
  <text x="${W/2}" y="1640" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="30" font-weight="400" fill="rgba(247,243,238,0.75)"
        letter-spacing="0.2">Full state-by-state guide →</text>
  <text x="${W/2}" y="1700" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="34" font-weight="600" fill="${AMBER}"
        letter-spacing="0.4">Tap the link sticker 👇</text>

  <!-- Brand line -->
  <text x="${W/2}" y="1830" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace"
        font-size="24" font-weight="500" fill="rgba(247,243,238,0.5)"
        letter-spacing="0.5">reportdecoded.com.au</text>
</svg>
`;

const buffer = await sharp({
  create: { width: W, height: H, channels: 4, background: NAVY },
})
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toBuffer();

const OUT = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts\story-cooling-off.png`;
await sharp(buffer).png().toFile(OUT);
console.log(`✓ Wrote ${OUT} (${W}×${H})`);
