"use client";
import { useEffect, useRef, useState } from "react";
import { Laptop, Smartphone, Cctv, Headphones, Printer, Monitor, HardDrive, Package, type LucideIcon } from "lucide-react";

/* Local photos used when a category has no working image_url.
   New category? Add its slug here once a photo is in public/images/. */
const LOCAL: Record<string, string> = {
  laptops: "/images/sky-laptop.jpg",
  cctv: "/images/sky-cctv.jpg",
  gadgets: "/images/sky-headphones.jpg",
};

/* Icon for the "photo coming soon" tile, picked from the slug so new categories get a sensible icon. */
function iconFor(slug: string): LucideIcon {
  const s = slug.toLowerCase();
  if (s.includes("laptop") || s.includes("computer") || s.includes("pc")) return Laptop;
  if (s.includes("mobile") || s.includes("phone")) return Smartphone;
  if (s.includes("cctv") || s.includes("camera") || s.includes("security")) return Cctv;
  if (s.includes("print")) return Printer;
  if (s.includes("monitor") || s.includes("display")) return Monitor;
  if (s.includes("storage") || s.includes("drive")) return HardDrive;
  if (s.includes("gadget") || s.includes("audio") || s.includes("headphone")) return Headphones;
  return Package;
}

export default function CategoryImage({
  slug,
  src,
  alt,
  className = "",
}: {
  slug: string;
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // An image can fail before React hydrates (onError never fires), so check once on mount.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setBroken(true);
  }, [src]);

  const finalSrc = !src || broken ? LOCAL[slug] : src;

  if (!finalSrc) {
    const Icon = iconFor(slug);
    return (
      <div className={`gtile flex flex-col items-center justify-center gap-4 ${className}`}>
        <span className="jelly alt w-20 h-20 flex items-center justify-center">
          <Icon className="w-8 h-8" />
        </span>
        <span className="font-bold text-muted text-sm">Photo coming soon</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={finalSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (!broken) setBroken(true);
      }}
      className={`object-cover ${className}`}
    />
  );
}
