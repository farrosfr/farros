# PR #4-9: Post-launch hardening + growth

Date: 2026-06-14
Repo: D:\3-web\farros
Branch: master
Status: PR #1 (writing), #2 (contact), #3 (availability) all shipped and verified live. Now executing growth + SEO round.

## Order (user picked "all in order")

### PR #4 — OG image + Cloudflare Web Analytics + JSON-LD Person
**Why:** highest-leverage shareability + visibility. Every Slack/LinkedIn/X share becomes a proper card. CF Web Analytics is free, no cookie banner.
**Scope:**
- Build-time OG image: `src/pages/og.png.ts` route using satori + @resvg/resvg-js, dynamic title from query param
- Per-page meta in BaseLayout: og:title, og:description, og:image, twitter:card, twitter:image
- JSON-LD Person schema on home (use `application/ld+json`)
- Cloudflare Web Analytics: script tag with `PUBLIC_CF_ANALYTICS_TOKEN` env (optional, no-op if unset)
- `.env.example` update with token placeholder + dashboard link
- E2E test: home page has og:title meta, person schema in <head>
**Verify:** share debugger (Twitter card validator), HTML inspect for `og:image`, `application/ld+json`, `data-cf-beacon`

### PR #5 — /web-porto filter + lightbox
**Why:** UX win. As portfolio grows, visitors need to find relevant projects.
**Scope:**
- Categorize each project: web, security, data, ai, other
- Filter chips above grid: All / Web / Security / Data / AI / Other
- Vanilla JS filter (no framework bloat): show/hide via `[data-category]`
- Click card → expand to full description modal (lightbox)
- Lightbox: backdrop, ESC to close, focus trap, click-outside
- Persist filter in URL hash (`#web`)
- E2E: filter applies, lightbox opens, ESC closes
**Verify:** 6+ projects categorized, no flash of unfiltered content

### PR #6 — /services/[slug] enrichment
**Why:** SEO + conversion. Each service page is a landing page for that offer.
**Scope:**
- Per-service additions in `src/data/services.ts` (or inline in slug.astro):
  - Process steps (3-5 numbered steps)
  - Deliverables (concrete list)
  - "Good fit" + "Not a fit" checklists
  - FAQ (3-5 questions)
- Page layout: existing intro, then process section, deliverables grid, fit checklists, FAQ accordion
- JSON-LD ProfessionalService schema per service
- E2E: all 6 services render new sections, FAQ accordion toggles
**Verify:** build clean, structured data valid (Google Rich Results test)

### PR #7 — Content collections (scoped: native long-form, keep Substack RSS)
**Why:** type safety for native content. Keep RSS for Substack.
**Scope:**
- `src/content/native/` collection with schema (title, description, pubDate, tags, draft)
- One example post (or migrate the welcome/note post if exists)
- New `/notes` page showing native posts (separate from /writing)
- Substack RSS flow unchanged
- E2E: /notes renders, draft posts hidden
**Verify:** astro check passes, type-safe frontmatter enforced

### PR #8 — Site-wide JSON-LD (BreadcrumbList, FAQPage, etc.)
**Why:** SEO hygiene. Cheap once schemas are defined.
**Scope:**
- BreadcrumbList on all non-home pages
- FAQPage where FAQ exists (services)
- WebSite schema with SearchAction on home
- Helper component `<JsonLd schema={...} />` for type-safe emission
- E2E: spot-check 3 pages for valid JSON-LD
**Verify:** schema.org validator, Google Rich Results test on representative pages

## Patterns
- Conventional commits (`feat:`, `chore:`, `fix:`, `test:`, `refactor:`)
- bun for installs + scripts
- E2E selectors: `getByRole` / `data-*` hooks, scope to `main` when nav duplicates
- Card convention unchanged
- Wrap all custom pages in BaseLayout
- No new secrets required for the round (CF analytics token is optional)
- Each PR ships independently — any one can be rolled back

## What stays out of scope
- /web-porto filter persistence across sessions (URL hash is enough)
- Analytics dashboards / custom queries
- Comment system on /notes
- /writing search/filter (RSS is read-mostly)
- Auto-derived availability from GitHub (manual toggle is fine)
- Resend + Turnstile for /contact (Web3Forms + mailto is shipping)
