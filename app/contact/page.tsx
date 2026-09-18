"use client";
import { motion } from "motion/react";
import { useState } from "react";
import PageShell from "../../PageShell";
import { createClient } from "@/lib/supabase/client";

const INFO: [string, string][] = [
  ["ADDRESS", "— add store address —"],
  ["PHONE", "— add phone number —"],
  ["WHATSAPP", "— add whatsapp number —"],
  ["EMAIL", "— add email —"],
  ["HOURS", "Mon–Sat · 10:00–20:00"],
  ["SUNDAY", "Closed"],
];

const SUBJECTS = [
  "General enquiry",
  "Laptop / PC",
  "Mobile",
  "CCTV survey",
  "Gadgets",
  "Service / repair",
];

const field =
  "w-full rounded-lg border border-[#00ff22]/20 bg-black/50 px-4 py-3 text-white placeholder-gray-600 outline-none transition-all focus:border-[#00ff22] focus:shadow-[0_0_20px_rgba(0,255,34,0.25)]";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadTime] = useState(() => Date.now());

  return (
    <PageShell
      eyebrow="/// GET IN TOUCH"
      title="Contact"
      lede="Tell us what you need. We will check stock, price and delivery and get back to you."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* ---- FORM ---- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="border border-[#00ff22]/25 bg-[#040a06] p-7"
          style={{ clipPath: "polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)" }}
        >
          <div className="mb-6 flex items-center justify-between border-b border-[#00ff22]/25 pb-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#00ff22]">
              Send a message
            </span>
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[#00ff22]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {sent ? (
            <div className="py-14 text-center">
              <div className="mb-3 font-mono text-sm tracking-[0.2em] text-[#00ff22]">
                MESSAGE RECEIVED
              </div>
              <p className="text-gray-400">
                Thanks — we will get back to you shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 border border-[#00ff22]/40 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#00ff22] transition-colors hover:bg-[#00ff22] hover:text-black"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                
                // 1. Check load time (if < 3s, reject as bot but show success)
                if (Date.now() - loadTime < 3000) {
                  setSent(true);
                  return;
                }

                // 2. Rate limit (1 per 60s)
                const lastSubmit = localStorage.getItem('last_enquiry_time');
                if (lastSubmit && Date.now() - parseInt(lastSubmit) < 60000) {
                  alert("Please wait a minute before sending another message.");
                  return;
                }
                
                const formData = new FormData(e.currentTarget);
                
                // 3. Honeypot check
                if (formData.get('website')) {
                  setSent(true); // Silent success for bots
                  return;
                }

                setLoading(true);
                
                const data = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  subject: formData.get('subject'),
                  message: formData.get('message'),
                };

                try {
                  const res = await fetch("/api/enquiries", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                  });
                  
                  if (res.ok) {
                    localStorage.setItem('last_enquiry_time', Date.now().toString());
                    setSent(true);
                  } else {
                    const result = await res.json();
                    alert("Failed to send message: " + (result.error || "Unknown error"));
                  }
                } catch (err) {
                  alert("An error occurred while sending the message.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {/* HONEYPOT */}
              <div className="absolute opacity-0 -z-50 h-0 overflow-hidden" aria-hidden="true">
                <label>Leave this empty</label>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <input name="name" className={field} placeholder="Your name" required />
              <input name="email" className={field} type="email" placeholder="Email" required />
              <input name="phone" className={field} placeholder="Phone" />
              <select name="subject" className={field} defaultValue={SUBJECTS[0]}>
                {SUBJECTS.map((s) => (
                  <option key={s} className="bg-black">
                    {s}
                  </option>
                ))}
              </select>
              <textarea name="message" className={field} rows={5} placeholder="What do you need?" required maxLength={2000} />

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 35px rgba(0,255,34,0.7)" } : undefined}
                whileTap={!loading ? { scale: 0.98 } : undefined}
                className="mt-1 bg-[#00ff22] py-3.5 font-mono text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_22px_rgba(0,255,34,0.4)] disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send message →"}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* ---- INFO ---- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col gap-6"
        >
          <div
            className="border border-[#00ff22]/25 bg-[#040a06] p-7"
            style={{ clipPath: "polygon(18px 0,100% 0,100% calc(100% - 18px),calc(100% - 18px) 100%,0 100%,0 18px)" }}
          >
            <div className="mb-5 border-b border-[#00ff22]/25 pb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[#00ff22]">
              Reach us
            </div>
            {INFO.map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between gap-6 border-b border-[#00ff22]/10 py-3 font-mono text-[12px] last:border-0"
              >
                <span className="tracking-[0.16em] text-gray-500">{k}</span>
                <span className="text-right text-[#00ff22]">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex h-56 items-center justify-center border border-[#00ff22]/25 bg-[#040a06] font-mono text-[11px] tracking-[0.2em] text-[#00ff22]/40">
            [ GOOGLE MAP EMBED ]
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
