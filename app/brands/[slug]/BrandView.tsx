"use client";
import Link from "next/link";
import { Package } from "lucide-react";
import PageShell from "../../../PageShell";
import ProductCard from "../../../components/ProductCard";

export default function BrandView({ brand, products, page, total }: { brand: any; products: any[]; page: number; total: number }) {
  const totalPages = Math.ceil(total / 24);
  const uniqueCategories = Array.from(
    new Set(products.filter((p) => p.categories?.name).map((p) => p.categories.name as string))
  );

  return (
    <PageShell
      eyebrow="/// BRAND"
      title={brand.name}
      lede={brand.description}
      backHref="/brands"
      backLabel="Back to brands"
    >
      {uniqueCategories.length > 0 && (
        <div className="-mt-4 mb-10 flex flex-wrap gap-3">
          {uniqueCategories.map((c) => (
            <span key={c} className="jpill light h-9 px-4 text-xs uppercase tracking-[0.15em]">
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <span className="h-[3px] w-8 rounded-full bg-accent" />
        <h2 className="text-label text-xs font-bold uppercase tracking-[0.3em]">
          {total} {total === 1 ? "product" : "products"}
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="gtile rounded-[30px] p-10 text-center flex flex-col items-center gap-4">
          <span className="jelly alt w-16 h-16 flex items-center justify-center">
            <Package className="w-7 h-7" />
          </span>
          <p className="text-body">No {brand.name} products listed yet. Ask us, we can check stock for you.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} href={`/products/${p.categories?.slug || "unknown"}/${p.slug}`} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Link href={`?page=${page - 1}`} className="jpill alt h-11 px-5 text-sm">← Prev</Link>
          ) : (
            <span className="jpill alt h-11 px-5 text-sm opacity-40 pointer-events-none" aria-disabled="true">← Prev</span>
          )}
          <span className="text-ink font-bold text-sm">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={`?page=${page + 1}`} className="jpill alt h-11 px-5 text-sm">Next →</Link>
          ) : (
            <span className="jpill alt h-11 px-5 text-sm opacity-40 pointer-events-none" aria-disabled="true">Next →</span>
          )}
        </nav>
      )}

      <div className="gtile mt-14 rounded-[32px] p-6 md:p-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="font-display text-ink text-2xl uppercase">Looking for a specific {brand.name} model?</div>
          <p className="mt-2 text-body">Tell us the model and we will check stock, price and delivery for you.</p>
        </div>
        <Link href={`/contact?subject=${encodeURIComponent(`Enquiry for ${brand.name} products`)}`} className="jpill h-14 px-8 shrink-0">
          Enquire now →
        </Link>
      </div>
    </PageShell>
  );
}
