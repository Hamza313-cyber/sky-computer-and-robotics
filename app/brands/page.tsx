import { createClient } from "@/lib/supabase/public";
import Link from "next/link";
import PageShell from "../../PageShell";

export const revalidate = 60;

export default async function BrandsPage() {
  const supabase = createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <PageShell
      eyebrow="/// THE BRANDS WE STOCK"
      title="Our"
      accent="Brands"
      lede="Genuine products from the names you already trust, with warranty on every item."
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands?.map((brand, i) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="gtile group flex h-full flex-col gap-4 rounded-[30px] p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <span
                className={`${i % 3 === 0 ? "jelly" : "jelly alt"} w-14 h-14 shrink-0 flex items-center justify-center overflow-hidden`}
              >
                {brand.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.logo_url} alt="" className="w-8 h-8 object-contain" />
                ) : (
                  <span className="font-display text-xl">{brand.name.charAt(0)}</span>
                )}
              </span>
              <h2 className="font-display text-ink text-2xl uppercase group-hover:text-accent transition-colors">
                {brand.name}
              </h2>
            </div>
            <p className="flex-1 text-sm leading-relaxed text-body">
              {brand.description || "Genuine products with full warranty and in-store support."}
            </p>
            <span className="jpill alt h-10 w-fit px-5 text-sm">
              View lineup <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
