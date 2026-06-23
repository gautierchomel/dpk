alter table if exists public.articles
  add column if not exists cover_image_url text,
  add column if not exists cover_image_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

drop policy if exists "public can read article images" on storage.objects;
create policy "public can read article images"
on storage.objects
for select
using (bucket_id = 'article-images');

drop policy if exists "authenticated can upload article images" on storage.objects;
create policy "authenticated can upload article images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'article-images');

drop policy if exists "authenticated can update article images" on storage.objects;
create policy "authenticated can update article images"
on storage.objects
for update
to authenticated
using (bucket_id = 'article-images')
with check (bucket_id = 'article-images');

drop policy if exists "authenticated can delete article images" on storage.objects;
create policy "authenticated can delete article images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'article-images');
