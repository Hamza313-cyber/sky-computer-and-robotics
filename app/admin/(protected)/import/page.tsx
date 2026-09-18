"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Papa from "papaparse";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<{ inserted: number; failed: number } | null>(null);
  
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [brandMap, setBrandMap] = useState<Record<string, string>>({});
  
  const supabase = createClient();

  useEffect(() => {
    async function loadLookups() {
      const [{ data: cats }, { data: brs }] = await Promise.all([
        supabase.from("categories").select("id, slug"),
        supabase.from("brands").select("id, slug")
      ]);
      if (cats) {
        const cmap: Record<string, string> = {};
        cats.forEach(c => cmap[c.slug] = c.id);
        setCategoryMap(cmap);
      }
      if (brs) {
        const bmap: Record<string, string> = {};
        brs.forEach(b => bmap[b.slug] = b.id);
        setBrandMap(bmap);
      }
    }
    loadLookups();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleParse = () => {
    if (!file) return;
    setErrors([]);
    setResult(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as any[];
        const errs: string[] = [];
        
        parsed.forEach((row, i) => {
          if (!row.name || !row.slug) {
            errs.push(`Row ${i + 1}: Missing name or slug.`);
          }
          if (row.category_slug && !categoryMap[row.category_slug]) {
            errs.push(`Row ${i + 1}: Category slug '${row.category_slug}' not found.`);
          }
          if (row.brand_slug && !brandMap[row.brand_slug]) {
            errs.push(`Row ${i + 1}: Brand slug '${row.brand_slug}' not found.`);
          }
        });
        
        setErrors(errs);
        setPreview(parsed.slice(0, 5)); // show first 5
      }
    });
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        const toInsert = rows.map((r: any) => {
          return {
            sku: r.sku || null,
            slug: r.slug,
            name: r.name,
            category_id: categoryMap[r.category_slug] || null,
            brand_id: brandMap[r.brand_slug] || null,
            short_description: r.short_description || null,
            description: r.description || null,
            price: parseFloat(r.price) || null,
            mrp: parseFloat(r.mrp) || null,
            stock_qty: parseInt(r.stock_qty) || 0,
            warranty_months: parseInt(r.warranty_months) || null,
            specs: r.specs_json ? JSON.parse(r.specs_json) : {},
            images: r.image_urls ? r.image_urls.split(",").map((s:string) => s.trim()) : [],
            is_active: true,
            in_stock: parseInt(r.stock_qty) > 0,
          };
        });

        setProgress({ current: 0, total: toInsert.length });
        let inserted = 0;
        let failed = 0;
        
        // Batch insert by 500
        for (let i = 0; i < toInsert.length; i += 500) {
          const batch = toInsert.slice(i, i + 500);
          const { error } = await supabase.from("products").insert(batch);
          if (error) {
            console.error(error);
            failed += batch.length;
          } else {
            inserted += batch.length;
          }
          setProgress({ current: Math.min(i + 500, toInsert.length), total: toInsert.length });
        }
        
        setResult({ inserted, failed });
        setLoading(false);
      }
    });
  };

  const downloadSample = () => {
    const sample = `sku,name,slug,category_slug,brand_slug,short_description,description,price,mrp,stock_qty,warranty_months,specs_json,image_urls\nTEST-01,Test Laptop,test-laptop,laptops,apple,A great test laptop,Longer description here,99999,105000,10,12,"{""RAM"":""16GB""}","https://example.com/img1.jpg,https://example.com/img2.jpg"`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_products.csv";
    a.click();
  };

  return (
    <div>
      <h1 className="mb-6 font-mono text-xl uppercase tracking-widest text-white">
        Bulk Import Products
      </h1>
      
      <div className="border border-[#00ff22]/20 bg-[#040a06] p-6 mb-8">
        <p className="mb-4 text-gray-400">
          Upload a CSV file to bulk import products. Please map category_slug and brand_slug to existing slugs.
        </p>
        
        <div className="flex items-center gap-4 mb-6">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="text-white"
          />
          <button 
            onClick={handleParse}
            disabled={!file}
            className="bg-[#00ff22]/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#00ff22] disabled:opacity-50"
          >
            Preview & Validate
          </button>
          <button 
            onClick={downloadSample}
            className="border border-[#00ff22]/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gray-400"
          >
            Download Sample CSV
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mb-6 border border-red-500/50 bg-red-950/20 p-4">
            <h3 className="mb-2 font-mono text-xs uppercase text-red-400">Validation Errors</h3>
            <ul className="list-disc pl-5 text-xs text-red-400/80">
              {errors.slice(0, 10).map((e, idx) => <li key={idx}>{e}</li>)}
              {errors.length > 10 && <li>...and {errors.length - 10} more.</li>}
            </ul>
          </div>
        )}

        {preview.length > 0 && errors.length === 0 && (
          <div className="mb-6">
            <h3 className="mb-2 font-mono text-xs uppercase text-[#00ff22]">Preview (First 5 rows)</h3>
            <div className="overflow-x-auto text-xs text-gray-400 bg-black/50 border border-[#00ff22]/20 p-4">
              <pre>{JSON.stringify(preview, null, 2)}</pre>
            </div>
          </div>
        )}

        {preview.length > 0 && errors.length === 0 && !result && (
          <div>
            <button 
              onClick={handleImport}
              disabled={loading}
              className="bg-[#00ff22] px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_15px_rgba(0,255,34,0.3)] disabled:opacity-50"
            >
              {loading ? `Importing... (${progress.current}/${progress.total})` : "Start Import"}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-6 border border-[#00ff22] bg-[#00ff22]/10 p-6 text-center">
            <h3 className="mb-2 font-mono text-lg text-[#00ff22]">Import Complete</h3>
            <p className="text-gray-300">Successfully inserted: {result.inserted}</p>
            <p className="text-red-400">Failed to insert: {result.failed}</p>
          </div>
        )}
      </div>
    </div>
  );
}
