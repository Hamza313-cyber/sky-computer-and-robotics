"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 border border-[#00ff22]/20 bg-[#040a06]">
        <table className="w-full text-left font-mono text-xs text-gray-400">
          <thead className="border-b border-[#00ff22]/20 bg-[#00ff22]/5 text-[#00ff22]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Order</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00ff22]/10">
            {items.map((i) => (
              <tr key={i.id} className="hover:bg-white/5">
                <td className="p-4 text-white font-bold">{i.name}</td>
                <td className="p-4">{i.slug}</td>
                <td className="p-4">{i.sort_order}</td>
                <td className="p-4">{i.is_active ? "Active" : "Hidden"}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => setEditing(i)} className="text-[#00ff22]">Edit</button>
                  <button onClick={() => deleteItem(i.id)} className="text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:col-span-1 border border-[#00ff22]/20 bg-[#040a06] p-6 h-fit">
        <h3 className="font-mono text-sm uppercase text-[#00ff22] mb-4 border-b border-[#00ff22]/20 pb-2">
          {editing ? "Edit Item" : "Add New Item"}
        </h3>
        <form key={editing?.id ?? "new"} onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-[10px] text-gray-400">Name</label>
            <input name="name" defaultValue={editing?.name || ""} required className="w-full bg-black border border-[#00ff22]/20 p-2 text-white outline-none focus:border-[#00ff22]" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] text-gray-400">Slug</label>
            <input name="slug" defaultValue={editing?.slug || ""} required className="w-full bg-black border border-[#00ff22]/20 p-2 text-white outline-none focus:border-[#00ff22]" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] text-gray-400">Description</label>
            <textarea name="description" defaultValue={editing?.description || ""} rows={3} className="w-full bg-black border border-[#00ff22]/20 p-2 text-white outline-none focus:border-[#00ff22]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-mono text-[10px] text-gray-400">Sort Order</label>
              <input name="sort_order" type="number" defaultValue={editing?.sort_order || 0} className="w-full bg-black border border-[#00ff22]/20 p-2 text-white outline-none focus:border-[#00ff22]" />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[10px] text-gray-400">Active</label>
              <select name="is_active" defaultValue={editing?.is_active !== false ? "true" : "false"} className="w-full bg-black border border-[#00ff22]/20 p-2 text-white outline-none focus:border-[#00ff22]">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            {editing && <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 font-mono text-[10px] text-gray-400 border border-gray-800">Cancel</button>}
            <button type="submit" className="px-4 py-2 font-mono text-[10px] text-black bg-[#00ff22]">{editing ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
