-- ============================================
-- MEILI BEAUTY SHOP - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this entire file in Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste this → Run
-- ============================================

-- 1. PROFILES TABLE (extends Supabase auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  role text default 'customer' check (role in ('admin', 'customer')),
  status text default 'active' check (status in ('active', 'blocked')),
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. CATEGORIES TABLE
-- ============================================
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  image text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Admins can insert categories"
  on public.categories for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update categories"
  on public.categories for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete categories"
  on public.categories for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 3. SECTIONS TABLE (for homepage sections)
-- ============================================
create table if not exists public.sections (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  label text not null,
  description text,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.sections enable row level security;

create policy "Sections are viewable by everyone"
  on public.sections for select using (true);

-- Insert default sections
insert into public.sections (name, label, description) values
  ('best-deals', 'Best deals', 'Products with discounts'),
  ('k-beauty', 'K-Beauty', 'Korean beauty products'),
  ('your-pick', 'Your pick', 'Handpicked by our team'),
  ('for-you', 'For you', 'Recommended products')
on conflict (name) do nothing;


-- 4. PRODUCTS TABLE
-- ============================================
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  price integer not null,
  original_price integer,
  description text,
  short_description text,
  category text not null,
  stock integer default 0,
  rating numeric default 0,
  review_count integer default 0,
  is_featured boolean default false,
  seo_title text,
  seo_description text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 5. PRODUCT IMAGES TABLE (multiple images per product)
-- ============================================
create table if not exists public.product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products on delete cascade not null,
  image_url text not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.product_images enable row level security;

create policy "Product images are viewable by everyone"
  on public.product_images for select using (true);

create policy "Admins can insert product images"
  on public.product_images for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update product images"
  on public.product_images for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete product images"
  on public.product_images for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 6. PRODUCT SECTIONS TABLE (many-to-many)
-- ============================================
create table if not exists public.product_sections (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products on delete cascade not null,
  section_id uuid references public.sections on delete cascade not null,
  created_at timestamp with time zone default timezone('utc', now()),
  unique(product_id, section_id)
);

alter table public.product_sections enable row level security;

create policy "Product sections are viewable by everyone"
  on public.product_sections for select using (true);

create policy "Admins can insert product sections"
  on public.product_sections for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete product sections"
  on public.product_sections for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 7. ORDERS TABLE
-- ============================================
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  city text,
  notes text,
  total integer not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method text default 'Cash on delivery',
  user_id uuid references public.profiles on delete set null,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  using (
    auth.uid() = user_id or
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Anyone can create orders"
  on public.orders for insert
  with check (true);

create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-generate order number
create or replace function generate_order_number()
returns trigger as $$
declare
  counter integer;
begin
  select count(*) + 1 into counter from public.orders;
  new.order_number := 'ORD-' || lpad(counter::text, 5, '0');
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_order_number on public.orders;
create trigger set_order_number
  before insert on public.orders
  for each row
  when (new.order_number is null)
  execute procedure generate_order_number();


-- 8. ORDER ITEMS TABLE
-- ============================================
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  title text not null,
  quantity integer not null,
  price integer not null,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.order_items enable row level security;

create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      ))
    )
  );

create policy "Anyone can insert order items"
  on public.order_items for insert
  with check (true);


-- 9. BANNERS TABLE
-- ============================================
create table if not exists public.banners (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  image text not null,
  link text,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

alter table public.banners enable row level security;

create policy "Banners are viewable by everyone"
  on public.banners for select using (true);

create policy "Admins can insert banners"
  on public.banners for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update banners"
  on public.banners for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete banners"
  on public.banners for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 10. STORE SETTINGS TABLE (single row)
-- ============================================
create table if not exists public.store_settings (
  id integer primary key default 1,
  store_name text default 'Meili Beauty Shop',
  logo text default '✨',
  seo_title text,
  seo_description text,
  phone text,
  email text,
  address text,
  facebook text,
  instagram text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now()),
  constraint single_row check (id = 1)
);

alter table public.store_settings enable row level security;

create policy "Store settings are viewable by everyone"
  on public.store_settings for select using (true);

create policy "Admins can update store settings"
  on public.store_settings for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert default store settings
insert into public.store_settings (id, store_name, phone, email, address)
values (1, 'Meili Beauty Shop', '+8801965480023', 'meilibeautybd@gmail.com', 'Mohammadpur, Dhaka, Bangladesh')
on conflict (id) do nothing;


-- 11. CREATE STORAGE BUCKET
-- ============================================
-- Create the product-images bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Product images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images' and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- 12. HELPFUL INDEXES
-- ============================================
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_featured on public.products(is_featured);
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_product_sections_product on public.product_sections(product_id);
create index if not exists idx_product_sections_section on public.product_sections(section_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);


-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Go to Authentication → Users → Add user
--    Create your admin account with email/password
-- 2. Go to SQL Editor and run:
--    update public.profiles set role = 'admin'
--    where email = 'your-admin-email@example.com';
-- 3. Set environment variables in Vercel:
--    VITE_SUPABASE_URL = your supabase url
--    VITE_SUPABASE_ANON_KEY = your anon key
-- 4. Redeploy!
-- ============================================
