import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Collections", href: "/collections" },
  { label: "Sacred Crafts", href: "/collections?category=sacred-crafts" },
  { label: "Textiles", href: "/collections?category=textiles" },
  { label: "Jewelry", href: "/collections?category=jewelry" },
  { label: "Our Story", href: "/story" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      {/* Top bar */}
      <div className="text-center py-2 text-xs tracking-luxury font-sans text-muted-foreground border-b border-border/30">
        Complimentary shipping on all orders above ₹5,000
      </div>

      <nav className="luxury-container flex items-center justify-between h-16 md:h-20">
        {/* Left: mobile menu */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Left: desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-xs tracking-luxury uppercase text-muted-foreground hover-gold-underline pb-1 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Center: Logo */}
        <Link to="/" className="flex flex-col items-center">
          <img src={logo} alt="Upasanajyoti" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Right: desktop nav + icons */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.slice(3).map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-xs tracking-luxury uppercase text-muted-foreground hover-gold-underline pb-1 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-5 ml-4">
            <button aria-label="Search"><Search className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" /></button>
            <button aria-label="Account"><User className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" /></button>
            <Link to="/cart" aria-label="Cart" className="relative">
              <ShoppingBag className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-sans">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Right: mobile icons */}
        <div className="flex items-center gap-4 md:hidden">
          <button aria-label="Search"><Search className="w-4 h-4" /></button>
          <Link to="/cart" aria-label="Cart"><ShoppingBag className="w-4 h-4" /></Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border/40 overflow-hidden"
          >
            <div className="luxury-container py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-luxury uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
