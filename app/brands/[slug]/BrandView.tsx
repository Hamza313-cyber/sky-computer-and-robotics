"use client";
import { motion } from "motion/react";
import Link from "next/link";
import MatrixRain from "../../../MatrixRain";

export default function BrandView({ brand, products, page, total }: { brand: any, products: any[], page: number, total: number }) {
  const totalPages = Math.ceil(total / 24);

  // Extract unique category names from products if available
  const uniqueCategories = Array.from(
    new Set(products.filter((p) => p.categories?.name).map((p) => p.categories.name))
  );

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#010603] pb-24 pt-28">
      <MatrixRain intensity={0.55} />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#001a08_1px,transparent_1px),linear-gradient(to_bottom,#001a08_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_10%,#000_80%)]" />

      <div className="relative z-40 mx-auto w-full max-w-[1100px] px-6 md:px-10">
        {/* back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/brands"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500 transition-colors hover:text-[#00ff22]"
          >
            <span className="transition-transform group-hover:-translate-x-1">&lt;-</span>
            Back to brands
          </Link>
        </motion.div>

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#00ff22]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00ff22]">
              Authorised range
            </span>
          </div>

          <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-8xl">
            {brand.name}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">{brand.description}</p>

          {/* category chips */}
          {uniqueCategories.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {uniqueCategories.map((c: any) => (
                <span
                  key={c}
                  className="rounded-full border border-[#00ff22]/30 bg-[#00ff22]/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[#00ff22]"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* products grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } } }}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.categories?.slug || 'unknown'}/${p.slug}`}>
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

        {/* enquiry strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#00ff22]/25 bg-gradient-to-r from-[#04140a] to-[#010603] p-8 md:flex-row md:items-center"
        >
          <div>
            <div className="text-xl font-bold uppercase tracking-wide text-white">
              Looking for a specific {brand.name} model?
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Tell us the model and we will check stock, price and delivery for you.
            </p>
          </div>

          <Link
            href={`/contact?subject=Enquiry for ${brand.name} products`}
            className="shrink-0 bg-[#00ff22] px-7 py-3.5 font-mono text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_25px_rgba(0,255,34,0.45)] transition-all hover:shadow-[0_0_40px_rgba(0,255,34,0.8)]"
          >
            Enquire now &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

