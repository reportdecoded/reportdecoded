// scripts/ig-carousel-rules.mjs
//
// Compose a 7-slide IG carousel: "5 rules every AU buyer should know
// before settling." Each slide is 1080×1080 with all critical content
// inside a central 800×800 safe zone so nothing gets cropped on IG's
// 4:3-leaning grid view.
//
// Slides:
//   01_cover           — hook ("5 rules every AU buyer should know")
//   02_rule_mould      — rule 1
//   03_rule_strata     — rule 2
//   04_rule_concrete   — rule 3
//   05_rule_auction    — rule 4
//   06_rule_negotiate  — rule 5
//   07_cta             — call to action
//
// Output folder: C:\Users\morga\Downloads\IG_carousel_rules\
//
// To post: upload these 7 images as a single IG carousel in order.
// First slide is the scroll-stopper, so make sure 01_cover.png is
// slide 1 in the IG composer.

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';

const W = 1080;
const H = 1080;
const NAVY = '#0A1628';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const FAINT_AMBER = '#F4C9A0';

const OUT_DIR = 'C:\\Users\\morga\\Downloads\\IG_carousel_rules';
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// Shared svg defs block (reused on every slide so they all have the
// same dot-grid texture and amber hairline gradient).
const SVG_DEFS = `
  <defs>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)"/>
    </pattern>
    <linearGradient id="amberLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${AMBER}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${AMBER}" stop-opacity="0"/>
    </linearGradient>
  </defs>
`;

const SVG_BG = `
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
`;

const BRAND_LABEL = `
  <text x="${W/2}" y="100" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="18" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="3">REPORT DECODED</text>
`;

const URL_FOOTER = `
  <text x="${W/2}" y="990" text-anchor="middle"
        font-family="DM Mono, Courier New, monospace"
        font-size="20" font-weight="500" fill="rgba(247,243,238,0.55)"
        letter-spacing="0.5">reportdecoded.com.au</text>
`;

// Slide template wrapper — drops the body block into the shared shell.
function svgSlide(bodyBlock) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${SVG_DEFS}
  ${SVG_BG}
  ${BRAND_LABEL}
  ${bodyBlock}
  ${URL_FOOTER}
</svg>`;
}

// Common "RULE N" badge used on slides 2-6.
function ruleBadge(n) {
  return `
  <g transform="translate(${W/2 - 80}, 175)">
    <rect width="160" height="44" rx="22" fill="rgba(201,122,58,0.20)" stroke="rgba(201,122,58,0.45)" stroke-width="1"/>
    <text x="80" y="29" text-anchor="middle"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="15" font-weight="700" fill="${FAINT_AMBER}"
          letter-spacing="3">RULE ${n}</text>
  </g>
  `;
}

// ── SLIDE 1 ─ Cover / hook ──────────────────────────────────────────
const slide1 = svgSlide(`
  <!-- Big serif headline, three lines, centre safe zone -->
  <text x="${W/2}" y="350" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="78" font-weight="500" fill="${CREAM}"
        letter-spacing="-1.5">5 rules</text>
  <text x="${W/2}" y="450" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="58" font-weight="400" fill="${CREAM}"
        letter-spacing="-1">every AU buyer</text>
  <text x="${W/2}" y="525" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="58" font-weight="400" fill="${CREAM}"
        letter-spacing="-1">should know</text>
  <text x="${W/2}" y="620" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="64" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">before settling.</text>

  <!-- Hairline -->
  <rect x="${W/2 - 200}" y="690" width="400" height="2" fill="url(#amberLine)"/>

  <!-- Swipe prompt -->
  <text x="${W/2}" y="780" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="500" fill="rgba(247,243,238,0.7)"
        letter-spacing="2">SWIPE →</text>
`);

// ── SLIDE 2 ─ Rule 1: Mould ─────────────────────────────────────────
const slide2 = svgSlide(`
  ${ruleBadge(1)}

  <text x="${W/2}" y="340" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="64" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">Mould is a</text>
  <text x="${W/2}" y="410" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="64" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">symptom.</text>
  <text x="${W/2}" y="510" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="64" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">Moisture is the</text>
  <text x="${W/2}" y="580" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="64" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">problem.</text>

  <rect x="${W/2 - 200}" y="640" width="400" height="2" fill="url(#amberLine)"/>

  <text x="${W/2}" y="720" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">Surface clean without fixing the</text>
  <text x="${W/2}" y="754" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">source = it&apos;s back in 6-12 months.</text>
  <text x="${W/2}" y="810" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="0.1">60-70% of cost is the moisture work.</text>
`);

// ── SLIDE 3 ─ Rule 2: Strata ────────────────────────────────────────
const slide3 = svgSlide(`
  ${ruleBadge(2)}

  <text x="${W/2}" y="340" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="60" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">Read the meeting</text>
  <text x="${W/2}" y="410" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="60" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">minutes.</text>
  <text x="${W/2}" y="510" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="60" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">Not just the</text>
  <text x="${W/2}" y="580" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="60" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">certificate.</text>

  <rect x="${W/2 - 200}" y="640" width="400" height="2" fill="url(#amberLine)"/>

  <text x="${W/2}" y="720" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">A special levy approved at a recent</text>
  <text x="${W/2}" y="754" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">meeting but not yet billed is the</text>
  <text x="${W/2}" y="788" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">single most expensive thing buyers miss.</text>
  <text x="${W/2}" y="844" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="0.1">$8-25k per lot is common.</text>
`);

// ── SLIDE 4 ─ Rule 3: Concrete cancer ───────────────────────────────
const slide4 = svgSlide(`
  ${ruleBadge(3)}

  <text x="${W/2}" y="340" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="60" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">&quot;Concrete cancer&quot;</text>
  <text x="${W/2}" y="410" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="60" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">is rarely</text>
  <text x="${W/2}" y="510" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="60" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">catastrophic.</text>

  <rect x="${W/2 - 200}" y="585" width="400" height="2" fill="url(#amberLine)"/>

  <text x="${W/2}" y="665" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">Typical localised fix: $3-15k.</text>
  <text x="${W/2}" y="700" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">Cosmetic patch: $1.5-5k.</text>
  <text x="${W/2}" y="756" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">Always commission a structural</text>
  <text x="${W/2}" y="790" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">engineer scope ($1.5-3.5k) before</text>
  <text x="${W/2}" y="846" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="0.1">negotiating or walking away.</text>
`);

// ── SLIDE 5 ─ Rule 4: Auction ───────────────────────────────────────
const slide5 = svgSlide(`
  ${ruleBadge(4)}

  <text x="${W/2}" y="340" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="58" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">Auction = no</text>
  <text x="${W/2}" y="410" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="58" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">cooling-off.</text>
  <text x="${W/2}" y="510" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="58" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">Inspect BEFORE</text>
  <text x="${W/2}" y="580" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="58" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">you bid.</text>

  <rect x="${W/2 - 200}" y="640" width="400" height="2" fill="url(#amberLine)"/>

  <text x="${W/2}" y="720" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">Every state explicitly excludes auction</text>
  <text x="${W/2}" y="754" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">sales from cooling-off. Every defect</text>
  <text x="${W/2}" y="810" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="0.1">missed before the hammer is yours.</text>
`);

// ── SLIDE 6 ─ Rule 5: Negotiation ───────────────────────────────────
const slide6 = svgSlide(`
  ${ruleBadge(5)}

  <text x="${W/2}" y="340" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="64" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">Quote the cost.</text>
  <text x="${W/2}" y="440" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="56" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">Don&apos;t ask for</text>
  <text x="${W/2}" y="510" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="56" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">a discount.</text>

  <rect x="${W/2 - 200}" y="585" width="400" height="2" fill="url(#amberLine)"/>

  <text x="${W/2}" y="665" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">&quot;Can you knock something off?&quot;</text>
  <text x="${W/2}" y="700" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">= vague rejection.</text>
  <text x="${W/2}" y="756" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">&quot;Contractor quote $12,400 to fix</text>
  <text x="${W/2}" y="790" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.85)"
        letter-spacing="0.1">waterproofing&quot; = usually accepted.</text>
  <text x="${W/2}" y="846" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="600" fill="${FAINT_AMBER}"
        letter-spacing="0.1">Specific beats vague every time.</text>
`);

// ── SLIDE 7 ─ CTA ───────────────────────────────────────────────────
const slide7 = svgSlide(`
  <text x="${W/2}" y="340" text-anchor="middle"
        font-family="Fraunces, Georgia, serif"
        font-size="56" font-weight="500" fill="${CREAM}"
        letter-spacing="-1">Got a report you</text>
  <text x="${W/2}" y="410" text-anchor="middle"
        font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="56" font-weight="500" fill="${AMBER}"
        letter-spacing="-1">can&apos;t decode?</text>

  <rect x="${W/2 - 200}" y="475" width="400" height="2" fill="url(#amberLine)"/>

  <text x="${W/2}" y="565" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="26" font-weight="400" fill="rgba(247,243,238,0.88)"
        letter-spacing="0.1">Upload your building inspection PDF.</text>
  <text x="${W/2}" y="603" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="26" font-weight="400" fill="rgba(247,243,238,0.88)"
        letter-spacing="0.1">Get a plain-English verdict +</text>
  <text x="${W/2}" y="641" text-anchor="middle"
        font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="26" font-weight="400" fill="rgba(247,243,238,0.88)"
        letter-spacing="0.1">repair costs in 60 seconds.</text>

  <!-- CTA pill -->
  <g transform="translate(${W/2 - 175}, 740)">
    <rect width="350" height="74" rx="37" fill="${AMBER}"/>
    <text x="175" y="48" text-anchor="middle"
          font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="22" font-weight="700" fill="#ffffff"
          letter-spacing="0.4">REPORTDECODED.COM.AU</text>
  </g>
`);

const slides = [
  ['01_cover.png', slide1],
  ['02_rule_mould.png', slide2],
  ['03_rule_strata.png', slide3],
  ['04_rule_concrete.png', slide4],
  ['05_rule_auction.png', slide5],
  ['06_rule_negotiate.png', slide6],
  ['07_cta.png', slide7],
];

for (const [filename, svg] of slides) {
  const buf = await sharp({
    create: { width: W, height: H, channels: 4, background: NAVY },
  })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toBuffer();
  const out = `${OUT_DIR}\\${filename}`;
  await sharp(buf).png().toFile(out);
  console.log(`✓ ${out}`);
}

console.log('');
console.log(`All 7 slides ready in: ${OUT_DIR}`);
console.log('Upload as a single IG carousel in this order:');
console.log('  01 → 02 → 03 → 04 → 05 → 06 → 07');
