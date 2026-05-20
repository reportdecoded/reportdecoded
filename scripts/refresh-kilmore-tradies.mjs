// Re-run findTradiesForAnalysis() on the most recent Kilmore report so
// the live /results view picks up the tightened CATEGORY_QUERIES + the
// expanded EXCLUDE_NAME_PATTERNS (storage / cafe / gym / etc).
//
// Run once after the May 2026 tradie-quality fix. Idempotent.
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

const { createClient } = await import('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

const { data: rows, error: loadErr } = await s
  .from('reports')
  .select('id, property_address, result_json, tradies_json')
  .ilike('property_address', '%Kilmore%')
  .order('created_at', { ascending: false })
  .limit(1);
if (loadErr || !rows?.length) {
  console.error('Could not load Kilmore report:', loadErr);
  process.exit(1);
}
const row = rows[0];

console.log(`Refreshing tradies for: ${row.id.slice(0, 8)}  ·  ${row.property_address}`);
console.log('\nOld tradies_json:');
for (const [cat, list] of Object.entries(row.tradies_json || {})) {
  console.log(`  ${cat}:`);
  for (const t of list) console.log(`    - ${t.name}`);
}

const analysis = {
  property_address: row.property_address,
  major_defects: row.result_json?.major_defects || [],
  minor_defects: row.result_json?.minor_defects || [],
  pest_findings: row.result_json?.pest_findings || [],
};

const { findTradiesForAnalysis } = await import('../lib/places.js');
const newTradies = await findTradiesForAnalysis(analysis);

console.log('\nNew tradies_json:');
for (const [cat, list] of Object.entries(newTradies)) {
  console.log(`  ${cat}:`);
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

console.log('\n✓ Kilmore tradies refreshed.');
