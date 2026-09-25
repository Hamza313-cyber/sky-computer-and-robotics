"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Package } from "lucide-react";

function firstImage(p: any): string | null {
  if (Array.isArray(p.images)) {
    const img = p.images.find(Boolean);
    if (img) return img;
  }
  return p.image_url || null;
}

/* Shared product card: chocolate-glass window with the product photo, name, price, View button. */
export default function ProductCard({ p, href, i = 0 }: { p: any; href: string; i?: number }) {
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
        href={href}
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
          {(p.brands?.name || p.categories?.name) && (
            <div className="text-label text-[11px] font-bold uppercase tracking-[0.25em]">
              {p.brands?.name || p.categories?.name}
            </div>
          )}
          <h3 className="mt-1 font-bold text-ink text-lg leading-snug group-hover:text-accent transition-colors">{p.name}</h3>
          {p.short_description && <p className="mt-1.5 text-sm text-muted line-clamp-2">{p.short_description}</p>}
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <div className="font-display text-ink text-lg">
              {p.price != null ? (
                `₹${Number(p.price).toLocaleString("en-IN")}`
              ) : (
                <span className="text-sm font-sans font-bold text-muted">Price on request</span>
              )}
            </div>
            <span className="jpill h-10 px-4 text-sm shrink-0">View →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
