create table users (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  is_paid boolean default false,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table users enable row level security;

-- Policies
create policy "Allow public read access to users"
  on users for select
  to public
  using (true);

create policy "Allow public insert access to users"
  on users for insert
  to public
  with check (true);

create policy "Allow public update access to users"
  on users for update
  to public
  using (true);
