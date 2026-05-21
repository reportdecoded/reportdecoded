// Trace which patterns matched for a specific defect.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname,'..','.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath,'utf8').split(/\r?\n/)) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('='); if (eq<1) continue;
    let v = t.slice(eq+1).trim();
    if ((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v = v.slice(1,-1);
    process.env[t.slice(0,eq).trim()] = v;
  }
}
const [,, reportId, defectNeedle, tradeKey] = process.argv;
if (!reportId || !defectNeedle) { console.error('Usage: trace-defect.mjs <reportId> <name-substring> [trade-key]'); process.exit(1); }

const { createClient } = await import('@supabase/supabase-js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
const { TRADES } = await import('../lib/trades.js');

const { data } = await s.from('reports').select('result_json').eq('id', reportId).maybeSingle();
if (!data) { console.error('Report not found'); process.exit(1); }
const all = [...(data.result_json?.major_defects||[]), ...(data.result_json?.minor_defects||[]), ...(data.result_json?.pest_findings||[])];
const d = all.find(x => (x.name||x.pest_type||'').toLowerCase().includes(defectNeedle.toLowerCase()));
if (!d) { console.error('Defect not found. Available:'); all.forEach(x => console.error('  -', x.name||x.pest_type)); process.exit(1); }

const text = [d.name, d.element_or_system, d.plain_english||d.damage_description||d.summary, d.why_it_matters||d.recommendation, d.location].filter(Boolean).join(' ');
console.log('DEFECT:', d.name);
console.log('TEXT:', text.slice(0,400) + (text.length>400?' …':''));
console.log();

const traces = tradeKey ? [tradeKey] : Object.keys(TRADES);
for (const key of traces) {
  const t = TRADES[key]; if (!t) continue;
  const strong = (t.strong_keywords||[]).filter(rx => rx.test(text));
  const weak = (t.keywords||[]).filter(rx => rx.test(text));
  if (strong.length===0 && weak.length===0) continue;
  console.log(`${t.label} (key=${key})`);
  strong.forEach(rx => console.log('  +3 STRONG', rx));
  weak.forEach(rx => console.log('  +1 weak  ', rx));
  console.log(`  total: ${strong.length*3 + weak.length}`);
  console.log();
}
