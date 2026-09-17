"use client";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import MatrixRain from "./MatrixRain";

/* Shared page wrapper: matrix rain, grid, eyebrow + glitch heading, back link */
export default function PageShell({
  eyebrow,
  title,
  accent,
  lede,
  children,
  backHref = "/",
  backLabel = "Back to home",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lede?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#010603] pb-28 pt-24">
      <MatrixRain intensity={0.5} />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#001a08_1px,transparent_1px),linear-gradient(to_bottom,#001a08_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_8%,#000_82%)]" />

      <div className="relative z-40 mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500 transition-colors hover:text-[#00ff22]"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            {backLabel}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#00ff22]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#00ff22]">
              {eyebrow}
            </span>
          </div>

          <h1 className="relative text-5xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-7xl">
            <span className="relative inline-block">
              {title}
              <motion.span
                aria-hidden
                className="absolute inset-0 text-[#00ff22] opacity-60"
                animate={{ x: [0, -3, 2, 0, 0, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.03, 0.06, 0.1, 0.5, 1] }}
              >
                {title}
              </motion.span>
              <motion.span
                aria-hidden
                className="absolute inset-0 text-red-500 opacity-40"
                animate={{ x: [0, 3, -2, 0, 0, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.03, 0.06, 0.1, 0.5, 1] }}
              >
                {title}
              </motion.span>
            </span>
            {accent && (
              <>
                <br />
                <span className="text-[#00ff22] drop-shadow-[0_0_25px_rgba(0,255,34,0.6)]">
                  {accent}
                </span>
              </>
            )}
          </h1>

          {lede && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">{lede}</p>
          )}
        </motion.div>

        <div className="mt-16">{children}</div>
      </div>
    </section>
  );
}
