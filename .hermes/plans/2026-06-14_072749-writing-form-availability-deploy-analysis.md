# Farros.co — Deep Dive on Writing, Form, Availability, Deploy

> Plan-only, read-only. Direct answers to your 4 questions, with
> implementation options ranked. Follow-up task plan (with bite-sized
> tasks) saved separately once you pick.

## Q1. Writing — connect Substack via sitemap/RSS

**Source confirmed:** https://farrosfr.com (Substack custom domain)
- Substack exposes RSS at `https://farrosfr.com/feed` (Atom XML, well-formed)
- Substack exposes sitemap at `https://farrosfr.com/sitemap.xml`
- No public webhooks (we won't get push notifications on new posts)

### Options ranked

| # | Approach | SEO | Coupling | Cost | Failure mode |
|---|---|---|---|---|---|
| 1 | **Hand-curated list in `src/data/writing.ts`** | OK (only as many as you hand-pick) | Zero | Free | You forget to update |
| 2 | **Build-time fetch of `https://farrosfr.com/feed` (RSS)** | Best (6+ posts at SSR time) | Low (only RSS schema) | Free | Substack changes RSS schema (rare); CI must allow network |
| 3 | Build-time fetch of sitemap.xml | Same as RSS but less rich (no excerpt/author/date) | Low | Free | Same |
| 4 | Client-side fetch at runtime | Bad (no SSR content = no SEO) | Low | Free | Slow paint, bad CWV |
| 5 | Webhook-based (Substack doesn't support) | — | — | — | Not viable |

**Recommended: Option 2 (RSS, build-time)** — your real articles render
in the static HTML, so Google indexes the titles, the URLs become
inbound links, and the page ranks for topics you write about.

**Implementation outline (bite-sized):**

1. Add `fast-xml-parser` to `package.json` (lightweight, ~50KB, no deps).
2. Create `src/data/writing.ts`:
   - exports `getLatestPosts(limit: number)` that fetches
     `https://farrosfr.com/feed` (Node `fetch`, 10s timeout), parses, returns
     `Post[]` with `{title, url, pubDate, description, source}`.
   - Use `import.meta.env` to inject a build-time env var (optional) for
     the feed URL, defaulting to `https://farrosfr.com/feed`.
3. New page `src/pages/writing.astro`:
   - `await getLatestPosts(9)` at top of frontmatter (build-time).
   - Grid of 9 cards, 3-col on desktop (same uniform pattern as the new
     Services grid).
   - Each card: title, publication, date, excerpt, "Read on Substack" link
     (target=_blank, rel=noreferrer).
   - "Browse the full archive" CTA linking to `https://farrosfr.com`.
4. Add `/writing` to `navItems` and `searchItems` in `profile.ts`.
5. **Add fallback path** — if the feed fetch fails (network blip, parse
   error), show a cached fallback list from a sibling
   `src/data/writing.fallback.ts` (a small hand-picked 6 entries). Page
   still renders, build doesn't fail.
6. Cache the feed response: write to `.data/writing-cache.json` with
   timestamp; reuse if < 1 hour old (avoids hot rebuilds).

**Why feed over sitemap:** RSS gives you title, excerpt, pubDate, author —
sitemap only gives URLs. Better card content, same SEO win.

**CI concern:** the GitHub Actions deploy runs `npm run build`. It has
network access, but the action may be sandboxed. If it can't reach
farrosfr.com, we fall back to the cached file (which is committed). The
local dev path is the same.

---

## Q2. Form — best setup to build

**Constraint audit:**
- Site is hosted on **Cloudflare Pages** (cf_monitor.py / cf_probe.py prove
  it; see Q4 below).
- Cloudflare Pages Functions are first-class — no separate worker config.
- No secrets in repo (`.env` is for local dev; production secrets live
  on the Cloudflare dashboard).
- Existing pattern: `/services/[slug].astro` already has WhatsApp
  prefilled. Form should match that capability tier.

### Options ranked

| # | Stack | Backend | Spam | Cost | Privacy | Setup |
|---|---|---|---|---|---|---|
| A | **Cloudflare Pages Function + Resend + Turnstile** | Edge function (V8 isolate) | Cloudflare Turnstile (free, no cookies) | Free <100 emails/day (Resend) | Best — emails straight to you | Medium (CF adapter, Resend account, Turnstile keys) |
| B | Cloudflare Pages Function + Postmark | Same | Turnstile | $15/mo flat | Good | Medium |
| C | **Web3Forms** (third-party) | None (POST to web3forms.com) | Their filter | Free unlimited | They see submissions | Trivial (just HTML form) |
| D | Formspree | None (POST to formspree.io) | Their reCAPTCHA | Free 50/mo, $8/mo 1k | They see submissions | Trivial |
| E | Tally / Cal.com embed | None | Their | Free tier | Vendor sees it | Trivial (iframe) |
| F | mailto: with prefilled subject+body | None | None | Free | Best | Trivial |
| G | WhatsApp link (already used on /services/[slug]) | None | None | Free | Best | Trivial |

**Recommended: A for v2, but start with F+G on home + keep C as the
fallback path. Here's why:**

- A is the right long-term answer: privacy-respecting, professional,
  matches the security positioning (Turnstile > reCAPTCHA), no third
  party reads your leads.
- BUT it needs 3 secrets (RESEND_API_KEY, TURNSTILE_SITE_KEY,
  TURNSTILE_SECRET_KEY) on the Cloudflare dashboard, plus the
  `@astrojs/cloudflare` adapter, plus DNS verification for Resend
  (SPF/DKIM on your domain), plus a verified sender address.
- For v1, ship a hybrid: a `mailto:` link with prefilled subject (so the
  user just clicks "Open in mail client") + the existing WhatsApp link
  pattern extended to a service-aware "Chat on WhatsApp" component.
  Zero new secrets, zero third parties, works today.
- v2 (the Resend+Turnstile path) can land in a follow-up PR once you're
  ready to manage the secrets.

**If you want real form delivery in v1 (recommended for credibility):**
go with C (Web3Forms). One form, one access key, no backend code. Then
in a follow-up, swap to A (Resend+Turnstile) when you want to own the
delivery.

**Implementation outline (Web3Forms v1 — smallest scope):**

1. New component `src/components/ContactForm.astro`:
   - `<form action="https://api.web3forms.com/submit" method="POST">`
   - Hidden `access_key` from `import.meta.env.PUBLIC_WEB3FORMS_KEY`
     (set in `.env` for local dev, in Cloudflare Pages env vars for
     production). 403/401 if missing — page shows a clear error.
   - Fields: name, email, service (select populated from `services`),
     message. Honeypot field (`<input type="text" name="botcheck" hidden>`).
   - Hidden `subject: "New advisory inquiry — {service}"` and
     `from_name: "Farros.co contact form"`.
   - On submit: redirect to `/thank-you` (or `#contact-thanks` on home).
2. Mount the form in `src/components/About.astro` below the social
   link grid.
3. Add a Cloudflare Pages env var `PUBLIC_WEB3FORMS_KEY` (signed up at
   web3forms.com with `hello@farros.co` as the recipient).

**Implementation outline (Resend+Turnstile v2 — proper):**

1. Add `@astrojs/cloudflare` adapter.
2. `src/pages/api/contact.ts`:
   ```ts
   import type { APIRoute } from 'astro';
   export const POST: APIRoute = async ({ request, locals }) => {
     const data = await request.formData();
     // 1. verify Turnstile token
     // 2. validate fields
     // 3. call Resend API with RESEND_API_KEY from locals.runtime.env
     // 4. return JSON { ok: true } or { ok: false, error }
   };
   ```
3. `src/components/ContactForm.astro` — add Turnstile widget before
   submit, POST to `/api/contact`, handle JSON response inline.
4. Set env vars in Cloudflare Pages dashboard (not in repo).

**Recommendation summary:**
- v1 = Web3Forms (C). One env var, one component, no backend.
- v2 = Resend + Turnstile (A). Own the delivery, match the security
  posture, drop the third party.

---

## Q3. Availability — GitHub API

**GitHub data sources for `farrosfr`:**

| Endpoint | Field | Stable? | Rate limit cost | Auth needed? |
|---|---|---|---|---|
| `GET /users/farrosfr` | `hireable: boolean \| null` | Yes (you set it manually on github.com) | 1 req | No |
| `GET /users/farrosfr/repos?sort=pushed&per_page=1` | `pushed_at` of newest repo | Yes | 1 req | No |
| `GET /users/farrosfr/events/public` | last 90 days of activity | Volatile (events are kept ~90d) | 1 req | No |
| `GET /search/commits?q=author:farrosfr` | commit count + dates | Slower (search API) | Higher | No |

Public API rate limit: 60 req/hr unauthenticated. Plenty for a
build-time fetch.

### Options ranked

| # | Signal | Pros | Cons |
|---|---|---|---|
| 1 | **`hireable` field only** | Trivial (1 line of fetch). Self-curated. | You have to remember to flip it. |
| 2 | **`hireable` + newest repo `pushed_at`** | Automatic. Surfaces "are you shipping?" | 2 reqs. Slightly heuristic. |
| 3 | Events API (last 90 days) | Rich signal | Volatile; rate-limited heavier when paginated; events can be private. |
| 4 | Search commits | Most accurate "I shipped recently" | Search API is slower; 30 req/min limit; auth helps. |
| 5 | Manual override in `profile.ts` | Always wins | You have to edit it. |

**Recommended: Option 2 (hireable + newest repo pushed_at), with Option 5
as a hard override.**

- Auto-derive: `hireable && pushed_at < 14d → "open"`, `hireable &&
  pushed_at < 60d → "limited"`, `hireable && pushed_at > 60d → "quiet"`,
  `!hireable → "booked"`.
- Override field `availabilityOverride: 'open' | 'limited' | 'booked' |
  null` in `profile.ts`. If set, it wins. Use this for "I'm traveling
  until next month" or "I'm booked through Q3".
- Build-time fetch in a small `scripts/fetch-availability.mjs` that
  writes `.data/availability.json`. Run from `prebuild`. Or inline it in
  the AvailabilityBadge component at build time.

**Implementation outline:**

1. `src/lib/availability.ts`:
   ```ts
   export type Availability = 'open' | 'limited' | 'booked' | 'quiet';
   export async function getAvailability(): Promise<Availability> {
     // 1. read override from profile.ts (import at build)
     // 2. fetch /users/farrosfr → hireable
     // 3. fetch /users/farrosfr/repos?sort=pushed&per_page=1 → pushed_at
     // 4. derive and return
   }
   ```
2. `src/components/AvailabilityBadge.astro` — small pill with colored dot
   (green=open, amber=limited, red=booked, gray=quiet), label, and
   last-checked timestamp on hover.
3. Mount in `src/components/Hero.astro` (replace the green "Active"
   pill) and in the About section.
4. Cache: write to `.data/availability.json` with 1-hour TTL to avoid
   hammering the API on hot rebuilds.

**Caveat:** unauthenticated public API. If you ever hit rate limits (very
unlikely at 1 build/hr), add a fine-grained PAT to the Cloudflare Pages
env (just for the `farrosfr` user metadata endpoint) and bump to 5000
req/hr. Not needed for v1.

**Simpler v1 alternative:** just check `hireable`. One boolean. Done.
You update it on github.com when your situation changes. Build doesn't
even need to call the API; the badge is a static prop.

**My actual recommendation:** ship the static `hireable`-only version
first (1 line of code in `profile.ts`). It's 100% honest because the
data is yours to control. Skip the build-time fetch entirely. You can
always upgrade to the auto-derive later.

---

## Q4. Cloudflare Pages drift risk — honest revision

**My previous claim was overstated.** I checked:

- No `public/CNAME` file exists.
- No `wrangler.toml`, no `netlify.toml`, no `vercel.json`.
- The `.github/workflows/deploy.yml` doesn't reference `farros.co` at all.
- `astro.config.mjs` has `site: 'https://farros.co'` (just used for
  absolute URLs in sitemap/meta).
- `scripts/cf_monitor.py` and `cf_probe.py` show the live site is on
  Cloudflare Pages (they probe `https://farros.co` and the Pages
  deployment URLs).

### What this means

- **Cloudflare Pages is the canonical deploy** for `https://farros.co`.
  DNS points there.
- **The GitHub Pages workflow is effectively dead code**: it would build
  to `https://farrosfr.github.io/farros/` (default GH Pages URL) — a
  different URL entirely. Without a `public/CNAME` declaring
  `farros.co`, GitHub Pages will never serve the production URL.
- The two pipelines don't actually conflict at runtime. There's no
  drift. There's just **confusion** — a future contributor (you, in 6
  months) might wonder which one is canonical and waste time.

### Real risks (revised)

1. **Confusion risk** — someone thinks the GitHub workflow is the
   production deploy and pushes a fix there that never reaches
   farros.co. **Mitigation: delete the GitHub Pages workflow file.**
2. **Cloudflare Pages build cache** — Cloudflare aggressively caches at
   the edge; a deploy may not show new content for ~5 min. The
   cf_monitor.py "tell-tales" are an attempt to detect this, but they're
   hardcoded to a previous build's specifics (404 page text, asset
   paths). **Mitigation: refactor cf_monitor.py to a declarative
   list of expected patterns.**
3. **Two lockfiles** — `bun.lock` (105KB) and `package-lock.json`
   (153KB). Either tool updates only its own, leading to drift in
   pinned versions. **Mitigation: pick one (bun, since the README
   documents bun) and delete the other.**

### Recommendation

Three small ops cleanups, each a one-liner:
1. Delete `.github/workflows/deploy.yml` (the GitHub Pages workflow is
   not serving production).
2. Delete `package-lock.json` if you're standardizing on bun.
3. Refactor `scripts/cf_monitor.py` to read telltales from a JSON/YAML
   file so the next build doesn't have to update the script.

None of these block the user-facing projects. They can land in a single
"ops cleanup" PR or be merged with whichever feature project you ship
next.

---

## Files Likely to Change (across all 4 questions)

Writing:
- `package.json` (add `fast-xml-parser`)
- `src/data/writing.ts` (new)
- `src/data/writing.fallback.ts` (new, hand-curated backup)
- `src/pages/writing.astro` (new)
- `src/components/WritingCard.astro` (new)
- `src/data/profile.ts` (add `/writing` to navItems + searchItems)
- `tests/e2e/writing.spec.ts` (new)

Form (Web3Forms v1):
- `src/components/ContactForm.astro` (new)
- `src/components/About.astro` (mount form)
- `src/data/profile.ts` (add `web3formsKey` reference)
- `tests/e2e/contact.spec.ts` (new)

Form (Resend+Turnstile v2, follow-up):
- `astro.config.mjs` (add @astrojs/cloudflare adapter)
- `src/pages/api/contact.ts` (new)
- `src/components/ContactForm.astro` (swap action to /api/contact)
- Cloudflare dashboard env vars: `RESEND_API_KEY`,
  `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

Availability:
- `src/lib/availability.ts` (new)
- `src/components/AvailabilityBadge.astro` (new)
- `src/components/Hero.astro` (mount)
- `src/components/About.astro` (mount)
- `src/data/profile.ts` (add `availability` field)
- `tests/e2e/availability.spec.ts` (new)

Deploy cleanup:
- `.github/workflows/deploy.yml` (DELETE)
- `package-lock.json` (DELETE, if standardizing on bun)
- `scripts/cf_monitor.py` (refactor to declarative config)
- `scripts/cf-telltales.json` (new, or similar)

## Tests / Validation

For each project:
- `bun run build` succeeds.
- `bun run test:e2e` covers the new feature (form submits, availability
  badge shows expected state, /writing renders cards, etc.).
- Manually verify in `bun run preview` at 375 / 768 / 1280 px widths.
- Cloudflare Pages preview deploy: confirm the new feature works
  against the same env vars that production will use.

## Risks & Tradeoffs

| Risk | Mitigation |
| --- | --- |
| RSS schema changes (Substack could rename fields) | Wrap parser in try/catch; fall back to `writing.fallback.ts`; surface a build warning, not an error |
| GitHub API rate limit during hot rebuilds | Cache `.data/*.json` with 1-hour TTL |
| Web3Forms stores submissions on their side | Acceptable for v1; replace with Resend+Turnstile in v2 |
| Cloudflare Pages env vars not set in production | Deployment check in CI: assert `PUBLIC_WEB3FORMS_KEY` is set before allowing deploy |
| The `hireable` field on github.com is rarely maintained | Provide an override field in `profile.ts` so you can manually mark "booked" without flipping the GitHub profile |
| User's memory: no brand names of listed platforms in user-facing text. The CV data has TryHackMe in `certificates` (already rendered). Don't add new TryHackMe references in any new code. | Add a pre-commit check that scans new .astro/.ts for the banned brand list? Or just review by hand for v1. |
| Privacy/anti-tracking: Cloudflare Pages includes their analytics by default. Some users mind. | Disable Cloudflare Web Analytics if you don't want it; or keep it (no PII, fine for a portfolio). |

## Open Questions (need your call)

1. **Writing data source**: go with Option 2 (build-time RSS fetch from
   farrosfr.com), or hardcode a curated list (Option 1, simplest)?
2. **Form v1**: Web3Forms (zero backend, free) OR Resend+Turnstile
   (proper, but needs ~30 min of secret-management setup)? I'd
   recommend Web3Forms v1 + Resend v2 follow-up.
3. **Availability**: static `hireable` only (1 line), or auto-derive
   from GitHub (slightly smarter, 1 extra API call per build)?
4. **Ops cleanup in same PR**: delete the GitHub Pages workflow +
   `package-lock.json` + refactor cf_monitor.py, or do those in a
   separate "ops" PR?

## Recommended Path

1. **Ops cleanup PR** (small, ~5 min):
   - delete `.github/workflows/deploy.yml`
   - delete `package-lock.json`
   - leave cf_monitor.py refactor for later
2. **Writing PR** (medium, ~45 min):
   - RSS fetch with fallback
   - /writing page
   - Playwright spec
3. **Availability PR** (small, ~15 min):
   - Static `hireable` v1 (no API call)
   - Replace "Active" badge
4. **Form PR v1** (medium, ~30 min):
   - Web3Forms component
   - Mount in About
5. **Form PR v2** (larger, ~1.5 hr):
   - Resend + Turnstile + Cloudflare adapter
   - Real email delivery

**Saved to:** `.hermes/plans/2026-06-14_071853-writing-form-availability-deploy-analysis.md`
**Status:** Plan-only. Awaiting your pick on the 4 open questions above,
then I'll save a bite-sized task plan for the first PR.
