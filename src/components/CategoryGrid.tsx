import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES_QUERY } from "@/graphql/categories";
import categorySacred from "@/assets/category-sacred.jpg";
import categoryTextiles from "@/assets/category-textiles.jpg";
import categoryJewelry from "@/assets/category-jewelry.jpg";

const imageMap: Record<string, string> = {
  "sacred-jewelry": categorySacred,
  "meditation-tools": categoryJewelry,
  "spiritual-textiles": categoryTextiles,
};

export default function CategoryGrid() {
  const { data, loading } = useQuery(GET_CATEGORIES_QUERY);
  const categories = data?.categories || [];

  if (loading) {
    return (
      <section className="luxury-container py-24 md:py-40">
        <div className="text-center">
          <p className="text-muted-foreground font-sans">Loading categories...</p>
        </div>
      </section>
    );
  }
  return (
    <section className="luxury-container py-24 md:py-40">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-xl"
        >
          <span className="text-[10px] tracking-futuristic uppercase gold-text block mb-4">
            Legacy Collections
          </span>
          <h2 className="text-display font-serif leading-tight">
            The Intersection of <br />
            <span className="italic">Heritage & Future</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="hidden md:block"
        >
          <div className="h-px w-32 bg-primary/30 mb-8" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
        {categories.map((cat: any, i: number) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/collections?category=${cat.slug}`}
              className="group block relative aspect-[4/5] overflow-hidden rounded-3xl glass-card transition-all duration-700 hover:shadow-primary/10 hover:shadow-2xl translate-y-0 hover:-translate-y-2"
            >
              <img
                src={imageMap[cat.slug] || categorySacred}
                alt={cat.name}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-40"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center">
                <span className="text-[9px] tracking-[0.4em] uppercase text-primary mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                  Explore Craft
                </span>
                <h3 className="editorial-heading text-2xl lg:text-3xl text-foreground text-center">
                  {cat.name}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
