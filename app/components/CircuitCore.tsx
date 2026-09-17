"use client";
import { motion } from "motion/react";

const GREEN = "#00ff22";
const DIM = "#0a5c1c";

function Trace({ d, delay = 0, dur = 3, w = 1.2 }: { d: string; delay?: number; dur?: number; w?: number }) {
  return (
    <>
      <path d={d} stroke={DIM} strokeWidth={w} fill="none" opacity={0.5} />
      <motion.path
        d={d}
        stroke={GREEN}
        strokeWidth={w}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="30 220"
        initial={{ strokeDashoffset: 250 }}
        animate={{ strokeDashoffset: -250 }}
        transition={{ duration: dur, repeat: Infinity, ease: "linear", delay }}
        style={{ filter: `drop-shadow(0 0 4px ${GREEN})` }}
      />
    </>
  );
}

function DataPanel({ x, y, cols, rows, cell = 9, delay = 0 }: { x: number; y: number; cols: number; rows: number; cell?: number; delay?: number }) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <motion.rect
          key={`${r}-${c}`}
          x={x + c * cell}
          y={y + r * cell}
          width={cell - 2}
          height={cell - 2}
          fill={GREEN}
          animate={{ opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 2 + ((r + c) % 3), repeat: Infinity, delay: delay + (r * cols + c) * 0.08 }}
        />
      );
    }
  }
  return <g>{cells}</g>;
}

function Bar({ x, y, h, delay = 0 }: { x: number; y: number; h: number; delay?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={5} height={h} fill="none" stroke={DIM} strokeWidth={1} />
      <motion.rect
        x={x + 1}
        width={3}
        fill={GREEN}
        animate={{ height: [0, h - 2, 0], y: [y + h, y + 1, y + h] }}
        transition={{ duration: 3.5, repeat: Infinity, delay, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 3px ${GREEN})` }}
      />
    </g>
  );
}

export default function CircuitCore() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 500 560" className="w-full h-full" style={{ maxHeight: 560 }}>
        <defs>
          <pattern id="microgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" stroke={DIM} strokeWidth="0.4" opacity="0.4" />
          </pattern>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.9" />
            <stop offset="60%" stopColor={GREEN} stopOpacity="0.15" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="500" height="560" fill="url(#microgrid)" />

        <rect x="20" y="40" width="70" height="55" fill="none" stroke={DIM} strokeWidth="1" />
        <DataPanel x={26} y={46} cols={7} rows={5} cell={9} />
        <Trace d="M90 68 L140 68 L140 120 L200 120" delay={0} dur={3} />

        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "400px 90px" }}
        >
          <circle cx="400" cy="90" r="42" fill="none" stroke={GREEN} strokeWidth="1.5" strokeDasharray="60 25" opacity="0.7" />
          <circle cx="400" cy="90" r="32" fill="none" stroke={DIM} strokeWidth="1" strokeDasharray="10 8" />
        </motion.g>
        <circle cx="400" cy="90" r="18" fill="none" stroke={GREEN} strokeWidth="1" opacity="0.5" />
        <Trace d="M400 132 L400 175 L330 175 L330 220" delay={0.8} dur={3.5} />

        <Bar x={30} y={150} h={90} delay={0} />
        <Bar x={42} y={150} h={90} delay={0.5} />
        <Bar x={54} y={150} h={90} delay={1} />
        <text x={28} y={258} fill={GREEN} fontSize="7" fontFamily="monospace" opacity="0.7">BUFFERING</text>

        <circle cx="250" cy="280" r="120" fill="url(#coreGlow)" opacity="0.35" />

        <motion.circle
          cx="250" cy="280" r="95" fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="120 60"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 280px", filter: `drop-shadow(0 0 6px ${GREEN})` }}
        />
        <motion.circle
          cx="250" cy="280" r="78" fill="none" stroke={GREEN} strokeWidth="1" strokeDasharray="8 14" opacity="0.6"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 280px" }}
        />
        <motion.circle
          cx="250" cy="280" r="60" fill="none" stroke={GREEN} strokeWidth="1.5" strokeDasharray="40 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "250px 280px" }}
        />

        <rect x="228" y="258" width="44" height="44" fill="#020a04" stroke={GREEN} strokeWidth="1.5" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1={238 + i * 9} y1="258" x2={238 + i * 9} y2="244" stroke={GREEN} strokeWidth="1" opacity="0.8" />
            <line x1={238 + i * 9} y1="302" x2={238 + i * 9} y2="316" stroke={GREEN} strokeWidth="1" opacity="0.8" />
            <line x1="228" y1={268 + i * 9} x2="214" y2={268 + i * 9} stroke={GREEN} strokeWidth="1" opacity="0.8" />
            <line x1="272" y1={268 + i * 9} x2="286" y2={268 + i * 9} stroke={GREEN} strokeWidth="1" opacity="0.8" />
          </g>
        ))}
        <motion.circle
          cx="250" cy="280" r="7" fill={GREEN}
          animate={{ opacity: [0.5, 1, 0.5], r: [6, 8, 6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 10px ${GREEN})` }}
        />

        <Trace d="M130 280 L200 280" delay={0.3} dur={2.5} />
        <Trace d="M300 280 L380 280 L380 340" delay={1.2} dur={3} />
        <Trace d="M250 160 L250 200" delay={0.6} dur={2} />
        <Trace d="M250 360 L250 410 L160 410" delay={1.5} dur={3.2} />

        <rect x="30" y="430" width="110" height="80" fill="none" stroke={DIM} strokeWidth="1" />
        <DataPanel x={38} y={438} cols={11} rows={7} cell={9} delay={0.4} />

        <rect x="330" y="420" width="90" height="70" fill="none" stroke={DIM} strokeWidth="1" />
        <DataPanel x={338} y={428} cols={8} rows={6} cell={9} delay={0.9} />
        <motion.circle
          cx="440" cy="380" r="26" fill="none" stroke={GREEN} strokeWidth="1.2" strokeDasharray="30 20"
          animate={{ rotate: -360 }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "440px 380px" }}
        />

        <text x="330" y="205" fill={GREEN} fontSize="8" fontFamily="monospace" opacity="0.75">SYS_CORE 35%</text>
        <text x="30" y="530" fill={GREEN} fontSize="8" fontFamily="monospace" opacity="0.75">NODE_ID: RX-09</text>
        <text x="330" y="512" fill={GREEN} fontSize="8" fontFamily="monospace" opacity="0.75">LINK: ACTIVE</text>

        <motion.rect
          x="0" width="500" height="50" fill={GREEN} opacity="0.06"
          animate={{ y: [-60, 570] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
export function MiniBot() {
  return (
    <div className="w-full h-32 flex items-center justify-center overflow-hidden">
      <motion.svg
        viewBox="0 0 200 130"
        className="w-full h-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="100" y1="24" x2="100" y2="12" stroke={GREEN} strokeWidth="1.5" />
        <motion.circle
          cx="100" cy="9" r="3.5" fill={GREEN}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ filter: `drop-shadow(0 0 6px ${GREEN})` }}
        />

        <motion.g
          animate={{ rotate: [0, -3, 0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 55px" }}
        >
          <polygon points="76,28 124,28 132,44 128,66 100,74 72,66 68,44" fill="#0d1410" stroke={GREEN} strokeWidth="1.4" />
          <polygon points="82,36 118,36 124,48 120,62 100,68 80,62 76,48" fill="#020a04" stroke={DIM} strokeWidth="1" />

          <polygon points="84,44 116,44 113,54 87,54" fill="#1a0000" stroke="#ff2b2b" strokeWidth="1" />
          <motion.rect
            y="46" width="10" height="6" fill="#ff2b2b"
            animate={{ x: [88, 104, 88] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0 0 5px #ff2b2b)" }}
          />

          <circle cx="72" cy="50" r="2.5" fill={GREEN} opacity="0.7" />
          <circle cx="128" cy="50" r="2.5" fill={GREEN} opacity="0.7" />
        </motion.g>

        <rect x="93" y="74" width="14" height="8" fill="#0d1410" stroke={DIM} strokeWidth="1" />

        <polygon points="66,86 134,86 140,104 128,118 72,118 60,104" fill="#0d1410" stroke={GREEN} strokeWidth="1.4" />
        <polygon points="74,92 126,92 130,104 122,112 78,112 70,104" fill="#020a04" stroke={DIM} strokeWidth="1" />

        <motion.circle
          cx="100" cy="102" r="6" fill={GREEN}
          animate={{ opacity: [0.5, 1, 0.5], r: [5, 7, 5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${GREEN})` }}
        />

        {[0, 1, 2].map((i) => (
          <motion.rect
            key={i}
            x={76 + i * 6} y="96" width="4" height="10" fill={GREEN}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={`r${i}`}
            x={112 + i * 6} y="96" width="4" height="10" fill={GREEN}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 + i * 0.3 }}
          />
        ))}

        <motion.rect
          x="0" width="200" height="14" fill={GREEN} opacity="0.07"
          animate={{ y: [-20, 140] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>
    </div>
  );
}