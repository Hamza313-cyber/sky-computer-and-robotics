"use client";
import { Plus, X } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";

const fieldClass = "well w-full rounded-[18px] px-4 py-3 text-sm text-ink placeholder:text-muted outline-none";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-[1.5px] text-label";

const slugify = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const num = (v: any, fallback: number | null = null) =>
  v === "" || v === null || v === undefined || isNaN(Number(v)) ? fallback : Number(v);

/* Strip DB-generated / read-only columns and coerce types before writing */
function toPayload(d: any) {
  const rest: any = { ...d };
  delete rest.id;
  delete rest.created_at;
  delete rest.updated_at;
  delete rest.search_text;
  delete rest.categories;
  delete rest.brands;
  return {
    ...rest,
    slug: slugify(rest.slug || rest.name),
    sku: rest.sku && String(rest.sku).trim() ? String(rest.sku).trim() : null,
    price: num(rest.price),
    mrp: num(rest.mrp),
    stock_qty: num(rest.stock_qty, 0),
    in_stock: num(rest.stock_qty, 0)! > 0,
    warranty_months: num(rest.warranty_months),
    images: Array.isArray(rest.images) ? rest.images : [],
    specs: rest.specs && typeof rest.specs === "object" ? rest.specs : {},
  };
}

const compressImage = (file: File, maxWidth = 1600, quality = 0.82): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function ProductFormClient({
  initialData,
  categories,
  brands,
}: {
  initialData: any;
  categories: any[];
  brands: any[];
}) {
  const isNew = !initialData;
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { register, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: initialData || {
      name: "",
      slug: "",
      sku: "",
      category_id: "",
      brand_id: "",
      short_description: "",
      description: "",
      price: 0,
      mrp: 0,
      stock_qty: 0,
      in_stock: true,
      warranty_months: 12,
      is_featured: false,
      is_active: true,
      images: [],
      specs: {},
    }
  });

  const images = watch("images") || [];
  const specs = watch("specs") || {};
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    const newImages = [...images];
    for (const file of Array.from(e.target.files)) {
      try {
        const compressedFile = await compressImage(file);
        const fileName = `${Math.random()}.webp`;
        const filePath = `products/${fileName}`;
        
        // Upload to supabase storage 'product-images' bucket
        const { error, data } = await supabase.storage.from('product-images').upload(filePath, compressedFile, {
          contentType: 'image/webp'
        });
        
        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
          newImages.push(publicUrlData.publicUrl);
        } else {
          alert("Upload failed: " + (error?.message || "Unknown error"));
        }
      } catch (err) {
        console.error("Compression/Upload error:", err);
        alert("Failed to process image.");
      }
    }
    
    setValue("images", newImages);
    setUploading(false);
  };

  const addSpec = () => {
    if (specKey && specValue) {
      setValue("specs", { ...specs, [specKey]: specValue });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpec = (k: string) => {
    const newSpecs = { ...specs };
    delete newSpecs[k];
    setValue("specs", newSpecs);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (isNew) {
      // Create new
      const { error } = await supabase.from("products").insert([toPayload(data)]);
      if (error) alert(error.message);
      else router.push("/admin/products");
    } else {
      // Update
      const { error } = await supabase.from("products").update(toPayload(data)).eq("id", initialData.id);
      if (error) alert(error.message);
      else {
        router.push("/admin/products");
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <div className="gtile rounded-[28px] p-6 space-y-4">
          <h2 className="font-display text-xl text-ink">
            Basic Info
          </h2>
          <div>
            <label htmlFor="pf-name" className={labelClass}>Product Name</label>
            <input
              id="pf-name" {...register("name", {
                onBlur: (e: any) => {
                  if (!getValues("slug")) setValue("slug", slugify(e.target.value));
                },
              })}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <label htmlFor="pf-slug" className={labelClass}>URL Slug</label>
            <input id="pf-slug" {...register("slug")} className={fieldClass} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pf-sku" className={labelClass}>SKU</label>
              <input id="pf-sku" {...register("sku")} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="pf-stock_qty" className={labelClass}>Stock Qty</label>
              <input type="number" id="pf-stock_qty" {...register("stock_qty")} className={fieldClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pf-price" className={labelClass}>Price (INR)</label>
              <input type="number" id="pf-price" {...register("price")} className={fieldClass} required />
            </div>
            <div>
              <label htmlFor="pf-mrp" className={labelClass}>MRP (INR)</label>
              <input type="number" id="pf-mrp" {...register("mrp")} className={fieldClass} />
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="gtile rounded-[28px] p-6 space-y-4">
          <h2 className="font-display text-xl text-ink">
            Categorization
          </h2>
          <div>
            <label htmlFor="pf-category_id" className={labelClass}>Category</label>
            <select id="pf-category_id" {...register("category_id")} className={fieldClass} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pf-brand_id" className={labelClass}>Brand</label>
            <select id="pf-brand_id" {...register("brand_id")} className={fieldClass} required>
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="pt-4 flex gap-6">
            <label className="jpill light h-11 px-4 text-sm gap-2 cursor-pointer">
              <input type="checkbox" {...register("is_active")} className="h-4 w-4 accent-[var(--accent)]" /> Active
            </label>
            <label className="jpill light h-11 px-4 text-sm gap-2 cursor-pointer">
              <input type="checkbox" {...register("is_featured")} className="h-4 w-4 accent-[var(--accent)]" /> Featured
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="gtile rounded-[28px] p-6 space-y-4 md:col-span-2">
          <h2 className="font-display text-xl text-ink">
            Descriptions
          </h2>
          <div>
            <label htmlFor="pf-short_description" className={labelClass}>Short Description (Listing Page)</label>
            <textarea id="pf-short_description" {...register("short_description")} rows={2} className={fieldClass} />
          </div>
          <div>
            <label htmlFor="pf-description" className={labelClass}>Full Description</label>
            <textarea id="pf-description" {...register("description")} rows={5} className={fieldClass} />
          </div>
        </div>

        {/* Specs & Images */}
        <div className="gtile rounded-[28px] p-6 space-y-4">
          <h2 className="font-display text-xl text-ink">
            Specifications
          </h2>
          <div className="flex gap-2">
            <input aria-label="Spec name" value={specKey} onChange={e => setSpecKey(e.target.value)} placeholder="Key (e.g. RAM)" className={fieldClass} />
            <input aria-label="Spec value" value={specValue} onChange={e => setSpecValue(e.target.value)} placeholder="Value (e.g. 16GB)" className={fieldClass} />
            <button type="button" onClick={addSpec} aria-label="Add spec" className="jelly btn w-12 h-12 shrink-0"><Plus size={18} /></button>
          </div>
          <div className="space-y-2">
            {Object.entries(specs).map(([k, v]) => (
              <div key={k} className="well flex items-center justify-between rounded-[16px] px-4 py-2 text-sm text-ink">
                <span><span className="font-bold">{k}:</span> {v as string}</span>
                <button type="button" onClick={() => removeSpec(k)} aria-label={`Remove ${k}`} className="jelly alt btn w-8 h-8"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="gtile rounded-[28px] p-6 space-y-4">
          <h2 className="font-display text-xl text-ink">
            Images
          </h2>
          <div>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} aria-label="Upload product photos" className="mb-4 block w-full text-sm text-body file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" />
            {uploading && <div className="text-sm font-bold text-ink">Uploading photos...</div>}
          </div>
          <div className="flex flex-wrap gap-3">
            {images.map((url: string, idx: number) => (
              <div key={idx} className="jwin relative h-20 w-20 rounded-2xl">
                <img src={url} alt="" className="h-full w-full rounded-2xl object-contain p-1" />
                <button
                  type="button"
                  onClick={() => setValue("images", images.filter((_: any, i: number) => i !== idx))}
                  aria-label="Remove photo"
                  className="jelly alt btn absolute -right-2 -top-2 w-7 h-7"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="jpill alt h-11 px-6 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="jpill h-11 px-8 text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
