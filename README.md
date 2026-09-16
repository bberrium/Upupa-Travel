# Upupa Travel

Marketing and booking-enquiry site for Upupa Travel, a private guide service in
Yerevan, Armenia. Built with [Astro](https://astro.build) and Tailwind CSS,
deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml`.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run images:fetch` | Download the images listed in `scripts/image-manifest.json` |
| `npm run images:optimize` | Resize + compress `public/images` and emit `.webp` |
| `npm run dev:mobile` | Same dev server, reachable from your phone (see below) |

## Testing on a real phone

```bash
npm run dev:mobile
```

Astro prints two addresses. Use the **Network** one, e.g.
`http://192.168.1.14:4321/Upupa-Travel/`, and open it on your phone while it is
on the same Wi-Fi. Changes reload live on the phone as you edit.

If the phone can't reach it, your laptop firewall is blocking port 4321, or the
Wi-Fi has client isolation on (common in cafés). A fallback that always works:
push to `main`, wait for the Pages deploy, and open the live URL.

In Chrome or Safari on a laptop, DevTools → device toolbar (⌘⇧M / Ctrl+Shift+M)
→ iPhone 14 Pro is a good proxy for layout checks, but always confirm tap
targets and scrolling on a real device.

## Project structure

```
src/
├── components/     Header, Footer, TourCard, TourSearch, forms, Picture
├── data/           tours.js, photos.js, reviews.js, translations.js
├── layouts/        BaseLayout (SEO, header/footer), TourLayout (tour pages)
├── lib/            site.js (business config), assets.js, images.js, forms.js
├── pages/          one file per route
└── styles/         global.css — design tokens as component classes
public/images/      all photos, self-hosted (see IMAGES.md)
```

## Things you edit most often

| To change… | Edit |
|---|---|
| Phone, email, WhatsApp, social links, form endpoint | `src/lib/site.js` |
| Tour prices, titles, photos | `src/data/tours.js` |
| A tour's itinerary | `src/pages/tours/<slug>.astro` |
| Gallery photos | `src/data/photos.js` |
| Guest reviews | `src/data/reviews.js` |
| Colours, spacing, type scale | `tailwind.config.mjs` |
| Header logo style (`lockup` or `badge`) | `src/lib/site.js` → `logo.style` |

## Making the forms actually send

Both forms post through `src/lib/forms.js`. Out of the box `SITE.formEndpoint`
is empty, so a submission opens the visitor's mail app with the message
pre-filled — nothing is silently lost, but it's a poor experience.

Pick one:

- **Formspree / Getform / Web3Forms** — create a form, paste the endpoint URL
  into `formEndpoint` in `src/lib/site.js`. Done.
- **Netlify** — if you move hosting to Netlify, set `netlifyForms: true`
  instead. The forms already carry `name` and `form-name` fields.

Both forms include a hidden honeypot field to absorb bots.

## Deploying to upupatravel.com

GitHub Pages project sites live under `/Upupa-Travel/`; a custom domain does
not. Set both of these or every link and image breaks:

```bash
SITE_URL=https://upupatravel.com BASE_PATH=/ npm run build
```

In the GitHub Actions workflow, add them under `env:`. Also add
`public/CNAME` containing `upupatravel.com`, and update `SITE.url` in
`src/lib/site.js` plus the sitemap line in `public/robots.txt`.

## The logo

`src/lib/site.js` → `logo.style` switches between:

- **`lockup`** (default) — the hoopoe illustration beside "UPUPA TRAVEL" set in
  Source Serif 4, with "discover ARMENIA" underneath. The name is live text, so
  it is sharp at any size and readable at a glance on a phone.
- **`badge`** — the original circular badge image, shown at 68px on mobile and
  88px on desktop. Recognisable, but the arched lettering is only a few pixels
  tall at that size.

Both use the same artwork and the same colours. The badge is still used for the
favicon, the social share image, and anywhere it can be shown large.

The header condenses once you scroll past 80px, so the logo is at its largest
exactly when someone lands on the page.

## Known limitations / next steps

- **Translations are client-side.** `src/data/translations.js` swaps text after
  the page loads, so Google only ever indexes the English version and Russian
  or Armenian searchers won't find the site. The real fix is
  [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/)
  with `/ru/` and `/hy/` pages. Coverage is also partial — tour pages,
  itineraries and the gallery are English-only.
- **Reviews.** `src/data/reviews.js` is empty and the testimonials block stays
  hidden until it isn't. Add real quotes with permission.
- **Multi-day tours.** None exist in `tours.js` yet, so that page shows a
  "booked on request" panel instead of an empty grid.
- **Vehicle pricing** in the tour price calculator uses placeholder multipliers
  (`VEHICLE_MULTIPLIERS` in `TourLayout.astro`). Replace with real numbers.
- **Legal pages** (`/privacy`, `/terms`) are drafts with `[X]` placeholders.
  Fill them in before taking deposits against them.
