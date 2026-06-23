# DPK

Astro frontend with an ApostropheCMS backend using the official
`@apostrophecms/apostrophe-astro` integration.

## Project layout

- `./` Astro frontend (rendering and routes)
- `./backend` ApostropheCMS backend (admin UI and content editing)

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a remote MongoDB URI)

## Environment variables

Frontend (`.env` in repo root):

```bash
APOS_HOST=http://localhost:3000
APOS_EXTERNAL_FRONT_KEY=replace-with-a-random-secret
```

Backend (`backend/.env`):

```bash
APOS_PORT=3000
APOS_MONGODB_URI=mongodb://127.0.0.1:27017/dpk-cms
APOS_EXTERNAL_FRONT_KEY=replace-with-the-same-random-secret
```

`APOS_EXTERNAL_FRONT_KEY` must be identical in both frontend and backend.

## Install and run

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Install backend dependencies:

   ```bash
   npm --prefix backend install
   ```

3. Run frontend and backend together:

   ```bash
   npm run dev:all
   ```

4. Open the site at `http://localhost:4321`.

5. Open the Apostrophe login at `http://localhost:4321/login`.

## Article editing UI

- Create an `Article Page` in Apostrophe.
- Add and publish `Article` pieces from the admin UI.
- Astro renders article index and show pages via Apostrophe template mapping.

## Scripts

- `npm run dev` - Astro frontend only
- `npm run dev:cms` - Apostrophe backend only
- `npm run dev:all` - run frontend + backend together
- `npm run build` - build Astro server output
- `npm run preview` - preview Astro output