import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/public";
import BrandView from "./BrandView";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
  const { data: brand } = await supabase.from('brands').select('*').eq('slug', slug).single();
  
  if (!brand) return { title: "Brand not found" };
  return {
    title: `${brand.name} - Sky Computers & Robotics`,
    description: brand.description,
  };
}

export default async function BrandPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) || 1 : 1;
  const limit = 24;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createClient();
  
  const { data: brand } = await supabase.from('brands').select('*').eq('slug', slug).single();
  if (!brand) notFound();

  // We need category slug to link to the product properly: /products/[category_slug]/[product_slug]
  const { data: products, count } = await supabase
    .from('products')
    .select('*, categories(name, slug)', { count: 'exact' })
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  return <BrandView brand={brand} products={products || []} page={page} total={count || 0} />;
}
