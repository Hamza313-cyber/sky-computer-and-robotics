"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { BookOpen, Wrench, ShieldCheck, BadgeCheck, Award, Settings, Store } from "lucide-react";
import PageShell from "../../PageShell";

const STORY = [
  {
    icon: BookOpen,
    tone: "jelly",
    h: "Our Story",
    p: "Sky Computers & Robotics started as a small counter fixing machines nobody else would touch. Word spread, the counter became a store, and the store became the place people bring their tech problems to.",
  },
  {
    icon: Wrench,
    tone: "jelly alt",
    h: "What We Do",
    p: "We sell, build, install and service. Laptops and phones across every major brand, custom PC builds, full CCTV setups for homes and shops, and the accessories that hold it all together.",
  },
  {
    icon: ShieldCheck,
    tone: "jelly",
    h: "Why Choose Us",
    p: "Genuine stock with real warranty. Setup and data transfer included, not charged extra. And a service desk you can actually walk into when something goes wrong.",
  },
];

const STATS = [
  { icon: BadgeCheck, big: "100%", small: "Genuine products" },
  { icon: Award, big: "Top brands", small: "Under one roof" },
  { icon: Settings, big: "Free", small: "Setup & data transfer" },
  { icon: Store, big: "In-house", small: "Service desk" },
];

const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="/// WHO WE ARE"
      title="About"
      accent="Us"
      lede="A tech house that sells, builds and services — with people you can actually reach."
    >
      <div className="flex flex-col gap-6">
        {STORY.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.h}
              {...rise}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="gtile rounded-[32px] p-6 md:p-8"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
                <span className={`${s.tone} w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0`}>
                  <Icon className="w-7 h-7 md:w-8 md:h-8" />
                </span>
                <div>
                  <h2 className="font-display text-ink text-2xl md:text-3xl uppercase">{s.h}</h2>
                  <p className="mt-3 max-w-2xl leading-relaxed text-body">{s.p}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        {...rise}
        transition={{ duration: 0.6 }}
        className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5"
      >
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.small} className="gtile rounded-[28px] p-5 md:p-6 flex flex-col gap-4">
              <span className={`${i % 3 === 0 ? "jelly" : "jelly alt"} w-12 h-12 flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </span>
              <div>
                <div className="font-display text-ink text-xl md:text-2xl">{s.big}</div>
                <div className="mt-1 text-sm text-muted">{s.small}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        {...rise}
        transition={{ duration: 0.6 }}
        className="gtile mt-12 rounded-[32px] p-6 md:p-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
      >
        <div>
          <div className="font-display text-ink text-2xl uppercase">Come see the store</div>
          <p className="mt-2 text-body">Walk in with your requirement, walk out with it sorted.</p>
        </div>
        <Link href="/contact" className="jpill h-14 px-8 shrink-0">
          Get in touch →
        </Link>
      </motion.div>
    </PageShell>
  );
}
