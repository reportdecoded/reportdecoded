// scripts/ig-concrete-decode.mjs
//
// Educational IG feed post (1080x1350, 4:5) — "concrete cancer, decoded".
// Before/after jargon->plain-English card, matching the brand's best
// performing format. Navy/amber/cream, Fraunces + DM Sans.
// Compliance: "under 2 minutes" only; $39/$59 only; costs illustrative.

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
  <text x="${W/2}" y="164" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="54" font-weight="400" fill="${CREAM}" letter-spacing="-1">Concrete cancer,</text>
  <text x="${W/2}" y="226" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic"
        font-size="54" font-weight="400" fill="${AMBER}" letter-spacing="-1">decoded.</text>
  <text x="${W/2}" y="280" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="400" fill="rgba(247,243,238,0.7)">Sounds catastrophic. Usually isn&apos;t.</text>

  <!-- BEFORE card -->
  <rect x="90" y="322" width="900" height="212" rx="18" fill="${CARD_CREAM}"/>
  <text x="120" y="368" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="15" font-weight="700" fill="${RED}" letter-spacing="1.2">THE INSPECTOR WROTE</text>
  <text x="120" y="410" font-family="Georgia, serif" font-size="24" fill="#4A453E">"Concrete cancer evident to underside of</text>
  <text x="120" y="446" font-family="Georgia, serif" font-size="24" fill="#4A453E">balcony slab — rust staining and surface</text>
  <text x="120" y="482" font-family="Georgia, serif" font-size="24" fill="#4A453E">spalling. Engineer investigation advised."</text>

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
  <text x="120" y="770" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="23" fill="${CREAM}">The steel inside the concrete is rusting and</text>
  <text x="120" y="804" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="23" fill="${CREAM}">cracking it apart. Almost always repairable.</text>
  <line x1="120" y1="832" x2="960" y2="832" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <text x="120" y="872" font-family="DM Sans, Helvetica, Arial, sans-serif" font-size="22" font-weight="600" fill="rgba(247,243,238,0.75)">Est. fix</text>
  <text x="960" y="872" text-anchor="end" font-family="DM Mono, Courier New, monospace" font-size="24" font-weight="600" fill="${FAINT_AMBER}">$5,000 – $25,000</text>

  <!-- Speed line -->
  <text x="${W/2}" y="1000" text-anchor="middle" font-family="DM Mono, Courier New, monospace"
        font-size="21" font-weight="500" fill="rgba(247,243,238,0.62)" letter-spacing="0.3">Every defect, decoded &#183; answers in under 2 minutes</text>

  <!-- Founder offer -->
  <text x="430" y="1112" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="46" font-weight="400" fill="rgba(247,243,238,0.42)">$59</text>
  <line x1="398" y1="1097" x2="462" y2="1097" stroke="rgba(247,243,238,0.5)" stroke-width="3"/>
  <text x="560" y="1122" text-anchor="middle" font-family="Fraunces, Georgia, serif"
        font-size="92" font-weight="400" fill="${AMBER}" letter-spacing="-2">$39</text>
  <g transform="translate(${W/2 - 108}, 1148)">
    <rect width="216" height="42" rx="21" fill="${AMBER}"/>
    <text x="108" y="28" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
          font-size="16" font-weight="700" fill="#fff" letter-spacing="1.4">FOUNDER OFFER</text>
  </g>

  <!-- URL -->
  <text x="${W/2}" y="1268" text-anchor="middle" font-family="DM Sans, Helvetica, Arial, sans-serif"
        font-size="30" font-weight="800" fill="${CREAM}" letter-spacing="0.3">reportdecoded.com.au</text>
</svg>
`;

const dir = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts`;
const fallback = String.raw`C:\Users\morga\Downloads\02-Report-Decoded`;
const outDir = existsSync(dir) ? dir : fallback;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const OUT = `${outDir}\\ig-concrete-decode.png`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`Wrote ${OUT} (${W}x${H})`);
