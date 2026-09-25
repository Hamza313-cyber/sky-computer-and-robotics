import { createClient } from "@/lib/supabase/public";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import PageShell from "../../PageShell";
import ProductCard from "../../components/ProductCard";

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
  const q = typeof resolved.q === "string" ? resolved.q.trim() : "";
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
      .textSearch("search_text", q, { type: "websearch", config: "english" })
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

  const totalPages = Math.max(1, Math.ceil(count / limit));

  return (
    <PageShell
      eyebrow="/// SEARCH"
      title={q ? "Results" : "Search"}
      lede={q ? `${count} ${count === 1 ? "product" : "products"} found for “${q}”.` : "Search by product name, brand or spec."}
    >
      {/* search box */}
      <form action="/search" method="GET" role="search" className="gtile mb-10 flex flex-col gap-3 rounded-[32px] p-3 sm:flex-row sm:items-center">
        <label className="well flex flex-1 items-center gap-3 px-5 h-14">
          <Search className="w-5 h-5 text-label shrink-0" aria-hidden="true" />
          <span className="sr-only">Search products</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="e.g. MacBook, 16GB RAM, CCTV camera"
            className="w-full bg-transparent text-ink placeholder:text-muted outline-none text-base"
          />
        </label>
        <button type="submit" className="jpill h-14 px-8 text-base">Search</button>
      </form>

      {errorMessage && (
        <div className="gtile rounded-[30px] p-10 text-center flex flex-col items-center gap-4">
          <span className="jelly alt w-16 h-16 flex items-center justify-center"><SearchX className="w-7 h-7" /></span>
          <p className="text-body">{errorMessage}</p>
        </div>
      )}

      {q && count === 0 && !errorMessage && (
        <div className="gtile rounded-[30px] p-10 text-center flex flex-col items-center gap-4">
          <span className="jelly alt w-16 h-16 flex items-center justify-center"><SearchX className="w-7 h-7" /></span>
          <p className="text-body">
            Nothing found for “{q}”. Try a shorter word, or ask us directly, we may have it in store.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="jpill alt h-11 px-6 text-sm">Browse all products</Link>
            <a
              href={`https://wa.me/917001904082?text=${encodeURIComponent(`Hi, do you have ${q}?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="jpill h-11 px-6 text-sm"
            >
              Ask on WhatsApp →
            </a>
          </div>
        </div>
      )}

      {products && products.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i} href={`/products/${p.categories?.slug || "unknown"}/${p.slug}`} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4">
              {page > 1 ? (
                <Link href={`?q=${encodeURIComponent(q)}&page=${page - 1}`} className="jpill alt h-11 px-5 text-sm">← Prev</Link>
              ) : (
                <span className="jpill alt h-11 px-5 text-sm opacity-40 pointer-events-none" aria-disabled="true">← Prev</span>
              )}
              <span className="text-ink font-bold text-sm">Page {page} of {totalPages}</span>
              {page < totalPages ? (
                <Link href={`?q=${encodeURIComponent(q)}&page=${page + 1}`} className="jpill alt h-11 px-5 text-sm">Next →</Link>
              ) : (
                <span className="jpill alt h-11 px-5 text-sm opacity-40 pointer-events-none" aria-disabled="true">Next →</span>
              )}
            </nav>
          )}
        </>
      )}
    </PageShell>
  );
}
