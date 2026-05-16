// One-off: add explicit width/height attributes to every logo <img>
// across the app to prevent Cumulative Layout Shift (CLS). Logos are
// natural 1800x420 (≈4.29:1). At our display height of 36, the
// rendered width is ≈154px. Using 180×42 as the HTML hint gives the
// browser enough info to reserve space without affecting actual render
// (CSS height: 36 with width: auto preserves the aspect ratio).
//
// Idempotent: the replacement only fires on the exact "no-dims" string,
// so re-running won't touch already-updated tags.
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'app/auth/reset-password/page.js',
  'app/agents/page.js',
  'app/geelong-building-inspection-help/page.js',
  'app/brunswick-building-inspection-help/page.js',
  'app/footscray-building-inspection-help/page.js',
  'app/privacy/page.js',
  'app/yarraville-building-inspection-help/page.js',
  'app/dashboard/reports/page.js',
  'app/terms/page.js',
  'app/dashboard/page.js',
  'app/dashboard/upload/page.js',
  'app/signin/page.js',
  'app/contact/page.js',
];

const OLD = '<img src="/logo-dark.png" alt="Report Decoded" style={{ height: 36 }} />';
const NEW = '<img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: \'auto\' }} />';

let touched = 0, skipped = 0;
for (const f of FILES) {
  const src = readFileSync(f, 'utf8');
  if (!src.includes(OLD)) {
    console.log('SKIP', f, '(pattern not found)');
    skipped++;
    continue;
  }
  if (src.includes('width={180} height={42}')) {
    console.log('SKIP', f, '(already updated)');
    skipped++;
    continue;
  }
  const out = src.replace(OLD, NEW);
  writeFileSync(f, out, 'utf8');
  console.log('OK  ', f);
  touched++;
}
console.log(`\nTouched ${touched}, skipped ${skipped}`);
