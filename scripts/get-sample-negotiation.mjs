// One-off: fetch the negotiation_language from the live Yarraville sample
// so we can hardcode it into the homepage preview panel.
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
const { data, error } = await s.from('reports').select('id, property_address, result_json').eq('id', 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d').single();
if (error) { console.error(error); process.exit(1); }
console.log('property_address:', data.property_address);
console.log('verdict:', data.result_json.overall_verdict);
console.log('negotiation_amount:', data.result_json.negotiation_amount);
console.log('---negotiation_language---');
console.log(data.result_json.negotiation_language);
