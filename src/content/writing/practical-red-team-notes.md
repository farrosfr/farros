---
title: "Practical red-team notes: what offensive work taught me about defensive defaults"
description: "Field notes from running offensive security exercises on web applications I have also built, and the small defensive defaults that survive contact with a real attacker mindset."
pubDate: 2026-04-08
tags: ["security", "red-team", "web"]
readingTime: "9 min"
featured: true
---

I have spent the last few years writing about offensive security in public, and most of those notes came out of one specific practice: attacking web applications I have also built or maintained. The lessons that survive that loop are not the clever ones. They are the boring defaults that, when missing, become a vulnerability every single time.

## The four defaults I now ship by reflex

**1. Strict cookie scoping, by default.** `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict` for high-value flows), and a path that matches the application root. Cookies that do not need to be read by JavaScript should never be readable by JavaScript.

**2. Content Security Policy that fails closed.** I write CSPs by starting from `default-src 'none'` and opening up only what the application actually needs. A CSP that allows `'unsafe-inline'` and `'unsafe-eval'` because the build tool complained is a CSP that does not exist.

**3. Output encoding at the boundary, not in templates.** Templates that try to be smart about XSS are templates that forget on the next release. The fix is to make the templating layer unable to emit unescaped output, and to do all encoding at the data-loading layer.

**4. Logging that an incident responder can actually use.** Logs without timestamps, request IDs, and user identifiers are noise. I now ship a small structured-logging helper into every greenfield project so the first incident is not also the first time anyone thinks about what to log.

## The lesson I keep relearning

Offensive work is mostly pattern matching. You see the same five or six vulnerability classes in 90% of engagements: missing authentication on internal endpoints, IDOR on object references, SSRF in image uploaders, and XSS in search bars. Defensive work is the same pattern, but in reverse: you ship the default that kills the entire class, not the patch for the specific instance.

The boring defaults win.
