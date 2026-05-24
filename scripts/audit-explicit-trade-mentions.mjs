// scripts/audit-explicit-trade-mentions.mjs
//
// Scan every defect in every report for explicit trade mentions
// in Claude's prose ("a plumber", "needs an electrician",
// "carpenter to repair", "benchtop specialist should assess", etc).
// For each mention, compare against the current primary inferred
// trade. Flag mismatches — Claude's prose telling us the trade is
// a strong signal we should be honoring.
//
// Output: list of defects where Claude named trade X but inference
// returned trade Y, grouped so it's easy to spot patterns + add
// the missing keyword rules.

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

// Map from "trade word" -> trade key in TRADES taxonomy
const TRADE_MENTIONS = {
  plumber: 'plumber',
  plumbing: 'plumber',
  plumbers: 'plumber',
  electrician: 'electrician',
  electricians: 'electrician',
  sparky: 'electrician',
  carpenter: 'carpenter',
  carpenters: 'carpenter',
  carpentry: 'carpenter',
  painter: 'painter',
  painters: 'painter',
  tiler: 'tiler',
  tilers: 'tiler',
  bricklayer: 'bricklayer',
  bricklayers: 'bricklayer',
  mason: 'bricklayer',
  stonemason: 'bricklayer',
  plasterer: 'plasterer',
  plasterers: 'plasterer',
  roofer: 'roofer',
  roofers: 'roofer',
  'roof plumber': 'roofer',
  glazier: 'glazier',
  glaziers: 'glazier',
  locksmith: 'locksmith',
  cabinetmaker: 'cabinetmaker',
  joiner: 'cabinetmaker',
  joinery: 'cabinetmaker',
  landscaper: 'landscaper',
  landscapers: 'landscaper',
  handyman: 'handyman',
  waterproofer: 'waterproofer',
  'waterproofing specialist': 'waterproofer',
  'damp specialist': 'waterproofer',
  'pest controller': 'pest_controller',
  'pest control': 'pest_controller',
  'termite specialist': 'pest_controller',
  exterminator: 'pest_controller',
  'stair specialist': 'stair_specialist',
  'stair builder': 'stair_specialist',
  'benchtop specialist': 'benchtop_specialist',
  'stone fabricator': 'benchtop_specialist',
  'flooring specialist': 'flooring_contractor',
  'flooring contractor': 'flooring_contractor',
  'floor layer': 'flooring_contractor',
  'door specialist': 'door_specialist',
  renderer: 'renderer',
  'air conditioning specialist': 'hvac',
  hvac: 'hvac',
  'pool specialist': 'pool_specialist',
  'pool builder': 'pool_specialist',
  metalworker: 'metalworker',
  welder: 'metalworker',
  'garage door specialist': 'garage_door_specialist',
};

const { data: reports } = await supabase
  .from('reports')
  .select('id, property_address, result_json')
  .eq('status', 'complete')
  .order('created_at', { ascending: false });

console.log(`Auditing ${reports.length} complete reports for explicit trade mentions...\n`);

const mismatches = [];
const honored = {};
let totalMentions = 0;
let totalDefects = 0;

for (const r of reports) {
  const a = r.result_json || {};
  const all = [
    ...(a.major_defects || []),
    ...(a.minor_defects || []),
    ...(a.pest_findings || []),
  ];
  for (const d of all) {
    totalDefects++;
    const text = [
      d.name,
      d.plain_english || d.damage_description || d.summary,
      d.why_it_matters || d.recommendation,
      d.location,
    ].filter(Boolean).join(' ').toLowerCase();

    // Find explicit trade mentions
    const mentionedTrades = new Set();
    for (const [phrase, key] of Object.entries(TRADE_MENTIONS)) {
      // Match phrasings: "a X", "an X", "X needs", "X should", "X to",
      // "engage a X", "qualified X", "licensed X", "X specialist"
      const phraseEsc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const patterns = [
        new RegExp(`\\b(?:a|an|the|engage|qualified|licensed|registered|local|recommend(?:ed)?|consult|call|hire|specialist|professional)\\s+(?:a |an |the )?${phraseEsc}\\b`, 'i'),
        new RegExp(`\\b${phraseEsc}\\s+(?:needs|should|must|will|to|can|specialist|professional|recommended|required)\\b`, 'i'),
        new RegExp(`\\bneeds?\\s+(?:a |an |the )?${phraseEsc}\\b`, 'i'),
      ];
      if (patterns.some((p) => p.test(text))) {
        mentionedTrades.add(key);
        totalMentions++;
      }
    }

    if (mentionedTrades.size === 0) continue;

    const inferred = topTradesForDefect(d);
    const primaryKey = inferred[0]?.key;
    const secondaryKey = inferred[1]?.key;

    for (const mentioned of mentionedTrades) {
      if (mentioned === primaryKey) {
        honored[mentioned] = (honored[mentioned] || 0) + 1;
      } else if (mentioned === secondaryKey) {
        honored[mentioned + ' (as secondary)'] =
          (honored[mentioned + ' (as secondary)'] || 0) + 1;
      } else {
        mismatches.push({
          report: r.id.slice(0, 8),
          defect: d.name,
          mentioned,
          primary: primaryKey || '(none)',
          primary_score: inferred[0]?.score || 0,
          secondary: secondaryKey || '(none)',
        });
      }
    }
  }
}

console.log(`Defects scanned: ${totalDefects}`);
console.log(`Explicit trade mentions found: ${totalMentions}`);
console.log(`Honored as primary or secondary: ${Object.values(honored).reduce((s, n) => s + n, 0)}`);
console.log(`Mismatches: ${mismatches.length}\n`);

console.log('HONORED CORRECTLY:');
for (const [k, n] of Object.entries(honored).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(36)} ${n}`);
}
console.log();

if (mismatches.length === 0) {
  console.log('✓ No mismatches. Every explicit trade mention is honored.');
} else {
  console.log('⚠ MISMATCHES (Claude named trade X, inference returned trade Y):');
  // Group by mentioned trade to spot which trades need stronger patterns
  const byMentioned = {};
  for (const m of mismatches) {
    if (!byMentioned[m.mentioned]) byMentioned[m.mentioned] = [];
    byMentioned[m.mentioned].push(m);
  }
  for (const [mentioned, items] of Object.entries(byMentioned).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n  Claude named: ${mentioned}  (${items.length} mismatches)`);
    items.slice(0, 5).forEach((m) => {
      console.log(`    · ${m.defect.slice(0, 60).padEnd(60)} → got ${m.primary} (score ${m.primary_score})`);
    });
    if (items.length > 5) console.log(`    ... and ${items.length - 5} more`);
  }
}
