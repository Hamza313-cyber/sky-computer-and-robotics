"use client";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Check, ShieldCheck, Wrench, Store, Laptop, Smartphone, Cctv, Headphones } from "lucide-react";

/* Category capsules: tinted glass tubes with a cut-out product inside (public/images/cutouts/, transparent PNG).
   A category without a thumb shows its icon instead. */
const HERO_CATS = [
  { slug: "laptops", name: "Laptops", thumb: "/images/cutouts/laptops.png", icon: Laptop, fill: false },
  { slug: "mobiles", name: "Mobiles", thumb: "", icon: Smartphone, fill: true },
  { slug: "cctv", name: "CCTV", thumb: "/images/cutouts/cctv.png", icon: Cctv, fill: false },
  { slug: "gadgets", name: "Gadgets", thumb: "/images/cutouts/gadgets.png", icon: Headphones, fill: false },
];

const WHY = [
  { icon: Check, title: "100% Genuine", sub: "Original products from top brands" },
  { icon: ShieldCheck, title: "Warranty", sub: "On every item" },
  { icon: Wrench, title: "Free Setup", sub: "We set it up for you" },
  { icon: Store, title: "In-house Service", sub: "Support right at our store" },
];

export default function CyberHero() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative w-full pt-32 md:pt-36 pb-16 max-w-[1400px] mx-auto px-5 md:px-12">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,620px)_1fr] gap-14 items-center"
      >
        {/* LEFT COLUMN */}
        <div className="flex flex-col items-start gap-5 sm:gap-6 relative z-20">
          <motion.div variants={fadeUp} className="text-label text-[13px] font-bold tracking-[0.4em] uppercase">
            /// TECHNOLOGY BEYOND LIMITS
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-ink text-[40px] sm:text-5xl md:text-7xl lg:text-[68px] 2xl:text-[84px] leading-[0.98] uppercase">
            SKY <br /> COMPUTERS &amp; <br /> ROBOTICS
          </motion.h1>

          <motion.div variants={fadeUp} className="text-muted font-bold tracking-[0.3em] uppercase">
            POWERING A SMARTER TOMORROW
          </motion.div>

          <motion.p variants={fadeUp} className="text-body text-lg max-w-lg leading-relaxed">
            High performance systems. Intelligent robotics. Real world solutions. All under one sky.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mt-2">
            <Link href="/products" className="jpill flex items-center justify-center h-[60px] px-8 text-base">
              Browse Products
            </Link>
            <a href="https://wa.me/917001904082" target="_blank" rel="noopener noreferrer" className="jpill alt flex items-center justify-center h-[60px] px-8 text-base">
              Chat on WhatsApp &rarr;
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="gtile rounded-[36px] p-4 sm:p-5 w-full mt-4">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
              {HERO_CATS.map((c) => (
                <Link key={c.slug} href={`/products/${c.slug}`} className={`jcap w-full max-w-[112px] mx-auto${c.fill ? " fill" : ""}`}>
                  <span className="jcap-win">
                    {c.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.thumb} alt="" loading="lazy" />
                    ) : (
                      <c.icon className="w-7 h-7 sm:w-9 sm:h-9" />
                    )}
                  </span>
                  <span className="jcap-label text-xs sm:text-sm">{c.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <motion.div variants={fadeUp} className="relative w-full h-[520px] lg:h-[720px] rounded-[40px] overflow-hidden shadow-[0_30px_50px_-20px_rgba(74,37,24,0.5)] neu:shadow-[0_30px_50px_-20px_rgba(20,22,27,0.3)]">
          <Image 
            src="/images/sky-accessories.jpg" 
            alt="Smartwatch, earbuds and keyboard on a dark desk"
            fill
            priority
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      {/* WHY SKY strip: centred below the hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="gtile mx-auto mt-12 max-w-[1100px] rounded-[36px] px-6 py-7 md:px-10 md:py-8"
      >
        <h3 className="mb-6 text-center font-display text-ink text-lg uppercase tracking-[3px]">Why Sky</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {WHY.map((w, i) => (
            <div key={w.title} className="flex items-center gap-4 lg:flex-col lg:text-center lg:gap-3">
              <span className={`${i % 3 === 0 ? "jelly" : "jelly alt"} w-[58px] h-[58px] shrink-0 flex items-center justify-center`}>
                <w.icon size={24} />
              </span>
              <div>
                <div className="font-bold text-ink leading-tight">{w.title}</div>
                <div className="mt-0.5 text-[13px] leading-snug text-muted">{w.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
