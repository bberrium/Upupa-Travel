# What changed

Colours are untouched — every hex in the old `tailwind.config.mjs` is still
there. The two colours that were hard-coded in markup (`#229ED9` in the header,
`#003376`/`#fe7935` in the gallery) are now tokens with the same values.

## New files

| File | Why |
|---|---|
| `src/lib/site.js` | Phone, email, WhatsApp, socials, form endpoint in one place |
| `src/lib/assets.js` | Adds the GitHub Pages base path to local image paths |
| `src/lib/images.js` | Resolves images at build time; warns about missing/remote ones |
| `src/lib/forms.js` | Validation, submission, success/error states |
| `src/components/Picture.astro` | `<img>` with webp + width/height |
| `src/components/TourSearch.astro` | The search + grid, previously copy-pasted 3× |
| `src/components/EnquiryForm.astro` | The enquiry form, now working |
| `src/components/ReviewForm.astro` | The review form, now working |
| `src/data/reviews.js` | Real reviews go here; section hides while empty |
| `src/pages/privacy.astro`, `terms.astro`, `404.astro` | Were dead links / missing |
| `scripts/fetch-images.mjs`, `scripts/optimize-images.mjs` | Self-hosting pipeline |
| `IMAGES.md`, `README.md`, `AGENTS.md` | Real docs instead of Astro boilerplate |
| `public/robots.txt`, `public/images/placeholder.svg` | SEO + missing-image fallback |

## Rewritten

**`tailwind.config.mjs`** — `rounded-full` was 0.75rem, so nothing that should
have been a pill was one; the whole radius scale is now sane. Colour tokens
grouped and commented. Font stacks got real fallbacks. Type scale tightened
(line heights were cramped for body copy, `headline-md` was oversized at 32px).

**`src/styles/global.css`** — reusable `.btn-*`, `.panel`, `.field`, `.chip`,
`.container-page`, `.section-y`, `.font-display` classes; one keyboard focus
style site-wide; `prefers-reduced-motion` honoured; scroll-reveal rewritten so
a JS failure can no longer leave the page blank.

**`BaseLayout.astro`** — favicon (the files existed but were never linked),
Open Graph + Twitter tags, canonical URL, `TravelAgency` structured data, skip
link, `preconnect` to `fonts.gstatic.com`, Material Symbols trimmed to the axes
actually used.

**`Header.astro`** — logo 80px → 48px; dropdowns open on click and close on
Escape or click-away (hover-only menus were unusable on phones); the TOURS
button did nothing when tapped; mobile menu now closes after you tap a link and
reports `aria-expanded`; "Book a Call" renamed to "Plan Your Trip" because it
opens a form, not a call; language buttons no longer use inline `onclick`.

**`Footer.astro`** — every link was `href="#"`. Now: real tour links, real
contact details from `site.js`, legal pages that exist, copyright line. Social
links only render if you've filled in a URL.

**`SiteScripts.astro`** — language swap writes to a text node instead of
`innerText`, so elements containing icons survive it; reveal animation only
touches elements marked `.reveal`, with a 3-second safety net.

**`TourCard.astro`** — was dead code, unused. Now the real card, rendered on
the server, so tours appear in the HTML for Google and work without JS.

**`index.astro`** — one responsive category grid instead of an absolutely
positioned desktop strip plus a separate mobile copy; category cards link to
the actual tour pages instead of `#tours`; hero cut from 9 full-size images to
4; About photo is ours instead of hot-linked from another travel company;
testimonials only render when `reviews.js` has entries.

**`TourLayout.astro`** — square panels and buttons matched to the homepage's
rounded ones; custom dropdowns replaced with native `<select>` (keyboard,
screen reader, and mobile-friendly); breadcrumb; `TouristTrip` structured data;
"Not included" block and a link to the cancellation terms; approximate USD next
to AMD; reduced-motion handling for the itinerary line and price count-up.

**`gallery.astro`** — photos render server-side; local paths fixed (they were
404ing under `/Upupa-Travel/`); lightbox is a proper dialog with focus
handling; filter chips are buttons with `aria-pressed`; Unsplash stock removed.

**`day-tours.astro` / `multi-day-tours.astro`** — both now use `TourSearch`.
Multi-day shows a "booked on request" panel instead of "No tours match".

**`custom-tour.astro` / `private-transfer.astro`** — were three-line stubs.
Now: how it works, vehicle list, common routes, what's included, enquiry form.

**`tours.js` / `photos.js`** — all remote image URLs replaced with local paths.
`vanq.jpg` didn't exist. Added `approxUSD()` and `lowestPrice()`.

**`astro.config.mjs`** — sitemap integration; `SITE_URL` / `BASE_PATH` env vars
so the custom domain switch doesn't break every link.

## Images

89 MB → 5 MB. Originals were up to 6240×4160 served raw. Reorganised into
`brand/ hero/ categories/ about/ gallery/ tours/`, resized, re-encoded, with a
`.webp` beside every file. Full detail in `IMAGES.md`.

## Logo visibility

The old header used `public/images/brand/logo.png` at a fixed height. Two
things made it look small:

1. Roughly 40% of that PNG is empty transparent padding — the artwork only
   filled 363×316 of a 600×400 canvas, so half the space it was given was
   blank.
2. It is a near-square badge with the name arched around a photo. In a
   horizontal bar it can only be as tall as the bar, and at 48-80px the arched
   lettering is 4-6px tall.

What changed:

- `public/images/brand/mark.png` — the hoopoe illustration with its white
  background flood-filled away from the edges (interior white stripes intact),
  trimmed, with a `.webp` sibling.
- `public/images/brand/logo-badge.png` — the badge with its padding trimmed off.
- `src/components/Logo.astro` — the header lockup: mark + "UPUPA TRAVEL" as
  live text + "discover ARMENIA". Roughly 3x the apparent size at the same
  header height, and perfectly sharp on retina screens.
- Header is now **solid white** rather than a translucent blur, so the logo
  never sits over a scrolling photo.
- Logo height: 52px on mobile, 60px on desktop, condensing to 44/48px once you
  scroll past the hero.
- `logo.style: "badge"` in `src/lib/site.js` switches back to the full circular
  badge (68px mobile / 88px desktop) if the client prefers it.

## Mobile

- Desktop nav moves to the hamburger below 1280px now that the lockup is wider.
- Header, menu items and controls all meet the 44px minimum tap target.
- Mobile menu scrolls if it outgrows the screen, closes on tap, and closes
  itself if the window is resized to desktop width.
- Hero uses `svh` units, so the iOS address bar no longer pushes content off.
- Category cards no longer overlap the hero carousel dots on phones, and the
  photo fills the card instead of leaving a gap.
- Carousel dots have an invisible larger hit area.
- **Tour pages have a sticky bottom bar** with the live price and a "Check
  price" button — previously the calculator sat below a very long itinerary and
  was effectively invisible on a phone.
- Verified in headless Chromium at 390×844: no horizontal overflow on any page,
  no JavaScript errors.

## Still to do

- 15 tour photos are missing; the build lists them every time it runs.
- Fill in the `[X]` placeholders in `/terms`.
- Paste a form endpoint into `src/lib/site.js`.
- Add social URLs, or the footer links stay hidden.
- Translations remain client-side; see README for the i18n plan.
