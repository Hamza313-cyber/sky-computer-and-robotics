# Sky Computers & Robotics — Backend Build Spec

**For:** Antigravity (build agent)
**Project:** `C:\Users\Victus\sky-computers-3d`
**Current state:** Next.js 16 + Tailwind v4 + Motion. Frontend pages already built (Home, Products hub, 4 category pages, 12 brand pages, About, Contact). All product/category/brand data is currently hardcoded in `categoriesData.ts` and `brandsData.ts`.

**Goal:** Replace hardcoded data with a real database that handles **thousands of products**, add an **admin panel**, **CSV bulk import**, and an **enquiry system**. Design the schema so a **cart + payment** can be added later without a rewrite.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) — already in place | keep |
| Database | **Supabase** (Postgres) | free tier handles 100k+ rows, built-in table editor |
| Auth | **Supabase Auth** (email + password) | admin login only, no public signup |
| Image storage | **Supabase Storage** | free 1GB, public bucket for product images |
| Hosting | **Vercel** free tier | zero config for Next.js |
| Forms/validation | `react-hook-form` + `zod` | |
| CSV parsing | `papaparse` | bulk import |

Install:
```
npm install @supabase/supabase-js @supabase/ssr react-hook-form zod @hookform/resolvers papaparse
npm install -D @types/papaparse
```

Env vars in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-only, never expose to client
```

---

## 2. Database schema

Create these tables in Supabase. **Include the commerce-ready columns now** even though cart is not built yet.

### `categories`
| column | type | notes |
|---|---|---|
| id | uuid pk default gen_random_uuid() | |
| slug | text unique not null | e.g. `laptops` |
| name | text not null | |
| tagline | text | |
| description | text | |
| image_url | text | |
| sort_order | int default 0 | |
| is_active | bool default true | |
| created_at | timestamptz default now() | |

### `brands`
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| slug | text unique not null | |
| name | text not null | |
| logo_url | text | |
| description | text | |
| is_featured | bool default false | shows in the home brand strip |
| sort_order | int default 0 | |
| is_active | bool default true | |

### `products`  ← the big one
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| sku | text unique | store's own code |
| slug | text unique not null | url |
| name | text not null | |
| category_id | uuid fk → categories.id | |
| brand_id | uuid fk → brands.id | |
| short_description | text | |
| description | text | long |
| specs | jsonb | `{"RAM":"16GB","Storage":"512GB SSD"}` — flexible per category |
| price | numeric(10,2) | |
| mrp | numeric(10,2) | for strike-through |
| currency | text default 'INR' | |
| stock_qty | int default 0 | **needed later for cart** |
| in_stock | bool default true | |
| warranty_months | int | |
| images | text[] | array of Storage URLs |
| is_featured | bool default false | |
| is_active | bool default true | soft delete |
| search_text | text | generated: name + brand + category + specs, for fast search |
| created_at / updated_at | timestamptz | |

**Indexes (important at thousands of rows):**
```sql
create index on products (category_id);
create index on products (brand_id);
create index on products (is_active, in_stock);
create index on products using gin (to_tsvector('english', search_text));
create index on products (price);
```

### `enquiries`  ← this powers the monthly report
| column | type | notes |
|---|---|---|
| id | uuid pk | |
| name, email, phone | text | |
| subject | text | |
| message | text | |
| product_id | uuid fk nullable | if enquiry came from a product page |
| status | text default 'new' | new / contacted / closed |
| created_at | timestamptz | |

### `page_views` (simple analytics — do NOT use a third-party tracker)
| column | type |
|---|---|
| id | uuid pk |
| path | text |
| referrer | text |
| created_at | timestamptz |

### Future-proofing (create tables now, leave unused)
`cart_items`, `orders`, `order_items` — create with basic columns so the shop upgrade is additive, not a migration.

### Row Level Security
- `products`, `categories`, `brands`: **public SELECT** where `is_active = true`; INSERT/UPDATE/DELETE only for authenticated users.
- `enquiries`: **public INSERT**, SELECT only for authenticated.
- `page_views`: public INSERT, SELECT only for authenticated.

---

## 3. Public site changes

Replace hardcoded imports with DB queries. **Keep all existing visual design, animations and styling exactly as they are** — only swap the data source.

- `/products` — read categories from DB
- `/products/[slug]` — read category + its products, **paginated (24 per page)**
- `/products/[slug]` must have **filters**: brand, price range, in-stock only, sort (price asc/desc, newest)
- `/brands/[slug]` — read brand + its products, paginated
- **New:** `/products/[category]/[productSlug]` — single product page: image gallery, specs table, price, stock badge, "Enquire about this" button (prefills product in the enquiry form)
- **New:** `/search?q=` — full-text search across products
- `/contact` — form must actually **INSERT into `enquiries`** (currently it is a demo that only shows a message)
- Home brand strip — read brands where `is_featured = true`

Use Next.js caching: `export const revalidate = 300` on product listing pages.

---

## 4. Admin panel — `/admin`

Protected by Supabase Auth. Redirect to `/admin/login` if not authenticated. No public signup — create the admin user manually in Supabase.

Match the existing site theme: black `#010603`, green `#00ff22`, mono labels, angled HUD panels.

**Routes:**
- `/admin` — dashboard: total products, active products, out of stock, enquiries this month, page views this month, a simple 30-day line chart
- `/admin/products` — table with search, filter by category/brand, pagination, bulk select, toggle active, delete
- `/admin/products/new` and `/admin/products/[id]` — full product form, multi-image upload to Supabase Storage, specs as key/value pairs
- `/admin/import` — **CSV bulk import** (see below)
- `/admin/categories`, `/admin/brands` — simple CRUD
- `/admin/enquiries` — list, mark status, view details

### CSV import (`/admin/import`)
- Upload CSV → parse with papaparse → show a **preview table with validation errors before committing**
- Columns: `sku,name,category_slug,brand_slug,short_description,description,price,mrp,stock_qty,warranty_months,specs_json,image_urls`
- `specs_json` = a JSON string; `image_urls` = comma-separated
- Auto-generate `slug` from name (deduplicate with `-2`, `-3` suffix)
- Insert in **batches of 500**, show a progress bar
- On finish: report inserted / skipped / failed with reasons
- Provide a **downloadable sample CSV template**

---

## 5. Build order

1. Supabase project + schema + RLS + seed the existing categories/brands from `categoriesData.ts` and `brandsData.ts`
2. Supabase client setup (`lib/supabase/client.ts`, `lib/supabase/server.ts` using `@supabase/ssr`)
3. Swap public pages to DB reads — **verify the site looks identical to now**
4. Auth + `/admin/login` + route protection
5. Admin products CRUD + image upload
6. CSV bulk import
7. Enquiries: contact form writes to DB + `/admin/enquiries`
8. Product detail page + search + filters
9. Simple analytics (page_views insert + dashboard chart)

---

## 6. Rules

- **Do not change any existing visual design, colours, animations or layout.** Data source only.
- Keep `categoriesData.ts` / `brandsData.ts` as the seed source, then stop importing them in pages.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client — server routes only.
- Every list query must be paginated. No unbounded `select *` on products.
- Product images: resize/compress on upload (max 1600px wide, WebP). Thousands of products means storage adds up fast.
- TypeScript strict. Zero build errors before declaring a step done.
- After each numbered step above, report what was done and confirm `npm run build` passes.
