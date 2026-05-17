// Redact the Yarraville sample's street number across the live DB
// row. Replaces "18 Loch Street, Yarraville 3013" with the redacted
// "███ Loch Street, Yarraville VIC 3013" — block characters read as
// a clear "censored" bar, suburb + state stay so location credibility
// is preserved.
//
// Updates both:
//   - reports.property_address      (top-level field)
//   - reports.result_json.property_address  (nested in the analysis JSON)
//
// Idempotent: re-running after redaction is a no-op (the original
// "18 Loch Street" substring won't be present).
//
// Note: this only covers the live /results sample page. The hardcoded
// JSX references on the homepage + SEO landing pages need a separate
// find/replace pass (scripts/redact-sample-address-jsx.mjs).

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
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

const SAMPLE_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';

// Targeted replacements — match any common spelling of the original.
const REPLACEMENTS = [
  ['18 Loch Street Yarraville 3013', '███ Loch Street, Yarraville VIC 3013'],
  ['18 Loch Street, Yarraville VIC 3013', '███ Loch Street, Yarraville VIC 3013'],
  ['18 Loch Street, Yarraville 3013', '███ Loch Street, Yarraville VIC 3013'],
  ['18 Loch Street, Yarraville', '███ Loch Street, Yarraville'],
  ['18 Loch St, Yarraville VIC', '███ Loch St, Yarraville VIC'],
  ['18 Loch St Yarraville', '███ Loch St Yarraville'],
];

function redactString(text) {
  if (typeof text !== 'string') return { text, changed: false };
  let out = text;
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
    if (out.includes(from)) {
      out = out.split(from).join(to);
      changed = true;
    }
  }
  return { text: out, changed };
}

function redactAny(obj) {
  if (typeof obj === 'string') {
    const r = redactString(obj);
    return [r.text, r.changed];
  }
  if (Array.isArray(obj)) {
    let any = false;
    const arr = obj.map((v) => {
      const [nv, c] = redactAny(v);
      if (c) any = true;
      return nv;
    });
    return [arr, any];
  }
  if (obj && typeof obj === 'object') {
    let any = false;
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const [nv, c] = redactAny(v);
      if (c) any = true;
      out[k] = nv;
    }
    return [out, any];
  }
  return [obj, false];
}

const { data: row, error: loadErr } = await s
  .from('reports')
  .select('property_address, result_json')
  .eq('id', SAMPLE_ID)
  .single();
if (loadErr || !row) { console.error('Could not load sample row:', loadErr); process.exit(1); }

const [newAddr, addrChanged] = redactAny(row.property_address);
const [newJson, jsonChanged] = redactAny(row.result_json);

if (!addrChanged && !jsonChanged) {
  console.log('No-op: sample already redacted.');
  process.exit(0);
}

const update = {};
if (addrChanged) update.property_address = newAddr;
if (jsonChanged) update.result_json = newJson;

const { error: updateErr } = await s
  .from('reports')
  .update(update)
  .eq('id', SAMPLE_ID);
if (updateErr) { console.error('Update failed:', updateErr); process.exit(1); }

console.log('✓ Redacted in DB:');
if (addrChanged) console.log('  property_address →', newAddr);
if (jsonChanged) console.log('  result_json fields updated (recursive replace)');

// Audit: any remaining matches?
const { data: check } = await s.from('reports').select('property_address, result_json').eq('id', SAMPLE_ID).single();
const dump = JSON.stringify(check);
const leaks = REPLACEMENTS.filter(([from]) => dump.includes(from));
if (leaks.length) {
  console.warn('\n⚠ Possible leaks still present:');
  for (const [from] of leaks) console.warn('  ⚠', from);
} else {
  console.log('\n✓ Audit clean — no remaining "18 Loch" references in this row.');
}
