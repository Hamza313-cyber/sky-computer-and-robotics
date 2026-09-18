"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";

const field = "w-full rounded-lg border border-[#00ff22]/20 bg-black/50 px-4 py-3 text-white placeholder-gray-600 outline-none transition-all focus:border-[#00ff22] focus:shadow-[0_0_20px_rgba(0,255,34,0.25)]";

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
    <div className="min-h-screen bg-[#010603] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md border border-[#00ff22]/25 bg-[#040a06] p-8"
        style={{ clipPath: "polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)" }}
      >
        <div className="mb-8 flex items-center justify-between border-b border-[#00ff22]/25 pb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#00ff22]">
            System Login
          </span>
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-[#00ff22]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {error && (
          <div className="mb-6 border border-red-500/50 bg-red-950/80 px-4 py-3 font-mono text-[11px] text-red-400">
            [ERROR]: {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#00ff22]/60">
              Email Identifier
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              placeholder="admin@skycomputers.com"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[#00ff22]/60">
              Passcode
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              placeholder="••••••••"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 35px rgba(0,255,34,0.7)" } : undefined}
            whileTap={!loading ? { scale: 0.98 } : undefined}
            className="mt-4 bg-[#00ff22] py-3.5 font-mono text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_22px_rgba(0,255,34,0.4)] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Initialize Session →"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
