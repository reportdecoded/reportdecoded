// scripts/cleanup-test-rows.mjs
// Lists all reports tagged with Morgan's agent_id, EXCLUDES the public
// Yarraville sample, then deletes them. Run with --dry-run to see what
// would be deleted without actually deleting.
//
//   node scripts/cleanup-test-rows.mjs --dry-run    (preview)
//   node scripts/cleanup-test-rows.mjs              (actually delete)

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

const dryRun = process.argv.includes('--dry-run');
const MORGAN_AGENT_ID = 'da321a42-def5-4030-abe5-0ac4917cdbfc';
const KEEP = new Set([
  'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d', // Public Yarraville sample
]);

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// List everything tagged with Morgan's agent_id
const { data: rows, error } = await supabase
  .from('reports')
  .select('id, created_at, property_address, status, result_json')
  .eq('agent_id', MORGAN_AGENT_ID)
  .order('created_at', { ascending: false });

if (error) {
  console.error(error);
  process.exit(1);
}

const toDelete = rows.filter((r) => !KEEP.has(r.id));
const toKeep = rows.filter((r) => KEEP.has(r.id));

console.log(`\n📊 Reports tagged with Morgan's agent_id: ${rows.length}`);
console.log(`   To KEEP:   ${toKeep.length}`);
console.log(`   To DELETE: ${toDelete.length}\n`);

console.log('━━ KEEPING ━━');
for (const r of toKeep) {
  const verdict = r.result_json?.overall_verdict || r.status;
  console.log(`  · ${r.id}  ${r.property_address || '(no address)'}  [${verdict}]  ${r.created_at.slice(0, 10)}`);
}

console.log(`\n━━ DELETING ${dryRun ? '(dry run — not really)' : ''} ━━`);
for (const r of toDelete) {
  const verdict = r.result_json?.overall_verdict || r.status;
  console.log(`  · ${r.id}  ${r.property_address || '(no address)'}  [${verdict}]  ${r.created_at.slice(0, 10)}`);
}

if (toDelete.length === 0) {
  console.log('\nNothing to delete.');
  process.exit(0);
}

if (dryRun) {
  console.log(`\n(dry run — pass without --dry-run to actually delete ${toDelete.length} rows)`);
  process.exit(0);
}

const idsToDelete = toDelete.map((r) => r.id);
const { error: delErr } = await supabase
  .from('reports')
  .delete()
  .in('id', idsToDelete);

if (delErr) {
  console.error('Delete failed:', delErr.message);
  process.exit(1);
}

console.log(`\n✅ Deleted ${idsToDelete.length} rows.`);
