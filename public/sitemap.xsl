<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap · Farros FR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style type="text/css">
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background-color: #070b12;
            color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            padding: 32px 16px;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
          }
          header {
            border-bottom: 1px solid #1e293b;
            padding-bottom: 24px;
            margin-bottom: 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }
          .brand-title {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.02em;
          }
          .brand-title span {
            color: #10b981;
          }
          .badge {
            display: inline-block;
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.25);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 4px 10px;
            border-radius: 9999px;
          }
          .info {
            color: #94a3b8;
            margin-top: 8px;
            font-size: 13px;
          }
          .info a {
            color: #38bdf8;
            text-decoration: none;
          }
          .info a:hover {
            text-decoration: underline;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #0b1324;
            border: 1px solid #1e293b;
            border-radius: 12px;
            overflow: hidden;
          }
          th {
            background: #0f172a;
            color: #94a3b8;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-align: left;
            padding: 14px 18px;
            border-bottom: 1px solid #1e293b;
          }
          td {
            padding: 14px 18px;
            border-bottom: 1px solid #142036;
            color: #cbd5e1;
            font-size: 13px;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background: rgba(255, 255, 255, 0.02);
          }
          .url-link {
            color: #38bdf8;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px;
            text-decoration: none;
            word-break: break-all;
          }
          .url-link:hover {
            color: #7dd3fc;
            text-decoration: underline;
          }
          .meta-pill {
            display: inline-block;
            background: #1e293b;
            color: #94a3b8;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-family: ui-monospace, SFMono-Regular, monospace;
          }
          .priority-pill {
            display: inline-block;
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            font-family: ui-monospace, SFMono-Regular, monospace;
          }
          footer {
            margin-top: 32px;
            color: #64748b;
            font-size: 12px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div>
              <div class="brand-title">Farros <span>FR</span> · XML Sitemap</div>
              <p class="info">
                Generated dynamically for search engine discovery and indexation.
                <a href="/">← Return to porto.farrosfr.com</a>
              </p>
            </div>
            <div>
              <xsl:choose>
                <xsl:when test="sitemap:sitemapindex">
                  <span class="badge">Sitemap Index (<xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> files)</span>
                </xsl:when>
                <xsl:otherwise>
                  <span class="badge"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</span>
                </xsl:otherwise>
              </xsl:choose>
            </div>
          </header>

          <xsl:choose>
            <!-- SITEMAP INDEX -->
            <xsl:when test="sitemap:sitemapindex">
              <table>
                <thead>
                  <tr>
                    <th>Sitemap URL</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <tr>
                      <td>
                        <a class="url-link">
                          <xsl:attribute name="href">
                            <xsl:value-of select="sitemap:loc"/>
                          </xsl:attribute>
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>

            <!-- URLSET -->
            <xsl:otherwise>
              <table>
                <thead>
                  <tr>
                    <th style="width: 50%;">Page URL</th>
                    <th>Last Modified</th>
                    <th>Change Frequency</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td>
                        <a class="url-link">
                          <xsl:attribute name="href">
                            <xsl:value-of select="sitemap:loc"/>
                          </xsl:attribute>
                          <xsl:value-of select="sitemap:loc"/>
                        </a>
                      </td>
                      <td>
                        <span class="meta-pill">
                          <xsl:choose>
                            <xsl:when test="sitemap:lastmod">
                              <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                            </xsl:when>
                            <xsl:otherwise>-</xsl:otherwise>
                          </xsl:choose>
                        </span>
                      </td>
                      <td>
                        <span class="meta-pill">
                          <xsl:choose>
                            <xsl:when test="sitemap:changefreq">
                              <xsl:value-of select="sitemap:changefreq"/>
                            </xsl:when>
                            <xsl:otherwise>-</xsl:otherwise>
                          </xsl:choose>
                        </span>
                      </td>
                      <td>
                        <span class="priority-pill">
                          <xsl:choose>
                            <xsl:when test="sitemap:priority">
                              <xsl:value-of select="sitemap:priority"/>
                            </xsl:when>
                            <xsl:otherwise>0.5</xsl:otherwise>
                          </xsl:choose>
                        </span>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:otherwise>
          </xsl:choose>

          <footer>
            © 2026 Farros FR. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
