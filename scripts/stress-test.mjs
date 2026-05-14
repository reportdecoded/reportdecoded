// scripts/stress-test.mjs
// Runs a directory of PDFs through run-pdf.mjs sequentially and tabulates
// the verdicts, defect counts, costs, and timing for a final comparison
// matrix. Sequential by design — avoids hitting Anthropic per-minute rate
// limits and makes per-PDF errors easier to attribute.
//
// Usage:
//   node scripts/stress-test.mjs <pdf-directory> [--type pre_purchase|new_build_handover]

import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const runPdfScript = join(__dirname, 'run-pdf.mjs');

const args = process.argv.slice(2);
if (!args[0]) {
  console.error('Usage: node scripts/stress-test.mjs <pdf-directory> [--type ...]');
  process.exit(1);
}
const corpusDir = resolve(args[0]);
const reportTypeIdx = args.indexOf('--type');
const reportTypeArg = reportTypeIdx >= 0 ? args[reportTypeIdx + 1] : null;

if (!existsSync(corpusDir)) {
  console.error(`Directory not found: ${corpusDir}`);
  process.exit(1);
}

const pdfs = readdirSync(corpusDir)
  .filter((f) => f.toLowerCase().endsWith('.pdf'))
  .map((f) => ({
    name: f,
    path: join(corpusDir, f),
    size: statSync(join(corpusDir, f)).size,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

console.log(`\n📋 Stress test corpus: ${pdfs.length} PDFs in ${corpusDir}\n`);
for (const p of pdfs) console.log(`  · ${p.name} (${(p.size / 1024).toFixed(0)} KB)`);

// Heuristics: filenames hint at the right --type override for handover/strata
// since some samples don't look like pre_purchase reports.
function inferType(name) {
  if (reportTypeArg) return reportTypeArg;
  const n = name.toLowerCase();
  if (/handover|practical|pci|completion/.test(n)) return 'new_build_handover';
  return 'pre_purchase';
}

// Run a single PDF through run-pdf.mjs, capture stdout, parse the summary
// lines we care about.
function runOne(pdfPath, type) {
  return new Promise((resolveP) => {
    const t0 = Date.now();
    const child = spawn(process.execPath, [runPdfScript, pdfPath, '--type', type], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const result = parseRunOutput(stdout, code, elapsed);
      resolveP({ pdfPath, type, code, elapsed, stdout, stderr, result });
    });
  });
}

// Extract the structured outcome from run-pdf.mjs's printed lines.
function parseRunOutput(stdout, code, elapsed) {
  const grab = (rx) => stdout.match(rx)?.[1]?.trim();

  const verdict = grab(/verdict:\s+(\S.*)/);
  if (verdict) {
    return {
      status: 'complete',
      verdict,
      property: grab(/property:\s+(\S.*)/) || '—',
      majors: grab(/majors:\s+(\d+)/) ?? '—',
      minors: grab(/minors:\s+(\d+)/) ?? '—',
      pest: grab(/pest:\s+(\d+)/) ?? '—',
      costRange: grab(/repair cost:\s+(\S.*)/) || '—',
      negotiation: grab(/negotiation:\s+(\S.*)/) || '—',
      elapsed,
    };
  }
  // Fast-fail / max_tokens / other failure
  const failMatch = stdout.match(/✗\s+\d+\.?\d*s\s+—\s+(.+)/);
  if (failMatch) {
    return {
      status: 'failed',
      reason: failMatch[1].trim().slice(0, 120),
      elapsed,
    };
  }
  return { status: 'unknown', code, elapsed };
}

// Run them sequentially.
const results = [];
for (let i = 0; i < pdfs.length; i++) {
  const p = pdfs[i];
  const type = inferType(p.name);
  console.log(`\n[${i + 1}/${pdfs.length}] ${p.name}  (type=${type})`);
  const r = await runOne(p.path, type);
  results.push({ name: p.name, ...r });
  if (r.result.status === 'complete') {
    console.log(`  → ${r.result.verdict}  ${r.result.majors}maj/${r.result.minors}min/${r.result.pest}pest  ${r.result.negotiation}  (${r.elapsed}s)`);
  } else if (r.result.status === 'failed') {
    console.log(`  ✗ FAILED: ${r.result.reason}  (${r.elapsed}s)`);
  } else {
    console.log(`  ⚠ UNKNOWN exit=${r.code}  (${r.elapsed}s)`);
  }
}

// ── Final summary table ───────────────────────────────────────────────
console.log('\n\n' + '━'.repeat(80));
console.log('STRESS TEST SUMMARY');
console.log('━'.repeat(80) + '\n');
console.log('| # | PDF | Type | Verdict | Maj/Min/Pest | Cost range | Neg | Time |');
console.log('|---|---|---|---|---|---|---|---|');
results.forEach((r, i) => {
  const rr = r.result;
  if (rr.status === 'complete') {
    console.log(`| ${i + 1} | ${r.name} | ${r.type} | ${rr.verdict} | ${rr.majors}/${rr.minors}/${rr.pest} | ${rr.costRange} | ${rr.negotiation} | ${r.elapsed}s |`);
  } else if (rr.status === 'failed') {
    console.log(`| ${i + 1} | ${r.name} | ${r.type} | **FAILED** | — | — | — | ${r.elapsed}s |`);
  } else {
    console.log(`| ${i + 1} | ${r.name} | ${r.type} | UNKNOWN | — | — | — | ${r.elapsed}s |`);
  }
});

// Print failure reasons separately for readability.
const fails = results.filter((r) => r.result.status === 'failed');
if (fails.length) {
  console.log(`\n${fails.length} failure${fails.length === 1 ? '' : 's'}:`);
  fails.forEach((r) => console.log(`  · ${r.name}: ${r.result.reason}`));
}

const totalTime = results.reduce((s, r) => s + Number(r.elapsed), 0);
console.log(`\nTotal time: ${(totalTime / 60).toFixed(1)} min  ·  PDFs: ${results.length}  ·  Avg: ${(totalTime / results.length).toFixed(1)}s/PDF`);
