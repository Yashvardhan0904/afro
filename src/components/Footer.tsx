import { Link } from "react-router-dom";

const footerLinks = {
  Shop: ["Sacred Crafts", "Textiles", "Jewelry", "Home & Living", "New Arrivals"],
  Company: ["Our Story", "Artisan Network", "Sustainability", "Press"],
  Support: ["Contact Us", "Shipping & Returns", "FAQ", "Track Order"],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/40">
      <div className="luxury-container py-16 md:py-24">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="editorial-heading text-2xl mb-2">Upasanajyoti</h3>
            <p className="text-xs tracking-luxury text-muted-foreground">The Quiet Light of Craft</p>
            <div className="gold-divider mt-6 mx-0" />
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs tracking-luxury uppercase text-muted-foreground mb-6">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors font-sans"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-sans">
            © 2025 Upasanajyoti. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link key={item} to="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
