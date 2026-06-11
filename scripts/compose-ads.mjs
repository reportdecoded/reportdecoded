// scripts/compose-ads.mjs
//
// Compose all 4 Report Decoded social media ads using Sharp + SVG.
// Produces 1080×1080 (Meta/IG feed), 1080×1350 (IG portrait),
// and 1080×1920 (Stories/Reels/TikTok) for each of 4 ads.
//
// Brand colors are pinned to lib/runAnalysis.js + components/ReportDecoded.jsx.
// Fonts fall back through Fraunces → Georgia / DM Sans → Helvetica / Arial
// so they render without needing custom font loading.
//
// Inputs: C:\Users\morga\OneDrive\Desktop\Report Decoded\{Ad 1,ad 2,Ad 3,Ad 4} - RD.png
// Output: C:\Users\morga\OneDrive\Desktop\Report Decoded\Ads-v2\Ad{N}-{name}-{W}x{H}.png
//
// Usage: node scripts/compose-ads.mjs

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';

const SRC_DIR = 'C:\\Users\\morga\\OneDrive\\Desktop\\Report Decoded';

// Variant: 'dark' (default — navy band + white/amber text over photo) or
// 'light' (cream band + navy text, softer gradient — better for some Meta
// audiences and Pinterest). Pass via argv: `node compose-ads.mjs light`.
const VARIANT = (process.argv[2] || 'dark').toLowerCase();
const OUT_DIR = VARIANT === 'light'
  ? 'C:\\Users\\morga\\OneDrive\\Desktop\\Report Decoded\\Ads-v2-Light'
  : 'C:\\Users\\morga\\OneDrive\\Desktop\\Report Decoded\\Ads-v2';

// Three aspect ratios per ad: square (Meta feed), portrait (IG feed), vertical (Stories/Reels).
const SIZES = [
  { name: '1080x1080', w: 1080, h: 1080 },
  { name: '1080x1350', w: 1080, h: 1350 },
  { name: '1080x1920', w: 1080, h: 1920 },
];

// ─── AD DEFINITIONS ────────────────────────────────────────────────
// Each ad maps to a source photo file and an SVG-overlay generator.

const ADS = [
  {
    slug: 'Ad1-Kitchen',
    sourceFile: 'Ad 1 - RD.png',
    // Center-crop: kitchen-guy's face is centered in the portrait photo
    cropPosition: 'center',
    overlay: makeAd1Overlay,
  },
  {
    slug: 'Ad2-Couple',
    sourceFile: 'ad 2 - RD.png',
    // Center-crop keeps couple visible with jacaranda above + sign to left
    cropPosition: 'center',
    overlay: makeAd2Overlay,
  },
  {
    slug: 'Ad3-Friends',
    sourceFile: 'Ad 3 - RD.png',
    // 'center' keeps the three friends visible — they sit center-bottom
    // of the portrait. Tried 'top' but it cropped to plants/shelves only.
    cropPosition: 'center',
    overlay: makeAd3Overlay,
  },
  {
    slug: 'Ad4-Agent',
    sourceFile: 'Ad 4 - RD.png',
    // 'center' keeps the agent's face in the upper portion of the square.
    // Tried 'top' but it cropped to window/ceiling only.
    cropPosition: 'center',
    overlay: makeAd4Overlay,
  },
];

// ─── SVG OVERLAY GENERATORS ────────────────────────────────────────
// Each function returns an SVG string sized to (W × H). The SVG draws:
//   1. A dark gradient from bottom (legibility for text over photo)
//   2. Top badges (left + right)
//   3. Headline (Fraunces serif, large)
//   4. Sub-headline (Inter sans, lighter)
//   5. Footer band with secondary info
//
// All positions scale with H so the same layout works for square,
// portrait, and vertical.

// Palette resolves per variant. Light variant inverts to cream-band +
// navy-text scheme; dark variant keeps the original navy-band aesthetic.
const P = VARIANT === 'light'
  ? {
      bandFill:        CREAM,                       // bottom band background
      headlineFill:    NAVY,                        // main headline (was white)
      italicAccent:    AMBER,                       // amber stays for accent
      bandText:        NAVY,                        // body in band
      bandTextDim:     'rgba(10,22,40,0.62)',       // dimmer body in band
      bandTextFaint:   'rgba(10,22,40,0.48)',       // refund line / smallest text
      topAccent:       NAVY,                        // top-left text: navy reads on cream-tinted gradient
      scrimFill:       CREAM,                       // headline scrim (Ad 2 + Ad 3 light only)
      scrimOpacity:    0.82,
      bottomGradFrom:  CREAM,
      topGradFrom:     CREAM,
      topGradOpacity:  0.78,                        // boosted from 0.65 so top text reads
      photoLightener:  true,                        // overlay subtle cream wash on photo
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
      photoLightener:  false,
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

// ─── AD 1 — KITCHEN GUY ────────────────────────────────────────────
function makeAd1Overlay(W, H) {
  const headlineY = H - (H * 0.32);   // Headline ~ 1/3 from bottom
  const subY = headlineY + H * 0.07;
  const footerY = H - 80;
  const headlineFontSize = Math.round(W * 0.078);
  const subFontSize = Math.round(W * 0.028);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      ${commonDefs()}
      <rect width="${W}" height="${H * 0.18}" fill="url(#topGrad)"/>
      <rect y="${H * 0.45}" width="${W}" height="${H * 0.55}" fill="url(#bottomGrad)"/>

      ${topPlainBadge(56, 64, 'SUNDAY 5:07 PM.', { fill: P.topAccent })}
      ${topBadge(W - 56 - 280, 36, 280, 44, '$59 · NO SUBSCRIPTION')}

      ${VARIANT === 'light' ? `
        <!-- Cream scrim behind headline so amber italic reads against warm kitchen tones -->
        <rect x="0" y="${headlineY - headlineFontSize * 0.95}" width="${W * 0.85}" height="${headlineFontSize * 2.7}"
              fill="${CREAM}" opacity="${P.scrimOpacity}"/>
      ` : ''}

      <text x="56" y="${headlineY}" font-family="Fraunces, Georgia, serif"
            font-size="${headlineFontSize}" font-weight="500" fill="${P.headlineFill}"
            letter-spacing="-1.0">He just realised</text>
      <text x="56" y="${headlineY + headlineFontSize * 1.05}" font-family="Fraunces, Georgia, serif"
            font-style="italic" font-size="${headlineFontSize}" font-weight="500" fill="${P.italicAccent}"
            letter-spacing="-1.0">he can ask $42K off.</text>

      <text x="56" y="${headlineY + headlineFontSize * 2.4}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="${subFontSize}" font-weight="400" fill="${VARIANT === 'light' ? 'rgba(10,22,40,0.82)' : 'rgba(255,255,255,0.86)'}"
            letter-spacing="0.1">Without sounding crazy. Verdict, repair costs,</text>
      <text x="56" y="${headlineY + headlineFontSize * 2.4 + subFontSize * 1.5}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="${subFontSize}" font-weight="400" fill="${VARIANT === 'light' ? 'rgba(10,22,40,0.82)' : 'rgba(255,255,255,0.86)'}"
            letter-spacing="0.1">and a drafted negotiation letter — sent in 2 minutes.</text>

      <rect x="0" y="${footerY - 16}" width="${W}" height="2" fill="url(#hairline)"/>
      <text x="56" y="${footerY + 16}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="24" font-weight="600" fill="${P.bandText}" letter-spacing="0.3">reportdecoded.com.au</text>
      <text x="${W - 56}" y="${footerY + 16}" text-anchor="end" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="16" font-weight="400" fill="${P.bandTextDim}" letter-spacing="0.3">Built in Australia · AS4349.1</text>
    </svg>
  `;
}

// ─── AD 2 — AUCTION COUPLE ─────────────────────────────────────────
function makeAd2Overlay(W, H) {
  // Headline + scrim moved to UPPER-LEFT region (where AUCTION sign + dark
  // jacaranda is in most crops) — keeps the couple's faces clear in the
  // lower-right zone. Scrim is small + left-aligned, not a full panel.
  const scrimY = H * 0.20;
  const scrimW = W * 0.58;
  const scrimH = H * 0.20;
  const headlineY = scrimY + scrimH * 0.42;
  const bandY = H - (H * 0.26);
  const headlineFontSize = Math.round(W * 0.072);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      ${commonDefs()}
      <rect width="${W}" height="${H * 0.18}" fill="url(#topGrad)"/>

      ${topPlainBadge(56, 64, 'WE WON THE AUCTION.', { fill: VARIANT === 'light' ? CREAM : '#ffffff' })}
      ${topBadge(W - 56 - 260, 36, 260, 44, '📋 AS4349.1 COMPLIANT')}

      <!-- Subtle scrim panel (left-aligned, behind headline only) for legibility -->
      <rect x="0" y="${scrimY}" width="${scrimW}" height="${scrimH}" fill="${P.scrimFill}" opacity="${P.scrimOpacity}"/>

      <text x="56" y="${headlineY}" font-family="Fraunces, Georgia, serif"
            font-style="italic" font-size="${headlineFontSize}" font-weight="500" fill="${VARIANT === 'light' ? NAVY : AMBER}"
            letter-spacing="-0.8">Then we read</text>
      <text x="56" y="${headlineY + headlineFontSize * 1.05}" font-family="Fraunces, Georgia, serif"
            font-style="italic" font-size="${headlineFontSize}" font-weight="500" fill="${VARIANT === 'light' ? AMBER : AMBER}"
            letter-spacing="-0.8">page 47.</text>

      <rect x="0" y="${bandY}" width="${W}" height="${H - bandY}" fill="${P.bandFill}"/>
      <text x="56" y="${bandY + 38}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="20" font-weight="400" fill="${P.bandTextDim}" letter-spacing="0.2">Plain English defects · Repair costs · Local tradies · Negotiation letter</text>
      <text x="56" y="${bandY + 80}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="26" font-weight="600" fill="${P.bandText}" letter-spacing="0.1">Results in <tspan fill="${AMBER}">2 minutes.</tspan></text>
      <text x="56" y="${bandY + 130}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="22" font-weight="500" fill="${P.bandText}" letter-spacing="0.2">$59 per report · No subscription · reportdecoded.com.au</text>
    </svg>
  `;
}

// ─── AD 3 — FRIENDS CAFE ───────────────────────────────────────────
function makeAd3Overlay(W, H) {
  const headlineY = H - (H * 0.36);
  const bandY = H - (H * 0.22);
  const headlineFontSize = Math.round(W * 0.075);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      ${commonDefs()}
      <rect width="${W}" height="${H * 0.16}" fill="url(#topGrad)"/>
      <rect y="${H * 0.40}" width="${W}" height="${H * 0.60}" fill="url(#bottomGrad)"/>

      ${topBadge(56, 36, 260, 44, '📋 AS4349.1 COMPLIANT')}

      ${VARIANT === 'light' ? `
        <!-- Cream scrim behind headline so navy text reads against dark cafe interior -->
        <rect x="0" y="${headlineY - headlineFontSize * 0.95}" width="${W * 0.78}" height="${headlineFontSize * 2.8}"
              fill="${CREAM}" opacity="${P.scrimOpacity}"/>
      ` : ''}

      <text x="56" y="${headlineY}" font-family="Fraunces, Georgia, serif"
            font-size="${headlineFontSize}" font-weight="500" fill="${P.headlineFill}"
            letter-spacing="-1.0">$32K off her</text>
      <text x="56" y="${headlineY + headlineFontSize * 1.05}" font-family="Fraunces, Georgia, serif"
            font-style="italic" font-size="${headlineFontSize}" font-weight="500" fill="${P.italicAccent}"
            letter-spacing="-1.0">Brunswick terrace.</text>
      <text x="56" y="${headlineY + headlineFontSize * 1.05 + 50}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="${Math.round(W * 0.026)}" font-style="italic" font-weight="400" fill="${VARIANT === 'light' ? 'rgba(10,22,40,0.78)' : 'rgba(255,255,255,0.85)'}"
            letter-spacing="0.2">Then her friends wanted in.</text>

      <rect x="0" y="${bandY}" width="${W}" height="${H - bandY}" fill="${P.bandFill}"/>
      <text x="56" y="${bandY + 38}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="18" font-weight="400" fill="${P.bandTextDim}" letter-spacing="0.2">Plain English defects · Repair costs · Local tradies · Negotiation letter</text>
      <text x="56" y="${bandY + 80}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="26" font-weight="700" fill="${AMBER}" letter-spacing="0.2">From $59 · reportdecoded.com.au</text>
      <text x="56" y="${bandY + 124}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="16" font-weight="400" fill="${P.bandTextFaint}" letter-spacing="0.2">No subscription · Results in 60 seconds · AU Standard AS4349.1</text>
    </svg>
  `;
}

// ─── AD 4 — BUYER'S AGENT ──────────────────────────────────────────
function makeAd4Overlay(W, H) {
  // Restructured: navy band is BIGGER (45% of canvas) so the headline
  // sits cleanly in solid navy below the agent's face — not overlapping
  // it. The 'top' crop keeps the agent in the upper-middle of the photo.
  const bandY = H - (H * 0.46);
  const headlineFontSize = Math.round(W * 0.075);
  const subFontSize = Math.round(W * 0.024);
  const headlineY = bandY + 80;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      ${commonDefs()}
      <rect width="${W}" height="${H * 0.22}" fill="url(#topGrad)"/>

      ${topPlainBadge(56, 56, 'FOR BUYER’S AGENTS', { fill: AMBER, fontSize: 22 })}
      ${topPlainBadge(56, 88, 'COMPETITORS READ. YOU DECODE.', { fill: VARIANT === 'light' ? 'rgba(10,22,40,0.78)' : 'rgba(255,255,255,0.85)', fontSize: 16 })}

      <rect x="0" y="${bandY}" width="${W}" height="${H - bandY}" fill="${P.bandFill}"/>

      <text x="56" y="${headlineY}" font-family="Fraunces, Georgia, serif"
            font-size="${headlineFontSize}" font-weight="500" fill="${P.headlineFill}"
            letter-spacing="-1.0">12 reports a week?</text>
      <text x="56" y="${headlineY + headlineFontSize * 1.05}" font-family="Fraunces, Georgia, serif"
            font-style="italic" font-size="${headlineFontSize}" font-weight="500" fill="${P.italicAccent}"
            letter-spacing="-1.0">You’re reading 564 pages.</text>

      <text x="56" y="${headlineY + headlineFontSize * 2.4}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="${subFontSize}" font-weight="400" fill="${VARIANT === 'light' ? 'rgba(10,22,40,0.78)' : 'rgba(255,255,255,0.78)'}"
            letter-spacing="0.1">Verdict, cost forecast, and a drafted negotiation letter —</text>
      <text x="56" y="${headlineY + headlineFontSize * 2.4 + subFontSize * 1.5}" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="${subFontSize}" font-weight="400" fill="${VARIANT === 'light' ? 'rgba(10,22,40,0.78)' : 'rgba(255,255,255,0.78)'}"
            letter-spacing="0.1">sent to your client in under 2 minutes. Every report.</text>

      <g transform="translate(56, ${headlineY + headlineFontSize * 2.4 + subFontSize * 4.2})">
        <rect width="280" height="44" rx="22" fill="${AMBER}"/>
        <text x="140" y="29" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
              font-size="18" font-weight="700" fill="#ffffff" letter-spacing="0.3">🎁 FIRST REPORT FREE</text>
      </g>

      <text x="${W - 56}" y="${H - 64}" text-anchor="end" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="20" font-weight="600" fill="${P.bandText}" letter-spacing="0.2">reportdecoded.com.au</text>
      <text x="${W - 56}" y="${H - 36}" text-anchor="end" font-family="DM Sans, Helvetica, Arial, sans-serif"
            font-size="14" font-weight="400" fill="${P.bandTextFaint}" letter-spacing="0.2">$79/mo · 25 reports | $149/mo · unlimited</text>
    </svg>
  `;
}

// ─── COMPOSITION LOOP ──────────────────────────────────────────────

async function compose(ad, size) {
  const { w: W, h: H } = size;
  const srcPath = `${SRC_DIR}\\${ad.sourceFile}`;

  // Cover-crop the photo to fit the canvas. Uses per-ad cropPosition
  // (declared on the AD object) — 'attention' auto-detected faces but
  // also cropped too aggressively on Ad 3 (hair instead of faces).
  const photoBuffer = await sharp(srcPath)
    .resize(W, H, { fit: 'cover', position: ad.cropPosition || 'center' })
    .toBuffer();

  // Overlay the SVG on top of the cropped photo.
  const svg = ad.overlay(W, H);
  const finalBuffer = await sharp(photoBuffer)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  const outPath = `${OUT_DIR}\\${ad.slug}-${size.name}.png`;
  await sharp(finalBuffer).png().toFile(outPath);
  console.log(`✓ ${ad.slug} ${size.name}`);
}

mkdirSync(OUT_DIR, { recursive: true });
console.log(`Composing 4 ads × 3 sizes = 12 PNGs (variant: ${VARIANT})...\n`);
for (const ad of ADS) {
  for (const size of SIZES) {
    await compose(ad, size);
  }
}
console.log(`\nDone. Output: ${OUT_DIR}`);
