// Composes a Report Decoded ad from a Higgsfield-generated image.
// Supports multiple copy variants and aspect ratios.
//
// Usage:
//   node scripts/compose-ad.mjs "C:/path/source.png"
//
// Outputs all variants × all sizes into Downloads.

import sharp from 'sharp';

const SOURCE = process.argv[2] || 'C:/Users/morga/Downloads/Ad 1 - RD.png';
const OUT_DIR = 'C:/Users/morga/Downloads';

const COLOR = {
  navy: '#0A1628',
  cream: '#F7F3EE',
  amber: '#C97A3A',
  teal: '#0D6B5E',
  white: '#FFFFFF',
};

// Each variant defines the four text zones.
// AD 4 - Two-Minute Analyst (Buyer's Agent / mastery / positioning)
// Reading from .agents/product-marketing-context.md:
//   - AGENT ad — CTA: $149/mo · First report free (NOT $59 analysis)
//   - Audience: buyer's agents at decision/conversion stage
const VARIANTS = {
  A: {
    label: 'Ad4-Option-A-Positioning',
    topStamp: 'COMPETITORS READ.',
    hero: ['I scan.', 'Same hour.'],
    body: [
      'Verdict, capex, tradie shortlist,',
      'drafted negotiation letter — sent',
      'to my client in 2 minutes. Every report.',
    ],
    cta1: 'reportdecoded.com.au',
    cta2: "For buyer's agents · $149/mo unlimited · First report free",
  },
  B: {
    label: 'Ad4-Option-B-Function',
    topStamp: 'BUILDING INSPECTIONS, DECODED.',
    hero: ['2 minutes.', 'Every client.'],
    body: [
      'Verdict, capex, tradies pre-matched,',
      'drafted negotiation letter — for every',
      "inspection your client sends.",
    ],
    cta1: 'reportdecoded.com.au',
    cta2: "For buyer's agents · $149/mo unlimited · First report free",
  },
};

function buildSVG(W, H, copy) {
  const topSize = Math.round(H * 0.025); // smaller for longer text
  const heroSize = Math.round(H * 0.058); // slightly smaller — 2-line layout
  const heroLineHeight = Math.round(H * 0.062);
  const bodySize = Math.round(H * 0.021);
  const ctaSize = Math.round(H * 0.024);
  const ctaSubSize = Math.round(H * 0.016);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLOR.navy}" stop-opacity="0"/>
      <stop offset="35%" stop-color="${COLOR.navy}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${COLOR.navy}" stop-opacity="0.98"/>
    </linearGradient>
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLOR.navy}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${COLOR.navy}" stop-opacity="0"/>
    </linearGradient>
    <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.7"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Top fade overlay so the top stamp reads clean on any background -->
  <rect x="0" y="0" width="${W}" height="${H * 0.18}" fill="url(#topFade)"/>

  <!-- Top stamp - product label / value prop -->
  <text x="${W * 0.055}" y="${H * 0.085}"
        font-family="Impact, 'Arial Black', 'Helvetica Bold', sans-serif"
        font-size="${topSize}"
        font-weight="900"
        letter-spacing="2"
        fill="${COLOR.white}"
        filter="url(#dropshadow)">${copy.topStamp}</text>

  <!-- Bottom gradient overlay -->
  <rect x="0" y="${H * 0.53}" width="${W}" height="${H * 0.47}" fill="url(#bottomFade)"/>

  <!-- Headline: serif italic amber, 2 lines -->
  ${copy.hero.map((line, i) => `
  <text x="${W * 0.055}" y="${H * 0.66 + i * heroLineHeight}"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic"
        font-size="${heroSize}"
        font-weight="700"
        fill="${COLOR.amber}">${line}</text>`).join('')}

  <!-- Body subhead - up to 3 lines -->
  ${copy.body.map((line, i) => `
  <text x="${W * 0.055}" y="${H * (0.82 + i * 0.035)}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${bodySize}"
        font-weight="400"
        fill="${COLOR.cream}">${line}</text>`).join('')}

  <!-- CTA strip background with teal accent -->
  <rect x="0" y="${H * 0.91}" width="${W}" height="${H * 0.09}" fill="${COLOR.navy}"/>
  <rect x="0" y="${H * 0.91}" width="6" height="${H * 0.09}" fill="${COLOR.teal}"/>

  <!-- CTA text -->
  <text x="${W * 0.055}" y="${H * 0.953}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${ctaSize}"
        font-weight="700"
        fill="${COLOR.cream}">${copy.cta1}</text>
  <text x="${W * 0.055}" y="${H * 0.983}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${ctaSubSize}"
        font-weight="400"
        fill="${COLOR.cream}"
        opacity="0.85">${copy.cta2}</text>
</svg>`;
}

async function compose({ width, height, outName, copy }) {
  const base = await sharp(SOURCE)
    .resize(width, height, { fit: 'cover', position: 'center', kernel: 'lanczos3' })
    .sharpen({ sigma: 1.2, m1: 0.5, m2: 3.0 })
    .modulate({ saturation: 1.06, brightness: 1.0 })
    .toBuffer();

  const overlay = buildSVG(width, height, copy);
  const overlayBuf = Buffer.from(overlay);

  await sharp(base)
    .composite([{ input: overlayBuf, top: 0, left: 0 }])
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(`${OUT_DIR}/${outName}`);

  console.log(`  ✓ ${outName}  (${width}×${height})`);
}

console.log('Composing Ad 1 — Sunday 5:07pm in 2 wording variants');
console.log('Source:', SOURCE);
console.log();

for (const [key, copy] of Object.entries(VARIANTS)) {
  console.log(`▸ Variant ${key} — "${copy.topStamp}"`);
  await compose({
    width: 1080, height: 1920, copy,
    outName: `${copy.label}-1080x1920.png`,
  });
  await compose({
    width: 1080, height: 1080, copy,
    outName: `${copy.label}-1080x1080.png`,
  });
  await compose({
    width: 1080, height: 1350, copy,
    outName: `${copy.label}-1080x1350.png`,
  });
  console.log();
}

console.log('All 6 files saved to Downloads. Pick the wording that lands best.');
