import PageShell from "../../PageShell";
import { HubCard } from "./HubCard";
import { createClient } from "@/lib/supabase/public";

export const revalidate = 300;

export default async function ProductsHub() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (
    <PageShell
      eyebrow="/// EXPLORE OUR RANGE"
      title="Products"
      lede="Everything from high performance machines to smart security - pick a category to see what we stock."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.map((c, i) => (
          <HubCard key={c.id} c={c} i={i} />
        ))}
      </div>
    </PageShell>
  );
}
