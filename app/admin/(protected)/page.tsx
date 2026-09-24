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
      <h1 className="mb-8 font-mono text-2xl uppercase tracking-widest text-white">
        Dashboard Overview
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={totalProducts || 0} />
        <StatCard title="Active Products" value={activeProducts || 0} />
        <StatCard title="Out of Stock" value={outOfStock || 0} alert={outOfStock ? outOfStock > 0 : false} />
        <StatCard title="Monthly Enquiries" value={monthlyEnquiries || 0} />
        <StatCard title="Monthly Views" value={monthlyViews || 0} />
      </div>

      <div className="mt-12 border border-[#00ff22]/20 bg-black/50 p-6">
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-[#00ff22]">
          System Status
        </h2>
        <div className="font-mono text-xs text-gray-400 leading-relaxed">
          {status.map((s) => (
            <p key={s.label}>
              &gt; {s.label}:{" "}
              <span className={s.ok ? "text-[#00ff22]" : "text-red-400"}>{s.ok ? "OK" : "FAIL"}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, alert = false }: { title: string; value: number | string; alert?: boolean }) {
  return (
    <div
      className={`border p-6 ${
        alert
          ? "border-red-500/50 bg-red-950/20 text-red-400"
          : "border-[#00ff22]/25 bg-[#040a06] text-white"
      }`}
      style={{ clipPath: "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)" }}
    >
      <div className={`mb-2 font-mono text-[10px] uppercase tracking-widest ${alert ? "text-red-400/80" : "text-gray-500"}`}>
        {title}
      </div>
      <div className={`font-mono text-3xl ${alert ? "text-red-400" : "text-[#00ff22]"}`}>
        {value}
      </div>
    </div>
  );
}
