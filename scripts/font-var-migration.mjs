// scripts/font-var-migration.mjs
//
// One-shot migration: replace hardcoded Google Font family names with
// the CSS variables exposed by next/font in app/layout.js.
// Node reads/writes UTF-8 natively, so multi-byte characters (em
// dashes, arrows, emoji) survive untouched — unlike PowerShell 5.1's
// Get-Content, which decodes BOM-less UTF-8 as Windows-1252 and
// mojibakes every non-ASCII character (the Jun 2026 incident).
//
// Scope: web-rendered files only. Email templates (lib/email.js) and
// the canvas-based social image scripts keep literal font names.

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');

const FILES = [
  'app/agents/page.js',
  'app/auth/reset-password/page.js',
  'app/brunswick-building-inspection-help/page.js',
  'app/contact/page.js',
  'app/dashboard/reports/page.js',
  'app/dashboard/upload/page.js',
  'app/dashboard/BrandSettings.js',
  'app/dashboard/page.js',
  'app/footscray-building-inspection-help/page.js',
  'app/geelong-building-inspection-help/page.js',
  'app/privacy/page.js',
  'app/resources/page.js',
  'app/results/page.js',
  'app/signin/page.js',
  'app/terms/page.js',
  'app/yarraville-building-inspection-help/page.js',
  'components/ArticleLayout.jsx',
  'components/ReportDecoded.jsx',
  'components/SuburbPage.jsx',
];

const REPLACEMENTS = [
  // Quoted family names (CSS strings + inline style strings)
  [/'DM Sans'/g, 'var(--font-sans)'],
  [/"DM Sans"/g, 'var(--font-sans)'],
  [/'Fraunces'/g, 'var(--font-serif)'],
  [/"Fraunces"/g, 'var(--font-serif)'],
  [/'DM Mono'/g, 'var(--font-mono)'],
  [/"DM Mono"/g, 'var(--font-mono)'],
];

// affiliates/page.js uses unquoted names inside style strings
const AFFILIATES_REPLACEMENTS = [
  [/fontFamily: 'DM Sans, Helvetica, Arial, sans-serif'/g, "fontFamily: 'var(--font-sans), Helvetica, Arial, sans-serif'"],
  [/fontFamily: 'Fraunces, Georgia, serif'/g, "fontFamily: 'var(--font-serif), Georgia, serif'"],
];

let totalFiles = 0;
let totalSubs = 0;

function apply(file, rules) {
  const path = join(ROOT, file);
  let src = readFileSync(path, 'utf8');
  let subs = 0;
  for (const [re, to] of rules) {
    src = src.replace(re, () => { subs++; return to; });
  }
  if (subs > 0) {
    writeFileSync(path, src, 'utf8');
    totalFiles++;
    totalSubs += subs;
    console.log(`${file}: ${subs} replacements`);
  }
}

for (const f of FILES) apply(f, REPLACEMENTS);
apply('app/affiliates/page.js', AFFILIATES_REPLACEMENTS);

console.log(`\nDone: ${totalSubs} replacements across ${totalFiles} files`);

// Sanity check: confirm a known multi-byte char survived in the
// biggest file (the hero line uses an em dash).
const check = readFileSync(join(ROOT, 'components/ReportDecoded.jsx'), 'utf8');
if (!check.includes('hiding — before you sign')) {
  console.error('ENCODING CHECK FAILED — em dash not intact!');
  process.exit(1);
}
console.log('Encoding check passed: em dash intact.');
