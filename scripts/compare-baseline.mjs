// scripts/compare-baseline.mjs
// Read-only: list reports with their cost-range + negotiation numbers and
// created_at, so we can compare OLD (pre-prompt-change) vs NEW test rows for
// the same property. No Claude call, no writes.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
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

const { data, error } = await supabase
  .from('reports')
  .select('id, property_address, report_type, result_json, created_at')
  .eq('status', 'complete')
  .order('created_at', { ascending: true });
if (error) { console.error(error); process.exit(1); }

const fmt = (n) => (typeof n === 'number' ? `$${n.toLocaleString('en-AU')}` : '—');
const rows = data
  .filter((r) => r.result_json)
  .map((r) => {
    const a = r.result_json;
    const nd = (a.major_defects?.length || 0) + (a.minor_defects?.length || 0) + (a.pest_findings?.length || 0);
    return {
      when: (r.created_at || '').slice(0, 16).replace('T', ' '),
      id: r.id.slice(0, 8),
      addr: (a.property_address || r.property_address || '(none)').slice(0, 42),
      type: (r.report_type || 'pre').replace('new_build_handover', 'handover').replace('pre_purchase', 'pre'),
      verdict: a.overall_verdict || '—',
      defects: nd,
      low: a.total_repair_cost_low,
      high: a.total_repair_cost_high,
      nego: a.negotiation_amount,
    };
  });

console.log(
  ['CREATED'.padEnd(16), 'ID'.padEnd(8), 'ADDRESS'.padEnd(42), 'TYPE'.padEnd(8), 'VERDICT'.padEnd(10), 'DEF'.padStart(3), 'REPAIR RANGE'.padEnd(24), 'NEGOTIATION'].join(' ')
);
console.log('─'.repeat(140));
for (const r of rows) {
  console.log(
    [
      r.when.padEnd(16),
      r.id.padEnd(8),
      r.addr.padEnd(42),
      r.type.padEnd(8),
      r.verdict.padEnd(10),
      String(r.defects).padStart(3),
      `${fmt(r.low)}–${fmt(r.high)}`.padEnd(24),
      fmt(r.nego),
    ].join(' ')
  );
}
console.log(`\n${rows.length} complete reports.`);
