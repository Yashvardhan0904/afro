import ProductCard from "./ProductCard";
import { products } from "@/data/products";

export default function FeaturedProducts() {
  return (
    <section className="luxury-container py-20 md:py-32">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-luxury uppercase text-muted-foreground font-sans mb-3">
          Selected for You
        </p>
        <h2 className="text-display editorial-heading">Featured Pieces</h2>
        <div className="gold-divider mt-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
