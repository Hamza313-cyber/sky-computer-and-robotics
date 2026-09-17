"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function Navbar({ categories }: { categories: Category[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "PRODUCTS", href: "/products" },
    { name: "BRANDS", href: "/brands" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 font-mono ${
        isScrolled ? "bg-[#010603]/90 backdrop-blur-md border-b border-[#00ff22]/20 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="text-white font-black text-2xl tracking-widest relative z-50">
          SKY
          <span className="text-[#00ff22]">.</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.name === "PRODUCTS" && setProductsOpen(true)}
              onMouseLeave={() => link.name === "PRODUCTS" && setProductsOpen(false)}
            >
              <Link
                href={link.href}
                className={`text-sm tracking-widest flex items-center gap-1 transition-colors ${
                  pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/")
                    ? "text-[#00ff22] drop-shadow-[0_0_8px_rgba(0,255,34,0.5)]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
                {link.name === "PRODUCTS" && <ChevronDown size={14} className="opacity-50" />}
              </Link>

              {/* PRODUCTS DROPDOWN */}
              {link.name === "PRODUCTS" && (
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-4 w-56 bg-[#001104]/95 backdrop-blur-md border border-[#00ff22]/30 p-2 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col gap-1"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products/${cat.slug}`}
                          className="px-4 py-2 text-xs text-gray-300 hover:text-[#00ff22] hover:bg-[#00ff22]/10 rounded transition-colors tracking-wider uppercase"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden text-white relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#010603]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-2xl font-bold tracking-widest ${
                  pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/")
                    ? "text-[#00ff22]"
                    : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
