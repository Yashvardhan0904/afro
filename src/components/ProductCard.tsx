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
  // Handle both static image paths and dynamic URLs
  const imgSrc = product.image.startsWith('/product-') 
    ? (imageMap[product.image] || product.image)
    : product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block relative">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-2xl bg-card shadow-lg shadow-black/5 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-700">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-active:scale-105"
            loading="lazy"
          />

          {/* Luxury Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 md:flex flex-col justify-end p-6 hidden">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
              <span className="inline-block glass-card text-[9px] tracking-futuristic uppercase px-4 py-2 rounded-full text-foreground mb-2">
                Discover Piece
              </span>
            </div>
          </div>

          {/* Mobile Info Overlay (Visible on tap or small screen) */}
          <div className="absolute inset-x-0 bottom-0 p-4 md:hidden bg-gradient-to-t from-black/80 to-transparent">
            <span className="text-[7px] tracking-[0.3em] uppercase text-primary/80 font-medium mb-1 block">
              {product.category}
            </span>
            <p className="text-white text-xs font-serif truncate">{product.name}</p>
          </div>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 right-4 z-10 transition-all duration-500 group-hover:translate-x-0">
              <span className="glass-card text-[7px] md:text-[8px] tracking-luxury uppercase text-primary px-2.5 py-1.5 rounded-full border-primary/20 bg-background/60 backdrop-blur-md">
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {/* Info Area (Desktop visible, mobile consistent) */}
        <div className="mt-5 md:mt-6 text-center space-y-1 md:space-y-1.5 hidden md:block">
          <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground block font-sans">
            {product.category}
          </span>
          <h3 className="editorial-heading text-lg md:text-2xl gold-text group-hover:tracking-wider transition-all duration-700 truncate px-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="h-px w-6 md:w-8 bg-primary/20 group-hover:w-10 transition-all duration-700" />
            <p className="text-xs md:text-sm font-sans tracking-widest text-foreground font-light tabular-nums">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <div className="h-px w-6 md:w-8 bg-primary/20 group-hover:w-10 transition-all duration-700" />
          </div>
        </div>

        {/* Mobile Price Display */}
        <div className="mt-3 text-center md:hidden">
          <p className="text-[11px] font-sans tracking-[0.2em] text-foreground font-medium tabular-nums">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
