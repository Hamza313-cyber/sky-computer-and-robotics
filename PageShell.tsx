"use client";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

/* Shared inner-page wrapper: back button, eyebrow, big heading, lede. The page's glassy background shows through. */
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
    <section className="relative pb-20 pt-28 md:pt-32">
      <div className="relative mx-auto w-full max-w-[1200px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Link href={backHref} className="jpill alt h-10 px-5 text-sm">
            <span aria-hidden="true">←</span>
            {backLabel}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-accent" />
            <span className="text-label text-xs font-bold uppercase tracking-[0.3em]">{eyebrow}</span>
          </div>

          <h1 className="font-display text-ink text-5xl md:text-7xl uppercase leading-[0.98]">
            {title}
            {accent && (
              <>
                <br />
                <span className="text-accent">{accent}</span>
              </>
            )}
          </h1>

          {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">{lede}</p>}
        </motion.div>

        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
