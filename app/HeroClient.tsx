"use client";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Check, ShieldCheck, Wrench, Store, Laptop, Smartphone, Cctv, Headphones } from "lucide-react";

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

          <motion.h1 variants={fadeUp} className="font-display text-ink text-5xl md:text-7xl lg:text-[68px] 2xl:text-[84px] leading-[0.98] uppercase">
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

          <motion.div variants={fadeUp} className="gtile rounded-[36px] p-6 w-full mt-4">
            <div className="grid grid-cols-4 gap-2">
              <Link href="/products/laptops" className="flex flex-col items-center gap-3 group">
                <span className="jelly btn w-[64px] h-[64px] lg:w-[84px] lg:h-[84px] flex items-center justify-center shrink-0">
                  <Laptop className="w-6 h-6 lg:w-8 lg:h-8" />
                </span>
                <span className="font-bold text-ink text-xs sm:text-sm">Laptops</span>
              </Link>
              <Link href="/products/mobiles" className="flex flex-col items-center gap-3 group">
                <span className="jelly alt btn w-[64px] h-[64px] lg:w-[84px] lg:h-[84px] flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 lg:w-8 lg:h-8" />
                </span>
                <span className="font-bold text-ink text-xs sm:text-sm">Mobiles</span>
              </Link>
              <Link href="/products/cctv" className="flex flex-col items-center gap-3 group">
                <span className="jelly alt btn w-[64px] h-[64px] lg:w-[84px] lg:h-[84px] flex items-center justify-center shrink-0">
                  <Cctv className="w-6 h-6 lg:w-8 lg:h-8" />
                </span>
                <span className="font-bold text-ink text-xs sm:text-sm">CCTV</span>
              </Link>
              <Link href="/products/gadgets" className="flex flex-col items-center gap-3 group">
                <span className="jelly btn w-[64px] h-[64px] lg:w-[84px] lg:h-[84px] flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6 lg:w-8 lg:h-8" />
                </span>
                <span className="font-bold text-ink text-xs sm:text-sm">Gadgets</span>
              </Link>
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
          
          <div 
            className="gtile absolute left-5 right-5 bottom-5 rounded-[30px] p-6 bg-[linear-gradient(160deg,rgba(255,244,232,0.80),rgba(236,210,186,0.72))] neu:bg-[linear-gradient(160deg,rgba(255,255,255,0.86),rgba(232,235,240,0.80))] border-none backdrop-blur-xl"
          >
            <h3 className="font-display text-ink tracking-[3px] text-lg uppercase mb-5">WHY SKY</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <span className="jelly shrink-0 w-[54px] h-[54px] flex items-center justify-center">
                  <Check size={24} />
                </span>
                <div>
                  <div className="font-bold text-ink leading-none mb-1">100% Genuine</div>
                  <div className="text-muted text-[13px] leading-tight">Original products from top brands</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="jelly alt shrink-0 w-[54px] h-[54px] flex items-center justify-center">
                  <ShieldCheck size={24} />
                </span>
                <div>
                  <div className="font-bold text-ink leading-none mb-1">Warranty</div>
                  <div className="text-muted text-[13px] leading-tight">On every item</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="jelly alt shrink-0 w-[54px] h-[54px] flex items-center justify-center">
                  <Wrench size={24} />
                </span>
                <div>
                  <div className="font-bold text-ink leading-none mb-1">Free Setup</div>
                  <div className="text-muted text-[13px] leading-tight">We set it up for you</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="jelly shrink-0 w-[54px] h-[54px] flex items-center justify-center">
                  <Store size={24} />
                </span>
                <div>
                  <div className="font-bold text-ink leading-none mb-1">In-house Service</div>
                  <div className="text-muted text-[13px] leading-tight">Support right at our store</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
