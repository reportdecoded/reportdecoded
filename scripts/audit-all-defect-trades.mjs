// scripts/audit-all-defect-trades.mjs
//
// FREE QA tool (no Claude/API cost — reads Supabase only). Reviews the trade
// assigned to every defect in every completed report and flags the ones worth
// a human glance. As of Jun 2026 the trade is CLAUDE-ASSIGNED (defect.trade);
// the regex engine (topTradesForDefect) is the fallback. This audit compares
// the two so you can spot-check that Claude is picking well.
//
// Run:  node scripts/audit-all-defect-trades.mjs
//
// Flags:
//   • NO_TRADE        — neither Claude nor regex produced a trade (no chip shows)
//   • INVALID_KEY     — Claude returned a `trade` that isn't a real trade key
//   • BUILDER_DEFAULT — Claude fell back to the generic "licensed_builder"
//                       catch-all (often a more specific trade fits — review)
//   • DISAGREE        — Claude's pick differs from the regex pick (usually
//                       Claude is right; scan to confirm)
//   • NAME_MISMATCH   — the defect NAME strongly hints a trade that ISN'T the
//                       one shown (e.g. name says "paint" but trade is carpenter)
//   • REGEX_ONLY      — no Claude trade (older report) AND weak regex score (<3)

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
    process.env[t.slice(0, eq).trim()] = v;
  }
}

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { topTradesForDefect, tradeByKey } = await import('../lib/trades.js');

// Heuristic: if the defect NAME contains one of these strong hints, the trade
// SHOWN should typically be that one. Mismatches get flagged for human review.
const NAME_HINTS = [
  { rx: /\b(paint|painted|painting|unpainted|repaint|seal(?:ed|ing)? (?:the )?(?:edge|timber|door))\b/i, expected: 'painter' },
  { rx: /\b(flashing|gutter|downpipe|ridge cap|roof tile|sarking)\b/i, expected: 'roofer' },
  { rx: /\b(weather seal|hinge|re-?caulk|minor adjustment|sliding (?:robe|door)|touch[- ]?up)\b/i, expected: 'handyman' },
  { rx: /\b(termite|borer|white ant|infestation)\b/i, expected: 'pest_controller' },
  { rx: /\b(tile|grout|tiling)\b/i, expected: 'tiler' },
  { rx: /\b(mortar|repoint|brick(?:work)?|masonry|blockwork)\b/i, expected: 'bricklayer' },
  { rx: /\b(plaster|gyprock|cornice|nail pop)\b/i, expected: 'plasterer' },
  { rx: /\b(cabinet|joinery|vanity|cupboard)\b/i, expected: 'cabinetmaker' },
  { rx: /\b(benchtop|caesarstone|stone bench)\b/i, expected: 'benchtop_specialist' },
  { rx: /\b(plumb|tap|drain|stormwater|sewer|hot water|leak under)\b/i, expected: 'plumber' },
  { rx: /\b(electric|wiring|switchboard|RCD|smoke alarm|powerpoint|exhaust fan|light fitting)\b/i, expected: 'electrician' },
  { rx: /\b(glaz|glass|window pane|shower screen|mirror)\b/i, expected: 'glazier' },
  { rx: /\b(render|bagging)\b/i, expected: 'renderer' },
  { rx: /\b(paving|retaining wall|drainage|garden)\b/i, expected: 'landscaper' },
  { rx: /\b(fence|paling|colorbond|gate)\b/i, expected: 'fencer' },
  { rx: /\b(asbestos|fibro)\b/i, expected: 'asbestos_remover' },
];

const buckets = { NO_TRADE: [], INVALID_KEY: [], BUILDER_DEFAULT: [], DISAGREE: [], NAME_MISMATCH: [], REGEX_ONLY: [] };

const { data: reports, error } = await supabase
  .from('reports')
  .select('id, property_address, result_json, report_type')
  .eq('status', 'complete')
  .order('created_at', { ascending: false });
if (error) { console.error(error); process.exit(1); }

let totalDefects = 0, claudeAssigned = 0, regexFallback = 0;

for (const r of reports) {
  const a = r.result_json || {};
  const all = [
    ...(a.major_defects || []).map((d) => ({ ...d, _kind: 'major' })),
    ...(a.minor_defects || []).map((d) => ({ ...d, _kind: 'minor' })),
    ...(a.pest_findings || []).map((d) => ({ ...d, _kind: 'pest' })),
  ];

  for (const d of all) {
    totalDefects++;
    const name = d.name || d.pest_type || '(unnamed)';
    const claude = tradeByKey(d.trade);
    const regex = topTradesForDefect(d)[0] || null;
    const effective = claude || regex; // what the user actually sees
    const source = claude ? 'claude' : (regex ? 'regex' : 'none');
    if (claude) claudeAssigned++; else if (regex) regexFallback++;

    const ctx = {
      report: `${r.id.slice(0, 8)} · ${(r.property_address || '').slice(0, 42)}`,
      defect: name,
      shown: effective ? `${effective.label} [${source}]` : '(none)',
      claude: d.trade ? (claude ? claude.key : `${d.trade} ✗invalid`) : '—',
      regex: regex ? `${regex.key}:${regex.score}` : '—',
    };

    if (!effective) { buckets.NO_TRADE.push(ctx); continue; }
    if (d.trade && !claude) buckets.INVALID_KEY.push(ctx);
    if (claude && claude.key === 'licensed_builder') buckets.BUILDER_DEFAULT.push(ctx);
    if (claude && regex && claude.key !== regex.key) buckets.DISAGREE.push(ctx);
    if (!claude && regex && regex.score < 3) buckets.REGEX_ONLY.push(ctx);

    for (const h of NAME_HINTS) {
      if (h.rx.test(name) && effective.key !== h.expected) {
        buckets.NAME_MISMATCH.push({ ...ctx, hint: `name hints ${h.expected}, shown ${effective.key}` });
        break;
      }
    }
  }
}

const line = '─'.repeat(64);
console.log(`\n${line}`);
console.log(`Reports: ${reports.length} · Defects: ${totalDefects}`);
console.log(`Trade source: ${claudeAssigned} Claude-assigned · ${regexFallback} regex-fallback (older reports)`);
console.log(line);

const show = (name, items, withHint) => {
  if (!items.length) { console.log(`\n✓ ${name}: 0`); return; }
  console.log(`\n⚠ ${name} (${items.length}):`);
  for (const it of items) {
    console.log(`  · ${it.defect}`);
    console.log(`      ${it.report}`);
    console.log(`      shown: ${it.shown}   claude:${it.claude}  regex:${it.regex}`);
    if (withHint && it.hint) console.log(`      ${it.hint}`);
  }
};

show('NO_TRADE — nothing shows', buckets.NO_TRADE);
show('INVALID_KEY — Claude returned a bad trade key', buckets.INVALID_KEY);
show('BUILDER_DEFAULT — Claude used the generic catch-all', buckets.BUILDER_DEFAULT);
show('NAME_MISMATCH — name hints a different trade', buckets.NAME_MISMATCH, true);
show('DISAGREE — Claude vs regex differ (usually Claude right)', buckets.DISAGREE);
show('REGEX_ONLY — old report, weak regex score', buckets.REGEX_ONLY);
console.log('');
