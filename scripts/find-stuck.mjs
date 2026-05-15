// Quick: find reports stuck in processing
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

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

const { data, error } = await supabase
  .from('reports')
  .select('id, created_at, updated_at, status, payment_status, buyer_email, property_address, agent_id, result_json, failure_reason')
  .gte('created_at', oneHourAgo)
  .order('created_at', { ascending: false });

if (error) {
  console.error(error);
  process.exit(1);
}

console.log(`\nReports in last hour: ${data.length}\n`);
for (const r of data) {
  const ageMin = ((Date.now() - new Date(r.created_at).getTime()) / 60000).toFixed(1);
  const hasResult = !!r.result_json;
  console.log(`${r.id.slice(0, 8)}…  ${ageMin}min ago  status=${r.status}  paid=${r.payment_status}  result=${hasResult ? 'YES' : 'no'}`);
  console.log(`  email: ${r.buyer_email || '(none)'}`);
  console.log(`  addr:  ${r.property_address || '(none)'}`);
  console.log(`  agent: ${r.agent_id ? r.agent_id.slice(0, 8) + '…' : '(buyer flow)'}`);
  if (r.failure_reason) console.log(`  FAIL:  ${r.failure_reason}`);
  console.log();
}
