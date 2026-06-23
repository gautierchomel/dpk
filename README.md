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

1. npm run build
2. Deploy dist to your static host (Netlify, Vercel, GitHub Pages, etc.)

For production builds, STRAPI_URL should point to your hosted Strapi instance.

## Deploy setup

GitHub Actions workflow in .github/workflows/deploy.yml now builds and deploys Astro to Netlify.

Set these repository secrets:

- NETLIFY_AUTH_TOKEN
- NETLIFY_SITE_ID
- STRAPI_URL
- STRAPI_API_TOKEN (optional if Strapi API is public)

Optional repository variable:

- STRAPI_COLLECTION (defaults to articles)

Behavior:

- Pull requests to main: Netlify preview deploy
- Pushes to main: Netlify production deploy

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