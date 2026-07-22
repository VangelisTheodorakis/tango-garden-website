/**
 * Product catalogue for tangogarden.de.
 *
 * Checkout still runs through Shopify: the PDP buttons open a Shopify cart
 * permalink built from `variants[].id`, so those ids must match the live store.
 *
 * `hidden: true` marks products that are not live on tangogarden.de. They keep
 * their page (reachable by direct URL) but carry noindex and stay out of the
 * sitemap — see astro.config.mjs.
 *
 * Generated from the legacy HTML by tools/extract-products.mjs, then maintained
 * by hand.
 */
export const products = [
  {
    "handle": "enter-the-garden-general-admission",
    "title": "Enter the Garden — Introductory Session",
    "description": "Your first 90-minute, zero-pressure introduction to Argentine Tango in Cologne. No partner needed. No experience required. 01/08/2026.",
    "hidden": true,
    "template": "legacy",
    "bodyHtml": "<div class=\"product-hero\">\n  <a href=\"/pages/start-here\" class=\"back-link\">← All options</a>\n  <div class=\"product-badge\">Enter the Garden · Introductory Session</div>\n  <h1 class=\"product-title\">Enter the Garden<br><span style=\"font-size: 0.65em; font-weight: 500; color: #666;\">(Introductory Session)</span></h1>\n  <div class=\"product-price-block\">\n    <div class=\"product-price\">€10</div>\n    <div class=\"product-price-note\">Leader / Follower / Double-Role · 01/08/2026</div>\n  </div>\n  <div class=\"product-cta-row\">\n    <a href=\"https://wa.me/491602368723?text=Hi!%20I'd%20like%20to%20book%20Enter%20the%20Garden%20(General%20Admission).\" class=\"btn-whatsapp\">💬 Book via WhatsApp</a>\n    <a href=\"/products/enter-the-garden-introductory-session-student-and-under-28-admission\" class=\"btn-ghost\">Student / Under 28 — €8</a>\n  </div>\n</div>\n\n<div class=\"product-body\">\n  <h2>What to Expect</h2>\n  <p>A 90-minute, zero-pressure introduction to Argentine Tango. You will learn the very basics of connection, weight shifts, and the embrace — not as performance, but as conversation between two people.</p>\n  <p>No partner needed. We rotate throughout the session so everyone dances with everyone. No experience of any kind is required.</p>\n\n  <h2>What's Included</h2>\n  <ul>\n    <li>90-minute guided introductory session</li>\n    <li>Drinks &amp; snacks included</li>\n    <li>Partner rotation — come solo</li>\n    <li>Role of your choice: Leader, Follower, or Double-Role</li>\n    <li>Garden Ambassador greeting — you'll never stand alone</li>\n  </ul>\n\n  <h2>Date &amp; Location</h2>\n  <p><strong>Date:</strong> 01/08/2026 · Exact time TBA this week<br>\n  <strong>Location:</strong> Thürmchenswall 21, 50668 Köln (Yoga Drop Studio) — 3 min walk from Ebertplatz</p>\n\n  <div class=\"product-variants\">\n    <table>\n      <thead><tr><th>Option</th><th>Price</th></tr></thead>\n      <tbody>\n        <tr><td>Leader</td><td>€10</td></tr>\n        <tr><td>Follower</td><td>€10</td></tr>\n        <tr><td>Double-Role</td><td>€10</td></tr>\n      </tbody>\n    </table>\n  </div>\n\n  <h2>Cancellation Policy</h2>\n  <p>Plans change — just let us know in advance via WhatsApp and we'll work something out.</p>\n</div>\n\n<div class=\"product-cta-bottom\">\n  <h2>Ready to take your first step?</h2>\n  <p>Reserve your spot via WhatsApp. We'll confirm within a few hours.</p>\n  <a href=\"https://wa.me/491602368723?text=Hi!%20I'd%20like%20to%20book%20Enter%20the%20Garden%20(General%20Admission).\" class=\"btn-whatsapp\">💬 Book via WhatsApp — €10</a>\n</div>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Enter the Garden — Introductory Tango Session Cologne",
      "description": "One-time 90-minute introductory Argentine tango session in Cologne. No partner or experience needed. Drinks and snacks included.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de",
        "sameAs": [
          "https://www.instagram.com/tangogardencologne",
          "https://www.facebook.com/tangogardencologne/"
        ]
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "startDate": "2026-08-01",
        "location": {
          "@type": "Place",
          "name": "Tango Garden Cologne",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "General Admission",
          "price": "10.00",
          "priceCurrency": "EUR",
          "category": "Paid",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Student / Under-28",
          "price": "8.00",
          "priceCurrency": "EUR",
          "category": "Paid",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "enter-the-garden-introductory-session-student-and-under-28-admission",
    "title": "Enter the Garden — Student & Under 28",
    "description": "Discounted introductory Argentine Tango session in Cologne for students and anyone 28 or under. No partner needed.",
    "hidden": true,
    "template": "legacy",
    "bodyHtml": "<div class=\"product-hero\">\n  <a href=\"/products/enter-the-garden-general-admission\" class=\"back-link\">← General Admission — €10</a>\n  <div class=\"product-badge\">Enter the Garden · Student &amp; Under 28</div>\n  <h1 class=\"product-title\">Enter the Garden<br><span style=\"font-size: 0.65em; font-weight: 500; color: #666;\">Student &amp; Under 28</span></h1>\n  <div class=\"product-price-block\">\n    <div class=\"product-price\">€8</div>\n    <div class=\"product-price-note\">For students and anyone 28 years old or under · 01/08/2026</div>\n  </div>\n  <div class=\"product-cta-row\">\n    <a href=\"https://wa.me/491602368723?text=Hi!%20I'd%20like%20to%20book%20Enter%20the%20Garden%20(Student%20%2F%20Under%2028).\" class=\"btn-whatsapp\">💬 Book via WhatsApp</a>\n    <a href=\"/products/enter-the-garden-general-admission\" class=\"btn-ghost\">General Admission — €10</a>\n  </div>\n</div>\n\n<div class=\"product-body\">\n  <h2>What to Expect</h2>\n  <p>A 90-minute, zero-pressure introduction to Argentine Tango. Same experience as the General Admission — discounted for students and anyone 28 years old or under.</p>\n  <p>No partner needed. We rotate throughout the session so everyone dances with everyone. No experience of any kind is required.</p>\n\n  <h2>What's Included</h2>\n  <ul>\n    <li>90-minute guided introductory session</li>\n    <li>Drinks &amp; snacks included</li>\n    <li>Partner rotation — come solo</li>\n    <li>Role of your choice: Leader, Follower, or Double-Role</li>\n    <li>Garden Ambassador greeting — you'll never stand alone</li>\n  </ul>\n\n  <h2>Date &amp; Location</h2>\n  <p><strong>Date:</strong> 01/08/2026 · Exact time TBA this week<br>\n  <strong>Location:</strong> Thürmchenswall 21, 50668 Köln (Yoga Drop Studio) — 3 min walk from Ebertplatz</p>\n\n  <h2>Eligibility</h2>\n  <p>This pass is for currently enrolled students (any institution) or anyone who is 28 years old or younger. No proof required — we trust you.</p>\n</div>\n\n<div class=\"product-cta-bottom\">\n  <h2>Ready to take your first step?</h2>\n  <p>Reserve your spot via WhatsApp. We'll confirm within a few hours.</p>\n  <a href=\"https://wa.me/491602368723?text=Hi!%20I'd%20like%20to%20book%20Enter%20the%20Garden%20(Student%20%2F%20Under%2028).\" class=\"btn-whatsapp\">💬 Book via WhatsApp — €8</a>\n</div>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Enter the Garden — Introductory Tango Session Cologne",
      "description": "One-time 90-minute introductory Argentine tango session in Cologne. No partner or experience needed. Drinks and snacks included.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "startDate": "2026-08-01",
        "location": {
          "@type": "Place",
          "name": "Tango Garden Cologne",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Student / Under-28",
          "price": "8.00",
          "priceCurrency": "EUR",
          "category": "Paid",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-garden-practica-1-practica-pass-door-only-student-and-under-28-admission",
    "title": "The Garden Practica | 1-Practica Pass (Door-only)| Student & Under 28 Admission",
    "description": "Discounted drop-in Argentine Tango practica in Cologne for students and anyone 28 or under. Open-level, no partner needed. €8.",
    "hidden": false,
    "template": "pdp",
    "heading": "The Garden Practica | 1-Practica Pass (Door-only)| Student & Under 28 Admission",
    "price": "€8,00 EUR",
    "stock": "In stock",
    "variantLabel": "Title",
    "variants": [
      {
        "id": "53606061310279",
        "label": "Default Title"
      }
    ],
    "cartVariantId": "53606061310279",
    "bodyHtml": "<h3>What's included:</h3>\n<ul>\n<li>1-Time Pass for students and anyone who is 28 years old or less.</li>\n</ul>\n<h3>Who this is for:</h3>\n<ul>\n<li data-start=\"457\" data-end=\"546\">For those who regardless their current level, want to improve their dancing skills, get new inspiration or try out different roles.<br>\n</li>\n</ul>\n<ul></ul>\n<p><strong>Pass Validity: </strong>This pass is valid only for one day during the specific practica and only available on site at the moment.</p>\n<p><strong>Cancellation &amp; Refund Policy</strong></p>\n<p>Cancellations are possible up to 1 calendar day before the start of the practica with a full refund. Cancellations on the same day as the practica are not eligible for refund.</p>\n<p>Questions? <a href=\"https://wa.me/491602368723?text=Hi%21+I+have+a+question+about+%22The+Garden+Practica%22%...\" rel=\"noopener\" target=\"_blank\">WhatsApp us!</a></p>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Drop-In Practice: Tango Practica Cologne",
      "description": "Open-level drop-in Argentine tango practica in Cologne. All levels welcome, no partner needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "courseWorkload": "Drop-in",
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Student / Under-28",
          "price": "8.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-garden-practica-1-practica-pass-general-admission",
    "title": "The Garden Practica | 1-Practica Pass (Door-only)| General Admission",
    "description": "Drop-in Argentine Tango practica in Cologne. Open-level, no partner needed. 2.5-hour guided practice session. €10 door-only.",
    "hidden": false,
    "template": "pdp",
    "heading": "The Garden Practica | 1-Practica Pass (Door-only)| General Admission",
    "price": "€10,00 EUR",
    "stock": "In stock",
    "variantLabel": "Title",
    "variants": [
      {
        "id": "53493061288263",
        "label": "Default Title"
      }
    ],
    "cartVariantId": "53493061288263",
    "bodyHtml": "<h3>What's included:</h3>\n<ul>\n<li>1-Time Pass</li>\n</ul>\n<h3>Who this is for:</h3>\n<ul>\n<li data-end=\"546\" data-start=\"457\">For those who regardless their current level, want to improve their dancing skills, get new inspiration or try out different roles.<br>\n</li>\n</ul>\n<ul></ul>\n<p><strong>Payment:</strong> 10€ charged once</p>\n<p><strong>Pass Validity: </strong>This pass is valid only for one day during the specific practica and only available on site at the moment.</p>\n<p><strong>Cancellation &amp; Refund Policy</strong></p>\n<p>Cancellations are possible up to 1 calendar day before the start of the practica with a full refund. Cancellations on the same day as the practica are not eligible for refund.</p>\n<p>Questions? <a rel=\"noopener\" href=\"https://wa.me/491602368723?text=Hi%21+I+have+a+question+about+%22The+Garden+Practica%22%...\" target=\"_blank\">WhatsApp us!</a></p>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Drop-In Practice: Tango Practica Cologne",
      "description": "Open-level drop-in Argentine tango practica in Cologne. All levels welcome, no partner needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "courseWorkload": "Drop-in, no enrollment required",
        "location": {
          "@type": "Place",
          "name": "Tango Garden Cologne",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "General Admission",
          "price": "10.00",
          "priceCurrency": "EUR",
          "category": "Paid",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Student / Under-28",
          "price": "8.00",
          "priceCurrency": "EUR",
          "category": "Paid",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-garden-practica-1-time-pass-evey",
    "title": "Garden Practica — Evey Pass",
    "description": "Special Evey pass for the Garden Practica in Cologne. Drop-in Argentine Tango practice session. €10.",
    "hidden": true,
    "template": "legacy",
    "bodyHtml": "<div class=\"product-hero\">\n  <a href=\"/products/the-garden-practica-1-practica-pass-general-admission\" class=\"back-link\">← General Practica Pass</a>\n  <div class=\"product-badge\">Practica · Evey</div>\n  <h1 class=\"product-title\">Garden Practica<br><span style=\"font-size: 0.65em; font-weight: 500; color: #666;\">Evey Pass</span></h1>\n  <div class=\"product-price-block\">\n    <div class=\"product-price\">€10</div>\n    <div class=\"product-price-note\">1-time drop-in pass</div>\n  </div>\n  <div class=\"product-cta-row\">\n    <a href=\"https://wa.me/491602368723?text=Hi!%20I'd%20like%20to%20use%20my%20Evey%20pass%20for%20the%20Garden%20Practica.\" class=\"btn-whatsapp\">💬 Contact via WhatsApp</a>\n  </div>\n</div>\n\n<div class=\"product-body\">\n  <p>This is a special 1-time Practica pass. If you received this link directly, you know what it's for. Questions? Message us on WhatsApp.</p>\n\n  <h2>Location</h2>\n  <p>Thürmchenswall 21, 50668 Köln (Yoga Drop Studio) — 3 min walk from Ebertplatz</p>\n</div>\n\n<div class=\"product-cta-bottom\">\n  <h2>Questions?</h2>\n  <p>Message us directly and we'll sort it out.</p>\n  <a href=\"https://wa.me/491602368723?text=Hi!%20I%20have%20a%20question%20about%20the%20Evey%20pass.\" class=\"btn-whatsapp\">💬 WhatsApp</a>\n</div>"
  },
  {
    "handle": "the-sprouting-sessions-beginner-level-1-class-pass-general-admission",
    "title": "The Sprouting Sessions (Beginner Level) | 1-Class Pass | General Admission",
    "description": "Try a single Argentine Tango class in Cologne. No partner needed. Part of The Sprouting Sessions beginner course. €18.",
    "hidden": false,
    "template": "pdp",
    "heading": "The Sprouting Sessions (Beginner Level) | 1-Class Pass | General Admission",
    "price": "€18,00 EUR",
    "stock": "97 in stock",
    "variantLabel": "Title",
    "variants": [
      {
        "id": "53327897231687",
        "label": "Default Title"
      }
    ],
    "cartVariantId": "53327897231687",
    "bodyHtml": "<h3>Current course Dates: 15/04/2026 - 17/06/2026</h3>\n<h3>What's included:</h3>\n<ul>\n<li>1-Class Pass</li>\n</ul>\n<h3>Who this is for:</h3>\n<ul>\n<li data-end=\"546\" data-start=\"457\">You’ve taken a class with us before and would like to continue, but aren’t ready to commit to a multi-class option yet.</li>\n<li data-end=\"546\" data-start=\"457\"> You prefer flexibility and want to decide week by week</li>\n</ul>\n<h3>Important information:</h3>\n<ul>\n<li>New students can join during up until May 6th. After May 6th, the group closes to maintain a focused and cohesive learning experience.</li>\n</ul>\n<p><strong>Pass Validity: </strong>This pass is valid only for one day during the specific class</p>\n<p><strong>Cancellation &amp; Refund Policy</strong></p>\n<p>Cancellations are possible up to 1 calendar day before the start of event with a full refund. Cancellations on the same day as the event are not eligible for refund.</p>\n<p>Questions? <a rel=\"noopener\" href=\"https://wa.me/491602368723?text=Hi!%20I+have+a+question+about+the+%22The+Sprouting+Sessions+%28Beginners+Level%29%22...\" target=\"_blank\">WhatsApp us!</a></p>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "1-Class Trial: Try a Tango Class in Cologne",
      "description": "One-time trial Argentine tango class in Cologne. No partner or experience needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "General Admission",
          "price": "18.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Student / Under-28",
          "price": "15.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-sprouting-sessions-beginner-level-1-class-pass-student-and-under-28-admission",
    "title": "The Sprouting Sessions (Beginner Level) | 1-Class Pass | Student & Under 28 Admission",
    "description": "Try a single Argentine Tango class in Cologne at a discounted rate for students and anyone under 28. Part of The Sprouting Sessions beginner course. €15.",
    "hidden": false,
    "template": "pdp",
    "heading": "The Sprouting Sessions (Beginner Level) | 1-Class Pass | Student & Under 28 Admission",
    "price": "€15,00 EUR",
    "stock": "98 in stock",
    "variantLabel": "Title",
    "variants": [
      {
        "id": "53604771594567",
        "label": "Default Title"
      }
    ],
    "cartVariantId": "53604771594567",
    "bodyHtml": "<h3>Current course Dates: 15/04/2026 - 17/06/2026</h3>\n<h3>What's included:</h3>\n<ul>\n<li>1-Class Pass for students and anyone who is 28 years old or less.</li>\n</ul>\n<h3>Who this is for:</h3>\n<ul>\n<li data-start=\"457\" data-end=\"546\">You’ve taken a class with us before and would like to continue, but aren’t ready to commit to a multi-class option yet.</li>\n<li data-start=\"457\" data-end=\"546\"> You prefer flexibility and want to decide week by week</li>\n</ul>\n<h3>Important information:</h3>\n<ul>\n<li>New students can join during up until May 6th. After May 6th, the group closes to maintain a focused and cohesive learning experience.</li>\n</ul>\n<p><strong>Pass Validity: </strong>This pass is valid only for one day during the specific class.</p>\n<p><strong>Cancellation &amp; Refund Policy</strong></p>\n<p>Cancellations are possible up to 1 calendar day before the start of event with a full refund. Cancellations on the same day as the event are not eligible for refund.</p>\n<p>Questions? <a href=\"https://wa.me/491602368723?text=Hi!%20I+have+a+question+about+the+%22The+Sprouting+Sessions+%28Beginners+Level%29%22...\" rel=\"noopener\" target=\"_blank\">WhatsApp us!</a></p>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "1-Class Trial: Try a Tango Class in Cologne",
      "description": "One-time trial Argentine tango class in Cologne. No partner or experience needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "General Admission",
          "price": "18.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Student / Under-28",
          "price": "15.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-sprouting-sessions-beginner-level-1-class-welcome-pass",
    "title": "Sprouting Sessions — Welcome Pass (First-Timers)",
    "description": "First time at Tango Garden? Try a single Argentine Tango class for €15. The Sprouting Sessions Welcome Pass is for first-timers only.",
    "hidden": true,
    "template": "legacy",
    "bodyHtml": "<div class=\"product-hero\">\n  <a href=\"/pages/start-here\" class=\"back-link\">← All options</a>\n  <div class=\"product-badge\">The Sprouting Sessions · Welcome Pass · First-Timers Only</div>\n  <h1 class=\"product-title\">The Sprouting Sessions<br><span style=\"font-size: 0.65em; font-weight: 500; color: #666;\">Welcome Pass — First Time Here?</span></h1>\n  <div class=\"product-price-block\">\n    <div class=\"product-price\">€15</div>\n    <div class=\"product-price-note\">Single class · First visit only · Course runs 15/04–17/06/2026</div>\n  </div>\n  <div class=\"product-cta-row\">\n    <a href=\"https://wa.me/491602368723?text=Hi!%20I'd%20like%20to%20try%20The%20Sprouting%20Sessions%20with%20the%20Welcome%20Pass.\" class=\"btn-whatsapp\">💬 Book via WhatsApp</a>\n    <a href=\"/products/the-sprouting-sessions-beginner-level-1-class-pass-general-admission\" class=\"btn-ghost\">General Admission — €18</a>\n  </div>\n</div>\n\n<div class=\"product-body\">\n  <h2>Your First Class, at a Lower Price</h2>\n  <p>The Welcome Pass is a one-off introductory rate for anyone attending The Sprouting Sessions for the first time. Same class, same experience — just €15 instead of the regular €18.</p>\n  <p>No partner needed, no experience required. Come and see if tango is for you.</p>\n\n  <h2>What's Included</h2>\n  <ul>\n    <li>1 x 1.5-hour class in the Sprouting Sessions course</li>\n    <li>Partner rotation throughout</li>\n    <li>Role of your choice: Leader, Follower, or Double-Role</li>\n    <li>Course runs: 15 April – 17 June 2026 (10 sessions)</li>\n  </ul>\n\n  <h2>Eligibility</h2>\n  <p>This pass is for people who have never attended a Sprouting Sessions class before. One per person. After your first class, the regular 1-class price (€18) applies — or consider a multi-class pass for better value.</p>\n\n  <h2>Location</h2>\n  <p>Thürmchenswall 21, 50668 Köln (Yoga Drop Studio) — 3 min walk from Ebertplatz</p>\n\n  <div class=\"product-variants\">\n    <table>\n      <thead><tr><th>Option</th><th>Price</th></tr></thead>\n      <tbody>\n        <tr><td>Welcome Pass (first visit)</td><td>€15</td></tr>\n        <tr><td>General Admission</td><td>€18</td></tr>\n        <tr><td>Student / Under 28</td><td>€15</td></tr>\n      </tbody>\n    </table>\n  </div>\n\n  <p style=\"font-size: 0.9rem; color: #888;\">Loved it? The <a href=\"/products/the-sprouting-sessions-beginner-level-full-course-pass-general-admission\" style=\"color: #4E5D22;\">Full Course Pass (€130)</a> covers all 10 classes — just €13/class.</p>\n</div>\n\n<div class=\"product-cta-bottom\">\n  <h2>Take Your First Step</h2>\n  <p>Message us to book your Welcome Pass. We'll confirm your spot.</p>\n  <a href=\"https://wa.me/491602368723?text=Hi!%20I'd%20like%20to%20try%20The%20Sprouting%20Sessions%20with%20the%20Welcome%20Pass.\" class=\"btn-whatsapp\">💬 Book via WhatsApp — €15</a>\n</div>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "1-Class Trial: Try a Tango Class in Cologne",
      "description": "One-time trial Argentine tango class in Cologne. No partner or experience needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Welcome Pass (First-Timers)",
          "price": "15.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "General Admission",
          "price": "18.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-sprouting-sessions-beginner-level-4-classes-pass-student-and-under-28-admission",
    "title": "The Sprouting Sessions (Beginner Level) | 4-Classes Pass | Student & Under 28 Admission",
    "description": "4 consecutive Argentine Tango classes in Cologne for students and anyone under 28. The Sprouting Sessions beginner course. €45.",
    "hidden": false,
    "template": "pdp",
    "heading": "The Sprouting Sessions (Beginner Level) | 4-Classes Pass | Student & Under 28 Admission",
    "price": "€45,00 EUR",
    "stock": "99 in stock",
    "variantLabel": "Class #Number | Pass Eligibility",
    "variants": [
      {
        "id": "53604464197959",
        "label": "Pass #1 | From April 15th to May 6th"
      },
      {
        "id": "53604464230727",
        "label": "Pass #2 | From April 22nd to May 13th"
      },
      {
        "id": "53604464263495",
        "label": "Pass #3 | From April 29th to May 20th"
      },
      {
        "id": "53604464296263",
        "label": "Pass #4 | From May 6th to May 27th"
      },
      {
        "id": "53604464329031",
        "label": "Pass #5 | From May 13th to June 3rd"
      },
      {
        "id": "53604464361799",
        "label": "Pass #6 | From May 20th to June 10th"
      }
    ],
    "cartVariantId": "53604464197959",
    "bodyHtml": "<h3>Current course Dates: 15/04/2026 - 17/06/2026</h3>\n<h3>What's included:</h3>\n<ul>\n<li>4-Classes Pass with extra flexibility for students and anyone who is 28 years old or less. You missed a class? Just come to the <a href=\"https://tangogarden.de/products/the-garden-practica-1-practica-pass\"><strong>Garden Practica</strong></a> for free and we will help you catch up!</li>\n</ul>\n<h3>Who this is for:</h3>\n<ul>\n<li>You want to make tango a gentle weekly ritual, without locking into a long-term course<br>\n</li>\n</ul>\n<h3>Important information:</h3>\n<ul>\n<li>New students can join during up until May 6th. After May 6th, the group closes to maintain a focused and cohesive learning experience.</li>\n</ul>\n<p><strong>Pass Validity: </strong>Each pass is valid for 10 classes/check-ins during the span of the 10 weeks course.</p>\n<p><strong>Cancellation &amp; Refund Policy</strong></p>\n<p>Cancellations are possible up to 1 calendar day before the start of the 4 weeks with a full refund. Cancellations during the first 7 calendar days from the beginning of the chosen 4-Classes Pass area eligible to partial refund of 50€. Cancellations after the first 7 calendar days from the beginning of the chosen 4-Classes Pass are not eligible to refund.</p>\n<p>Questions? <a rel=\"noopener\" href=\"https://wa.me/491602368723?text=Hi%21+I+have+a+question+about+%22The+Sprouting+Sessions+%28Beginners+Level%29%22%...\" target=\"_blank\">WhatsApp us!</a><a href=\"https://wa.me/491602368723?text=Hi%21+I+have+a+question+about+%22The+Sprouting+Sessions+%28Beginners+Level%29%22%...\" rel=\"noopener\" target=\"_blank\"></a></p>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "4-Class Pass: The Sprouting Sessions — Argentine Tango Cologne",
      "description": "4 consecutive beginner Argentine tango classes in Cologne. Rolling 4-week windows available. No partner needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "courseWorkload": "PT1H30M weekly for 4 weeks",
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "General Admission",
          "price": "60.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Student / Under-28",
          "price": "45.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-sprouting-sessions-beginner-level-full-course-pass-general-admission",
    "title": "Sprouting Sessions — Full Course Pass",
    "description": "The complete Sprouting Sessions beginner Argentine Tango course in Cologne. 10 weekly classes, no partner needed. €130 — just €13 per class.",
    "hidden": false,
    "template": "pdp",
    "heading": "The Sprouting Sessions (Beginner Level) | Full Course Pass | General Admission",
    "price": "€130,00 EUR",
    "stock": "91 in stock",
    "variantLabel": "Pass Eligibility",
    "variants": [
      {
        "id": null,
        "label": "Full Course | From April 15th to June 17th"
      }
    ],
    "cartVariantId": "53333557805383",
    "bodyHtml": "\n    <h3>Current course Dates: 15/04/2026 - 17/06/2026</h3>\n    <h3>What's included:</h3>\n    <ul><li>10-Classes Pass with extra flexibility. You missed a class? Just come to the <a href=\"/products/the-garden-practica-1-practica-pass-general-admission\"><strong>Garden Practica</strong></a> for free and we will help you catch up!</li></ul>\n    <h3>Who this is for:</h3>\n    <ul><li>You want to make tango a gentle weekly ritual while getting the best value for your money.</li></ul>\n    <h3>Important information:</h3>\n    <ul><li>New students can join during up until May 6th. After May 6th, the group closes to maintain a focused and cohesive learning experience.</li></ul>\n    <p><strong>Pass Validity: </strong>This pass is valid for 10 classes/check-ins during the span of the 10 weeks course.</p>\n    <p><strong>Cancellation &amp; Refund Policy</strong></p>\n    <p>Cancellations are possible up to 1 calendar day before the start of the course with a full refund. Cancellations during the first 7 calendar days from the beginning of the course are eligible to partial refund of 115€. Cancellations after the first 7 calendar days from the beginning of the course are not eligible to refund.</p>\n    <p>Questions? <a href=\"https://wa.me/491602368723?text=Hi!%20I%20have%20a%20question%20about%20the%20Sprouting%20Sessions%20Full%20Course%20Pass.\" target=\"_blank\" rel=\"noopener\">WhatsApp us!</a></p>\n  ",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "The Sprouting Sessions — Beginner Argentine Tango Course Cologne",
      "description": "Complete 10-week beginner Argentine tango course in Cologne. From zero to dancing with confidence. No partner or experience needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "startDate": "2026-04-15",
        "endDate": "2026-06-17",
        "courseWorkload": "PT1H30M weekly for 10 weeks",
        "location": {
          "@type": "Place",
          "name": "Yoga Drop Studio",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "General Admission — Full Course",
          "price": "130.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Student / Under-28 — Full Course",
          "price": "100.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-sprouting-sessions-beginner-level-full-course-pass-student-and-under28-admission",
    "title": "The Sprouting Sessions (Beginner Level) | Full Course Pass | Student & Under 28 Admission",
    "description": "The complete Sprouting Sessions beginner Argentine Tango course in Cologne for students and anyone under 28. 10 weekly classes. €100 — just €10 per class.",
    "hidden": false,
    "template": "pdp",
    "heading": "The Sprouting Sessions (Beginner Level) | Full Course Pass | Student & Under 28 Admission",
    "price": "€100,00 EUR",
    "stock": "94 in stock",
    "variantLabel": "Pass Eligibility",
    "variants": [
      {
        "id": "53604218831175",
        "label": "Full Course | From April 15th to June 17th"
      }
    ],
    "cartVariantId": "53604218831175",
    "bodyHtml": "<h3>Current course Dates: 15/04/2026 - 17/06/2026</h3>\n<h3>What's included:</h3>\n<ul>\n<li>10-Classes Pass with extra flexibility for students and anyone who is 28 years old or less. You missed a class? Just come to the <a href=\"https://tangogarden.de/products/the-garden-practica-1-practica-pass\"><strong>Garden Practica</strong></a> for free and we will help you catch up!</li>\n</ul>\n<h3>Who this is for:</h3>\n<ul>\n<li>You want to make tango a gentle weekly ritual while getting the best value for your money.</li>\n</ul>\n<h3>Important information:</h3>\n<ul>\n<li>New students can join during up until May 6th. After May 6th, the group closes to maintain a focused and cohesive learning experience.</li>\n</ul>\n<p><strong>Pass Validity: </strong>This pass is valid for 10 classes/check-ins during the span of the 10 weeks course.</p>\n<p><strong>Cancellation &amp; Refund Policy</strong></p>\n<p>Cancellations are possible up to 1 calendar day before the start of the course with a full refund. Cancellations during the first 7 calendar days from the beginning of the course are eligible to partial refund of 90€. Cancellations after the first 7 calendar days from the beginning of the course are not eligible to refund.</p>\n<p>Questions? <a rel=\"noopener\" href=\"https://wa.me/491602368723?text=Hi%21+I+have+a+question+about+%22The+Sprouting+Sessions+%28Beginners+Level%29%22%...\" target=\"_blank\">WhatsApp us!</a><a href=\"https://wa.me/491602368723?text=Hi%21+I+have+a+question+about+%22The+Sprouting+Sessions+%28Beginners+Level%29%22%...\" rel=\"noopener\" target=\"_blank\"></a></p>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "The Sprouting Sessions — Beginner Argentine Tango Course Cologne",
      "description": "Complete 10-week beginner Argentine tango course in Cologne. From zero to dancing with confidence. No partner or experience needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "startDate": "2026-04-15",
        "endDate": "2026-06-17",
        "courseWorkload": "PT1H30M weekly for 10 weeks",
        "location": {
          "@type": "Place",
          "name": "Yoga Drop Studio",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "Student / Under-28 — Full Course",
          "price": "100.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "General Admission — Full Course",
          "price": "130.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  },
  {
    "handle": "the-sprouting-sessions-beginners-level-4-classes-pass-general-admission",
    "title": "The Sprouting Sessions (Beginner Level) | 4-Classes Pass | General Admission",
    "description": "4 consecutive Argentine Tango classes in Cologne with The Sprouting Sessions. Choose your 4-week cohort window. No partner needed. €60 general admission.",
    "hidden": false,
    "template": "pdp",
    "heading": "The Sprouting Sessions (Beginner Level) | 4-Classes Pass | General Admission",
    "price": "€60,00 EUR",
    "stock": "97 in stock",
    "variantLabel": "Class #Number | Pass Eligibility",
    "variants": [
      {
        "id": "53333341372743",
        "label": "Pass #1 | From April 15th to May 6th"
      },
      {
        "id": "53333492564295",
        "label": "Pass #2 | From April 22nd to May 13th"
      },
      {
        "id": "53333492597063",
        "label": "Pass #3 | From April 29th to May 20th"
      },
      {
        "id": "53333492629831",
        "label": "Pass #4 | From May 6th to May 27th"
      },
      {
        "id": "53333492662599",
        "label": "Pass #5 | From May 13th to June 3rd"
      },
      {
        "id": "53333492695367",
        "label": "Pass #6 | From May 20th to June 10th"
      }
    ],
    "cartVariantId": "53333341372743",
    "bodyHtml": "<h3>Current course Dates: 15/04/2026 - 17/06/2026</h3>\n<h3>What's included:</h3>\n<ul>\n<li>4-Classes Pass with extra flexibility. You missed a class? Just come to the <a href=\"https://tangogarden.de/products/the-garden-practica-1-practica-pass\"><strong>Garden Practica</strong></a> for free and we will help you catch up!</li>\n</ul>\n<h3>Who this is for:</h3>\n<ul>\n<li>You want to make tango a gentle weekly ritual, without locking into a long-term course<br>\n</li>\n</ul>\n<h3>Important information:</h3>\n<ul>\n<li>New students can join during up until May 6th. After May 6th, the group closes to maintain a focused and cohesive learning experience.</li>\n</ul>\n<p><strong>Pass Validity: </strong>Each pass is valid for 10 classes/check-ins during the span of the 10 weeks course.</p>\n<p><strong>Cancellation &amp; Refund Policy</strong></p>\n<p>Cancellations are possible up to 1 calendar day before the start of the 4 weeks with a full refund. Cancellations during the first 7 calendar days from the beginning of the chosen 4-Classes Pass area eligible to partial refund of 50€. Cancellations after the first 7 calendar days from the beginning of the chosen 4-Classes Pass are not eligible to refund.</p>\n<p>Questions? <a href=\"https://wa.me/491602368723?text=Hi%21+I+have+a+question+about+%22The+Sprouting+Sessions+%28Beginners+Level%29%22%...\" rel=\"noopener\" target=\"_blank\">WhatsApp us!</a><a rel=\"noopener\" href=\"https://wa.me/491602368723?text=Hi%21+I+have+a+question+about+%22The+Sprouting+Sessions+%28Beginners+Level%29%22%...\" target=\"_blank\"></a></p>",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "4-Class Pass: The Sprouting Sessions — Argentine Tango Cologne",
      "description": "4 consecutive beginner Argentine tango classes in Cologne. Rolling 4-week windows available. No partner needed.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tango Garden Cologne",
        "url": "https://tangogarden.de"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "courseWorkload": "PT1H30M weekly for 4 weeks",
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Thürmchenswall 21",
            "postalCode": "50668",
            "addressLocality": "Köln",
            "addressCountry": "DE"
          }
        }
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "General Admission",
          "price": "60.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Student / Under-28",
          "price": "45.00",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock"
        }
      ]
    }
  }
];
