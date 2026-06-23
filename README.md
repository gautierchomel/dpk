# DPK

An Astro website wired to a Supabase backend. The homepage renders a small community board that
reads from and writes to a Supabase `messages` table.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file:

   ```bash
   PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Create the backing table in Supabase:

   ```sql
   create table if not exists public.messages (
     id bigint generated always as identity primary key,
     name text not null,
     message text not null,
     created_at timestamptz not null default timezone('utc', now())
   );

   alter table public.messages enable row level security;

   create policy "Allow public reads" on public.messages
     for select using (true);

   create policy "Allow public inserts" on public.messages
     for insert with check (true);
   ```

4. Start the Astro site:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - run the Astro development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally