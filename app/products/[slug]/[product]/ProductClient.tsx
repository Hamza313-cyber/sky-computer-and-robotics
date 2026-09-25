"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Package, ShieldCheck, CheckCircle2, XCircle, MessageCircle } from "lucide-react";
import PageShell from "../../../../PageShell";

const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function ProductClient({ product }: { product: any }) {
  const images: string[] = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const current = images[active];

  // An image can fail before React hydrates (onError never fires), so check after it mounts.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setBroken(true);
  }, [current]);

  const specs = product.specs ? Object.entries(product.specs) : [];
  const hasPrice = product.price != null;
  const hasDiscount = hasPrice && product.mrp && Number(product.mrp) > Number(product.price);

  const enquireHref =
    `/contact?subject=${encodeURIComponent(`Enquiry for ${product.name}`)}` +
    `&product_id=${encodeURIComponent(product.id)}`;
  const waHref = `https://wa.me/917001904082?text=${encodeURIComponent(
    `Hi, I'm interested in ${product.name}. Is it available?`
  )}`;

  return (
    <PageShell
      eyebrow={`/// ${product.categories?.name?.toUpperCase() || "PRODUCT"}`}
      title={product.name}
      lede={product.short_description}
      backHref={`/products/${product.categories?.slug || ""}`}
      backLabel={`Back to ${product.categories?.name || "category"}`}
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {/* ---- IMAGE ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="gtile rounded-[36px] p-3 md:p-4 flex flex-col gap-4 self-start w-full"
        >
          <div className="jwin relative h-[360px] lg:h-[520px]">
            {broken || !current ? (
              <span className="jelly alt w-20 h-20 flex items-center justify-center relative z-[2]">
                <Package className="w-9 h-9" />
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img ref={imgRef} src={current} alt={product.name} onError={() => setBroken(true)} />
            )}

            <div className="absolute right-4 top-4 z-[4] flex flex-col items-end gap-2">
              {product.in_stock ? (
                <span className="jpill alt h-9 px-4 text-xs"><CheckCircle2 className="w-4 h-4" /> In stock</span>
              ) : (
                <span className="jpill light h-9 px-4 text-xs"><XCircle className="w-4 h-4" /> Out of stock</span>
              )}
              {product.warranty_months ? (
                <span className="jpill h-9 px-4 text-xs">
                  <ShieldCheck className="w-4 h-4" /> {product.warranty_months} months warranty
                </span>
              ) : null}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Product photos">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => {
                    setActive(i);
                    setBroken(false);
                  }}
                  className={`jwin h-16 w-16 shrink-0 rounded-[18px] transition-transform ${
                    i === active ? "scale-105 ring-2 ring-accent ring-offset-2 ring-offset-transparent" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ---- DETAILS ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="flex flex-col gap-6"
        >
          <div className="gtile rounded-[32px] p-6 md:p-8">
            <div className="text-label text-xs font-bold uppercase tracking-[0.25em]">Retail price</div>
            <div className="mt-2 flex flex-wrap items-baseline gap-4">
              {hasPrice ? (
                <span className="font-display text-ink text-4xl">{inr(product.price)}</span>
              ) : (
                <span className="font-display text-ink text-3xl">Price on request</span>
              )}
              {hasDiscount && <span className="text-lg text-muted line-through">{inr(product.mrp)}</span>}
            </div>
            {product.description && <p className="mt-5 leading-relaxed text-body">{product.description}</p>}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={enquireHref} className="jpill h-14 px-7 flex-1 text-base">
                Enquire about this →
              </Link>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="jpill alt h-14 px-7 flex-1 text-base">
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
            </div>
          </div>

          {specs.length > 0 && (
            <div className="gtile rounded-[32px] p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-[3px] w-8 rounded-full bg-accent" />
                <h2 className="text-label text-xs font-bold uppercase tracking-[0.3em]">Specifications</h2>
              </div>
              <dl className="flex flex-col">
                {specs.map(([key, value], i) => (
                  <div
                    key={key}
                    className={`grid grid-cols-[40%_1fr] gap-4 py-3 ${i !== specs.length - 1 ? "border-b border-[rgba(92,52,30,0.18)]" : ""}`}
                  >
                    <dt className="text-xs font-bold uppercase tracking-wider text-label">{key.replace(/_/g, " ")}</dt>
                    <dd className="text-ink">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
}
