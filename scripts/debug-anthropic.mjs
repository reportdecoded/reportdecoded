// Tiny smoke test for Anthropic API key in .env.local
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

const key = process.env.ANTHROPIC_API_KEY;
if (!key) {
  console.error('ANTHROPIC_API_KEY not in .env.local');
  process.exit(1);
}

// Print prefix + length so we can verify shape without exposing value
console.log(`Key prefix: ${key.slice(0, 14)}...   length: ${key.length}`);
console.log(`(Expected: starts with "sk-ant-api03-", length 108)\n`);

const Anthropic = (await import('@anthropic-ai/sdk')).default;
const client = new Anthropic({ apiKey: key });

try {
  const res = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 20,
    messages: [{ role: 'user', content: 'Say OK only.' }],
  });
  console.log('✓ AUTH OK');
  console.log('  Response:', JSON.stringify(res.content[0]));
} catch (err) {
  console.log('✗ AUTH FAILED');
  console.log('  HTTP status:', err.status);
  console.log('  Message:', err.message);
  if (err.error) console.log('  Full error:', JSON.stringify(err.error));
}
