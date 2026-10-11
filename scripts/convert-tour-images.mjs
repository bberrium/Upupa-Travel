// Converts every .jpg/.jpeg/.png in a folder to a resized .webp next to it.
// Usage (from the repo root):
//   node scripts/convert-tour-images.mjs public/images/tours/tour5
// Originals are left untouched. Needs `sharp` (Astro normally installs it;
// otherwise: npm i -D sharp).
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/convert-tour-images.mjs <folder>");
  process.exit(1);
}

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
for (const file of files) {
  const out = path.join(dir, file.replace(/\.[^.]+$/, ".webp"));
  await sharp(path.join(dir, file))
    .rotate() // respect phone EXIF orientation
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  console.log("✓", path.basename(out));
}
console.log(`Done: ${files.length} image(s).`);
