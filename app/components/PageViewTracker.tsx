"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Records one row in page_views per public page visit.
// Admin pages are skipped so the owner's own clicks don't inflate the count.
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const supabase = createClient();
    supabase
      .from("page_views")
      .insert({ path: pathname, referrer: document.referrer || null })
      .then(({ error }) => {
        if (error) console.warn("page view not recorded:", error.message);
      });
  }, [pathname]);

  return null;
}
