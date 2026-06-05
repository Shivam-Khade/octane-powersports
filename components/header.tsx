"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, User, ShoppingBag, ChevronDown, X, LogOut, MapPin, Package, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { brands } from "@/lib/data";
import { useLoginModal } from "./login-context";
import { useProfileModal } from "./profile-context";
import { useCart } from "./cart-context";
import "./header.css";

export function Header({ session }: { session: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { openModal } = useLoginModal();
  const { openModal: openProfileModal } = useProfileModal();
  const { totalItems } = useCart();



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

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="nav-shell">
          <Link href="/" className="logo" aria-label="Octane Powersports home">
            <span className="logo-main">OCTANE</span>
            <small className="logo-sub">POWERSPORTS</small>
          </Link>

          <nav className="main-nav" aria-label="Primary navigation">
            <Link href="/shop" className={`nav-link ${pathname?.startsWith('/shop') ? '!text-[#ff6b00]' : ''}`}>Shop</Link>

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
            <Link href="/blog" className={`nav-link ${pathname?.startsWith('/blog') ? '!text-[#ff6b00]' : ''}`}>Journal</Link>
            
            {session ? (
              <>
                <Link href="/service-booking" className={`nav-link ${pathname?.startsWith('/service-booking') ? '!text-[#ff6b00]' : ''}`}>Service Booking</Link>
                <Link href="/orders" className={`nav-link ${pathname?.startsWith('/orders') ? '!text-[#ff6b00]' : ''}`}>Orders</Link>
              </>
            ) : (
              <Link href="/service-booking" className={`nav-link ${pathname?.startsWith('/service-booking') ? '!text-[#ff6b00]' : ''}`}>Service</Link>
            )}
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
            
            {session ? (
              <>
                <div className="relative group">
                  {session.user?.role === 'admin' ? (
                    <Link className="nav-icon-btn peer" href="/admin" aria-label="Account">
                      <User size={18} className="text-[#ff6b00]" />
                    </Link>
                  ) : (
                    <button className="nav-icon-btn peer" onClick={openProfileModal} aria-label="Account">
                      <User size={18} className="text-[#ff6b00]" />
                    </button>
                  )}
                  <div className="absolute right-0 top-full pt-3 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="bg-[#0a0a0a] border border-gray-800 shadow-2xl rounded-xl overflow-hidden flex flex-col">
                      <div className="px-5 py-4 border-b border-gray-800 bg-[#141414]">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{session.user?.name || session.user?.email}</p>
                      </div>
                      {session.user?.role === 'admin' && (
                        <div className="py-2">
                          <Link href="/admin" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium !text-[#ff6b00] hover:!text-white hover:bg-[#ff6b00] transition-colors">
                            <Shield size={16} /> Admin Dashboard
                          </Link>
                        </div>
                      )}
                      <div className="border-t border-gray-800 p-2">
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:!text-white hover:bg-red-500/80 rounded-lg transition-colors text-left">
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button className="nav-icon-btn" onClick={openModal} aria-label="Login">
                <User size={18} />
              </button>
            )}

            <Link className="nav-icon-btn cart-btn" href="/checkout" aria-label="Cart">
              <ShoppingBag size={18} />
              <span className="cart-count" aria-label={`${totalItems} items in cart`}>{totalItems}</span>
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
              <Link href="/shop" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Shop</Link>
              <Link href="/blog" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Journal</Link>
              <Link href="/service-booking" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Service Booking</Link>
              <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Contact</Link>
              
              {session ? (
                <>
                  {session.user?.role === 'admin' ? (
                    <Link href="/admin" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                      Admin Dashboard
                    </Link>
                  ) : (
                    <button 
                      className="mobile-nav-link text-left" 
                      onClick={() => { setMobileOpen(false); openProfileModal(); }}
                    >
                      Profile Details
                    </button>
                  )}
                  <button 
                    className="mobile-nav-link text-left text-red-500" 
                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }); }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button 
                  className="mobile-nav-link text-left" 
                  onClick={() => { setMobileOpen(false); openModal(); }}
                >
                  Log In / Sign Up
                </button>
              )}
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
