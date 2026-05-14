// Quick check: did investor-specific fields populate?
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
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { data } = await supabase
  .from('reports')
  .select('id, property_address, purchase_intent, result_json')
  .eq('id', reportId)
  .single();

const a = data.result_json || {};
console.log(`\n📄 ${data.property_address}`);
console.log(`   intent: ${data.purchase_intent}\n`);

const gaps = a.rental_compliance_gaps || [];
console.log(`━━ Rental Compliance Gaps: ${gaps.length} ━━`);
gaps.forEach((g, i) => {
  console.log(`\n${i + 1}. [${g.severity || '?'}] ${g.item}`);
  if (g.regulation) console.log(`   regulation: ${g.regulation}`);
  if (Array.isArray(g.source_pages) && g.source_pages.length) console.log(`   ref: pp.${g.source_pages.join(', ')}`);
  if (g.rectification_action) console.log(`   fix: ${g.rectification_action}`);
  if (Number.isFinite(g.estimated_cost_low) && g.estimated_cost_low > 0) {
    console.log(`   cost: $${g.estimated_cost_low.toLocaleString()}–$${g.estimated_cost_high.toLocaleString()}`);
  }
});

const insp = a.compliance_inspections_recommended || [];
console.log(`\n\n━━ Compliance inspections recommended: ${insp.length} ━━`);
insp.forEach((c, i) => {
  console.log(`\n${i + 1}. ${c.type}`);
  if (c.why_needed) console.log(`   why: ${c.why_needed}`);
  if (c.who_performs) console.log(`   who: ${c.who_performs}`);
  if (c.typical_cost) console.log(`   cost: ${c.typical_cost}`);
  if (c.frequency) console.log(`   freq: ${c.frequency}`);
});
