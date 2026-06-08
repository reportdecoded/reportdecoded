// scripts/build-suburb-medians.mjs
//
// Builds lib/data/vic-suburb-medians.json — the bundled, free, CC-BY suburb
// median lookup that powers the "Suburb market context" panel in reports.
//
// Data source: Victorian Property Sales Report — Median House by Suburb
// (Quarterly), Valuer-General Victoria, via data.vic.gov.au (CKAN).
// Licence: CC BY 4.0 (attribution required — surfaced in the report UI).
//
// REFRESH (do this each quarter — see memory reference_reportdecoded_valuation):
//   node scripts/build-suburb-medians.mjs
// It auto-discovers the latest quarter via the CKAN API and pulls the .xls
// through the Wayback Machine (land.vic.gov.au itself is Cloudflare-blocked to
// scripts; Wayback mirrors it and is open). If the network fetch fails it
// falls back to scripts/_data/vic-median-house.xls (a manual browser download).
//
// xlsx (SheetJS) is a devDependency — used ONLY here at build time. The app
// runtime never imports it; it just reads the JSON this script writes.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LOCAL_XLS = join(__dirname, '_data', 'vic-median-house.xls');
// Emit a .js ESM module (export default {...}) rather than .json — avoids the
// Node-vs-webpack JSON import-assertion incompatibility; imports cleanly in both.
const OUT = join(ROOT, 'lib', 'data', 'vic-suburb-medians.js');
const CKAN_PKG = 'victorian-property-sales-report-median-house-by-suburb';

// Column indices in the Crystal-Reports .xls (verified Jun 2025 quarter).
const COL = { suburb: 0, medianLatest: 9, markLatest: 10, salesQ: 11, chgAnnual: 13, chgQtr: 14 };

const QUARTER_END = { 'Jan-Mar': '-03-31', 'Apr-Jun': '-06-30', 'Jul-Sep': '-09-30', 'Oct-Dec': '-12-31' };

const num = (v) => {
  const n = Number(String(v ?? '').replace(/[, ]/g, ''));
  return Number.isFinite(n) ? n : null;
};
const titleCase = (s) =>
  String(s).toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase()).trim();

async function fetchLatestXlsBuffer() {
  // 1. Find the newest quarter resource + its land.vic source URL via CKAN.
  const pkgResp = await fetch(`https://discover.data.vic.gov.au/api/3/action/package_show?id=${CKAN_PKG}`);
  if (!pkgResp.ok) throw new Error(`CKAN package_show HTTP ${pkgResp.status}`);
  const pkg = await pkgResp.json();
  const resources = (pkg?.result?.resources || []).filter((r) => /\.xls$/i.test(r.url || ''));
  if (!resources.length) throw new Error('no .xls resources in CKAN package');
  const latest = resources[resources.length - 1]; // listed oldest -> newest
  console.log(`[build] latest CKAN resource: ${latest.name}`);

  // 2. land.vic is Cloudflare-blocked to scripts; pull via Wayback instead.
  const avail = await fetch(
    `https://archive.org/wayback/available?url=${encodeURIComponent(latest.url.replace(/^https?:\/\//, ''))}`
  ).then((r) => r.json());
  const snap = avail?.archived_snapshots?.closest?.url;
  if (!snap) throw new Error('no Wayback snapshot for latest resource');
  const rawSnap = snap.replace(/\/web\/(\d+)\//, '/web/$1id_/'); // id_ = raw original bytes
  console.log(`[build] downloading via Wayback: ${rawSnap}`);
  const fileResp = await fetch(rawSnap);
  if (!fileResp.ok) throw new Error(`Wayback download HTTP ${fileResp.status}`);
  return Buffer.from(await fileResp.arrayBuffer());
}

async function loadWorkbook() {
  try {
    const buf = await fetchLatestXlsBuffer();
    mkdirSync(dirname(LOCAL_XLS), { recursive: true });
    writeFileSync(LOCAL_XLS, buf); // cache for offline rebuilds
    return XLSX.read(buf, { type: 'buffer' });
  } catch (err) {
    console.warn(`[build] auto-fetch failed (${err.message}); falling back to local file`);
    if (!existsSync(LOCAL_XLS)) {
      throw new Error(`No local file at ${LOCAL_XLS}. Download the latest "Median House by Suburb" .xls and save it there.`);
    }
    return XLSX.readFile(LOCAL_XLS);
  }
}

const wb = await loadWorkbook();
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: '' });

// Period label: header row0[9] = "Apr-Jun", row1[9] = year.
const periodLabel = String(rows[0]?.[COL.medianLatest] || '').trim();
const periodYear = String(rows[1]?.[COL.medianLatest] || '').trim();
const asOf = `${periodLabel} ${periodYear}`.trim();
const asOfDate = QUARTER_END[periodLabel] ? `${periodYear}${QUARTER_END[periodLabel]}` : null;

const suburbs = {};
let count = 0;
for (const r of rows) {
  const rawName = String(r[COL.suburb] || '').trim();
  // Skip header/footer/blank rows: need an alpha suburb name + numeric median.
  if (!rawName || !/[A-Za-z]/.test(rawName)) continue;
  const median = num(r[COL.medianLatest]);
  if (median === null) continue;
  // Drop summary rows (metro/country totals) — keep only single-suburb rows.
  if (/metropolitan|country victoria|victoria total|^total/i.test(rawName)) continue;

  suburbs[rawName.toUpperCase()] = {
    name: titleCase(rawName),
    median,
    salesQ: num(r[COL.salesQ]),
    changeAnnualPct: num(r[COL.chgAnnual]),
    changeQuarterPct: num(r[COL.chgQtr]),
    preliminary: String(r[COL.markLatest] || '').includes('^'),
  };
  count++;
}

if (count < 100) throw new Error(`Only parsed ${count} suburbs — layout may have changed; aborting.`);

const out = {
  meta: {
    state: 'VIC',
    propertyType: 'house',
    asOf,
    asOfDate,
    suburbCount: count,
    source: 'Valuer-General Victoria — Victorian Property Sales Report',
    licence: 'CC BY 4.0',
    attribution: `Median house price data © State of Victoria (Valuer-General Victoria), ${asOf}, CC BY 4.0.`,
    datasetUrl: `https://discover.data.vic.gov.au/dataset/${CKAN_PKG}`,
  },
  suburbs,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-suburb-medians.mjs — do not edit by hand.\n` +
    `// Source: ${out.meta.source} (${out.meta.asOf}). Licence: ${out.meta.licence}.\n` +
    `export default ${JSON.stringify(out)};\n`
);
console.log(`[build] wrote ${count} VIC suburbs (as at ${asOf}) -> ${OUT}`);
console.log(`[build] sample:`, JSON.stringify(suburbs['YARRAVILLE'] || suburbs['THORNBURY']));
