// Followup to redact-sample-address.mjs. The block-character redaction
// ('███ Loch Street...') reads as eye-grabbing 'CENSORED HERE' in
// rendered HTML/PDF/email contexts where we can't style the chars.
// Strip the '███ ' prefix entirely so those plain-text surfaces show
// 'Loch Street, Yarraville VIC 3013' (suburb-level, naturally vague).
//
// Hardcoded JSX references on the homepage + SEO pages get a softer
// visual treatment via the new .redact-soft span class (separate edit).
//
// Idempotent: looks for the exact '███' prefix; if absent, no-op.

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

// Remove "███ " (with trailing space) wherever it appears in string
// fields. This turns "███ Loch Street, Yarraville VIC 3013" into
// "Loch Street, Yarraville VIC 3013" — naturally vague, no visible
// redaction artifact. Also handles "in ███ Loch Street" → "in Loch
// Street" inside the negotiation_language body.
function clean(text) {
  if (typeof text !== 'string') return { text, changed: false };
  const before = text;
  let out = text.split('███ ').join('');
  // Also catch stray "███" with no trailing space if any
  out = out.split('███').join('');
  return { text: out, changed: out !== before };
}

function walk(obj) {
  if (typeof obj === 'string') {
    const { text, changed } = clean(obj);
    return [text, changed];
  }
  if (Array.isArray(obj)) {
    let any = false;
    const arr = obj.map((v) => {
      const [nv, c] = walk(v);
      if (c) any = true;
      return nv;
    });
    return [arr, any];
  }
  if (obj && typeof obj === 'object') {
    let any = false;
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const [nv, c] = walk(v);
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
if (loadErr || !row) { console.error('Could not load:', loadErr); process.exit(1); }

const [newAddr, addrChanged] = walk(row.property_address);
const [newJson, jsonChanged] = walk(row.result_json);

if (!addrChanged && !jsonChanged) {
  console.log('No-op: already cleaned (no ███ blocks present).');
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

console.log('✓ Cleaned. New property_address:', newAddr);
if (jsonChanged) {
  console.log('  result_json fields updated (recursive replace)');
  console.log('  e.g., negotiation_language opening:');
  console.log('   ', newJson.negotiation_language?.slice(0, 200), '...');
}
