"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, User, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import { categories, brands } from "@/lib/data";
import "./header.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-shell">
        <Link href="/" className="logo" aria-label="Octane Powersports home">
          <span>OCTANE</span>
          <small>POWERSPORTS</small>
        </Link>

        <nav className="main-nav" aria-label="Primary navigation">
          <Link href="/shop">Shop</Link>
          <div className="mega-trigger">
            <button suppressHydrationWarning>
              Categories <ChevronDown size={14} />
            </button>
            <div className="mega-menu">
              <div>
                <p className="mega-title">Shop by system</p>
                <div className="mega-grid">
                  {categories.map((category) => (
                    <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`}>
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mega-feature">
                <p>Rider edits</p>
                <h3>Performance, protection and race-ready kits curated by superbike type.</h3>
                <Link href="/shop" className="button">Build Your Setup</Link>
              </div>
            </div>
          </div>
          <Link href="/shop#brands">Brands</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/service-booking">Service Booking</Link>
        </nav>

        <div className="nav-actions">
          <button suppressHydrationWarning className="icon-button" aria-label="Search"><Search size={18} /></button>
          <Link className="icon-button" href="/account" aria-label="Account"><User size={18} /></Link>
          <Link className="icon-button" href="/account#wishlist" aria-label="Wishlist"><Heart size={18} /></Link>
          <Link className="icon-button cart-dot" href="/checkout" aria-label="Cart"><ShoppingBag size={18} /></Link>
          <button suppressHydrationWarning className="icon-button mobile-menu" aria-label="Open menu"><Menu size={20} /></button>
        </div>
      </div>
    </header>
  );
}
