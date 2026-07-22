// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { products } from './src/data/products.js';

// Products that exist locally but are not live on tangogarden.de stay out of the
// sitemap (they also carry a noindex meta tag).
const hiddenPaths = products
  .filter((p) => p.hidden)
  .map((p) => `https://tangogarden.de/products/${p.handle}/`);

export default defineConfig({
  site: 'https://tangogarden.de',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => !hiddenPaths.includes(page),
    }),
  ],
});
