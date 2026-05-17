// One-off: replace optimistic '60 seconds' time claims with the more
// honest 'under 2 minutes' across the codebase. Real-world average is
// 50-120s with occasional outliers for large new-build handover
// reports. 'Under 2 minutes' is a promise we'll consistently beat for
// ~95% of reports.
//
// Idempotent: each pattern uses a unique source string so re-running
// is a no-op once all replacements have landed.

import { readFileSync, writeFileSync } from 'node:fs';

// Files known to contain a '60 second' time claim (from grep audit).
const FILES = [
  'app/agents/page.js',
  'app/brunswick-building-inspection-help/layout.js',
  'app/brunswick-building-inspection-help/page.js',
  'app/dashboard/reports/page.js',
  'app/footscray-building-inspection-help/layout.js',
  'app/footscray-building-inspection-help/page.js',
  'app/geelong-building-inspection-help/layout.js',
  'app/geelong-building-inspection-help/page.js',
  'app/layout.js',
  'app/manifest.js',
  'app/opengraph-image.js',
  'app/page.js',
  'app/results/page.js',
  'app/yarraville-building-inspection-help/layout.js',
  'app/yarraville-building-inspection-help/page.js',
  'components/ReportDecoded.jsx',
];

// Order matters: more specific patterns first to avoid clobbering.
// Each is a tuple [oldStr, newStr].
const REPLACEMENTS = [
  // Loading-screen ranges — make them honest
  ['30–60 seconds', '1–2 minutes'],
  ['30-60 seconds', '1-2 minutes'],

  // Specific phrasings
  ['Results in under 60 seconds', 'Results in under 2 minutes'],
  ['results in 60 seconds', 'results in under 2 minutes'],
  ['60-second analysis', '2-minute analysis'],
  ['refresh in ~60 seconds', 'refresh in ~2 minutes'],
  ['Read any inspection in 60 seconds', 'Read any inspection in under 2 minutes'],
  ['60 seconds to a plain-English', 'Under 2 minutes to a plain-English'],

  // Generic 'in 60 seconds' marketing claim (covers most occurrences)
  ['in 60 seconds.', 'in under 2 minutes.'],
  ['in 60 seconds,', 'in under 2 minutes,'],
  ['in 60 seconds —', 'in under 2 minutes —'],
  ['in 60 seconds<', 'in under 2 minutes<'],
  ['in 60 seconds\\n', 'in under 2 minutes\\n'],
  ['in 60 seconds ', 'in under 2 minutes '],
];

let totalReplacements = 0;
let touched = 0;
for (const f of FILES) {
  let src = readFileSync(f, 'utf8');
  let fileTouched = false;
  let fileReplacements = 0;
  for (const [oldStr, newStr] of REPLACEMENTS) {
    if (src.includes(oldStr)) {
      const count = src.split(oldStr).length - 1;
      src = src.split(oldStr).join(newStr);
      fileReplacements += count;
      fileTouched = true;
    }
  }
  if (fileTouched) {
    writeFileSync(f, src, 'utf8');
    console.log(`OK   ${f}  (${fileReplacements} replaced)`);
    touched++;
    totalReplacements += fileReplacements;
  } else {
    console.log(`SKIP ${f}  (already updated)`);
  }
}

console.log(`\nTotal: ${totalReplacements} replacements across ${touched} files.`);
console.log('Run again to verify no leftover "60 seconds" claims remain:');
console.log('  grep -rn "60 second" app/ components/ 2>/dev/null | grep -v node_modules');
