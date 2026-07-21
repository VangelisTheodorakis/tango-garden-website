# tango-garden-website

Static website for **Tango Garden Cologne** — a 1:1 replica of the live Shopify storefront ([tangogarden.de](https://tangogarden.de)), built as plain HTML/CSS/JS with no build step. Deployable to any static host (e.g. GitHub Pages).

## Structure

- `index.html` — home page
- `pages/` — content & legal pages (`the-garden`, `start-here`, `contact`, `impressum`, `terms-of-service`, `privacy-policy`, `refund-and-cancellation-policy`, `code-of-care`, …)
- `products/` — product / class-pass pages
- `assets/` — shared `styles.css`, logo, icons
- `serve.py` — local dev server that sends no-cache headers

## Local preview

    python serve.py 3001

Then open http://localhost:3001/
