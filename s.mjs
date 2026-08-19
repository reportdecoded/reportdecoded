import { readFileSync, existsSync } from 'node:fs';
if (existsSync('.env.local')) for (const line of readFileSync('.env.local','utf8').split(/\r?\n/)){const t=line.trim();if(!t||t.startsWith('#'))continue;const eq=t.indexOf('=');if(eq<1)continue;let v=t.slice(eq+1).trim();if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1);if(v)process.env[t.slice(0,eq).trim()]=v;}
const { createClient } = await import('@supabase/supabase-js');
const { analyseInspectionPdf } = await import('./lib/claude.js');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY, { auth:{persistSession:false,autoRefreshToken:false}});
const { data } = await s.from('reports').select('report_url,purchase_price,report_type,purchase_intent,property_address').ilike('property_address','1/20 Littleford%').eq('payment_status','paid').limit(1);
const row=data[0];
console.log('Re-analysing (DRY RUN, not saved):', row.property_address);
console.log('BEFORE (stored): 17 major | 15 minor | negotiation $26,500\n--- running new prompt... ---');
const r = await analyseInspectionPdf({ reportUrl: row.report_url, purchasePrice: row.purchase_price, reportType: row.report_type||'pre_purchase', purchaseIntent: row.purchase_intent||'home' });
if(!r.ok){ console.log('FAILED:', r.error); process.exit(1); }
const a=r.analysis;
console.log(`\nAFTER (new prompt): ${a.major_defects?.length??0} major | ${a.minor_defects?.length??0} minor | ${a.pest_findings?.length??0} pest | negotiation $${a.negotiation_amount?.toLocaleString?.()||a.negotiation_amount}`);
console.log('\nNEW major list:');
for(const d of (a.major_defects||[])) console.log(`  • ${d.name} [${d.urgency}] $${d.repair_cost_low}-${d.repair_cost_high}`);
