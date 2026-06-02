"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { products } from "@/lib/data";
import "./cart-drawer.css";

export function CartDrawer() {
  const item = products[0];

  return (
    <aside className="cart-drawer" aria-label="Slide cart preview">
      <div className="cart-head">
        <strong>Cart</strong>
        <button suppressHydrationWarning className="icon-button" aria-label="Close cart"><X size={18} /></button>
      </div>
      <div className="cart-line">
        <Image src={item.image} alt={item.name} width={78} height={78} />
        <div>
          <strong>{item.name}</strong>
          <p>$1,199 · Qty 1</p>
        </div>
      </div>
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
