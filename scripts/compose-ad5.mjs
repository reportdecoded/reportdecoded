// scripts/compose-ad5.mjs
//
// Compose Ad 5 — "Building inspection not making sense?"
//
// Problem-led variant: the existing Ad 1-4 set is outcome-led ($42K
// off, $32K off her terrace, etc.) which works for warm/educated
// audiences but goes over cold buyers' heads — they don't connect the
// dollar outcome back to the product.
//
// This ad inverts: lead with the pain (overwhelmed buyer with a 60-page
// inspection PDF), then surface the product as the obvious fix. One
// mental step instead of three.
//
// Inputs:  C:\Users\morga\OneDrive\Desktop\Report Decoded\AD 5.png
// Output:  C:\Users\morga\OneDrive\Desktop\Report Decoded\Ads-v2\Ad5-Confused-{size}.png
//
// Brand language matches compose-ads.mjs (NAVY/AMBER/CREAM, Fraunces +
// DM Sans, scrim + footer band pattern). Same dark/light variant
// support via argv.
//
// Usage:
//   node scripts/compose-ad5.mjs        # dark variant (default)
//   node scripts/compose-ad5.mjs light  # cream-band variant

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';

const SRC_DIR = 'C:\\Users\\morga\\OneDrive\\Desktop\\Report Decoded';
const SRC_FILE = 'AD 5.png';

const VARIANT = (process.argv[2] || 'dark').toLowerCase();
const OUT_DIR = VARIANT === 'light'
  ? 'C:\\Users\\morga\\OneDrive\\Desktop\\Report Decoded\\Ads-v2-Light'
  : 'C:\\Users\\morga\\OneDrive\\Desktop\\Report Decoded\\Ads-v2';

const SIZES = [
  { name: '1080x1080', w: 1080, h: 1080 },
  { name: '1080x1350', w: 1080, h: 1350 },
  { name: '1080x1920', w: 1080, h: 1920 },
];

// Variant palette — matches the resolution in compose-ads.mjs
const P = VARIANT === 'light'
  ? {
      bandFill:        CREAM,
      headlineFill:    NAVY,
      italicAccent:    AMBER,
      bandText:        NAVY,
      bandTextDim:     'rgba(10,22,40,0.62)',
      bandTextFaint:   'rgba(10,22,40,0.48)',
      topAccent:       NAVY,
      scrimFill:       CREAM,
      scrimOpacity:    0.82,
      bottomGradFrom:  CREAM,
      topGradFrom:     CREAM,
      topGradOpacity:  0.78,
    }
  : {
      bandFill:        NAVY,
      headlineFill:    '#ffffff',
      italicAccent:    AMBER,
      bandText:        '#ffffff',
      bandTextDim:     'rgba(255,255,255,0.70)',
      bandTextFaint:   'rgba(255,255,255,0.55)',
      topAccent:       FAINT_AMBER,
      scrimFill:       NAVY,
      scrimOpacity:    0.62,
      bottomGradFrom:  NAVY,
      topGradFrom:     NAVY,
      topGradOpacity:  0.78,
    };

function commonDefs() {
  return `
    <defs>
      <linearGradient id="topGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${P.topGradFrom}" stop-opacity="${P.topGradOpacity}"/>
        <stop offset="100%" stop-color="${P.topGradFrom}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottomGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="${P.bottomGradFrom}" stop-opacity="${VARIANT === 'light' ? 0.78 : 0.96}"/>
        <stop offset="60%" stop-color="${P.bottomGradFrom}" stop-opacity="${VARIANT === 'light' ? 0.35 : 0.55}"/>
        <stop offset="100%" stop-color="${P.bottomGradFrom}" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="hairline" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${AMBER}" stop-opacity="0"/>
        <stop offset="50%" stop-color="${AMBER}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${AMBER}" stop-opacity="0"/>
      </linearGradient>
    </defs>
  `;
}

function topBadge(x, y, w, h, text, opts = {}) {
  const fill = opts.fill || 'rgba(201,122,58,0.92)';
  const textFill = opts.textFill || '#ffffff';
  const fontSize = opts.fontSize || 22;
  return `
    <g transform="translate(${x}, ${y})">
      <rect width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>
      <text x="${w / 2}" y="${h / 2 + fontSize / 3}" text-anchor="middle"
            font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="${fontSize}" font-weight="600" fill="${textFill}"
            letter-spacing="0.4">${text}</text>
    </g>
  `;
}

function topPlainBadge(x, y, text, opts = {}) {
  const fontSize = opts.fontSize || 20;
  const fill = opts.fill || FAINT_AMBER;
  return `
    <text x="${x}" y="${y}" font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="${fontSize}" font-weight="600" fill="${fill}"
          letter-spacing="2.0">${text}</text>
  `;
}

// ─── AD 5 — PROBLEM-LED OVERLAY ────────────────────────────────────
//
// Layout: top gradient + timestamp + price chip → headline lower-left
// with subtle scrim → sub line → bottom navy band with URL + trust
// signals. Mirrors Ad 1's lower-left composition but uses a question
// hook instead of an outcome statement.
function makeAd5Overlay(W, H) {
  const headlineFontSize = Math.round(W * 0.078);
  const subFontSize = Math.round(W * 0.024);

  // Position the headline ~38% from bottom so the sub line + band fit
  // cleanly underneath without crowding the photo subject's face.
  const headlineY = H - Math.round(H * 0.38);
  const headlineY2 = headlineY + Math.round(headlineFontSize * 1.05);

  // Scrim panel behind headline for legibility against varied photo
  // backgrounds (kitchen warm tones, dark wood, etc.)
  const scrimX = 0;
  const scrimY = headlineY - Math.round(headlineFontSize * 0.95);
  const scrimW = Math.round(W * 0.68);
  const scrimH = Math.round(headlineFontSize * 2.6);

  // Bottom band fills the lower ~16% of the canvas with the URL +
  // trust signals.
  const bandY = H - Math.round(H * 0.16);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      ${commonDefs()}

      <!-- Photo lightener for light variant (subtle cream wash) -->
      ${VARIANT === 'light'
        ? `<rect width="${W}" height="${H}" fill="${CREAM}" opacity="0.18"/>`
        : ''}

      <!-- Top gradient for legibility of timestamp + price chip -->
      <rect width="${W}" height="${Math.round(H * 0.18)}" fill="url(#topGrad)"/>

      <!-- Top-left timestamp -->
      ${topPlainBadge(56, 64, 'SUNDAY 9:14 PM.', { fill: P.topAccent })}

      <!-- Top-right price chip -->
      ${topBadge(W - 56 - 280, 36, 280, 44, '$59 · NO SUBSCRIPTION')}

      <!-- Bottom gradient for headline legibility -->
      <rect y="${Math.round(H * 0.40)}" width="${W}" height="${Math.round(H * 0.60)}" fill="url(#bottomGrad)"/>

      <!-- Subtle scrim panel behind headline (left-aligned, only behind the text) -->
      <rect x="${scrimX}" y="${scrimY}" width="${scrimW}" height="${scrimH}"
            fill="${P.scrimFill}" opacity="${VARIANT === 'light' ? 0.55 : 0.42}"/>

      <!-- Headline line 1: "Building inspection" (white serif) -->
      <text x="56" y="${headlineY}"
            font-family="Fraunces, Georgia, serif"
            font-size="${headlineFontSize}" font-weight="500"
            fill="${P.headlineFill}" letter-spacing="-0.8">Building inspection</text>

      <!-- Headline line 2: "not making sense?" (amber italic) -->
      <text x="56" y="${headlineY2}"
            font-family="Fraunces, Georgia, serif" font-style="italic"
            font-size="${headlineFontSize}" font-weight="500"
            fill="${P.italicAccent}" letter-spacing="-0.8">not making sense?</text>

      <!-- Sub line: function statement, single sentence -->
      <text x="56" y="${headlineY2 + Math.round(headlineFontSize * 1.05)}"
            font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="${subFontSize}" font-weight="400"
            fill="${VARIANT === 'light' ? 'rgba(10,22,40,0.82)' : 'rgba(255,255,255,0.88)'}"
            letter-spacing="0.1">Plain-English verdict + repair costs + drafted</text>
      <text x="56" y="${headlineY2 + Math.round(headlineFontSize * 1.05) + Math.round(subFontSize * 1.5)}"
            font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="${subFontSize}" font-weight="400"
            fill="${VARIANT === 'light' ? 'rgba(10,22,40,0.82)' : 'rgba(255,255,255,0.88)'}"
            letter-spacing="0.1">negotiation letter — sent in 2 minutes.</text>

      <!-- Amber hairline between content + band -->
      <rect x="0" y="${bandY - 4}" width="${W}" height="2" fill="url(#hairline)"/>

      <!-- Bottom band: navy fill (dark) / cream (light) -->
      <rect x="0" y="${bandY}" width="${W}" height="${H - bandY}" fill="${P.bandFill}"/>

      <!-- Band content: URL primary, trust line secondary -->
      <text x="56" y="${bandY + 50}"
            font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="26" font-weight="700"
            fill="${P.bandText}" letter-spacing="0.3">reportdecoded.com.au</text>
      <text x="56" y="${bandY + 90}"
            font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="18" font-weight="500"
            fill="${P.bandTextDim}" letter-spacing="0.4">Built in Australia · AS4349.1 compliant</text>
    </svg>
  `;
}

// ─── COMPOSITION LOOP ──────────────────────────────────────────────

async function compose(size) {
  const { w: W, h: H } = size;
  const srcPath = `${SRC_DIR}\\${SRC_FILE}`;

  // Cover-crop the photo to the target canvas. 'center' keeps the
  // couple-at-kitchen-table subject central across all 3 aspect
  // ratios — the most aggressive crop (9:16) will trim left/right
  // but keep the human subject in frame.
  const photoBuffer = await sharp(srcPath)
    .resize(W, H, { fit: 'cover', position: 'center' })
    .toBuffer();

  const svg = makeAd5Overlay(W, H);
  const finalBuffer = await sharp(photoBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  const outPath = `${OUT_DIR}\\Ad5-Confused-${size.name}.png`;
  await sharp(finalBuffer).png().toFile(outPath);
  console.log(`✓ Ad5-Confused ${size.name}`);
}

mkdirSync(OUT_DIR, { recursive: true });
console.log(`Composing Ad 5 × 3 sizes (variant: ${VARIANT})...\n`);
for (const size of SIZES) {
  await compose(size);
}
console.log(`\nDone. Output: ${OUT_DIR}`);
