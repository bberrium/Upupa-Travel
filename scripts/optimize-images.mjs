/**
 * Resize + compress everything in public/images so the site stays fast.
 *
 *   npm run images:optimize
 *
 * - never upscales; only shrinks images wider than the cap for their folder
 * - rewrites the .jpg/.png in place and writes a .webp sibling next to it
 * - skips anything already small enough
 *
 * Keep full-resolution originals in /originals (not deployed), not in /public.
 */
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname, dirname, basename } from "node:path";
import sharp from "sharp";

const ROOT = new URL("../public/images/", import.meta.url).pathname;

// Max width per folder. Hero images are full-bleed, thumbnails are not.
const CAPS = [
  [/\/hero\//, 2000],
  [/\/tours\//, 1600],
  [/\/about\//, 1600],
  [/\/gallery\//, 1400],
  [/\/categories\//, 900],
  [/\/brand\//, 600],
];
const DEFAULT_CAP = 1600;

const capFor = (p) => (CAPS.find(([re]) => re.test(p)) || [null, DEFAULT_CAP])[1];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let before = 0;
let after = 0;

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

  const original = (await stat(file)).size;
  before += original;

  const cap = capFor(file);
  const img = sharp(file).rotate();
  const meta = await img.metadata();
  const pipeline = meta.width > cap ? img.resize({ width: cap, withoutEnlargement: true }) : img;

  const tmp = join(dirname(file), `.tmp-${basename(file)}`);
  if (ext === ".png") {
    await pipeline.clone().png({ quality: 82, compressionLevel: 9 }).toFile(tmp);
  } else {
    await pipeline.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(tmp);
  }
  await unlink(file);
  await rename(tmp, file);

  const webp = file.replace(/\.(jpe?g|png)$/i, ".webp");
  await sharp(file).webp({ quality: 78 }).toFile(webp);

  after += (await stat(file)).size;
  const saved = Math.round((1 - (await stat(file)).size / original) * 100);
  console.log(`${file.replace(ROOT, "")}  ${(original / 1024 / 1024).toFixed(1)}MB → ${((await stat(file)).size / 1024).toFixed(0)}KB  (-${saved}%)`);
}

console.log(
  `\nTotal: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`
);
