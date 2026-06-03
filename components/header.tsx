"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, User, ShoppingBag, ChevronDown, X } from "lucide-react";
import { brands } from "@/lib/data";
import "./header.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="nav-shell">
          <Link href="/" className="logo" aria-label="Octane Powersports home">
            <span className="logo-main">OCTANE</span>
            <small className="logo-sub">POWERSPORTS</small>
          </Link>

          <nav className="main-nav" aria-label="Primary navigation">
            <Link href="/shop" className="nav-link">Shop</Link>

            <div className="mega-trigger">
              <button suppressHydrationWarning className="nav-link nav-btn">
                Brands <ChevronDown size={13} className="nav-chevron" />
              </button>
              <div className="mega-menu brands-menu">
                <div className="brands-grid">
                  {brands.map((brand) => (
                    <Link key={brand} href={`/shop?brand=${encodeURIComponent(brand)}`} className="brand-item">
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/blog" className="nav-link">Journal</Link>
            <Link href="/service-booking" className="nav-link">Service</Link>
          </nav>

          <div className="nav-actions">
            <button suppressHydrationWarning className="nav-icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            <Link className="nav-icon-btn" href="/account" aria-label="Account">
              <User size={18} />
            </Link>
            <Link className="nav-icon-btn cart-btn" href="/checkout" aria-label="Cart">
              <ShoppingBag size={18} />
              <span className="cart-count" aria-label="0 items in cart">0</span>
            </Link>
            <button
              suppressHydrationWarning
              className="mobile-menu-btn"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-bg" onClick={() => setMobileOpen(false)} />
          <div className="mobile-drawer-panel">
            <button
              className="mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
            <Link href="/" className="logo mobile-logo" onClick={() => setMobileOpen(false)}>
              <span className="logo-main">OCTANE</span>
              <small className="logo-sub">POWERSPORTS</small>
            </Link>
            <nav className="mobile-nav">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/blog", label: "Journal" },
                { href: "/service-booking", label: "Service Booking" },
                { href: "/contact", label: "Contact" },
                { href: "/account", label: "My Account" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mobile-brands">
              <p className="mega-eyebrow">Brands</p>
              <div className="mobile-brands-grid">
                {brands.slice(0, 6).map((b) => (
                  <Link key={b} href={`/shop?brand=${encodeURIComponent(b)}`} className="mobile-brand-chip" onClick={() => setMobileOpen(false)}>
                    {b}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
