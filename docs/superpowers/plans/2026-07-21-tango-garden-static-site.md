# Tango Garden Static Website — Production-Ready Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate tangogarden.de from Shopify to a zero-cost, production-ready Astro static site on Cloudflare Pages — preserving all SEO rankings, passing Lighthouse ≥90/95/90/100, and meeting German legal requirements.

**Architecture:** Pure static Astro 5 site (no SSR, no client framework). Self-hosted fonts (GDPR). Security headers via `_headers`. CI/CD via GitHub Actions with Lighthouse budgets. Cookie-free Cloudflare Analytics. German-language URLs with `_redirects` 301s from all Shopify paths.

**Tech Stack:** Astro 5, `@astrojs/sitemap`, `@astrojs/image`, Cloudflare Pages (free), GitHub Actions, Porkbun DNS (ALIAS at apex)

**Source of truth for design/content:** `C:\Users\vanth\Documents\ClaudePlayground\Shopify Website`

**German legal requirements:** `/impressum` (§5 TMG) and `/datenschutz` (GDPR Art. 13) are mandatory. Google Fonts CDN is an Abmahnung risk — all fonts must be self-hosted.

**Lighthouse targets (enforced by CI):**
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 90
- SEO = 100

---

## File Structure

```
tango-garden-static/
├── .github/
│   └── workflows/
│       └── ci.yml                # Build + Lighthouse CI on every PR
├── src/
│   ├── components/
│   │   ├── Header.astro          # desktop icon+text; mobile stacked logo
│   │   ├── Footer.astro          # nav, social, Impressum, WhatsApp
│   │   ├── Hero.astro            # homepage hero with H1, Astro Image
│   │   ├── PathwayCards.astro    # 3-card pricing section
│   │   ├── MetaTags.astro        # title, description, OG, canonical
│   │   └── StructuredData.astro  # JSON-LD per pageType prop
│   ├── layouts/
│   │   └── BaseLayout.astro      # html skeleton, skip link, slot
│   ├── pages/
│   │   ├── index.astro
│   │   ├── kurse/
│   │   │   ├── index.astro
│   │   │   ├── einstieg.astro
│   │   │   ├── 4-klassen.astro
│   │   │   ├── vollkurs.astro
│   │   │   └── practica.astro
│   │   ├── ueber-uns.astro
│   │   ├── kontakt.astro
│   │   ├── impressum.astro       # §5 TMG — required
│   │   ├── datenschutz.astro     # GDPR — required
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── 404.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── blog/                 # .md posts go here
│   └── styles/
│       └── global.css
├── public/
│   ├── fonts/                    # Self-hosted — no Google Fonts CDN
│   │   ├── eb-garamond-v26-latin-regular.woff2
│   │   ├── eb-garamond-v26-latin-700.woff2
│   │   ├── inter-v13-latin-regular.woff2
│   │   └── inter-v13-latin-600.woff2
│   ├── images/
│   │   ├── hero-dancers.jpg
│   │   ├── logo-stacked.svg
│   │   ├── logo-icon.svg
│   │   └── og-image.jpg          # 1200×630 social sharing image
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── apple-touch-icon.png  # 180×180
│   │   └── icon-192.png          # 192×192 for manifest
│   ├── site.webmanifest
│   ├── robots.txt
│   ├── _headers                  # Cloudflare Pages security headers
│   └── _redirects                # Cloudflare Pages 301s from Shopify URLs
├── lighthouserc.json
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Task 1: Project Scaffold and GitHub Setup

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`

- [ ] **Step 1: Scaffold Astro project**

```bash
cd "C:\Users\vanth\Documents\ClaudePlayground"
npm create astro@latest "Tango Garden Static Website" -- --template minimal --typescript strict --no-git --install
cd "Tango Garden Static Website"
```

- [ ] **Step 2: Install integrations**

```bash
npx astro add sitemap --yes
npm install --save-dev @lhci/cli
```

- [ ] **Step 3: Configure `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tangogarden.de',
  integrations: [sitemap()],
  output: 'static',
  image: {
    domains: [],
    remotePatterns: [],
  },
});
```

- [ ] **Step 4: Verify clean build**

```bash
npm run build
```

Expected: `dist/` created, no errors.

- [ ] **Step 5: Initialise Git and push**

```bash
git init
git add .
git commit -m "feat: scaffold Astro 5 static site"
git remote add origin https://github.com/VangelisTheodorakis/tangogarden-static.git
git push -u origin main
```

---

## Task 2: Self-Hosted Fonts (GDPR Compliance)

**Files:**
- Create: `public/fonts/` (4 woff2 files)
- Create: `src/styles/global.css`

Using Google Fonts CDN is illegal in Germany without a cookie banner — courts have issued fines for IP addresses being sent to Google servers. Fonts must be downloaded and served from the same origin.

- [ ] **Step 1: Download EB Garamond (heading font)**

```powershell
$base = "https://fonts.gstatic.com/s/ebgaramond/v26/SlGDmQSNjdsmc35JDF1K5GRwSDo_ZikWI25I.woff2"
Invoke-WebRequest -Uri $base -OutFile "public\fonts\eb-garamond-v26-latin-regular.woff2"

$bold = "https://fonts.gstatic.com/s/ebgaramond/v26/SlGFmQSNjdsmc35JDF1K5E55ZMCowrs1SO8x.woff2"
Invoke-WebRequest -Uri $bold -OutFile "public\fonts\eb-garamond-v26-latin-700.woff2"
```

> **Verify font URLs:** Go to https://fonts.google.com/specimen/EB+Garamond, click "Get embed code", select woff2, copy the direct `fonts.gstatic.com` URLs for `regular` and `700`. Update the URLs above if they differ.

- [ ] **Step 2: Download Inter (body font)**

```powershell
$inter = "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
Invoke-WebRequest -Uri $inter -OutFile "public\fonts\inter-v13-latin-regular.woff2"

$inter600 = "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2"
Invoke-WebRequest -Uri $inter600 -OutFile "public\fonts\inter-v13-latin-600.woff2"
```

> **Alternative:** If the Shopify theme uses different fonts, check `C:\Users\vanth\Documents\ClaudePlayground\Shopify Website\config\settings_data.json` for the `type_header_font` and `type_body_font` values. Download those instead and update the CSS below.

- [ ] **Step 3: Create `src/styles/global.css`**

```css
/* ── Self-hosted fonts ──────────────────────────────────── */
@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/eb-garamond-v26-latin-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'EB Garamond';
  src: url('/fonts/eb-garamond-v26-latin-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-v13-latin-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-v13-latin-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* ── Colour tokens ──────────────────────────────────────── */
:root {
  --color-primary: #4e5d22;
  --color-primary-dark: #3d6b1f;
  --color-primary-shadow: rgba(45, 80, 22, 0.2);
  --color-cream: #f3ede1;
  --color-cream-light: #f9f7f2;
  --color-text: #1a1a1a;
  --color-text-muted: #555;
  --color-border: rgba(45, 80, 22, 0.12);
  --color-white: #fff;

  /* ── Typography ──────────────────────────────────────── */
  --font-heading: 'EB Garamond', Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  /* ── Layout ──────────────────────────────────────────── */
  --max-width: 1200px;
  --header-height: 72px;
}

/* ── Reset ───────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img, svg { display: block; max-width: 100%; }
h1, h2, h3, h4 { font-family: var(--font-heading); line-height: 1.2; }
a { color: inherit; }

/* ── Focus styles (WCAG 2.4.7) ──────────────────────────── */
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: 2px;
}
```

- [ ] **Step 4: Commit**

```bash
git add public/fonts/ src/styles/global.css
git commit -m "feat: self-host EB Garamond and Inter fonts for GDPR compliance"
```

---

## Task 3: Base Layout, MetaTags, StructuredData, and Favicon Set

**Files:**
- Create: `src/components/MetaTags.astro`
- Create: `src/components/StructuredData.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/site.webmanifest`
- Add: `public/icons/` (favicon.ico, apple-touch-icon.png, icon-192.png)

- [ ] **Step 1: Create favicon assets**

Generate from the logo-icon.svg. Open https://realfavicongenerator.net, upload `logo-icon.svg`, download the package, then copy:
- `favicon.ico` → `public/icons/favicon.ico`
- `apple-touch-icon.png` → `public/icons/apple-touch-icon.png`
- `favicon-192x192.png` → `public/icons/icon-192.png`

- [ ] **Step 2: Create `public/site.webmanifest`**

```json
{
  "name": "Tango Garden Cologne",
  "short_name": "Tango Garden",
  "description": "Argentine tango classes in Cologne. Beginners welcome.",
  "start_url": "/",
  "display": "browser",
  "background_color": "#f3ede1",
  "theme_color": "#4e5d22",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```

- [ ] **Step 3: Create `src/components/MetaTags.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}
const {
  title,
  description,
  canonical = Astro.url.href,
  ogImage = 'https://tangogarden.de/images/og-image.jpg',
  noindex = false,
} = Astro.props;
const fullTitle = title.includes('Tango Garden') ? title : `${title} – Tango Garden`;
---
<title>{fullTitle}</title>
<meta name="description" content={description} />
{noindex && <meta name="robots" content="noindex, nofollow" />}
<link rel="canonical" href={canonical} />

<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#4e5d22" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="de_DE" />
<meta property="og:site_name" content="Tango Garden Cologne" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

- [ ] **Step 4: Create `src/components/StructuredData.astro`**

```astro
---
interface Props {
  type: 'home' | 'trial' | 'four_class' | 'full_course' | 'practica' | 'none';
}
const { type } = Astro.props;

const businessBase = {
  name: 'Tango Garden Cologne',
  url: 'https://tangogarden.de',
  sameAs: [
    'https://www.instagram.com/tangogardencologne',
    'https://www.facebook.com/tangogardencologne/',
  ],
};
const address = {
  '@type': 'PostalAddress',
  streetAddress: 'Thürmchenswall 21',
  postalCode: '50668',
  addressLocality: 'Köln',
  addressRegion: 'NRW',
  addressCountry: 'DE',
};
const location = { '@type': 'Place', name: 'Tango Garden Cologne', address };

const homeSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'SportsActivityLocation'],
  '@id': 'https://tangogarden.de/#localbusiness',
  ...businessBase,
  image: 'https://tangogarden.de/images/og-image.jpg',
  telephone: '+49 160 2368723',
  email: 'hello@tangogarden.de',
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  address,
  geo: { '@type': 'GeoCoordinates', latitude: 50.9501585, longitude: 6.9535692 },
});

const makeOffer = (name: string, price: string) => ({
  '@type': 'Offer',
  name,
  price,
  priceCurrency: 'EUR',
  category: 'Paid',
  availability: 'https://schema.org/InStock',
});

const courseSchemas: Record<string, object> = {
  trial: {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: '1-Class Trial: Try a Tango Class in Cologne',
    description: 'One-time trial Argentine tango class in Cologne. No partner or experience needed.',
    provider: { '@type': 'LocalBusiness', ...businessBase },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Onsite', location },
    offers: [makeOffer('General Admission', '18.00'), makeOffer('Student / Under-28', '15.00')],
  },
  four_class: {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: '4-Class Intro Pass: Tango Classes Cologne',
    description: 'Four-class beginner block for learning Argentine tango in Cologne. No partner needed.',
    provider: { '@type': 'LocalBusiness', ...businessBase },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Onsite', location },
    offers: [makeOffer('General Admission', '60.00'), makeOffer('Student / Under-28', '45.00')],
  },
  full_course: {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Full Beginner Course: Tango Course Cologne',
    description: 'Full Argentine tango beginner course in Cologne. No partner or prior experience required.',
    provider: { '@type': 'LocalBusiness', ...businessBase },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Onsite', location },
    offers: [makeOffer('General Admission', '130.00'), makeOffer('Student / Under-28', '100.00')],
  },
  practica: {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Drop-In Practice: Tango Practica Cologne',
    description: 'Open-level drop-in Argentine tango practica in Cologne. All levels welcome, no partner needed.',
    provider: { '@type': 'LocalBusiness', ...businessBase },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      courseWorkload: 'Drop-in, no enrollment required',
      location,
    },
    offers: [makeOffer('General Admission', '10.00'), makeOffer('Student / Under-28', '8.00')],
  },
};
---
{type === 'home' && <script type="application/ld+json" set:html={homeSchema} />}
{type !== 'home' && type !== 'none' && (
  <script type="application/ld+json" set:html={JSON.stringify(courseSchemas[type])} />
)}
```

- [ ] **Step 5: Create `src/layouts/BaseLayout.astro`**

```astro
---
import MetaTags from '../components/MetaTags.astro';
import StructuredData from '../components/StructuredData.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  pageType?: 'home' | 'trial' | 'four_class' | 'full_course' | 'practica' | 'none';
  canonical?: string;
  noindex?: boolean;
}
const { title, description, pageType = 'none', canonical, noindex } = Astro.props;
---
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/eb-garamond-v26-latin-regular.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/inter-v13-latin-regular.woff2" as="font" type="font/woff2" crossorigin />
  <MetaTags title={title} description={description} canonical={canonical} noindex={noindex} />
  <StructuredData type={pageType} />
</head>
<body>
  <!-- Skip link — required for WCAG 2.4.1 -->
  <a href="#main-content" class="skip-link">Zum Inhalt springen</a>
  <Header />
  <main id="main-content" tabindex="-1">
    <slot />
  </main>
  <Footer />
</body>
</html>

<style is:global>
  .skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    background: var(--color-primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0 0 6px 6px;
    font-weight: 600;
    text-decoration: none;
    z-index: 9999;
    transition: top 0.1s;
  }
  .skip-link:focus { top: 0; }
  #main-content:focus { outline: none; }
</style>
```

- [ ] **Step 6: Build verification**

```bash
npm run build
```

Expected: No errors. `dist/site.webmanifest` exists.

- [ ] **Step 7: Commit**

```bash
git add src/ public/icons/ public/site.webmanifest
git commit -m "feat: base layout with MetaTags, StructuredData, skip link, favicon set"
```

---

## Task 4: Security Headers

**Files:**
- Create: `public/_headers`

Cloudflare Pages reads `_headers` from the build output root and applies them to every response.

- [ ] **Step 1: Create `public/_headers`**

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none';

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=86400

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

> **Note on `style-src 'unsafe-inline'`:** Astro's scoped `<style>` blocks emit inline styles. This is acceptable for a static marketing site. If CSP strictness is needed later, migrate styles to external `.css` files and remove `'unsafe-inline'`.

- [ ] **Step 2: Build and verify header file is in dist**

```bash
npm run build
cat dist/_headers
```

Expected: File exists with the correct content.

- [ ] **Step 3: Commit**

```bash
git add public/_headers
git commit -m "feat: security headers via Cloudflare Pages _headers"
```

---

## Task 5: Header Component

**Files:**
- Create: `src/components/Header.astro`

Desktop: icon SVG (`logo-icon.svg`) + "Tango Garden" text in `#4b5925`. Mobile: full stacked logo. Breakpoint: 750px. Sticky, scrolls up with user.

- [ ] **Step 1: Copy logo assets from Shopify theme**

```powershell
Copy-Item "C:\Users\vanth\Documents\ClaudePlayground\Shopify Website\assets\logo-icon.svg" `
  "C:\Users\vanth\Documents\ClaudePlayground\Tango Garden Static Website\public\images\logo-icon.svg"
```

Locate the stacked logo SVG (filename contains `green_text_logo`) in the Shopify assets folder and copy to `public/images/logo-stacked.svg`.

- [ ] **Step 2: Create `src/components/Header.astro`**

```astro
---
const navLinks = [
  { href: '/kurse/', label: 'Kurse' },
  { href: '/ueber-uns', label: 'Über uns' },
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/blog/', label: 'Blog' },
];
const current = Astro.url.pathname;
---
<header class="site-header" role="banner">
  <div class="header-inner">
    <a href="/" class="header-logo" aria-label="Tango Garden – Zurück zur Startseite">
      <span class="logo-desktop" aria-hidden="true">
        <img src="/images/logo-icon.svg" alt="" width="36" height="36" class="logo-icon" />
        <span class="logo-text">Tango Garden</span>
      </span>
      <img src="/images/logo-stacked.svg" alt="Tango Garden" width="120" height="60"
           class="logo-mobile" />
    </a>

    <nav aria-label="Hauptnavigation" class="header-nav">
      <ul role="list">
        {navLinks.map(({ href, label }) => (
          <li>
            <a href={href}
               class:list={['nav-link', { active: current === href || current.startsWith(href) && href !== '/' }]}
               aria-current={current === href ? 'page' : undefined}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>

    <button class="nav-toggle" aria-label="Navigationsmenü öffnen"
            aria-expanded="false" aria-controls="mobile-nav">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </div>

  <nav id="mobile-nav" class="mobile-nav" hidden aria-label="Mobile Navigation">
    <ul role="list">
      {navLinks.map(({ href, label }) => (
        <li><a href={href}>{label}</a></li>
      ))}
    </ul>
  </nav>
</header>

<style>
  .site-header {
    position: sticky; top: 0; z-index: 100;
    background: white;
    border-bottom: 1px solid var(--color-border);
  }
  .header-inner {
    max-width: var(--max-width); margin: 0 auto;
    padding: 0 1.5rem; height: var(--header-height);
    display: flex; align-items: center; justify-content: space-between;
  }
  .header-logo { text-decoration: none; display: flex; align-items: center; }
  .logo-desktop { display: none; align-items: center; gap: 0.75rem; }
  .logo-icon { width: 36px; height: auto; flex-shrink: 0; }
  .logo-text {
    font-family: var(--font-heading); font-size: 1.5rem;
    font-weight: 700; color: #4b5925; white-space: nowrap; line-height: 1;
  }
  .logo-mobile { display: block; }
  @media (min-width: 750px) {
    .logo-desktop { display: flex; }
    .logo-mobile { display: none; }
  }
  .header-nav ul { display: flex; gap: 2rem; list-style: none; }
  .nav-link {
    font-size: 0.95rem; font-weight: 500; text-decoration: none;
    color: var(--color-text); transition: color 0.2s; padding: 0.25rem 0;
    border-bottom: 2px solid transparent;
  }
  .nav-link:hover { color: var(--color-primary); }
  .nav-link.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
  .nav-toggle { display: none; background: none; border: none; cursor: pointer; padding: 0.5rem; color: var(--color-text); }
  @media (max-width: 749px) {
    .header-nav { display: none; }
    .nav-toggle { display: flex; }
  }
  .mobile-nav {
    border-top: 1px solid var(--color-border);
    background: white; padding: 1rem 1.5rem;
  }
  .mobile-nav ul { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
  .mobile-nav a { font-size: 1.1rem; font-weight: 500; text-decoration: none; color: var(--color-text); display: block; padding: 0.25rem 0; }
  .mobile-nav a:hover { color: var(--color-primary); }
</style>

<script>
  const btn = document.querySelector('.nav-toggle') as HTMLButtonElement | null;
  const nav = document.getElementById('mobile-nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.setAttribute('aria-label', open ? 'Navigationsmenü öffnen' : 'Navigationsmenü schließen');
      nav.hidden = open;
    });
  }
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro public/images/
git commit -m "feat: responsive Header with accessible mobile nav toggle"
```

---

## Task 6: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-brand">
      <p class="footer-name">Tango Garden Cologne</p>
      <address class="footer-address">
        Thürmchenswall 21<br />50668 Köln
      </address>
      <div class="footer-contact">
        <a href="https://wa.me/491602368723?text=Hi!%20Ich%20habe%20eine%20Frage."
           class="footer-link" rel="noopener noreferrer" target="_blank">💬 WhatsApp</a>
        <a href="mailto:hello@tangogarden.de" class="footer-link">hello@tangogarden.de</a>
      </div>
    </div>

    <nav aria-label="Kurse">
      <h3 class="footer-heading">Kurse</h3>
      <ul role="list" class="footer-links">
        <li><a href="/kurse/einstieg">Einstiegsstunde</a></li>
        <li><a href="/kurse/4-klassen">4-Klassen-Pass</a></li>
        <li><a href="/kurse/vollkurs">Vollkurs</a></li>
        <li><a href="/kurse/practica">Practica</a></li>
      </ul>
    </nav>

    <nav aria-label="Studio">
      <h3 class="footer-heading">Studio</h3>
      <ul role="list" class="footer-links">
        <li><a href="/ueber-uns">Über uns</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/kontakt">Kontakt</a></li>
        <li><a href="/impressum">Impressum</a></li>
        <li><a href="/datenschutz">Datenschutz</a></li>
      </ul>
    </nav>

    <div class="footer-social">
      <h3 class="footer-heading">Folgt uns</h3>
      <div class="social-row">
        <a href="https://www.instagram.com/tangogardencologne" target="_blank"
           rel="noopener noreferrer" aria-label="Tango Garden auf Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/tangogardencologne/" target="_blank"
           rel="noopener noreferrer" aria-label="Tango Garden auf Facebook">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <p>© {year} Tango Garden Cologne</p>
  </div>
</footer>

<style>
  .site-footer { background: var(--color-primary); color: rgba(255,255,255,0.85); margin-top: 5rem; }
  .footer-inner {
    max-width: var(--max-width); margin: 0 auto; padding: 3rem 1.5rem;
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem;
  }
  @media (max-width: 768px) { .footer-inner { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 480px) { .footer-inner { grid-template-columns: 1fr; } }
  .footer-name { font-weight: 700; font-size: 1.05rem; color: white; margin-bottom: 0.5rem; }
  .footer-address { font-style: normal; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem; }
  .footer-contact { display: flex; flex-direction: column; gap: 0.4rem; }
  .footer-link { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 0.9rem; }
  .footer-link:hover { color: white; text-decoration: underline; }
  .footer-heading { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.5); margin-bottom: 1rem; font-family: var(--font-body); font-weight: 600; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
  .footer-links a { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 0.9rem; }
  .footer-links a:hover { color: white; text-decoration: underline; }
  .social-row { display: flex; gap: 1rem; }
  .social-row a { color: rgba(255,255,255,0.85); transition: color 0.2s; }
  .social-row a:hover { color: white; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); text-align: center; padding: 1rem; font-size: 0.8rem; color: rgba(255,255,255,0.4); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: Footer with accessible nav, social SVGs, legal links"
```

---

## Task 7: Homepage — Hero with Image Optimization

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/pages/index.astro`
- Add: `public/images/hero-dancers.jpg`

H1 is fixed: "Stop Scrolling. Start Connecting. Argentine Tango Classes in Cologne". Mobile font must be `4.9vw` to prevent "Cologne" orphaning to a third line.

- [ ] **Step 1: Download hero image locally**

```powershell
$url = "https://tangogarden.de/cdn/shop/files/20240513-_SON6700-Poprawione-Szum_8c3f660e-faf8-42a8-9825-fe3805f1442d.png?width=1200"
Invoke-WebRequest -Uri $url -OutFile "public\images\hero-dancers.jpg"
```

- [ ] **Step 2: Create OG image**

The hero image also serves as the OG image. Copy it:

```powershell
Copy-Item "public\images\hero-dancers.jpg" "public\images\og-image.jpg"
```

If the image is not 1200×630, crop it to that ratio using any image editor before copying.

- [ ] **Step 3: Create `src/components/Hero.astro`**

```astro
---
---
<section class="hero" aria-label="Einleitung">
  <div class="hero-image-wrapper">
    <img
      src="/images/hero-dancers.jpg"
      alt="Tanzpaar beim Argentinischen Tango in Köln"
      class="hero-image"
      width="1200"
      height="800"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    />
    <div class="hero-overlay" aria-hidden="true"></div>
  </div>

  <div class="hero-content">
    <h1 class="hero-heading">
      Stop Scrolling. Start Connecting.<br />
      Argentine Tango Classes in Cologne
    </h1>
    <p class="hero-sub">Kein Vorwissen. Keine Partnerin nötig.</p>
    <div class="hero-ctas">
      <a href="/kurse/" class="btn btn-primary">Kurse entdecken</a>
      <a href="https://wa.me/491602368723?text=Hi!%20Ich%20m%C3%B6chte%20mehr%20%C3%BCber%20eure%20Tangokurse%20wissen."
         class="btn btn-ghost" rel="noopener noreferrer" target="_blank">
        💬 WhatsApp
      </a>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative; width: 100%;
    min-height: calc(100vh - var(--header-height));
    display: flex; align-items: flex-end; padding-bottom: 4rem;
    overflow: hidden;
  }
  .hero-image-wrapper { position: absolute; inset: 0; z-index: 0; }
  .hero-image { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 55%, transparent 100%);
  }
  .hero-content {
    position: relative; z-index: 1;
    max-width: var(--max-width); width: 100%;
    margin: 0 auto; padding: 0 1.5rem;
  }
  .hero-heading {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 4vw, 3.5rem);
    font-weight: 700; color: white; line-height: 1.15;
    margin-bottom: 1rem; max-width: 680px;
  }
  @media (max-width: 768px) { .hero-heading { font-size: 4.9vw; } }
  @media (max-width: 540px) { .hero-heading { font-size: 7.5vw; } }
  .hero-sub { font-size: 1.05rem; color: rgba(255,255,255,0.88); margin-bottom: 2rem; }
  .hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn {
    display: inline-block; padding: 0.875rem 1.75rem; border-radius: 8px;
    font-weight: 600; font-size: 0.95rem; text-decoration: none;
    transition: all 0.2s ease; min-height: 44px; /* WCAG touch target */
  }
  .btn-primary { background: var(--color-primary); color: white; }
  .btn-primary:hover { background: var(--color-primary-dark); transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.8); }
  .btn-ghost:hover { background: white; color: var(--color-primary); }
</style>
```

- [ ] **Step 4: Create `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import PathwayCards from '../components/PathwayCards.astro';
---
<BaseLayout
  title="Tango Garden Cologne — Argentine Tango Classes in Cologne"
  description="Join Tango Garden for Argentine tango classes in Cologne. Beginners welcome, no partner needed. Classes starting September in Köln."
  pageType="home"
>
  <Hero />
  <PathwayCards />
</BaseLayout>
```

- [ ] **Step 5: Build and manually verify at 375px, 768px, 1366px**

```bash
npm run dev
```

Open `http://localhost:4321`. At 375px: H1 must fit 2 lines — "Cologne" must not be alone on a third line.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro public/images/
git commit -m "feat: homepage Hero — H1, CTA buttons, optimised hero image"
```

---

## Task 8: Homepage — Pathway Cards

**Files:**
- Create: `src/components/PathwayCards.astro`

- [ ] **Step 1: Create `src/components/PathwayCards.astro`**

```astro
---
const cards = [
  {
    icon: '🌿',
    title: 'Enter the Garden',
    description: 'Dein erster Schritt. Keine Vorerfahrung, kein Partner nötig — einfach kommen.',
    features: ['Einmalige 1-Stunden-Session', 'Neue Menschen kennenlernen', 'Draußen im Park'],
    dateLabel: 'Nächstes Event',
    dateValue: '01.08.2026 · genaue Uhrzeit folgt diese Woche',
    price: 'Free',
    btn: { text: 'Ich komme →', href: '/kontakt' },
    featured: false,
  },
  {
    icon: '🌱',
    title: 'Regular Classes',
    description: 'Wöchentliche Anfängerkurse — strukturiert, gesellig und herzlich.',
    features: ['Wöchentliche Gruppenklassen', 'Kein Partner nötig', 'Anfängerfreundliches Curriculum'],
    dateLabel: 'Nächste Klasse',
    dateValue: 'Ab September · genaue Termine folgen',
    price: 'From €13 or €10/class *',
    btn: { text: 'Kursoptionen ansehen →', href: '/kurse/' },
    secondaryBtn: { text: '💬 Per WhatsApp fragen', href: 'https://wa.me/491602368723?text=Hi!%20Ich%20interessiere%20mich%20f%C3%BCr%20eure%20Tangokurse.' },
    featured: true,
  },
  {
    icon: '🌸',
    title: 'Drop-In Practica',
    description: 'Schon mal getanzt? Komm zu unserer offenen Übungsstunde.',
    features: ['Alle Level willkommen', 'Keine Anmeldung nötig', 'Geführte Praxisstunde'],
    dateLabel: 'Nächste Practica',
    dateValue: 'Termine folgen',
    price: '€10 or €8 *',
    btn: { text: 'Mehr erfahren →', href: '/kurse/practica' },
    featured: false,
  },
] as const;
---
<section id="three-ways-to-enter" class="pathway-section" aria-labelledby="pathway-heading">
  <div class="pathway-inner">
    <div class="pathway-header">
      <p class="eyebrow" aria-hidden="true">How to Start</p>
      <h2 id="pathway-heading">Three Ways to Enter the Garden</h2>
      <p class="subheading">Choose what feels right for where you are.</p>
    </div>

    <div class="cards-grid" role="list">
      {cards.map((card, i) => (
        <article class:list={['card', { featured: card.featured }]} role="listitem">
          <div class="card-number" aria-hidden="true">{i + 1}</div>
          <div class="card-icon" aria-hidden="true">{card.icon}</div>
          <h3>{card.title}</h3>
          <p class="card-desc">{card.description}</p>
          <ul class="card-features" aria-label={`${card.title} Merkmale`}>
            {card.features.map(f => <li>{f}</li>)}
          </ul>
          <div class="card-date" aria-label={`${card.dateLabel}: ${card.dateValue}`}>
            <span aria-hidden="true">🗓️</span>
            <div>
              <span class="date-label">{card.dateLabel}</span>
              <span class="date-value">{card.dateValue}</span>
            </div>
          </div>
          <div class="card-price-area">
            <p class:list={['card-price', { featured: card.featured }]}>{card.price}</p>
            <div class="card-actions">
              <a href={card.btn.href} class:list={['card-btn', 'primary', { 'on-featured': card.featured }]}>
                {card.btn.text}
              </a>
              {'secondaryBtn' in card && card.secondaryBtn && (
                <a href={card.secondaryBtn.href} class="card-btn secondary"
                   target="_blank" rel="noopener noreferrer">
                  {card.secondaryBtn.text}
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>

    <p class="footnote">* für Studierende und Personen bis 28 Jahre</p>

    <div class="help-banner" aria-labelledby="help-heading">
      <h3 id="help-heading">Still wandering?</h3>
      <p>Jeder Tänzer startet anders. Wenn du unsicher bist, wo du anfängst — wir helfen dir persönlich weiter.</p>
      <div class="help-actions">
        <a href="/kurse/" class="help-btn outline">📋 Alle Details ansehen</a>
        <a href="https://wa.me/491602368723?text=Hi!%20Ich%20bin%20mir%20nicht%20sicher%2C%20welche%20Option%20zu%20mir%20passt..."
           class="help-btn filled" target="_blank" rel="noopener noreferrer">💬 Chat on WhatsApp</a>
      </div>
    </div>
  </div>
</section>

<style>
  .pathway-section { background: white; padding: 5rem 1.5rem; }
  .pathway-inner { max-width: var(--max-width); margin: 0 auto; }
  .pathway-header { text-align: center; margin-bottom: 4rem; }
  .eyebrow { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: var(--color-primary); font-weight: 600; margin-bottom: 0.75rem; }
  .pathway-header h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); color: var(--color-primary); margin-bottom: 1rem; }
  .subheading { font-size: 1.1rem; color: var(--color-text-muted); max-width: 600px; margin: 0 auto; }
  .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; margin-bottom: 1.5rem; }
  @media (max-width: 968px) { .cards-grid { grid-template-columns: 1fr; } }
  .card {
    position: relative; background: var(--color-cream); border-radius: 16px;
    padding: 2.5rem 2rem; text-align: center;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .card.featured {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    box-shadow: 0 10px 40px var(--color-primary-shadow);
  }
  .card-number {
    position: absolute; top: -10px; right: -10px;
    width: 70px; height: 70px; border-radius: 50%;
    font-size: 2.5rem; font-weight: 700; color: rgba(45,80,22,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .card.featured .card-number { color: rgba(255,255,255,0.12); }
  .card-icon {
    width: 70px; height: 70px; background: white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; margin: 0 auto 1.5rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  }
  .card.featured .card-icon { background: rgba(255,255,255,0.15); }
  .card h3 { font-size: 1.4rem; color: var(--color-primary); font-weight: 700; margin-bottom: 0.75rem; }
  .card.featured h3 { color: white; }
  .card-desc { font-size: 0.95rem; line-height: 1.7; color: var(--color-text-muted); margin-bottom: 1.5rem; }
  .card.featured .card-desc { color: rgba(255,255,255,0.88); }
  .card-features {
    list-style: none; text-align: left; margin-bottom: 1.5rem;
    display: flex; flex-direction: column; gap: 0.6rem;
  }
  .card-features li {
    font-size: 0.875rem; color: #555; padding-left: 1.5rem; position: relative;
  }
  .card-features li::before { content: '✓'; position: absolute; left: 0; color: var(--color-primary); font-weight: 700; }
  .card.featured .card-features li { color: rgba(255,255,255,0.9); }
  .card.featured .card-features li::before { color: white; }
  .card-date {
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(45,80,22,0.05); border-radius: 8px;
    padding: 0.75rem; margin-bottom: 1.5rem; text-align: left;
  }
  .card.featured .card-date { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }
  .date-label { display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--color-primary); font-weight: 700; }
  .card.featured .date-label { color: rgba(255,255,255,0.75); }
  .date-value { display: block; font-size: 0.875rem; font-weight: 600; color: var(--color-primary); }
  .card.featured .date-value { color: white; }
  .card-price-area {
    border-top: 2px solid rgba(45,80,22,0.1); padding-top: 1.25rem;
    margin-top: auto; display: flex; flex-direction: column;
  }
  .card.featured .card-price-area { border-top-color: rgba(255,255,255,0.2); }
  .card-price { font-size: 1.9rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem; line-height: 1.1; }
  .card.featured .card-price { color: white; }
  /* Prevent "From €13 or €10/class *" wrapping — font shrinks on desktop */
  @media (min-width: 481px) { .card-price.featured { font-size: 1.5rem; } }
  @media (max-width: 480px) { .card-price { font-size: 1rem !important; } }
  .card-actions { display: flex; flex-direction: column; gap: 0.75rem; }
  .card-btn {
    display: block; padding: 0.875rem 1.25rem; border-radius: 8px;
    text-decoration: none; font-weight: 600; font-size: 0.9rem;
    transition: all 0.2s; min-height: 44px; /* WCAG touch target */
    display: flex; align-items: center; justify-content: center;
  }
  .card-btn.primary { background: white; color: var(--color-primary); border: 2px solid var(--color-primary); }
  .card-btn.primary.on-featured { border-color: transparent; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
  .card-btn.secondary { background: transparent; color: white; border: 2px solid white; }
  .card-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .footnote { text-align: center; font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 2.5rem; }
  .help-banner {
    background: var(--color-cream-light); border: 1px solid var(--color-border);
    border-radius: 20px; padding: 3rem 2rem; text-align: center;
  }
  .help-banner h3 { font-size: 1.3rem; color: var(--color-primary); margin-bottom: 0.75rem; }
  .help-banner p { font-size: 0.95rem; color: var(--color-text-muted); max-width: 480px; margin: 0 auto 1.75rem; line-height: 1.6; }
  .help-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .help-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1.5rem; border-radius: 30px; font-weight: 600;
    font-size: 0.9rem; text-decoration: none; transition: all 0.2s;
    min-height: 44px;
  }
  .help-btn.outline { background: rgba(45,80,22,0.05); border: 1px solid var(--color-border); color: var(--color-primary); }
  .help-btn.outline:hover { background: rgba(45,80,22,0.1); }
  .help-btn.filled { background: var(--color-primary); color: white; box-shadow: 0 4px 12px var(--color-primary-shadow); }
  .help-btn.filled:hover { background: var(--color-primary-dark); transform: translateY(-2px); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PathwayCards.astro
git commit -m "feat: PathwayCards with 3-column layout, ARIA roles, WCAG touch targets"
```

---

## Task 9: Class Detail Pages

**Files:**
- Create: `src/pages/kurse/index.astro`
- Create: `src/pages/kurse/einstieg.astro`
- Create: `src/pages/kurse/4-klassen.astro`
- Create: `src/pages/kurse/vollkurs.astro`
- Create: `src/pages/kurse/practica.astro`

- [ ] **Step 1: Create `src/pages/kurse/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
const courses = [
  { href: '/kurse/einstieg', title: 'Einstiegsstunde', desc: 'Einmalige Probestunde. Kein Vorwissen. Kein Partner nötig.', price: '€18 · Ermäßigt €15' },
  { href: '/kurse/4-klassen', title: '4-Klassen-Einführungspass', desc: 'Vier Klassen Block für Anfänger.', price: '€60 · Ermäßigt €45' },
  { href: '/kurse/vollkurs', title: 'Vollkurs Anfänger', desc: 'Das komplette Fundament — alle Einheiten in einem Pass.', price: '€130 · Ermäßigt €100' },
  { href: '/kurse/practica', title: 'Drop-In Practica', desc: 'Offene Übungsstunde für alle Level. Kein Eintrag nötig.', price: '€10 · Ermäßigt €8' },
];
---
<BaseLayout
  title="Tangokurse in Köln — Tango Garden"
  description="Argentine Tango Kurse für Anfänger in Köln. Einstiegsstunden, Kurspässe und offene Practica. Kein Partner nötig."
>
  <section class="page-hero" aria-label="Seiteneinleitung">
    <div class="container">
      <h1>Tangokurse in Köln</h1>
      <p>Wähle den Einstieg, der zu dir passt.</p>
    </div>
  </section>
  <section class="courses" aria-label="Kursübersicht">
    <div class="container">
      <ul class="course-list" role="list">
        {courses.map(c => (
          <li>
            <a href={c.href} class="course-card">
              <h2>{c.title}</h2>
              <p>{c.desc}</p>
              <span class="price">{c.price}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
</BaseLayout>

<style>
  .page-hero { background: var(--color-primary); color: white; padding: 5rem 1.5rem; text-align: center; }
  .page-hero h1 { font-size: clamp(1.75rem, 5vw, 3.5rem); margin-bottom: 1rem; }
  .page-hero p { font-size: 1.15rem; opacity: 0.85; }
  .container { max-width: var(--max-width); margin: 0 auto; }
  .courses { padding: 4rem 1.5rem; }
  .course-list { list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  @media (max-width: 600px) { .course-list { grid-template-columns: 1fr; } }
  .course-card {
    display: block; background: var(--color-cream); border-radius: 12px; padding: 2rem;
    text-decoration: none; color: var(--color-text); border: 2px solid transparent;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  }
  .course-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); border-color: var(--color-primary); }
  .course-card h2 { font-size: 1.2rem; color: var(--color-primary); margin-bottom: 0.5rem; }
  .course-card p { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1rem; line-height: 1.6; }
  .price { font-size: 0.9rem; font-weight: 700; color: var(--color-primary); }
</style>
```

- [ ] **Step 2: Create the 4 course detail pages**

Each follows the same structure. Create all four files — differ only in `title`, `description`, `pageType`, heading, lead text, and prices.

**`src/pages/kurse/einstieg.astro`:**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Einstiegsstunde Argentinischer Tango Köln"
  description="Probiere argentinischen Tango in Köln. Einmalige Probestunde, kein Vorwissen, kein Partner nötig. €18 / Ermäßigt €15."
  pageType="trial"
>
  <article class="course-page">
    <div class="container">
      <nav aria-label="Breadcrumb">
        <ol class="breadcrumb" role="list">
          <li><a href="/">Startseite</a></li>
          <li aria-hidden="true">›</li>
          <li><a href="/kurse/">Kurse</a></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">Einstiegsstunde</li>
        </ol>
      </nav>
      <h1>Einstiegsstunde: Probiere einen Tangokurs in Köln</h1>
      <p class="lead">Einmalige Probestunde. Kein Vorwissen. Kein Partner nötig.</p>
      <div class="price-block">
        <span class="price-main">€18</span>
        <span class="price-reduced">Ermäßigt (Studenten / unter 28) €15</span>
      </div>
      <a href="https://wa.me/491602368723?text=Hi!%20Ich%20m%C3%B6chte%20die%20Einstiegsstunde%20buchen."
         class="cta" target="_blank" rel="noopener noreferrer">
        💬 Platz reservieren via WhatsApp
      </a>
    </div>
  </article>
</BaseLayout>

<style>
  .course-page { padding: 3rem 1.5rem 5rem; }
  .container { max-width: 760px; margin: 0 auto; }
  .breadcrumb { list-style: none; display: flex; gap: 0.5rem; font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 2rem; flex-wrap: wrap; }
  .breadcrumb a { color: var(--color-primary); text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }
  h1 { font-size: clamp(1.5rem, 4vw, 2.5rem); color: var(--color-primary); margin-bottom: 1rem; }
  .lead { font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 2rem; }
  .price-block { background: var(--color-cream); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
  .price-main { display: block; font-size: 2.5rem; font-weight: 700; color: var(--color-primary); }
  .price-reduced { font-size: 0.95rem; color: var(--color-text-muted); }
  .cta {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--color-primary); color: white; padding: 1rem 2rem;
    border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1rem;
    transition: background 0.2s; min-height: 44px;
  }
  .cta:hover { background: var(--color-primary-dark); }
</style>
```

Create `4-klassen.astro`, `vollkurs.astro`, `practica.astro` with the same structure. Change:
- `title`, `description`: see StructuredData names in Task 3
- `pageType`: `"four_class"` / `"full_course"` / `"practica"`
- `price-main`, `price-reduced`: match the offers in StructuredData
- WhatsApp `text` param: specific to each course

- [ ] **Step 3: Build verification**

```bash
npm run build
```

Expected: 5 URLs under `/kurse/` in build output. No TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/kurse/
git commit -m "feat: all 4 course detail pages with breadcrumbs and Course JSON-LD"
```

---

## Task 10: About, Contact, and Legal Pages

**Files:**
- Create: `src/pages/ueber-uns.astro`
- Create: `src/pages/kontakt.astro`
- Create: `src/pages/impressum.astro`
- Create: `src/pages/datenschutz.astro`

- [ ] **Step 1: Create `src/pages/ueber-uns.astro`**

Fetch real content from the Shopify About page via Admin API or copy from Shopify admin before launch. Placeholder structure:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Über uns — Tango Garden Cologne"
  description="Tango Garden ist eine junge Tanzschule für argentinischen Tango in Köln. Offen, nahbar, leidenschaftlich."
>
  <section class="page-section">
    <div class="container-narrow">
      <h1>Über Tango Garden</h1>
      <p class="lead">Wir sind eine junge Tangoszene in Köln — offen, nahbar, leidenschaftlich engagiert.</p>
      <!-- Expand with real copy from Shopify pages export before launch -->
    </div>
  </section>
</BaseLayout>

<style>
  .page-section { padding: 4rem 1.5rem 6rem; }
  .container-narrow { max-width: 760px; margin: 0 auto; }
  h1 { font-size: clamp(1.75rem, 4vw, 3rem); color: var(--color-primary); margin-bottom: 1.5rem; }
  .lead { font-size: 1.1rem; color: var(--color-text-muted); line-height: 1.8; }
</style>
```

- [ ] **Step 2: Create `src/pages/kontakt.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Kontakt — Tango Garden Cologne"
  description="Kontaktiere Tango Garden Cologne per WhatsApp oder E-Mail. Wir antworten schnell."
>
  <section class="page-section">
    <div class="container-narrow">
      <h1>Kontakt</h1>
      <p class="lead">Wir freuen uns von dir zu hören.</p>
      <ul class="contact-list" role="list">
        <li>
          <a href="https://wa.me/491602368723?text=Hi!%20Ich%20habe%20eine%20Frage."
             class="contact-card" target="_blank" rel="noopener noreferrer"
             aria-label="Kontakt per WhatsApp: +49 160 2368723">
            <span class="c-icon" aria-hidden="true">💬</span>
            <div>
              <strong>WhatsApp</strong>
              <span>+49 160 2368723</span>
              <span class="note">Schnellste Antwort</span>
            </div>
          </a>
        </li>
        <li>
          <a href="mailto:hello@tangogarden.de" class="contact-card"
             aria-label="E-Mail an hello@tangogarden.de">
            <span class="c-icon" aria-hidden="true">✉️</span>
            <div>
              <strong>E-Mail</strong>
              <span>hello@tangogarden.de</span>
            </div>
          </a>
        </li>
      </ul>
      <section class="location" aria-label="Standort">
        <h2>Wo wir tanzen</h2>
        <address>Thürmchenswall 21<br />50668 Köln</address>
      </section>
    </div>
  </section>
</BaseLayout>

<style>
  .page-section { padding: 4rem 1.5rem 6rem; }
  .container-narrow { max-width: 680px; margin: 0 auto; }
  h1 { font-size: clamp(1.75rem, 4vw, 3rem); color: var(--color-primary); margin-bottom: 1rem; }
  .lead { font-size: 1.05rem; color: var(--color-text-muted); margin-bottom: 2.5rem; }
  .contact-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; }
  .contact-card {
    display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem;
    border-radius: 12px; text-decoration: none; color: var(--color-text);
    background: var(--color-cream); transition: transform 0.2s;
  }
  .contact-card:hover { transform: translateY(-2px); }
  .c-icon { font-size: 2rem; }
  .contact-card strong { display: block; font-weight: 700; color: var(--color-primary); margin-bottom: 0.2rem; }
  .contact-card span { display: block; font-size: 0.95rem; color: var(--color-text-muted); }
  .note { font-size: 0.8rem !important; color: var(--color-primary) !important; font-weight: 600; }
  .location h2 { font-size: 1.15rem; color: var(--color-primary); margin-bottom: 0.75rem; }
  address { font-style: normal; font-size: 1rem; color: var(--color-text-muted); line-height: 1.8; }
</style>
```

- [ ] **Step 3: Create `src/pages/impressum.astro`**

> **BLOCKER before launch:** Replace every `[...]` placeholder with real data. A missing or incomplete Impressum is a §5 TMG violation.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Impressum — Tango Garden Cologne"
  description="Impressum und Anbieterkennzeichnung von Tango Garden Cologne gemäß §5 TMG."
  noindex={true}
>
  <section class="page-section">
    <div class="container-narrow legal">
      <h1>Impressum</h1>
      <p class="intro">Angaben gemäß § 5 TMG</p>

      <h2>Betreiber</h2>
      <p>
        [Vor- und Nachname]<br />
        Thürmchenswall 21<br />
        50668 Köln<br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: +49 160 2368723<br />
        E-Mail: <a href="mailto:hello@tangogarden.de">hello@tangogarden.de</a>
      </p>

      <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
      <p>[Vor- und Nachname], Adresse wie oben</p>

      <h2>Haftungsausschluss</h2>
      <p>Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr.</p>
    </div>
  </section>
</BaseLayout>

<style>
  .page-section { padding: 4rem 1.5rem 6rem; }
  .container-narrow { max-width: 720px; margin: 0 auto; }
  .legal h1 { font-size: 2rem; color: var(--color-primary); margin-bottom: 0.5rem; }
  .intro { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 2rem; }
  .legal h2 { font-size: 1.05rem; color: var(--color-primary); margin: 2rem 0 0.5rem; font-family: var(--font-body); font-weight: 700; }
  .legal p { font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.7; }
  .legal a { color: var(--color-primary); }
</style>
```

- [ ] **Step 4: Create `src/pages/datenschutz.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Datenschutzerklärung — Tango Garden Cologne"
  description="Datenschutzerklärung von Tango Garden Cologne gemäß DSGVO (Art. 13)."
  noindex={true}
>
  <section class="page-section">
    <div class="container-narrow legal">
      <h1>Datenschutzerklärung</h1>

      <h2>1. Verantwortliche Stelle</h2>
      <p>[Name des Betreibers], Thürmchenswall 21, 50668 Köln<br />
      E-Mail: hello@tangogarden.de</p>

      <h2>2. Hosting</h2>
      <p>Diese Website wird von Cloudflare Pages gehostet (Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA). Beim Aufruf der Website verarbeitet Cloudflare technisch notwendige Daten (IP-Adresse, Zeitstempel, aufgerufene URL) zur Bereitstellung des Dienstes. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert. Datenschutzerklärung Cloudflare: <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">cloudflare.com/privacypolicy</a></p>

      <h2>3. Webanalyse</h2>
      <p>Diese Website verwendet Cloudflare Web Analytics. Dieses Tool setzt keine Cookies und erhebt keine personenbezogenen Daten — es analysiert aggregierten Traffic anonym. Es ist keine Einwilligung nach DSGVO erforderlich.</p>

      <h2>4. Externe Links</h2>
      <p>Diese Website enthält Links zu WhatsApp (Meta Platforms Ireland Ltd., 4 Grand Canal Square, Dublin 2). Mit dem Klick verlässt du unsere Seite. Es gelten die <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">WhatsApp-Datenschutzbestimmungen</a>.</p>

      <h2>5. Schriftarten</h2>
      <p>Diese Website lädt Schriftarten ausschließlich vom eigenen Server. Es werden keine Verbindungen zu Google Fonts oder anderen externen Schriftdiensten hergestellt.</p>

      <h2>6. Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Anfragen an: hello@tangogarden.de<br />
      Beschwerderecht bei der zuständigen Aufsichtsbehörde: LDI NRW, <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer">ldi.nrw.de</a></p>

      <h2>7. Stand</h2>
      <p>Juli 2026</p>
    </div>
  </section>
</BaseLayout>

<style>
  .page-section { padding: 4rem 1.5rem 6rem; }
  .container-narrow { max-width: 720px; margin: 0 auto; }
  .legal h1 { font-size: 2rem; color: var(--color-primary); margin-bottom: 2rem; }
  .legal h2 { font-size: 1.05rem; color: var(--color-primary); margin: 2rem 0 0.5rem; font-family: var(--font-body); font-weight: 700; }
  .legal p { font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.7; }
  .legal a { color: var(--color-primary); }
</style>
```

- [ ] **Step 5: Build verification**

```bash
npm run build
```

Expected: 4 pages build successfully.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ueber-uns.astro src/pages/kontakt.astro src/pages/impressum.astro src/pages/datenschutz.astro
git commit -m "feat: about, contact, impressum (§5 TMG), datenschutz (GDPR Art.13)"
```

---

## Task 11: Blog Foundation with Content Collections

**Files:**
- Create: `src/content/config.ts`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Create `src/content/config.ts`**

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60),
    description: z.string().min(70).max(160),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Tango Garden'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---
<BaseLayout
  title="Blog — Tango Garden Cologne"
  description="Geschichten, Gedanken und Hintergründe rund um den argentinischen Tango in Köln."
>
  <section class="blog-listing">
    <div class="container">
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p class="empty">Der erste Artikel erscheint bald.</p>
      ) : (
        <ul class="post-list" role="list">
          {posts.map(post => (
            <li>
              <a href={`/blog/${post.slug}`} class="post-card">
                <time datetime={post.data.pubDate.toISOString()}>
                  {post.data.pubDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                <h2>{post.data.title}</h2>
                <p>{post.data.description}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  </section>
</BaseLayout>

<style>
  .blog-listing { padding: 4rem 1.5rem 6rem; }
  .container { max-width: 760px; margin: 0 auto; }
  h1 { font-size: clamp(2rem, 5vw, 3rem); color: var(--color-primary); margin-bottom: 2.5rem; }
  .empty { color: var(--color-text-muted); font-size: 1.05rem; }
  .post-list { list-style: none; display: flex; flex-direction: column; gap: 1.5rem; }
  .post-card {
    display: block; background: var(--color-cream); border-radius: 12px;
    padding: 1.75rem; text-decoration: none; color: var(--color-text);
    transition: transform 0.2s;
  }
  .post-card:hover { transform: translateY(-2px); }
  .post-card time { font-size: 0.82rem; color: var(--color-text-muted); display: block; margin-bottom: 0.5rem; }
  .post-card h2 { font-size: 1.25rem; color: var(--color-primary); margin-bottom: 0.5rem; }
  .post-card p { font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6; }
</style>
```

- [ ] **Step 3: Create `src/pages/blog/[...slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({ params: { slug: post.slug }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await post.render();
const canonical = `https://tangogarden.de/blog/${post.slug}`;
---
<BaseLayout
  title={post.data.title}
  description={post.data.description}
  canonical={canonical}
>
  <article class="blog-post">
    <div class="container">
      <nav aria-label="Breadcrumb">
        <ol class="breadcrumb" role="list">
          <li><a href="/">Startseite</a></li>
          <li aria-hidden="true">›</li>
          <li><a href="/blog/">Blog</a></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page">{post.data.title}</li>
        </ol>
      </nav>
      <header>
        <time datetime={post.data.pubDate.toISOString()}>
          {post.data.pubDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </time>
        <h1>{post.data.title}</h1>
      </header>
      <div class="prose">
        <Content />
      </div>
    </div>
  </article>
</BaseLayout>

<style>
  .blog-post { padding: 3rem 1.5rem 6rem; }
  .container { max-width: 720px; margin: 0 auto; }
  .breadcrumb { list-style: none; display: flex; gap: 0.5rem; font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 2rem; flex-wrap: wrap; }
  .breadcrumb a { color: var(--color-primary); text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }
  header time { font-size: 0.82rem; color: var(--color-text-muted); display: block; margin-bottom: 0.75rem; }
  header h1 { font-size: clamp(1.75rem, 4vw, 2.75rem); color: var(--color-primary); margin-bottom: 2.5rem; }
  .prose { font-size: 1.05rem; line-height: 1.85; color: var(--color-text); }
  .prose h2 { font-size: 1.5rem; color: var(--color-primary); margin: 2.5rem 0 0.75rem; }
  .prose p { margin-bottom: 1.25rem; }
  .prose a { color: var(--color-primary); }
  .prose ul, .prose ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
  .prose li { margin-bottom: 0.4rem; }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/content/ src/pages/blog/
git commit -m "feat: blog with Content Collections — validated schema, breadcrumbs, ready for first post"
```

---

## Task 12: SEO — robots.txt, 404, and Sitemap Verification

**Files:**
- Create: `public/robots.txt`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `public/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /impressum
Disallow: /datenschutz

Sitemap: https://tangogarden.de/sitemap-index.xml
```

- [ ] **Step 2: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="Seite nicht gefunden — Tango Garden Cologne"
  description="Diese Seite konnte nicht gefunden werden."
  noindex={true}
>
  <section class="not-found">
    <h1 aria-label="Fehler 404">404</h1>
    <p>Diese Seite existiert nicht (mehr).</p>
    <a href="/" class="btn">Zur Startseite</a>
  </section>
</BaseLayout>

<style>
  .not-found { padding: 8rem 1.5rem; text-align: center; }
  h1 { font-size: 6rem; color: var(--color-primary); line-height: 1; margin-bottom: 1rem; }
  p { font-size: 1.15rem; color: var(--color-text-muted); margin-bottom: 2rem; }
  .btn {
    display: inline-block; background: var(--color-primary); color: white;
    padding: 0.875rem 2rem; border-radius: 8px; text-decoration: none;
    font-weight: 600; transition: background 0.2s; min-height: 44px;
  }
  .btn:hover { background: var(--color-primary-dark); }
</style>
```

- [ ] **Step 3: Build and verify sitemap**

```bash
npm run build
```

```powershell
Select-String -Path "dist\sitemap-0.xml" -Pattern "<loc>" | Select-Object -First 20
```

Expected: URLs for `/`, `/kurse/`, `/kurse/einstieg`, `/kurse/4-klassen`, `/kurse/vollkurs`, `/kurse/practica`, `/ueber-uns`, `/kontakt`, `/blog/` are all listed. `/impressum` and `/datenschutz` are also included — this is acceptable.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt src/pages/404.astro
git commit -m "feat: robots.txt, custom 404, verify sitemap covers all pages"
```

---

## Task 13: Shopify URL Redirects

**Files:**
- Create: `public/_redirects`

Cloudflare Pages serves HTTP 301s from `_redirects` placed in the build output root. These preserve all link equity and prevent GSC from registering 404s on indexed Shopify URLs.

- [ ] **Step 1: Create `public/_redirects`**

```
# ── Shopify product URLs ──────────────────────────────────
/products/the-sprouting-sessions-beginner-level-1-class-pass-general-admission          /kurse/einstieg  301
/products/the-sprouting-sessions-beginner-level-1-class-pass-student-and-under-28-admission  /kurse/einstieg  301
/products/the-sprouting-sessions-beginners-level-4-classes-pass-general-admission       /kurse/4-klassen  301
/products/the-sprouting-sessions-beginner-level-4-classes-pass-student-and-under-28-admission  /kurse/4-klassen  301
/products/the-sprouting-sessions-beginner-level-full-course-pass-general-admission      /kurse/vollkurs  301
/products/the-sprouting-sessions-beginner-level-full-course-pass-student-and-under28-admission  /kurse/vollkurs  301
/products/the-garden-practica-1-practica-pass-general-admission                         /kurse/practica  301
/products/the-garden-practica-1-practica-pass-door-only-student-and-under-28-admission  /kurse/practica  301

# ── Shopify collection pages ──────────────────────────────
/collections/all   /kurse/  301
/collections/*     /kurse/  301

# ── Shopify system pages (no equivalent) ──────────────────
/cart      /  301
/checkout  /  301
/account   /  301
/account/* /  301
/search    /  301
/pages/*   /  301
```

- [ ] **Step 2: Verify `_redirects` ends up in `dist/`**

```bash
npm run build
```

```powershell
Test-Path "dist\_redirects"
```

Expected: `True`

- [ ] **Step 3: Commit**

```bash
git add public/_redirects
git commit -m "feat: 301 redirects for all Shopify product, collection, and system URLs"
```

---

## Task 14: GitHub Actions CI with Lighthouse Budget

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `lighthouserc.json`

Every pull request and push to `main` must pass the build and meet Lighthouse thresholds before the code can merge. This is the production safety net.

- [ ] **Step 1: Create `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": [
        "http://localhost/",
        "http://localhost/kurse/",
        "http://localhost/kurse/einstieg"
      ],
      "numberOfRuns": 2
    },
    "assert": {
      "assertions": {
        "categories:performance":     ["error", { "minScore": 0.9 }],
        "categories:accessibility":   ["error", { "minScore": 0.95 }],
        "categories:best-practices":  ["error", { "minScore": 0.9 }],
        "categories:seo":             ["error", { "minScore": 1.0 }],
        "first-contentful-paint":     ["warn",  { "maxNumericValue": 2000 }],
        "largest-contentful-paint":   ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift":    ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time":        ["warn",  { "maxNumericValue": 200 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 1

  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - run: npm install -g @lhci/cli@0.14.x
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

- [ ] **Step 3: Add `lhci` script to `package.json`**

Open `package.json` and add to `scripts`:

```json
"lhci": "lhci autorun"
```

- [ ] **Step 4: Push and verify CI runs**

```bash
git add .github/ lighthouserc.json package.json
git commit -m "feat: GitHub Actions CI with Lighthouse budget — perf≥90, a11y≥95, SEO=100"
git push origin main
```

Open the Actions tab on GitHub. The `CI` workflow should appear. First run: build passes, Lighthouse runs. If any score is below threshold, the job fails.

---

## Task 15: Cloudflare Pages Deployment

- [ ] **Step 1: Create Cloudflare Pages project**

1. Log in to https://dash.cloudflare.com
2. Workers & Pages → Create application → Pages → Connect to Git
3. Select the `tangogarden-static` GitHub repo
4. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 20
5. Click **Save and Deploy**

Wait for build to complete. Copy the `*.pages.dev` preview URL.

- [ ] **Step 2: Enable Cloudflare Web Analytics**

In the Cloudflare Pages project → Analytics → Enable Web Analytics.

Copy the JS snippet. Add it to `BaseLayout.astro` just before `</head>`:

```astro
<!-- Cloudflare Web Analytics — no cookies, no GDPR consent required -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
```

Replace `YOUR_TOKEN_HERE` with the token shown in the Cloudflare dashboard. Update CSP in `_headers` to allow this script:

```
script-src 'self' https://static.cloudflareinsights.com;
```

- [ ] **Step 3: Verify the preview deployment**

Open the `*.pages.dev` URL. Check all pages. Verify security headers are present:

```powershell
$r = Invoke-WebRequest -Uri "https://tangogarden-static.pages.dev" -UseBasicParsing
$r.Headers | Where-Object { $_.Key -match "x-frame|content-security|strict-transport" }
```

Expected: `X-Frame-Options: DENY`, `Content-Security-Policy` and `Strict-Transport-Security` headers present.

- [ ] **Step 4: Add custom domain in Cloudflare Pages**

In Cloudflare Pages project → Custom domains → Add `tangogarden.de`.

Save the ALIAS/CNAME value Cloudflare shows — needed for Task 16.

- [ ] **Step 5: Commit Cloudflare Analytics script**

```bash
git add src/layouts/BaseLayout.astro public/_headers
git commit -m "feat: Cloudflare Web Analytics (cookie-free) + update CSP"
git push origin main
```

---

## Task 16: Uptime Monitoring

- [ ] **Step 1: Create UptimeRobot monitor**

1. Go to https://uptimerobot.com → Register free account
2. Add New Monitor:
   - **Type:** HTTPS
   - **URL:** `https://tangogarden.de`
   - **Monitoring interval:** 5 minutes
   - **Alert contact:** your email
3. Add a second monitor for `https://tangogarden.de/kurse/` (most important page after homepage)

- [ ] **Step 2: Configure alert email**

Set alert email to `hello@tangogarden.de` so downtime notifications reach the studio inbox.

No code changes. UptimeRobot is fully external.

---

## Task 17: DNS Cutover — Porkbun to Cloudflare Pages

**Prerequisites completed:**
- Cloudflare Pages project live on `*.pages.dev` (Task 15)
- All pages verified on preview URL
- `_redirects` and `_headers` confirmed in build output
- Impressum placeholder replaced with real legal name

- [ ] **Step 1: Pre-cutover checklist — verify on `*.pages.dev`**

- [ ] Homepage loads — Hero H1 visible without scrolling on iPhone SE (375px)
- [ ] Desktop logo: icon + "Tango Garden" text; mobile: stacked logo
- [ ] PathwayCards: "From €13 or €10/class *" on one line at 1280px
- [ ] WhatsApp links open correctly on mobile
- [ ] `/impressum` has real operator name (no placeholders)
- [ ] `/datenschutz` loads correctly
- [ ] `/blog/` shows placeholder text (no errors)
- [ ] Redirect test: `/products/the-garden-practica-1-practica-pass-general-admission` → 301 → `/kurse/practica`
- [ ] Sitemap at `/sitemap-index.xml` returns valid XML
- [ ] `robots.txt` at `/robots.txt` returns correct content
- [ ] Security headers present (verified in Task 15 Step 3)
- [ ] Lighthouse score on `*.pages.dev` meets budgets (run locally: `npx lhci autorun`)

- [ ] **Step 2: Lower Porkbun DNS TTL**

Log in to Porkbun DNS management for `tangogarden.de`. Change TTL on all records to `300` (5 minutes). Wait 10 minutes for the old TTL to expire before making record changes.

- [ ] **Step 3: Update DNS records**

Remove existing A records or ALIAS pointing to Shopify, then add:

| Type | Host | Value | TTL |
|---|---|---|---|
| ALIAS | `@` (apex) | `tangogarden-static.pages.dev` | 300 |
| CNAME | `www` | `tangogarden-static.pages.dev` | 300 |

- [ ] **Step 4: Remove domain from Shopify**

Shopify admin → Settings → Domains → Remove `tangogarden.de` as the primary domain. This prevents Shopify intercepting DNS responses.

- [ ] **Step 5: Verify propagation**

```powershell
Resolve-DnsName tangogarden.de -Type A
```

Once the IP resolves to Cloudflare's network (not Shopify), open `https://tangogarden.de` in a browser. HTTPS certificate provisions automatically within 5–10 minutes.

- [ ] **Step 6: Test a redirect from an old Shopify path**

Open in browser:
```
https://tangogarden.de/products/the-garden-practica-1-practica-pass-general-admission
```

Expected: 301 redirects to `https://tangogarden.de/kurse/practica`.

---

## Task 18: Post-Launch SEO Verification

- [ ] **Step 1: Resubmit sitemap to Google Search Console**

1. Open https://search.google.com/search-console
2. Select `tangogarden.de` domain property
3. Sitemaps → Remove old Shopify sitemap URL if present → Submit `sitemap-index.xml`

- [ ] **Step 2: URL-inspect key pages**

In GSC URL Inspection, request indexing for each:
- `https://tangogarden.de/`
- `https://tangogarden.de/kurse/einstieg`
- `https://tangogarden.de/kurse/vollkurs`

- [ ] **Step 3: Verify redirects in GSC**

URL-inspect:
```
https://tangogarden.de/products/the-sprouting-sessions-beginner-level-1-class-pass-general-admission
```

Expected: GSC shows "Redirect" → destination `/kurse/einstieg`.

- [ ] **Step 4: Rich Results Test**

Open https://search.google.com/test/rich-results and test:
- `https://tangogarden.de/` → LocalBusiness entity
- `https://tangogarden.de/kurse/einstieg` → Course with Offers

- [ ] **Step 5: Run final Lighthouse on live domain**

```bash
npx lhci collect --url=https://tangogarden.de --numberOfRuns=3
npx lhci assert
```

Expected: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO = 100.

- [ ] **Step 6: Update Porkbun TTL back to normal**

After 48 hours with no issues, set DNS TTL back to `3600`.

---

## Pre-Launch Blockers

These items must be resolved before DNS cutover in Task 17:

| Item | Location | Status |
|---|---|---|
| Replace `[Vor- und Nachname]` in Impressum | `src/pages/impressum.astro` | ⛔ Required |
| Replace `[Name des Betreibers]` in Datenschutz | `src/pages/datenschutz.astro` | ⛔ Required |
| Fill in real About page copy | `src/pages/ueber-uns.astro` | ⚠ Strongly recommended |
| Confirm font URLs in Task 2 are correct woff2 links | `public/fonts/` | ⛔ Required |
| Replace `YOUR_TOKEN_HERE` in Cloudflare Analytics | `src/layouts/BaseLayout.astro` | ⛔ Required |
| OG image cropped to 1200×630 | `public/images/og-image.jpg` | ⚠ Recommended |
| Favicon set generated from logo | `public/icons/` | ⛔ Required |

---

## Spec Coverage

| Requirement | Task |
|---|---|
| Static site, $0/month | Tasks 1, 15 |
| Self-hosted fonts (GDPR, no Google CDN) | Task 2 |
| Security headers (CSP, HSTS, X-Frame) | Task 4 |
| Favicon set + web manifest | Task 3 |
| Skip link (WCAG 2.4.1) | Task 3 |
| Accessible mobile nav (ARIA) | Task 5 |
| WCAG AA touch targets (min 44px) | Tasks 7, 8, 9 |
| H1 "Stop Scrolling..." visible on load | Task 7 |
| Mobile H1 at 4.9vw (no orphaned "Cologne") | Task 7 |
| PathwayCards with Aug 1 + September dates | Task 8 |
| "From €13 or €10/class *" stays on one line | Task 8 |
| All 4 course pages with Course JSON-LD | Tasks 3, 9 |
| LocalBusiness JSON-LD on homepage | Tasks 3, 7 |
| Breadcrumbs on course and blog pages | Tasks 9, 11 |
| Blog Content Collections | Task 11 |
| robots.txt with sitemap declaration | Task 12 |
| Custom 404 page | Task 12 |
| 301 redirects from all Shopify URLs | Task 13 |
| Lighthouse ≥ 90/95/90/100 enforced by CI | Task 14 |
| Cookie-free analytics (no consent banner) | Task 15 |
| Uptime monitoring | Task 16 |
| Impressum (§5 TMG, legally required) | Task 10 |
| Datenschutz (GDPR Art. 13, legally required) | Task 10 |
| Porkbun ALIAS DNS cutover | Task 17 |
| GSC data preserved (same-domain cutover) | Task 17 |
| Post-launch sitemap + URL inspection | Task 18 |
