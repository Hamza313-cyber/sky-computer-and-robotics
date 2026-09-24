"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function Footer({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[#00ff22]/30 bg-[#001104] text-gray-400 font-mono text-xs py-12 relative z-40 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* INFO */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-white font-black text-2xl tracking-widest">
            SKY<span className="text-[#00ff22]">.</span>
          </Link>
          <p className="leading-relaxed text-[12px] max-w-sm">
            Your trusted retail tech store. We provide top-tier laptops, mobiles, CCTV security systems, and high-quality gadgets.
          </p>

          <div className="mt-1 flex flex-col gap-1.5 text-[12px]">
            <a href="tel:+917001904082" className="hover:text-[#00ff22] transition-colors">
              +91 70019 04082
            </a>
            <a
              href="https://wa.me/917001904082"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00ff22] transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="mailto:skycomputerrobotics@gmail.com"
              className="break-all hover:text-[#00ff22] transition-colors"
            >
              skycomputerrobotics@gmail.com
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold tracking-widest text-sm mb-2 uppercase">Quick Links</h4>
          <Link href="/products" className="hover:text-[#00ff22] transition-colors">ALL PRODUCTS</Link>
          <Link href="/brands" className="hover:text-[#00ff22] transition-colors">OUR BRANDS</Link>
          <Link href="/about" className="hover:text-[#00ff22] transition-colors">ABOUT US</Link>
          <Link href="/contact" className="hover:text-[#00ff22] transition-colors">CONTACT / ENQUIRY</Link>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold tracking-widest text-sm mb-2 uppercase">Categories</h4>
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/products/${cat.slug}`} 
              className="hover:text-[#00ff22] transition-colors uppercase"
            >
              {cat.name}
            </Link>
          ))}
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-gray-800 flex flex-wrap gap-2 justify-between items-center text-[11px]">
        <p>© {new Date().getFullYear()} Sky Computers & Robotics. All rights reserved.</p>
        <p className="text-[#00ff22]/50 tracking-widest">SYSTEM // ONLINE</p>
      </div>
    </footer>
  );
}
