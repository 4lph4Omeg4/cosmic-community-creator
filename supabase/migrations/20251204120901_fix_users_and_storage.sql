-- Create users table if it doesn't exist
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  is_paid boolean default false,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table users enable row level security;

-- Policies for users table
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Allow public read access to users') then
    create policy "Allow public read access to users" on users for select to public using (true);
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Allow public insert access to users') then
    create policy "Allow public insert access to users" on users for insert to public with check (true);
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Allow public update access to users') then
    create policy "Allow public update access to users" on users for update to public using (true);
  end if;
end $$;

-- Supabase Storage Policies
-- IMAGES BUCKET POLICIES
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Allow public read access to images') then
    create policy "Allow public read access to images" on storage.objects for select to anon using (bucket_id = 'starnation-images');
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Allow public list access to images bucket') then
    create policy "Allow public list access to images bucket" on storage.objects for select to anon using (bucket_id = 'starnation-images');
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Allow authenticated users to upload images') then
    create policy "Allow authenticated users to upload images" on storage.objects for insert to authenticated with check (bucket_id = 'starnation-images');
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Allow authenticated users to delete their own images') then
    create policy "Allow authenticated users to delete their own images" on storage.objects for delete to authenticated using (bucket_id = 'starnation-images');
  end if;
end $$;

-- VIDEOS BUCKET POLICIES
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Allow public read access to videos') then
    create policy "Allow public read access to videos" on storage.objects for select to anon using (bucket_id = 'starnation-videos');
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Allow public list access to videos bucket') then
    create policy "Allow public list access to videos bucket" on storage.objects for select to anon using (bucket_id = 'starnation-videos');
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Allow authenticated users to upload videos') then
    create policy "Allow authenticated users to upload videos" on storage.objects for insert to authenticated with check (bucket_id = 'starnation-videos');
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Allow authenticated users to delete their own videos') then
    create policy "Allow authenticated users to delete their own videos" on storage.objects for delete to authenticated using (bucket_id = 'starnation-videos');
  end if;
end $$;
