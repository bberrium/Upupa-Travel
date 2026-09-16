import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// Deploying to a custom domain (upupatravel.com)?
//   1. set SITE_URL=https://upupatravel.com
//   2. set BASE_PATH=/            <- this is the part that breaks links if missed
//   3. add a public/CNAME file containing: upupatravel.com
// GitHub Pages project sites need the /Upupa-Travel/ base; custom domains must
// not have it.
const site = process.env.SITE_URL || "https://bberrium.github.io";
const base = process.env.BASE_PATH || "/Upupa-Travel/";

export default defineConfig({
  site,
  base,
  integrations: [tailwind(), sitemap()],
  build: {
    inlineStylesheets: "auto",
  },
});
