// scripts/reanalyse-report.mjs
// Re-run Claude analysis on an existing reports row WITHOUT creating a new
// row. Useful when the system prompt has been improved (e.g. citations
// added) and you want old rows to benefit. Keeps the same row UUID + same
// public URL so existing share links still work.
//
// Run:
//   node scripts/reanalyse-report.mjs <reportId>

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
  console.error('Usage: node scripts/reanalyse-report.mjs <reportId>');
  process.exit(1);
}

const secretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const { createClient } = await import('@supabase/supabase-js');
const { analyseInspectionPdf } = await import('../lib/claude.js');
const { findTradiesForAnalysis } = await import('../lib/places.js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  secretKey,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const fmt = (n) => (typeof n === 'number' ? `$${n.toLocaleString('en-AU')}` : String(n));
const ms = (start) => `${((Date.now() - start) / 1000).toFixed(1)}s`;

// ── Load the existing row (including existing tradies — we preserve them
//    if the new HERE lookup returns nothing, e.g. HERE_API_KEY missing locally)
const { data: row, error: loadErr } = await supabase
  .from('reports')
  .select('id, report_url, purchase_price, report_type, purchase_intent, property_address, tradies_json')
  .eq('id', reportId)
  .single();

if (loadErr || !row) {
  console.error('Could not load report:', loadErr?.message || 'not found');
  process.exit(1);
}

console.log(`\n📄 Re-analysing ${reportId}`);
console.log(`   address: ${row.property_address || '(not set)'}`);
console.log(`   type: ${row.report_type}   intent: ${row.purchase_intent}`);
console.log(`   PDF: ${row.report_url}\n`);

// ── Run Claude
const t0 = Date.now();
console.log('1️⃣  Running Claude analysis…');
const result = await analyseInspectionPdf({
  reportUrl: row.report_url,
  purchasePrice: row.purchase_price,
  reportType: row.report_type || 'pre_purchase',
  purchaseIntent: row.purchase_intent || 'home',
});

if (!result.ok) {
  console.error(`    ✗ ${ms(t0)} — ${result.error}`);
  process.exit(1);
}

const a = result.analysis;
console.log(`    ✓ ${ms(t0)}`);
console.log(`      verdict:       ${a.overall_verdict}`);
console.log(`      majors:        ${a.major_defects?.length ?? 0}`);
console.log(`      minors:        ${a.minor_defects?.length ?? 0}`);
console.log(`      pest:          ${a.pest_findings?.length ?? 0}`);
console.log(`      repair cost:   ${fmt(a.total_repair_cost_low)} – ${fmt(a.total_repair_cost_high)}`);
console.log(`      negotiation:   ${fmt(a.negotiation_amount)}`);

// ── Check citation coverage
const allDefects = [...(a.major_defects || []), ...(a.minor_defects || []), ...(a.pest_findings || [])];
const withPages = allDefects.filter((d) => Array.isArray(d.source_pages) && d.source_pages.length > 0);
console.log(`      citations:     ${withPages.length} of ${allDefects.length} defects have source_pages\n`);

// ── Tradies
console.log('2️⃣  Looking up local tradies…');
let tradiesByCategory = {};
try {
  tradiesByCategory = await findTradiesForAnalysis(a);
  const total = Object.values(tradiesByCategory).reduce((n, l) => n + l.length, 0);
  console.log(`    ✓ ${total} tradies across ${Object.keys(tradiesByCategory).length} categories\n`);
} catch (err) {
  console.log(`    ⚠ tradies lookup failed: ${err.message}\n`);
}

// ── Update the existing row (don't create a new one)
// Preserve existing tradies_json if the new HERE lookup returned nothing
// (e.g. HERE_API_KEY not set in local .env.local). Only overwrite when we
// actually got fresh tradies — otherwise an empty lookup would wipe
// previously-attached tradies that production had populated correctly.
const newTradieCount = Object.values(tradiesByCategory).reduce((n, l) => n + (l?.length || 0), 0);
const finalTradies = newTradieCount > 0 ? tradiesByCategory : (row.tradies_json || null);
console.log('3️⃣  Updating existing row…');
console.log(`    tradies: ${newTradieCount > 0 ? `fresh (${newTradieCount})` : `preserved from existing row`}`);
const { error: updateErr } = await supabase
  .from('reports')
  .update({
    result_json: a,
    tradies_json: finalTradies,
    property_address: a.property_address || row.property_address,
    status: 'complete',
  })
  .eq('id', reportId);

if (updateErr) {
  console.error('    ✗ update failed:', updateErr.message);
  process.exit(1);
}
console.log('    ✓ row updated with fresh analysis\n');

console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ Done in ${ms(t0)}`);
console.log(`   View: https://www.reportdecoded.com.au/results?reportId=${reportId}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
