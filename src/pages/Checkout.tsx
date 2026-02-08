import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { CREATE_ORDER_MUTATION } from "@/graphql/orders";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);

  const [shippingData, setShippingData] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Calculate totals (prices are in paise)
  const subtotal = getCartTotal();
  const shipping = subtotal >= 50000 ? 0 : 2500; // 25 rupees in paise
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your order",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      });
      navigate("/cart");
      return;
    }

    setIsProcessing(true);

    try {
      const orderInput = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingName: shippingData.name,
        shippingPhone: shippingData.phone,
        shippingLine1: shippingData.line1,
        shippingLine2: shippingData.line2 || undefined,
        shippingCity: shippingData.city,
        shippingState: shippingData.state,
        shippingPincode: shippingData.pincode,
        shippingCountry: shippingData.country,
      };

      const { data } = await createOrder({
        variables: { input: orderInput },
      });

      if (data?.createOrder) {
        toast({
          title: "Order placed successfully!",
          description: `Order #${data.createOrder.orderNumber} - Cash on Delivery`,
        });
        
        clearCart();
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "Unable to process your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center luxury-container">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/collections">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 luxury-container pt-32 pb-24">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-serif mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Information */}
                <div className="glass-card rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-serif">Shipping Information</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={shippingData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={shippingData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="9876543210"
                      />
                    </div>

                    <div>
                      <Label htmlFor="line1">Address Line 1 *</Label>
                      <Input
                        id="line1"
                        name="line1"
                        value={shippingData.line1}
                        onChange={handleInputChange}
                        required
                        placeholder="House/Flat No., Street Name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="line2">Address Line 2</Label>
                      <Input
                        id="line2"
                        name="line2"
                        value={shippingData.line2}
                        onChange={handleInputChange}
                        placeholder="Landmark, Area (Optional)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingData.city}
                          onChange={handleInputChange}
                          required
                          placeholder="Mumbai"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingData.state}
                          onChange={handleInputChange}
                          required
                          placeholder="Maharashtra"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={shippingData.pincode}
                          onChange={handleInputChange}
                          required
                          placeholder="400001"
                        />
                      </div>

                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={shippingData.country}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full h-14 text-sm uppercase tracking-wider"
                >
                  {isProcessing ? "Processing..." : "Place Order (Cash on Delivery)"}
                </Button>
              </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-3xl p-8 sticky top-32">
              <h2 className="text-xl font-serif mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{((item.price * item.quantity) / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-border/10">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-primary" : ""}>
                    {shipping === 0 ? "Free" : `₹${(shipping / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{(tax / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-serif pt-3 border-t border-border/10">
                  <span>Total</span>
                  <span className="gold-text">₹{(total / 100).toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-border/10 space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Cash on Delivery Available</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Free Shipping on orders above ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
