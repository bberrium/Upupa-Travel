# Upupa Travel — Astro Project

## Running it locally
```
npm install
npm run dev
```
Then open http://localhost:4321

## Building for deployment
```
npm run build
```
This outputs plain static HTML/CSS/JS into `dist/` — upload that folder to any static host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, or your existing hosting) exactly like your
old HTML files, no server or database required.

## Where things live
- `src/layouts/BaseLayout.astro` — the shared page shell: fonts, nav, footer, language script.
  Edit this once, it updates every page.
- `src/components/Header.astro` / `Footer.astro` — nav and footer markup.
- `src/data/translations.js` — all EN/RU/AM text strings, in one place instead of copy-pasted
  into every file.
- `src/data/photos.js` — the gallery's photo list. Add/remove entries here.
- `src/pages/index.astro` — homepage.
- `src/pages/gallery.astro` — gallery page.
- `src/pages/custom-tour.astro`, `src/pages/private-transfer.astro` — the two linked pages from
  the homepage's category boxes (placeholder content — flesh these out anytime).
- `src/layouts/TourLayout.astro` — the reusable tour detail page template.
- `src/pages/tours/*.astro` — one short file per tour (see "Adding a new tour" below).

## Adding a new tour
1. Copy `src/pages/tours/garni-geghard.astro` to a new file, e.g. `src/pages/tours/dilijan-sevan.astro`.
2. Edit the `days`, `included`, and `tips` arrays with that tour's content.
3. Update the `<TourLayout ... />` props at the bottom (title, summary, heroImage, priceFrom, label).
4. Add a new tour card + link on the homepage (`src/pages/index.astro`, in the "Tours & Packages" section)
   pointing to `/tours/dilijan-sevan`.
That's it — nav, footer, fonts, and styling all come from the shared layout automatically.

## Note on images
Your original `images/` folder (logo, hp3.jpg, ararat1.jpg, vanq.jpg, Hoopoe_1080.jpg) wasn't
in the uploaded files, so `public/images/` is currently empty. Drop those files in there with
the same filenames and the gallery + logo will pick them up automatically — everything else in
this project currently points to hosted URLs (Google/Unsplash), so it will already render
without them, just add them in when you have them.
