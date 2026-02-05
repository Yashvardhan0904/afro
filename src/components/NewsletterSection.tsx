import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="border-y border-border/40">
      <div className="luxury-container py-20 md:py-28 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] tracking-luxury uppercase text-muted-foreground font-sans mb-3">
            Stay Illuminated
          </p>
          <h2 className="text-display editorial-heading mb-4">
            Join the Inner Circle
          </h2>
          <p className="text-sm text-muted-foreground font-sans mb-10 max-w-md mx-auto leading-relaxed">
            Receive early access to new collections, artisan stories, and quiet offerings — delivered with care.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full bg-transparent border-b border-border/60 py-3 px-1 text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
              required
            />
            <button
              type="submit"
              className="shrink-0 text-xs tracking-luxury uppercase border border-foreground/30 px-8 py-3 text-foreground hover:border-primary hover:text-primary transition-colors duration-500 font-sans"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
