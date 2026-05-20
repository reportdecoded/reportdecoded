// scripts/refresh-yarraville-tradies.mjs
//
// Re-run findTradiesForAnalysis on the public Yarraville sample
// (reportId: f3ef0ce1-5443-4e91-a420-5e8bf7d8713d) so the cache picks
// up the new per-inferred-trade HERE Maps lookups. Without this, the
// sample still shows the old broad-category cache (building / plumbing
// / damp / etc) which doesn't include Carpenter specifically.
//
// Idempotent. Safe to re-run.
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
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    process.env[t.slice(0, eq).trim()] = v;
  }
}

const REPORT_ID = process.argv[2] || 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';

const { createClient } = await import('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

const { data: row, error: loadErr } = await s
  .from('reports')
  .select('id, property_address, result_json, tradies_json')
  .eq('id', REPORT_ID)
  .single();
if (loadErr || !row) {
  console.error('Could not load report:', loadErr);
  process.exit(1);
}

console.log(`Refreshing tradies for: ${row.id.slice(0, 8)}  ·  ${row.property_address}`);
console.log('\nOLD tradies_json:');
for (const [cat, list] of Object.entries(row.tradies_json || {})) {
  console.log(`  ${cat}: ${list.length}`);
  for (const t of list.slice(0, 3)) console.log(`    - ${t.name}`);
}

const analysis = {
  property_address: row.property_address,
  major_defects: row.result_json?.major_defects || [],
  minor_defects: row.result_json?.minor_defects || [],
  pest_findings: row.result_json?.pest_findings || [],
};

const { findTradiesForAnalysis } = await import('../lib/places.js');
const newTradies = await findTradiesForAnalysis(analysis);

console.log('\nNEW tradies_json:');
const sortedKeys = Object.keys(newTradies).sort();
for (const cat of sortedKeys) {
  const list = newTradies[cat];
  console.log(`  ${cat}: ${list.length}`);
  for (const t of list) console.log(`    - ${t.name}`);
}

const { error: updateErr } = await s
  .from('reports')
  .update({ tradies_json: Object.keys(newTradies).length > 0 ? newTradies : null })
  .eq('id', row.id);
if (updateErr) {
  console.error('Update failed:', updateErr);
  process.exit(1);
}

console.log('\n✓ Tradies refreshed.');
