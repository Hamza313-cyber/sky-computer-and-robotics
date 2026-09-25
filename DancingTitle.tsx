"use client";
import { motion } from "motion/react";
import { useState } from "react";

/* Letters that bounce in a wave while the cursor is on the title */
function Dance({
  text,
  hovered,
  delayBase = 0,
}: {
  text: string;
  hovered: boolean;
  delayBase?: number;
}) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="inline-block"
          animate={
            hovered
              ? { y: [0, -16, 0], rotate: [0, -7, 0], scale: [1, 1.14, 1] }
              : { y: 0, rotate: 0, scale: 1 }
          }
          transition={
            hovered
              ? {
                  duration: 0.62,
                  repeat: Infinity,
                  repeatDelay: 0.35,
                  delay: delayBase + i * 0.055,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </>
  );
}

/* One line of neon-green text with mint + cyan chromatic split behind it */
function Line({
  text,
  hovered,
  delayBase = 0,
  className = "",
}: {
  text: string;
  hovered: boolean;
  delayBase?: number;
  className?: string;
}) {
  return (
    <span className={`relative inline-block text-[#00ff22] ${className}`}>
      <Dance text={text} hovered={hovered} delayBase={delayBase} />

      <motion.span
        aria-hidden
        className="absolute inset-0 text-[#00ff88] opacity-50 mix-blend-screen"
        animate={{ x: [0, -3, 2, 0, 0, 0] }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.03, 0.06, 0.1, 0.5, 1] }}
      >
        <Dance text={text} hovered={hovered} delayBase={delayBase} />
      </motion.span>

      <motion.span
        aria-hidden
        className="absolute inset-0 text-[#38e8ff] opacity-40 mix-blend-screen"
        animate={{ x: [0, 3, -2, 0, 0, 0] }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.03, 0.06, 0.1, 0.5, 1] }}
      >
        <Dance text={text} hovered={hovered} delayBase={delayBase} />
      </motion.span>
    </span>
  );
}

export default function DancingTitle() {
  const [hov, setHov] = useState(false);

  return (
    <motion.h1
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      whileHover={{ scale: 1.015, y: -5 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className="relative w-fit cursor-pointer text-5xl font-black uppercase leading-[0.95] md:text-7xl"
      style={{
        textShadow:
          "0 0 10px rgba(0,255,34,0.65), 0 0 36px rgba(0,255,34,0.40), 0 3px 18px rgba(0,0,0,0.9)",
      }}
    >
      <Line text="SKY" hovered={hov} />
      <br />
      <Line text="COMPUTERS &" hovered={hov} delayBase={0.16} className="text-4xl md:text-6xl" />
      <br />
      <Line text="ROBOTICS" hovered={hov} delayBase={0.34} className="text-4xl md:text-6xl" />
    </motion.h1>
  );
}
