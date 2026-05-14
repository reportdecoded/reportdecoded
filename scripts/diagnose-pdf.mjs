// scripts/diagnose-pdf.mjs
// Diagnose why specific PDFs fail at the Anthropic API. Reports page count,
// encryption status, base64 length, and runs the actual API call capturing
// the full error response.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v) process.env[k] = v;
  }
}

const pdfs = process.argv.slice(2).map((p) => resolve(p));
if (pdfs.length === 0) {
  console.error('Usage: node scripts/diagnose-pdf.mjs <pdf1> [pdf2 ...]');
  process.exit(1);
}

const { PDFParse } = await import('pdf-parse');
const Anthropic = (await import('@anthropic-ai/sdk')).default;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

for (const pdf of pdfs) {
  console.log(`\n━━━ ${basename(pdf)} ━━━`);
  const buf = readFileSync(pdf);
  console.log(`Size:           ${(buf.length / 1024).toFixed(1)} KB`);

  // pdf-parse metadata
  try {
    const parser = new PDFParse({ data: buf });
    const info = await parser.getInfo();
    await parser.destroy();
    console.log(`Pages:          ${info.total}`);
    console.log(`Title:          ${info.info?.Title || '—'}`);
    console.log(`Producer:       ${info.info?.Producer || '—'}`);
    console.log(`Creator:        ${info.info?.Creator || '—'}`);
    console.log(`Encrypted:      ${info.info?.IsEncrypted ?? false}`);
    console.log(`PDF Version:    ${info.info?.PDFFormatVersion || '—'}`);
  } catch (e) {
    console.log(`pdf-parse error: ${e.message}`);
  }

  // Minimum Anthropic call to surface the actual error
  const base64 = buf.toString('base64');
  console.log(`Base64 length:  ${base64.length}`);

  try {
    const res = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
            { type: 'text', text: 'Respond with just the word OK.' },
          ],
        },
      ],
    });
    console.log(`API:            ✓ OK (response: ${JSON.stringify(res.content[0]).slice(0, 60)})`);
  } catch (e) {
    console.log(`API ERROR:      ${e.status} ${e.message}`);
    if (e.error) console.log(`  Full:         ${JSON.stringify(e.error)}`);
  }
}
