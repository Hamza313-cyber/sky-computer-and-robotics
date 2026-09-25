"use client";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getCategory } from "./categoriesData";
import { Smartphone } from "lucide-react";

function BrandBand({ brands }: { brands: any[] }) {
  return (
    <div className="relative w-full overflow-hidden py-9 bg-transparent border-transparent">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-36 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-36 bg-gradient-to-l from-bg to-transparent" />

      <div className="flex w-max animate-[brandscroll_45s_linear_infinite] items-center hover:[animation-play-state:paused] gap-6 px-3">
        {[...brands, ...brands].map((b, i) => (
          <Link
            key={i}
            href={`/brands/${b.slug}`}
            className="jpill alt h-11 px-6 flex items-center justify-center font-bold tracking-widest text-sm uppercase shrink-0"
          >
            {b.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function CategorySection({
  slug,
  title,
  tag,
  img,
  copy,
  points,
  brands,
  flip,
}: {
  slug: string;
  title: string;
  tag: string;
  img: string;
  copy: string;
  points: string[];
  brands: string;
  flip: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // The image can fail before React hydrates (onError never fires), so check once on mount.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setBroken(true);
  }, []);

  let finalImg = img;
  if (broken || !img) {
    if (slug === 'laptops') finalImg = '/images/sky-laptop.jpg';
    else if (slug === 'cctv') finalImg = '/images/sky-cctv.jpg';
    else if (slug === 'gadgets') finalImg = '/images/sky-headphones.jpg';
    else finalImg = '';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`gtile rounded-[36px] p-4 md:p-6 flex flex-col gap-8 lg:items-center lg:gap-14 ${
        flip ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* ---- IMAGE ---- */}
      <div className="relative w-full lg:w-1/2 shrink-0">
        <div className="relative h-[320px] md:h-[420px] overflow-hidden rounded-[26px] shadow-[0_14px_26px_-10px_rgba(74,37,24,0.45)] neu:shadow-[0_14px_26px_-10px_rgba(20,22,27,0.25)]">
          {finalImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={finalImg}
              alt={title}
              onError={() => setBroken(true)}
              className="h-full w-full object-cover transition-transform duration-[900ms] hover:scale-105"
            />
          ) : (
            <div className="gtile absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[26px]">
              <span className="jelly alt w-[88px] h-[88px] flex items-center justify-center">
                <Smartphone size={36} />
              </span>
              <span className="font-bold text-muted text-sm">Photo coming soon</span>
            </div>
          )}
        </div>
      </div>

      {/* ---- TEXT ---- */}
      <div className="w-full lg:w-1/2 flex flex-col items-start px-2 lg:px-6">
        <div className="mb-4 text-label font-bold tracking-[0.3em] uppercase text-xs">
          {tag}
        </div>

        <h3 className="font-display text-ink text-4xl md:text-5xl uppercase leading-[1.1]">
          {title}
        </h3>

        <p className="mt-5 text-body leading-relaxed text-lg">{copy}</p>

        <ul className="mt-7 grid gap-4 sm:grid-cols-2 w-full">
          {(points || []).map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-body font-medium">
              <span className="mt-[6px] h-2 w-2 rounded-full shrink-0 bg-accent" />
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-8 font-bold text-[12px] tracking-[0.15em] uppercase text-muted">
          {brands}
        </div>

        <Link
          href={`/products/${slug}`}
          className="jpill h-12 px-6 flex items-center justify-center mt-8 font-bold"
        >
          Browse {title} &rarr;
        </Link>
      </div>
    </motion.div>
  );
}

export default function ProductShowcase({ brands, categories }: { brands: any[], categories: any[] }) {
  return (
    <section className="relative w-full pb-32">
      <BrandBand brands={brands} />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-24 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 max-w-2xl"
        >
          <div className="mb-4 text-label font-bold tracking-[0.35em] text-xs uppercase">
            /// WHAT WE STOCK
          </div>
          <h2 className="font-display text-ink text-4xl md:text-5xl lg:text-6xl uppercase leading-[1.05]">
            Everything tech,
            <br />
            <span className="text-accent">under one roof</span>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-body text-lg">
            Genuine products, expert setup and after-sales support you can actually reach.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12 lg:gap-16">
          {categories.map((c, i) => {
            const extra = getCategory(c.slug);
            return (
              <CategorySection
                key={c.slug}
                slug={c.slug}
                title={c.name}
                tag={c.tagline}
                img={c.image_url}
                copy={c.description}
                points={extra?.points ?? []}
                brands={extra?.brands ?? ""}
                flip={i % 2 === 1}
              />
            );
          })}
        </div>

        {/* trust row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {[
            ["100%", "Genuine products"],
            ["Top brands", "Under one roof"],
            ["Expert setup", "On-site available"],
            ["Support", "Always reachable"],
          ].map(([big, small], i) => (
            <div key={i} className="gtile rounded-[28px] p-6 flex flex-col justify-center">
              <div className="text-2xl lg:text-3xl font-display text-ink uppercase mb-2">{big}</div>
              <div className="font-bold text-xs tracking-wide text-muted uppercase">{small}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
