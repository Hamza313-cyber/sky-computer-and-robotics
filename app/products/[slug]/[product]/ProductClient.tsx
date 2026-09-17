"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import PageShell from "../../../../PageShell";

export default function ProductClient({ product }: { product: any }) {
  const images: string[] = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : [];
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState(false);
  const current = images[active];

  // Format specs for display
  const specs = product.specs ? Object.entries(product.specs) : [];

  return (
    <PageShell
      eyebrow={`/// ${product.categories?.name?.toUpperCase() || 'PRODUCT'}`}
      title={product.name}
      lede={product.short_description}
      backHref={`/products/${product.categories?.slug || ''}`}
      backLabel={`Back to ${product.categories?.name || 'Category'}`}
    >
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d1410] lg:h-[600px]"
        >
          {broken || !current ? (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[14px] tracking-[0.2em] text-[#00ff22]/35">
              {product.slug.replace("/", "").toUpperCase()}
            </div>
          ) : (
            <img
              src={current}
              alt={product.name}
              onError={() => setBroken(true)}
              className="h-full w-full object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#010603] via-transparent to-transparent" />
          
          {/* HUD Brackets */}
          <span className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-[#00ff22]/70" />
          <span className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b-2 border-r-2 border-[#00ff22]/70" />
          
          {/* Badges */}
          <div className="absolute right-6 top-6 flex flex-col gap-2">
            {product.in_stock ? (
              <span className="bg-[#00ff22] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.1em] text-black">
                IN STOCK
              </span>
            ) : (
              <span className="bg-red-500 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.1em] text-white">
                OUT OF STOCK
              </span>
            )}
            {product.warranty_months ? (
              <span className="border border-[#00ff22]/50 bg-black/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#00ff22]">
                {product.warranty_months} MONTHS WARRANTY
              </span>
            ) : null}
          </div>

          {/* thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-6 right-20 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => {
                    setActive(i);
                    setBroken(false);
                  }}
                  className={`h-14 w-14 shrink-0 overflow-hidden border transition-colors ${
                    i === active
                      ? "border-[#00ff22] shadow-[0_0_14px_rgba(0,255,34,0.45)]"
                      : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col"
        >
          {/* Price */}
          <div className="mb-10 rounded-2xl border border-[#00ff22]/20 bg-[#04140a] p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">
              Retail Price
            </div>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="text-4xl font-black text-[#00ff22]">
                Rs. {product.price?.toLocaleString("en-IN")}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  Rs. {product.mrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            
            <p className="mt-6 text-sm leading-relaxed text-gray-400">
              {product.description}
            </p>
          </div>

          {/* Specs Table */}
          {specs.length > 0 && (
            <div className="mb-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[#00ff22]" />
                <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00ff22]">
                  System Specifications
                </h3>
              </div>
              
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#080d0a]">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {specs.map(([key, value], i) => (
                      <tr 
                        key={key}
                        className={`border-white/5 ${i !== specs.length - 1 ? 'border-b' : ''}`}
                      >
                        <th className="w-1/3 bg-white/5 p-4 font-mono text-[11px] uppercase tracking-wider text-gray-400">
                          {key.replace(/_/g, ' ')}
                        </th>
                        <td className="p-4 text-gray-200">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto">
            <Link
              href={`/contact?subject=Enquiry for ${product.name}`}
              className="inline-flex w-full items-center justify-center gap-3 bg-[#00ff22] py-4 font-mono text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(0,255,34,0.3)] transition-all hover:shadow-[0_0_35px_rgba(0,255,34,0.7)]"
            >
              Enquire about this <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}

