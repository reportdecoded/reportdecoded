// scripts/ad-before-after.mjs
//
// Richer static ad — 1080x1350 (4:5). Shows the product instead of just
// listing benefits: a BEFORE (inspector jargon) -> AFTER (plain verdict +
// cost) transformation, then the Founder Offer price + CTA.
// Compliance: "under 2 minutes"; $39/$59 only; illustrative cost range.

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const W = 1080, H = 1350;
const NAVY = '#0A1628';
const NAVY2 = '#16233A';
const AMBER = '#C97A3A';
const CREAM = '#F7F3EE';
const CARD_CREAM = '#EDE8DF';
const FAINT_AMBER = '#F4C9A0';
const RED = '#E5634A';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.06)"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <!-- Brand + hook -->
  <text x="${W/2}" y="86" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="17" font-weight="600" fill="${FAINT_AMBER}" letter-spacing="4">REPORT DECODED</text>
  <text x="${W/2}" y="162" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="50" font-weight="400" fill="${CREAM}" letter-spacing="-1">Your building report,</text>
  <text x="${W/2}" y="224" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="50" font-weight="400" fill="${AMBER}" letter-spacing="-1">decoded.</text>
  <text x="${W/2}" y="278" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.7)">See what the jargon actually means — before you sign.</text>

  <!-- BEFORE card -->
  <rect x="90" y="322" width="900" height="212" rx="18" fill="${CARD_CREAM}"/>
  <text x="120" y="368" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="15" font-weight="700" fill="${RED}" letter-spacing="1.2">THE INSPECTOR WROTE</text>
  <text x="120" y="410" font-family="Georgia, serif" font-size="24" fill="#4A453E">"Subfloor ventilation is inadequate in</text>
  <text x="120" y="446" font-family="Georgia, serif" font-size="24" fill="#4A453E">accordance with AS4349.1 cl.3.2, with</text>
  <text x="120" y="482" font-family="Georgia, serif" font-size="24" fill="#4A453E">conditions conducive to fungal decay."</text>

  <!-- Arrow -->
  <text x="${W/2}" y="588" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="40" fill="${AMBER}">&#8595;</text>

  <!-- AFTER card -->
  <rect x="90" y="612" width="900" height="286" rx="18" fill="${NAVY2}" stroke="${AMBER}" stroke-width="1.5"/>
  <text x="120" y="660" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="15" font-weight="700" fill="${FAINT_AMBER}" letter-spacing="1.2">REPORT DECODED SAYS</text>
  <g transform="translate(120, 682)">
    <rect width="150" height="42" rx="8" fill="rgba(201,122,58,0.18)" stroke="rgba(201,122,58,0.5)" stroke-width="1"/>
    <text x="75" y="28" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="17" font-weight="700" fill="${AMBER}" letter-spacing="0.5">NEGOTIATE</text>
  </g>
  <text x="120" y="770" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="23" fill="${CREAM}">The area under the house has poor airflow,</text>
  <text x="120" y="804" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="23" fill="${CREAM}">trapping moisture — it can rot the timber.</text>
  <line x1="120" y1="832" x2="960" y2="832" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <text x="120" y="872" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="22" font-weight="600" fill="rgba(247,243,238,0.75)">Est. fix</text>
  <text x="960" y="872" text-anchor="end" font-family="DM Mono, Courier New, monospace" font-size="24" font-weight="600" fill="${FAINT_AMBER}">$2,000 – $8,000</text>

  <!-- Price -->
  <text x="430" y="1010" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="54" font-weight="400" fill="rgba(247,243,238,0.42)">$59</text>
  <line x1="392" y1="992" x2="468" y2="992" stroke="rgba(247,243,238,0.5)" stroke-width="3"/>
  <text x="585" y="1022" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="112" font-weight="400" fill="${AMBER}" letter-spacing="-2">$39</text>
  <g transform="translate(${W/2 - 112}, 1048)">
    <rect width="224" height="44" rx="22" fill="${AMBER}"/>
    <text x="112" y="30" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="17" font-weight="700" fill="#fff" letter-spacing="1.4">FOUNDER OFFER</text>
  </g>

  <!-- CTA -->
  <text x="${W/2}" y="1178" text-anchor="middle" font-family="DM Mono, Courier New, monospace"
        font-size="20" font-weight="500" fill="rgba(247,243,238,0.6)" letter-spacing="0.4">Upload your PDF &#183; answers in under 2 minutes</text>
  <g transform="translate(${W/2 - 200}, 1218)">
    <rect width="400" height="66" rx="12" fill="${AMBER}"/>
    <text x="200" y="43" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="24" font-weight="700" fill="#fff" letter-spacing="0.3">reportdecoded.com.au</text>
  </g>
</svg>
`;

const dir = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts`;
const fallback = String.raw`C:\Users\morga\Downloads\02-Report-Decoded`;
const outDir = existsSync(dir) ? dir : fallback;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const OUT = `${outDir}\\ad-before-after-39.png`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`Wrote ${OUT} (${W}x${H})`);
