import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/public";
import CategoryView from "./CategoryView";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createClient();
  const { data: c } = await supabase.from('categories').select('*').eq('slug', slug).single();
  
  if (!c) return { title: "Not found" };
  return { title: `${c.name} - Sky Computers & Robotics`, description: c.description };
}

export default async function CategoryPage({
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
  
  const { data: c } = await supabase.from('categories').select('*').eq('slug', slug).single();
  if (!c) notFound();

  const { data: products, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('category_id', c.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  return <CategoryView c={c} products={products || []} page={page} total={count || 0} />;
}
