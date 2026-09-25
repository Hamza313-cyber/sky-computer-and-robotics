"use client";
import { motion } from "motion/react";
import { useState } from "react";
import PageShell from "../../PageShell";
import { Phone, MessageCircle, Mail, Clock, CalendarX, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type InfoRow = { label: string; value: string; href?: string; icon: typeof Phone };

const INFO: InfoRow[] = [
  { label: "Phone", value: "+91 70019 04082", href: "tel:+917001904082", icon: Phone },
  { label: "WhatsApp", value: "+91 70019 04082", href: "https://wa.me/917001904082", icon: MessageCircle },
  { label: "Email", value: "skycomputerrobotics@gmail.com", href: "mailto:skycomputerrobotics@gmail.com", icon: Mail },
  { label: "Hours", value: "Mon\u2013Sat \u00b7 10:00\u201320:00", icon: Clock },
  { label: "Sunday", value: "Closed", icon: CalendarX },
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
  "well w-full rounded-[20px] px-5 py-3.5 text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-accent";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-[0.2em] text-label";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="/// GET IN TOUCH"
      title="Contact"
      lede="Tell us what you need. We will check stock, price and delivery and get back to you."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* ---- FORM ---- */}
        <Suspense fallback={<div className="gtile rounded-[32px] p-8 text-center text-muted">Loading form...</div>}>
          <ContactForm />
        </Suspense>

        {/* ---- INFO ---- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col gap-6"
        >
          <div className="gtile rounded-[32px] p-6 md:p-8">
            <div className="mb-5 font-display text-ink text-xl uppercase">Reach us</div>
            <div className="flex flex-col gap-4">
              {INFO.map(({ label, value, href, icon: Icon }, i) => (
                <div key={label} className="flex items-center gap-4">
                  <span className={`${i % 3 === 0 ? "jelly" : "jelly alt"} w-12 h-12 flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-label">{label}</div>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="break-all font-bold text-ink hover:text-accent transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="font-bold text-ink">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/917001904082"
              target="_blank"
              rel="noopener noreferrer"
              className="jpill h-12 px-6 mt-7"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Map goes here once the store address is confirmed */}
        </motion.div>
      </div>
    </PageShell>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject") || SUBJECTS[0];
  const productId = searchParams.get("product_id") || "";
  
  const subjectOptions = [...SUBJECTS];
  if (initialSubject && !SUBJECTS.includes(initialSubject)) {
    subjectOptions.unshift(initialSubject);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="gtile rounded-[32px] p-6 md:p-8"
    >
      <div className="mb-6 font-display text-ink text-xl uppercase">Send a message</div>

      {sent ? (
        <div className="py-12 text-center flex flex-col items-center">
          <span className="jelly w-16 h-16 flex items-center justify-center mb-5">
            <Send className="w-7 h-7" />
          </span>
          <div className="font-display text-ink text-2xl uppercase">Message received</div>
          <p className="mt-2 text-body">Thanks — we will get back to you shortly.</p>
          <button onClick={() => setSent(false)} className="jpill alt h-11 px-6 mt-6 text-sm">
            Send another
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            
            // Rate limit (1 per 60s)
            const lastSubmit = localStorage.getItem('last_enquiry_time');
            if (lastSubmit && Date.now() - parseInt(lastSubmit) < 60000) {
              alert("Please wait a minute before sending another message.");
              return;
            }
            
            const formData = new FormData(e.currentTarget);
            setLoading(true);
            
            const data = {
              name: formData.get('name'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              subject: formData.get('subject'),
              message: formData.get('message'),
              website: formData.get('website'),
              product_id: formData.get('product_id'),
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
                // If it's a silent honeypot rejection from the server, we still show success
                if (result.silent_reject) {
                  setSent(true);
                } else {
                  alert("Failed to send message: " + (result.error || "Unknown error"));
                }
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
          
          <input type="hidden" name="product_id" value={productId} />

          <label><span className={labelCls}>Name</span><input name="name" className={field} placeholder="Your name" required autoComplete="name" /></label>
          <label><span className={labelCls}>Email</span><input name="email" className={field} type="email" placeholder="you@example.com" required autoComplete="email" /></label>
          <label><span className={labelCls}>Phone</span><input name="phone" className={field} type="tel" placeholder="Phone (optional)" autoComplete="tel" /></label>
          <label><span className={labelCls}>Subject</span><select name="subject" className={field} defaultValue={initialSubject}>
            {subjectOptions.map((s) => (
              <option key={s}>
                {s}
              </option>
            ))}
          </select></label>
          <label><span className={labelCls}>Message</span><textarea name="message" className={field} rows={5} placeholder="What do you need?" required maxLength={2000} /></label>

          <button
            type="submit"
            disabled={loading}
            className="jpill h-14 mt-2 w-full text-base disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? "Sending..." : "Send message →"}
          </button>
        </form>
      )}
    </motion.div>
  );
}
