# Images: how to self-host them properly

Every photo the site shows must live in this repository, under `public/images/`.
Nothing should load from `scontent.fbcdn.net`, `googleusercontent.com`,
`armeniaplanet.com`, `janarmenia.com`, `traveltoarmenia.am` or any other site
you don't control. Those links either expire (Facebook and Google CDN URLs
carry an `oe=` expiry token), get blocked by hotlink protection, or belong to a
competitor who can remove them at any moment.

---

## 1. Folder layout

```
public/images/
├── brand/        logo.png, mark.png
├── hero/         homepage carousel (4 images)
├── categories/   the four cards under the hero
├── about/        the photo in the About section
├── gallery/      everything on /gallery
└── tours/
    ├── garni-geghard/
    └── sevan-dilijan/
```

File names are referenced from three places:

| What | File |
|---|---|
| Tour cards + tour page slideshows | `src/data/tours.js` → `images: [...]` |
| Itinerary stop photos | `src/pages/tours/<slug>.astro` → `image:` / `images:` |
| Gallery | `src/data/photos.js` |
| Hero, categories, about | `src/pages/index.astro` |

Paths are always written **without** a leading slash and **without** the site
base, e.g. `images/tours/garni-geghard/01-garni-temple.jpg`. The base
(`/Upupa-Travel/`) is added automatically by `src/lib/assets.js`. This is what
was broken before: `photos.js` used `/images/...`, which 404s on GitHub Pages.

---

## 2. Getting the current photos out of Facebook

`npm run images:fetch` tries to download everything listed in
`scripts/image-manifest.json`. The non-Facebook links may still work; the
Facebook ones almost certainly won't, because their tokens have expired.

For those, export the originals yourself:

**From the Facebook page (desktop):**
1. Open the post → click the photo → **⋯** menu → **Download**.
2. Or Meta Business Suite → **Content** → select posts → **Download**.
3. Or Facebook → **Settings & privacy** → **Settings** → **Your information** →
   **Download your information** → select **Posts** only, format **HTML**,
   media quality **High**. You get a zip with every photo at full size.

**From a phone:** the originals in your camera roll are better than anything
Facebook will give back — Facebook re-compresses uploads.

Then save each file at the exact path the build asks for (see step 4).

---

## 3. Optimising before committing

The photos in this repo were 89 MB. Browsers were downloading 6240×4160 JPEGs
to display them 400 px wide. After optimisation the whole folder is under 5 MB.

```bash
npm run images:optimize
```

This resizes anything oversized, re-encodes it, and writes a `.webp` next to
each file. Caps are per folder — 2000 px for hero, 1600 px for tours, 1400 px
for gallery, 900 px for category cards.

The script **rewrites files in place**, so keep your untouched originals
somewhere outside `public/` — there's an `originals/` folder at the repo root
for exactly this, and it isn't deployed.

`src/components/Picture.astro` automatically serves the `.webp` to browsers
that support it and falls back to the `.jpg` for those that don't. You don't
have to do anything per image.

---

## 4. Adding a photo, start to finish

```bash
# 1. put the file in place (name it descriptively, lowercase, no spaces)
cp ~/Desktop/IMG_4821.JPG public/images/tours/garni-geghard/03-geghard-monastery.jpg

# 2. shrink it and generate the webp
npm run images:optimize

# 3. check the build no longer warns about it
npm run build
```

If a file is missing, the build prints:

```
[images] missing file: public/images/tours/garni-geghard/03-geghard-monastery.jpg — placeholder used
```

and the page shows a neutral grey placeholder instead of a broken-image icon.
That list is your to-do list — when the build prints no `[images]` warnings,
every photo on the site is yours and self-hosted.

---

## 5. Photos still needed

These paths are referenced but not yet present:

```
public/images/tours/garni-geghard/01-garni-temple.jpg
public/images/tours/garni-geghard/02-charents-arch.jpg
public/images/tours/garni-geghard/03-geghard-monastery.jpg
public/images/tours/garni-geghard/04-symphony-of-stones.jpg
public/images/tours/garni-geghard/05-lavash.jpg
public/images/tours/sevan-dilijan/01-lake-sevan.jpg
public/images/tours/sevan-dilijan/02-lake-sevan-shore.jpg
public/images/tours/sevan-dilijan/03-sevanavank.jpg
public/images/tours/sevan-dilijan/04-sevanavank-steps.jpg
public/images/tours/sevan-dilijan/05-dilijan.jpg
public/images/tours/sevan-dilijan/06-dilijan-old-town.jpg
public/images/tours/sevan-dilijan/07-goshavank.jpg
public/images/tours/sevan-dilijan/08-goshavank-khachkar.jpg
public/images/tours/sevan-dilijan/09-haghartsin.jpg
public/images/tours/sevan-dilijan/10-haghartsin-forest.jpg
```

The gallery currently reuses photos you already had. Unsplash stock shots of
Armenia were removed: a private guide service that illustrates its own tours
with stock photography reads as a reseller. Your own photos, even imperfect
ones, are worth more here.

---

## 6. Rules of thumb

- Landscape 3:2 or 4:3 for tour and gallery photos; the card crops to 4:3.
- Under 400 KB per file after optimisation. The script gets you there.
- Descriptive file names — they become part of the URL and Google reads them.
- Every photo needs an `alt` description of what's in it; decorative images get
  `alt=""`.
- Never paste a URL from another website into a data file again. If you catch
  yourself doing it, the build now warns you: `[images] remote URL still in use`.
