"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";

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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Brands", href: "/brands" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 font-sans ${
        isScrolled ? "headerglass py-3" : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* LEFT: Toggle & Logo */}
        <div className="flex items-center gap-4 z-50 relative">
          <ThemeToggle />
          <Link href="/" className="text-ink font-display text-2xl tracking-widest relative z-50 mt-1">
            SKY<span className="text-accent">.</span>
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
            return (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.name === "Products" && setProductsOpen(true)}
                onMouseLeave={() => link.name === "Products" && setProductsOpen(false)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-[22px] py-[12px] text-[15px] ${isActive ? "jpill active" : "jpill alt"}`}
                >
                  {link.name}
                  {link.name === "Products" && <ChevronDown size={14} className="opacity-70" />}
                </Link>

                {/* PRODUCTS DROPDOWN */}
                {link.name === "Products" && (
                  <AnimatePresence>
                    {productsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 gtile p-3 rounded-[24px] flex flex-col gap-1 z-50"
                      >
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products/${cat.slug}`}
                            className="px-4 py-2 text-sm text-ink hover:bg-white/30 rounded-xl transition-colors tracking-wide"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
          <form action="/search" method="GET" className="relative flex items-center ml-2">
            <input
              type="text"
              name="q"
              placeholder="Search products..."
              className="well px-4 py-[12px] text-[15px] text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent w-48"
            />
          </form>
        </nav>

        {/* MOBILE MENU BTN */}
        <button
          className="md:hidden jelly btn w-12 h-12 relative z-50"
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: "var(--bg-grad)" }}
          >
            <form action="/search" method="GET" className="w-64 mb-4" onSubmit={() => setMobileMenuOpen(false)}>
              <input
                type="text"
                name="q"
                placeholder="Search products..."
                className="well w-full px-6 py-4 text-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent text-center"
              />
            </form>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[18px] px-8 py-3 ${isActive ? "jpill active" : "jpill alt"}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
