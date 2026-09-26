"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Search, Pencil, Trash2, Eye, EyeOff, ImageOff } from "lucide-react";

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

  const thumb = (p: any, size: string) =>
    p.images?.[0] ? (
      <div className={`jwin relative ${size} shrink-0 overflow-hidden rounded-2xl`}>
        <Image src={p.images[0]} alt="" fill sizes="64px" className="object-contain p-1" />
      </div>
    ) : (
      <div className={`jwin ${size} shrink-0 rounded-2xl flex items-center justify-center text-muted`}>
        <ImageOff size={18} />
      </div>
    );

  const statusBtn = (p: any) => (
    <button
      onClick={() => toggleActive(p.id, p.is_active)}
      aria-label={p.is_active ? "Active - click to hide" : "Hidden - click to show"}
      className={`${p.is_active ? "jpill light" : "jpill alt"} h-9 px-3 text-xs gap-1.5`}
    >
      {p.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
      {p.is_active ? "Active" : "Hidden"}
    </button>
  );

  const actions = (p: any) => (
    <div className="flex items-center gap-2">
      <Link href={`/admin/products/${p.id}`} aria-label={`Edit ${p.name}`} className="jelly btn w-9 h-9">
        <Pencil size={15} />
      </Link>
      <button onClick={() => deleteProduct(p.id)} aria-label={`Delete ${p.name}`} className="jelly alt btn w-9 h-9">
        <Trash2 size={15} />
      </button>
    </div>
  );

  const stock = (p: any) => (
    <span className={p.in_stock ? "text-ink" : "font-bold text-red-700"}>
      {p.in_stock ? p.stock_qty : "Out of stock"}
    </span>
  );

  const price = (v: any) =>
    v != null && v !== "" ? "\u20B9" + Number(v).toLocaleString("en-IN") : "\u2014";

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex max-w-lg gap-3">
        <label htmlFor="admin-product-search" className="sr-only">Search products</label>
        <input
          id="admin-product-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="well h-12 flex-1 rounded-[20px] px-4 text-sm text-ink placeholder:text-muted outline-none"
        />
        <button type="submit" aria-label="Search" className="jelly btn w-12 h-12 shrink-0">
          <Search size={18} />
        </button>
      </form>

      {/* Desktop table */}
      <div className="gtile hidden md:block overflow-x-auto rounded-[28px] p-2">
        <table className="w-full text-left text-sm text-body">
          <thead>
            <tr className="text-[11px] font-bold uppercase tracking-[1.5px] text-label">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {products.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-white/25">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {thumb(p, "h-14 w-14")}
                    <div>
                      <div className="font-bold text-ink">{p.name}</div>
                      <div className="text-xs text-muted">{p.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{p.categories?.name}</td>
                <td className="p-4 font-bold text-ink">{price(p.price)}</td>
                <td className="p-4">{stock(p)}</td>
                <td className="p-4">{statusBtn(p)}</td>
                <td className="p-4"><div className="flex justify-end">{actions(p)}</div></td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phone cards */}
      <div className="grid gap-3 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="gtile rounded-[24px] p-4">
            <div className="flex gap-3">
              {thumb(p, "h-16 w-16")}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-ink leading-snug">{p.name}</div>
                <div className="text-xs text-muted">{p.sku} · {p.categories?.name}</div>
                <div className="mt-1 text-sm"><span className="font-bold text-ink">{price(p.price)}</span> · Stock: {stock(p)}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              {statusBtn(p)}
              {actions(p)}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="gtile rounded-[24px] p-8 text-center text-muted">No products found.</div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-muted">
        <div>
          Showing {products.length} of {count}
        </div>
        <div className="flex gap-2">
          {page > 1 && (
            <Link href={`/admin/products?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="jpill alt h-10 px-4 text-sm">
              ← Prev
            </Link>
          )}
          {page * 20 < count && (
            <Link href={`/admin/products?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="jpill alt h-10 px-4 text-sm">
              Next →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
