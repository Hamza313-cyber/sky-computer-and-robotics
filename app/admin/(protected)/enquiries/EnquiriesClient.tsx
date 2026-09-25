"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* List */}
      <div className="md:col-span-1 border border-black/20 bg-white/35 overflow-y-auto max-h-[80vh]">
        {enquiries.length === 0 && <div className="p-6 text-muted font-mono text-xs">No enquiries.</div>}
        {enquiries.map((e) => (
          <div 
            key={e.id}
            onClick={() => setSelected(e)}
            className={`p-4 border-b border-black/10 cursor-pointer transition-colors ${selected?.id === e.id ? "bg-accent/10 border-l-2 border-l-accent" : "hover:bg-accent/5"}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-sm text-ink">{e.name}</span>
              <span className={`text-[10px] uppercase px-1.5 py-0.5 ${e.status === 'new' ? 'bg-accent/20 text-accent' : e.status === 'closed' ? 'bg-black/10 text-body' : 'bg-yellow-500/20 text-yellow-700'}`}>
                {e.status}
              </span>
            </div>
            <div className="text-xs text-body truncate">{e.subject}</div>
            <div className="text-[10px] text-muted mt-2">{new Date(e.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {/* Detail View */}
      <div className="md:col-span-2 border border-black/20 bg-white/35 p-6">
        {selected ? (
          <div>
            <div className="flex justify-between items-start mb-6 border-b border-black/20 pb-4">
              <div>
                <h2 className="text-xl font-bold text-ink mb-1">{selected.subject}</h2>
                <div className="text-xs font-mono text-body">
                  From: <span className="text-accent">{selected.name}</span> ({selected.email})
                </div>
                {selected.phone && <div className="text-xs font-mono text-body">Phone: {selected.phone}</div>}
              </div>
              <select 
                value={selected.status} 
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="bg-white/60 border border-black/20 text-xs font-mono text-accent px-2 py-1 outline-none"
              >
                <option value="new">NEW</option>
                <option value="contacted">CONTACTED</option>
                <option value="closed">CLOSED</option>
              </select>
            </div>
            
            {selected.products && (
              <div className="mb-6 p-4 border border-black/10 bg-accent/5 font-mono text-xs">
                <span className="text-body">Related Product:</span> <span className="text-accent">{selected.products.name}</span>
              </div>
            )}
            
            <div className="whitespace-pre-wrap text-body font-sans leading-relaxed">
              {selected.message}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted font-mono text-xs">
            Select an enquiry to view details
          </div>
        )}
      </div>
    </div>
  );
}
