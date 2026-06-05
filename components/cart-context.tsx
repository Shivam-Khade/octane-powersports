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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("octane_cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
    setMounted(true);
  }, []);

  const updateCart = (newItems: CartItem[]) => {
    setCartItems(newItems);
    localStorage.setItem("octane_cart", JSON.stringify(newItems));
  };

  const addToCart = (product: any, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.slug);
      let newItems;
      if (existing) {
        newItems = prevItems.map((item) =>
          item.id === product.slug ? { ...item, quantity: item.quantity + quantity } : item
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
      localStorage.setItem("octane_cart", JSON.stringify(newItems));
      return newItems;
    });
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: "#111111",
        color: "#ffffff",
        border: "1px solid #2a2a2a",
        borderLeft: "4px solid #ff6b00",
        borderRadius: "8px",
        padding: "16px 20px",
        fontSize: "14px",
        fontWeight: "600",
        boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
        letterSpacing: "0.02em"
      },
      iconTheme: {
        primary: "#ff6b00",
        secondary: "#111111",
      },
      duration: 3000,
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id);
      localStorage.setItem("octane_cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) => {
      const newItems = prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem("octane_cart", JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("octane_cart");
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
