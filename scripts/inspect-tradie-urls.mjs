// Audit tradie website URLs in the sample row to spot malformed values.
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

// Sample report + the two real ones Morgan ran
const IDS = [
  'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d',  // public sample
];

for (const id of IDS) {
  const { data } = await s.from('reports').select('id, property_address, tradies_json').eq('id', id).single();
  if (!data) { console.log(`${id}: not found`); continue; }
  console.log(`\n=== ${data.id.slice(0,8)}…  ${data.property_address}`);
  const byCat = data.tradies_json || {};
  for (const [cat, list] of Object.entries(byCat)) {
    console.log(`  ${cat}: ${list.length} tradies`);
    for (const t of list) {
      console.log(`    - ${t.name}`);
      console.log(`        phone:   ${t.phone || '(none)'}`);
      console.log(`        website: ${t.website || '(none)'}`);
    }
  }
}
