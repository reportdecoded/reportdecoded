// scripts/refresh-all-tradies.mjs
//
// Re-run findTradiesForAnalysis() on every completed report so they
// pick up the latest trade taxonomy + per-trade HERE Maps lookups.
// Skips reports that lack a property_address (can't geocode).
//
// Idempotent. Safe to re-run. ~1-3 HERE Maps API calls per trade per
// report; total cost rounds to cents.

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
    if (v) process.env[t.slice(0, eq).trim()] = v;
  }
}

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { findTradiesForAnalysis } = await import('../lib/places.js');

const { data: rows, error } = await supabase
  .from('reports')
  .select('id, property_address, result_json')
  .eq('status', 'complete')
  .order('created_at', { ascending: false });
if (error) {
  console.error('Load error:', error);
  process.exit(1);
}

console.log(`Found ${rows.length} completed reports. Refreshing tradie caches...\n`);

let updated = 0;
let skipped = 0;
let failed = 0;

for (const r of rows) {
  const addr = r.property_address || r.result_json?.property_address;
  if (!addr || addr.length < 5) {
    console.log(`  ⊝ ${r.id.slice(0, 8)}  (no address, skipping)`);
    skipped++;
    continue;
  }

  const analysis = {
    property_address: addr,
    major_defects: r.result_json?.major_defects || [],
    minor_defects: r.result_json?.minor_defects || [],
    pest_findings: r.result_json?.pest_findings || [],
  };

  try {
    const newTradies = await findTradiesForAnalysis(analysis);
    const bucketCount = Object.keys(newTradies).length;
    if (bucketCount === 0) {
      console.log(`  ⊝ ${r.id.slice(0, 8)}  ${addr.slice(0, 45)}  (no tradies found)`);
      skipped++;
      continue;
    }
    const { error: upErr } = await supabase
      .from('reports')
      .update({ tradies_json: newTradies })
      .eq('id', r.id);
    if (upErr) {
      console.log(`  ✗ ${r.id.slice(0, 8)}  ${upErr.message}`);
      failed++;
      continue;
    }
    console.log(`  ✓ ${r.id.slice(0, 8)}  ${addr.slice(0, 45).padEnd(45)}  ${bucketCount} buckets`);
    updated++;
  } catch (e) {
    console.log(`  ✗ ${r.id.slice(0, 8)}  ${e.message}`);
    failed++;
  }
}

console.log(`\n────────────────`);
console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped} (no address / no tradies)`);
console.log(`Failed:  ${failed}`);
