// scripts/compose-fb-cover.mjs
//
// Compose a 1640 × 859 px Facebook Page cover photo.
//
// Layout note: Facebook's modern Page layout centres the profile-
// photo circle horizontally and overlays it onto the bottom-centre
// of the cover (roughly y=300 → y=600 of the source 1640×859 image,
// centred horizontally). That blocks any text we'd otherwise put
// there. So this design keeps ALL content in the top ~40% — badge
// + headline — and leaves the lower 60% as clean navy field for
// the profile photo to sit on top of.
//
// Output: C:\Users\morga\Downloads\fb-cover.png

import sharp from 'sharp';

const W = 1640;
const H = 859;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const FAINT_AMBER = '#F4C9A0';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)"/>
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

  <!-- Main headline (centred horizontally, top ~40% of cover).
       AU badge dropped — FB's top header chrome crops it anyway,
       and the page bio already says "for Australian property buyers"
       directly under the cover. Cleaner without it. -->
  <text x="${W / 2}" y="295" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="98" font-weight="500" fill="#ffffff" letter-spacing="-0.8">
    Your building report,
  </text>
  <text x="${W / 2}" y="410" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="98" font-weight="500" fill="${AMBER}" letter-spacing="-0.8">
    decoded.
  </text>

  <!-- Profile photo zone below — intentionally empty navy + subtle dots.
       FB's modern Page layout centres the profile photo over this area,
       so any content here would be hidden. -->

  <!-- Amber hairline at the bottom edge -->
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="url(#hairline)"/>
</svg>
`;

const baseImage = await sharp({
  create: { width: W, height: H, channels: 4, background: NAVY },
})
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .png()
  .toBuffer();

const outPath = 'C:\\Users\\morga\\Downloads\\fb-cover.png';
await sharp(baseImage).png().toFile(outPath);
console.log(`✓ Wrote ${outPath} (${W}×${H})`);
console.log('');
console.log('Re-upload to Facebook → your Report Decoded Page →');
console.log('cover photo. Profile circle sits centre-bottom and now');
console.log('lands on clean navy — no overlapping text.');
