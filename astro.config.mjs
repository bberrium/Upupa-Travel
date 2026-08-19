import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://bberrium.github.io',
  base: '/Upupa-Travel/',
  integrations: [tailwind()],
});