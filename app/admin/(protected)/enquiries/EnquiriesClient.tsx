"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Phone, Inbox } from "lucide-react";

export default function EnquiriesClient({ initialEnquiries }: { initialEnquiries: any[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [selected, setSelected] = useState<any | null>(null);
  const supabase = createClient();

  const updateStatus = async (id: string, status: string) => {
    const { data, error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", id)
      .select("id");
    if (error) {
      alert("Could not update: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      alert("Nothing was saved. Your session may have expired \u2014 please log in again.");
      return;
    }
    setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const statusCls = (st: string) =>
    st === "new" ? "jpill" : st === "closed" ? "jpill light" : "jpill alt";

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* List */}
      <div className="gtile md:col-span-1 max-h-[80vh] overflow-y-auto rounded-[28px] p-3">
        {enquiries.length === 0 && <div className="p-6 text-center text-muted">No enquiries yet.</div>}
        <ul className="space-y-2">
          {enquiries.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setSelected(e)}
                aria-pressed={selected?.id === e.id}
                className={`w-full rounded-[20px] p-4 text-left transition-colors ${selected?.id === e.id ? "well" : "hover:bg-white/30"}`}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-ink">{e.name}</span>
                  <span className={`${statusCls(e.status)} h-7 px-2.5 text-[11px] capitalize pointer-events-none`}>{e.status}</span>
                </div>
                <div className="truncate text-sm text-body">{e.subject}</div>
                <div className="mt-2 text-xs text-muted">{new Date(e.created_at).toLocaleDateString("en-IN")}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Detail View */}
      <div className="gtile md:col-span-2 rounded-[28px] p-6">
        {selected ? (
          <div>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="mb-2 font-display text-2xl text-ink">{selected.subject}</h2>
                <div className="text-sm text-body">
                  From: <span className="font-bold text-ink">{selected.name}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="jpill light h-9 px-3 text-xs gap-1.5">
                      <Mail size={14} /> {selected.email}
                    </a>
                  )}
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="jpill light h-9 px-3 text-xs gap-1.5">
                      <Phone size={14} /> {selected.phone}
                    </a>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="enquiry-status" className="mb-1.5 block text-xs font-bold uppercase tracking-[1.5px] text-label">Status</label>
                <select
                  id="enquiry-status"
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  className="well rounded-[16px] px-4 py-2 text-sm text-ink outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {selected.products && (
              <div className="well mb-6 rounded-[18px] p-4 text-sm">
                <span className="text-body">Related product:</span> <span className="font-bold text-ink">{selected.products.name}</span>
              </div>
            )}

            <div className="whitespace-pre-wrap leading-relaxed text-body">
              {selected.message}
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-center text-muted">
            <span className="jelly alt w-14 h-14"><Inbox size={22} /></span>
            Select an enquiry to read it
          </div>
        )}
      </div>
    </div>
  );
}
