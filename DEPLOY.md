# Apartment Finder — Deployment Guide

## Quick Start (Local Only)
Just open `index.html` in your browser. Data saves to localStorage (per-browser, no sharing).

---

## Full Setup: Shared Between Both of You

### Step 1: Create a free Cloudflare account
Go to https://dash.cloudflare.com/sign-up — it's free.

### Step 2: Install Wrangler (Cloudflare's CLI)
```bash
npm install -g wrangler
wrangler login
```

### Step 3: Create the KV namespace
```bash
cd apartment-finder
npx wrangler kv namespace create APARTMENT_DATA
```
This prints a namespace ID. Copy it.

### Step 4: Update wrangler.toml
Open `wrangler.toml` and replace `REPLACE_WITH_YOUR_NAMESPACE_ID` with the ID from step 3.

### Step 5: Deploy the worker
```bash
npx wrangler deploy
```
This gives you a URL like: `https://apartment-finder.your-subdomain.workers.dev`

### Step 6: Host the frontend
**Option A — Cloudflare Pages (recommended):**
```bash
npx wrangler pages project create apartment-finder-ui
npx wrangler pages deploy . --project-name apartment-finder-ui
```
This gives you a URL like: `https://apartment-finder-ui.pages.dev`

**Option B — Just share the HTML file:**
Send `index.html` to your wife. Both of you open it locally.

### Step 7: Connect
Open the site, paste the Worker URL into the settings bar at the top, and click Connect.
Both of you do this once — after that, data syncs automatically every 30 seconds.

---

## How It Works
- The HTML file is the entire frontend (no build step needed)
- Data saves to localStorage AND syncs to Cloudflare KV via the Worker
- When either of you makes a change (add notes, nix a property), it syncs
- The other person sees changes within 30 seconds
- If the Worker is down, everything still works locally

## Costs
- Cloudflare Workers free tier: 100,000 requests/day — more than enough
- Cloudflare KV free tier: 100,000 reads/day, 1,000 writes/day — more than enough
- Cloudflare Pages: free for personal use
- **Total cost: $0**
