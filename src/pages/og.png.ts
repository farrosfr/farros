// Build-time OG image generator. Renders a 1200x630 PNG suitable for
// Open Graph, Twitter Cards, LinkedIn, and Slack unfurls.
//
// Usage from BaseLayout (or any page):
//   <meta property="og:image" content={`/og.png?title=${title}&subtitle=${desc}`} />
//
// At build time Astro SSG prerenders this endpoint, so the PNG lives in
// the static output and is served from the CDN edge. No runtime cost.
//
// Design constraints:
//   - 1200x630 (Twitter/Facebook/LinkedIn standard; 1.91:1 ratio)
//   - Dark palette that matches the site theme
//   - Two font weights (regular + semibold) from src/assets/fonts/
//   - All text is query-param driven with safe fallbacks
//
// Why satori + resvg: satori turns a CSS tree into SVG using a real
// font, then resvg-js rasterises the SVG to PNG. Pure CSS layout, no
// headless browser, ~50ms per render. Same stack Vercel uses for
// @vercel/og.
//
// Satori gotcha: every <div> with more than one child must declare an
// explicit display (flex / contents / none). Inline text inside a div
// counts as a child, so we wrap text in display:flex too. We avoid
// comments and whitespace-only text nodes.
import type { APIRoute } from 'astro';
// @ts-ignore -- satori type defs reference react which we don't ship
import satori from 'satori';
import { html as satoriHtml } from 'satori-html';
// @ts-ignore -- @resvg/resvg-js ships JS only, no .d.ts in this version
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FONT_DIR = join(process.cwd(), 'src/assets/fonts');
const InterRegular = readFileSync(join(FONT_DIR, 'Inter-Regular.woff'));
const InterSemiBold = readFileSync(join(FONT_DIR, 'Inter-SemiBold.woff'));

const WIDTH = 1200;
const HEIGHT = 630;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams;
  const rawTitle = (query.get('title') ?? '').trim();
  const rawSubtitle = (query.get('subtitle') ?? '').trim();

  // Truncate so an attacker can't blow up the SVG tree with a giant query.
  const title = (rawTitle || 'Farros | Full-stack developer & security researcher').slice(0, 120);
  const subtitle = (rawSubtitle || 'Astro developer, system architect, and cybersecurity writer.').slice(0, 200);

  // IMPORTANT: satori rejects any <div> with multiple children that lacks
  // an explicit display. We keep the template tight: every parent div is
  // display:flex and every text child lives in its own inline-flex div.
  const tree = satoriHtml(`
    <div style="display:flex;flex-direction:column;width:${WIDTH}px;height:${HEIGHT}px;background:linear-gradient(135deg,#070b12 0%,#0a0e17 60%,#0d1118 100%);color:#e6edf3;font-family:Inter;position:relative;overflow:hidden;">
      <div style="display:flex;position:absolute;top:-180px;right:-180px;width:520px;height:520px;border-radius:50%;border:1px solid rgba(120,170,210,0.12);"></div>
      <div style="display:flex;position:absolute;top:-100px;right:-100px;width:360px;height:360px;border-radius:50%;border:1px solid rgba(120,170,210,0.08);"></div>
      <div style="display:flex;position:absolute;bottom:0;left:0;width:240px;height:6px;background:linear-gradient(90deg,#3b82f6,#22d3ee);"></div>
      <div style="display:flex;align-items:center;gap:14px;padding:64px 72px 0 72px;">
        <div style="display:flex;width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#22d3ee);box-shadow:0 0 24px rgba(59,130,246,0.5);"></div>
        <div style="display:flex;font-size:28px;font-weight:600;letter-spacing:0.18em;color:#e6edf3;">FARROS</div>
      </div>
      <div style="display:flex;flex-direction:column;flex:1;justify-content:center;padding:0 72px;">
        <div style="display:flex;flex-direction:column;gap:24px;max-width:980px;">
          <div style="display:flex;font-size:64px;font-weight:600;line-height:1.1;letter-spacing:-0.02em;color:#f5f7fa;">${escapeForSatori(title)}</div>
          <div style="display:flex;font-size:28px;font-weight:400;line-height:1.4;color:#9ba8b8;max-width:880px;">${escapeForSatori(subtitle)}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:0 72px 64px 72px;">
        <div style="display:flex;font-size:22px;font-weight:400;color:#6b7785;letter-spacing:0.04em;">farros.co</div>
        <div style="display:flex;font-size:22px;font-weight:400;color:#6b7785;">Practical web · security · data</div>
      </div>
    </div>
  `);

  const svg = await satori(tree, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Inter', data: InterRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: InterSemiBold, weight: 600, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    background: '#070b12',
  });
  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      // The image is content-addressed by query string; cache for a year.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

// Sanitise user-provided text before embedding in the SVG string.
// We must escape < > " ' to prevent satori-html from interpreting
// user input as HTML. Ampersand (&) is intentionally NOT escaped:
// satori-html decodes named entities like &amp; but satori then
// re-escapes them in the SVG output, producing a literal "&amp;" in
// the rendered PNG. Keeping & raw gives us a real "&" in the output.
// satori-html still treats unknown entities as text, so user-supplied
// "Hello & unknown;" renders as "Hello & unknown;". That is fine.
function escapeForSatori(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
