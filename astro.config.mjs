// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { products } from './src/data/products.js';
import { noindexRoutes } from './src/data/noindex.js';

// Everything that carries a noindex meta tag must also stay out of the sitemap,
// otherwise the two send Google contradicting signals about the same URL.
//
//  - products not live on tangogarden.de
//  - the legal pages (see src/data/noindex.js)
//  - /collections, which canonicalises to /collections/all
const hiddenPaths = [
  ...products.filter((p) => p.hidden).map((p) => `/products/${p.handle}/`),
  ...noindexRoutes,
  '/collections/',
].map((path) => `https://tangogarden.de${path}`);

export default defineConfig({
  site: 'https://tangogarden.de',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    // Emit real .js and .css files instead of inlining small ones into the HTML.
    // Inlined <script> blocks cannot be allowed by `script-src 'self'`, and the
    // CSP in public/_headers would otherwise block every interaction on the
    // site — mobile nav included.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !hiddenPaths.includes(page),
    }),
  ],
});
