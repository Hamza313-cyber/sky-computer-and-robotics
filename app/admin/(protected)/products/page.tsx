import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductsTableClient from "./ProductsTableClient";

export const revalidate = 0;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const q = typeof resolved.q === "string" ? resolved.q : "";
  const page = typeof resolved.page === "string" ? parseInt(resolved.page) || 1 : 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, categories(name), brands(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const { data: products, count } = await query;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-label">Sky Admin</p>
          <h1 className="font-display text-3xl md:text-4xl text-ink">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="jpill h-11 px-5 text-sm"
        >
          + Add Product
        </Link>
      </div>

      <ProductsTableClient
        initialProducts={products || []}
        count={count || 0}
        page={page}
        q={q}
      />
    </div>
  );
}
