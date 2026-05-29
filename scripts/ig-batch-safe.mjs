// scripts/ig-batch-safe.mjs
//
// Fast batch — scale + navy-pad each existing IG post (03-20) so the
// content sits safely within Instagram's grid-crop zone. Original
// design preserved 100%, just shrunk into a navy frame.
//
// Output: 0X_<slug>_safe.png alongside each original.

import sharp from 'sharp';
import { readdirSync } from 'node:fs';

const DIR = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts`;
const NAVY = { r: 10, g: 22, b: 40, alpha: 1 };
const FRAME = 1080;          // square output dimension
const CONTENT_WIDTH = 800;   // target width of content (74% of 1080)

// Match files 03_*.png through 20_*.png (skip 01_hero.png, 02_problem.png — already done)
const files = readdirSync(DIR)
  .filter((f) => /^(0[3-9]|1[0-9]|20)_[a-z0-9_]+\.png$/.test(f))
  .sort();

console.log(`Found ${files.length} posts to process\n`);

for (const f of files) {
  const slug = f.replace('.png', '');
  const inPath = `${DIR}\\${f}`;
  const outPath = `${DIR}\\${slug}_safe.png`;

  const meta = await sharp(inPath).metadata();
  const aspect = meta.width / meta.height;
  const scaledW = CONTENT_WIDTH;
  const scaledH = Math.round(CONTENT_WIDTH / aspect);

  const scaled = await sharp(inPath).resize(scaledW, scaledH).toBuffer();

  const padTop = Math.floor((FRAME - scaledH) / 2);
  const padBottom = FRAME - scaledH - padTop;
  const padLeft = Math.floor((FRAME - scaledW) / 2);
  const padRight = FRAME - scaledW - padLeft;

  await sharp(scaled)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: padLeft,
      right: padRight,
      background: NAVY,
    })
    .png()
    .toFile(outPath);

  console.log(`✓ ${slug}_safe.png  (${scaledW}×${scaledH} centered in ${FRAME}×${FRAME})`);
}

console.log(`\nDone. ${files.length} posts converted.`);
