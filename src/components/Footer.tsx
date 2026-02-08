import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const footerLinks = [
  {
    title: "Assistance",
    links: [
      { label: "Contact", href: "/legal/contact" },
      { label: "Shipping Policy", href: "/legal/shipping-policy" },
      { label: "Returns & Refunds", href: "/legal/returns-refunds" },
      { label: "Cancellation Policy", href: "/legal/cancellation-policy" },
      { label: "FAQ", href: "/legal/faq" },
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms & Conditions", href: "/legal/terms-conditions" },
      { label: "Disclaimer", href: "/legal/disclaimer" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Intellectual Property", href: "/legal/intellectual-property" },
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/10">
      <div className="luxury-container py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
          {/* Brand Identity */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl gold-text mb-4">Upasanajyoti</h3>
              <p className="text-[10px] tracking-futuristic text-muted-foreground uppercase leading-loose max-w-[280px]">
                Preserving the rhythmic pulse of Indian craft through the lens of tomorrow.
              </p>
            </div>

            <div className="mt-12 md:mt-0 flex gap-6">
              {["Instagram", "Vimeo", "Journal"].map(social => (
                <Link key={social} to="#" className="text-[9px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="md:col-span-8 grid grid-cols-2 gap-12 sm:gap-24">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-[10px] tracking-futuristic uppercase text-foreground mb-8">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-[11px] tracking-widest text-muted-foreground hover:text-primary transition-all duration-300 font-sans uppercase"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Meta */}
        <div className="mt-24 pt-12 border-t border-border/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[9px] tracking-widest text-muted-foreground/60 font-sans uppercase">
              © 2026 Upasanajyoti Collective. All rights reserved.
            </p>
            <p className="text-[9px] tracking-widest text-muted-foreground/40 font-sans uppercase">
              Grievance Officer: support@upasanajyoti.com
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-primary/40 animate-pulse" />
            <span className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase">
              Synchronized from Bharat
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
