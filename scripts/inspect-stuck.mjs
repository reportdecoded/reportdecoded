// Inspect a stuck row's report_url so we can download + diagnose
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

const id = process.argv[2];
if (!id) { console.error('Usage: node scripts/inspect-stuck.mjs <reportId>'); process.exit(1); }

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

const { data, error } = await supabase
  .from('reports')
  .select('*')
  .eq('id', id)
  .single();

if (error) { console.error(error); process.exit(1); }

console.log(JSON.stringify({
  id: data.id,
  status: data.status,
  payment_status: data.payment_status,
  created_at: data.created_at,
  updated_at: data.updated_at,
  buyer_email: data.buyer_email,
  property_address: data.property_address,
  agent_id: data.agent_id,
  report_type: data.report_type,
  purchase_intent: data.purchase_intent,
  report_url: data.report_url,
  failure_reason: data.failure_reason,
  has_result: !!data.result_json,
}, null, 2));
