"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, X, LogIn } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

// ── Login-required modal (shown inline, no redirect) ──────────────────────────
function LoginRequiredModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 space-y-5 text-center animate-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="inline-flex w-16 h-16 rounded-full bg-[#e8f5e9] text-[#2d6a4f] items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-[#1e2521]">Login Required</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Please log in to add items to your cart and enjoy a personalised shopping experience.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            Login / Sign Up
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>

      {/* Close X */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 hover:text-stone-800 shadow cursor-pointer transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch {}
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // ── Check if user is logged in ──────────────────────────────────────────────
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) return false;
      const data = await res.json();
      return !!data.authenticated;
    } catch {
      return false;
    }
  }, []);

  // ── addToCart: gate behind auth check ──────────────────────────────────────
  const addToCart = useCallback(async (item: CartItem) => {
    const loggedIn = await checkSession();
    if (!loggedIn) {
      setShowLoginModal(true);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => Number(c.id) === Number(item.id));
      if (existingItem) {
        return prevCart.map((c) =>
          Number(c.id) === Number(item.id) ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { ...item, id: Number(item.id), quantity: item.quantity || 1 }];
    });
  }, [checkSession]);

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
  };

  const clearCart = () => {
    setCart([]);
    try { localStorage.removeItem("cart"); } catch {}
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        Number(item.id) === Number(id) ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleGoLogin = () => {
    setShowLoginModal(false);
    router.push("/auth");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}

      {/* Global login-required modal rendered at root level */}
      {showLoginModal && (
        <LoginRequiredModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleGoLogin}
        />
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
