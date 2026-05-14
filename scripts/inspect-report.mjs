// scripts/inspect-report.mjs
// Quick inspector to verify source_pages came through populated.
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

const reportId = process.argv[2];
if (!reportId) {
  console.error('Usage: node scripts/inspect-report.mjs <reportId>');
  process.exit(1);
}

const { createClient } = await import('@supabase/supabase-js');
const secretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  secretKey,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

const { data, error } = await supabase
  .from('reports')
  .select('id, property_address, result_json')
  .eq('id', reportId)
  .single();
if (error) {
  console.error(error);
  process.exit(1);
}

const a = data.result_json || {};
console.log(`\n📄 ${data.property_address}`);
console.log(`Verdict: ${a.overall_verdict}\n`);

const showDefect = (label, list) => {
  if (!list || list.length === 0) return;
  console.log(`${label}:`);
  list.forEach((d, i) => {
    const pages = Array.isArray(d.source_pages) && d.source_pages.length ? `[p.${d.source_pages.join(', ')}]` : '[no source_pages]';
    console.log(`  ${i + 1}. ${d.name || d.pest_type || '(unnamed)'}  ${pages}`);
  });
  console.log();
};

showDefect('Major defects', a.major_defects);
showDefect('Minor defects', a.minor_defects);
showDefect('Pest findings', a.pest_findings);
