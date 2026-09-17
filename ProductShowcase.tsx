"use client";
import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { getCategory } from "./categoriesData";


/* ---------------- BRAND BAND ---------------- */
function BrandBand({ brands }: { brands: any[] }) {
  return (
    <div className="relative w-full overflow-hidden border-y border-[#00ff22]/25 bg-gradient-to-b from-[#04140a] via-[#020b05] to-[#04140a] py-9">
      {/* hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00ff22]/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00ff22]/50 to-transparent" />

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-36 bg-gradient-to-r from-[#010603] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-36 bg-gradient-to-l from-[#010603] to-transparent" />

      <div className="flex w-max animate-[brandscroll_45s_linear_infinite] items-center hover:[animation-play-state:paused]">
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="flex items-center">
            <Link
              href={`/brands/${b.slug}`}
              className="whitespace-nowrap px-10 text-xl font-black uppercase tracking-[0.18em] text-white transition-all duration-300 hover:text-[#00ff22] hover:drop-shadow-[0_0_14px_rgba(0,255,34,0.8)] md:text-2xl"
            >
              {b.name}
            </Link>
            <span className="h-6 w-px shrink-0 bg-[#00ff22]/30" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- CATEGORY SECTION ---------------- */
function CategorySection({
  n,
  slug,
  title,
  tag,
  img,
  copy,
  points,
  brands,
  flip,
}: {
  n: string;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col gap-10 lg:items-center lg:gap-16 ${
        flip ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* ---- IMAGE ---- */}
      <div className="relative w-full lg:w-[54%]">
        <div className="relative h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1410] sm:h-[380px] lg:h-[440px]">
          {broken ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-xl border border-[#00ff22]/30" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#00ff22]/40">
                {img.replace("/", "").toUpperCase()}
              </span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={title}
              onError={() => setBroken(true)}
              className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#010603] via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[#00ff22]/0 transition-colors duration-700 group-hover:bg-[#00ff22]/10" />

          {/* corner brackets */}
          <span className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-[#00ff22]/70" />
          <span className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[#00ff22]/70" />
        </div>

        {/* big ghost number */}
        <span
          className={`pointer-events-none absolute -top-8 select-none font-black leading-none text-white/[0.06] ${
            flip ? "right-2" : "left-2"
          } text-[100px] lg:text-[150px]`}
        >
          {n}
        </span>
      </div>

      {/* ---- TEXT ---- */}
      <div className="w-full lg:w-[46%]">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-10 bg-[#00ff22]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00ff22]">{tag}</span>
        </div>

        <h3 className="text-4xl font-black uppercase leading-[1] tracking-tight text-white md:text-6xl">
          {title}
        </h3>

        <p className="mt-5 max-w-lg leading-relaxed text-gray-400">{copy}</p>

        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          { (points || []).map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-gray-300">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#00ff22]" />
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-7 font-mono text-[11px] tracking-[0.15em] text-gray-600">{brands}</div>

        <motion.a
          href={`/products/${slug}`}
          whileHover={{ x: 6 }}
          className="mt-8 inline-flex items-center gap-3 border-b-2 border-[#00ff22] pb-2 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[#00ff22]"
        >
          Browse {title}
          <span>â†’</span>
        </motion.a>
      </div>
    </motion.div>
  );
}

/* ---------------- MAIN ---------------- */
export default function ProductShowcase({ brands, categories }: { brands: any[], categories: any[] }) {
  return (
    <section className="relative isolate bg-[#010603]">
      {/* full-bleed brand band */}
      <BrandBand brands={brands} />

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#001a08_1px,transparent_1px),linear-gradient(to_bottom,#001a08_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-24 md:px-12">
          {/* heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-24 max-w-2xl"
          >
            <div className="mb-4 font-mono text-xs tracking-[0.35em] text-[#00ff22]/80">
              /// WHAT WE STOCK
            </div>
            <h2 className="text-4xl font-black uppercase leading-[1.05] text-white md:text-5xl">
              Everything tech,
              <br />
              <span className="text-[#00ff22]">under one roof</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-gray-400">
              Genuine products, expert setup and after-sales support you can actually reach.
            </p>
          </motion.div>

          {/* one section per category */}
          <div className="flex flex-col gap-28 lg:gap-36">
            {categories.map((c, i) => {
              const extra = getCategory(c.slug);
              return (
                <CategorySection
                  key={c.slug}
                  n={String(i + 1).padStart(2, "0")}
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
            className="mt-32 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4"
          >
            {[
              ["100%", "Genuine products"],
              ["Top brands", "Under one roof"],
              ["Expert setup", "On-site available"],
              ["Support", "Always reachable"],
            ].map(([big, small], i) => (
              <div key={i} className="bg-[#080d0a] px-6 py-8">
                <div className="text-lg font-bold text-white">{big}</div>
                <div className="mt-1 font-mono text-[11px] tracking-wide text-gray-500">{small}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}




