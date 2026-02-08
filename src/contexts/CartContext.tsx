import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number; // in paise
  quantity: number;
  image: string;
  category: string;
  description?: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  saveToWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'upasanajyoti_cart';
const WISHLIST_STORAGE_KEY = 'upasanajyoti_wishlist';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      if (savedWishlist) {
        setSavedItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(savedItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [savedItems]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.productId === product.productId);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      
      // Add new item
      return [...prev, { ...product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const saveToWishlist = (id: string) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      removeFromCart(id);
      setSavedItems((prev) => {
        // Check if already in wishlist
        if (prev.find((i) => i.productId === item.productId)) {
          return prev;
        }
        return [...prev, item];
      });
    }
  };

  const moveToCart = (id: string) => {
    const item = savedItems.find((item) => item.id === id);
    if (item) {
      setSavedItems((prev) => prev.filter((i) => i.id !== id));
      addToCart(item, item.quantity);
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        savedItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveToWishlist,
        moveToCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
