"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";
import { Lock } from "lucide-react";

const field = "well w-full rounded-[20px] px-4 py-3 text-ink placeholder:text-muted outline-none";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-ink">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="gtile w-full max-w-md rounded-[32px] p-8"
      >
        <div className="mb-8 flex items-center gap-4">
          <span className="jelly alt w-14 h-14 shrink-0">
            <Lock size={24} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-label">Sky Admin</p>
            <h1 className="font-display text-2xl text-ink">Sign in</h1>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-xs font-bold uppercase tracking-[2px] text-label">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              placeholder="admin@skycomputers.com"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-[2px] text-label">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="jpill mt-3 h-14 w-full text-base disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
