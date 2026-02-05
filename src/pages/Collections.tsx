import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];

const categoryFilters = ["All", "Sacred Crafts", "Textiles", "Jewelry", "Home & Living"];

export default function Collections() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam
      ? categoryFilters.find(
          (c) => c.toLowerCase().replace(/\s+/g, "-") === categoryParam
        ) || "All"
      : "All"
  );
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    return result;
  }, [selectedCategory, sortBy]);

  return (
    <Layout>
      <div className="pt-32 md:pt-40 pb-20">
        {/* Header */}
        <div className="luxury-container text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display editorial-heading mb-4">Collections</h1>
            <div className="gold-divider" />
          </motion.div>
        </div>

        {/* Filters */}
        <div className="luxury-container mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-4">
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs tracking-luxury uppercase font-sans pb-1 transition-colors ${
                    selectedCategory === cat
                      ? "text-primary border-b border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs tracking-editorial font-sans text-muted-foreground border border-border/40 px-4 py-2 focus:outline-none focus:border-primary"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="luxury-container">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-sans">No pieces found in this collection.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
