// Diagnose the dashboard "no agent row" redirect after Supabase key migration
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

async function testKey(label, keyValue) {
  if (!keyValue) {
    console.log(`\n[${label}] not set — skipping`);
    return;
  }
  console.log(`\n[${label}] key length ${keyValue.length}`);
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, keyValue, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // Count all agents
  const { count, error: countErr } = await client
    .from('agents')
    .select('*', { count: 'exact', head: true });
  if (countErr) {
    console.log(`  ERROR counting:`, countErr.message);
  } else {
    console.log(`  Total agent rows visible: ${count}`);
  }
  // Try to find Morgan's row by both candidate emails
  for (const email of ['morgan@koashore.com', 'info@reportdecoded.com.au']) {
    const { data, error } = await client
      .from('agents')
      .select('id, email, full_name, subscription_status, subscription_tier')
      .ilike('email', email)
      .maybeSingle();
    if (error) console.log(`  ${email}: ERROR ${error.message}`);
    else if (!data) console.log(`  ${email}: NO ROW FOUND`);
    else console.log(`  ${email}: id=${data.id} tier=${data.subscription_tier} status=${data.subscription_status}`);
  }
}

await testKey('NEW SUPABASE_SECRET_KEY', process.env.SUPABASE_SECRET_KEY);
await testKey('LEGACY SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY);
