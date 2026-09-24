"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <div className="min-h-screen bg-[#010603] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-[#00ff22]/20 bg-[#040a06] flex flex-col">
        <div className="p-6 border-b border-[#00ff22]/20">
          <Link href="/admin" className="font-mono text-sm tracking-widest text-[#00ff22] uppercase">
            [ SKY_ADMIN ]
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-[#00ff22]/10 text-[#00ff22] border-l-2 border-[#00ff22]"
                    : "text-gray-400 hover:text-[#00ff22] hover:bg-[#00ff22]/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#00ff22]/20">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
            TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
