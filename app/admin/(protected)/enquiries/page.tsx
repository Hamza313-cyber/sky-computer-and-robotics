import { createClient } from "@/lib/supabase/server";
import EnquiriesClient from "./EnquiriesClient";

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  
  const { data, count } = await supabase
    .from("enquiries")
    .select("*, products(name)", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[3px] text-label">Sky Admin</p>
      <h1 className="mb-6 font-display text-3xl md:text-4xl text-ink">
        Customer Enquiries
      </h1>
      <EnquiriesClient initialEnquiries={data || []} />
    </div>
  );
}
