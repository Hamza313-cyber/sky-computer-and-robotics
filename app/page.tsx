import HeroClient from "./HeroClient";
import ProductShowcase from "../ProductShowcase";
import { createClient } from "@/lib/supabase/public";

export const revalidate = 300;

export default async function Page() {
  const supabase = createClient();
  const { data: featuredBrands } = await supabase.from('brands').select('*').eq('is_featured', true).order('sort_order');
  const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');

  return (
    <>
      <HeroClient />
      <ProductShowcase brands={featuredBrands || []} categories={categories || []} />
    </>
  );
}
