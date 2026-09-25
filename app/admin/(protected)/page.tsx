import { Package, CheckCircle2, AlertTriangle, MessageSquare, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Dynamic dashboard

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Basic stats
  const { count: totalProducts, error: dbError } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { count: activeProducts } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true);
  const { count: outOfStock } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("in_stock", false);
  
  // Enquiries this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const { count: monthlyEnquiries } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString());

  // Page views this month
  const { count: monthlyViews } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth.toISOString());

  // Real health checks (previously hardcoded "OK")
  const { error: storageError } = await supabase.storage.from("product-images").list("", { limit: 1 });
  const { data: { user } } = await supabase.auth.getUser();
  const status = [
    { label: "DB Connection", ok: !dbError },
    { label: "Storage Bucket", ok: !storageError },
    { label: "Auth Module", ok: !!user },
  ];

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[3px] text-label">Sky Admin</p>
      <h1 className="mb-8 font-display text-3xl md:text-4xl text-ink">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total products" value={totalProducts || 0} icon={<Package size={20} />} />
        <StatCard title="Active products" value={activeProducts || 0} icon={<CheckCircle2 size={20} />} />
        <StatCard title="Out of stock" value={outOfStock || 0} icon={<AlertTriangle size={20} />} alert={outOfStock ? outOfStock > 0 : false} />
        <StatCard title="Enquiries this month" value={monthlyEnquiries || 0} icon={<MessageSquare size={20} />} />
        <StatCard title="Views this month" value={monthlyViews || 0} icon={<Eye size={20} />} />
      </div>

      <div className="gtile mt-8 rounded-[28px] p-6">
        <h2 className="mb-4 font-display text-xl text-ink">System status</h2>
        <div className="flex flex-wrap gap-3">
          {status.map((s) => (
            <span key={s.label} className={`${s.ok ? "jpill light" : "jpill alt"} h-10 px-4 text-sm gap-2`}>
              <span aria-hidden className={`inline-block h-2.5 w-2.5 rounded-full ${s.ok ? "bg-green-600" : "bg-red-600"}`} />
              {s.label}: {s.ok ? "OK" : "Problem"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, alert = false }: { title: string; value: number | string; icon: React.ReactNode; alert?: boolean }) {
  return (
    <div className={`gtile rounded-[26px] p-5 flex flex-col gap-4 ${alert ? "ring-2 ring-red-500/50" : ""}`}>
      <span className={`${alert ? "jelly alt" : "jelly"} w-11 h-11`}>{icon}</span>
      <div>
        <div className={`font-display text-3xl ${alert ? "text-red-700" : "text-ink"}`}>{value}</div>
        <div className="mt-1 text-xs font-bold uppercase tracking-[1.5px] text-label">{title}</div>
      </div>
    </div>
  );
}
