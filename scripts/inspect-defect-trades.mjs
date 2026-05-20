// scripts/inspect-defect-trades.mjs
// Print each defect's full text + scored trade inference, so we can
// see WHY the wrong trade is winning.
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
  console.error('Usage: node scripts/inspect-defect-trades.mjs <reportId>');
  process.exit(1);
}

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { inferTradesFromDefect } = await import('../lib/trades.js');

const { data } = await supabase
  .from('reports')
  .select('id, property_address, result_json')
  .eq('id', reportId)
  .single();

const a = data.result_json || {};
const all = [...(a.major_defects || []), ...(a.minor_defects || [])];

for (const d of all) {
  console.log('\n══════════════════════════════════════════════════════');
  console.log(d.name);
  const text = [
    d.name,
    d.element_or_system,
    d.plain_english || d.damage_description || d.summary,
    d.why_it_matters || d.recommendation,
    d.location,
  ].filter(Boolean).join(' ');
  console.log('\nFULL TEXT:');
  console.log(text);
  console.log('\nSCORES:');
  const scored = inferTradesFromDefect(text);
  scored.slice(0, 5).forEach(s => console.log(`  ${s.label.padEnd(28)} ${s.score}`));
  if (scored.length === 0) console.log('  (no matches)');
}
