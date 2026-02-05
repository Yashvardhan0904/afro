import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import categorySacred from "@/assets/category-sacred.jpg";
import categoryTextiles from "@/assets/category-textiles.jpg";
import categoryJewelry from "@/assets/category-jewelry.jpg";
import { categories } from "@/data/products";

const imageMap: Record<string, string> = {
  "/category-sacred": categorySacred,
  "/category-textiles": categoryTextiles,
  "/category-jewelry": categoryJewelry,
};

export default function CategoryGrid() {
  return (
    <section className="luxury-container py-20 md:py-32">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-luxury uppercase text-muted-foreground font-sans mb-3">
          Curated Collections
        </p>
        <h2 className="text-display editorial-heading">Explore by Craft</h2>
        <div className="gold-divider mt-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <Link to={`/collections?category=${cat.slug}`} className="group block relative aspect-[4/3] overflow-hidden">
              <img
                src={imageMap[cat.image]}
                alt={cat.name}
                className="w-full h-full object-cover product-image-hover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/40 group-hover:bg-background/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="editorial-heading text-section text-foreground">{cat.name}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
