// scripts/enrich-tradies.mjs
// Re-run JUST the HERE tradie lookup on an existing reports row, keeping
// the existing Claude analysis untouched. Cheap + fast — no Claude tokens
// burned, no 2-minute wait. Use when:
//   - HERE_API_KEY wasn't set when the original analysis ran
//   - You want to refresh tradies after a HERE catalog update
//   - reanalyse-report.mjs ran without HERE locally and wiped tradies
//
// Run:
//   node scripts/enrich-tradies.mjs <reportId>

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
  console.error('Usage: node scripts/enrich-tradies.mjs <reportId>');
  process.exit(1);
}

if (!process.env.HERE_API_KEY) {
  console.error('HERE_API_KEY not set in .env.local — cannot look up tradies. Add it first.');
  process.exit(1);
}

const secretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const { createClient } = await import('@supabase/supabase-js');
const { findTradiesForAnalysis } = await import('../lib/places.js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  secretKey,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { data: row, error: loadErr } = await supabase
  .from('reports')
  .select('id, property_address, result_json, tradies_json')
  .eq('id', reportId)
  .single();

if (loadErr || !row) {
  console.error('Could not load report:', loadErr?.message || 'not found');
  process.exit(1);
}

const analysis = row.result_json;
if (!analysis) {
  console.error("This row has no result_json — can't look up tradies without defect data. Run reanalyse-report.mjs first.");
  process.exit(1);
}

console.log(`\n📄 Enriching tradies for ${reportId}`);
console.log(`   address: ${row.property_address || analysis.property_address || '(none)'}\n`);

const t0 = Date.now();
const tradiesByCategory = await findTradiesForAnalysis(analysis);
const total = Object.values(tradiesByCategory).reduce((n, l) => n + (l?.length || 0), 0);
const cats = Object.keys(tradiesByCategory).length;
console.log(`✓ Found ${total} tradies across ${cats} categories in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
for (const [cat, list] of Object.entries(tradiesByCategory)) {
  console.log(`  ${cat}: ${list.length}  (e.g. ${list[0]?.name ?? '—'})`);
}

if (total === 0) {
  console.log('\n⚠ Zero tradies returned. Not overwriting existing tradies_json. (If you want to clear them, do it manually.)');
  process.exit(0);
}

const { error: updateErr } = await supabase
  .from('reports')
  .update({ tradies_json: tradiesByCategory })
  .eq('id', reportId);
if (updateErr) {
  console.error('Update failed:', updateErr.message);
  process.exit(1);
}
console.log(`\n✅ tradies_json updated.`);
console.log(`   View: https://www.reportdecoded.com.au/results?reportId=${reportId}`);
