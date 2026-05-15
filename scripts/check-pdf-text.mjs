// Diagnose: extract text from first 4 pages of a PDF to see if our
// pre-screen would match it
import { readFileSync } from 'node:fs';
const path = process.argv[2];
if (!path) { console.error('Usage: node check-pdf-text.mjs <path>'); process.exit(1); }
const buf = readFileSync(path);
const { PDFParse } = await import('pdf-parse');
const parser = new PDFParse({ data: buf });
const info = await parser.getInfo();
const result = await parser.getText({ first: 4 });
await parser.destroy();
console.log(`Pages: ${info.total}`);
console.log(`First 4 pages text length: ${result.text.length}`);
console.log('---');
console.log(result.text.slice(0, 2000));
console.log('---');
const KEYWORDS = [/\bAS\s*4349/i, /\bAS4349\.1\b/i, /building\s+(and\s+pest\s+)?inspection/i, /pest\s+inspection/i, /pre[-\s]?purchase\s+inspection/i];
console.log('\nKeyword matches:');
for (const rx of KEYWORDS) {
  const m = result.text.match(rx);
  console.log(`  ${rx}: ${m ? '✓ ' + m[0] : '✗ no match'}`);
}
