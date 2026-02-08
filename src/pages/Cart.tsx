import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Heart, Plus, Minus, ShieldCheck, RefreshCw, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FREE_SHIPPING_THRESHOLD = 50000; // 500 rupees in paise

export default function Cart() {
    const { items, savedItems, updateQuantity, removeFromCart, saveToWishlist, moveToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Calculate totals (prices are in paise)
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 2500; // 25 rupees in paise
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal + shipping + tax;

    const handleQuantityUpdate = (id: string, delta: number) => {
        const item = items.find(i => i.id === id);
        if (item) {
            updateQuantity(id, item.quantity + delta);
        }
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            toast({
                title: "Cart is empty",
                description: "Add items to your cart before checking out",
                variant: "destructive",
            });
            return;
        }

        if (!isAuthenticated) {
            toast({
                title: "Authentication required",
                description: "Please log in to complete your order",
                variant: "destructive",
            });
            navigate('/auth');
            return;
        }

        navigate('/checkout');
    };

    const ProgressPercentage = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 luxury-container pt-24 md:pt-32 pb-32 md:pb-40">
                {/* Free Shipping Progress */}
                <div className="mb-10 md:mb-12 max-w-2xl mx-auto text-center px-2">
                    <div className="flex justify-between items-end mb-3">
                        <p className="text-[10px] md:text-[11px] uppercase tracking-luxury text-muted-foreground transition-all duration-500">
                            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                                <span className="text-primary flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> You've unlocked Free Shipping!
                                </span>
                            ) : (
                                `Only ₹${((FREE_SHIPPING_THRESHOLD - subtotal) / 100).toFixed(2)} away from Free Shipping!`
                            )}
                        </p>
                        <span className="text-[10px] uppercase tracking-luxury text-primary hidden sm:inline">
                            {subtotal >= FREE_SHIPPING_THRESHOLD ? "Unlocked" : `₹${(subtotal / 100).toFixed(0)} / ₹${(FREE_SHIPPING_THRESHOLD / 100).toFixed(0)}`}
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-border/20 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ProgressPercentage}%` }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-primary relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />
                        </motion.div>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 md:gap-16">
                    {/* Cart Column */}
                    <div className="lg:col-span-8 space-y-6 md:space-y-8">
                        <h1 className="text-3xl md:text-section font-serif mb-6 md:mb-10 text-center md:text-left">Your Sanctuary Selection</h1>

                        <AnimatePresence mode="popLayout">
                            {items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-20 text-center glass-card rounded-[2.5rem] md:rounded-3xl mx-2 md:mx-0"
                                >
                                    <p className="text-muted-foreground uppercase tracking-widest text-xs mb-6">Your cart is echoing emptiness</p>
                                    <Button asChild variant="outline" className="rounded-full uppercase tracking-luxury text-[10px]">
                                        <Link to="/collections">Return to Archive</Link>
                                    </Button>
                                </motion.div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="group relative flex flex-col sm:flex-row gap-6 p-5 md:p-6 glass-card rounded-[2rem] md:rounded-3xl overflow-hidden mx-2 md:mx-0"
                                    >
                                        <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden bg-muted">
                                            <img src={item.image} alt={item.name} className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute top-3 left-3 sm:hidden">
                                                <span className="glass-card text-[8px] tracking-luxury uppercase text-primary px-3 py-1.5 rounded-full border-primary/20 bg-background/60 backdrop-blur-md">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="hidden sm:block text-[8px] uppercase tracking-[0.3em] text-primary mb-1">{item.category}</span>
                                                    <h3 className="font-serif text-xl sm:text-lg">{item.name}</h3>
                                                </div>
                                                <PriceRoll value={(item.price * item.quantity) / 100} />
                                            </div>

                                            <div className="flex items-center justify-between mt-6 sm:mt-4">
                                                <div className="flex items-center gap-5 sm:gap-4 bg-background/60 backdrop-blur-md rounded-full px-4 py-2 sm:px-3 sm:py-1.5 border border-border/20 shadow-sm">
                                                    <button onClick={() => handleQuantityUpdate(item.id, -1)} className="hover:text-primary transition-colors disabled:opacity-30 p-1" disabled={item.quantity <= 1}>
                                                        <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                                                    </button>
                                                    <span className="text-sm sm:text-xs font-medium min-w-[1.25rem] text-center font-sans">{item.quantity}</span>
                                                    <button onClick={() => handleQuantityUpdate(item.id, 1)} className="hover:text-primary transition-colors p-1" disabled={item.quantity >= item.stock}>
                                                        <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-6 sm:gap-5">
                                                    <button
                                                        onClick={() => saveToWishlist(item.id)}
                                                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors active:scale-95 duration-200"
                                                    >
                                                        <Heart className="w-3.5 h-3.5 sm:w-3 sm:h-3" /> <span className="hidden xs:inline">Save</span>
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-muted-foreground hover:text-destructive transition-colors active:scale-95 duration-200 p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>

                        {/* Saved Tray */}
                        <AnimatePresence>
                            {savedItems.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-16 md:mt-20 pt-10 border-t border-border/10 px-2"
                                >
                                    <h2 className="text-[10px] uppercase tracking-luxury text-muted-foreground mb-8 text-center md:text-left">Held in Intent (Wishlist)</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                        {savedItems.map(item => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group flex flex-col gap-3"
                                            >
                                                <div className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-muted">
                                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-all duration-700" />
                                                    <button
                                                        onClick={() => moveToCart(item.id)}
                                                        className="absolute inset-x-3 bottom-3 flex items-center justify-center bg-background/80 backdrop-blur-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 py-2.5 rounded-xl border border-white/10 shadow-lg"
                                                    >
                                                        <span className="text-[9px] uppercase tracking-widest text-foreground font-bold">Move to Cart</span>
                                                    </button>
                                                </div>
                                                <p className="text-[9px] tracking-luxury uppercase text-muted-foreground truncate px-1">{item.name}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Summary Column */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit pb-10 lg:pb-0">
                        <div className="glass-card rounded-[2.5rem] md:rounded-3xl p-6 md:p-8 space-y-8 mx-2 md:mx-0 shadow-2xl shadow-black/20">
                            <h2 className="font-serif text-2xl sm:text-xl border-b border-border/10 pb-4 text-center sm:text-left">Order Summary</h2>

                            <div className="space-y-5">
                                <div className="flex justify-between text-[11px] sm:text-xs tracking-widest uppercase text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="text-foreground tabular-nums font-medium">₹ {(subtotal / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] sm:text-xs tracking-widest uppercase text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-primary font-medium" : "text-foreground tabular-nums font-medium"}>
                                        {shipping === 0 ? "Complimentary" : `₹ ${(shipping / 100).toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[11px] sm:text-xs tracking-widest uppercase text-muted-foreground">
                                    <span>Estimated Tax</span>
                                    <span className="text-foreground tabular-nums font-medium">₹ {(tax / 100).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="border-t border-border/10 pt-6">
                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-[10px] uppercase tracking-luxury text-muted-foreground">Total to Secure</span>
                                    <span className="text-3xl sm:text-2xl font-serif gold-text tabular-nums">₹ {(total / 100).toFixed(2)}</span>
                                </div>

                                <div className="hidden sm:block">
                                    <CheckoutButton onClick={handleCheckout} disabled={items.length === 0} />
                                </div>

                                <div className="pt-8 grid grid-cols-1 gap-5 opacity-70">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[9px] uppercase tracking-widest leading-relaxed">End-to-End Encryption Secure Payment Flow</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <RefreshCw className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[9px] uppercase tracking-widest leading-relaxed">Artisan Quality Guarantee & 30-Day Returns</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <CreditCard className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[9px] uppercase tracking-widest leading-relaxed">Global Express & Local Sanctuary Care</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Bar - Thumb Zone */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-2xl border-t border-border/10 p-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
                <div className="luxury-container flex items-center justify-between gap-6">
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-luxury text-muted-foreground mb-0.5">Final Total</span>
                        <span className="text-xl font-serif gold-text tabular-nums">₹ {(total / 100).toFixed(2)}</span>
                    </div>
                    <CheckoutButton 
                        className="flex-1 h-14 rounded-xl shadow-lg shadow-primary/20" 
                        onClick={handleCheckout} 
                        disabled={items.length === 0}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}

function PriceRoll({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDisplayValue(value);
        }, 50);
        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <motion.div
            key={value}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-serif gold-text tabular-nums"
        >
            ₹{value.toFixed(2)}
        </motion.div>
    );
}

function CheckoutButton({ className, onClick, disabled }: { className?: string; onClick?: () => void; disabled?: boolean }) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground h-16 rounded-2xl text-[10px] uppercase tracking-luxury font-bold transition-all hover:scale-[1.02] shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            Complete the Sanctuary <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
    );
}
