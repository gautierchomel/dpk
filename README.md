# DPK

Astro static site generator frontend displaying articles from the edrlab.org WordPress site via its public REST API.

## Project layout

- `./src` - Astro frontend source code
- `./src/pages/index.astro` - Article listing page
- WordPress content is fetched from `https://www.edrlab.org/wp-json/wp/v2/`

## Prerequisites

- Node.js 18+
- No database required (content is read from WordPress API)

## Environment variables

No environment variables required. The WordPress API endpoint is hardcoded in the source:

```javascript
const WORDPRESS_API = "https://www.edrlab.org/wp-json/wp/v2";
```

## Install and run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development server:

   ```bash
   npm run dev
   ```

3. Open the site at `http://localhost:4321`.

## Article display

Articles are fetched from the WordPress REST API at build time:

- All published posts are displayed on the index page
- Post metadata (title, excerpt, date, author) is rendered
- Links direct to the full article on the WordPress site

## Scripts

- `npm run dev` - Start Astro development server
- `npm run build` - Build static site output to `./dist`
- `npm run preview` - Preview built site locally

## Deployment

The Astro site generates static HTML that can be deployed to any hosting provider:

- **Netlify**: `npm run build` → deploy `dist` folder
- **GitHub Pages**: `npm run build` → deploy `dist` folder
- **Vercel**: `npm run build` → deploy `dist` folder
- **Any static host**: `npm run build` → deploy `dist` folder