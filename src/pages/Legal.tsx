import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const policies = {
    "privacy-policy": {
        title: "Privacy Policy",
        content: `
            <p>At Upasanajyoti, we respect your privacy and are committed to protecting your personal data. This policy outlines how we handle your information in accordance with the Information Technology Act, 2000.</p>
            <h3>1. Data Collection</h3>
            <p>We collect information you provide directly to us when you create an account, make a purchase, or subscribe to our newsletter. This includes your name, email address, phone number, and shipping address.</p>
            <h3>2. Use of Information</h3>
            <p>Your data is used to process orders, improve our services, and communicate with you about your sacred journey with our brand.</p>
            <h3>3. Security</h3>
            <p>We implement industry-standard security measures to protect your data during transactions (SSL encryption).</p>
        `
    },
    "terms-conditions": {
        title: "Terms & Conditions",
        content: `
            <p>By accessing Upasanajyoti, you agree to these legal terms. Please read them carefully to ensure a harmonious experience.</p>
            <h3>1. Order Acceptance</h3>
            <p>All orders are subject to acceptance and availability. We reserve the right to cancel any order due to pricing errors or stock discrepancies.</p>
            <h3>2. User Responsibilities</h3>
            <p>Users must provide accurate information and maintain the security of their accounts.</p>
            <h3>3. Limitation of Liability</h3>
            <p>Upasanajyoti shall not be liable for any indirect or consequential damages arising from the use of our products.</p>
            <h3>4. Governing Law</h3>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Delhi.</p>
        `
    },
    "shipping-policy": {
        title: "Shipping Policy",
        content: `
            <p>We strive to deliver our masterpieces to you with the utmost care and efficiency.</p>
            <h3>1. Processing Time</h3>
            <p>Orders are typically processed within 2-3 business days. Handcrafted items may require additional time as mentioned on the product page.</p>
            <h3>2. Delivery Estimates</h3>
            <p>Domestic shipping within India usually takes 5-7 business days. Delivery times may vary during festivals or extreme weather conditions.</p>
            <h3>3. Courier Partners</h3>
            <p>We partner with premium couriers like BlueDart and Delhivery to ensure safe passage of your sacred crafts.</p>
        `
    },
    "returns-refunds": {
        title: "Returns & Refunds",
        content: `
            <p>Your satisfaction is our priority. If a masterpiece does not resonate with you, we offer a graceful return process.</p>
            <h3>1. Return Window</h3>
            <p>We offer a 7-day return policy from the date of delivery.</p>
            <h3>2. Eligibility</h3>
            <p>Items must be in their original, unused condition with all tags and certificates intact. Custom or made-to-order items are non-returnable.</p>
            <h3>3. Refund Timeline</h3>
            <p>Once accepted, refunds are processed within 7-10 business days to the original payment method.</p>
        `
    },
    "cancellation-policy": {
        title: "Cancellation Policy",
        content: `
            <h3>1. Pre-Shipping Cancellation</h3>
            <p>You may cancel your order within 12 hours of placement or until it has been shipped, whichever is earlier.</p>
            <h3>2. Made-to-Order Items</h3>
            <p>Special commissions or made-to-order items cannot be cancelled once production has begun.</p>
        `
    },
    "disclaimer": {
        title: "Legal Disclaimer",
        content: `
            <p>Upasanajyoti celebrates the beauty of imperfection and the human touch.</p>
            <h3>1. Handmade Variations</h3>
            <p>As our products are handcrafted by master artisans, subtle variations in color, texture, and finish are inherent characteristics and not defects.</p>
            <h3>2. Color Accuracy</h3>
            <p>We strive to display product colors as accurately as possible, but screen settings may cause slight differences from the actual masterpiece.</p>
        `
    },
    "intellectual-property": {
        title: "Intellectual Property",
        content: `
            <p>© 2026 Upasanajyoti Collective. All rights reserved.</p>
            <p>All content on this website, including images, descriptions, and designs, is the exclusive intellectual property of Upasanajyoti. Unauthorized reproduction or use is strictly prohibited by law.</p>
        `
    }
};

export default function Legal() {
    const { policyId } = useParams<{ policyId: string }>();
    const currentPolicy = policies[policyId as keyof typeof policies] || policies["privacy-policy"];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [policyId]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <div className="luxury-container max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Sidebar Navigation */}
                        <aside className="md:col-span-1">
                            <h2 className="text-[10px] tracking-futuristic uppercase text-muted-foreground mb-8">Legal Matrix</h2>
                            <nav className="flex flex-col gap-4">
                                {Object.entries(policies).map(([id, policy]) => (
                                    <Link
                                        key={id}
                                        to={`/legal/${id}`}
                                        className={`text-[11px] tracking-widest uppercase transition-colors ${policyId === id ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"
                                            }`}
                                    >
                                        {policy.title}
                                    </Link>
                                ))}
                            </nav>
                        </aside>

                        {/* Policy Content */}
                        <div className="md:col-span-3">
                            <motion.div
                                key={policyId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="glass-card p-8 md:p-12 rounded-[2rem] border border-primary/5 shadow-2xl"
                            >
                                <h1 className="font-serif text-3xl md:text-5xl gold-text mb-12">{currentPolicy.title}</h1>
                                <div
                                    className="prose prose-sm prose-invert max-w-none legal-content"
                                    dangerouslySetInnerHTML={{ __html: currentPolicy.content }}
                                />

                                <div className="mt-16 pt-8 border-t border-border/10 flex flex-col gap-4">
                                    <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                                        Last Updated: February 2026
                                    </p>
                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <p className="text-[10px] tracking-widest text-primary uppercase font-medium">
                                            Grievance Officer: support@upasanajyoti.com
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
