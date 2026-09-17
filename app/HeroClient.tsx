"use client";
import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { MiniBot } from "../CircuitCore";
import MatrixRain from "../MatrixRain";
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

export default function CyberHero() {

  const [titleHover, setTitleHover] = useState(false);



  return (
    <>
    <section className="relative isolate min-h-screen bg-[#010603] overflow-hidden flex items-center">
      <MatrixRain intensity={1} />

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

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#001a08_1px,transparent_1px),linear-gradient(to_bottom,#001a08_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_5%,#000_85%)]" />


      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-40 max-w-[1600px] mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
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
              <div className="text-[11px] font-normal leading-relaxed text-gray-300">
                Established tech house building custom PCs, robotics kits and AI systems.
              </div>
              <div className="mt-3 flex flex-col gap-1 text-[10px]">
                <div className="flex justify-between text-gray-500"><span>UPTIME</span><span className="text-[#00ff88]">99.9%</span></div>
                <div className="flex justify-between text-gray-500"><span>UNITS_DEPLOYED</span><span className="text-[#00ff88]">10,000+</span></div>
                <div className="flex justify-between text-gray-500"><span>STATUS</span><span className="text-[#00ff88]">ONLINE</span></div>
              </div>
            </motion.div>
          </motion.div>

          <motion.p variants={fromLeft} className="text-sm font-mono tracking-[0.2em] text-[#00ff22] uppercase font-bold">
            Powering a smarter tomorrow
          </motion.p>

          <motion.p variants={fromLeft} className="text-gray-300 max-w-sm leading-relaxed">
            High performance systems. Intelligent robotics. Real world solutions. All under one sky.
          </motion.p>
        </div>

        {/* CENTER â€” CIRCUIT CORE */}
        <motion.div
          variants={fromBottom}
          className="lg:col-span-4 relative flex items-center justify-center h-[560px]"
          
          
        >




          {/* CIRCUIT CORE + LASER */}
          <div className="relative z-10 w-full max-w-[540px] h-[500px] rounded-2xl overflow-hidden border border-[#00ff22]/30 shadow-[0_0_50px_rgba(0,255,34,0.2)]">
            <video
              src="/hero-circuit.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[#00ff22]/25 mix-blend-color" />
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,255,34,0.5) 0px, rgba(0,255,34,0.5) 1px, transparent 1px, transparent 4px)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#010603] via-transparent to-transparent" />
            <div className="pointer-events-none absolute bottom-3 left-4 text-[9px] font-mono text-[#00ff22]/70 tracking-widest">
              CORE_SYSTEM // ONLINE
            </div>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div variants={container} className="lg:col-span-3 flex flex-col gap-5">
          <motion.div
            variants={fromRight}
            whileHover={{ borderColor: "#00ff22", boxShadow: "0 0 30px rgba(0,255,34,0.25)" }}
            className="border border-[#00ff22]/30 bg-[#001104]/80 backdrop-blur-md rounded-xl p-5"
          >
            <h3 className="text-white font-bold tracking-widest mb-4 text-sm uppercase">
              Next Gen <br /><span className="text-[#00ff22]">Technology</span>
            </h3>
            <div className="w-full border border-[#00ff22]/20 bg-[#001a08]/60 rounded-lg mb-4 overflow-hidden">
              <MiniBot />
            </div>
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
                  <span className="text-gray-500 tracking-wider">CORE</span>
                  <span className="text-[#00ff22]">ONLINE</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-500 tracking-wider">LOAD</span>
                    <span className="text-[#00ff22]">68%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-[#00ff22]/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#00ff22]"
                      animate={{ width: ["45%", "72%", "58%", "68%"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      style={{ boxShadow: "0 0 6px #00ff22" }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 tracking-wider">UPTIME</span>
                  <span className="text-[#00ff22]">99.9%</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#00ff22]/15">
                  <span className="text-gray-500 tracking-wider">NODE</span>
                  <span className="text-[#00ff22]/70">RX-09</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fromRight} className="grid grid-cols-2 gap-3">
            {[["10K+", "Customers"], ["500+", "Products"], ["AI", "Driven"], ["24/7", "Support"]].map(([n, l], i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06 }}
                className="border border-[#00ff22]/25 bg-black/50 rounded-lg p-3 text-center"
              >
                <div className="text-[#00ff22] font-black text-lg">{n}</div>
                <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider">{l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </motion.div>
    </section>

    
    </>
  );
}

