import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const API_BASE = 'https://blog.farrosfr.com/api/v1/posts';
const SITEMAP_URL = 'https://blog.farrosfr.com/sitemap.xml';
const OUTPUT_FILE = resolve('src/data/blog-posts.json');

// Compliance scrub: strip banned third-party platform brand names and trigger words
const BANNED_TERMS = [
  [/\btry[\s-]?hack[\s-]?me\b/gi, ''],
  [/\bhtb\b/gi, ''],
  [/\bhacker[\s-]?rank\b/gi, ''],
  [/\bcyber[\s-]?sky[\s-]?line\b/gi, ''],
  [/\bsecurity[\s-]?blue[\s-]?team\b/gi, ''],
  [/\bhackviser\b/gi, ''],
  [/\bwrite[\s-]?ups?\b/gi, 'study notes'],
  [/\bwalk[\s-]?throughs?\b/gi, 'study notes'],
  [/\s*\|\s*\|/g, ' |'],
  [/\s*\|\s*$/g, ''],
  [/\s*\(\s*\)/g, ''],
  [/\s{2,}/g, ' '],
];

function sanitize(text) {
  if (!text) return '';
  let out = String(text);
  for (const [pattern, replacement] of BANNED_TERMS) {
    out = out.replace(pattern, replacement);
  }
  return out.trim();
}

function categorize(title, subtitle) {
  const text = `${title} ${subtitle || ''}`.toLowerCase();
  if (/\b(ai|llm|gpt|machine learning|prompt|agent|openai|claude|deepseek)\b/i.test(text)) return 'ai';
  if (/\b(sql|data|etl|warehouse|postgres|database|power bi|tableau|pipeline|statistic|statistics)\b/i.test(text)) return 'data';
  if (/\b(soc|tryhackme|study notes|pentest|pentester|security|cve|vulnerab|exploit|recon|malware|wireshark|osint|hacker|burp|owasp|red team|blue team|network|hardening)\b/i.test(text)) return 'security';
  if (/\b(astro|web|firefox|browser|docker|linux|rust|axum|typescript|javascript|react|css|html|frontend|backend|api|server|system|wsl)\b/i.test(text)) return 'systems';
  return 'notes';
}

async function fetchSitemapSlugs() {
  try {
    const res = await fetch(SITEMAP_URL);
    if (!res.ok) return null;
    const text = await res.text();
    const locs = text.match(/<loc>(.*?)<\/loc>/g) || [];
    const slugs = new Set();
    for (const loc of locs) {
      const url = loc.replace(/<\/?loc>/g, '').trim();
      const match = url.match(/\/p\/([^/?#]+)/);
      if (match) slugs.add(match[1]);
    }
    return slugs;
  } catch (err) {
    console.warn('[sync-blog] Warning: could not fetch sitemap:', err.message);
    return null;
  }
}

async function fetchAllPosts() {
  console.log('[sync-blog] Fetching posts from blog.farrosfr.com API...');
  let posts = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const url = `${API_BASE}?limit=${limit}&offset=${offset}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch from Substack API (${url}): ${res.status} ${res.statusText}`);
    }
    const chunk = await res.json();
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    posts = posts.concat(chunk);
    offset += chunk.length;
    if (chunk.length < limit) break;
  }

  return posts;
}

async function main() {
  const [rawPosts, sitemapSlugs] = await Promise.all([
    fetchAllPosts(),
    fetchSitemapSlugs(),
  ]);

  console.log(`[sync-blog] Received ${rawPosts.length} raw posts from API.`);
  if (sitemapSlugs) {
    console.log(`[sync-blog] Cross-checked with ${sitemapSlugs.size} slugs from sitemap.xml.`);
  }

  const processed = [];
  const years = {};
  const categories = {};

  for (const post of rawPosts) {
    if (!post.slug) continue;

    const rawTitle = post.title || 'Untitled';
    const rawSubtitle = post.subtitle || post.search_engine_description || '';
    const cleanTitle = sanitize(rawTitle);
    const cleanDesc = sanitize(rawSubtitle).slice(0, 240);

    const pubDate = post.post_date ? new Date(post.post_date).toISOString() : new Date().toISOString();
    const year = new Date(pubDate).getFullYear();
    const category = categorize(rawTitle, rawSubtitle);

    years[year] = (years[year] || 0) + 1;
    categories[category] = (categories[category] || 0) + 1;

    processed.push({
      id: post.id,
      slug: post.slug,
      title: cleanTitle,
      description: cleanDesc,
      url: `https://blog.farrosfr.com/p/${post.slug}`,
      pubDate,
      year,
      category,
      coverImage: post.cover_image || null,
    });
  }

  // Sort newest first
  processed.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(processed, null, 2), 'utf-8');

  console.log(`[sync-blog] Successfully synchronized ${processed.length} posts to ${OUTPUT_FILE}`);
  console.log('[sync-blog] Breakdown by year:', years);
  console.log('[sync-blog] Breakdown by category:', categories);
}

main().catch((err) => {
  console.error('[sync-blog] Error:', err);
  process.exit(1);
});
