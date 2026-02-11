import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, ShieldCheck, Truck, RefreshCcw, Heart, CheckCircle2, ShoppingBag, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { GET_PRODUCT_BY_ID_QUERY, LIKE_PRODUCT_MUTATION, UNLIKE_PRODUCT_MUTATION } from "@/graphql/products";
import { isAuthenticated, removeAuthToken } from "@/lib/apollo-client";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [lastTap, setLastTap] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Fetch product data
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID_QUERY, {
    variables: { id },
    skip: !id
  });

  // Like/Unlike mutations — refetch product data to update rating & count
  const [likeProduct] = useMutation(LIKE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: GET_PRODUCT_BY_ID_QUERY, variables: { id } }],
  });
  const [unlikeProduct] = useMutation(UNLIKE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: GET_PRODUCT_BY_ID_QUERY, variables: { id } }],
  });

  const product = data?.product;
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  useEffect(() => {
    if (product) {
      setIsLiked(product.isLikedByMe || false);
    }
  }, [product]);

  const handleLikeToggle = async () => {
    if (!product) return;

    if (!isAuthenticated()) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like products",
        variant: "destructive",
      });
      return;
    }

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    try {
      if (newLikedState) {
        await likeProduct({ variables: { productId: product.id } });
      } else {
        await unlikeProduct({ variables: { productId: product.id } });
      }
    } catch (err: any) {
      // Revert on error
      setIsLiked(!newLikedState);
      const gqlError = err?.graphQLErrors?.[0]?.extensions?.code || err?.message || '';
      if (gqlError === 'UNAUTHENTICATED' || gqlError.includes('Unauthorized') || err?.message?.includes('Unauthorized')) {
        // Token is expired or invalid — clear it and redirect
        removeAuthToken();
        toast({
          title: "Session expired",
          description: "Please sign in again to like products",
          variant: "destructive",
        });
        setTimeout(() => navigate('/auth'), 1500);
      } else {
        toast({
          title: "Something went wrong",
          description: err?.message || "Could not update like. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock < quantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${product.stock} items available`,
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail || product.images?.[0] || '/placeholder.svg',
      category: product.category?.name || 'Uncategorized',
      description: product.description,
      stock: product.stock,
    }, quantity);

    setIsAdded(true);
    setShowNotification(true);

    setTimeout(() => {
      setIsAdded(false);
      setShowNotification(false);
    }, 4000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-40 pb-20 text-center luxury-container">
          <p className="text-muted-foreground font-sans">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
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

  const imgSrc = product.thumbnail || product.images?.[0] || '/placeholder.svg';
  const price = product.price / 100; // Convert from paise to rupees

  return (
    <Layout>
      {/* Premium Notification Overlay */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 md:top-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:min-w-[400px] z-[60] px-6 py-4 md:py-3 glass-card rounded-2xl md:rounded-full border-primary/20 flex flex-col md:flex-row items-center gap-3 md:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-background/80 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 md:w-3.5 md:h-3.5 text-primary" />
              </div>
              <span className="text-[10px] md:text-[11px] uppercase tracking-luxury text-foreground font-medium leading-tight">Item added to bag successfully</span>
            </div>
            <div className="flex items-center justify-between w-full md:w-auto md:border-l md:border-border/20 md:pl-4 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-border/10 md:border-t-0">
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest md:hidden">Actions</span>
              <Link to="/cart" className="text-[10px] md:text-[9px] uppercase tracking-widest text-primary font-bold hover:underline flex items-center gap-1">
                View Bag <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 md:pt-48 pb-20 md:pb-32">
        <div className="luxury-container">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link
              to="/collections"
              className="group inline-flex items-center gap-3 text-[10px] tracking-futuristic uppercase text-muted-foreground hover:text-primary transition-colors font-sans"
            >
              <div className="h-px w-6 bg-border/40 group-hover:w-10 group-hover:bg-primary transition-all duration-500" />
              Return to Archive
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Gallery Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-[2rem] glass-card group cursor-pointer"
                onClick={() => {
                  const now = Date.now();
                  if (now - lastTap < 300) {
                    if (!isLiked && isAuthenticated()) {
                      setIsLiked(true);
                      likeProduct({ variables: { productId: product.id } }).catch(() => setIsLiked(false));
                    } else if (!isAuthenticated()) {
                      toast({ title: "Sign in required", description: "Please sign in to like products", variant: "destructive" });
                    }
                    setShowHeartOverlay(true);
                    setTimeout(() => setShowHeartOverlay(false), 1000);
                  }
                  setLastTap(now);
                }}
              >
                <img
                  src={imgSrc}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />

                <AnimatePresence>
                  {showHeartOverlay && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: -15 }}
                      animate={{ opacity: 1, scale: 1.1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.4, rotate: 15 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    >
                      <div className="relative">
                        <Heart className="w-32 h-32 text-rose-600 fill-rose-600 drop-shadow-[0_0_40px_rgba(225,29,72,0.4)]" />
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 1 }}
                          exit={{ scale: 2, opacity: 0 }}
                          className="absolute inset-0 border-4 border-white/20 rounded-full blur-xl"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {product.isFeatured && (
                  <span className="absolute top-8 right-8 glass-card px-6 py-2 rounded-full text-[10px] tracking-luxury uppercase text-primary border-primary/20">
                    Featured
                  </span>
                )}
              </div>
            </motion.div>

            {/* Details Section */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] tracking-[0.4em] uppercase gold-text font-medium">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  <div className="h-px w-12 bg-primary/20" />
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight mb-6">
                  {product.title}
                </h1>

                {/* Rating — dynamic, updates when you like */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="flex gap-1.5 pt-0.5">
                    {[...Array(5)].map((_, i) => {
                      const rating = product.averageRating || 0;
                      const filled = i < Math.floor(rating);
                      const halfFilled = !filled && i < rating;
                      return (
                        <Star
                          key={i}
                          className={`w-3 h-3 transition-all duration-500 ${
                            filled
                              ? "text-primary fill-primary"
                              : halfFilled
                              ? "text-primary fill-primary/50"
                              : "text-border/40"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                    {(product.averageRating || 0).toFixed(1)} · {product.reviewCount || 0} appraisals · {product.likeCount || 0} {product.likeCount === 1 ? 'like' : 'likes'}
                  </span>
                </div>

                <div className="text-3xl font-light tracking-widest text-foreground font-sans mb-12">
                  ₹{price.toLocaleString("en-IN")}
                </div>

                <div className="h-px bg-gradient-to-r from-border/40 to-transparent mb-12" />

                {/* Quantity & Actions */}
                <div className="space-y-8">
                  <div className="flex items-center gap-10">
                    <span className="text-[10px] tracking-futuristic uppercase text-muted-foreground">
                      Unit Count
                    </span>
                    <div className="flex items-center glass-card rounded-full px-4 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:text-primary transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center text-xs font-sans font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`flex-1 relative group overflow-hidden py-5 rounded-full text-[10px] tracking-futuristic uppercase transition-all duration-500 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${isAdded ? 'bg-background border border-primary/40 text-primary shadow-primary/10' : 'bg-primary text-primary-foreground hover:shadow-primary/20'}`}
                      >
                        <AnimatePresence mode="wait">
                          {isAdded ? (
                            <motion.span
                              key="added"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="relative z-10 flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Added to Cart
                            </motion.span>
                          ) : (
                            <motion.span
                              key="add"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="relative z-10 flex items-center justify-center gap-2"
                            >
                              <ShoppingBag className="w-3 h-3" /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {!isAdded && product.stock > 0 && <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-foreground/10 transition-transform duration-500" />}
                      </button>

                      <button
                        onClick={handleLikeToggle}
                        className="glass-card p-5 rounded-full hover:bg-primary/10 transition-all duration-500 group"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'text-rose-600 fill-rose-600' : 'text-muted-foreground group-hover:text-primary'}`}
                        />
                      </button>
                    </div>

                    <button className="glass-card py-5 rounded-full text-[10px] tracking-futuristic uppercase text-foreground hover:bg-foreground hover:text-background transition-all duration-500">
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-border/10">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <ShieldCheck className="w-5 h-5 text-primary/60" />
                    <span className="text-[8px] tracking-widest uppercase text-muted-foreground leading-relaxed">
                      Ethically <br /> Sourced
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Truck className="w-5 h-5 text-primary/60" />
                    <span className="text-[8px] tracking-widest uppercase text-muted-foreground leading-relaxed">
                      Global <br /> Courier
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <RefreshCcw className="w-5 h-5 text-primary/60" />
                    <span className="text-[8px] tracking-widest uppercase text-muted-foreground leading-relaxed">
                      Artisan <br /> Support
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Details Tabs */}
          <div className="mt-32">
            <div className="flex justify-center gap-12 mb-12">
              {["description", "details", "heritage"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] tracking-futuristic uppercase font-sans transition-all duration-500 relative pb-4 ${activeTab === tab
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeDetailTab"
                      className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto glass-card p-10 md:p-16 rounded-[2.5rem] text-center"
              >
                <div className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed tracking-wide">
                  {activeTab === "description" && <p>{product.description}</p>}
                  {activeTab === "details" && (
                    <ul className="space-y-4">
                      <li>Hand-forged by hereditary master artisans in regional clusters.</li>
                      <li>Signed certificate of provenance and material analysis included.</li>
                      <li>Every piece possesses slight intentional variations, making it unique.</li>
                    </ul>
                  )}
                  {activeTab === "heritage" && (
                    <p className="italic">
                      "Each stroke and curve carries the resonance of a thousand years, reimagined for the contemporary observer. We bridge the void between ancestral memory and future vision."
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
