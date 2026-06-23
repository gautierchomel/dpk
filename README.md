# DPK

Astro + Supabase article site with an integrated editor built in Astro.

## What you get

- Public article homepage at `/`
- Public article detail pages at `/articles/[slug]`
- Admin editor UI at `/admin`
- Supabase-backed CRUD with row-level security
- Cover image upload and preview via Supabase Storage

## Prerequisites

- Node.js 18+
- Supabase project

## Environment variables

Create a `.env` file in the project root:

```bash
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_SUPABASE_STORAGE_BUCKET=article-images
```

`PUBLIC_*` variables are used by browser code in the public site and admin editor.

## Database setup

Apply the migrations in `supabase/migrations` using Supabase SQL Editor, or run:

```bash
supabase db push
```

This migration creates:

- `public.articles` table
- optional cover image fields (`cover_image_url`, `cover_image_path`)
- timestamp update trigger
- `article-images` storage bucket (public read)
- RLS policies:
  - public can read published articles
  - authenticated users can read/insert/update/delete all articles
  - authenticated users can upload/update/delete images in `article-images`

## Create an editor user

In Supabase Dashboard:

1. Go to Authentication → Users
2. Create a user (email/password)
3. Use those credentials on `/admin`

## Install and run

```bash
npm install
npm run dev
```

Open:

- `http://localhost:4321/` for public site
- `http://localhost:4321/admin` for editor

## Build

```bash
npm run build
```

If no Supabase env vars are set, dynamic article pages are skipped at build time.

## Scripts

- `npm run dev` start local dev server
- `npm run build` build static output
- `npm run preview` preview build output