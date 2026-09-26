"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Papa from "papaparse";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const slugify = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* Excel exports Indian numbers as "1,20,000" and sometimes "Rs 1200" or "₹1200".
   parseFloat("1,20,000") is 1 — that would put a 1.2 lakh laptop on sale for one rupee. */
function parseNum(raw: unknown): { ok: boolean; value: number | null; blank: boolean } {
  if (raw === null || raw === undefined) return { ok: true, value: null, blank: true };
  const t = String(raw).trim();
  if (t === "") return { ok: true, value: null, blank: true };
  const cleaned = t.replace(/[,\s₹]/g, "").replace(/^rs\.?/i, "");
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return { ok: false, value: null, blank: false };
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return { ok: false, value: null, blank: false };
  return { ok: true, value: n, blank: false };
}

type RowError = { line: number; name: string; reason: string };

/* CSV data index i is spreadsheet line i + 2 (line 1 is the header). */
const lineOf = (i: number) => i + 2;

/* ------------------------------------------------------------------ */

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<{
    inserted: number;
    failed: number;
    rowErrors: RowError[];
  } | null>(null);

  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [brandMap, setBrandMap] = useState<Record<string, string>>({});

  const supabase = createClient();

  useEffect(() => {
    async function loadLookups() {
      const [{ data: cats }, { data: brs }] = await Promise.all([
        supabase.from("categories").select("id, slug"),
        supabase.from("brands").select("id, slug"),
      ]);
      if (cats) {
        const cmap: Record<string, string> = {};
        cats.forEach((c) => (cmap[c.slug] = c.id));
        setCategoryMap(cmap);
      }
      if (brs) {
        const bmap: Record<string, string> = {};
        brs.forEach((b) => (bmap[b.slug] = b.id));
        setBrandMap(bmap);
      }
    }
    loadLookups();
  }, [supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
    /* a new file invalidates the previous preview — otherwise Start Import
       would run on a file that was never validated */
    setPreview([]);
    setErrors([]);
    setResult(null);
    setProgress({ current: 0, total: 0 });
  };

  /* Build one product row, or return why it cannot be built. */
  function buildRow(r: any, i: number): { row?: any; error?: string } {
    const name = String(r.name ?? "").trim();
    if (!name) return { error: "Missing name." };

    const slug = slugify(r.slug || name);
    if (!slug) return { error: "Name has no letters or digits, so no web address can be made from it. Add a slug column." };

    if (r.category_slug && !categoryMap[String(r.category_slug).trim()]) {
      return { error: `Category '${r.category_slug}' does not exist.` };
    }
    if (r.brand_slug && !brandMap[String(r.brand_slug).trim()]) {
      return { error: `Brand '${r.brand_slug}' does not exist.` };
    }

    const price = parseNum(r.price);
    if (!price.ok) return { error: `Price '${r.price}' is not a number.` };
    const mrp = parseNum(r.mrp);
    if (!mrp.ok) return { error: `MRP '${r.mrp}' is not a number.` };
    const stock = parseNum(r.stock_qty);
    if (!stock.ok) return { error: `Stock '${r.stock_qty}' is not a number.` };
    const warranty = parseNum(r.warranty_months);
    if (!warranty.ok) return { error: `Warranty '${r.warranty_months}' is not a number.` };

    let specs: any = {};
    if (r.specs_json && String(r.specs_json).trim() !== "") {
      try {
        specs = JSON.parse(String(r.specs_json));
      } catch {
        return { error: "specs_json is not valid JSON. Example: {\"RAM\":\"16GB\"}" };
      }
      if (specs === null || typeof specs !== "object" || Array.isArray(specs)) {
        return { error: "specs_json must be an object, e.g. {\"RAM\":\"16GB\"}" };
      }
    }

    const images = r.image_urls
      ? String(r.image_urls)
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

    const supabaseHost = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/^https?:\/\//, "");
    const foreign = images.find((u: string) => supabaseHost && !u.includes(supabaseHost));
    if (foreign) {
      return {
        error: `Image '${foreign}' is hosted elsewhere. Upload images through the product form instead.`,
      };
    }

    /* stock_qty blank must not silently mean out of stock */
    const stockQty = stock.blank ? 0 : Math.max(0, Math.trunc(stock.value as number));
    const inStock = stock.blank ? true : stockQty > 0;

    return {
      row: {
        sku: r.sku && String(r.sku).trim() ? String(r.sku).trim() : null,
        slug,
        name,
        category_id: r.category_slug ? categoryMap[String(r.category_slug).trim()] : null,
        brand_id: r.brand_slug ? brandMap[String(r.brand_slug).trim()] : null,
        short_description: r.short_description || null,
        description: r.description || null,
        price: price.value,
        mrp: mrp.value,
        stock_qty: stockQty,
        warranty_months: warranty.value === null ? null : Math.trunc(warranty.value),
        specs,
        images,
        is_active: true,
        in_stock: inStock,
      },
    };
  }

  const handleParse = () => {
    if (!file) return;
    setErrors([]);
    setResult(null);
    setPreview([]);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as any[];
        const errs: string[] = [];

        /* file-level parse problems (unclosed quote, wrong column count) */
        (results.errors || []).slice(0, 5).forEach((e) => {
          errs.push(`Line ${(e.row ?? 0) + 2}: ${e.message}`);
        });

        if (parsed.length === 0) {
          errs.push("The file has no data rows.");
        }

        const seenSlug = new Map<string, number>();
        const seenSku = new Map<string, number>();
        const built: any[] = [];

        parsed.forEach((row, i) => {
          const { row: built1, error } = buildRow(row, i);
          if (error) {
            errs.push(`Line ${lineOf(i)}: ${error}`);
            return;
          }
          const b = built1 as any;
          if (seenSlug.has(b.slug)) {
            errs.push(
              `Line ${lineOf(i)}: duplicate web address '${b.slug}' — also on line ${seenSlug.get(b.slug)}.`
            );
          } else {
            seenSlug.set(b.slug, lineOf(i));
          }
          if (b.sku) {
            if (seenSku.has(b.sku)) {
              errs.push(
                `Line ${lineOf(i)}: duplicate SKU '${b.sku}' — also on line ${seenSku.get(b.sku)}.`
              );
            } else {
              seenSku.set(b.sku, lineOf(i));
            }
          }
          built.push(b);
        });

        setErrors(errs);
        setPreview(built.slice(0, 5));
      },
      error: (err) => {
        setErrors([`Could not read the file: ${err.message}`]);
      },
    });
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[];
          const toInsert: any[] = [];
          const rowErrors: RowError[] = [];

          rows.forEach((r, i) => {
            const { row, error } = buildRow(r, i);
            if (error) {
              rowErrors.push({
                line: lineOf(i),
                name: String(r?.name ?? "").slice(0, 60),
                reason: error,
              });
            } else {
              toInsert.push(row);
            }
          });

          setProgress({ current: 0, total: toInsert.length });
          let inserted = 0;

          for (let i = 0; i < toInsert.length; i += 500) {
            const batch = toInsert.slice(i, i + 500);

            /* upsert so re-running the same file updates instead of failing on
               every row with a duplicate slug */
            const { data, error } = await supabase
              .from("products")
              .upsert(batch, { onConflict: "slug" })
              .select("id");

            if (!error) {
              inserted += data ? data.length : batch.length;
            } else {
              /* one bad row aborts the whole statement — retry the batch one row
                 at a time so the shopkeeper learns which row and why */
              for (let j = 0; j < batch.length; j++) {
                const one = batch[j];
                const { error: e1 } = await supabase
                  .from("products")
                  .upsert([one], { onConflict: "slug" })
                  .select("id");
                if (e1) {
                  rowErrors.push({
                    line: i + j + 2,
                    name: String(one.name).slice(0, 60),
                    reason:
                      e1.code === "23505"
                        ? "A product with this SKU already exists."
                        : e1.message,
                  });
                } else {
                  inserted++;
                }
              }
            }

            setProgress({
              current: Math.min(i + 500, toInsert.length),
              total: toInsert.length,
            });
          }

          setResult({ inserted, failed: rowErrors.length, rowErrors });
        } catch (err: any) {
          setResult({
            inserted: 0,
            failed: 0,
            rowErrors: [
              { line: 0, name: "", reason: `Import stopped: ${err?.message || String(err)}` },
            ],
          });
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setResult({
          inserted: 0,
          failed: 0,
          rowErrors: [{ line: 0, name: "", reason: `Could not read the file: ${err.message}` }],
        });
        setLoading(false);
      },
    });
  };

  const downloadSample = () => {
    const sample =
      `sku,name,slug,category_slug,brand_slug,short_description,description,price,mrp,stock_qty,warranty_months,specs_json,image_urls\n` +
      `TEST-01,Test Laptop,test-laptop,laptops,apple,A great test laptop,Longer description here,99999,105000,10,12,"{""RAM"":""16GB""}",`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_products.csv";
    a.click();
  };

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[3px] text-label">Sky Admin</p>
      <h1 className="mb-6 font-display text-3xl md:text-4xl text-ink">
        Import Products (CSV)
      </h1>

      <div className="gtile mb-8 rounded-[28px] p-6">
        <p className="mb-2 text-body">
          Upload a CSV file to bulk import products. category_slug and brand_slug must match
          existing slugs.
        </p>
        <p className="mb-5 text-sm text-muted">
          Re-uploading the same file updates those products instead of creating duplicates.
          Product photos are added through the product form, not the CSV.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input type="file" accept=".csv" onChange={handleFileChange} aria-label="Choose CSV file" className="text-sm text-body file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" />
          <button
            onClick={handleParse}
            disabled={!file}
            className="jpill h-11 px-5 text-sm disabled:opacity-50"
          >
            Preview &amp; Validate
          </button>
          <button
            onClick={downloadSample}
            className="jpill alt h-11 px-5 text-sm"
          >
            Download Sample CSV
          </button>
        </div>

        {errors.length > 0 && (
          <div role="alert" className="mb-6 rounded-[20px] border border-red-500/40 bg-red-500/10 p-4">
            <h3 className="mb-2 text-sm font-bold text-red-700">
              {errors.length} problem{errors.length === 1 ? "" : "s"} found — nothing has been
              imported
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-red-700/90">
              {errors.slice(0, 15).map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
              {errors.length > 15 && <li>...and {errors.length - 15} more.</li>}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Line numbers match the row numbers in Excel.
            </p>
          </div>
        )}

        {preview.length > 0 && errors.length === 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-bold text-ink">
              Preview — first {preview.length} row{preview.length === 1 ? "" : "s"}, exactly as they
              will be saved
            </h3>
            <div className="well max-h-96 overflow-auto rounded-[20px] p-4 text-xs text-body">
              <pre>{JSON.stringify(preview, null, 2)}</pre>
            </div>
          </div>
        )}

        {preview.length > 0 && errors.length === 0 && !result && (
          <div>
            <button
              onClick={handleImport}
              disabled={loading}
              className="jpill h-12 px-6 text-sm disabled:opacity-50"
            >
              {loading ? `Importing... (${progress.current}/${progress.total})` : "Start Import"}
            </button>
          </div>
        )}

        {result && (
          <div role="status" className="well mt-6 rounded-[24px] p-6">
            <h3 className="mb-2 font-display text-xl text-ink">Import complete</h3>
            <p className="font-bold text-ink">Saved: {result.inserted}</p>
            <p className={result.failed > 0 ? "text-red-700" : "text-muted"}>
              Skipped: {result.failed}
            </p>

            {result.rowErrors.length > 0 && (
              <div className="mt-4 border-t border-black/20 pt-4">
                <h4 className="mb-2 text-sm font-bold text-red-700">
                  Rows that were skipped
                </h4>
                <ul className="max-h-64 list-disc space-y-1 overflow-y-auto pl-5 text-sm text-red-700/90">
                  {result.rowErrors.slice(0, 50).map((e, idx) => (
                    <li key={idx}>
                      {e.line > 0 ? `Line ${e.line}` : "File"}
                      {e.name ? ` (${e.name})` : ""}: {e.reason}
                    </li>
                  ))}
                  {result.rowErrors.length > 50 && (
                    <li>...and {result.rowErrors.length - 50} more.</li>
                  )}
                </ul>
                <p className="mt-3 text-xs text-muted">
                  Fix these rows in Excel and upload the file again — already-saved products will
                  simply be updated.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
