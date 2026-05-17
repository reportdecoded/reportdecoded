// Redact the inspector's identity from the public Yarraville sample's
// negotiation_language so we don't surface an identifiable third party
// (Russell Wall, Licence DBU 31691) on a permanent marketing page.
//
// Idempotent: the replacement only fires on the exact original phrase.
// Re-running this script after a successful redaction is a no-op.
//
// Run: node scripts/redact-sample.mjs

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
const ORIGINAL = 'conducted 7 August 2020 by Russell Wall, Inside Out Property Inspections, Licence DBU 31691';
const REPLACEMENT = 'conducted by a licensed AS4349.1 inspector';

const { data: row, error: loadErr } = await s
  .from('reports')
  .select('result_json')
  .eq('id', SAMPLE_ID)
  .single();
if (loadErr || !row) { console.error('Could not load sample row:', loadErr); process.exit(1); }

const original = row.result_json?.negotiation_language || '';
if (!original.includes(ORIGINAL)) {
  // Either already redacted, or the source phrase has drifted. Print the
  // current state so we can see what's there.
  const stillHasInspector = /Russell\s+Wall|Inside\s+Out\s+Property|DBU\s*31691/i.test(original);
  if (stillHasInspector) {
    console.warn('Source phrase not found verbatim but inspector identity is still present.');
    console.warn('Update the ORIGINAL constant in this script to match the current wording.');
    console.warn('Current negotiation_language opening:\n', original.slice(0, 400));
    process.exit(1);
  }
  console.log('No-op: sample is already redacted.');
  process.exit(0);
}

const redacted = original.replace(ORIGINAL, REPLACEMENT);
const newJson = { ...row.result_json, negotiation_language: redacted };

const { error: updateErr } = await s
  .from('reports')
  .update({ result_json: newJson })
  .eq('id', SAMPLE_ID);
if (updateErr) { console.error('Update failed:', updateErr); process.exit(1); }

console.log('✓ Redacted. Old phrase:');
console.log('  →', ORIGINAL);
console.log('  → replaced with:', REPLACEMENT);
console.log('\nResulting opening:');
console.log(redacted.slice(0, 400));
