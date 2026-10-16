-- ============================================
-- COMPLETE DATABASE RESET
-- ============================================
-- This will DELETE ALL DATA and start fresh
-- Only run this if you want to completely reset
-- ============================================

-- Drop all tables (in correct order to avoid foreign key issues)
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.product_sections cascade;
drop table if exists public.product_images cascade;
drop table if exists public.products cascade;
drop table if exists public.sections cascade;
drop table if exists public.categories cascade;
drop table if exists public.banners cascade;
drop table if exists public.store_settings cascade;
drop table if exists public.profiles cascade;

-- Drop all functions
drop function if exists public.handle_new_user() cascade;
drop function if exists public.generate_order_number() cascade;

-- Drop storage policies (we'll recreate them later)
drop policy if exists "Product images are publicly accessible" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;

-- ============================================
-- NOW CREATE EVERYTHING FRESH
-- ============================================

-- 1. PROFILES TABLE
create table public.profiles (
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

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- 2. CATEGORIES TABLE
create table public.categories (
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
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update categories"
  on public.categories for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete categories"
  on public.categories for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. SECTIONS TABLE
create table public.sections (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  label text not null,
  description text,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.sections enable row level security;

create policy "Sections are viewable by everyone"
  on public.sections for select using (true);

-- 4. PRODUCTS TABLE
create table public.products (
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
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update products"
  on public.products for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete products"
  on public.products for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 5. PRODUCT IMAGES TABLE
create table public.product_images (
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
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update product images"
  on public.product_images for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete product images"
  on public.product_images for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 6. PRODUCT SECTIONS TABLE
create table public.product_sections (
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
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete product sections"
  on public.product_sections for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 7. ORDERS TABLE
create table public.orders (
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
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can create orders"
  on public.orders for insert with check (true);

create policy "Admins can update orders"
  on public.orders for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 8. ORDER ITEMS TABLE
create table public.order_items (
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
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
      ))
    )
  );

create policy "Anyone can insert order items"
  on public.order_items for insert with check (true);

-- 9. BANNERS TABLE
create table public.banners (
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
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update banners"
  on public.banners for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete banners"
  on public.banners for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 10. STORE SETTINGS TABLE
create table public.store_settings (
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
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert homepage sections
insert into public.sections (name, label, description) values
  ('best-deals', 'Best deals', 'Products with discounts'),
  ('k-beauty', 'K-Beauty', 'Korean beauty products'),
  ('your-pick', 'Your pick', 'Handpicked by our team'),
  ('for-you', 'For you', 'Recommended products');

-- Insert default store settings
insert into public.store_settings (id, store_name, phone, email, address)
values (1, 'Meili Beauty Shop', '+8801965480023', 'meilibeautybd@gmail.com', 'Mohammadpur, Dhaka, Bangladesh');

-- ============================================
-- CREATE FUNCTIONS & TRIGGERS
-- ============================================

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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

create trigger set_order_number
  before insert on public.orders
  for each row
  when (new.order_number is null)
  execute procedure generate_order_number();

-- ============================================
-- CREATE STORAGE BUCKET
-- ============================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Product images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- CREATE INDEXES
-- ============================================

create index idx_products_category on public.products(category);
create index idx_products_slug on public.products(slug);
create index idx_products_featured on public.products(is_featured);
create index idx_product_images_product on public.product_images(product_id);
create index idx_product_sections_product on public.product_sections(product_id);
create index idx_product_sections_section on public.product_sections(section_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_user on public.orders(user_id);
create index idx_order_items_order on public.order_items(order_id);

-- ============================================
-- ✅ DATABASE RESET COMPLETE!
-- ============================================
-- Now you need to:
-- 1. Create your admin user in Authentication → Users
-- 2. Run this SQL to make yourself admin:
--    update public.profiles set role = 'admin' where email = 'YOUR_EMAIL';
-- ============================================
