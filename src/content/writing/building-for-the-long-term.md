---
title: "Building for the long term when every dependency wants to break"
description: "Why I default to static-first architectures, small dependency trees, and a bias for boring tools, and what changes when you build a web product that has to survive five years of someone else's decisions."
pubDate: 2026-05-22
tags: ["web", "architecture", "astro"]
readingTime: "7 min"
featured: true
---

There is a particular kind of bug that only shows up two years after you ship. Not a security hole, not a layout shift, but a quiet rot: the marketing site you handed to a client in 2024 now refuses to build because a transitive dependency renamed a method.

I have been on the receiving end of that phone call more times than I would like. So most of my professional work for the last few years has been a slow, deliberate drift toward architectures that survive bad days.

## Three rules I keep coming back to

The first is **static-first**. If a page can be a static page, it should be a static page. Astro makes this almost embarrassingly easy — most of the sites I build are static HTML with islands of interactivity, and they load in under a second on the kind of network a factory in Karawang has on its best day.

The second is **small dependency trees**. I read package-lock diffs the way some people read news. When a `bun add` pulls in 47 new packages, I want to know which ones and why. A small tree is not just a security property, it is a *future* property: it is the difference between a maintainable codebase and a pile of stale choices.

The third is **boring tools**. Postgres is boring. nginx is boring. Cron is boring. Boring is good. Boring tools are well-documented, well-debugged, and have stable APIs. The novelty budget of a team is finite, and you want to spend it on the parts of the product only your team can build.

## What "for the long term" actually costs

Building for the long term is not free. It usually means:

- **Saying no to features** that would be trivial in a heavier framework.
- **Writing more by hand** that a generator could have done in five minutes.
- **Documenting decisions** so the next person does not undo them.

But the payoff is the kind of boring reliability that lets you sleep through a Friday night deploy. Five years from now, the marketing site will still build, the database will still answer, and the team will still know where to look when something breaks.

That is what I am building for.
