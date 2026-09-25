"use client";
import { motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import DancingTitle from "../DancingTitle";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fromLeft: Variants = {
  hidden: { opacity: 0, x: -60, filter: "blur(8px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const fromRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: "blur(8px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const fromBottom: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* Background video: poster first (fast LCP), video starts after page load.
   Skipped on Save-Data and reduced-motion. Source: Pexels #35977437 (free license), recoloured green, 5s loop. */
function HeroVideoBackground() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (saveData || reduce) return;
    const start = () => setPlay(true);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/videos/hero-circuit-poster.webp" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      {play && (
        <video autoPlay muted loop playsInline preload="none" poster="/videos/hero-circuit-poster.webp"
          className="absolute inset-0 h-full w-full object-cover">
          <source src="/videos/hero-circuit.webm" type="video/webm" />
          <source src="/videos/hero-circuit.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-transparent" />
    </div>
  );
}

export default function CyberHero() {

  const [titleHover, setTitleHover] = useState(false);



  return (
    <>
    <section className="relative isolate min-h-screen bg-[#010603] overflow-hidden flex items-center">
      <HeroVideoBackground />
      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,255,34,0.4) 0px, rgba(0,255,34,0.4) 1px, transparent 1px, transparent 4px)",
        }}
      />

      <motion.div
        className="pointer-events-none absolute left-0 right-0 h-24 z-20"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,255,34,0.12), transparent)" }}
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#001a08_1px,transparent_1px),linear-gradient(to_bottom,#001a08_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />


      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-40 max-w-[1600px] mx-auto w-full px-6 md:px-12 pt-28 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-8 items-center"
      >

        {/* LEFT */}
        <div className="lg:col-span-5 flex flex-col gap-5 relative z-40">

          <motion.div variants={fromLeft} className="text-xs font-mono tracking-[0.4em] text-[#00ff22]/80">
            /// TECHNOLOGY BEYOND LIMITS
          </motion.div>

          <motion.div
            variants={fromLeft}
            className="relative w-fit"
            onMouseEnter={() => setTitleHover(true)}
            onMouseLeave={() => setTitleHover(false)}
          >
            <DancingTitle />

            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={titleHover ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-none absolute left-full top-8 ml-6 z-[100] w-64 border border-[#00ff88] bg-black/95 p-4 font-mono normal-case tracking-normal shadow-[0_0_30px_rgba(0,255,120,0.45)]"
            >
              <div className="mb-2 flex items-center justify-between border-b border-[#00ff88]/30 pb-2">
                <span className="text-[10px] font-bold text-[#00ff88]">SYSTEM_PROFILE</span>
                <motion.span
                  className="h-2 w-2 rounded-full bg-[#00ff88]"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </div>
              <div className="text-[11px] font-normal leading-relaxed text-[#b8ffc8]">
                Retail tech store \u2014 laptops, mobiles, CCTV security systems and gadgets.
                Genuine stock, expert setup, service you can walk into.
              </div>
              <div className="mt-3 flex flex-col gap-1 text-[10px]">
                <div className="flex justify-between text-[#00ff22]/60"><span>LAPTOPS</span><span className="text-[#00ff88]">IN STOCK</span></div>
                <div className="flex justify-between text-[#00ff22]/60"><span>MOBILES</span><span className="text-[#00ff88]">IN STOCK</span></div>
                <div className="flex justify-between text-[#00ff22]/60"><span>CCTV</span><span className="text-[#00ff88]">INSTALLED</span></div>
              </div>
            </motion.div>
          </motion.div>

          <motion.p variants={fromLeft} className="text-sm font-mono tracking-[0.2em] text-[#00ff22] uppercase font-bold">
            Powering a smarter tomorrow
          </motion.p>

          <motion.p variants={fromLeft} className="text-[#b8ffc8] max-w-sm leading-relaxed">
            High performance systems. Intelligent robotics. Real world solutions. All under one sky.
          </motion.p>
        </div>

        {/* BOTTOM-LEFT: status panel + stat tiles */}
        <motion.div variants={container} className="lg:col-span-7 lg:col-start-1 flex flex-col sm:flex-row sm:items-stretch gap-5">
          <motion.div
            variants={fromBottom}
            whileHover={{ borderColor: "#00ff22", boxShadow: "0 0 30px rgba(0,255,34,0.25)" }}
            className="sm:w-72 shrink-0 border border-[#00ff22]/30 bg-[#001104]/80 backdrop-blur-md rounded-xl p-5"
          >
            <h3 className="text-[#7dff95] font-bold tracking-widest mb-4 text-sm uppercase">
              Next Gen <br /><span className="text-[#00ff22]">Technology</span>
            </h3>
            <div className="mt-4 rounded-xl border border-[#00ff22]/25 bg-black/40 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#00ff22]">SYSTEM STATUS</span>
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#00ff22]"
                  animate={{ opacity: [1, 0.2, 1], scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ boxShadow: "0 0 8px #00ff22" }}
                />
              </div>

              <div className="flex flex-col gap-2.5 font-mono text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#00ff22]/60 tracking-wider">CORE</span>
                  <span className="text-[#00ff22]">ONLINE</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#00ff22]/60 tracking-wider">GENUINE STOCK</span>
                    <span className="text-[#00ff22]">100%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-[#00ff22]/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#00ff22]"
                      animate={{ width: ["45%", "72%", "58%", "100%"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      style={{ boxShadow: "0 0 6px #00ff22" }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#00ff22]/60 tracking-wider">WARRANTY</span>
                  <span className="text-[#00ff22]">ON EVERY ITEM</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#00ff22]/15">
                  <span className="text-[#00ff22]/60 tracking-wider">SETUP</span>
                  <span className="text-[#00ff22]/70">INCLUDED</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fromBottom} className="sm:w-72 shrink-0 grid grid-cols-2 gap-3 content-stretch">
            {[["100%", "Genuine"], ["Top", "Brands"], ["Free", "Setup"], ["In-house", "Service"]].map(([n, l], i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06 }}
                className="border border-[#00ff22]/25 bg-black/50 rounded-lg p-3 text-center"
              >
                <div className="text-[#00ff22] font-black text-lg">{n}</div>
                <div className="text-[#00ff22]/60 text-[10px] font-mono uppercase tracking-wider">{l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </motion.div>
    </section>

    
    </>
  );
}

