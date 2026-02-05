import { motion } from "framer-motion";
import { Package, Shield, Truck, RefreshCw } from "lucide-react";

const badges = [
  { icon: Package, label: "Handcrafted", desc: "By master artisans" },
  { icon: Shield, label: "Authenticated", desc: "Certificate of origin" },
  { icon: Truck, label: "Free Shipping", desc: "Orders above ₹5,000" },
  { icon: RefreshCw, label: "Easy Returns", desc: "14-day return policy" },
];

export default function TrustBadges() {
  return (
    <section className="luxury-container py-16 md:py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <badge.icon className="w-5 h-5 mx-auto mb-3 text-primary" strokeWidth={1.2} />
            <p className="text-xs tracking-editorial uppercase font-sans text-foreground mb-1">{badge.label}</p>
            <p className="text-[11px] text-muted-foreground font-sans">{badge.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
