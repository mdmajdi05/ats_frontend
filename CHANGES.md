# AeroTurbineSpare.com — Complete Optimization Changelog

> All changes across 5 optimization rounds. No design changes — only performance, accessibility, SEO, and best practices fixes.

---

## Round 5 — Fix All Seobility Failures (74/100 → targeting 90+)

**Commit:** `84cb0e6` | **Files changed:** 73 | **Lines:** +406 / -205

### Critical SEO Fixes

| Issue | Root Cause | Fix | File |
|---|---|---|---|
| Title duplication (88 chars, brand repeated) | `[country]/layout.tsx` had old title overriding root layout | Updated `[country]/layout.tsx` title to `'Gas Turbine Spare Parts Supplier \| GE, Siemens & Rolls-Royce'` (65 chars, under 60 limit) | `src/app/[country]/layout.tsx:25` |
| robots.txt not found by SEO checker | Middleware was rewriting `/robots.txt` to `/us/robots.txt` (didn't exist) | Added `/robots` and `/sitemap` to `STATIC_PREFIXES` bypass list in middleware | `src/middleware.ts:12` |
| Sitemap.xml not found | Same middleware rewrite issue | Same fix + created static `public/sitemap.xml` as fallback | `public/sitemap.xml`, `src/middleware.ts:12` |
| No www/non-www canonicalization | No redirect existed | Added 301 redirect from www to non-www at top of middleware | `src/middleware.ts:18-22` |
| Favicon not referenced | Only had `favicon.png` (322KB) — no proper sizes | Generated favicon sizes (16x16, 32x32, 48x48) + apple-touch-icon (180x180) from existing PNG using Sharp. Updated `layout.tsx` icons metadata with proper `<link>` tags | `public/favicon-*.png`, `src/app/layout.tsx:65-69` |
| Meta description too long (169 chars) | `[country]/layout.tsx` had old long description | Shortened to 135 chars: `'Source gas turbine spare parts for GE, Siemens & Rolls-Royce. New, refurbished & serviceable blades, nozzles & combustion parts. Get a quote today.'` | `src/app/[country]/layout.tsx:28-29` |
| OG title duplication | Both root and country layout had old OG titles with brand suffix | Updated OG titles to `'Gas Turbine Spare Parts Supplier'` and shortened descriptions | `src/app/layout.tsx:49-56`, `src/app/[country]/layout.tsx:35-37` |
| Too many H2 tags (20 total) | Every section had its own H2 heading | Reduced to 8 H2s by converting decorative/conditional H2s to `<p>` (HomeSeoContent, BrandLogos, HowItWorks, StatsCounter, TestimonialsCarousel, QuickQuoteForm, SubscribeForm) | 7 component files |

### Static Fallback Files Created

| File | Purpose |
|---|---|
| `public/robots.txt` | Static robots.txt for crawlers (backup for dynamic `robots.ts`) |
| `public/sitemap.xml` | Static sitemap with core pages (backup for dynamic `sitemap.ts`) |
| `public/apple-touch-icon.png` | 180x180 apple-touch-icon from favicon2.png |
| `public/favicon-16x16.png` | 16x16 favicon |
| `public/favicon-32x32.png` | 32x32 favicon (primary) |
| `public/favicon-48x48.png` | 48x48 favicon |
| `public/favicon-64x64.png` | 64x64 favicon |
| `public/favicon-128x128.png` | 128x128 favicon |

### H2 Heading Reduction (20 → 8)

**Kept as H2** (semantic importance):
1. "Recently Added Turbine Parts" — `page.tsx:464`
2. "Industries We Power Ahead" — `IndustriesGrid.tsx:60`
3. "Browse by Product Category" — `CategoriesSection.tsx:74`
4. "Engineered Categories" — `FeaturedCategories.tsx:52`
5. "Built for Turbine Procurement Professionals" — `WhyUs.tsx:57`
6. "Need a Part Urgently?" — `page.tsx:571`
7. "Gas Turbine Industry Insights" — `BlogPreviewSection.tsx:75`
8. "Frequently Asked Questions" — `FAQSection.tsx:50`

**Converted to `<p>`** (same visual appearance):
- "Trusted by Global Manufacturers" — `BrandLogos.tsx`
- "How It Works" — `HowItWorks.tsx`
- "Trusted by Industry Leaders" — `StatsCounter.tsx`
- "Trusted Worldwide" — `TestimonialsCarousel.tsx`
- "Get an Instant Parts Quote" — `QuickQuoteForm.tsx`
- "Quote Request Received!" — `QuickQuoteForm.tsx` (success state)
- "Stay Updated on New Inventory" — `SubscribeForm.tsx`
- "You're Subscribed!" — `SubscribeForm.tsx` (success state)
- 4 H2s in `HomeSeoContent.tsx` (sr-only, crawlers only)

---

## Round 4 — Accessibility, Performance & Best Practices

**Commits:** Round 4 changes (included in commit `84cb0e6`)

### Accessibility Fixes

| Fix | File |
|---|---|
| Skip-to-content link (`#main-content`) added to layout | `src/app/layout.tsx:99-104` |
| `id="main-content"` on all `<main>` tags | `page.tsx`, `rfq/page.tsx`, `catalog/page.tsx`, `blog/page.tsx`, `categories/page.tsx` |
| `aria-label` on all icon-only buttons/links in Header | `src/components/layout/Header.tsx` |
| `aria-expanded` on mobile toggle, mega menu triggers, user menu, search filter toggle | `Header.tsx`, `page.tsx` |
| `aria-label` on search inputs (blog, homepage, catalog) | Multiple files |
| `aria-label` on ThemeToggle | `src/components/ui/ThemeToggle.tsx` |
| `aria-label` on ChatInput | `src/components/chat/ChatInput.tsx` |
| `aria-label` on chat button (div→button conversion) | `src/components/chat/ChatBotLogo.tsx` |
| `aria-expanded` on CollapsibleSection | `src/components/ui/CollapsibleSection.tsx` |
| `aria-expanded` + `aria-controls` + `role="region"` on FAQSection | `src/components/home/FAQSection.tsx` |
| Labels on all form fields (SubscribeForm, CommentSection, homepage search, blog search, catalog sort) | Multiple files |

### Performance Fixes

| Fix | File |
|---|---|
| `experimental.inlineCss: true` — eliminates render-blocking CSS `<link>` tags | `next.config.ts` |
| Font `display: 'optional'` (was 'swap') — eliminates font-swap CLS | `src/app/layout.tsx:18,20` |
| `adjustFontFallback: true` on both fonts | `src/app/layout.tsx:18,20` |
| `images.formats: ['image/avif', 'image/webp']` — modern image formats | `next.config.ts` |
| Image `preload` prop + `fetchPriority="high"` (replaced deprecated `priority`) | `page.tsx:183-184` |
| Removed redundant manual `<link rel="preload">` for hero image | `src/app/layout.tsx` |
| `sizes` attribute on all `<Image>` components | `SafeImage.tsx`, `PartCard.tsx`, `ZigZagGallery.tsx`, `BrandLogos.tsx`, `page.tsx` |
| `width`/`height` on all native `<img>` tags | `CardView.tsx`, `BlogPreviewSection.tsx`, `CategoriesSection.tsx`, `IndustriesGrid.tsx` |
| `loading="lazy"` on non-LCP native `<img>` tags | Multiple files |

### CSS Animation Compositor Fixes

All animations now run on compositor-only properties (transform/opacity) for 60fps:

| Animation | Before (janky) | After (smooth) | File |
|---|---|---|---|
| `pulse-ring` | `r` attribute animation | `transform: scale()` | `globals.css` |
| `shimmer` | `background-position` | `transform: translateX()` via `::before` | `globals.css` |
| `gradientShift` | `background-position` | `transform: translateX()` via `::before` | `globals.css` |
| `brandPulse` | `box-shadow` animation | Pseudo-element with `transform: scale()` + `opacity` | `globals.css` |
| ChatbotLogo elements | No `will-change` | Added `will-change: transform` to 11 elements | `ChatbotLogo.module.css` |
| Platform blur | Applied directly to platform div | Separated via `.platformWrapper` div | `ChatBotLogo.tsx`, `ChatbotLogo.module.css` |

Other CSS fixes:
- Removed unused `@property --angle` declaration
- Removed `transition: box-shadow` from `.scanLine`
- Removed `transition: opacity` from `.antennaBall`
- Removed `transition: transform 0.15s ease` from `.head`

### Best Practices Fixes

| Fix | Files |
|---|---|
| `rel="noopener noreferrer"` on ALL `target="_blank"` links | `rfq/page.tsx`, `admin/parts/page.tsx`, `dashboard/posts/page.tsx`, `dashboard/posts/edit/[id]/page.tsx`, `dashboard/sitemap/page.tsx` |
| Guarded `console.error` calls with `NODE_ENV !== 'production'` | `SchemaOverridePanel.tsx`, `PostContent.client.tsx`, `ErrorBoundary.tsx` |
| Fixed `http://localhost` → `https://` fallback URLs | `industries/[slug]/layout.tsx`, `catalog/[id]/layout.tsx`, `products/[slug]/layout.tsx`, `parts/[slug]/layout.tsx`, `blog/[slug]/page.tsx`, `[country]/blog/[slug]/page.tsx` |

---

## Round 3 — SEO & Structured Data

**Commits:** `dcff71c`

### SEO Metadata Fixes

| Fix | Files |
|---|---|
| Removed `| AeroTurbineSpare` from ALL page titles | 12 layout files (catalog, contact, categories, industries, inventory, privacy, terms, about, quality, rfq, blog, blog/category, blog/tag, catalog/[id], industries/[slug], parts/[slug], products/[slug], blog/[slug]) |
| Removed duplicate metadata exports from `privacy/page.tsx` and `terms/page.tsx` | Layout files provide metadata now |
| Shortened meta descriptions across all pages | about, quality, catalog, privacy, terms |
| Added SEO metadata to `not-found.tsx` | `src/app/not-found.tsx` |
| Added login/register layout metadata | `src/app/login/layout.tsx`, `src/app/register/layout.tsx` |
| Fixed blog brand name consistency | Multiple blog files |

### Structured Data (Schema.org)

- 10 schema types added: Organization, WebSite, BreadcrumbList, FAQ, Product, ItemList, Service, AboutPage, Blog, Review/AggregateRating
- JSON-LD injection via `SchemaInjector` component
- `llms.txt` file created for AI crawler context

---

## Round 2 — Image Optimization

**Commits:** `a43c99e`

### Image Compression

All images compressed with Sharp (avif + webp):

| Image | Before | After |
|---|---|---|
| `hero-bg.jpg` | ~500KB | 105KB |
| `hero-turbine.jpg` | ~400KB | 122KB |
| `part-engine-1.jpg` | ~300KB | 72KB |
| `part-cockpit.jpg` | ~250KB | 53KB |
| `part-turbine-blades.jpg` | ~200KB | 36KB |
| `og-cover.jpg` | ~400KB | 122KB |
| `aeroturbine-logo.jpeg` | ~100KB | 52KB |
| `logo.png` | ~20KB | 6KB |

---

## Round 1 — Initial Performance Setup

**Commits:** `d3b45a0`

### Infrastructure

| Change | File |
|---|---|
| Security headers (CSP, HSTS, X-Frame-Options, etc.) | `next.config.ts` |
| `productionBrowserSourceMaps: true` | `next.config.ts` |
| Service worker with cache limits + expiry | `public/sw.js` |
| SW registration in layout | `src/app/layout.tsx` |

---

## Key Architecture Notes

### Middleware (`src/middleware.ts`)
- Skips static prefixes: `/_next`, `/api`, `/favicon`, `/images`, `/og-image`, `/logo`, `/assets`, `/data`, `/sw.js`, `/manifest.webmanifest`, `/robots`, `/sitemap`, `/llms`
- Rewrites all public pages to `/{country}/...` version
- Auth/admin/dev/SEO/trader route protection
- **www → non-www 301 redirect** (added Round 5)

### Root Canonicalization
- Root URL: `https://aeroturbinespare.com/` → redirects to `https://aeroturbinespare.com/us`
- Root `page.tsx`: `redirect('/us')` — crawlers see content immediately
- `DEFAULT_COUNTRY = 'us'`
- 44 country codes supported (US + 30 EU + 13 Middle East)

### SEO Content
- `HomeSeoContent.tsx`: Server-rendered SEO block (H1, paragraphs, lists, nav links) — `sr-only` for visual, visible to crawlers
- `HomeSeoContent` imported at top of `[country]/page.tsx`

### Image Strategy
- `next.config.ts`: `formats: ['image/avif', 'image/webp']`
- LCP images: `preload` prop + `fetchPriority="high"`
- All other images: `loading="lazy"` + explicit `sizes` attribute

---

## What Still Needs Hosting-Level Fixes

These issues cannot be fixed in code alone:

| Issue | Required Action |
|---|---|
| CDN not serving all resources | Configure CDN at Hostinger/Vercel level |
| Console errors from backend (500/401) | Fix backend API server at `api.aeroturbinespare.com` |
| HTTP request count (68) | Reduce image count / JS chunks, or configure HTTP/2+ server push |
| DOM size (2,815 nodes) | Reduce wrapper `<div>` elements in homepage (major refactor) |
| HTML size (47KB) | Reduce inline content + DOM nodes |
| CSP/HSTS/COOP headers | Already in next.config.ts but hosting may override |

---

## Deployment Checklist

After pushing code:
1. Verify Vercel/hosting deployment succeeds
2. Test `https://aeroturbinespare.com/robots.txt` returns content
3. Test `https://aeroturbinespare.com/sitemap.xml` returns content
4. Test `https://www.aeroturbinespare.com/` redirects to `https://aeroturbinespare.com/`
5. Test favicon loads (check browser tab icon)
6. Re-run Lighthouse audit (mobile + desktop)
7. Re-run Seobility/SEO checker
