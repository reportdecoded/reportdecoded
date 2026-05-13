// scripts/run-pdf.mjs
// One-off runner: take a local PDF, push it through the same pipeline an
// authenticated agent would trigger via /dashboard/upload — UploadThing →
// reports row → Claude analysis → HERE tradies → persist.
//
// Why this exists: lets us stress-test the analysis end-to-end without the
// browser session / Stripe pieces. The reports row is written so the result
// shows up at /dashboard/reports just like a real agent upload.
//
// Run:
//   node scripts/run-pdf.mjs <path-to-pdf> [options]
//
// Auto-loads .env.local from the repo root (a built-in mini-parser tolerates
// non-ASCII comments that Node's own --env-file flag chokes on).
// Options:
//   --address "123 Main St, Suburb VIC"     property address override
//   --price 850000                          purchase price
//   --type pre_purchase|new_build_handover  default pre_purchase
//   --intent home|investment                default home
//   --agent <uuid>                          agent id to tag (default Morgan's Pro account)
//   --no-tradies                            skip HERE Maps enrichment

import { readFileSync, existsSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Load .env.local manually — node --env-file chokes on non-ASCII comments
// (em-dashes etc.). This mini parser only handles KEY=VALUE lines, ignores
// blank lines and # comments. Doesn't support multi-line values or escapes
// (none of our keys need them).
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env.local');
if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Always override — .env.local is source of truth for local dev. The
    // Windows env may have stale empty-string keys (e.g. ANTHROPIC_API_KEY="")
    // from prior setup that would otherwise hide the real value.
    if (val) process.env[key] = val;
  }
}

const { createClient } = await import('@supabase/supabase-js');
const { UTApi, UTFile } = await import('uploadthing/server');
const { analyseInspectionPdf } = await import('../lib/claude.js');
const { findTradiesForAnalysis } = await import('../lib/places.js');

const DEFAULT_AGENT_ID = 'da321a42-def5-4030-abe5-0ac4917cdbfc'; // Morgan's Pro account

// ── arg parsing ───────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0 || args[0].startsWith('--')) {
  console.error('Usage: node --env-file=.env.local scripts/run-pdf.mjs <path-to-pdf> [options]');
  process.exit(1);
}
const pdfPath = resolve(args[0]);
const opts = {
  address: null,
  price: null,
  type: 'pre_purchase',
  intent: 'home',
  agent: DEFAULT_AGENT_ID,
  tradies: true,
};
for (let i = 1; i < args.length; i++) {
  const a = args[i];
  if (a === '--address') opts.address = args[++i];
  else if (a === '--price') opts.price = Number(args[++i]);
  else if (a === '--type') opts.type = args[++i];
  else if (a === '--intent') opts.intent = args[++i];
  else if (a === '--agent') opts.agent = args[++i];
  else if (a === '--no-tradies') opts.tradies = false;
}

// ── env sanity ────────────────────────────────────────────────
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'UPLOADTHING_TOKEN',
  'ANTHROPIC_API_KEY',
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}`);
  console.error('Run with: node --env-file=.env.local scripts/run-pdf.mjs ...');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// ── helpers ───────────────────────────────────────────────────
const fmt = (n) => (typeof n === 'number' ? `$${n.toLocaleString('en-AU')}` : String(n));
const ms = (start) => `${((Date.now() - start) / 1000).toFixed(1)}s`;

async function uploadToUploadThing(localPath) {
  const buf = readFileSync(localPath);
  const file = new UTFile([buf], basename(localPath), { type: 'application/pdf' });
  const utapi = new UTApi();
  const res = await utapi.uploadFiles([file]);
  const entry = Array.isArray(res) ? res[0] : res;
  if (!entry || !entry.data) {
    throw new Error(`UploadThing failed: ${JSON.stringify(entry?.error || entry)}`);
  }
  return entry.data.ufsUrl ?? entry.data.url;
}

// ── main ──────────────────────────────────────────────────────
async function main() {
  const t0 = Date.now();
  console.log(`\n${'━'.repeat(64)}`);
  console.log(`📄 ${basename(pdfPath)}`);
  console.log(`   type=${opts.type} intent=${opts.intent} agent=${opts.agent}`);
  console.log(`${'━'.repeat(64)}\n`);

  // 1. Upload PDF
  console.log('1️⃣  Uploading to UploadThing…');
  const tUpload = Date.now();
  const reportUrl = await uploadToUploadThing(pdfPath);
  console.log(`    ✓ ${ms(tUpload)}  →  ${reportUrl}\n`);

  // 2. Insert reports row
  console.log('2️⃣  Inserting reports row…');
  const { data: report, error: insertErr } = await supabase
    .from('reports')
    .insert({
      report_url: reportUrl,
      buyer_email: null,
      property_address: opts.address || null,
      purchase_price: opts.price || null,
      report_type: opts.type,
      purchase_intent: opts.intent,
      status: 'processing',
      payment_status: 'paid',
      agent_id: opts.agent,
    })
    .select('id')
    .single();
  if (insertErr || !report) {
    console.error('insert failed:', insertErr);
    process.exit(1);
  }
  const reportId = report.id;
  console.log(`    ✓ report id ${reportId}\n`);

  // 3. Claude analysis
  console.log('3️⃣  Running Claude analysis…');
  const tClaude = Date.now();
  const result = await analyseInspectionPdf({
    reportUrl,
    purchasePrice: opts.price,
    reportType: opts.type,
    purchaseIntent: opts.intent,
  });

  if (!result.ok) {
    console.log(`    ✗ ${ms(tClaude)} — ${result.error}`);
    await supabase
      .from('reports')
      .update({
        status: 'failed',
        failure_reason: result.error,
        ...(result.refund ? { payment_status: 'refunded' } : {}),
      })
      .eq('id', reportId);
    console.log(`\n❌ Analysis failed. Row marked failed${result.refund ? ' (refund-eligible)' : ''}.`);
    console.log(`   View row: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.reportdecoded.com.au'}/results?reportId=${reportId}`);
    process.exit(1);
  }

  const a = result.analysis;
  console.log(`    ✓ ${ms(tClaude)}`);
  console.log(`      verdict:       ${a.overall_verdict}`);
  console.log(`      property:      ${a.property_address || '(not detected)'}`);
  console.log(`      era:           ${a.building_era || '(unknown)'}`);
  console.log(`      majors:        ${a.major_defects?.length ?? 0}`);
  console.log(`      minors:        ${a.minor_defects?.length ?? 0}`);
  console.log(`      pest:          ${a.pest_findings?.length ?? 0}`);
  console.log(`      repair cost:   ${fmt(a.total_repair_cost_low)} – ${fmt(a.total_repair_cost_high)}`);
  console.log(`      negotiation:   ${fmt(a.negotiation_amount)}\n`);

  // 4. Tradies (best-effort)
  let tradiesByCategory = {};
  if (opts.tradies) {
    console.log('4️⃣  Looking up local tradies via HERE Maps…');
    const tTradies = Date.now();
    try {
      tradiesByCategory = await findTradiesForAnalysis(a);
      const total = Object.values(tradiesByCategory).reduce((n, l) => n + l.length, 0);
      console.log(`    ✓ ${ms(tTradies)} — ${total} tradies across ${Object.keys(tradiesByCategory).length} categories`);
      for (const [cat, list] of Object.entries(tradiesByCategory)) {
        console.log(`      ${cat}: ${list.length}  (e.g. ${list[0]?.name ?? '—'})`);
      }
      console.log();
    } catch (err) {
      console.log(`    ⚠  tradies lookup failed: ${err.message}\n`);
    }
  }

  // 5. Persist
  console.log('5️⃣  Persisting result to Supabase…');
  await supabase
    .from('reports')
    .update({
      status: 'complete',
      result_json: a,
      tradies_json: Object.keys(tradiesByCategory).length > 0 ? tradiesByCategory : null,
      property_address: a.property_address || opts.address || null,
    })
    .eq('id', reportId);
  console.log('    ✓ row marked complete\n');

  // Major defects detail
  if (a.major_defects?.length) {
    console.log('🔧 Major defects');
    for (const d of a.major_defects) {
      console.log(`  · ${d.name} (${d.location})  ${fmt(d.repair_cost_low)}–${fmt(d.repair_cost_high)}  [${d.trade_category}]`);
    }
    console.log();
  }
  if (a.pest_findings?.length) {
    console.log('🐜 Pest findings');
    for (const p of a.pest_findings) console.log(`  · ${p.name || p.summary || JSON.stringify(p)}`);
    console.log();
  }

  console.log(`${'━'.repeat(64)}`);
  console.log(`✅ Done in ${ms(t0)}`);
  console.log(`   View:  https://www.reportdecoded.com.au/results?reportId=${reportId}&agent=${opts.agent}`);
  console.log(`${'━'.repeat(64)}\n`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
