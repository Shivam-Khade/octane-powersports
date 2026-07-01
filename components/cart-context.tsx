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
  packageId?: number;
  packageName?: string;
  packageDiscount?: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  addPackageToCart: (pkg: any) => void;
  removeFromCart: (id: string, warnPackage?: boolean) => void;
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
          borderLeft: "4px solid #22c55e",
          borderRadius: "8px",
          padding: "16px 20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          maxWidth: "calc(100vw - 32px)",
          transition: "all 0.2s ease",
          opacity: t.visible ? 1 : 0,
          transform: t.visible ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)",
          pointerEvents: "auto",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a1a"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#111111"}
      >
        <div style={{ background: '#22c55e', borderRadius: '50%', minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name} added!</span>
          <span style={{ fontSize: '11px', color: '#22c55e', marginTop: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>View Cart & Checkout &rarr;</span>
        </div>
      </div>
    ), { duration: 4000 });
  };

  const addPackageToCart = (pkg: any) => {
    fetch('/api/packages/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: pkg.id, action: 'adds_to_cart' })
    }).catch(() => {});

    setCartItems((prevItems) => {
      let newItems = [...prevItems];
      
      const discountPerItem = pkg.discount_type === 'percentage'
        ? pkg.discount_value // It's a percentage, applied per item or overall total. To keep it simple, we just store it.
        : pkg.discount_value / pkg.products.length; // Fixed amount divided equally, or we just store the total package discount.

      pkg.products.forEach((product: any) => {
        // If product already in cart, update it to be part of the package or add separately if it's cleaner. 
        // For simplicity, we just add it and overwrite if it was individual.
        const existingIndex = newItems.findIndex((item) => item.id === product.slug);
        const itemToAdd = {
          id: product.slug,
          name: product.name,
          seller: product.brand || "Octane Powersports",
          price: product.price,
          quantity: 1, // packages are typically bought as 1 unit of bundle
          image: product.image,
          packageId: pkg.id,
          packageName: pkg.name,
          packageDiscount: pkg.discount_type === 'percentage' ? (product.price * pkg.discount_value / 100) : (pkg.discount_value / pkg.products.length)
        };

        if (existingIndex >= 0) {
          newItems[existingIndex] = itemToAdd;
        } else {
          newItems.push(itemToAdd);
        }
      });

      localStorage.setItem(cartKey, JSON.stringify(newItems));
      return newItems;
    });

    toast.success(`${pkg.name} added to cart!`);
    router.push('/checkout');
  };

  const removeFromCart = (id: string, warnPackage: boolean = false) => {
    let triggeredWarning = false;

    setCartItems((prev) => {
      const itemToRemove = prev.find(i => i.id === id);
      let newItems = prev.filter((item) => item.id !== id);

      if (itemToRemove?.packageId) {
        // If it was part of a package, remove the package association from remaining items of this package
        newItems = newItems.map(item => {
          if (item.packageId === itemToRemove.packageId) {
            const { packageId, packageName, packageDiscount, ...rest } = item;
            return rest;
          }
          return item;
        });
        
        if (warnPackage) {
          triggeredWarning = true;
        }
      }

      localStorage.setItem(cartKey, JSON.stringify(newItems));
      return newItems;
    });

    if (triggeredWarning) {
      toast('Package discount removed because an item was removed.', { icon: '⚠️' });
    }
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
      <CartContext.Provider value={{ cartItems: [], addToCart, addPackageToCart, removeFromCart, updateQty, clearCart, totalItems: 0 }}>
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, addPackageToCart, removeFromCart, updateQty, clearCart, totalItems }}>
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
