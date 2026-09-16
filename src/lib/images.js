// Build-time image resolution.
//
// If a local image hasn't been added to /public yet, the page renders a neutral
// placeholder instead of a broken-image icon, and the build log lists exactly
// which files are still missing. Nothing on the site depends on someone else's
// server staying up.
import fs from "node:fs";
import path from "node:path";
import { asset } from "./assets.js";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const PLACEHOLDER = "images/placeholder.svg";
const missing = new Set();

function existsInPublic(relPath) {
  if (!relPath) return false;
  const clean = String(relPath).split("?")[0].replace(/^\/+/, "");
  return fs.existsSync(path.join(PUBLIC_DIR, clean));
}

/**
 * @param {string} src local path relative to /public, e.g. "images/hero/01.jpg"
 * @returns {{src: string, webp: string|null, missing: boolean}}
 */
export function image(src) {
  if (!src) return { src: asset(PLACEHOLDER), webp: null, missing: true };

  if (/^(https?:)?\/\//.test(src)) {
    // Remote URLs are a liability (expiring CDN tokens, hotlink blocking).
    console.warn(`[images] remote URL still in use: ${src}`);
    return { src, webp: null, missing: false };
  }

  if (!existsInPublic(src)) {
    if (!missing.has(src)) {
      missing.add(src);
      console.warn(`[images] missing file: public/${src.replace(/^\/+/, "")} — placeholder used`);
    }
    return { src: asset(PLACEHOLDER), webp: null, missing: true };
  }

  const webpPath = src.replace(/\.(jpe?g|png)$/i, ".webp");
  const hasWebp = webpPath !== src && existsInPublic(webpPath);
  return { src: asset(src), webp: hasWebp ? asset(webpPath) : null, missing: false };
}

export function missingImages() {
  return Array.from(missing);
}
