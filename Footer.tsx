"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MessageCircle } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const quickLinks = [
  { name: "All Products", href: "/products" },
  { name: "Our Brands", href: "/brands" },
  { name: "About Us", href: "/about" },
  { name: "Contact / Enquiry", href: "/contact" },
];

export default function Footer({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative mt-24 px-4 md:px-8 pb-8">
      <div className="gtile max-w-7xl mx-auto rounded-[36px] px-6 py-10 md:px-12 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          {/* INFO */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="font-display text-ink text-3xl tracking-widest w-fit">
              SKY<span className="text-accent">.</span>
            </Link>
            <p className="text-body leading-relaxed max-w-sm">
              Your trusted retail tech store. We provide top-tier laptops, mobiles, CCTV security systems, and high-quality gadgets.
            </p>

            <div className="flex flex-col gap-3">
              <a href="tel:+917001904082" className="flex items-center gap-3 text-ink font-bold w-fit group">
                <span className="jelly w-11 h-11 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </span>
                <span className="group-hover:text-accent transition-colors">+91 70019 04082</span>
              </a>
              <a href="mailto:skycomputerrobotics@gmail.com" className="flex items-center gap-3 text-ink font-bold w-fit group">
                <span className="jelly alt w-11 h-11 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </span>
                <span className="break-all group-hover:text-accent transition-colors">skycomputerrobotics@gmail.com</span>
              </a>
            </div>

            <a
              href="https://wa.me/917001904082"
              target="_blank"
              rel="noopener noreferrer"
              className="jpill h-12 px-6 w-fit mt-1"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>

          {/* QUICK LINKS */}
          <nav aria-label="Quick links" className="flex flex-col gap-3">
            <h4 className="text-label font-bold tracking-[0.3em] text-xs uppercase mb-2">Quick Links</h4>
            {quickLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-ink font-medium hover:text-accent transition-colors w-fit">
                {l.name}
              </Link>
            ))}
          </nav>

          {/* CATEGORIES */}
          <nav aria-label="Categories" className="flex flex-col gap-3">
            <h4 className="text-label font-bold tracking-[0.3em] text-xs uppercase mb-2">Categories</h4>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="text-ink font-medium hover:text-accent transition-colors w-fit"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--t-edge)] flex flex-wrap gap-3 justify-between items-center text-sm text-muted">
          <p>© {new Date().getFullYear()} Sky Computers &amp; Robotics. All rights reserved.</p>
          <p>Genuine products · Warranty · In-house service</p>
        </div>
      </div>
    </footer>
  );
}
