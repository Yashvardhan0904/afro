import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with Parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={heroImage}
          alt="Sacred handicrafts"
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] tracking-[0.5em] uppercase gold-text block mb-4 animate-glimmer">
              Authentic Indian Craftsmanship
            </span>
            <h1 className="text-display md:text-hero font-serif text-foreground leading-[0.9] mb-8">
              Upasanajyoti
            </h1>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "circOut" }}
            className="gold-divider origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground/80 font-sans max-w-lg mx-auto leading-loose"
          >
            Bridging tradition with the future through the quiet light of craft.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            className="pt-8"
          >
            <Link
              to="/collections"
              className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden rounded-full glass-card hover:bg-primary/10 transition-all duration-500"
            >
              <span className="relative z-10 text-[10px] tracking-futuristic uppercase text-foreground group-hover:text-primary transition-colors">
                Explore The Void
              </span>
              <div className="absolute inset-0 translate-y-[101%] group-hover:translate-y-0 bg-gradient-to-t from-primary/10 to-transparent transition-transform duration-500" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
