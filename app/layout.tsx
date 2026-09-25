import type { Metadata } from "next";
import { Archivo_Black, DM_Sans } from "next/font/google";
import "./globals.css";
import "./jelly.css";
import GlassBackdrop from "../components/GlassBackdrop";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { createClient } from "@/lib/supabase/public";
import PageViewTracker from "./components/PageViewTracker";

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sky Computers & Robotics",
  description:
  "Your trusted retail tech store. We provide top-tier laptops, mobiles, CCTV security systems, and high-quality gadgets.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('sky-theme') === 'neu') {
                  document.documentElement.setAttribute('data-theme', 'neu');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink font-sans overflow-x-hidden">
        <GlassBackdrop />
        <PageViewTracker />
        <Navbar categories={categories || []} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories || []} />
      </body>
    </html>
  );
}
