import { createClient } from "@/lib/supabase/server";
import ProductFormClient from "./ProductFormClient";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  
  const supabase = await createClient();
  let product = null;

  if (!isNew) {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    if (!data) notFound();
    product = data;
  }

  // Fetch categories and brands for dropdowns
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");
  const { data: brands } = await supabase.from("brands").select("id, name").order("name");

  return (
    <div>
      <h1 className="mb-6 font-mono text-xl uppercase tracking-widest text-[#00ff22]">
        {isNew ? "New Product" : `Edit Product: ${product?.name}`}
      </h1>
      
      <ProductFormClient 
        initialData={product} 
        categories={categories || []} 
        brands={brands || []} 
      />
    </div>
  );
}
