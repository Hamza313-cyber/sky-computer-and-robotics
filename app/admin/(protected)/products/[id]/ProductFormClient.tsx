"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";

const fieldClass = "w-full rounded-none border border-[#00ff22]/20 bg-black/50 px-3 py-2 text-white placeholder-gray-600 outline-none transition-all focus:border-[#00ff22]";
const labelClass = "mb-1 block font-mono text-[10px] uppercase tracking-widest text-[#00ff22]/60";

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
        <div className="border border-[#00ff22]/20 bg-[#040a06] p-6 space-y-4">
          <h2 className="border-b border-[#00ff22]/20 pb-2 font-mono text-xs uppercase tracking-widest text-[#00ff22]">
            Basic Info
          </h2>
          <div>
            <label className={labelClass}>Product Name</label>
            <input
              {...register("name", {
                onBlur: (e: any) => {
                  if (!getValues("slug")) setValue("slug", slugify(e.target.value));
                },
              })}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>URL Slug</label>
            <input {...register("slug")} className={fieldClass} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>SKU</label>
              <input {...register("sku")} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Stock Qty</label>
              <input type="number" {...register("stock_qty")} className={fieldClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (INR)</label>
              <input type="number" {...register("price")} className={fieldClass} required />
            </div>
            <div>
              <label className={labelClass}>MRP (INR)</label>
              <input type="number" {...register("mrp")} className={fieldClass} />
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="border border-[#00ff22]/20 bg-[#040a06] p-6 space-y-4">
          <h2 className="border-b border-[#00ff22]/20 pb-2 font-mono text-xs uppercase tracking-widest text-[#00ff22]">
            Categorization
          </h2>
          <div>
            <label className={labelClass}>Category</label>
            <select {...register("category_id")} className={fieldClass} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <select {...register("brand_id")} className={fieldClass} required>
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="pt-4 flex gap-6">
            <label className="flex items-center gap-2 font-mono text-[10px] uppercase text-white">
              <input type="checkbox" {...register("is_active")} className="accent-[#00ff22]" /> Active
            </label>
            <label className="flex items-center gap-2 font-mono text-[10px] uppercase text-white">
              <input type="checkbox" {...register("is_featured")} className="accent-[#00ff22]" /> Featured
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="border border-[#00ff22]/20 bg-[#040a06] p-6 space-y-4 md:col-span-2">
          <h2 className="border-b border-[#00ff22]/20 pb-2 font-mono text-xs uppercase tracking-widest text-[#00ff22]">
            Descriptions
          </h2>
          <div>
            <label className={labelClass}>Short Description (Listing Page)</label>
            <textarea {...register("short_description")} rows={2} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Full Description</label>
            <textarea {...register("description")} rows={5} className={fieldClass} />
          </div>
        </div>

        {/* Specs & Images */}
        <div className="border border-[#00ff22]/20 bg-[#040a06] p-6 space-y-4">
          <h2 className="border-b border-[#00ff22]/20 pb-2 font-mono text-xs uppercase tracking-widest text-[#00ff22]">
            Specifications
          </h2>
          <div className="flex gap-2">
            <input value={specKey} onChange={e => setSpecKey(e.target.value)} placeholder="Key (e.g. RAM)" className={fieldClass} />
            <input value={specValue} onChange={e => setSpecValue(e.target.value)} placeholder="Value (e.g. 16GB)" className={fieldClass} />
            <button type="button" onClick={addSpec} className="bg-[#00ff22]/20 px-4 text-[#00ff22]">+</button>
          </div>
          <div className="space-y-1">
            {Object.entries(specs).map(([k, v]) => (
              <div key={k} className="flex justify-between border border-[#00ff22]/10 bg-black/50 px-3 py-1 font-mono text-[10px] text-white">
                <span><span className="text-[#00ff22]">{k}:</span> {v as string}</span>
                <button type="button" onClick={() => removeSpec(k)} className="text-red-400 hover:text-red-300">X</button>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#00ff22]/20 bg-[#040a06] p-6 space-y-4">
          <h2 className="border-b border-[#00ff22]/20 pb-2 font-mono text-xs uppercase tracking-widest text-[#00ff22]">
            Images
          </h2>
          <div>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="mb-4 text-xs text-gray-400" />
            {uploading && <div className="text-xs text-[#00ff22]">Compressing...</div>}
          </div>
          <div className="flex flex-wrap gap-2">
            {images.map((url: string, idx: number) => (
              <div key={idx} className="relative h-16 w-16 border border-[#00ff22]/30 bg-black">
                <img src={url} alt="" className="h-full w-full object-contain" />
                <button
                  type="button"
                  onClick={() => setValue("images", images.filter((_: any, i: number) => i !== idx))}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-[8px] text-white"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-[#00ff22]/20 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-[#00ff22]/20 px-6 py-2 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#00ff22] px-8 py-2 font-mono text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_15px_rgba(0,255,34,0.3)] hover:bg-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
