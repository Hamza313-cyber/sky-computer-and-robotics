-- Create 'product-images' bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB in bytes
  '{"image/jpeg","image/png","image/webp","image/gif","image/svg+xml"}'
) on conflict (id) do update set 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = '{"image/jpeg","image/png","image/webp","image/gif","image/svg+xml"}';

-- Set up RLS for the bucket
-- Note: 'storage.objects' is the table where files are tracked.

-- 1. Allow public read access to the 'product-images' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- 2. Allow authenticated users to upload files
create policy "Authenticated users can upload"
on storage.objects for insert
with check ( auth.role() = 'authenticated' and bucket_id = 'product-images' );

-- 3. Allow authenticated users to update files
create policy "Authenticated users can update"
on storage.objects for update
using ( auth.role() = 'authenticated' and bucket_id = 'product-images' );

-- 4. Allow authenticated users to delete files
create policy "Authenticated users can delete"
on storage.objects for delete
using ( auth.role() = 'authenticated' and bucket_id = 'product-images' );
