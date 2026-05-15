// Inspect a report's tradies_json + extracted address
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
const id = process.argv[2];
if (!id) { console.error('Usage: node scripts/inspect-tradies.mjs <reportId>'); process.exit(1); }
const { createClient } = await import('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const { data } = await s.from('reports').select('id, property_address, tradies_json, result_json').eq('id', id).maybeSingle();
if (!data) { console.log('not found'); process.exit(1); }
console.log('id:', data.id);
console.log('row.property_address:', data.property_address);
console.log('analysis.property_address:', data.result_json?.property_address);
console.log('tradies_json present:', !!data.tradies_json);
if (data.tradies_json) {
  for (const [cat, list] of Object.entries(data.tradies_json)) {
    console.log(`  ${cat}: ${list.length}`);
    for (const t of list.slice(0,3)) console.log(`    - ${t.name} (${t.distance_km}km)`);
  }
}
// What categories did Claude suggest?
const majors = data.result_json?.major_defects || [];
const minors = data.result_json?.minor_defects || [];
const pests = data.result_json?.pest_findings || [];
console.log('\nDefects:');
console.log(`  majors: ${majors.length}, minors: ${minors.length}, pests: ${pests.length}`);
for (const d of [...majors, ...minors].slice(0,5)) console.log(`  - [${d.category||'?'}] ${d.headline?.slice(0,60)}`);
