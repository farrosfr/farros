import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://porto.farrosfr.com',
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    sitemap({
      xslURL: '/sitemap.xsl',
      namespaces: {
        news: false,
        video: false,
      },
      serialize(item) {
        item.lastmod = new Date().toISOString();
        if (item.url === 'https://porto.farrosfr.com/') {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (
          item.url.includes('/services/') ||
          item.url.includes('/web-porto') ||
          item.url.includes('/writing')
        ) {
          item.priority = 0.8;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (item.url.includes('/cv') || item.url.includes('/contact')) {
          item.priority = 0.7;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else {
          item.priority = 0.6;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        }
        return item;
      },
    }),
  ],
});
