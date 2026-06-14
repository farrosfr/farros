#!/usr/bin/env node

/**
 * Google Search Console API Client for Farros.co
 * 
 * This script connects to the Google Search Console API using a Google Service Account.
 * It does not require any npm package installs (uses native Node.js crypto and https modules).
 * 
 * Setup:
 * 1. Create a service account in Google Cloud Console:
 *    https://console.cloud.google.com/iam-admin/serviceaccounts
 * 2. Grant the service account access to the Google Search Console API.
 * 3. Create and download a service account JSON key.
 * 4. Save the key as 'gsc-credentials.json' in the project root directory.
 * 5. Add the service account email (e.g., service-account@project.iam.gserviceaccount.com) 
 *    as an owner or user in Google Search Console settings for your property (https://farros.co/).
 * 
 * Usage:
 *   node scripts/gsc_client.js inspect <url>
 *   node scripts/gsc_client.js sitemaps [list|submit <sitemapUrl>]
 *   node scripts/gsc_client.js query [daysAgo]
 */

const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_FILE = path.join(__dirname, '..', 'gsc-credentials.json');
const SITE_URL = 'sc-domain:farros.co';
const API_SCOPE = 'https://www.googleapis.com/auth/webmasters';

// Help helper
function printUsage() {
  console.log(`
\x1b[1m\x1b[36mGoogle Search Console API Client\x1b[0m
Usage:
  \x1b[33mnode scripts/gsc_client.cjs list-sites\x1b[0m
      List all Search Console properties/sites authorized for this service account.

  \x1b[33mnode scripts/gsc_client.cjs inspect <url>\x1b[0m
      Inspect a URL to check indexation status, crawling details, and issues.
      Example: node scripts/gsc_client.cjs inspect https://farros.co/cv

  \x1b[33mnode scripts/gsc_client.cjs sitemaps list\x1b[0m
      List all sitemaps registered in Search Console.

  \x1b[33mnode scripts/gsc_client.cjs sitemaps submit <sitemapUrl>\x1b[0m
      Submit a sitemap to Search Console.
      Example: node scripts/gsc_client.cjs sitemaps submit https://farros.co/sitemap-index.xml

  \x1b[33mnode scripts/gsc_client.cjs query [daysAgo]\x1b[0m
      Query performance reports (clicks, impressions, position).
      Example: node scripts/gsc_client.cjs query 7
  `);
}

// 1. JWT Signer
function signJwt(serviceAccount, scope) {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: scope,
    aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  
  const base64UrlEncode = (obj) => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };
  
  const tokenInput = base64UrlEncode(header) + '.' + base64UrlEncode(payload);
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(tokenInput);
  const signature = signer.sign(serviceAccount.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  return tokenInput + '.' + signature;
}

// 2. Fetch Access Token using JWT assertion
function getAccessToken(jwt, tokenUri) {
  return new Promise((resolve, reject) => {
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;
    const req = https.request(tokenUri || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) {
            resolve(parsed.access_token);
          } else {
            reject(new Error(`OAuth Token request failed: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse token response: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 3. Helper to make authenticated Google API calls
function googleApi(accessToken, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    const hostname = path.startsWith('/v1/urlInspection')
      ? 'searchconsole.googleapis.com'
      : 'www.googleapis.com';
    const req = https.request(`https://${hostname}${path}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data || '{}');
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ statusCode: res.statusCode, error: parsed });
          }
        } catch (e) {
          reject({ statusCode: res.statusCode, error: data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function listAuthorizedSites(accessToken) {
  console.log('\n\x1b[36mListing authorized sites for this service account...\x1b[0m');
  try {
    const response = await googleApi(
      accessToken,
      'GET',
      '/webmasters/v3/sites'
    );
    
    const sites = response.siteEntry || [];
    if (sites.length === 0) {
      console.log('No sites are authorized for this service account.');
      console.log('Make sure you have added the service account email as a User/Owner in Search Console settings.');
      return;
    }
    
    console.log('\n\x1b[1m--- Authorized Sites / Properties ---\x1b[0m');
    sites.forEach(s => {
      console.log(`- Site URL: \x1b[32m${s.siteUrl}\x1b[0m (Permission: ${s.permissionLevel})`);
    });
  } catch (err) {
    console.error('\x1b[31mError listing sites:\x1b[0m', err.error || err);
  }
}

// 4. Specific Search Console methods
async function inspectUrl(accessToken, url) {
  console.log(`\n\x1b[36mInspecting URL:\x1b[0m ${url}`);
  try {
    const response = await googleApi(
      accessToken,
      'POST',
      '/v1/urlInspection/index:inspect',
      {
        inspectionUrl: url,
        siteUrl: SITE_URL,
        languageCode: 'en'
      }
    );
    
    const result = response.inspectionResult;
    if (!result) {
      console.log('No inspection result returned.');
      return;
    }
    
    const status = result.indexStatusResult;
    console.log('\n\x1b[1m--- URL Inspection Summary ---\x1b[0m');
    console.log(`Coverage Status:   \x1b[33m${status.coverageState || 'Unknown'}\x1b[0m`);
    console.log(`Verdict:           ${status.verdict === 'VERDICT_UNSPECIFIED' ? '\x1b[31mNot Indexed / Issue\x1b[0m' : `\x1b[32m${status.verdict}\x1b[0m`}`);
    console.log(`User Canonical:    ${status.userDeclaredCanonical || 'None'}`);
    console.log(`Google Canonical:  ${status.googleCanonical || 'None'}`);
    console.log(`RobotsTxtState:    ${status.robotsTxtState}`);
    console.log(`IndexingState:     ${status.indexingState}`);
    console.log(`Last Crawl Time:   ${status.lastCrawlTime || 'Never'}`);
    console.log(`Crawl Allowed:     ${status.crawlAllowedToFetch ? '\x1b[32mYes\x1b[0m' : '\x1b[31mNo\x1b[0m'}`);
    console.log(`Page Fetch State:  ${status.pageFetchState}`);
    console.log(`Mobile Friendly:   ${result.mobileUsabilityResult ? result.mobileUsabilityResult.verdict : 'N/A'}`);

    
  } catch (err) {
    console.error('\x1b[31mError inspecting URL:\x1b[0m', err.error || err);
  }
}

async function listSitemaps(accessToken) {
  console.log('\n\x1b[36mListing Sitemaps for site:\x1b[0m ' + SITE_URL);
  try {
    const encodedSite = encodeURIComponent(SITE_URL);
    const response = await googleApi(
      accessToken,
      'GET',
      `/webmasters/v3/sites/${encodedSite}/sitemaps`
    );
    
    const list = response.sitemap || [];
    if (list.length === 0) {
      console.log('No sitemaps found registered for this site.');
      return;
    }
    
    console.log('\n\x1b[1m--- Registered Sitemaps ---\x1b[0m');
    list.forEach(sitemap => {
      console.log(`\nSitemap:      \x1b[32m${sitemap.path}\x1b[0m`);
      console.log(`Last Updated: ${sitemap.lastDownloaded || 'N/A'}`);
      console.log(`Status:       ${sitemap.errors > 0 ? '\x1b[31mErrors\x1b[0m' : '\x1b[32mOK\x1b[0m'} (Errors: ${sitemap.errors}, Warnings: ${sitemap.warnings})`);
      console.log(`URL Count:    ${sitemap.contents ? sitemap.contents.map(c => `${c.type}: ${c.submitted}`).join(', ') : '0'}`);
    });
  } catch (err) {
    console.error('\x1b[31mError listing sitemaps:\x1b[0m', err.error || err);
  }
}

async function submitSitemap(accessToken, sitemapUrl) {
  console.log(`\n\x1b[36mSubmitting Sitemap:\x1b[0m ${sitemapUrl}`);
  try {
    const encodedSite = encodeURIComponent(SITE_URL);
    const encodedSitemap = encodeURIComponent(sitemapUrl);
    await googleApi(
      accessToken,
      'PUT',
      `/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedSitemap}`
    );
    console.log('\x1b[32m✓ Sitemap submitted successfully!\x1b[0m It may take Google some time to crawl and parse.');
  } catch (err) {
    console.error('\x1b[31mError submitting sitemap:\x1b[0m', err.error || err);
  }
}

async function queryPerformance(accessToken, daysAgo = 30) {
  console.log(`\n\x1b[36mQuerying Search Performance for last ${daysAgo} days...\x1b[0m`);
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDateObj = new Date();
    startDateObj.setDate(startDateObj.getDate() - parseInt(daysAgo));
    const startDate = startDateObj.toISOString().split('T')[0];
    
    const encodedSite = encodeURIComponent(SITE_URL);
    const response = await googleApi(
      accessToken,
      'POST',
      `/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
      {
        startDate: startDate,
        endDate: endDate,
        dimensions: ['query'],
        rowLimit: 15
      }
    );
    
    const rows = response.rows || [];
    if (rows.length === 0) {
      console.log('No search performance data returned for this period.');
      return;
    }
    
    console.log(`\n\x1b[1m--- Top Search Queries (${startDate} to ${endDate}) ---\x1b[0m`);
    console.log(String('Query').padEnd(30) + ' | ' + String('Clicks').padStart(8) + ' | ' + String('Impressions').padStart(12) + ' | ' + String('CTR').padStart(8) + ' | ' + String('Position').padStart(8));
    console.log('-'.repeat(74));
    
    rows.forEach(r => {
      const queryStr = r.keys ? r.keys[0] : 'Unknown';
      const clicks = r.clicks;
      const impressions = r.impressions;
      const ctr = (r.ctr * 100).toFixed(1) + '%';
      const pos = r.position.toFixed(1);
      console.log(queryStr.padEnd(30) + ' | ' + String(clicks).padStart(8) + ' | ' + String(impressions).padStart(12) + ' | ' + ctr.padStart(8) + ' | ' + String(pos).padStart(8));
    });
  } catch (err) {
    console.error('\x1b[31mError querying performance:\x1b[0m', err.error || err);
  }
}

// Main Runner
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'help' || command === '--help') {
    printUsage();
    return;
  }
  
  // Verify credentials exist
  if (!fs.existsSync(CREDENTIALS_FILE)) {
    console.error(`\x1b[31mError: Credentials file not found at:\x1b[0m ${CREDENTIALS_FILE}`);
    console.error('\nTo connect to the Search Console API, please place your Service Account key file');
    console.error("in the root of this project and rename it to 'gsc-credentials.json'.");
    console.error('\nFollow the setup guide in the file comments:');
    console.error('  https://console.cloud.google.com/iam-admin/serviceaccounts');
    process.exit(1);
  }
  
  let credentials;
  try {
    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
  } catch (e) {
    console.error(`\x1b[31mError reading credentials file:\x1b[0m ${e.message}`);
    process.exit(1);
  }
  
  console.log('Generating JWT assertion and obtaining OAuth2 access token...');
  let token;
  try {
    const jwt = signJwt(credentials, API_SCOPE);
    token = await getAccessToken(jwt, credentials.token_uri);
    console.log('\x1b[32mSuccessfully authenticated with Google OAuth2!\x1b[0m');
  } catch (err) {
    console.error('\x1b[31mAuthentication failed:\x1b[0m', err.message);
    process.exit(1);
  }
  
  if (command === 'list-sites') {
    await listAuthorizedSites(token);
  } else if (command === 'inspect') {
    const url = args[1];
    if (!url) {
      console.error('\x1b[31mError: No URL provided to inspect.\x1b[0m');
      printUsage();
      process.exit(1);
    }
    await inspectUrl(token, url);
  } else if (command === 'sitemaps') {
    const subCommand = args[1];
    if (subCommand === 'list') {
      await listSitemaps(token);
    } else if (subCommand === 'submit') {
      const sitemapUrl = args[2] || 'https://farros.co/sitemap-index.xml';
      await submitSitemap(token, sitemapUrl);
    } else {
      console.error(`\x1b[31mError: Unknown sitemaps sub-command '${subCommand || ''}'.\x1b[0m`);
      printUsage();
      process.exit(1);
    }
  } else if (command === 'query') {
    const days = args[1] || 30;
    await queryPerformance(token, days);
  } else {
    console.error(`\x1b[31mError: Unknown command '${command}'.\x1b[0m`);
    printUsage();
    process.exit(1);
  }
}

main().catch(err => {
  console.error('\x1b[31mUnhandled Error:\x1b[0m', err);
});
