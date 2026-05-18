// Local PDF renderer for debugging the heading-overlap bug.
// Usage:
//   node --experimental-vm-modules -e "..."  ← NOT this, JSX won't work
//   Need to use esbuild-register to enable JSX transform on .js files
//
// Easier alternative: just shell out to the Next.js dev server and curl
// localhost:3000/api/report-pdf?reportId=X. Run `npm run dev` first.

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const id = process.argv[2] || '46898c51-276d-48e6-834e-78934e1266b8';

console.log(`Fetching PDF from local dev server for report ${id}...`);
console.log(`Make sure 'npm run dev' is running in another terminal.`);

// Use curl with -k to skip SSL (localhost is HTTP anyway, but just in case)
const out = 'C:/Users/morga/Downloads/debug-local.pdf';
try {
  execSync(
    `curl -sS -o "${out}" "http://localhost:3000/api/report-pdf?reportId=${id}"`,
    { stdio: 'inherit' }
  );
  console.log(`Saved to ${out}`);
} catch (e) {
  console.error('Fetch failed. Is `npm run dev` running?', e.message);
  process.exit(1);
}
