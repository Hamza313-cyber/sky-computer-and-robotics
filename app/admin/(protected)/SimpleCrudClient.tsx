"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2 } from "lucide-react";

/* Postgres error codes -> plain language for a non-technical user */
function friendlyError(error: { code?: string; message: string }) {
  if (error.code === "23505") return "Something with this slug already exists. Use a different slug.";
  if (error.code === "23503") return "This still has products linked to it. Move or remove them first.";
  return error.message;
}

export default function SimpleCrudClient({ table, initialData }: { table: "categories" | "brands", initialData: any[] }) {
  const [items, setItems] = useState(initialData);
  const [editing, setEditing] = useState<any | null>(null);
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    };

    if (editing?.id) {
      const { data: rows, error } = await supabase
        .from(table)
        .update(data)
        .eq("id", editing.id)
        .select("id");
      if (error) {
        alert(friendlyError(error));
        return; // keep the form in edit mode so the next click does not insert a duplicate
      }
      if (!rows || rows.length === 0) {
        alert("Nothing was saved. Your session may have expired \u2014 please log in again.");
        return;
      }
      setItems(items.map((i) => (i.id === editing.id ? { ...i, ...data } : i)));
    } else {
      const { data: newData, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single();
      if (error || !newData) {
        alert(error ? friendlyError(error) : "Could not save.");
        return;
      }
      setItems([...items, newData]);
    }
    setEditing(null);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { data: rows, error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .select("id");
    if (error) {
      alert(friendlyError(error));
      return;
    }
    if (!rows || rows.length === 0) {
      alert("Nothing was deleted. Your session may have expired \u2014 please log in again.");
      return;
    }
    setItems(items.filter((i) => i.id !== id));
  };

  const statusPill = (active: boolean) => (
    <span className={`${active ? "jpill light" : "jpill alt"} h-8 px-3 text-xs pointer-events-none`}>
      {active ? "Active" : "Hidden"}
    </span>
  );

  const actions = (i: any) => (
    <div className="flex items-center gap-2">
      <button onClick={() => setEditing(i)} aria-label={`Edit ${i.name}`} className="jelly btn w-9 h-9">
        <Pencil size={15} />
      </button>
      <button onClick={() => deleteItem(i.id)} aria-label={`Delete ${i.name}`} className="jelly alt btn w-9 h-9">
        <Trash2 size={15} />
      </button>
    </div>
  );

  const fid = (n: string) => `${table}-${n}`;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {/* Desktop table */}
        <div className="gtile hidden md:block overflow-x-auto rounded-[28px] p-2">
          <table className="w-full text-left text-sm text-body">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-[1.5px] text-label">
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {items.map((i) => (
                <tr key={i.id} className={`transition-colors hover:bg-white/25 ${editing?.id === i.id ? "bg-white/30" : ""}`}>
                  <td className="p-4 font-bold text-ink">{i.name}</td>
                  <td className="p-4 text-muted">{i.slug}</td>
                  <td className="p-4">{i.sort_order}</td>
                  <td className="p-4">{statusPill(i.is_active)}</td>
                  <td className="p-4"><div className="flex justify-end">{actions(i)}</div></td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted">Nothing added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phone cards */}
        <div className="grid gap-3 md:hidden">
          {items.map((i) => (
            <div key={i.id} className="gtile flex items-center justify-between gap-3 rounded-[24px] p-4">
              <div className="min-w-0">
                <div className="font-bold text-ink">{i.name}</div>
                <div className="text-xs text-muted">{i.slug} · Order {i.sort_order}</div>
                <div className="mt-2">{statusPill(i.is_active)}</div>
              </div>
              {actions(i)}
            </div>
          ))}
          {items.length === 0 && <div className="gtile rounded-[24px] p-8 text-center text-muted">Nothing added yet.</div>}
        </div>
      </div>

      <div className="gtile h-fit rounded-[28px] p-6">
        <h3 className="mb-4 font-display text-xl text-ink">
          {editing ? `Edit: ${editing.name}` : "Add new"}
        </h3>
        <form key={editing?.id ?? "new"} onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor={fid("name")} className="mb-1.5 block text-xs font-bold uppercase tracking-[1.5px] text-label">Name</label>
            <input id={fid("name")} name="name" defaultValue={editing?.name || ""} required className="well w-full rounded-[18px] px-4 py-3 text-sm text-ink outline-none" />
          </div>
          <div>
            <label htmlFor={fid("slug")} className="mb-1.5 block text-xs font-bold uppercase tracking-[1.5px] text-label">Slug (web address)</label>
            <input id={fid("slug")} name="slug" defaultValue={editing?.slug || ""} required className="well w-full rounded-[18px] px-4 py-3 text-sm text-ink outline-none" />
          </div>
          <div>
            <label htmlFor={fid("description")} className="mb-1.5 block text-xs font-bold uppercase tracking-[1.5px] text-label">Description</label>
            <textarea id={fid("description")} name="description" defaultValue={editing?.description || ""} rows={3} className="well w-full rounded-[18px] px-4 py-3 text-sm text-ink outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={fid("sort")} className="mb-1.5 block text-xs font-bold uppercase tracking-[1.5px] text-label">Sort order</label>
              <input id={fid("sort")} name="sort_order" type="number" defaultValue={editing?.sort_order || 0} className="well w-full rounded-[18px] px-4 py-3 text-sm text-ink outline-none" />
            </div>
            <div>
              <label htmlFor={fid("active")} className="mb-1.5 block text-xs font-bold uppercase tracking-[1.5px] text-label">Active</label>
              <select id={fid("active")} name="is_active" defaultValue={editing?.is_active !== false ? "true" : "false"} className="well w-full rounded-[18px] px-4 py-3 text-sm text-ink outline-none">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            {editing && <button type="button" onClick={() => setEditing(null)} className="jpill alt h-10 px-5 text-sm">Cancel</button>}
            <button type="submit" className="jpill h-10 px-5 text-sm">{editing ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
