// scripts/trade-accuracy.mjs
//
// Trade-matching accuracy harness. Two modes:
//
//   node scripts/trade-accuracy.mjs --extract
//     Pull every defect from every completed report in Supabase and
//     merge into scripts/trade-ground-truth.json. Existing `correct`
//     labels are PRESERVED — new defects arrive with correct:null.
//     Re-run any time new reports land.
//
//   node scripts/trade-accuracy.mjs
//     Score the matcher against every labelled defect. For each one,
//     compute what the buyer would see TODAY (Claude-assigned trade if
//     valid, else regex topTradesForDefect) and compare to `correct`.
//     Prints overall accuracy, per-source accuracy, and every miss.
//
// The ground-truth file is the regression baseline: after ANY change
// to lib/trades.js keywords or the Claude trade-assignment prompt,
// re-run the scorer. Accuracy must not drop.
//
// A defect counts as CORRECT if the shown trade matches `correct` OR
// matches one of the keys in optional `also_ok` (some defects
// genuinely have two defensible trades, e.g. handyman vs cabinetmaker
// for a loose hinge — don't punish either).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GT_PATH = join(__dirname, 'trade-ground-truth.json');

// .env.local loader (same pattern as audit-all-defect-trades.mjs)
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

const { topTradesForDefect, tradeByKey, TRADES } = await import('../lib/trades.js');

const EXTRACT = process.argv.includes('--extract');

function defectId(reportId, d, kind, idx) {
  // Stable ID: report prefix + kind + defect name slug. Index breaks
  // ties for duplicate names within a report.
  const slug = (d.name || d.pest_type || 'unnamed')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  return `${reportId.slice(0, 8)}:${kind}:${slug}:${idx}`;
}

function shownTrade(d) {
  const claude = tradeByKey(d.trade);
  if (claude) return { key: claude.key, source: 'claude' };
  const regex = topTradesForDefect(d)[0];
  if (regex) return { key: regex.key, source: 'regex' };
  return { key: null, source: 'none' };
}

// The exact fields defectText() in lib/trades.js concatenates — the
// ground-truth file must preserve these verbatim so score mode sees
// the same text the live matcher sees.
const TEXT_FIELDS = [
  'name', 'pest_type', 'element_or_system', 'plain_english',
  'damage_description', 'summary', 'why_it_matters', 'recommendation',
  'location',
];

function pickTextFields(d) {
  const out = {};
  for (const f of TEXT_FIELDS) if (d[f]) out[f] = d[f];
  return out;
}

async function loadDefects() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, property_address, result_json')
    .eq('status', 'complete')
    .order('created_at', { ascending: true });
  if (error) throw error;

  const out = [];
  for (const r of reports) {
    const a = r.result_json || {};
    const kinds = [
      ['major', a.major_defects || []],
      ['minor', a.minor_defects || []],
      ['pest', a.pest_findings || []],
    ];
    for (const [kind, arr] of kinds) {
      arr.forEach((d, idx) => {
        out.push({
          id: defectId(r.id, d, kind, idx),
          address: (r.property_address || '').slice(0, 50),
          kind,
          name: d.name || d.pest_type || '(unnamed)',
          fields: pickTextFields(d),
          stored_claude_trade: d.trade || null,
          _defect: d,
        });
      });
    }
  }
  return out;
}

if (EXTRACT) {
  const existing = existsSync(GT_PATH)
    ? JSON.parse(readFileSync(GT_PATH, 'utf8'))
    : { _readme: 'correct = the trade key a buyer SHOULD see. also_ok = other defensible keys. Set by human review — this file is the regression baseline.', defects: [] };
  const byId = new Map(existing.defects.map((d) => [d.id, d]));

  const live = await loadDefects();
  let added = 0;
  for (const d of live) {
    const prev = byId.get(d.id);
    const shown = shownTrade(d._defect);
    const entry = {
      id: d.id,
      address: d.address,
      kind: d.kind,
      name: d.name,
      fields: d.fields,
      stored_claude_trade: d.stored_claude_trade,
      currently_shown: shown.key,
      shown_source: shown.source,
      correct: prev?.correct ?? null,
      also_ok: prev?.also_ok ?? [],
    };
    if (!prev) added++;
    byId.set(d.id, entry);
  }

  const merged = { _readme: existing._readme, defects: [...byId.values()] };
  writeFileSync(GT_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  const unlabelled = merged.defects.filter((d) => !d.correct).length;
  console.log(`Extracted ${live.length} defects (${added} new) → ${GT_PATH}`);
  console.log(`Labelled: ${merged.defects.length - unlabelled} · Unlabelled: ${unlabelled}`);
  process.exit(0);
}

// ── SCORE MODE ──────────────────────────────────────────────
if (!existsSync(GT_PATH)) {
  console.error('No ground-truth file. Run with --extract first, then label `correct` for each defect.');
  process.exit(1);
}
const gt = JSON.parse(readFileSync(GT_PATH, 'utf8'));
const labelled = gt.defects.filter((d) => d.correct);
if (!labelled.length) {
  console.error('Ground-truth file has no labelled defects yet. Fill in `correct` (a trade key from lib/trades.js) for each entry.');
  process.exit(1);
}

// Validate label keys against the live taxonomy so typos can't
// silently deflate accuracy.
const badLabels = labelled.filter((d) => !TRADES[d.correct] || d.also_ok.some((k) => !TRADES[k]));
if (badLabels.length) {
  console.error('Labels that are not valid trade keys:');
  for (const d of badLabels) console.error(`  ${d.id} → correct:${d.correct} also_ok:${d.also_ok.join(',')}`);
  process.exit(1);
}

let hits = 0;
const misses = [];
const bySource = { claude: { hit: 0, total: 0 }, regex: { hit: 0, total: 0 }, none: { hit: 0, total: 0 } };

for (const d of labelled) {
  // Re-derive what the buyer sees from the STORED Claude trade plus the
  // CURRENT regex engine — so edits to lib/trades.js show up here.
  const shown = shownTrade({ ...(d.fields || {}), trade: d.stored_claude_trade });
  const ok = shown.key === d.correct || d.also_ok.includes(shown.key);
  bySource[shown.source].total++;
  if (ok) { hits++; bySource[shown.source].hit++; }
  else misses.push({ ...d, shown: shown.key, source: shown.source });
}

const pct = (h, t) => (t ? `${((h / t) * 100).toFixed(1)}%` : 'n/a');
const line = '─'.repeat(60);
console.log(`\n${line}`);
console.log(`TRADE MATCHING ACCURACY: ${pct(hits, labelled.length)}  (${hits}/${labelled.length} labelled defects)`);
console.log(`  Claude-assigned: ${pct(bySource.claude.hit, bySource.claude.total)} (${bySource.claude.hit}/${bySource.claude.total})`);
console.log(`  Regex-fallback:  ${pct(bySource.regex.hit, bySource.regex.total)} (${bySource.regex.hit}/${bySource.regex.total})`);
console.log(line);

if (misses.length) {
  console.log(`\nMISSES (${misses.length}):`);
  for (const m of misses) {
    console.log(`  ✗ ${m.name}`);
    console.log(`      shown: ${m.shown ?? '(none)'} [${m.source}] · correct: ${m.correct}${m.also_ok.length ? ` (also ok: ${m.also_ok.join(', ')})` : ''}`);
    console.log(`      ${m.id}`);
  }
} else {
  console.log('\n✓ No misses.');
}
console.log('');
