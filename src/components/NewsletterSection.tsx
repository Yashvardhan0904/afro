import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full scale-150" />

      <div className="luxury-container relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-[3rem] p-12 md:p-24 text-center max-w-5xl mx-auto"
        >
          <div className="max-w-xl mx-auto">
            <span className="text-[10px] tracking-futuristic uppercase gold-text block mb-6">
              Exclusive Access
            </span>
            <h2 className="text-display font-serif mb-8 leading-tight">
              Synchronize with our <br />
              <span className="italic underline decoration-primary/30 underline-offset-8">Creative Pulse</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground font-sans mb-12 leading-relaxed tracking-widest uppercase">
              Receive early access to archived releases and artisan narratives,
              delivered directly to your digital space.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="DIGITAL ADDRESS"
                  className="w-full bg-background/50 border border-border/20 rounded-full py-4 px-8 text-[10px] tracking-widest font-sans text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-all duration-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 bg-foreground text-background rounded-full px-12 py-4 text-[10px] tracking-futuristic uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500 font-sans"
              >
                Connect
              </button>
            </form>

            <p className="mt-8 text-[8px] tracking-[0.2em] text-muted-foreground/40 uppercase">
              By connecting, you agree to our data synchronization protocols.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
