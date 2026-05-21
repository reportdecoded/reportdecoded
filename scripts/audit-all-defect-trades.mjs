// scripts/audit-all-defect-trades.mjs
//
// Run the trade-inference engine across every defect in every report
// in the database. Flag defects that look mis-classified so we can
// improve the keyword patterns in lib/trades.js.
//
// Flags any of:
//   • NO_TRADE        — inference returned zero matches (chip won't show)
//   • LOW_SCORE       — primary trade scored < 3 (single weak signal — could go either way)
//   • TIE_AT_TOP      — two or more trades tied for first place
//   • SUSPICIOUS      — heuristic: the defect name contains a strong trade
//                       hint that disagrees with the inferred primary
//                       (e.g. defect name says "paint" but inference says Carpenter)
//
// Output is grouped by flag type, so it's easy to scan for patterns
// and decide which keyword additions would help.

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

const { topTradesForDefect } = await import('../lib/trades.js');

// Heuristic: if the defect NAME contains one of these strong hints,
// the inferred primary trade SHOULD typically be that one. Mismatches
// get flagged as SUSPICIOUS for human review.
const NAME_HINTS = [
  { rx: /\b(paint|painted|painting|unpainted|repaint|colou?r)\b/i, expected: 'painter' },
  { rx: /\b(hinge|squeak|gap at top|misaligned door|sliding screen)\b/i, expected: 'handyman' },
  { rx: /\b(termite|borer|pest|infestation|white ant)\b/i, expected: 'pest_controller' },
  { rx: /\b(roof tile|roof sheet|rusted roof|gutter|downpipe|colorbond)\b/i, expected: 'roofer' },
  { rx: /\b(tile|grout|tiling)\b/i, expected: 'tiler' },
  { rx: /\b(brick|mortar|perpend|bed joint|masonry|blockwork)\b/i, expected: 'bricklayer' },
  { rx: /\b(concrete|slab|edge beam|footing)\b/i, expected: 'concreter' },
  { rx: /\b(stair (?:tread|riser|nosing|stringer|landing|winder)|balustrade|newel)\b/i, expected: 'stair_specialist' },
  { rx: /\b(plumber|tap leak|leaking tap|drainage|stormwater|sewer|water hammer|hot water)\b/i, expected: 'plumber' },
  { rx: /\b(electric|wiring|switchboard|RCD|smoke alarm|powerpoint|gpo)\b/i, expected: 'electrician' },
  { rx: /\b(glaz|glass|window pane|shower screen)\b/i, expected: 'glazier' },
  { rx: /\b(plaster|gyprock|cornice|drywall|nail pop)\b/i, expected: 'plasterer' },
  { rx: /\b(cabinet|joinery|benchtop|bench ?top|caesarstone)\b/i, expected: 'cabinetmaker' },
  { rx: /\b(render|bagging)\b/i, expected: 'renderer' },
  { rx: /\b(landscap|paving|garden|retaining wall)\b/i, expected: 'landscaper' },
  { rx: /\b(carpenter|joist|bearer|stud|truss|rafter|architrave|skirting|fascia|eave)\b/i, expected: 'carpenter' },
  { rx: /\b(damp|waterproofing|membrane|rising damp|water ingress)\b/i, expected: 'waterproofer' },
];

const buckets = {
  NO_TRADE: [],
  LOW_SCORE: [],
  TIE_AT_TOP: [],
  SUSPICIOUS: [],
};

const { data: reports, error } = await supabase
  .from('reports')
  .select('id, property_address, result_json, report_type')
  .eq('status', 'complete')
  .order('created_at', { ascending: false });
if (error) {
  console.error(error);
  process.exit(1);
}

console.log(`Auditing ${reports.length} reports...\n`);

let totalDefects = 0;
let flagged = 0;

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
    const trades = topTradesForDefect(d);
    const primary = trades[0];

    const ctx = {
      report: `${r.id.slice(0, 8)} · ${(r.property_address || '').slice(0, 50)} · ${r.report_type || 'pre_purchase'}`,
      defect: name,
      primary: primary ? `${primary.label} (${primary.score})` : '(none)',
      runners_up: trades.slice(1, 3).map((t) => `${t.label}:${t.score}`).join(', ') || '—',
    };

    // Flag 1 — no inferred trade at all
    if (!primary) {
      buckets.NO_TRADE.push(ctx);
      flagged++;
      continue;
    }

    // Flag 2 — top score is very low (single weak match)
    if (primary.score < 3) {
      buckets.LOW_SCORE.push(ctx);
      flagged++;
    }

    // Flag 3 — top tie
    if (trades.length >= 2 && trades[0].score === trades[1].score) {
      buckets.TIE_AT_TOP.push(ctx);
      flagged++;
    }

    // Flag 4 — name hints at a trade that ISN'T the primary
    for (const hint of NAME_HINTS) {
      if (hint.rx.test(name) && primary.key !== hint.expected) {
        // Skip the false alarm when the secondary IS the expected trade
        if (trades[1]?.key === hint.expected) break;
        buckets.SUSPICIOUS.push({
          ...ctx,
          hint: `name "${name}" suggests ${hint.expected}, inference picked ${primary.key}`,
        });
        flagged++;
        break;
      }
    }
  }
}

console.log(`────────────────────────────────────────`);
console.log(`Total defects: ${totalDefects}`);
console.log(`Flagged:       ${flagged}`);
console.log(`────────────────────────────────────────\n`);

const showBucket = (name, items) => {
  if (items.length === 0) {
    console.log(`✓ ${name}: 0 issues\n`);
    return;
  }
  console.log(`⚠ ${name} (${items.length}):`);
  items.forEach((it) => {
    console.log(`  · ${it.defect}`);
    console.log(`      report: ${it.report}`);
    console.log(`      primary: ${it.primary}`);
    if (it.runners_up !== '—') console.log(`      runners: ${it.runners_up}`);
    if (it.hint) console.log(`      hint: ${it.hint}`);
  });
  console.log('');
};

showBucket('NO_TRADE — no inference at all', buckets.NO_TRADE);
showBucket('SUSPICIOUS — name suggests different trade', buckets.SUSPICIOUS);
showBucket('LOW_SCORE — single weak signal', buckets.LOW_SCORE);
showBucket('TIE_AT_TOP — could go either way', buckets.TIE_AT_TOP);
