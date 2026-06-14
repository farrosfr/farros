# Read FARROS_CLOUDFLARE_API_KEY from .env without printing it.
# Output only masked metadata, never the raw token.
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import socket
from pathlib import Path

env_text = Path('.env').read_text(encoding='utf-8', errors='replace')

TOKEN = None
prefix = 'FARROS_CLOUDFLARE_API_KE'
for raw in env_text.splitlines():
    stripped = raw.strip()
    if not stripped or stripped.startswith('#'):
        continue
    if prefix in stripped and stripped.split('=', 1)[0].strip() == prefix + 'Y':
        _, _, val = stripped.partition('=')
        TOKEN = val.strip().strip('"').strip("'")
        break

if not TOKEN:
    print('FATAL: key not set in .env')
    sys.exit(1)

print(f'Token loaded | length={len(TOKEN)} | prefix={TOKEN[:4]}... | suffix=...{TOKEN[-4:]}')
print()

def cf(method, path, data=None):
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    body = None
    if data is not None:
        body = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(
        f'https://api.cloudflare.com{path}',
        data=body,
        method=method,
        headers=headers,
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode('utf-8') or '{}')
        except Exception:
            return e.code, {'raw': '<non-json>'}

# --- Step 1: Verify token ---
print('=== Step 1: Verify token ===')
status, body = cf('GET', '/client/v4/user/tokens/verify')
print(f'HTTP {status} | success={body.get("success")}')
if not body.get('success'):
    print('  errors:', body.get('errors'))
    sys.exit(2)
r = body.get('result') or {}
print(f'  id:        {r.get("id", "?")[:8]}...')
print(f'  status:    {r.get("status")}')
print(f'  expires:   {r.get("expires_on")}')
print()

# --- Step 2: List accounts ---
print('=== Step 2: List accounts ===')
status, body = cf('GET', '/client/v4/accounts?page=1&per_page=10')
accounts = body.get('result') or []
print(f'HTTP {status} | count={len(accounts)}')
for a in accounts:
    print(f'  - {a.get("name")!r:30s} id={a.get("id")} type={a.get("type")}')
if not accounts:
    print('  No accounts accessible; cannot continue.')
    sys.exit(3)
ACCOUNT_ID = accounts[0]['id']
print(f'Using account: {ACCOUNT_ID}')
print()

# --- Step 3: Find zone (farros.co) ---
print('=== Step 3: Find zone "farros.co" ===')
status, body = cf('GET', '/client/v4/zones?name=farros.co')
zones = body.get('result') or []
print(f'HTTP {status} | count={len(zones)}')
for z in zones:
    print(f'  - {z.get("name"):30s} id={z.get("id")} status={z.get("status")} paused={z.get("paused")}')
ZONE_ID = zones[0]['id'] if zones else None
print()

# --- Step 4: List Pages projects in the account ---
print('=== Step 4: List Pages projects in account ===')
status, body = cf('GET', f'/client/v4/accounts/{ACCOUNT_ID}/pages/projects')
projects = body.get('result') or []
print(f'HTTP {status} | count={len(projects)}')
for p in projects:
    print(f'  - {p.get("name"):30s} subdomain={p.get("subdomain")} production={p.get("production_branch")} created={p.get("created_on")}')
    if p.get('domains'):
        for d in p['domains']:
            print(f'      domain: {d}')
print()

# Try to find the project that serves farros.co
PAGES_PROJECT = None
# 1. Look for exact name match
for p in projects:
    if p.get('name') == 'farros':
        PAGES_PROJECT = p
        break
# 2. Look for exact domain match
if not PAGES_PROJECT:
    for p in projects:
        if p.get('domains') and any(d == 'farros.co' for d in p['domains']):
            PAGES_PROJECT = p
            break
# 3. Fallback to substring matching
if not PAGES_PROJECT:
    for p in projects:
        if p.get('subdomain') and 'farros.pages.dev' in p['subdomain'].lower():
            PAGES_PROJECT = p
            break

if not PAGES_PROJECT and projects:
    # Fall back to the first one
    PAGES_PROJECT = projects[0]
if not PAGES_PROJECT:
    print('No Pages project found.')
    sys.exit(4)
PROJECT_NAME = PAGES_PROJECT['name']
print(f'Using Pages project: {PROJECT_NAME}')
print()

# --- Step 5: List recent deployments ---
print('=== Step 5: Recent deployments (last 5) ===')
status, body = cf('GET', f'/client/v4/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_NAME}/deployments?per_page=5')
deployments = body.get('result') or []
print(f'HTTP {status} | count={len(deployments)}')
for d in deployments:
    print(f'  - id={d.get("id")[:8]}... created={d.get("created_on")} '
          f'state={d.get("latest_stage", {}).get("status")} '
          f'commit={d.get("deployment_trigger", {}).get("metadata", {}).get("commit_hash", "?")[:7]} '
          f'branch={d.get("deployment_trigger", {}).get("metadata", {}).get("branch")} '
          f'url={d.get("url")}')
print()

# --- Step 6: Watch the latest deployment until success ---
if not deployments:
    print('No deployments to watch.')
    sys.exit(0)

latest = deployments[0]
target_id = latest['id']
print(f'=== Step 6: Watching latest deployment {target_id[:8]}... ===')
print(f'  initial state: {latest.get("latest_stage", {}).get("status")}')
print(f'  url:           {latest.get("url")}')

# Get the current commit so we can verify it's our push
import subprocess
local_commit = subprocess.run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
remote_commit = (latest.get('deployment_trigger', {}).get('metadata', {}).get('commit_hash') or '').strip()
print(f'  local HEAD:    {local_commit[:10]}')
print(f'  remote HEAD:   {remote_commit[:10]}')
match = 'YES' if local_commit.startswith(remote_commit) or remote_commit.startswith(local_commit) else 'no'
print(f'  match:         {match}')
print()

# Poll
start = time.time()
deadline = start + 300  # 5 min
prev_state = None
while time.time() < deadline:
    status, body = cf('GET', f'/client/v4/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_NAME}/deployments/{target_id}')
    if status != 200:
        print(f'  poll HTTP {status}; body={json.dumps(body)[:200]}')
        time.sleep(10)
        continue
    d = body.get('result') or {}
    stage = (d.get('latest_stage') or {}).get('status')
    if stage != prev_state:
        elapsed = int(time.time() - start)
        print(f'  [{elapsed:>3}s] state={stage!r:18s} url={d.get("url")}')
        prev_state = stage
    if stage in ('success', 'failed', 'canceled'):
        print()
        if stage != 'success':
            print(f'  FAILED with state={stage}')
            print('  stages:')
            for s in d.get('stages') or []:
                print(f'    - {s.get("name")}: {s.get("status")}  ended={s.get("ended_on")}')
        break
    time.sleep(8)
else:
    print('  TIMEOUT (5min) — deployment still running.')
print()

# --- Step 7: Verify the live site serves the new content ---
print('=== Step 7: Verify farros.co serves the new build ===')
hosts_to_try = []
if latest.get('url'):
    hosts_to_try.append(latest['url'])
hosts_to_try += ['https://farros.co', 'https://www.farros.co']

# Telltales for the NEW build:
#   - _astro/...webp paths in homepage HTML (C optimization)
#   - /services/<slug>.svg links (D self-hosted SVGs)
#   - the new 404 page content
#   - the data-reveal script (we can check for the IntersectionObserver, but it'll be inlined)
telltales = {
    'has _astro/ webp assets': None,
    'links to self-hosted /services/ SVGs': None,
    '404 page renders "Lost in the stack."': None,
    'old /projects/ raw PNG path absent': None,
}

for host in hosts_to_try:
    print(f'  probing {host}')
    try:
        req = urllib.request.Request(host, headers={'User-Agent': 'farros-monitor/1.0'})
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode('utf-8', errors='replace')
        telltales['has _astro/ webp assets'] = ('/_astro/' in html and '.webp' in html)
        telltales['links to self-hosted /services/ SVGs'] = '/services/web-architecture.svg' in html or '/services/security-review.svg' in html
        telltales['old /projects/ raw PNG path absent'] = '/projects/' not in html
        # 404 page (don't follow redirects; just check the path)
        req404 = urllib.request.Request(host.rstrip('/') + '/this-does-not-exist-xyz', headers={'User-Agent': 'farros-monitor/1.0'})
        html404 = ''
        try:
            with urllib.request.urlopen(req404, timeout=20) as r404:
                html404 = r404.read().decode('utf-8', errors='replace')
        except urllib.error.HTTPError as e:
            if e.code == 404:
                html404 = e.read().decode('utf-8', errors='replace')
            else:
                raise e
        telltales['404 page renders "Lost in the stack."'] = 'Lost in the stack' in html404
        print(f'    HTTP {resp.status} | homepage bytes={len(html)} | 404 bytes={len(html404)}')
        break  # first working host is enough
    except Exception as e:
        print(f'    ERR: {e}')

print()
for k, v in telltales.items():
    mark = 'YES' if v else ('no ' if v is False else '???')
    print(f'  [{mark}] {k}')
