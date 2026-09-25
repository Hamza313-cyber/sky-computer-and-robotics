import { createClient } from "@/lib/supabase/server";
import SimpleCrudClient from "../SimpleCrudClient";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <h1 className="mb-6 font-mono text-2xl uppercase tracking-widest text-ink">
        Categories
      </h1>
      <SimpleCrudClient table="categories" initialData={data || []} />
    </div>
  );
}
