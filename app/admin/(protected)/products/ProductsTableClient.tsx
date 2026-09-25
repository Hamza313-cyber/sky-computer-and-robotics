"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function ProductsTableClient({
  initialProducts,
  count,
  page,
  q,
}: {
  initialProducts: any[];
  count: number;
  page: number;
  q: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState(q);

  /* search / pagination are same-route navigations: the component stays mounted,
     so useState would keep showing the previous page's rows */
  useEffect(() => setProducts(initialProducts), [initialProducts]);
  useEffect(() => setSearch(q), [q]);
  const router = useRouter();
  const supabase = createClient();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/products?q=${encodeURIComponent(search)}`);
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { data, error } = await supabase
      .from("products")
      .update({ is_active: !current })
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
    setProducts(products.map(p => (p.id === id ? { ...p, is_active: !current } : p)));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) {
      if (error.code === "23503") {
        alert(
          "This product cannot be deleted because it is linked to a customer enquiry. " +
            "Switch it to inactive instead."
        );
      } else {
        alert("Could not delete: " + error.message);
      }
      return;
    }
    if (!data || data.length === 0) {
      alert("Nothing was deleted. Your session may have expired \u2014 please log in again.");
      return;
    }
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-md rounded-none border border-black/20 bg-white/30 px-4 py-2 font-mono text-xs text-ink outline-none focus:border-accent"
          />
        </form>
      </div>

      <div className="overflow-x-auto border border-black/20 bg-white/35">
        <table className="w-full text-left font-mono text-xs text-body">
          <thead className="border-b border-black/20 bg-accent/5 text-accent">
            <tr>
              <th className="p-4 font-normal">Image</th>
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">Price</th>
              <th className="p-4 font-normal">Stock</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-black/5 transition-colors">
                <td className="p-4">
                  {p.images?.[0] ? (
                    <div className="relative h-10 w-10 overflow-hidden bg-white/30">
                      <Image src={p.images[0]} alt="" fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 bg-black/10" />
                  )}
                </td>
                <td className="p-4 text-ink">
                  <div className="font-bold">{p.name}</div>
                  <div className="text-[10px] text-muted">{p.sku}</div>
                </td>
                <td className="p-4">{p.categories?.name}</td>
                <td className="p-4">{p.price}</td>
                <td className="p-4">
                  <span className={p.in_stock ? "text-accent" : "text-red-700"}>
                    {p.in_stock ? p.stock_qty : "Out"}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(p.id, p.is_active)}
                    className={`px-2 py-1 text-[10px] uppercase tracking-widest ${
                      p.is_active ? "bg-accent/20 text-accent" : "bg-red-500/10 text-red-700"
                    }`}
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="p-4 text-right space-x-3">
                  <Link href={`/admin/products/${p.id}`} className="text-accent hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-700 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-xs text-muted">
        <div>
          Showing {products.length} of {count}
        </div>
        <div className="space-x-4">
          {page > 1 && (
            <Link href={`/admin/products?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="text-accent hover:underline">
              ← Prev
            </Link>
          )}
          {page * 20 < count && (
            <Link href={`/admin/products?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="text-accent hover:underline">
              Next →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
