// Converts every .jpg/.jpeg/.png in a folder to a resized .webp next to it.
// Usage (from the repo root):
//   node scripts/convert-tour-images.mjs public/images/tours/tour5
// Originals are left untouched. Needs `sharp` (Astro normally installs it;
// otherwise: npm i -D sharp).
// node scripts/convert-tour-images.mjs public/images/tours/noravank-shaki-tatev
// sed -i 's/\.jpg/.webp/g' src/pages/tours/noravank-shaki-tatev.astro src/data/tours.js
// ls public/images/tours/noravank-shaki-tatev/*.webp | wc -l
// rm public/images/tours/noravank-shaki-tatev/*.jpg
//
// Only run the sed and rm lines after this script prints "Done" with zero
// failures. It exits with code 1 if any file failed, so `&&` chains stop.
//
// failOn: "none" lets sharp read JPEGs that libjpeg only warns about (for
// example "extraneous bytes before marker 0xd9", common in phone and Facebook
// exports). Sharp treats those warnings as fatal by default.

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/convert-tour-images.mjs <folder>");
  process.exit(1);
}

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
let failed = 0;

for (const file of files) {
  const out = path.join(dir, file.replace(/\.[^.]+$/, ".webp"));
  try {
    await sharp(path.join(dir, file), { failOn: "none" })
      .rotate() // respect phone EXIF orientation
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out);
    console.log("✓", path.basename(out));
  } catch (err) {
    failed += 1;
    console.warn("✗", file, "-", err.message);
  }
}

console.log(`Done: ${files.length - failed} of ${files.length} converted.`);
if (failed) {
  console.warn(`${failed} file(s) failed. Re-export those, then run again.`);
  process.exit(1);
}
