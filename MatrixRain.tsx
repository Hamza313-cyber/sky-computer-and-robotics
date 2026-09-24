"use client";
import { useEffect, useRef } from "react";

export default function MatrixRain({ intensity = 0.85 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹ0123456789<>[]{}/*+-=$#@%&";
    const fontSize = 16;
    let cols = 0;
    let drops: number[] = [];
    let speeds: number[] = [];

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(window.innerWidth / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * -(window.innerHeight / fontSize));
      speeds = new Array(cols).fill(0).map(() => 0.4 + Math.random() * 0.8);
    };
    setup();

    let raf = 0;
    let last = 0;
    const frameGap = 1000 / 30;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < frameGap) return;
      last = now;

      ctx.fillStyle = "rgba(1, 6, 3, 0.09)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < cols; i++) {
        const ch = chars[(Math.random() * chars.length) | 0];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = `rgba(190, 255, 205, ${0.95 * intensity})`;
        ctx.shadowColor = "#00ff22";
        ctx.shadowBlur = 8 * intensity;
        ctx.fillText(ch, x, y);

        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(0, 255, 34, ${0.5 * intensity})`;
        ctx.fillText(chars[(Math.random() * chars.length) | 0], x, y - fontSize);

        drops[i] += speeds[i];
        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[i] = -Math.random() * 20;
          speeds[i] = 0.4 + Math.random() * 0.8;
        }
      }
    };

    if (!reduce) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.fillStyle = "rgba(0,255,34,0.15)";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < cols; i++) {
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * fontSize, Math.random() * window.innerHeight);
      }
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [intensity]);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none" />;
}