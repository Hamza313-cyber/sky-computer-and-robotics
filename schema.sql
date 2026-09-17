-- Enable UUID extension just in case
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. categories
CREATE TABLE categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  image_url text,
  sort_order int default 0,
  is_active bool default true,
  created_at timestamptz default now()
);

-- 2. brands
CREATE TABLE brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo_url text,
  description text,
  is_featured bool default false,
  sort_order int default 0,
  is_active bool default true,
  created_at timestamptz default now()
);

-- 3. products
CREATE TABLE products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  slug text unique not null,
  name text not null,
  category_id uuid references categories(id),
  brand_id uuid references brands(id),
  short_description text,
  description text,
  specs jsonb,
  price numeric(10,2),
  mrp numeric(10,2),
  currency text default 'INR',
  stock_qty int default 0,
  in_stock bool default true,
  warranty_months int,
  images text[],
  is_featured bool default false,
  is_active bool default true,
  search_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index on products (category_id);
create index on products (brand_id);
create index on products (is_active, in_stock);
create index on products using gin (to_tsvector('english', coalesce(search_text, '')));
create index on products (price);

-- 4. enquiries
CREATE TABLE enquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  subject text,
  message text,
  product_id uuid references products(id),
  status text default 'new',
  created_at timestamptz default now()
);

-- 5. page_views
CREATE TABLE page_views (
  id uuid primary key default gen_random_uuid(),
  path text,
  referrer text,
  created_at timestamptz default now()
);

-- 6. Future-proofing
CREATE TABLE orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  total_amount numeric(10,2),
  status text default 'pending',
  created_at timestamptz default now()
);

CREATE TABLE order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity int default 1,
  price_at_time numeric(10,2),
  created_at timestamptz default now()
);

CREATE TABLE cart_items (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  user_id uuid,
  product_id uuid references products(id),
  quantity int default 1,
  created_at timestamptz default now()
);

-- RLS (Row Level Security)

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Categories insert/update/delete by authenticated only" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Policies for brands
CREATE POLICY "Brands are viewable by everyone" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Brands insert/update/delete by authenticated only" ON brands FOR ALL USING (auth.role() = 'authenticated');

-- Policies for products
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Products insert/update/delete by authenticated only" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Policies for enquiries
CREATE POLICY "Enquiries can be inserted by everyone" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enquiries viewable by authenticated only" ON enquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enquiries updatable by authenticated only" ON enquiries FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for page_views
CREATE POLICY "Page views can be inserted by everyone" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Page views viewable by authenticated only" ON page_views FOR SELECT USING (auth.role() = 'authenticated');


-- Seed Data for categories
INSERT INTO categories (slug, name, tagline, description, image_url, sort_order) VALUES
('laptops', 'Laptops', 'Power for every possibility', 'Gaming rigs, business ultrabooks and everyday machines – configured, tested and handed over ready to work.', '/cat-laptops.jpg', 1),
('mobiles', 'Mobiles', 'Next-gen connectivity', 'Latest flagships and dependable everyday phones, with genuine accessories and real warranty support.', '/cat-mobiles.jpg', 2),
('cctv', 'CCTV & Security', 'Watch what matters', 'Complete surveillance setups for homes, shops and offices – survey, installation and mobile viewing included.', '/cat-cctv.jpg', 3),
('gadgets', 'Gadgets', 'Gear up. Stay ahead.', 'Keyboards, headsets, storage, smart devices – everything that makes your setup actually work the way you want.', '/cat-gadgets.jpg', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed Data for brands
INSERT INTO brands (slug, name, description, is_featured, sort_order) VALUES
('apple', 'APPLE', 'MacBooks, iPhones and iPads with genuine warranty, setup and data migration handled in store.', true, 1),
('samsung', 'SAMSUNG', 'Galaxy phones, tablets and monitors – flagship to budget, with genuine accessories and exchange options.', true, 2),
('dell', 'DELL', 'Business laptops, workstations and desktops built to run all day, with on-site service support.', true, 3),
('hp', 'HP', 'Reliable laptops, all-in-ones and printers for home, office and education, with consumables in stock.', true, 4),
('lenovo', 'LENOVO', 'ThinkPad durability and IdeaPad value – solid machines for work, study and everything in between.', true, 5),
('asus', 'ASUS', 'ROG gaming machines, ZenBooks and motherboards – the core of most custom builds we ship.', true, 6),
('sony', 'SONY', 'Audio, cameras and displays from a brand that still gets sound and picture right.', true, 7),
('hikvision', 'HIKVISION', 'Surveillance systems for homes, shops and offices – cameras, DVRs and full installation.', true, 8),
('cp-plus', 'CP PLUS', 'Value-focused security systems that cover the basics well, with easy service and spares.', true, 9),
('logitech', 'LOGITECH', 'Keyboards, mice, webcams and headsets that quietly make every setup better.', true, 10),
('msi', 'MSI', 'Gaming laptops, motherboards and graphics cards for builds that need headroom.', false, 11),
('acer', 'ACER', 'Everyday laptops and monitors that deliver more than their price suggests.', false, 12)
ON CONFLICT (slug) DO NOTHING;
