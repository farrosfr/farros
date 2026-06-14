#!/usr/bin/env node

/**
 * Google Indexing API Batch Submitter
 * 
 * This script parses the local Astro sitemap file and submits all URLs
 * directly to the Google Indexing API for immediate crawling and indexing.
 * 
 * Usage:
 *   node scripts/indexing_submit.cjs
 */

const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const CREDENTIALS_FILE = path.join(__dirname, '..', 'gsc-credentials.json');
const SITEMAP_FILE = path.join(__dirname, '..', 'dist', 'sitemap-0.xml');
const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';

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

// 2. Fetch Access Token
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

// 3. Publish URL Notification
function publishUrl(accessToken, url, type = 'URL_UPDATED') {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      url: url,
      type: type
    });
    
    const options = {
      method: 'POST',
      hostname: 'indexing.googleapis.com',
      path: '/v3/urlNotifications:publish',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const req = https.request(options, (res) => {
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
    req.write(body);
    req.end();
  });
}

// 4. Main Runner
async function main() {
  // Verify credentials exist
  if (!fs.existsSync(CREDENTIALS_FILE)) {
    console.error(`\x1b[31mError: Credentials file not found at:\x1b[0m ${CREDENTIALS_FILE}`);
    process.exit(1);
  }
  
  // Verify sitemap exists
  if (!fs.existsSync(SITEMAP_FILE)) {
    console.error(`\x1b[31mError: Sitemap file not found at:\x1b[0m ${SITEMAP_FILE}`);
    console.error('Please run a production build first (e.g. `bun run build`) to generate the sitemap files.');
    process.exit(1);
  }
  
  let credentials;
  try {
    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
  } catch (e) {
    console.error(`\x1b[31mError reading credentials file:\x1b[0m ${e.message}`);
    process.exit(1);
  }
  
  // Parse Sitemap XML
  console.log(`Parsing sitemap file: ${SITEMAP_FILE}`);
  const sitemapXml = fs.readFileSync(SITEMAP_FILE, 'utf-8');
  const parser = new XMLParser();
  const jsonObj = parser.parse(sitemapXml);
  
  const urlEntries = jsonObj.urlset?.url || [];
  const urls = (Array.isArray(urlEntries) ? urlEntries : [urlEntries])
    .map(entry => entry.loc)
    .filter(loc => typeof loc === 'string');
    
  if (urls.length === 0) {
    console.log('No URLs found in the sitemap file.');
    return;
  }
  
  console.log(`Found ${urls.length} URLs in the sitemap.`);
  
  // Authenticate with Google Indexing API
  console.log('Generating JWT assertion and obtaining OAuth2 access token for Indexing API...');
  let token;
  try {
    const jwt = signJwt(credentials, INDEXING_SCOPE);
    token = await getAccessToken(jwt, credentials.token_uri);
    console.log('\x1b[32mSuccessfully authenticated with Google Indexing API!\x1b[0m');
  } catch (err) {
    console.error('\x1b[31mAuthentication failed:\x1b[0m', err.message);
    process.exit(1);
  }
  
  console.log('\nSubmitting URLs for crawling/indexing...');
  for (const url of urls) {
    try {
      await publishUrl(token, url, 'URL_UPDATED');
      console.log(`  \x1b[32m✓ Submitted:\x1b[0m ${url}`);
    } catch (err) {
      console.error(`  \x1b[31m✗ Failed:\x1b[0m ${url} (Status: ${err.statusCode})`, err.error || err);
    }
    // Sleep 150ms between requests to avoid rate limits
    await new Promise(r => setTimeout(r, 150));
  }
  
  console.log('\n\x1b[32m✓ All sitemap URLs submitted successfully!\x1b[0m Google will re-crawl and index these shortly.');
}

main().catch(err => {
  console.error('\x1b[31mUnhandled Error:\x1b[0m', err);
});
