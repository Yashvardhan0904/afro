import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, LogOut, Settings, Package, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useLazyQuery } from "@apollo/client/react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { GET_PRODUCTS_QUERY } from "@/graphql/products";

const navLinks = [
  { label: "Collections", href: "/collections" },
  { label: "Our Story", href: "/story" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const [searchProducts, { data: searchData, loading: searchLoading }] = useLazyQuery<{
    products: {
      products: any[];
      total: number;
    }
  }>(GET_PRODUCTS_QUERY);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchProducts({
        variables: {
          skip: 0,
          take: 5,
          filters: { search: debouncedQuery }
        }
      });
    }
  }, [debouncedQuery, searchProducts]);

  const filteredProducts = searchData?.products?.products || [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredProducts.length > 0) {
      navigate(`/product/${filteredProducts[0].id}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"
        }`}
    >
      <nav
        className={`luxury-container flex items-center justify-between transition-all duration-500 rounded-full px-4 md:px-6 py-2 ${scrolled ? "glass-card mx-2 sm:mx-8 md:mx-12 shadow-2xl shadow-primary/5" : "bg-transparent"
          }`}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="group relative flex items-center">
            <span className="font-serif text-lg md:text-2xl tracking-[0.2em] md:tracking-futuristic uppercase gold-text transition-all duration-500 group-hover:tracking-[0.4em]">
              Upasanajyoti
            </span>
          </Link>

          {/* Desktop Nav: Moved next to logo */}
          <div className="hidden lg:flex items-center gap-6 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[10px] tracking-luxury uppercase text-muted-foreground hover:text-primary transition-colors hover-gold-underline pb-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Icons & Mobile Toggle */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-5 mr-2">
            <button
              aria-label="Search"
              className="hover:scale-110 transition-transform"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            </button>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Profile"
                  className="hover:scale-110 transition-transform"
                >
                  <User className="w-4 h-4 text-primary transition-colors" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileOpen(false)}
                      />

                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-4 w-72 glass-card rounded-2xl p-6 shadow-2xl z-50"
                      >
                        {/* User Info Card */}
                        <div className="mb-4 pb-4 border-b border-border/10">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user?.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                          </div>
                          <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-medium">
                            {user?.role}
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                          {user?.role === 'ADMIN' && (
                            <>
                              <Link
                                to="/admin/products"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                              >
                                <Package className="w-4 h-4" />
                                <span>Manage Products</span>
                              </Link>
                              <Link
                                to="/admin/orders"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                <span>View Orders</span>
                              </Link>
                            </>
                          )}

                          <Link
                            to="/orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                          >
                            <Package className="w-4 h-4" />
                            <span>My Orders</span>
                          </Link>

                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth" aria-label="Account" className="hover:scale-110 transition-transform">
                <User className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            )}
          </div>

          <Link to="/cart" aria-label="Cart" className="relative hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[8px] flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden p-1 hover:scale-110 transition-transform"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative w-full max-w-2xl glass-card rounded-3xl shadow-2xl overflow-hidden border border-primary/10"
            >
              <div className="p-4 md:p-6">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-primary/50" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for masterpieces..."
                    className="w-full bg-primary/5 border-none rounded-2xl py-4 pl-12 pr-12 text-sm md:text-base focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-12 flex items-center">
                    {searchLoading && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-4 p-1 hover:bg-primary/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </form>

                <div className="mt-6">
                  {searchQuery ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] uppercase tracking-luxury text-muted-foreground">Results</h3>
                        <span className="text-[10px] text-muted-foreground">{filteredProducts.length} items found</span>
                      </div>

                      <div className="grid gap-2">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product: any) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-all group"
                            >
                              <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                                <img src={product.thumbnail || product.images?.[0] || '/placeholder.svg'} alt={product.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate">{product.title}</h4>
                                <p className="text-xs text-muted-foreground">{product.category?.name || 'Uncategorized'}</p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <span className="text-sm font-semibold">₹{(product.price / 100).toLocaleString()}</span>
                                <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                              </div>
                            </Link>
                          ))
                        ) : !searchLoading ? (
                          <div className="py-8 text-center bg-primary/5 rounded-2xl border border-dashed border-primary/20">
                            <p className="text-sm text-muted-foreground">No products found for "{searchQuery}"</p>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-sm text-muted-foreground">Searching...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-[10px] uppercase tracking-luxury text-muted-foreground">Quick Links</h3>
                      <div className="flex flex-wrap gap-2">
                        {navLinks.map((link) => (
                          <Link
                            key={link.label}
                            to={link.href}
                            onClick={() => setSearchOpen(false)}
                            className="px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 text-xs transition-colors border border-primary/10"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
