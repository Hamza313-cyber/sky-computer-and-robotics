import { createClient } from "@/lib/supabase/server";
import SimpleCrudClient from "../SimpleCrudClient";

export const revalidate = 0;

export default async function AdminBrandsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("brands").select("*").order("sort_order");

  return (
    <div>
      <h1 className="mb-6 font-mono text-2xl uppercase tracking-widest text-white">
        Brands
      </h1>
      <SimpleCrudClient table="brands" initialData={data || []} />
    </div>
  );
}
