// Re-run findTradiesForAnalysis() on the Yarraville sample so the live
// /results sample picks up the new tightened CATEGORY_QUERIES + the
// inspector/supply/retail name filter. Without this, the old (looser)
// tradie set stays cached in reports.tradies_json forever.
//
// Run once after tightening lib/places.js. Idempotent (re-running just
// refreshes again).
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

const SAMPLE_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';

// Post-redaction the property_address is just 'Loch Street, Yarraville
// VIC 3013' — HERE will geocode that to Yarraville centre, which is
// close enough for nearby-tradie lookup at neighbourhood scale.
const { data: row, error: loadErr } = await s
  .from('reports')
  .select('id, property_address, result_json')
  .eq('id', SAMPLE_ID)
  .single();
if (loadErr || !row) { console.error('Could not load:', loadErr); process.exit(1); }

console.log(`Refreshing tradies for: ${row.property_address}`);
console.log('Old tradies_json:');
const { data: oldData } = await s.from('reports').select('tradies_json').eq('id', SAMPLE_ID).single();
for (const [cat, list] of Object.entries(oldData.tradies_json || {})) {
  console.log(`  ${cat}:`);
  for (const t of list) console.log(`    - ${t.name}`);
}

// Build a minimal analysis object for findTradiesForAnalysis() — it
// only uses property_address + defects[].trade_category fields.
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
  .eq('id', SAMPLE_ID);
if (updateErr) { console.error('Update failed:', updateErr); process.exit(1); }

console.log('\n✓ Sample tradies refreshed.');
