// List recent reports with full IDs and report_urls
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
const { data } = await s.from('reports').select('id, report_url, status, created_at, updated_at, failure_reason').gte('created_at', new Date(Date.now() - 2*60*60*1000).toISOString()).order('created_at', { ascending: false });
for (const r of data) {
  const ageMin = ((Date.now() - new Date(r.created_at).getTime()) / 60000).toFixed(1);
  console.log(`${r.id}  age=${ageMin}min  status=${r.status}${r.failure_reason ? '  FAIL='+r.failure_reason.slice(0,80) : ''}`);
  console.log(`  url: ${r.report_url}`);
}
