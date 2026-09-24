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
  const parsedPage = typeof resolved.page === "string" ? parseInt(resolved.page) : 1;
  const page = Math.max(1, isNaN(parsedPage) ? 1 : parsedPage);
  const limit = 24;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createClient();
  let products: any[] | null = [];
  let count = 0;

  let errorMessage: string | null = null;

  if (q) {
    const { data, count: c, error } = await supabase
      .from("products")
      .select("*, categories(name, slug), brands(name, slug)", { count: "exact" })
      .eq("is_active", true)
      .textSearch('search_text', q, { type: 'websearch', config: 'english' })
      .order("created_at", { ascending: false })
      .range(from, to);
      
    if (error) {
      console.error("Search error:", error);
      errorMessage = "Invalid search query. Please try different keywords.";
    } else {
      products = data;
      count = c || 0;
    }
  }

  return (
    <PageShell
      eyebrow="/// SEARCH RESULTS"
      title={q ? `Results for "${q}"` : "Search"}
      lede={q ? `Found ${count} products matching your query.` : "Enter a search term to find products."}
    >
      {!q && !errorMessage && (
        <div className="py-20 text-center font-mono text-gray-500">
          Please enter a search query.
        </div>
      )}

      {q && count === 0 && !errorMessage && (
        <div className="py-20 text-center font-mono text-gray-500">
          No products found for "{q}".
        </div>
      )}

      {errorMessage && (
        <div className="py-20 text-center font-mono text-red-500">
          {errorMessage}
        </div>
      )}

      {products && products.length > 0 && (
        <>
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

          <div className="mt-12 flex items-center justify-between border-t border-[#00ff22]/20 pt-6 font-mono text-sm">
            <Link
              href={page > 1 ? `?q=${encodeURIComponent(q)}&page=${page - 1}` : "#"}
              className={`flex items-center gap-2 border border-[#00ff22]/30 px-4 py-2 transition-colors ${
                page > 1 ? "text-[#00ff22] hover:bg-[#00ff22]/10" : "pointer-events-none text-gray-700"
              }`}
            >
              ← PREV
            </Link>
            <span className="text-gray-400">
              PAGE {page} OF {Math.max(1, Math.ceil(count / limit))}
            </span>
            <Link
              href={page * limit < count ? `?q=${encodeURIComponent(q)}&page=${page + 1}` : "#"}
              className={`flex items-center gap-2 border border-[#00ff22]/30 px-4 py-2 transition-colors ${
                page * limit < count ? "text-[#00ff22] hover:bg-[#00ff22]/10" : "pointer-events-none text-gray-700"
              }`}
            >
              NEXT →
            </Link>
          </div>
        </>
      )}
    </PageShell>
  );
}
