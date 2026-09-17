-- seed_products.sql

INSERT INTO products (sku, slug, name, short_description, description, price, mrp, stock_qty, in_stock, warranty_months, category_id, brand_id, specs) VALUES 
-- LAPTOPS
(
  'APP-MBP16-M3M', 'macbook-pro-16-m3-max', 'Apple MacBook Pro 16" (M3 Max)', 
  '16-core CPU, 40-core GPU, 48GB Unified Memory, 1TB SSD',
  'The most advanced Mac ever built for extreme workflows. Powered by the M3 Max chip with hardware-accelerated ray tracing and mesh shading, it breezes through complex 3D rendering and video editing. The 16-inch Liquid Retina XDR display delivers extreme dynamic range.',
  319900, 349900, 15, true, 12,
  (SELECT id FROM categories WHERE slug = 'laptops'),
  (SELECT id FROM brands WHERE slug = 'apple'),
  '{"processor": "Apple M3 Max", "ram": "48GB Unified", "storage": "1TB SSD", "display": "16.2-inch Liquid Retina XDR", "os": "macOS"}'::jsonb
),
(
  'DEL-XPS15-9530', 'dell-xps-15-oled', 'Dell XPS 15 (9530) OLED', 
  'Intel Core i7-13700H, RTX 4060, 32GB RAM, 1TB SSD, 3.5K OLED',
  'A perfect balance of power and portability. The Dell XPS 15 features a stunning 3.5K OLED touch display with InfinityEdge borders, powered by a 13th Gen Intel Core i7 processor and NVIDIA RTX 4060 graphics, ideal for creators and professionals.',
  245000, 269000, 10, true, 12,
  (SELECT id FROM categories WHERE slug = 'laptops'),
  (SELECT id FROM brands WHERE slug = 'dell'),
  '{"processor": "Intel Core i7-13700H", "ram": "32GB DDR5", "storage": "1TB PCIe NVMe SSD", "display": "15.6-inch 3.5K OLED Touch", "os": "Windows 11 Pro", "graphics": "NVIDIA GeForce RTX 4060 8GB"}'::jsonb
),
(
  'ASU-ROG-G14', 'asus-rog-zephyrus-g14', 'ASUS ROG Zephyrus G14', 
  'AMD Ryzen 9 7940HS, RTX 4070, 16GB RAM, 1TB SSD',
  'Unrivaled gaming performance in a 14-inch chassis. The ROG Zephyrus G14 is powered by an AMD Ryzen 9 processor and NVIDIA RTX 4070, featuring an AniMe Matrix LED display on the lid and a gorgeous Nebula HDR display for gaming on the go.',
  175000, 199990, 8, true, 12,
  (SELECT id FROM categories WHERE slug = 'laptops'),
  (SELECT id FROM brands WHERE slug = 'asus'),
  '{"processor": "AMD Ryzen 9 7940HS", "ram": "16GB DDR5", "storage": "1TB PCIe Gen4 SSD", "display": "14-inch QHD+ 165Hz Nebula", "os": "Windows 11 Home", "graphics": "NVIDIA GeForce RTX 4070 8GB"}'::jsonb
),
(
  'HP-SPEC-14', 'hp-spectre-x360-14', 'HP Spectre x360 14', 
  'Intel Core Ultra 7 155H, 32GB RAM, 2TB SSD, OLED Touch',
  'Crafted to perfection. The HP Spectre x360 14 features a gem-cut design, a stunning 2.8K OLED IMAX Enhanced display, and the latest Intel Core Ultra processor with built-in AI capabilities and an included stylus for creative professionals.',
  169999, 185000, 20, true, 12,
  (SELECT id FROM categories WHERE slug = 'laptops'),
  (SELECT id FROM brands WHERE slug = 'hp'),
  '{"processor": "Intel Core Ultra 7 155H", "ram": "32GB LPDDR5x", "storage": "2TB PCIe Gen4 SSD", "display": "14-inch 2.8K OLED Touch", "os": "Windows 11 Home", "features": "Included HP Rechargeable MPP2.0 Tilt Pen"}'::jsonb
),

-- MOBILES
(
  'APP-IP15P-256', 'iphone-15-pro-256gb', 'Apple iPhone 15 Pro (256GB)', 
  'Titanium design, A17 Pro chip, 48MP Main camera, USB-C',
  'Forged in titanium, the iPhone 15 Pro features the groundbreaking A17 Pro chip for next-level performance and mobile gaming, a customizable Action button, and a pro-class 48MP camera system for stunning photography.',
  134900, 144900, 30, true, 12,
  (SELECT id FROM categories WHERE slug = 'mobiles'),
  (SELECT id FROM brands WHERE slug = 'apple'),
  '{"processor": "A17 Pro", "ram": "8GB", "storage": "256GB", "display": "6.1-inch Super Retina XDR ProMotion", "camera": "48MP Main + 12MP UW + 12MP 3x Telephoto", "battery": "3274 mAh"}'::jsonb
),
(
  'SAM-S24U-512', 'samsung-galaxy-s24-ultra-512', 'Samsung Galaxy S24 Ultra (512GB)', 
  'Snapdragon 8 Gen 3, Galaxy AI, 200MP Camera, Built-in S Pen',
  'Welcome to the era of mobile AI. The Galaxy S24 Ultra unleashes new levels of creativity and productivity. Featuring a titanium exterior, a flat 6.8-inch display, and a massive 200MP camera system for unparalleled detail.',
  139999, 149999, 25, true, 12,
  (SELECT id FROM categories WHERE slug = 'mobiles'),
  (SELECT id FROM brands WHERE slug = 'samsung'),
  '{"processor": "Snapdragon 8 Gen 3 for Galaxy", "ram": "12GB", "storage": "512GB", "display": "6.8-inch QHD+ Dynamic AMOLED 2X", "camera": "200MP Main + 50MP 5x + 10MP 3x + 12MP UW", "battery": "5000 mAh"}'::jsonb
),
(
  'ASU-ROG8-PRO', 'asus-rog-phone-8-pro', 'ASUS ROG Phone 8 Pro', 
  'Snapdragon 8 Gen 3, 16GB RAM, 512GB, 165Hz AMOLED',
  'The ultimate gaming phone evolves. The ROG Phone 8 Pro features a slimmer, lighter design with IP68 water resistance. Powered by Snapdragon 8 Gen 3 and featuring the AniMe Vision mini-LED display on the back.',
  94999, 109999, 12, true, 12,
  (SELECT id FROM categories WHERE slug = 'mobiles'),
  (SELECT id FROM brands WHERE slug = 'asus'),
  '{"processor": "Snapdragon 8 Gen 3", "ram": "16GB LPDDR5X", "storage": "512GB UFS 4.0", "display": "6.78-inch FHD+ 165Hz AMOLED", "camera": "50MP Main + 13MP UW + 32MP 3x Telephoto", "battery": "5500 mAh"}'::jsonb
),

-- CCTV
(
  'HIK-8CH-4K', 'hikvision-8ch-4k-nvr-kit', 'Hikvision 8CH 4K NVR Security System', 
  '8-Channel 4K POE NVR, 4x 8MP Bullet Cameras, 2TB HDD',
  'A complete enterprise-grade surveillance kit. Includes a 4K 8-channel PoE NVR and four 8MP outdoor bullet cameras with ColorVu technology for full-color night vision. Pre-installed 2TB surveillance hard drive included.',
  32500, 39900, 20, true, 24,
  (SELECT id FROM categories WHERE slug = 'cctv'),
  (SELECT id FROM brands WHERE slug = 'hikvision'),
  '{"channels": "8", "resolution": "8MP (4K)", "cameras_included": "4x Bullet", "storage": "2TB Surveillance HDD included", "features": "PoE, ColorVu Night Vision, App Support"}'::jsonb
),
(
  'CP-360-PTZ', 'cp-plus-360-ptz-wifi', 'CP PLUS 3MP 360° PTZ Wi-Fi Camera', 
  '3MP Resolution, Pan/Tilt/Zoom, Human Detection, Two-way Audio',
  'Keep an eye on everything with this versatile Wi-Fi PTZ camera. Features 360-degree coverage, AI human detection, auto-tracking, and full-color night vision. Supports cloud recording and SD card up to 256GB.',
  2499, 4500, 50, true, 12,
  (SELECT id FROM categories WHERE slug = 'cctv'),
  (SELECT id FROM brands WHERE slug = 'cp-plus'),
  '{"resolution": "3MP (2304x1296)", "connectivity": "Wi-Fi 2.4GHz", "features": "Pan/Tilt 360°, AI Human Detection, Color Night Vision", "storage": "MicroSD up to 256GB (not included)"}'::jsonb
),

-- GADGETS
(
  'LOG-MXM3S', 'logitech-mx-master-3s', 'Logitech MX Master 3S', 
  'Wireless Performance Mouse, 8000 DPI, Quiet Clicks',
  'The iconic mouse, remastered. Features Quiet Clicks delivering a satisfying tactile feel with 90% less click noise, and an 8000 DPI optical sensor that tracks anywhere, even on glass. Ergonomic design for ultimate comfort.',
  9995, 11495, 45, true, 12,
  (SELECT id FROM categories WHERE slug = 'gadgets'),
  (SELECT id FROM brands WHERE slug = 'logitech'),
  '{"sensor": "Darkfield High Precision (8000 DPI)", "buttons": "7 buttons, MagSpeed scroll wheel", "connectivity": "Bluetooth LE, Logi Bolt USB", "battery": "Up to 70 days per charge"}'::jsonb
),
(
  'SON-WH1000XM5', 'sony-wh-1000xm5', 'Sony WH-1000XM5', 
  'Industry Leading Noise Canceling Wireless Headphones',
  'Rewrite the rules of distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. Newly developed driver delivers spectacular high-resolution audio.',
  29990, 34990, 30, true, 12,
  (SELECT id FROM categories WHERE slug = 'gadgets'),
  (SELECT id FROM brands WHERE slug = 'sony'),
  '{"type": "Over-Ear Closed", "noise_canceling": "Industry Leading ANC with Auto NC Optimizer", "battery": "Up to 30 hours", "connectivity": "Bluetooth 5.2, Multipoint, 3.5mm jack"}'::jsonb
),
(
  'SAM-T7-2TB', 'samsung-t7-shield-2tb', 'Samsung T7 Shield Portable SSD (2TB)', 
  'Rugged Portable SSD, USB 3.2 Gen 2, IP65 Water/Dust Resistant',
  'Super fast on the outside, safe on the inside. The T7 Shield delivers blazing-fast speeds of up to 1050 MB/s, encased in a rugged, rubberized exterior with an IP65 rating for water and dust resistance. Perfect for creators on the go.',
  14999, 21999, 40, true, 36,
  (SELECT id FROM categories WHERE slug = 'gadgets'),
  (SELECT id FROM brands WHERE slug = 'samsung'),
  '{"capacity": "2TB", "interface": "USB 3.2 Gen 2 (10Gbps)", "speed": "Read 1050 MB/s, Write 1000 MB/s", "durability": "IP65 Rated, 3-meter drop resistant"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
