import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

// Map product image keys to imported images
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const imageMap: Record<string, string> = {
  "/product-1": product1,
  "/product-2": product2,
  "/product-3": product3,
  "/product-4": product4,
  "/product-5": product5,
  "/product-6": product6,
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-card mb-5">
          <img
            src={imageMap[product.image] || product.image}
            alt={product.name}
            className="w-full h-full object-cover product-image-hover"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
            <span className="text-xs tracking-luxury uppercase text-foreground bg-background/80 backdrop-blur-sm px-6 py-2.5">
              View Details
            </span>
          </div>
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-4 left-4 text-[10px] tracking-luxury uppercase text-primary bg-background/90 backdrop-blur-sm px-3 py-1">
              {product.badge}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground font-sans">
            {product.category}
          </p>
          <h3 className="editorial-heading text-lg">{product.name}</h3>
          <p className="text-sm font-sans text-primary">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
