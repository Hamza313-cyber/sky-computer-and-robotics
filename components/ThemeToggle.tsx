"use client";
import { useEffect, useState } from "react";
import { Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isNeu, setIsNeu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("sky-theme");
    if (savedTheme === "neu" || document.documentElement.getAttribute("data-theme") === "neu") {
      setIsNeu(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextNeu = !isNeu;
    setIsNeu(nextNeu);
    
    if (nextNeu) {
      document.documentElement.setAttribute("data-theme", "neu");
      localStorage.setItem("sky-theme", "neu");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("sky-theme");
    }
  };

  if (!mounted) {
    return <div className="w-[104px] h-[52px] sm:w-[136px] sm:h-[64px]" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isNeu ? "Switch to chocolate theme" : "Switch to milky white theme"}
      aria-pressed={isNeu}
      className="relative flex items-center shrink-0 rounded-full transition-all duration-300 press w-[104px] h-[52px] sm:w-[136px] sm:h-[64px]"
      style={
        isNeu
          ? {
              background: "#EEF0F3",
              boxShadow: "inset 6px 6px 12px #C3C8D1, inset -6px -6px 12px #FFFFFF",
            }
          : {
              background: "linear-gradient(160deg,#6B3E2A,#3B1E12)",
              boxShadow: "inset 0 4px 10px rgba(0,0,0,0.45), 0 8px 18px rgba(74,37,24,0.3)",
            }
      }
    >
      <div
        className="absolute top-[5px] sm:top-[6px] flex items-center justify-center rounded-full z-10 w-[42px] h-[42px] sm:w-[52px] sm:h-[52px]"
        style={{
          left: isNeu ? "calc(100% - 5px)" : "5px",
          transform: isNeu ? "translateX(-100%)" : "translateX(0)",
          transition: "left .35s cubic-bezier(.6,-0.2,.3,1.3), transform .35s cubic-bezier(.6,-0.2,.3,1.3), background 0.35s, box-shadow 0.35s, color 0.35s",
          ...(isNeu
            ? {
                background: "linear-gradient(145deg,#FFFFFF,#E1E5EB)",
                boxShadow: "5px 5px 10px #BCC2CC, -3px -3px 8px #FFFFFF",
                color: "#1F5EFF",
              }
            : {
                background: "radial-gradient(circle at 35% 25%,rgba(255,255,255,0.7) 0,rgba(255,255,255,0) 45%),linear-gradient(160deg,#D9A97F,#9A6443)",
                color: "#FFF4E8",
              }),
        }}
      >
        <Sun size={20} className="sm:w-6 sm:h-6" />
      </div>
      
      <div className="absolute w-full px-2.5 sm:px-4 flex justify-between items-center text-[10px] sm:text-[13px] font-bold tracking-[1px] sm:tracking-[2px]">
        <span style={{ opacity: isNeu ? 1 : 0, color: "#555B67", transition: "opacity 0.35s" }}>CHOCO</span>
        <span style={{ opacity: isNeu ? 0 : 1, color: "#F4E3D2", transition: "opacity 0.35s" }}>MILKY</span>
      </div>
    </button>
  );
}
