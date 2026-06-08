// scripts/backfill-market-context.mjs
// Retroactively add market_context to existing complete reports using the
// bundled suburb-median lookup. FREE — no Claude, just a local lookup + DB
// update. Run after rebuilding the median data, or to seed existing rows.
//   node scripts/backfill-market-context.mjs        (dry run)
//   node scripts/backfill-market-context.mjs --write (apply)
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('='); if (eq < 1) continue;
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (v) process.env[t.slice(0, eq).trim()] = v;
  }
}
const write = process.argv.includes('--write');
const { createClient } = await import('@supabase/supabase-js');
const { getSuburbMarketContext } = await import('../lib/valuation.js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { data: reports, error } = await supabase
  .from('reports').select('id, property_address, result_json, report_type')
  .eq('status', 'complete');
if (error) { console.error(error); process.exit(1); }

let matched = 0, updated = 0;
for (const r of reports) {
  const a = r.result_json; if (!a) continue;
  if (r.report_type === 'new_build_handover') continue; // panel is pre-purchase only
  const ctx = getSuburbMarketContext({ address: a.property_address });
  if (!ctx) continue;
  matched++;
  console.log(`${r.id.slice(0,8)}  ${ctx.suburb} ${ctx.state}: $${ctx.medianHouse.toLocaleString()} (${ctx.changeAnnualPct}%/yr)`);
  if (write) {
    a.market_context = ctx;
    const { error: uErr } = await supabase.from('reports').update({ result_json: a }).eq('id', r.id);
    if (uErr) console.error(`  update failed: ${uErr.message}`); else updated++;
  }
}
console.log(`\n${matched} reports matched a bundled suburb.${write ? ` ${updated} updated.` : ' (dry run — pass --write to apply)'}`);
