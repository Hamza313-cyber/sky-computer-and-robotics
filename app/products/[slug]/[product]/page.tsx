import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/public";
import ProductClient from "./ProductClient";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}) {
  const { product } = await params;
  const supabase = createClient();
  const { data: p } = await supabase.from('products').select('name, short_description').eq('slug', product).single();
  
  if (!p) return { title: "Product Not Found" };
  return { title: `${p.name} - Sky Computers & Robotics`, description: p.short_description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}) {
  const { product } = await params;
  const supabase = createClient();
  
  const { data: p } = await supabase
    .from('products')
    .select('*, categories(name, slug), brands(name, slug)')
    .eq('slug', product)
    .single();
    
  const { slug: categorySlug } = await params;
  if (!p || !p.is_active || p.categories?.slug !== categorySlug) notFound();

  return <ProductClient product={p} />;
}
