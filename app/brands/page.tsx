import { createClient } from "@/lib/supabase/public";
import Link from "next/link";

export const revalidate = 60; // optionally cache for 60s

export default async function BrandsPage() {
  const supabase = createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase">
          OUR <span className="text-[#00ff22]">BRANDS</span>
        </h1>
        <p className="font-mono text-gray-400 text-sm max-w-xl">
          AUTHORIZED PARTNERS. GENUINE WARRANTY. NO COMPROMISE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands?.map((brand) => (
          <Link href={`/brands/${brand.slug}`} key={brand.id} className="group relative block">
            {/* Angled HUD panel container */}
            <div className="absolute inset-0 bg-[#00ff22]/5 transform -skew-x-12 scale-x-95 scale-y-95 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            
            <div className="relative border border-[#00ff22]/30 bg-[#001104]/80 backdrop-blur-md p-8 h-full flex flex-col gap-4 transition-colors duration-300 group-hover:border-[#00ff22]">
              {/* Corner decorative bracket */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00ff22]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00ff22]" />

              <h2 className="text-2xl font-black tracking-widest uppercase text-white group-hover:text-[#00ff22] transition-colors">
                {brand.name}
              </h2>
              
              <p className="font-mono text-xs text-gray-400 leading-relaxed flex-1">
                {brand.description || "Official partner with comprehensive support and service."}
              </p>
              
              <div className="mt-4 pt-4 border-t border-[#00ff22]/20 font-mono text-[10px] tracking-widest text-[#00ff22] flex items-center justify-between">
                <span>VIEW LINEUP</span>
                <span>// {brand.slug.toUpperCase()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
