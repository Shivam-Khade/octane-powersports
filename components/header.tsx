"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, User, ShoppingBag, ChevronDown, X } from "lucide-react";
import { brands } from "@/lib/data";
import "./header.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchText.trim())}`);
      setSearchOpen(false);
      setSearchText("");
    }
  };

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
            <div ref={searchContainerRef} className={`nav-search-wrapper ${searchOpen ? "open" : ""}`}>
              <button 
                suppressHydrationWarning 
                className="search-trigger-btn" 
                aria-label="Search"
                onClick={(e) => {
                  e.preventDefault();
                  if (searchOpen && searchText.trim()) {
                    handleSearch(e as any);
                  } else {
                    setSearchOpen(!searchOpen);
                  }
                }}
              >
                <Search size={18} />
              </button>
              <form onSubmit={handleSearch} className="nav-search-form">
                <input 
                  autoFocus={searchOpen}
                  type="text" 
                  placeholder="Search products..." 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="nav-search-input"
                />
              </form>
            </div>
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
