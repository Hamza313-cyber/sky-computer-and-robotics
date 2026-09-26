import { createClient } from "@/lib/supabase/server";
import SimpleCrudClient from "../SimpleCrudClient";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[3px] text-label">Sky Admin</p>
      <h1 className="mb-6 font-display text-3xl md:text-4xl text-ink">
        Categories
      </h1>
      <SimpleCrudClient table="categories" initialData={data || []} />
    </div>
  );
}
