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
      <h1 className="mb-6 font-mono text-2xl uppercase tracking-widest text-ink">
        Customer Enquiries
      </h1>
      <EnquiriesClient initialEnquiries={data || []} />
    </div>
  );
}
