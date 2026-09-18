import { createClient } from "@/lib/supabase/public";
import PageShell from "../../PageShell";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0; // Dynamic page for search

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const q = typeof resolved.q === "string" ? resolved.q : "";
  return { title: q ? `Search: ${q} - Sky Computers` : "Search - Sky Computers" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolved = await searchParams;
  const q = typeof resolved.q === "string" ? resolved.q : "";
  const page = typeof resolved.page === "string" ? parseInt(resolved.page) || 1 : 1;
  const limit = 24;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createClient();
  let products: any[] | null = [];
  let count = 0;

  if (q) {
    // Basic ilike search for now to be safe, since search_text might be null if no trigger is set
    const { data, count: c } = await supabase
      .from("products")
      .select("*, categories(name, slug), brands(name, slug)", { count: "exact" })
      .eq("is_active", true)
      .or(`name.ilike.%${q}%,short_description.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .range(from, to);
    products = data;
    count = c || 0;
  }

  return (
    <PageShell
      eyebrow="/// SEARCH RESULTS"
      title={q ? `Results for "${q}"` : "Search"}
      lede={q ? `Found ${count} products matching your query.` : "Enter a search term to find products."}
    >
      {!q && (
        <div className="py-20 text-center font-mono text-gray-500">
          Please enter a search query.
        </div>
      )}

      {q && count === 0 && (
        <div className="py-20 text-center font-mono text-gray-500">
          No products found for "{q}".
        </div>
      )}

      {products && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.categories?.slug}/${p.slug}`}
              className="group flex h-full flex-col border border-[#00ff22]/20 bg-[#040a06] transition-colors hover:border-[#00ff22]/60"
            >
              <div className="relative aspect-square w-full overflow-hidden border-b border-[#00ff22]/20 bg-black/50 p-6">
                <Image
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
                {!p.in_stock && (
                  <div className="absolute right-3 top-3 border border-red-500/50 bg-red-950/80 px-2 py-1 font-mono text-[10px] text-red-400">
                    OUT OF STOCK
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="mb-2 font-mono text-[10px] uppercase text-[#00ff22]">
                    {p.brands?.name}
                  </div>
                  <h3 className="mb-2 text-sm font-medium text-white">{p.name}</h3>
                  <p className="line-clamp-2 text-xs text-gray-400">
                    {p.short_description}
                  </p>
                </div>
                <div className="mt-4 font-mono text-sm text-[#00ff22]">
                  {p.currency} {p.price?.toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
