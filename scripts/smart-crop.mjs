/**
 * Smart-crop portrait photos so they look right in the site's 4:3 frames.
 *
 *   npm run images:crop                  # tours only (default)
 *   npm run images:crop -- tours gallery # choose folders inside public/images
 *   npm run images:crop -- --dry-run     # list what would change, write nothing
 *   npm run images:crop -- --sheet       # also write scripts/crop-preview.png
 *   npm run images:crop -- --ratio=16:10 # different target shape (default 4:3)
 *
 * How it works
 * - Looks at every .webp / .jpg / .png in public/images/<folder>.
 * - Landscape photos are left alone.
 * - Portrait photos (taller than wide) are copied ONCE into /originals (same
 *   folder structure, not deployed), then the cropped version is written over
 *   the file in public/. Re-running always crops from /originals, so it is safe
 *   to run as often as you like and you never lose the full photo.
 * - The crop is chosen by sharp's "attention" strategy: it keeps the part of
 *   the picture with the most detail, colour and contrast instead of the middle.
 *
 * Fixing a crop you don't like
 * - Edit scripts/crop-overrides.json, then run the script again. Examples:
 *     "images/tours/x/y.webp": "top"                       (top | bottom | centre | left | right)
 *     "images/tours/x/y.webp": { "focusY": 0.7 }           (0 = top edge, 1 = bottom edge)
 *     "images/tours/x/y.webp": { "focusX": 0.3, "focusY": 0.2 }
 *     "images/tours/x/y.webp": "skip"                      (leave this photo uncropped)
 *   focusY/focusX say where the CENTRE of the crop should sit.
 */
import { readdir, readFile, copyFile, mkdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, extname, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(REPO, "public");
const IMAGES = join(PUBLIC, "images");
const ORIGINALS = join(REPO, "originals");
const OVERRIDES_FILE = join(REPO, "scripts", "crop-overrides.json");

const MAX_WIDTH = 1600; // never wider than this
const QUALITY = 82;
const PORTRAIT_THRESHOLD = 1.05; // height / width above this = "portrait"

// ---- arguments -------------------------------------------------------------
const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const folders = args.filter((a) => !a.startsWith("--"));
if (folders.length === 0) folders.push("tours");
const DRY = flags.includes("--dry-run");
const SHEET = flags.includes("--sheet");
const ratioArg = (flags.find((a) => a.startsWith("--ratio=")) || "--ratio=4:3").slice(8);
const [rw, rh] = ratioArg.split(":").map(Number);
if (!rw || !rh) {
  console.error(`Bad --ratio "${ratioArg}". Use something like 4:3 or 16:10.`);
  process.exit(1);
}
const OUT_W = MAX_WIDTH;
const OUT_H = Math.round((OUT_W * rh) / rw);

// ---- helpers ---------------------------------------------------------------
const EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (EXTS.has(extname(e.name).toLowerCase())) yield full;
  }
}

async function loadOverrides() {
  try {
    return JSON.parse(await readFile(OVERRIDES_FILE, "utf8"));
  } catch {
    return {};
  }
}

const key = (file) => relative(PUBLIC, file).split(sep).join("/"); // images/tours/x/y.webp

async function orientedSize(file) {
  const { info } = await sharp(file).rotate().toBuffer({ resolveWithObject: true });
  return { width: info.width, height: info.height };
}

/** Build the sharp pipeline for one photo, honouring any override. */
function buildCrop(srcBuffer, size, override) {
  const base = sharp(srcBuffer).rotate();

  if (override && typeof override === "object") {
    // Manual focal point: cut the biggest OUT_W:OUT_H window around (focusX, focusY).
    const fx = clamp01(override.focusX ?? 0.5);
    const fy = clamp01(override.focusY ?? 0.5);
    const targetH = Math.min(size.height, Math.round((size.width * rh) / rw));
    const targetW = Math.min(size.width, Math.round((size.height * rw) / rh));
    const cropW = targetH === size.height ? targetW : size.width;
    const cropH = targetH === size.height ? size.height : targetH;
    const left = Math.round(clamp(fx * size.width - cropW / 2, 0, size.width - cropW));
    const top = Math.round(clamp(fy * size.height - cropH / 2, 0, size.height - cropH));
    return base
      .extract({ left, top, width: cropW, height: cropH })
      .resize(OUT_W, OUT_H, { fit: "cover" });
  }

  const position = {
    top: "top",
    bottom: "bottom",
    centre: "centre",
    center: "centre",
    left: "left",
    right: "right",
  }[override];

  return base.resize(OUT_W, OUT_H, {
    fit: "cover",
    position: position || sharp.strategy.attention,
  });
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const clamp01 = (n) => clamp(Number(n), 0, 1);

// ---- main ------------------------------------------------------------------
const overrides = await loadOverrides();
let cropped = 0;
let left = 0;
let skipped = 0;
const sheetTiles = [];

for (const folder of folders) {
  const root = join(IMAGES, folder);
  if (!existsSync(root)) {
    console.warn(`! public/images/${folder} does not exist, skipping`);
    continue;
  }

  for await (const file of walk(root)) {
    const k = key(file);
    const orig = join(ORIGINALS, relative(PUBLIC, file));
    const override = overrides[k];

    if (override === "skip") {
      skipped++;
      continue;
    }

    // Find out whether this is a portrait photo. If we already saved an
    // original, judge by that (the file in public/ may already be cropped).
    const source = existsSync(orig) ? orig : file;
    const size = await orientedSize(source);
    const isPortrait = size.height / size.width > PORTRAIT_THRESHOLD;

    if (!isPortrait) {
      left++;
      continue;
    }

    if (DRY) {
      console.log(`would crop  ${k}  (${size.width}x${size.height} -> ${OUT_W}x${OUT_H})${override ? "  [override]" : ""}`);
      cropped++;
      continue;
    }

    // First time we touch this photo: keep the full-size original.
    if (!existsSync(orig)) {
      await mkdir(dirname(orig), { recursive: true });
      await copyFile(file, orig);
    }

    const buffer = await readFile(orig);
    const out = await buildCrop(buffer, size, override)
      .webp({ quality: QUALITY })
      .toBuffer();

    // Always write a .webp. If the source was .jpg/.png the site's image()
    // helper will prefer the .webp sibling automatically.
    const target = extname(file).toLowerCase() === ".webp" ? file : file.replace(/\.(jpe?g|png)$/i, ".webp");
    await writeFile(target, out);

    console.log(`cropped     ${k}  (${size.width}x${size.height} -> ${OUT_W}x${OUT_H})${override ? "  [override]" : ""}`);
    cropped++;
    if (SHEET) sheetTiles.push({ name: k, buffer: out });
  }
}

if (SHEET && sheetTiles.length) {
  const COLS = 4;
  const TW = 400;
  const TH = Math.round((TW * rh) / rw);
  const rows = Math.ceil(sheetTiles.length / COLS);
  const composite = await Promise.all(
    sheetTiles.map(async (t, i) => ({
      input: await sharp(t.buffer).resize(TW, TH, { fit: "cover" }).toBuffer(),
      left: (i % COLS) * TW,
      top: Math.floor(i / COLS) * TH,
    }))
  );
  const sheetPath = join(REPO, "scripts", "crop-preview.png");
  await sharp({ create: { width: COLS * TW, height: rows * TH, channels: 3, background: "#ffffff" } })
    .composite(composite)
    .png()
    .toFile(sheetPath);
  console.log(`\nPreview sheet: scripts/crop-preview.png (tiles are in the order printed above)`);
}

console.log(
  `\n${DRY ? "Dry run: " : ""}${cropped} portrait photo(s) ${DRY ? "would be cropped" : "cropped"}, ` +
    `${left} landscape left untouched${skipped ? `, ${skipped} skipped by override` : ""}.`
);
if (!DRY && cropped) {
  console.log(`Full-size originals are in /originals (not deployed). Look at the result with: npm run dev`);
}
