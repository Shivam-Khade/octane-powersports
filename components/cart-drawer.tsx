"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import "./cart-drawer.css";

export function CartDrawer() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  const item = products.length > 0 ? products[0] : null;

  return (
    <aside className="cart-drawer" aria-label="Slide cart preview">
      <div className="cart-head">
        <strong>Cart</strong>
        <button suppressHydrationWarning className="icon-button" aria-label="Close cart"><X size={18} /></button>
      </div>
      {item && (
        <div className="cart-line">
          {item.image ? (
            <Image src={item.image} alt={item.name} width={78} height={78} />
          ) : (
            <div style={{ width: 78, height: 78, backgroundColor: '#f3f4f6', borderRadius: 8, flexShrink: 0 }} />
          )}
          <div>
            <strong>{item.name}</strong>
            <p>$1,199 · Qty 1</p>
          </div>
        </div>
      )}
      <input suppressHydrationWarning aria-label="Coupon code" placeholder="Coupon code" />
      <div className="ship-estimate">
        <span>Shipping estimate</span>
        <strong>Free over $500</strong>
      </div>
      <div className="cart-total">
        <span>Subtotal</span>
        <strong>$1,199</strong>
      </div>
      <Link href="/checkout" className="button">Checkout</Link>
    </aside>
  );
}
