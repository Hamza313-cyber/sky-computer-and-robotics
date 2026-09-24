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
      <div className="md:col-span-1 border border-[#00ff22]/20 bg-[#040a06] overflow-y-auto max-h-[80vh]">
        {enquiries.length === 0 && <div className="p-6 text-gray-500 font-mono text-xs">No enquiries.</div>}
        {enquiries.map((e) => (
          <div 
            key={e.id}
            onClick={() => setSelected(e)}
            className={`p-4 border-b border-[#00ff22]/10 cursor-pointer transition-colors ${selected?.id === e.id ? "bg-[#00ff22]/10 border-l-2 border-l-[#00ff22]" : "hover:bg-[#00ff22]/5"}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-sm text-white">{e.name}</span>
              <span className={`text-[10px] uppercase px-1.5 py-0.5 ${e.status === 'new' ? 'bg-[#00ff22]/20 text-[#00ff22]' : e.status === 'closed' ? 'bg-gray-800 text-gray-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {e.status}
              </span>
            </div>
            <div className="text-xs text-gray-400 truncate">{e.subject}</div>
            <div className="text-[10px] text-gray-600 mt-2">{new Date(e.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {/* Detail View */}
      <div className="md:col-span-2 border border-[#00ff22]/20 bg-[#040a06] p-6">
        {selected ? (
          <div>
            <div className="flex justify-between items-start mb-6 border-b border-[#00ff22]/20 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{selected.subject}</h2>
                <div className="text-xs font-mono text-gray-400">
                  From: <span className="text-[#00ff22]">{selected.name}</span> ({selected.email})
                </div>
                {selected.phone && <div className="text-xs font-mono text-gray-400">Phone: {selected.phone}</div>}
              </div>
              <select 
                value={selected.status} 
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="bg-black border border-[#00ff22]/20 text-xs font-mono text-[#00ff22] px-2 py-1 outline-none"
              >
                <option value="new">NEW</option>
                <option value="contacted">CONTACTED</option>
                <option value="closed">CLOSED</option>
              </select>
            </div>
            
            {selected.products && (
              <div className="mb-6 p-4 border border-[#00ff22]/10 bg-[#00ff22]/5 font-mono text-xs">
                <span className="text-gray-400">Related Product:</span> <span className="text-[#00ff22]">{selected.products.name}</span>
              </div>
            )}
            
            <div className="whitespace-pre-wrap text-gray-300 font-sans leading-relaxed">
              {selected.message}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 font-mono text-xs">
            Select an enquiry to view details
          </div>
        )}
      </div>
    </div>
  );
}
