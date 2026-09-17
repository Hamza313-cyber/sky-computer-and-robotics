"use client";
import { motion } from "motion/react";
import Link from "next/link";
import PageShell from "../../PageShell";

const STORY = [
  {
    n: "01",
    h: "Our Story",
    p: "Sky Computers & Robotics started as a small counter fixing machines nobody else would touch. Word spread, the counter became a store, and the store became the place people bring their tech problems to.",
  },
  {
    n: "02",
    h: "What We Do",
    p: "We sell, build, install and service. Laptops and phones across every major brand, custom PC builds, full CCTV setups for homes and shops, and the accessories that hold it all together.",
  },
  {
    n: "03",
    h: "Why Choose Us",
    p: "Genuine stock with real warranty. Setup and data transfer included, not charged extra. And a service desk you can actually walk into when something goes wrong.",
  },
];

const STATS = [
  ["10K+", "Customers served"],
  ["500+", "Products in stock"],
  ["1,240", "CCTV setups done"],
  ["24/7", "Support reachable"],
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="/// WHO WE ARE"
      title="About"
      accent="Us"
      lede="A tech house that sells, builds and services — with people you can actually reach."
    >
      <div className="flex flex-col gap-6">
        {STORY.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border border-[#00ff22]/25 bg-[#040a06] p-7 transition-colors hover:border-[#00ff22]/60"
            style={{ clipPath: "polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)" }}
          >
            <div className="flex flex-col gap-5 md:flex-row md:gap-9">
              <div className="shrink-0 font-mono text-4xl font-black leading-none text-[#00ff22]/25 md:text-5xl">
                {s.n}
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wide text-white transition-colors group-hover:text-[#00ff22]">
                  {s.h}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-gray-400">{s.p}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4"
      >
        {STATS.map(([big, small]) => (
          <div key={small} className="bg-[#080d0a] px-6 py-8">
            <div className="font-mono text-2xl font-black text-[#00ff22]">{big}</div>
            <div className="mt-1 font-mono text-[11px] tracking-wide text-gray-500">{small}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 flex flex-col items-start justify-between gap-6 border border-[#00ff22]/25 bg-gradient-to-r from-[#04140a] to-[#010603] p-8 md:flex-row md:items-center"
      >
        <div>
          <div className="text-xl font-bold uppercase tracking-wide text-white">
            Come see the store
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Walk in with your requirement, walk out with it sorted.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 bg-[#00ff22] px-7 py-3.5 font-mono text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_25px_rgba(0,255,34,0.45)] transition-all hover:shadow-[0_0_40px_rgba(0,255,34,0.8)]"
        >
          Get in touch →
        </Link>
      </motion.div>
    </PageShell>
  );
}
