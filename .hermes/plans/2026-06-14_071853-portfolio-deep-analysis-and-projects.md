# Farros.co — Deep Analysis & Project Backlog

> Plan-only. No code changes. Pick one of the four project proposals below
> (or one of the smaller follow-ups) and we'll execute it as a fresh task.

## Goal

Identify concrete, scoped projects that fit the current farros.co codebase and
the user's positioning (security + data + Astro/TypeScript advisory). Each
proposal is small enough to ship in a single PR, and is written with exact
file paths, copy-pasteable snippets, and verification steps.

## Current Context (read-only, as observed)

### What this repo IS
- farros.co — premium dark-first portfolio for Mochammad Farros Fatchur Roji.
- Astro 6.3.3, UnoCSS shortcuts (`glass`, `glass-card`, `flex-center`),
  `@astrojs/sitemap`, Playwright e2e, GitHub Pages deploy workflow.
- Cloudflare Pages also serves production (cf_monitor.py, cf_probe.py scripts
  in `scripts/`).
- MCP servers configured in `.mcp.json` (`astro` + `astro-docs`).
- Deployed site: https://farros.co (canonical, per `astro.config.mjs`).
- 13 production web projects in `src/data/profile.ts`, 6 services, 5 experience
  entries, 12 certificates, 4 awards. One published Astro theme (Zenix).

### Pages
- `src/pages/index.astro` — Hero + Services + Projects + About.
- `src/pages/services/[slug].astro` — service detail with WhatsApp CTA.
- `src/pages/cv.astro` — web CV with print stylesheet.
- `src/pages/web-porto.astro` — full project gallery (all 13).
- `src/pages/404.astro` — "Lost in the stack." error page.

### Components
- `Header.astro` — sticky glass, search palette, theme picker, mobile menu.
- `Footer.astro` — brand line, social icons, copyright.
- `Hero.astro` — identity, CTAs, heroMetrics, featuredWork panel.
- `Services.astro` — 3x2 uniform grid (just shipped in 6f2a8e9).
- `Projects.astro` — featured top-6 from `projects` data.
- `About.astro` — bio + capabilities + experience + featuredWork + awards + social.

### Design system
- UnoCSS-only (no Tailwind). CSS variables in `src/styles/global.css`.
- Color tokens: primary blue, accent cyan, neutral grays.
- Glassmorphism via `.glass-card` shortcut.
- Scroll-reveal: vanilla IntersectionObserver, no animation library.

### What's clearly working
- Dark/light/system theme with no-flash inline script.
- Mobile menu full-screen overlay with theme + search + nav.
- Ctrl+K search palette with typed queries.
- Image optimization via `astro:assets` (WebP, srcset, lazy).
- JSON-LD Person schema, OG/Twitter meta, canonical URL per page.
- Playwright smoke tests for homepage, services, web-porto, mobile layout.

## Gaps & Opportunities (deep read)

### A. Writing surface is invisible
- Profile links to `https://farrosfr.medium.com` (70+ articles) and
  `https://farrosfr.com` (Substack), but the site has no `/writing` page, no
  article cards, no way to subscribe. The CV mentions writing as a role
  (Medium 2023-Present, 70+ articles) but the home page has no writing section.
  SEO + lead-magnet gold mine sitting unused.

### B. No intake/contact form
- Contact is `mailto:hello@farros.co` only. No service-aware form, no
  WhatsApp prefill for non-[slug] routes, no "what do you need help with"
  dropdown. The /services/[slug] page has WhatsApp prefilled; the home
  contact paths do not.

### C. No availability signal
- Hero shows "Active" badge but never says "open to advisory work" / "booked
  through Q3" / etc. Recruiters + founders scan for this in <2 seconds.

### D. Projects page is unfilterable
- `/web-porto/` shows all 13. No category filter (E-commerce, Education,
  Energy, Marketplace, etc.). A `category` field already exists on every
  project; just not surfaced. Bad for scanning.

### E. Service pages are thin
- `src/pages/services/[slug].astro` has title, description, 4 feature
  bullets, 1 hero image, 2 CTAs. No "process", "deliverables timeline",
  "FAQ", "related projects", or "what this is not" disambiguation. Each
  service is a sales page; it should sell.

### F. OG image is the logo
- `BaseLayout.astro` line 19: `socialImageURL = /logo.png`. OpenGraph
  previews look generic. Should be a generated per-page card (or a single
  branded `og.png`).

### G. No analytics
- No Plausible / Umami / GA. For a security-positioned site, Plausible fits
  the privacy posture (no cookies, no consent banner needed). Useful for
  knowing which services get clicked, which projects get the most
  outbound traffic.

### H. The `size` field on ProjectEntry is dead
- `src/data/profile.ts` line 29: `size: 'small' | 'medium' | 'large'`.
  The old bento layout used it; the new grid ignores it. Either remove the
  field (YAGNI) or repurpose it for the new "card emphasis" system
  (e.g. one card spans 2 columns for visual rhythm).

### I. cf_monitor.py has hardcoded stale telltales
- `scripts/cf_monitor.py` lines 200-205 hardcode checks for a previous
  build ("Lost in the stack", "self-hosted /services/*.svg",
  "_astro/...webp"). Will give false negatives next deploy. Should be a
  declarative list.

### J. Two deploy pipelines
- `.github/workflows/deploy.yml` (GitHub Pages) AND Cloudflare Pages.
  One is canonical. Decide and archive the other.

### K. UnoCSS icon safelist is tiny
- `uno.config.ts` lines 67-70 safelists only 3 icons. The search palette
  and 404 page render icon classes via template strings; if UnoCSS
  treeshakes them in production, broken icons. Safelist the full set used
  dynamically (or audit).

### L. No Lighthouse / perf budget
- No CI check for performance regression. A free Playwright + Lighthouse
  CI step would catch bloat early.

### M. No case studies
- 13 production projects → 0 case studies. A `/work/[slug]` template +
  2-3 real case studies (Zenix, KIW, Gladys are the strongest) would
  convert visitors much better than outbound links.

## Proposed Approach

Pick the project that matches your goal. All four are sized to ship in one
sitting each.

### Project A — `/writing` index page (Medium + Substack surface)
**Why:** highest SEO + credibility ROI. You already have 70+ articles. Each
one is a backlink target. Sets up a future newsletter capture cleanly.

**Scope (small):** one new page, one component, one data hook. No build-time
fetch — link out to Medium/Substack, but render the latest titles via a
local JSON snapshot you refresh by hand or via a cron.

**Files to create/modify:**
- `src/data/writing.ts` (new) — typed list of curated articles
  (title, url, publication, date, tag).
- `src/components/WritingCard.astro` (new) — small card component.
- `src/pages/writing.astro` (new) — index page, mirrors Services layout
  (3-col grid, 2-row cluster + "see all" link to Substack).
- `src/data/profile.ts` — add `/writing` to `navItems` and `searchItems`.
- `tests/e2e/writing.spec.ts` (new) — Playwright smoke.

**Verification:**
- `bun run build` succeeds.
- `bun run test:e2e` passes (new + existing).
- Manually: `/writing` shows 6+ cards, "Browse all on Substack" CTA visible.

---

### Project B — Contact form + availability signal
**Why:** converts intent. Right now, only `mailto:`; some visitors won't
compose an email.

**Scope:** a single Astro endpoint + one form component.

**Files to create/modify:**
- `src/pages/api/contact.ts` (new) — POST handler; validates, sends via
  Resend / SMTP / Formspree webhook. For a no-secret dev path, just log
  the submission and return 200 (we wire real delivery in a follow-up).
- `src/components/ContactForm.astro` (new) — name, email, service select
  (populated from `services`), message. Uses progressive enhancement
  (works without JS; POSTs to `/api/contact`).
- `src/components/AvailabilityBadge.astro` (new) — small component,
  reads a constant from `profile.ts` (`availability: 'open' | 'limited'
  | 'booked'`), renders a colored dot + text.
- `src/data/profile.ts` — add `availability` field.
- `src/components/About.astro` — mount the form below the social links.
- `src/components/Hero.astro` — swap the green "Active" pill for the new
  availability component.

**Verification:**
- `POST /api/contact` returns 200 with a valid body, 400 with missing
  fields.
- `bun run test:e2e` covers the form interaction.
- Visual: form is keyboard-accessible, has `aria-describedby` on errors.

---

### Project C — Projects filter on `/web-porto/`
**Why:** visitors want to scan by domain. 13 projects across 5 categories
feels like a wall; filtered it feels curated.

**Scope:** client-side filter (no extra routes).

**Files to create/modify:**
- `src/data/profile.ts` — add a `categories` derived export.
- `src/components/PortfolioFilter.astro` (new) — small inline script that
  filters cards by data-attribute. No URL sync (YAGNI for v1).
- `src/pages/web-porto.astro` — add filter UI above the grid, tag each
  `<a>` with `data-category={project.category}`.
- `tests/e2e/web-porto.spec.ts` — extend to test filter behavior.

**Verification:**
- Clicking "E-commerce" hides non-matching cards.
- Empty state if all filters off + no matches (unlikely with current
  data, but handled).

---

### Project D — Service detail page enrichment
**Why:** each `/services/[slug]` is a landing page that should sell. Right
now it's 4 bullets + an image.

**Scope:** template enrichment, not a full redesign. Add 3 new sections,
pulled from existing data where possible.

**Files to create/modify:**
- `src/data/profile.ts` — extend the `services` array entries with
  `process` (3-5 step string[]), `deliverables` (string[]),
  `faq` ({q, a}[]). YAGNI: only add for 1-2 services to start; others
  keep current shape.
- `src/pages/services/[slug].astro` — append sections conditionally:
  "Process" timeline, "Deliverables" list, "FAQ" accordion.
- `src/components/Accordion.astro` (new) — small, native `<details>`-
  based (no JS), accessible by default.
- `src/data/profile.ts` — add `/services/<slug>` deep links to
  searchItems and navItems already done.

**Verification:**
- Build succeeds.
- FAQ accordion opens/closes via mouse + keyboard.
- New sections hidden gracefully when data is absent (for services we
  didn't enrich yet).

---

## Files Likely to Change (any project)

A summary across all four (no project touches ALL of these, but for context):

- `src/data/profile.ts` (read in all projects)
- `src/data/writing.ts` (new, A only)
- `src/components/WritingCard.astro` (new, A only)
- `src/components/ContactForm.astro` (new, B only)
- `src/components/AvailabilityBadge.astro` (new, B only)
- `src/components/PortfolioFilter.astro` (new, C only)
- `src/components/Accordion.astro` (new, D only)
- `src/components/About.astro` (B)
- `src/components/Hero.astro` (B)
- `src/components/Header.astro` (A — navItems)
- `src/pages/writing.astro` (new, A only)
- `src/pages/services/[slug].astro` (D)
- `src/pages/web-porto.astro` (C)
- `src/pages/api/contact.ts` (new, B only)
- `tests/e2e/writing.spec.ts` (new, A)
- `tests/e2e/web-porto.spec.ts` (C)
- `tests/e2e/services.spec.ts` (D)

## Tests / Validation

Common across all four projects:

1. `bun install` (or `npm install`) — clean install.
2. `bun run build` — must succeed with no warnings.
3. `bun run test:e2e` — all existing + new tests pass.
4. `bun run preview` + manual smoke:
   - `/`, `/services/web-architecture/`, `/cv`, `/web-porto/` all render.
   - Mobile (375px), tablet (768px), desktop (1280px) have no horizontal
     overflow.
   - Dark/light toggle persists across reload.
5. Lighthouse via DevTools (manual, no CI yet) — Performance ≥ 95,
   Accessibility ≥ 95 on the new pages.

## Risks & Tradeoffs

| Risk | Mitigation |
| --- | --- |
| `cf_monitor.py` will give false positives after these changes (it hardcodes "Lost in the stack" 404 + webp checks). | Treat as follow-up; not in scope for projects A-D. |
| `bun.lock` and `package-lock.json` both exist. | Pick one (recommend `bun.lock` per the README; remove `package-lock.json`). |
| Two deploy paths (Cloudflare Pages + GitHub Pages) may produce drift. | Out of scope; flag for ops decision. |
| OG image is logo — social previews will look generic. | Project F (separate scope). |
| Astro 6 is recent; some packages may have rough edges. | Use `astro:assets` and UnoCSS only — already in use. |
| Search palette renders icons via template strings; UnoCSS safelist is 3 items. | Project A/C/D won't touch search, but be aware. |
| User has explicit memory: no brand names of listed platforms (TryHackMe etc.) in user-facing text. | The CV data file contains TryHackMe in `certificates` — but that data is rendered as-is. Don't add new TryHackMe references in any new code. |

## Open Questions (need your call)

1. **Which project do you want to execute?**
   A. /writing index (SEO + credibility)
   B. Contact form + availability (lead capture)
   C. Portfolio filter (scannability)
   D. Service detail enrichment (conversion on service pages)
2. **Contact form delivery** — for Project B, do you want a real email
   delivery wired (Resend / Formspree / SMTP), or is the no-op "log to
   server console" stub fine for v1?
3. **Deploy path** — GitHub Pages workflow or Cloudflare Pages as
   canonical? Should I remove the other in the same PR, or leave both?
4. **Bun or npm** — repo has both lockfiles. Pick one; I can normalize.

## Recommended Starting Order

If you want a "smallest-first that builds momentum" path:
1. **Project A (writing)** — sets up the data layer pattern, gives you
   recurring content surface.
2. **Project B (contact form)** — adds conversion capture.
3. **Project C (filter)** — incremental UX win.
4. **Project D (service enrichment)** — heaviest; do last so the
   conversion plumbing is already in place.

## Execution Path (when you say go)

If you pick one of A-D, I'll save a follow-up plan that's:
- Bite-sized (2-5 min tasks each)
- TDD-shaped (Playwright spec first, then implementation)
- Atomic commits (one task = one commit)
- Uses the `subagent-driven-development` pattern (fresh subagent per
  task, two-stage review).

Then I dispatch a fresh subagent for the first task and we move.

---

**Saved to:** `.hermes/plans/2026-06-14_071853-portfolio-deep-analysis-and-projects.md`
**Status:** Plan-only. Awaiting your pick of A / B / C / D and answers to
the 4 open questions above.
