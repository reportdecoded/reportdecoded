// One-off: mark a stuck-in-processing row as failed with a clear reason.
// Usage: node scripts/fix-stuck-row.mjs <reportId> "<reason>"
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

const [reportId, ...reasonParts] = process.argv.slice(2);
const reason = reasonParts.join(' ');
if (!reportId || !reason) {
  console.error('Usage: node scripts/fix-stuck-row.mjs <reportId> "<reason>"');
  process.exit(1);
}

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

const { data, error } = await supabase
  .from('reports')
  .update({ status: 'failed', failure_reason: reason })
  .eq('id', reportId)
  .eq('status', 'processing')
  .select('id, status, failure_reason')
  .maybeSingle();

if (error) { console.error(error); process.exit(1); }
if (!data) { console.log('No row updated (already failed/complete, or id wrong)'); process.exit(0); }
console.log('Updated:', data);
