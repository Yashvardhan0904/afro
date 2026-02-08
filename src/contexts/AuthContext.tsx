import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useToast } from '@/hooks/use-toast';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'upasanajyoti_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const { user: savedUser, token: savedToken } = JSON.parse(savedAuth);
        setUser(savedUser);
        setToken(savedToken);
      }
    } catch (error) {
      console.error('Error loading auth from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData, token }));
    } catch (error) {
      console.error('Error saving auth to localStorage:', error);
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
      toast({
        title: "Peace be with you",
        description: "You have been successfully logged out of your sacred space.",
      });
    } catch (error) {
      console.error('Logout mutation error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
