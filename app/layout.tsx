import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { createClient } from "@/lib/supabase/public";
import PageViewTracker from "./components/PageViewTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#010603] text-white overflow-x-hidden">
        <PageViewTracker />
        <Navbar categories={categories || []} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories || []} />
      </body>
    </html>
  );
}
