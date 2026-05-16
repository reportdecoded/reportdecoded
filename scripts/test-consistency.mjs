// Run analyseInspectionPdf twice on the same PDF URL and compare the
// numeric fields. With temperature=0.1 and the deterministic negotiation
// formula, key numbers should be identical or near-identical across runs.
//
// Usage:
//   node scripts/test-consistency.mjs <pdfUrl> [purchasePrice]
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

const reportUrl = process.argv[2];
const purchasePrice = process.argv[3] ? Number(process.argv[3]) : null;
if (!reportUrl) {
  console.error('Usage: node scripts/test-consistency.mjs <pdfUrl> [purchasePrice]');
  process.exit(1);
}

const { analyseInspectionPdf } = await import('../lib/claude.js');

const sum = (arr) => (arr || []).reduce((n, d) => n + (d?.repair_cost_low || 0), 0);

async function run(label) {
  const t0 = Date.now();
  const r = await analyseInspectionPdf({ reportUrl, purchasePrice, reportType: 'pre_purchase', purchaseIntent: 'home' });
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  if (!r.ok) { console.log(`${label}: FAILED ${r.error}`); return null; }
  const a = r.analysis;
  return {
    label,
    sec,
    verdict: a.overall_verdict,
    majors: a.major_defects?.length || 0,
    minors: a.minor_defects?.length || 0,
    pests: a.pest_findings?.length || 0,
    cost_low: a.total_repair_cost_low,
    cost_high: a.total_repair_cost_high,
    negotiation: a.negotiation_amount,
    capex_y1_low: a.capex_forecast?.year_1_urgent?.low ?? 0,
    capex_y1_high: a.capex_forecast?.year_1_urgent?.high ?? 0,
    capex_y3_low: a.capex_forecast?.year_3_to_5?.low ?? 0,
    capex_y3_high: a.capex_forecast?.year_3_to_5?.high ?? 0,
  };
}

console.log(`\nTesting consistency on: ${reportUrl}`);
if (purchasePrice) console.log(`Purchase price: $${purchasePrice.toLocaleString()}`);
console.log('Running 2x in series (temperature=0.1)…\n');

const a = await run('Run A');
const b = await run('Run B');

if (!a || !b) process.exit(1);

const rows = [
  ['Field',         'Run A',         'Run B',         'Diff'],
  ['verdict',       a.verdict,       b.verdict,       a.verdict === b.verdict ? '✓' : '✗ DRIFT'],
  ['majors',        a.majors,        b.majors,        a.majors === b.majors ? '✓' : `${b.majors - a.majors}`],
  ['minors',        a.minors,        b.minors,        a.minors === b.minors ? '✓' : `${b.minors - a.minors}`],
  ['pests',         a.pests,         b.pests,         a.pests === b.pests ? '✓' : `${b.pests - a.pests}`],
  ['cost_low',      a.cost_low,      b.cost_low,      a.cost_low === b.cost_low ? '✓' : `${b.cost_low - a.cost_low}`],
  ['cost_high',     a.cost_high,     b.cost_high,     a.cost_high === b.cost_high ? '✓' : `${b.cost_high - a.cost_high}`],
  ['negotiation',   a.negotiation,   b.negotiation,   a.negotiation === b.negotiation ? '✓ MATCH' : `✗ ${a.negotiation} vs ${b.negotiation}`],
  ['capex_y1_low',  a.capex_y1_low,  b.capex_y1_low,  a.capex_y1_low === b.capex_y1_low ? '✓' : `${b.capex_y1_low - a.capex_y1_low}`],
  ['capex_y1_high', a.capex_y1_high, b.capex_y1_high, a.capex_y1_high === b.capex_y1_high ? '✓' : `${b.capex_y1_high - a.capex_y1_high}`],
  ['capex_y3_low',  a.capex_y3_low,  b.capex_y3_low,  a.capex_y3_low === b.capex_y3_low ? '✓' : `${b.capex_y3_low - a.capex_y3_low}`],
  ['capex_y3_high', a.capex_y3_high, b.capex_y3_high, a.capex_y3_high === b.capex_y3_high ? '✓' : `${b.capex_y3_high - a.capex_y3_high}`],
];

const w = [16, 14, 14, 16];
for (const row of rows) {
  console.log(row.map((c, i) => String(c).padEnd(w[i])).join(''));
}
console.log(`\n⏱  A: ${a.sec}s   B: ${b.sec}s\n`);
