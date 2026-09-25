"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Package } from "lucide-react";
import PageShell from "../../../PageShell";
import CategoryImage from "../../../components/CategoryImage";

function firstImage(p: any): string | null {
  if (Array.isArray(p.images)) {
    const img = p.images.find(Boolean);
    if (img) return img;
  }
  return p.image_url || null;
}

function ProductCard({ p, slug, i }: { p: any; slug: string; i: number }) {
  const img = firstImage(p);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
      className="h-full"
    >
      <Link
        href={`/products/${slug}/${p.slug}`}
        className="gtile group flex h-full flex-col rounded-[30px] p-4 transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="jwin h-52">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={p.name} loading="lazy" />
          ) : (
            <span className="jelly alt w-16 h-16 flex items-center justify-center relative z-[2]">
              <Package className="w-7 h-7" />
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-1.5 pt-4">
          {p.brand && <div className="text-label text-[11px] font-bold uppercase tracking-[0.25em]">{p.brand}</div>}
          <h3 className="mt-1 font-bold text-ink text-lg leading-snug group-hover:text-accent transition-colors">{p.name}</h3>
          {p.short_description && <p className="mt-1.5 text-sm text-muted line-clamp-2">{p.short_description}</p>}
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <div className="font-display text-ink text-lg">
              {p.price != null ? `₹${Number(p.price).toLocaleString("en-IN")}` : <span className="text-sm font-sans font-bold text-muted">Price on request</span>}
            </div>
            <span className="jpill h-10 px-4 text-sm shrink-0">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryView({ c, products, page, total }: { c: any; products: any[]; page: number; total: number }) {
  const totalPages = Math.ceil(total / 24);

  return (
    <PageShell
      eyebrow={`/// ${c.tagline?.toUpperCase() || ""}`}
      title={c.name}
      lede={c.description}
      backHref="/products"
      backLabel="All products"
    >
      {/* category banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12 }}
        className="gtile rounded-[36px] p-3 md:p-4"
      >
        <div className="relative h-[240px] sm:h-[340px] overflow-hidden rounded-[28px]">
          <CategoryImage slug={c.slug} src={c.image_url} alt={c.name} className="h-full w-full rounded-[28px]" />
        </div>
      </motion.div>

      {/* products */}
      <div className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-8 rounded-full bg-accent" />
              <h2 className="text-label text-xs font-bold uppercase tracking-[0.3em]">What we stock</h2>
            </div>
            <p className="mt-2 text-muted text-sm">{total} {total === 1 ? "product" : "products"}</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="gtile rounded-[30px] p-10 text-center flex flex-col items-center gap-4">
            <span className="jelly alt w-16 h-16 flex items-center justify-center">
              <Package className="w-7 h-7" />
            </span>
            <p className="text-body">No products listed here yet. Ask us on WhatsApp, we probably have it in store.</p>
            <a href="https://wa.me/917001904082" target="_blank" rel="noopener noreferrer" className="jpill h-11 px-6 text-sm">
              Ask on WhatsApp →
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} p={p} slug={c.slug} i={i} />
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
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="gtile mt-14 rounded-[32px] p-6 md:p-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
      >
        <div>
          <div className="font-display text-ink text-2xl uppercase">Need help choosing?</div>
          <p className="mt-2 text-body">Tell us your budget and use case - we will shortlist the right options.</p>
        </div>
        <Link href="/contact" className="jpill h-14 px-8 shrink-0">
          Talk to us →
        </Link>
      </motion.div>
    </PageShell>
  );
}
