// Companion to redact-sample-address.mjs — replaces hardcoded
// "18 Loch Street" references in JSX files. The DB redaction
// (already done) covers the /results page. This covers all the
// marketing pages that embed the address as static text.
//
// Idempotent: each replacement matches the original literal.
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'components/ReportDecoded.jsx',
  'app/yarraville-building-inspection-help/page.js',
  'app/brunswick-building-inspection-help/page.js',
  'app/footscray-building-inspection-help/page.js',
  'app/geelong-building-inspection-help/page.js',
];

// More-specific patterns first to avoid clobbering.
const REPLACEMENTS = [
  // SEO anchor cards
  ['18 Loch Street, Yarraville VIC 3013', '███ Loch Street, Yarraville VIC 3013'],
  // Homepage negotiation letter preview
  ['18 Loch St, Yarraville VIC', '███ Loch St, Yarraville VIC'],
  ['18 Loch Street, Yarraville', '███ Loch Street, Yarraville'],
  // Yarraville page comments + FAQ
  ['18 Loch Street, 1940s weatherboard', '███ Loch Street, 1940s weatherboard'],
  ['18 Loch Street)', '███ Loch Street)'],
  ['(18 Loch Street)', '(███ Loch Street — number redacted for owner privacy)'],
];

let total = 0;
for (const f of FILES) {
  let src = readFileSync(f, 'utf8');
  let n = 0;
  for (const [from, to] of REPLACEMENTS) {
    if (src.includes(from)) {
      const count = src.split(from).length - 1;
      src = src.split(from).join(to);
      n += count;
    }
  }
  if (n > 0) {
    writeFileSync(f, src, 'utf8');
    console.log(`OK   ${f}  (${n} replaced)`);
    total += n;
  } else {
    console.log(`SKIP ${f}  (already updated or pattern absent)`);
  }
}
console.log(`\nTotal: ${total} replacements.`);
