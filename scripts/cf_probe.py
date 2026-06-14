#!/usr/bin/env python3
"""Probe Cloudflare to figure out what serves farros.co."""
import json
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path

env_text = Path('.env').read_text(encoding='utf-8', errors='replace')
TOKEN = None
prefix = 'FARROS_CLOUDFLARE_API_KE'
for raw in env_text.splitlines():
    s = raw.strip()
    if not s or s.startswith('#'):
        continue
    if prefix in s and s.split('=', 1)[0].strip() == prefix + 'Y':
        _, _, val = s.partition('=')
        TOKEN = val.strip().strip('"').strip("'")
        break
if not TOKEN:
    sys.exit('FATAL: key not set')

def cf(method, path, data=None):
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(f'https://api.cloudflare.com/client/v4{path}', data=body, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode() or '{}')
        except Exception:
            return e.code, {'raw': '<non-json>'}

ACCT = 'e4fa0d210416e75d5ef8bbef12fff586'
ZONE = 'cd6f9633c8751cc1e8b6dffee6c0fc1f'

def probe(label, method, path):
    print(f'\n--- {label}  {method} {path}')
    status, body = cf(method, path)
    print(f'  HTTP {status} | success={body.get("success") if isinstance(body, dict) else "?"}')
    if not (isinstance(body, dict) and body.get('success')):
        print('  errors:', body.get('errors') if isinstance(body, dict) else body)
        if isinstance(body, dict) and body.get('result_info'):
            print('  result_info:', body.get('result_info'))
        return
    res = body.get('result')
    if isinstance(res, list):
        print(f'  result: list[{len(res)}]')
        for x in res[:10]:
            if isinstance(x, dict):
                keys = ['name', 'id', 'type', 'status', 'hostname', 'target', 'deployment_id', 'subdomain', 'domains']
                summary = {k: x.get(k) for k in keys if k in x}
                print('   -', summary)
    elif isinstance(res, dict):
        print('  result keys:', list(res.keys())[:12])
        for k in list(res.keys())[:8]:
            v = res[k]
            if isinstance(v, (str, int, float, bool, type(None))):
                print(f'    {k} = {v!r}')

probe('A) Pages projects',          'GET', f'/accounts/{ACCT}/pages/projects')
probe('B) Workers scripts',         'GET', f'/accounts/{ACCT}/workers/scripts?per_page=20')
probe('C) R2 buckets',              'GET', f'/accounts/{ACCT}/r2/buckets?per_page=20')
probe('D) DNS records (A only)',    'GET', f'/zones/{ZONE}/dns_records?type=A&per_page=20')
probe('E) DNS records (all)',       'GET', f'/zones/{ZONE}/dns_records?per_page=20')
probe('F) Zone settings overview',  'GET', f'/zones/{ZONE}/settings')
probe('G) Custom hostnames',        'GET', f'/zones/{ZONE}/custom_hostnames?per_page=20')
probe('H) Workers routes',          'GET', f'/zones/{ZONE}/workers/routes?per_page=20')
