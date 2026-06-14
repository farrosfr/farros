---
title: "Data engineering without a team: what one person can realistically own"
description: "An honest accounting of what a single data engineer can keep running well, what has to be deferred, and the smallest possible stack that survives a 90-day vacation."
pubDate: 2026-02-14
tags: ["data", "etl", "operations"]
readingTime: "8 min"
featured: true
---

There is a version of data engineering you read about in conference talks, and then there is the version one person keeps alive in a real company. The gap between them is mostly about scope. This essay is a short list of the scope reductions that have actually worked for me.

## What one person can own

A one-person data operation can own:

- **One source of truth database.** Usually Postgres. Probably not a warehouse unless you have a real reason.
- **One ingestion pattern.** A daily or hourly ETL that pulls from a small number of internal systems, with a clear contract for what gets loaded.
- **One reporting tool.** Metabase or Superset if the team is technical, Power BI or Tableau if it is not. Pick one. The second tool is where the team's cognitive overhead doubles.
- **One monitoring surface.** A single dashboard that answers "is anything broken" and a single channel for alerts.

That is the entire system. Everything else is an upgrade you can defer.

## What one person should *not* own

- **Streaming infrastructure.** Kafka, Flink, and friends are wonderful tools for teams that have someone to own them. For a one-person operation, the operational cost of running a streaming platform outweighs the latency win almost every time.
- **Custom ML pipelines.** If the model is the product, you have a different problem. If the model is not the product, a hosted API is cheaper than your weekends.
- **A "data mesh".** Meshes are an organisational pattern that assumes you have an organisation. One person is not an organisation.

## The smallest stack I would ship today

If I were starting a new data operation tomorrow, with one engineer and a budget for a single managed Postgres instance plus a small VM, this is what I would ship:

1. **Postgres** as the source of truth, with one schema per source system and a small `analytics` schema for cleaned tables.
2. **A daily Python ETL** that pulls from the source APIs, normalises into the `analytics` schema, and writes a run log to a `meta` table.
3. **Metabase** on a small VM, pointed at the analytics schema, with a single dashboard of "the questions a sales lead asks every Monday".
4. **A cron-driven monitoring script** that pings a Slack channel if the ETL has not written in 24 hours.

That is the entire system. It will not win any architecture awards. It will, however, survive a 90-day vacation, and the next person who joins the company will be able to read it in a week.
