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

Create a .env file from .env.example and set:

- PUBLIC_STRAPI_URL=http://127.0.0.1:1337
- STRAPI_URL=http://127.0.0.1:1337
- STRAPI_COLLECTION=articles
- STRAPI_API_TOKEN=... (optional, for private APIs)

Notes:

- STRAPI_URL is used server-side at build time.
- PUBLIC_STRAPI_URL is fallback for local visibility and debugging.

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

1. Create .env file (or use existing):
   ```
   STRAPI_URL=http://127.0.0.1:1337
   STRAPI_COLLECTION=articles
   ```

2. Ensure Strapi is running:
   ```
   npm --prefix dpk run dev
   ```

3. In a separate terminal, build:
   ```
   npm run build
   ```

The build will pre-render static HTML for each article fetched from Strapi. If Strapi is unavailable, the build will log a warning and still create the site with just the homepage.

For production builds, ensure STRAPI_URL points to your hosted Strapi instance.

## Deploy setup

GitHub Actions workflow in .github/workflows/deploy.yml now builds Astro with Strapi and deploys to Netlify.

The workflow:
1. Installs dependencies for both Astro and Strapi
2. Builds and starts Strapi (production mode)
3. Builds Astro (which pre-renders all article pages from Strapi)
4. Deploys to Netlify (if secrets are configured)

### Netlify deployment (optional)

To enable automatic deployment to Netlify, set these repository secrets in GitHub Settings:

- NETLIFY_AUTH_TOKEN: Your Netlify personal access token
- NETLIFY_SITE_ID: Your Netlify site ID

If these secrets are not configured, the build will succeed but deployment steps will be skipped.

### Strapi configuration for CI/CD

The GitHub Actions workflow automatically:
- Builds the Strapi backend (from `/dpk` folder)
- Starts it in production mode on `http://127.0.0.1:1337`
- Uses it to fetch articles during the Astro build

Optional: Set these secrets if you want to use a hosted Strapi instance instead:

- STRAPI_URL: Your production Strapi backend URL
- STRAPI_API_TOKEN: Optional API token if your Strapi API is private

### Behavior

- Pull requests to main: Build + Netlify preview deploy (if secrets configured)
- Pushes to main: Build + Netlify production deploy (if secrets configured)

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