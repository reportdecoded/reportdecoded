// scripts/audit-all-reports.mjs
//
// Comprehensive launch-readiness audit across every report in the
// database. Reports on:
//   • Status distribution (complete / failed / pending / processing)
//   • Verdict distribution per report type
//   • Average defect count + cost ranges
//   • Trade coverage (% of defects with an inferred trade)
//   • Reports stuck in non-terminal status > 1h
//   • Reports with empty tradies_json (HERE lookup may have failed)
//   • Reports with no source_pages on defects (citation system failed)
//   • Any defects with missing repair costs
//
// Output: structured summary + flagged anomalies

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

const { topTradesForDefect } = await import('../lib/trades.js');

const { data: rows, error } = await supabase
  .from('reports')
  .select('id, property_address, report_type, status, failure_reason, result_json, tradies_json, created_at, updated_at')
  .order('created_at', { ascending: false });

if (error) { console.error(error); process.exit(1); }

console.log('═══════════════════════════════════════════════════════════');
console.log(`LAUNCH READINESS AUDIT — ${rows.length} reports`);
console.log('═══════════════════════════════════════════════════════════\n');

// ─── 1. STATUS DISTRIBUTION ────────────────────────────────────
const byStatus = {};
for (const r of rows) byStatus[r.status] = (byStatus[r.status] || 0) + 1;
console.log('STATUS DISTRIBUTION:');
for (const [s, n] of Object.entries(byStatus).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${s.padEnd(12)} ${n}`);
}
console.log();

// ─── 2. STUCK REPORTS ──────────────────────────────────────────
const HOUR = 60 * 60 * 1000;
const now = Date.now();
const stuck = rows.filter((r) =>
  ['pending', 'processing'].includes(r.status) &&
  now - new Date(r.created_at).getTime() > HOUR
);
console.log(`STUCK REPORTS (in non-terminal status > 1h): ${stuck.length}`);
for (const r of stuck.slice(0, 5)) {
  const ageH = ((now - new Date(r.created_at).getTime()) / HOUR).toFixed(1);
  console.log(`  ${r.id.slice(0, 8)}  status=${r.status}  age=${ageH}h  ${r.property_address?.slice(0, 50) || '(no address)'}`);
}
console.log();

// ─── 3. FAILED REPORTS ─────────────────────────────────────────
const failed = rows.filter((r) => r.status === 'failed');
console.log(`FAILED REPORTS: ${failed.length}`);
for (const r of failed.slice(0, 5)) {
  console.log(`  ${r.id.slice(0, 8)}  reason=${(r.failure_reason || '(none)').slice(0, 80)}`);
}
console.log();

const complete = rows.filter((r) => r.status === 'complete');

// ─── 4. REPORT TYPE × VERDICT ──────────────────────────────────
const verdictMatrix = {};
for (const r of complete) {
  const rt = r.report_type || 'pre_purchase';
  const v = r.result_json?.overall_verdict || 'UNKNOWN';
  if (!verdictMatrix[rt]) verdictMatrix[rt] = {};
  verdictMatrix[rt][v] = (verdictMatrix[rt][v] || 0) + 1;
}
console.log('VERDICT DISTRIBUTION (complete reports):');
for (const [rt, verdicts] of Object.entries(verdictMatrix)) {
  console.log(`  ${rt}`);
  for (const [v, n] of Object.entries(verdicts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${v.padEnd(20)} ${n}`);
  }
}
console.log();

// ─── 5. DEFECT COUNT STATS ─────────────────────────────────────
const defectCounts = complete.map((r) => {
  const a = r.result_json || {};
  return (a.major_defects?.length || 0) + (a.minor_defects?.length || 0) + (a.pest_findings?.length || 0);
});
if (defectCounts.length) {
  const sum = defectCounts.reduce((s, n) => s + n, 0);
  const avg = (sum / defectCounts.length).toFixed(1);
  const min = Math.min(...defectCounts);
  const max = Math.max(...defectCounts);
  console.log('DEFECT COUNT STATS (complete reports):');
  console.log(`  avg ${avg}   min ${min}   max ${max}`);
  const low = complete.filter((r, i) => defectCounts[i] < 3);
  const high = complete.filter((r, i) => defectCounts[i] > 30);
  if (low.length) console.log(`  ⚠ ${low.length} reports with < 3 defects (suspiciously lenient analysis)`);
  if (high.length) console.log(`  ⚠ ${high.length} reports with > 30 defects (could indicate noise; check)`);
  console.log();
}

// ─── 6. TRADE COVERAGE ─────────────────────────────────────────
let totalDefects = 0;
let defectsWithTrade = 0;
let defectsWithCost = 0;
let defectsWithSourcePage = 0;
for (const r of complete) {
  const a = r.result_json || {};
  const all = [...(a.major_defects || []), ...(a.minor_defects || []), ...(a.pest_findings || [])];
  for (const d of all) {
    totalDefects++;
    const t = topTradesForDefect(d);
    if (t.length > 0) defectsWithTrade++;
    if (Number.isFinite(d.repair_cost_low) && d.repair_cost_low > 0) defectsWithCost++;
    if (Array.isArray(d.source_pages) && d.source_pages.length > 0) defectsWithSourcePage++;
  }
}
const pct = (n) => totalDefects === 0 ? 'n/a' : `${((n / totalDefects) * 100).toFixed(1)}%`;
console.log(`COVERAGE METRICS (${totalDefects} total defects across ${complete.length} reports):`);
console.log(`  trade chip            ${defectsWithTrade}/${totalDefects} = ${pct(defectsWithTrade)}`);
console.log(`  repair cost estimate  ${defectsWithCost}/${totalDefects} = ${pct(defectsWithCost)}`);
console.log(`  source page citation  ${defectsWithSourcePage}/${totalDefects} = ${pct(defectsWithSourcePage)}`);
console.log();

// ─── 7. EMPTY TRADIES_JSON ─────────────────────────────────────
const emptyTradies = complete.filter((r) =>
  !r.tradies_json || Object.keys(r.tradies_json).length === 0
);
console.log(`REPORTS WITH EMPTY TRADIES_JSON: ${emptyTradies.length}/${complete.length}`);
for (const r of emptyTradies.slice(0, 5)) {
  console.log(`  ${r.id.slice(0, 8)}  ${r.property_address?.slice(0, 50) || '(no address)'}`);
}
if (emptyTradies.length > 0) {
  console.log(`  (likely cause: address didn't geocode, or HERE Maps quota hit during analysis)`);
}
console.log();

// ─── 8. SUMMARY VERDICT ────────────────────────────────────────
const issues = [];
if (stuck.length > 0) issues.push(`${stuck.length} reports stuck > 1h`);
if (failed.length > 2) issues.push(`${failed.length} failed reports (some failures expected during dev)`);
if (defectCounts.length && Math.min(...defectCounts) < 3) issues.push(`some reports with very few defects`);
if (defectsWithSourcePage / totalDefects < 0.9) issues.push(`< 90% of defects have source page citations`);
if (defectsWithCost / totalDefects < 0.9) issues.push(`< 90% of defects have repair cost estimates`);
if (emptyTradies.length / complete.length > 0.2) issues.push(`> 20% of reports have no tradies (HERE Maps issue)`);

console.log('═══════════════════════════════════════════════════════════');
console.log('LAUNCH READINESS:');
console.log('═══════════════════════════════════════════════════════════');
if (issues.length === 0) {
  console.log('✓ All audit checks passed. Pipeline looks launch-ready.');
} else {
  console.log('⚠ Flagged for review:');
  issues.forEach((i) => console.log(`  · ${i}`));
}
