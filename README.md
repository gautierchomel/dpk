# DPK

Astro frontend connected to a Strapi backend.

## Project layout

- ./src/pages/index.astro
   Public article list page from Strapi
- ./src/pages/articles/[slug].astro
   Article detail page route
- ./src/lib/strapi.ts
   Shared Strapi fetch and normalization helpers
- ./dpk
   Strapi project (local backend)

## Prerequisites

- Node.js 18+
- A running Strapi instance (local or hosted)

## Required Strapi collection

Create a collection type named articles with fields (matching your current Strapi project):

- title (text)
- slug (uid)
- description (text)
- cover (media)
- author (relation)
- category (relation)
- blocks (dynamic zone with at least shared.rich-text)

Make sure content is published and readable by the API token or public role.

## Environment variables

### Local Development

Create a `.env` file in the root directory:

```
STRAPI_URL=http://127.0.0.1:1337
STRAPI_COLLECTION=articles
```

**Optional** (if you want to test with remote Strapi):
```
STRAPI_URL=https://your-strapi.onrender.com
STRAPI_API_TOKEN=... (if your API is private)
```

### Strapi Configuration

In `/dpk/.env`, configure your database:

**Local SQLite (default):**
```
DATABASE_CLIENT=sqlite
NODE_ENV=development
```

**Production PostgreSQL (Render):**
```
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
```

Generate secure keys at https://tools.strapi.io/keygen and add to `.env`:
```
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
APP_KEYS=...
```

## Install and run

1. Install frontend dependencies from repo root:
   npm install
2. Install Strapi dependencies:
   npm --prefix dpk install
3. Run Astro + Strapi together:
   npm run dev:all
4. Open:
   - Astro: http://localhost:4321
   - Strapi: http://127.0.0.1:1337/admin

## Build

### Local Build

1. Start Strapi:
   ```
   npm --prefix dpk run dev
   ```

2. In another terminal, build:
   ```
   npm run build
   ```

### Production Build (uses remote Strapi)

The GitHub Actions workflow automatically:
1. Fetches articles from your Render Strapi (via STRAPI_URL secret)
2. Pre-renders all article pages as static HTML
3. Deploys to Netlify/GitHub Pages

If Strapi is unavailable during build, the build will warn and create a site with just the homepage.

## Deploy setup

### Architecture

- **Frontend:** Astro static site deployed to Netlify/GitHub Pages/anywhere
- **Backend:** Strapi deployed to Render (PostgreSQL)
- **CI/CD:** GitHub Actions builds Astro using remote Strapi API, then deploys

### Step 1: Deploy Strapi to Render

1. Push your code to GitHub (if you haven't already):
   ```bash
   git add .
   git commit -m "Add Strapi with Render config"
   git push
   ```

2. Go to https://render.com and create a new **Web Service**
   - Connect your GitHub repo
   - Set the root directory to `/dpk` (Strapi folder)
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`

3. Add environment variables in Render dashboard:
   - `DATABASE_CLIENT` = `postgres`
   - `DATABASE_URL` = (copy from your PostgreSQL database details)
   - `NODE_ENV` = `production`
   - Generate secure keys (go to https://tools.strapi.io/keygen):
     - `API_TOKEN_SALT` = (random string)
     - `ADMIN_JWT_SECRET` = (random string)
     - `JWT_SECRET` = (random string)
     - `APP_KEYS` = (comma-separated random strings)

4. Deploy and wait for Strapi to start
5. Go to `https://your-strapi.onrender.com/admin` and create an admin user
6. Create/publish articles in the admin panel

### Step 2: Configure GitHub Actions

Add these secrets to your GitHub repo (Settings → Secrets):

- `STRAPI_URL`: Your Render Strapi URL (e.g., `https://your-strapi.onrender.com`)
- `STRAPI_API_TOKEN`: (optional, only if your Strapi API is private)

For Netlify deployment (optional):
- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_SITE_ID`: Your Netlify site ID

### Step 3: Push to Trigger Build

When you push to main:
1. GitHub Actions fetches articles from your Render Strapi
2. Astro pre-renders all article pages as static HTML
3. Deploys to Netlify/GitHub Pages (if configured)

### Updating Content

1. Edit articles in your Render Strapi admin: `https://your-strapi.onrender.com/admin`
2. Either:
   - Wait for GitHub Actions to redeploy (requires pushing something to main), OR
   - Manually trigger a rebuild in GitHub Actions or Netlify

To auto-rebuild when content changes, consider:
- Strapi webhooks → GitHub API to trigger Actions
- Scheduled rebuilds (cron job in Actions)
- Netlify build hooks

## Create Strapi admin user

From repo root:

1. Install Strapi dependencies:
   npm --prefix dpk install
2. Create an admin user:
   npm --prefix dpk run strapi -- admin:create --email you@example.com --password "your-password" --firstname Your --lastname Name

Then sign in at http://127.0.0.1:1337/admin

## Scripts

- npm run dev
- npm run dev:strapi
- npm run dev:all
- npm run build
- npm run preview