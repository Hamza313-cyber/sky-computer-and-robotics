"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Import CSV", href: "/admin/import" },
  { label: "Enquiries", href: "/admin/enquiries" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // Client-side admin check
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: isAdmin, error } = await supabase.rpc("is_admin");
      if (error || !isAdmin) {
        await supabase.auth.signOut();
        router.push("/");
      }
    };
    checkAdmin();
  }, [supabase, router]);

  return (
    <div className="min-h-screen text-ink flex flex-col md:flex-row gap-4 p-3 md:p-5">
      {/* Sidebar */}
      <aside className="gtile w-full md:w-64 md:shrink-0 rounded-[28px] flex flex-col md:sticky md:top-5 md:h-[calc(100vh-40px)]">
        <div className="p-5 flex items-center gap-3">
          <span className="jelly w-11 h-11 shrink-0">
            <LayoutDashboard size={20} />
          </span>
          <Link href="/admin" className="font-display text-lg text-ink">
            Sky Admin
          </Link>
        </div>
        <nav className="flex-1 px-4 pb-4 flex flex-wrap md:flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`${isActive ? "jpill active" : "jpill light"} h-11 px-4 text-sm md:w-full md:justify-start`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="jpill alt h-11 w-full text-sm"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 md:p-3 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
