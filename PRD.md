# Farros.co Premium Redesign PRD

## Summary
Farros.co will become a dark-first premium portfolio for a cybersecurity researcher and data engineer. The site should feel related to the Zenix theme through its speed, polish, glass navigation, bento layouts, and light/dark support, but it must communicate a more exclusive advisory identity instead of a free SaaS template.

## Goals
- Position Farros as a high-trust security advisor for infrastructure, application security, and resilient data systems.
- Use the new graphite logo as the brand anchor across header, favicon, metadata, and UI details.
- Ship a responsive one-page portfolio with working dark/light theme controls and mobile navigation.
- Preserve the Astro static-site performance profile and avoid heavy client JavaScript.
- Give visitors clear paths to review work, understand credibility, download the CV, and initiate contact.

## Audience
- Founders, technical leaders, and operators who need security review or data infrastructure support.
- Engineering teams evaluating whether Farros can handle sensitive systems.
- Recruiters or collaborators who need a fast credibility scan.

## Experience Requirements
- Default visual tone: dark-first graphite, silver, blue, and muted cyan.
- Light mode: polished white/silver surfaces with the same information hierarchy.
- Header: sticky glass navigation with visible logo, desktop links, mobile menu, status badge, and theme toggle.
- Hero: immediate identity statement, advisory positioning, strong CTA pair, and logo-inspired visual system preview.
- Work section: bento-style cards that explain risk, reliability, and platform context without feeling like generic SaaS cards.
- About section: concise bio, advisory capabilities, professional trajectory, and direct contact/social actions.
- Footer: quiet premium close with logo, links, and social actions.

## Content Priorities
- Lead with outcomes: resilient systems, security review, data pipelines, and critical infrastructure trust.
- Keep copy direct and confident. Avoid hype, generic startup language, and long feature explanations.
- Use security language as proof, not decoration.

## Technical Requirements
- Continue using Astro, UnoCSS, and static rendering.
- Implement theme state with `localStorage.theme` and `html.dark`.
- Follow system theme when no saved user preference exists.
- Keep generated client JavaScript small and inline only where needed for navigation and theme state.
- Use existing `/logo.png` and favicon assets.
- Add Playwright smoke/visual tests for the redesigned page.

## Acceptance Criteria
- `npm run build` completes successfully.
- Header logo renders and favicon links return `200`.
- Dark/light toggle works, updates icons, and persists after reload.
- Mobile navigation opens and closes.
- Page has no obvious overlap at mobile, tablet, and desktop widths.
- Playwright smoke tests pass in the local environment.
- Screenshots show distinct dark and light modes with the same premium brand system.
