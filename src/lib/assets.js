// Resolves an image path against the site's base path.
//
// Astro's BASE_URL is "/" locally and "/Upupa-Travel/" on GitHub Pages, so a
// hard-coded "/images/foo.jpg" 404s in production. Always wrap local paths:
//   asset("images/tours/garni/01.jpg")
// Absolute URLs and data URIs pass through untouched.
const RAW_BASE = import.meta.env.BASE_URL || "/";
export const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;

export function asset(path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return BASE + String(path).replace(/^\/+/, "");
}

// Absolute URL, for canonical links and social share tags.
export function absoluteUrl(path, site) {
  const origin = String(site || "").replace(/\/+$/, "");
  return origin + asset(path);
}
