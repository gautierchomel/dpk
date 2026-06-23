create extension if not exists "pgcrypto";

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row
execute function public.update_updated_at_column();

alter table public.articles enable row level security;

drop policy if exists "public can read published articles" on public.articles;
create policy "public can read published articles"
on public.articles
for select
using (published = true);

drop policy if exists "authenticated can read all articles" on public.articles;
create policy "authenticated can read all articles"
on public.articles
for select
to authenticated
using (true);

drop policy if exists "authenticated can insert articles" on public.articles;
create policy "authenticated can insert articles"
on public.articles
for insert
to authenticated
with check (true);

drop policy if exists "authenticated can update articles" on public.articles;
create policy "authenticated can update articles"
on public.articles
for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can delete articles" on public.articles;
create policy "authenticated can delete articles"
on public.articles
for delete
to authenticated
using (true);
