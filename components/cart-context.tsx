"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export type CartItem = {
  id: string; // we'll use product slug as ID
  name: string;
  seller: string;
  price: number;
  quantity: number;
  image: string;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

import { useRouter } from "next/navigation";

export function CartProvider({ children, session }: { children: React.ReactNode, session?: any }) {
  const router = useRouter();
  const cartKey = "octane_cart" + (session?.user?.email ? "_" + session.user.email : "");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    } else {
      setCartItems([]);
    }
    setMounted(true);
  }, [cartKey]);

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem(cartKey, JSON.stringify(newItems));
  };

  const addToCart = (product: any, quantity: number = 1) => {
    // Fire and forget cart analytics tracker
    fetch('/api/track/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id || product.slug })
    }).catch(() => {});

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.slug);
      let newItems;
      if (existing) {
        newItems = prevItems.map((item) =>
          item.id === product.slug ? { ...item, quantity: Math.min(10, item.quantity + quantity) } : item
        );
      } else {
        newItems = [
          ...prevItems,
          {
            id: product.slug,
            name: product.name,
            seller: product.brand || "Octane Powersports",
            price: product.price,
            quantity: quantity,
            image: product.image,
          },
        ];
      }
      localStorage.setItem(cartKey, JSON.stringify(newItems));
      
      return newItems;
    });
    toast.custom((t) => (
      <div
        onClick={() => {
          toast.dismiss(t.id);
          router.push('/checkout');
        }}
        style={{
          background: "#111111",
          color: "#ffffff",
          border: "1px solid #2a2a2a",
          borderLeft: "4px solid #ff6b00",
          borderRadius: "8px",
          padding: "16px 20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.2s ease",
          opacity: t.visible ? 1 : 0,
          transform: t.visible ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)",
          pointerEvents: "auto",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a1a"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#111111"}
      >
        <div style={{ background: '#ff6b00', borderRadius: '50%', minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "0.02em" }}>{product.name} added!</span>
          <span style={{ fontSize: '11px', color: '#ff6b00', marginTop: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>View Cart & Checkout &rarr;</span>
        </div>
      </div>
    ), { duration: 4000 });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id);
      localStorage.setItem(cartKey, JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) => {
      const newItems = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, Math.min(10, item.quantity + delta));
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem(cartKey, JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(cartKey);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) {
    return (
      <CartContext.Provider value={{ cartItems: [], addToCart, removeFromCart, updateQty, clearCart, totalItems: 0 }}>
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
