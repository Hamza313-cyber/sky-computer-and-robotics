"use client";
import { motion } from "motion/react";
import Link from "next/link";
import CategoryImage from "../../components/CategoryImage";

export function HubCard({ c, i }: { c: any; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={`/products/${c.slug}`}
        className="gtile group flex h-full flex-col rounded-[32px] p-4 transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="relative h-56 overflow-hidden rounded-[24px] shadow-[0_14px_26px_-10px_rgba(74,37,24,0.45)] neu:shadow-[0_14px_26px_-10px_rgba(20,22,27,0.25)]">
          <CategoryImage
            slug={c.slug}
            src={c.image_url}
            alt={c.name}
            className="h-full w-full rounded-[24px] transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
          {c.tagline && (
            <p className="text-label text-xs font-bold uppercase tracking-[0.25em]">{c.tagline}</p>
          )}
          <h2 className="mt-2 font-display text-ink text-2xl uppercase">{c.name}</h2>
          {c.description && <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{c.description}</p>}
          <span className="jpill mt-5 h-11 w-fit px-5 text-sm">
            Browse <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
