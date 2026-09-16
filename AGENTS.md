# Working on this repo

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build; also prints missing-image warnings
```

## House rules

- **No remote image URLs in data files.** Everything lives in `public/images/`.
  See `IMAGES.md`. The build warns if a remote URL sneaks back in.
- **Business details go in `src/lib/site.js`**, not hard-coded into components.
- **Colours and spacing come from `tailwind.config.mjs`**, not raw hex values.
  Reusable patterns (`.btn-primary`, `.panel`, `.field`) are in
  `src/styles/global.css`.
- **Local image paths never start with `/`** — wrap them with `asset()` from
  `src/lib/assets.js`, or use the `Picture` component, so the GitHub Pages base
  path is applied.
- **Tour cards render on the server.** Don't rebuild them in a client script;
  that's what kept them out of search results.

## Documentation

- Routing and pages: https://docs.astro.build/en/guides/routing/
- Astro components: https://docs.astro.build/en/basics/astro-components/
- Styling and Tailwind: https://docs.astro.build/en/guides/styling/
- Internationalisation: https://docs.astro.build/en/guides/internationalization/
