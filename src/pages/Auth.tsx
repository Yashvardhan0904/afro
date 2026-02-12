import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@/graphql/auth";
import { setAuthToken } from "@/lib/apollo-client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [authMethod, setAuthMethod] = useState<"email" | "mobile">("email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const { login: authLogin, isAuthenticated } = useAuth();

    // Handle Google auth error redirect
    useEffect(() => {
        const error = searchParams.get("error");
        if (error === "google_auth_failed") {
            setInlineError("Google sign-in failed. Please try again or use email.");
            toast({
                title: "Google Sign-In Failed",
                description: "We couldn't complete the Google sign-in. Please try again.",
                variant: "default",
            });
        }
    }, [searchParams, toast]);

    const [login, { loading: loginLoading }] = useMutation<{
        login: {
            token: string;
            user: { id: string; email: string; name: string; role: string };
        }
    }>(LOGIN_MUTATION);

    const [register, { loading: registerLoading }] = useMutation<{
        register: {
            token: string;
            user: { id: string; email: string; name: string; role: string };
        }
    }>(REGISTER_MUTATION);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const toggleAuth = () => {
        setIsLogin(!isLogin);
        setInlineError(null);
        setShowOtp(false);
    };

    const toggleAuthMethod = () => {
        setAuthMethod(authMethod === "email" ? "mobile" : "email");
        setInlineError(null);
        setShowOtp(false);
    };

    const handleForgotClick = () => {
        if (authMethod === "email" && !email) {
            setInlineError("Please enter your email address first.");
            return;
        }
        if (authMethod === "mobile" && !mobile) {
            setInlineError("Please enter your mobile number first.");
            return;
        }
        setInlineError(null);
        setShowOtp(true);
        toast({
            title: "Verification Sent",
            description: "A 6-digit mock code has been sent for verification.",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If mobile login, just show OTP (mock flow)
        if (isLogin && authMethod === "mobile") {
            if (!mobile || mobile.length < 10) {
                setInlineError("Please enter a valid 10-digit mobile number.");
                return;
            }
            handleForgotClick();
            return;
        }

        try {
            if (isLogin) {
                const { data } = await login({
                    variables: {
                        input: { email, password }
                    }
                });

                setAuthToken(data.login.token);
                authLogin(data.login.user, data.login.token);
                setInlineError(null);
                toast({
                    title: "Welcome back to Upasanajyoti",
                    description: `The divine path awaits you, ${data.login.user.name}.`,
                });
                navigate("/");
            } else {
                const { data } = await register({
                    variables: {
                        input: { email, password, name }
                    }
                });

                setAuthToken(data.register.token);
                authLogin(data.register.user, data.register.token);
                toast({
                    title: "Sacred Journey Begun",
                    description: `Welcome to our community, ${data.register.user.name}. Your account is ready.`,
                });
                navigate("/");
            }
        } catch (error: any) {
            const errorMessage = error.message?.toLowerCase() || "";

            if (errorMessage.includes("user not found") || errorMessage.includes("no user found")) {
                setInlineError("We couldn't find your account. Destiny awaits in registration.");
                toast({
                    title: "Destiny Awaits",
                    description: "We couldn't find your account. Would you like to create your sacred profile?",
                });
                // Delay switch to registration for better UX
                setTimeout(() => setIsLogin(false), 2000);
            } else if (errorMessage.includes("invalid credentials") || errorMessage.includes("wrong password")) {
                setInlineError("The password you entered is incorrect of does not match.");
                toast({
                    title: "Verification Required",
                    description: "The credentials provided do not align with our records. Please try again.",
                    variant: "default",
                });
            } else {
                setInlineError(error.message || "An unexpected hurdle appeared.");
                toast({
                    title: "A Momentary Pause",
                    description: error.message || "We encountered a small disruption. Please try again in a moment.",
                    variant: "default",
                });
            }
        }
    };

    const handleOtpVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === 6) {
            // Mock successful OTP verification
            const mockUser = { id: "mock-1", email: email || "seeker@sacred.com", name: name || "Seeker", role: "USER" };
            authLogin(mockUser, "mock-token");
            toast({
                title: "Gateway Opened",
                description: "Mock verification successful. Welcome to your journey.",
            });
            navigate("/");
        } else {
            setInlineError("The code must be exactly 6 digits.");
        }
    };

    const loading = loginLoading || registerLoading;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 relative overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-[95%] sm:max-w-md"
                >
                    <div className="glass-card rounded-[1.5rem] md:rounded-[2rem] p-5 sm:p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-black/40">
                        {/* Logo/Name */}
                        <div className="text-center mb-6 md:mb-10">
                            <Link to="/" className="inline-block group">
                                <span className="font-serif text-xl md:text-3xl tracking-widest md:tracking-futuristic uppercase gold-text transition-all duration-500 group-hover:tracking-[0.4em]">
                                    Upasanajyoti
                                </span>
                            </Link>
                            <p className="text-muted-foreground text-[9px] md:text-[10px] uppercase tracking-luxury mt-3 md:mt-4 opacity-70">
                                {showOtp ? "Verify your identity" : isLogin ? "Welcome back to the divine" : "Begin your sacred journey"}
                            </p>
                        </div>

                        {isLogin && !showOtp && (
                            <div className="flex justify-center gap-4 mb-8">
                                <button
                                    onClick={() => setAuthMethod("email")}
                                    className={`text-[9px] uppercase tracking-widest pb-1 transition-all ${authMethod === "email" ? "text-primary border-b border-primary" : "text-muted-foreground hover:text-primary"}`}
                                >
                                    Email
                                </button>
                                <button
                                    onClick={() => setAuthMethod("mobile")}
                                    className={`text-[9px] uppercase tracking-widest pb-1 transition-all ${authMethod === "mobile" ? "text-primary border-b border-primary" : "text-muted-foreground hover:text-primary"}`}
                                >
                                    Mobile
                                </button>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {inlineError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-center"
                                >
                                    <p className="text-[10px] uppercase tracking-luxury text-primary font-medium">
                                        {inlineError}
                                    </p>
                                </motion.div>
                            )}

                            {showOtp ? (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full"
                                >
                                    <form className="space-y-4 md:space-y-6" onSubmit={handleOtpVerify}>
                                        <div className="space-y-1.5 md:space-y-2 text-center">
                                            <Label htmlFor="otp" className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">Verification Code</Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                                placeholder="000000"
                                                className="bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl h-11 md:h-12 text-center text-lg tracking-[0.5em] font-serif"
                                                required
                                            />
                                            <p className="text-[8px] text-muted-foreground uppercase tracking-widest mt-2">Enter any 6 digits for mock access</p>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-11 md:h-12 rounded-xl text-[9px] md:text-[10px] uppercase tracking-luxury font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                        >
                                            Verify Gateway
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setShowOtp(false)}
                                            className="w-full text-center text-[9px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Back to Login
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={isLogin ? "login" : "signup"}
                                    initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="w-full"
                                >
                                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                        {!isLogin && (
                                            <div className="space-y-1.5 md:space-y-2">
                                                <Label htmlFor="name" className="text-[9px] md:text-[10px] uppercase tracking-widest ml-1 text-muted-foreground">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(e.target.value);
                                                        setInlineError(null);
                                                    }}
                                                    placeholder="Enter your name"
                                                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl h-11 md:h-12 text-sm"
                                                    required
                                                />
                                            </div>
                                        )}

                                        {isLogin && authMethod === "mobile" ? (
                                            <div className="space-y-1.5 md:space-y-2">
                                                <Label htmlFor="mobile" className="text-[9px] md:text-[10px] uppercase tracking-widest ml-1 text-muted-foreground">Mobile Number</Label>
                                                <div className="flex gap-2">
                                                    <div className="flex items-center justify-center bg-background/50 border border-border/50 rounded-xl px-3 text-xs text-muted-foreground">
                                                        +91
                                                    </div>
                                                    <Input
                                                        id="mobile"
                                                        type="tel"
                                                        value={mobile}
                                                        onChange={(e) => {
                                                            setMobile(e.target.value.replace(/\D/g, ""));
                                                            setInlineError(null);
                                                        }}
                                                        placeholder="9876543210"
                                                        className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl h-11 md:h-12 text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5 md:space-y-2">
                                                <Label htmlFor="email" className="text-[9px] md:text-[10px] uppercase tracking-widest ml-1 text-muted-foreground">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        setInlineError(null);
                                                    }}
                                                    placeholder="name@luxury.com"
                                                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl h-11 md:h-12 text-sm"
                                                    required
                                                />
                                            </div>
                                        )}

                                        {(!isLogin || authMethod === "email") && (
                                            <div className="space-y-1.5 md:space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <Label htmlFor="password" className="text-[9px] md:text-[10px] uppercase tracking-widest ml-1 text-muted-foreground">Password</Label>
                                                    {isLogin && (
                                                        <button
                                                            type="button"
                                                            onClick={handleForgotClick}
                                                            className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                                                        >
                                                            Forgot?
                                                        </button>
                                                    )}
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => {
                                                        setPassword(e.target.value);
                                                        setInlineError(null);
                                                    }}
                                                    placeholder="••••••••"
                                                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all rounded-xl h-11 md:h-12 text-sm"
                                                    required
                                                />
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-11 md:h-12 rounded-xl text-[9px] md:text-[10px] uppercase tracking-luxury font-bold mt-2 bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                        >
                                            {loading ? "Please wait..." : (isLogin ? (authMethod === "mobile" ? "Continue with Mobile" : "Sign In") : "Create Account")}
                                        </Button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative my-8 md:my-10">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/30" />
                            </div>
                            <div className="relative flex justify-center text-[8px] uppercase tracking-[0.3em]">
                                <span className="bg-transparent px-4 text-muted-foreground">Or</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-11 md:h-12 rounded-xl text-[9px] md:text-[10px] uppercase tracking-luxury border-border/50 hover:bg-primary/5 transition-all group"
                            onClick={() => {
                                const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_GRAPHQL_URL?.replace('/graphql', '') || 'http://localhost:4000';
                                window.location.href = `${apiUrl}/auth/google`;
                            }}
                        >
                            <svg className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                        <p className="mt-8 md:mt-10 text-center text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">
                            {isLogin ? "New here?" : "Already a seeker?"}{" "}
                            <button
                                type="button"
                                onClick={toggleAuth}
                                className="text-primary hover:opacity-70 transition-opacity font-bold ml-1"
                            >
                                {isLogin ? "Join now" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
