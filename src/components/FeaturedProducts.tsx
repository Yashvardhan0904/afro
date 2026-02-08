import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import ProductCard from "./ProductCard";
import { GET_FEATURED_PRODUCTS_QUERY } from "@/graphql/products";

export default function FeaturedProducts() {
  const { loading, error, data } = useQuery(GET_FEATURED_PRODUCTS_QUERY, {
    variables: { take: 6 }
  });

  if (loading) {
    return (
      <section className="luxury-container py-24 md:py-40">
        <div className="text-center text-muted-foreground">Loading featured products...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="luxury-container py-24 md:py-40">
        <div className="text-center text-red-500">Error loading products</div>
      </section>
    );
  }

  const products = data?.featuredProducts || [];

  return (
    <section className="luxury-container py-24 md:py-40">
      <div className="flex flex-col items-center text-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="text-[10px] tracking-[0.5em] uppercase text-primary block mb-6">
            Masterpieces
          </span>
          <h2 className="text-display font-serif max-w-2xl">
            Selected Pieces for the Discerning Soul
          </h2>
          <div className="gold-divider mt-8 opacity-40" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
        {products.map((product: any, i: number) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductCard product={{
              id: product.id,
              name: product.title,
              price: product.price / 100, // Convert from paise to rupees
              image: product.thumbnail || product.images?.[0] || '/placeholder.svg',
              category: product.category?.name || 'Uncategorized',
              badge: product.isFeatured ? 'Featured' : undefined,
              rating: product.averageRating || 0,
              reviews: product.reviewCount || 0,
              description: product.description
            }} />
          </motion.div>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Link
            to="/collections"
            className="group relative inline-flex items-center gap-4 text-[10px] tracking-futuristic uppercase text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="h-px w-12 bg-border/40 group-hover:w-20 group-hover:bg-primary transition-all duration-700" />
            View Complete Archive
            <span className="h-px w-12 bg-border/40 group-hover:w-20 group-hover:bg-primary transition-all duration-700" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
