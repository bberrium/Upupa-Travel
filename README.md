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

