import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { writingFallback } from './writing.fallback';

export type Post = {
  title: string;
  url: string;
  pubDate: string;
  description: string;
  source: string;
};

export type FeedResult = {
  posts: Post[];
  fromCache: boolean;
  fromFallback: boolean;
  fetchedAt: number;
};

const FEED_URL = 'https://farrosfr.com/feed';
const CACHE_PATH = '.data/writing-cache.json';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

type Cache = { fetchedAt: number; posts: Post[] };

// Compliance scrub: the user's portfolio is syndicated to platforms that
// ban platform brand names and trigger words in user-facing text. The /writing
// page renders post titles and descriptions verbatim from the Substack RSS
// feed, so we strip banned terms here. This runs at parse time so the
// on-disk cache holds clean data and the page never has to think about it.
const BANNED_TERMS: Array<[RegExp, string]> = [
  // Platform brand names → stripped entirely, then whitespace/pipe cleanup
  [/\btry[\s-]?hack[\s-]?me\b/gi, ''],
  [/\bhtb\b/gi, ''],
  [/\bhacker[\s-]?rank\b/gi, ''],
  [/\bcyber[\s-]?sky[\s-]?line\b/gi, ''],
  [/\bsecurity[\s-]?blue[\s-]?team\b/gi, ''],
  [/\bhackviser\b/gi, ''],
  // Trigger words → neutral "study notes"
  [/\bwrite[\s-]?ups?\b/gi, 'study notes'],
  [/\bwalk[\s-]?throughs?\b/gi, 'study notes'],
  // Clean up artifacts: empty pipe-segments, trailing pipe, double spaces
  [/\s*\|\s*\|/g, ' |'],
  [/\s*\|\s*$/g, ''],
  [/\s*\(\s*\)/g, ''],
  [/\s{2,}/g, ' '],
];

function sanitize(text: string): string {
  let out = text;
  for (const [pattern, replacement] of BANNED_TERMS) {
    out = out.replace(pattern, replacement);
  }
  return out.trim();
}

function sanitizePost(post: Post): Post {
  return {
    ...post,
    title: sanitize(post.title),
    description: sanitize(post.description),
  };
}

function readCache(): Cache | null {
  if (!existsSync(CACHE_PATH)) return null;
  try {
    const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf-8')) as Cache;
    // Sanitize on read too, in case an older cache predates the scrub.
    return {
      ...raw,
      posts: raw.posts.map(sanitizePost),
    };
  } catch {
    return null;
  }
}

function writeCache(posts: Post[]): void {
  mkdirSync(dirname(CACHE_PATH), { recursive: true });
  const payload: Cache = { fetchedAt: Date.now(), posts };
  writeFileSync(CACHE_PATH, JSON.stringify(payload, null, 2));
}

function parseFeed(xml: string): Post[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  const parsed = parser.parse(xml);
  // Substack publishes RSS 2.0: <rss><channel><item>.
  // Some hosts publish Atom: <feed><entry>. Handle both.
  const items =
    (Array.isArray(parsed?.rss?.channel?.item) && parsed.rss.channel.item) ||
    (Array.isArray(parsed?.feed?.entry) && parsed.feed.entry) ||
    [];
  if (items.length === 0) return [];
  return items.slice(0, 20).map((entry: unknown) => {
    const e = entry as Record<string, unknown>;
    // RSS 2.0: <link>https://...</link> (text node). Atom: <link href="..."/>.
    const linkRaw = e.link as { '@_href'?: string } | string | undefined;
    const url =
      typeof linkRaw === 'string'
        ? linkRaw
        : (linkRaw?.['@_href'] ?? '');
    const titleRaw = e.title as { '#text'?: string } | string | undefined;
    const title =
      typeof titleRaw === 'string' ? titleRaw : (titleRaw?.['#text'] ?? '');
    const summaryRaw = e.description as { '#text'?: string } | string | undefined;
    const description = (typeof summaryRaw === 'string' ? summaryRaw : (summaryRaw?.['#text'] ?? ''))
      .replace(/<[^>]+>/g, '')
      .slice(0, 240);
    return sanitizePost({
      title: String(title).trim(),
      url: String(url).trim(),
      pubDate: String(e.pubDate ?? e.published ?? e.updated ?? '').trim(),
      description,
      source: 'farrosfr.com',
    });
  });
}

export async function getLatestPosts(limit = 9): Promise<FeedResult> {
  const cached = readCache();
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      posts: cached.posts.slice(0, limit),
      fromCache: true,
      fromFallback: false,
      fetchedAt: cached.fetchedAt,
    };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(FEED_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const posts = parseFeed(xml);
    if (posts.length === 0) throw new Error('Empty feed');
    writeCache(posts);
    return {
      posts: posts.slice(0, limit),
      fromCache: false,
      fromFallback: false,
      fetchedAt: Date.now(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[writing] feed fetch failed (${message}); using fallback`);
    if (cached) {
      return {
        posts: cached.posts.slice(0, limit),
        fromCache: true,
        fromFallback: true,
        fetchedAt: cached.fetchedAt,
      };
    }
    return {
      posts: writingFallback.slice(0, limit),
      fromCache: false,
      fromFallback: true,
      fetchedAt: 0,
    };
  }
}
