// Find every text field in the Yarraville sample's result_json that
// mentions the inspector's identity (Russell Wall / Inside Out / DBU
// 31691). One-off audit before we run the redaction.
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
const { data, error } = await s.from('reports').select('result_json').eq('id', 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d').single();
if (error) { console.error(error); process.exit(1); }

const TARGETS = [
  /Russell\s+Wall/gi,
  /Inside\s+Out\s+Property\s+Inspections?/gi,
  /DBU\s*[\-\s]*\s*31691/gi,
  /Licence\s+(?:Number\s*[:\-]?\s*)?DBU/gi,
];

function walk(obj, path = []) {
  const hits = [];
  if (typeof obj === 'string') {
    for (const rx of TARGETS) {
      const m = obj.match(rx);
      if (m) hits.push({ path: path.join('.'), matches: m, value: obj.slice(0, 200) });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => hits.push(...walk(v, [...path, `[${i}]`])));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) hits.push(...walk(v, [...path, k]));
  }
  return hits;
}

const hits = walk(data.result_json);
console.log(`Found ${hits.length} matches across the result_json:\n`);
for (const h of hits) {
  console.log(`• ${h.path}`);
  console.log(`  matches: ${JSON.stringify(h.matches)}`);
  console.log(`  context: "${h.value.replace(/\n/g, ' ').slice(0, 150)}…"`);
  console.log();
}
