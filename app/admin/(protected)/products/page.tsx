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
      <div className="mb-8 flex items-center justify-between border-b border-black/20 pb-4">
        <h1 className="font-mono text-2xl uppercase tracking-widest text-ink">
          Products
        </h1>
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
