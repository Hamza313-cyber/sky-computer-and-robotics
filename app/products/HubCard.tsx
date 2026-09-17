"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export function HubCard({ c, i }: { c: any; i: number }) {
  const [broken, setBroken] = useState(false);
  const num = String(i + 1).padStart(2, "0");
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/products/${c.slug}`}
        className="group relative flex h-full flex-col overflow-hidden border border-[#00ff22]/25 bg-[#040a06] transition-all hover:border-[#00ff22] hover:shadow-[0_0_38px_rgba(0,255,34,0.2)]"
        style={{ clipPath: "polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)" }}
      >
        <div className="relative h-52 overflow-hidden bg-[#0d1410]">
          {broken || !c.image_url ? (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.2em] text-[#00ff22]/35">
              {(c.image_url || c.slug).replace("/", "").toUpperCase()}
            </div>
          ) : (
            <img
              src={c.image_url}
              alt={c.name}
              onError={() => setBroken(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040a06] via-transparent to-transparent" />
          <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.2em] text-[#00ff22]">
            {num}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-2xl font-black uppercase tracking-wide text-white transition-colors group-hover:text-[#00ff22]">
            {c.name}
          </h2>
          <p className="mt-1 font-mono text-[11px] tracking-wide text-[#00ff22]/70">{c.tagline}</p>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-400">{c.description}</p>
          <div className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00ff22]">
            Open <span className="transition-transform group-hover:translate-x-1.5">&rarr;</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

