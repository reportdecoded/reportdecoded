// scripts/square-hero.mjs
// Convert 01_hero.png (1080×1350 portrait) to a square 1080×1080 version
// so the Instagram grid thumbnail doesn't center-crop the left text.

import sharp from 'sharp';

const SRC = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts\01_hero.png`;
const OUT = String.raw`C:\Users\morga\OneDrive\Desktop\Report Decoded\Instagram_Posts\01_hero_square.png`;

const meta = await sharp(SRC).metadata();
console.log(`Source: ${meta.width}×${meta.height}`);

const NAVY = { r: 10, g: 22, b: 40, alpha: 1 };

// Step 1: resize so width = 1080, preserving aspect
const sized = await sharp(SRC).resize({ width: 1080 }).toBuffer();
const sizedMeta = await sharp(sized).metadata();
console.log(`After width-resize: ${sizedMeta.width}×${sizedMeta.height}`);

if (sizedMeta.height > 1080) {
  // Too tall → crop vertically, biased UP slightly so the brand badge
  // stays in the visible frame (text is left-aligned mid-image already)
  const cropTop = Math.floor((sizedMeta.height - 1080) * 0.3);
  await sharp(sized)
    .extract({ left: 0, top: cropTop, width: 1080, height: 1080 })
    .png()
    .toFile(OUT);
  console.log(`✓ Cropped from height ${sizedMeta.height} → 1080 (top offset: ${cropTop})`);
} else if (sizedMeta.height < 1080) {
  // Too short → pad navy top+bottom
  const padTop = Math.floor((1080 - sizedMeta.height) / 2);
  const padBottom = 1080 - sizedMeta.height - padTop;
  await sharp(sized)
    .extend({ top: padTop, bottom: padBottom, left: 0, right: 0, background: NAVY })
    .png()
    .toFile(OUT);
  console.log(`✓ Padded with navy (top: ${padTop}, bottom: ${padBottom})`);
} else {
  await sharp(sized).png().toFile(OUT);
  console.log('✓ Already square — copied as-is');
}

console.log(`Output: ${OUT}`);
