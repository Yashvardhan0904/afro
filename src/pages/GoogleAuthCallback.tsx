import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { setAuthToken } from "@/lib/apollo-client";
import { useToast } from "@/hooks/use-toast";

/**
 * This page handles the redirect from the backend after Google OAuth.
 * The backend redirects here with token and user info in the URL params.
 */
export default function GoogleAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const role = searchParams.get("role");
    const error = searchParams.get("error");

    if (error) {
      toast({
        title: "Authentication Failed",
        description: "Google sign-in was unsuccessful. Please try again.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (token && userId && email) {
      // Store the token and user info
      setAuthToken(token);
      login(
        {
          id: userId,
          email,
          name: name || email.split("@")[0],
          role: role || "USER",
        },
        token
      );

      toast({
        title: "Welcome to Upasanajyoti",
        description: `Signed in successfully${name ? `, ${name}` : ""}.`,
      });

      navigate("/");
    } else {
      toast({
        title: "Authentication Error",
        description: "Missing authentication data. Please try again.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [searchParams, navigate, login, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Completing sign-in...
        </p>
      </div>
    </div>
  );
}
