import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Check } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import ProductCard from "@/components/ProductCard";
import { GET_PRODUCTS_QUERY } from "@/graphql/products";
import { GET_CATEGORIES_QUERY } from "@/graphql/categories";

const sortOptions = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOpen, setSortOpen] = useState(false);

  const categoryFilter = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "newest";

  // Fetch categories
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES_QUERY);
  
  // Fetch products with optional category filter
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(GET_PRODUCTS_QUERY, {
    variables: {
      skip: 0,
      take: 100,
      filters: categoryFilter !== "all" ? { categorySlug: categoryFilter } : undefined
    }
  });

  const categories = categoriesData?.categories || [];
  const products = productsData?.products?.products || [];

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return (b.averageRating || 0) - (a.averageRating || 0);
    return 0; // "newest" or default
  });

  const isLoading = categoriesLoading || productsLoading;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="luxury-container">
        {/* Refined Header */}
        <header className="mb-10 md:mb-24 relative px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="text-[9px] md:text-[10px] tracking-futuristic uppercase text-primary block mb-4 md:mb-6">
              Curated Archive
            </span>
            <h1 className="text-4xl md:text-display font-serif mb-6 md:mb-8 text-foreground/90 leading-tight">
              Preserving <br className="hidden md:block" />
              <span className="italic">Heritage</span>
            </h1>
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto" />
          </motion.div>
        </header>

        {/* Floating Filter Bar */}
        <div className="sticky top-20 md:top-24 z-30 mb-12 md:mb-16 px-4">
          <div className="glass-card rounded-[2rem] md:rounded-full px-2 md:px-4 py-2 flex items-center justify-between gap-2 md:gap-4 max-w-4xl mx-auto border-primary/10 shadow-2xl shadow-black/20">
            {/* Categories */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 py-1 flex-1">
              <Link
                to="/"
                className="px-4 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] tracking-luxury uppercase transition-all duration-500 whitespace-nowrap text-muted-foreground hover:text-primary hover:bg-primary/5"
              >
                Home
              </Link>
              <button
                onClick={() => setSearchParams({ category: "all", sort: sortBy })}
                className={`px-4 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] tracking-luxury uppercase transition-all duration-500 whitespace-nowrap ${categoryFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
              >
                All
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.slug}
                  onClick={() => setSearchParams({ category: cat.slug, sort: sortBy })}
                  className={`px-4 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] tracking-luxury uppercase transition-all duration-500 whitespace-nowrap ${categoryFilter === cat.slug
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort Toggle (Simplified for Mobile) */}
            <div className="relative border-l border-border/10 pl-2 md:pl-4">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 text-[9px] md:text-[10px] tracking-luxury uppercase text-foreground hover:text-primary transition-colors"
              >
                <span className="hidden sm:inline">Sort</span>
                <Filter className="w-3 md:w-3.5 h-3 md:h-3.5 sm:hidden" />
                <ChevronDown className={`w-3 md:w-3.5 h-3 md:h-3.5 transition-transform duration-500 ${sortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 min-w-[220px] glass-card rounded-2xl overflow-hidden border-primary/10"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSearchParams({ category: categoryFilter, sort: opt.value });
                          setSortOpen(false);
                        }}
                        className="w-full text-left px-6 py-4 text-[10px] tracking-widest uppercase hover:bg-primary/10 flex items-center justify-between group transition-colors"
                      >
                        <span className={sortBy === opt.value ? "text-primary font-medium" : "text-muted-foreground"}>
                          {opt.label}
                        </span>
                        {sortBy === opt.value && <Check className="w-3 h-3 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-32 text-center">
            <p className="font-serif text-2xl text-muted-foreground italic">
              Loading collection...
            </p>
          </div>
        ) : productsError ? (
          <div className="py-32 text-center">
            <p className="font-serif text-2xl text-destructive italic">
              Error loading products. Please try again.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {sortedProducts.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.title,
                      price: product.price / 100, // Convert from paise to rupees
                      image: product.thumbnail || product.images?.[0] || '/placeholder.svg',
                      category: product.category?.name || 'Uncategorized',
                      badge: product.isFeatured ? 'Featured' : undefined,
                      rating: product.averageRating || 0,
                      reviews: product.reviewCount || 0,
                      description: product.description
                    }} 
                  />
                </motion.div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="py-32 text-center">
                <p className="font-serif text-2xl text-muted-foreground italic">
                  No pieces found in this category.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
