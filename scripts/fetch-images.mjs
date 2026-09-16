/**
 * Download every remote image listed in scripts/image-manifest.json into
 * /public/images, so the site stops depending on somebody else's server.
 *
 *   npm run images:fetch
 *
 * Already-downloaded files are skipped. Failures are listed at the end with
 * the exact local path to drop your own photo into instead.
 * Run `npm run images:optimize` afterwards.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const manifest = JSON.parse(readFileSync(join(ROOT, "scripts/image-manifest.json"), "utf8"));

const exists = async (p) => access(p).then(() => true).catch(() => false);

const failures = [];
let downloaded = 0;
let skipped = 0;

for (const [localPath, remoteUrl] of Object.entries(manifest)) {
  if (localPath.startsWith("_")) continue;

  const target = join(ROOT, "public", localPath);
  if (await exists(target)) {
    skipped += 1;
    continue;
  }

  process.stdout.write(`↓ ${localPath} … `);
  try {
    const response = await fetch(remoteUrl, {
      headers: {
        // Some hosts refuse plain script requests.
        "User-Agent": "Mozilla/5.0 (compatible; UpupaTravelImageFetch/1.0)",
        Accept: "image/avif,image/webp,image/jpeg,image/png,*/*",
      },
      redirect: "follow",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength < 1024) throw new Error("response too small to be a photo");

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, buffer);
    downloaded += 1;
    console.log(`ok (${Math.round(buffer.byteLength / 1024)} KB)`);
  } catch (error) {
    console.log(`FAILED — ${error.message}`);
    failures.push(localPath);
  }
}

console.log(`\nDownloaded ${downloaded}, already present ${skipped}, failed ${failures.length}.`);

if (failures.length) {
  console.log(
    "\nThese links are dead (expiring CDN tokens or hotlink protection).\n" +
      "Save your own photo at each path below, then run `npm run images:optimize`:\n"
  );
  failures.forEach((path) => console.log(`  public/${path}`));
  console.log(
    "\nUntil then those spots show a neutral placeholder — not a broken image icon."
  );
}
