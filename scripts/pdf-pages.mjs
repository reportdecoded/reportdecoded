// Quick: how many pages is the source PDF on a given report row?
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
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

const reportId = process.argv[2];
if (!reportId) {
  console.error('Usage: node scripts/pdf-pages.mjs <reportId>');
  process.exit(1);
}

const { createClient } = await import('@supabase/supabase-js');
const { PDFParse } = await import('pdf-parse');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { data, error } = await supabase
  .from('reports')
  .select('id, report_url, property_address, result_json')
  .eq('id', reportId)
  .single();
if (error || !data) {
  console.error('Could not load report:', error?.message);
  process.exit(1);
}

console.log(`\n📄 ${data.property_address || data.id}`);
console.log(`   PDF: ${data.report_url}`);

const resp = await fetch(data.report_url);
const buf = Buffer.from(await resp.arrayBuffer());
console.log(`   Size: ${(buf.length / 1024 / 1024).toFixed(2)} MB`);

const parser = new PDFParse({ data: buf });
const info = await parser.getInfo();
await parser.destroy();

console.log(`   Pages: ${info.total}`);
console.log(`   Title: ${info.info?.Title || '—'}`);
console.log(`   Producer: ${info.info?.Producer || '—'}`);

// Highest page number referenced in any defect's source_pages
const a = data.result_json || {};
const allPages = [
  ...(a.major_defects || []),
  ...(a.minor_defects || []),
  ...(a.pest_findings || []),
].flatMap((d) => Array.isArray(d.source_pages) ? d.source_pages : []);
if (allPages.length) {
  console.log(`   Defect citations span: page ${Math.min(...allPages)} to ${Math.max(...allPages)}`);
}
