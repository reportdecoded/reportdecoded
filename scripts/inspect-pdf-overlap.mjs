// Inspect the rendered PDF text positions on each page.
// We're hunting for two pieces of text whose Y-position ranges overlap on
// the same page — that's the heading-overlap bug visualised numerically.
//
// pdf-parse is page-text-only (no positions), so we use pdfjs-dist's
// page.getTextContent() which DOES include positioning.

import { readFileSync } from 'node:fs';
const data = new Uint8Array(readFileSync('C:/Users/morga/Downloads/debug-local.pdf'));

// pdfjs-dist is bundled with pdf-parse as a dependency
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs').catch(() => null);
if (!pdfjs) {
  console.log('pdfjs-dist not directly accessible. Falling back to pdf-parse text only.');
  const pdfParse = (await import('pdf-parse')).default;
  const result = await pdfParse(data);
  // Look for "Pest and Termite" or "Commission separately" to find the right page
  const text = result.text;
  const idx = text.indexOf('Commission separately');
  if (idx === -1) {
    console.log('Could not find "Commission separately" page.');
    process.exit(0);
  }
  console.log('--- Compliance page text (full slice) ---');
  console.log(text.slice(idx, idx + 4000));
  process.exit(0);
}

const doc = await pdfjs.getDocument({ data }).promise;
console.log(`Pages: ${doc.numPages}`);

for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const content = await page.getTextContent();
  const items = content.items;
  const firstText = items[0]?.str || '';
  // Find the page with the compliance section
  const hasCompliance = items.some((i) => i.str.includes('Commission separately') || i.str.includes('Pest and Termite Inspection'));
  if (!hasCompliance) continue;

  console.log(`\n=== Page ${p} — text items with positions ===`);
  // Print first 60 items with their y positions (transform[5] is the y-coord)
  items.slice(0, 80).forEach((item, i) => {
    const x = item.transform[4]?.toFixed(1);
    const y = item.transform[5]?.toFixed(1);
    const text = item.str.slice(0, 60);
    console.log(`  [${i}] x=${x} y=${y} h=${item.height?.toFixed(1)} "${text}"`);
  });
}
