import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { products } from "@/data/products";

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

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  if (!product) {
    return (
      <Layout>
        <div className="pt-40 pb-20 text-center luxury-container">
          <p className="text-muted-foreground font-sans">Product not found.</p>
          <Link to="/collections" className="text-primary text-sm mt-4 inline-block font-sans">
            Back to Collections
          </Link>
        </div>
      </Layout>
    );
  }

  const imgSrc = imageMap[product.image] || product.image;

  return (
    <Layout>
      <div className="pt-28 md:pt-36 pb-20">
        <div className="luxury-container">
          {/* Breadcrumb */}
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs tracking-luxury uppercase text-muted-foreground hover:text-foreground transition-colors font-sans mb-10"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to Collections
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[3/4] overflow-hidden bg-card">
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <p className="text-[10px] tracking-luxury uppercase text-muted-foreground font-sans mb-3">
                {product.category}
              </p>

              <h1 className="text-display editorial-heading mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-sans">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <p className="text-2xl font-serif text-primary mb-8">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              <div className="h-px bg-border/40 mb-8" />

              {/* Quantity */}
              <div className="flex items-center gap-6 mb-8">
                <span className="text-xs tracking-luxury uppercase text-muted-foreground font-sans">
                  Quantity
                </span>
                <div className="flex items-center border border-border/40">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-accent/50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-12 text-center text-sm font-sans">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-accent/50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button className="flex-1 text-xs tracking-luxury uppercase bg-foreground text-background py-4 px-8 hover:bg-primary hover:text-primary-foreground transition-colors duration-500 font-sans">
                  Add to Cart
                </button>
                <button className="flex-1 text-xs tracking-luxury uppercase border border-foreground/30 py-4 px-8 text-foreground hover:border-primary hover:text-primary transition-colors duration-500 font-sans">
                  Buy Now
                </button>
              </div>

              {/* Delivery info */}
              <div className="space-y-3 text-xs text-muted-foreground font-sans">
                <p>Free shipping on orders above ₹5,000</p>
                <p>Estimated delivery: 5–7 business days</p>
                <p>14-day return policy</p>
              </div>

              <div className="h-px bg-border/40 my-8" />

              {/* Tabs */}
              <div className="flex gap-6 mb-6">
                {["description", "details", "shipping"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs tracking-luxury uppercase font-sans pb-1 transition-colors ${
                      activeTab === tab
                        ? "text-primary border-b border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-sm text-muted-foreground font-sans leading-relaxed">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "details" && (
                  <ul className="space-y-2">
                    <li>Handcrafted by master artisans</li>
                    <li>Certificate of authenticity included</li>
                    <li>Each piece is unique</li>
                  </ul>
                )}
                {activeTab === "shipping" && (
                  <ul className="space-y-2">
                    <li>Free domestic shipping above ₹5,000</li>
                    <li>International shipping available</li>
                    <li>Secure, insured packaging</li>
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
