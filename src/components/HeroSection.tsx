import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Sacred handicrafts illuminated by diya light"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-hero editorial-heading text-foreground mb-4">
            Upasanajyoti
          </h1>
          <div className="gold-divider mb-6" />
          <p className="text-sm tracking-luxury uppercase text-muted-foreground mb-10 font-sans">
            The Quiet Light of Craft
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Link
            to="/collections"
            className="inline-block text-xs tracking-luxury uppercase border border-foreground/30 px-10 py-4 text-foreground hover:border-primary hover:text-primary transition-colors duration-500 font-sans"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
