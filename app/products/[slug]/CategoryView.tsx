"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import PageShell from "../../../PageShell";

export default function CategoryView({ c, products, page, total }: { c: any, products: any[], page: number, total: number }) {
  const [broken, setBroken] = useState(false);
  const totalPages = Math.ceil(total / 24);

  return (
    <PageShell
      eyebrow={`/// ${c.tagline?.toUpperCase() || ''}`}
      title={c.name}
      lede={c.description}
      backHref="/products"
      backLabel="All products"
    >
      {/* hero image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1410] sm:h-[360px]"
      >
        {broken || !c.image_url ? (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] tracking-[0.2em] text-[#00ff22]/35">
            {(c.image_url || c.slug).replace("/", "").toUpperCase()}
          </div>
        ) : (
          <img
            src={c.image_url}
            alt={c.name}
            onError={() => setBroken(true)}
            className="h-full w-full object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#010603] via-transparent to-transparent" />
        <span className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[#00ff22]/70" />
        <span className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[#00ff22]/70" />
      </motion.div>

      {/* what we stock */}
      <div className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-[#00ff22]" />
          <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00ff22]">
            What we stock
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p) => (
            <Link key={p.id} href={`/products/${c.slug}/${p.slug}`}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="group h-full bg-[#080d0a] px-6 py-7 transition-colors hover:bg-[#0c1710]"
              >
                <div className="text-base font-semibold text-white transition-colors group-hover:text-[#00ff22]">
                  {p.name}
                </div>
                <div className="mt-1.5 font-mono text-[11px] tracking-wide text-gray-500 line-clamp-2">
                  {p.short_description}
                </div>
                <div className="mt-4 font-mono text-xs text-[#00ff22]">
                  Rs. {p.price.toLocaleString("en-IN")}
                </div>
              </motion.div>
            </Link>
          ))}
          {products.length === 0 && (
             <div className="p-8 text-gray-500 font-mono text-sm col-span-full">No products found.</div>
          )}
        </motion.div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4 font-mono text-xs">
            {page > 1 ? (
              <Link href={`?page=${page - 1}`} className="text-[#00ff22] hover:underline">&lt; PREV</Link>
            ) : <span className="text-gray-600">&lt; PREV</span>}
            <span className="text-white">PAGE {page} OF {totalPages}</span>
            {page < totalPages ? (
              <Link href={`?page=${page + 1}`} className="text-[#00ff22] hover:underline">NEXT &gt;</Link>
            ) : <span className="text-gray-600">NEXT &gt;</span>}
          </div>
        )}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 flex flex-col items-start justify-between gap-6 border border-[#00ff22]/25 bg-gradient-to-r from-[#04140a] to-[#010603] p-8 md:flex-row md:items-center"
      >
        <div>
          <div className="text-xl font-bold uppercase tracking-wide text-white">
            Need help choosing?
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Tell us your budget and use case - we will shortlist the right options.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 bg-[#00ff22] px-7 py-3.5 font-mono text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_25px_rgba(0,255,34,0.45)] transition-all hover:shadow-[0_0_40px_rgba(0,255,34,0.8)]"
        >
          Talk to us &rarr;
        </Link>
      </motion.div>
    </PageShell>
  );
}

