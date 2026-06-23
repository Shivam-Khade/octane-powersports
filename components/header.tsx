"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, User, ShoppingBag, ChevronDown, X, LogOut, MapPin, Package, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLoginModal } from "./login-context";
import { useProfileModal } from "./profile-context";
import { useCart } from "./cart-context";
import "./header.css";

const getBrandGroups = (brands: string[]) => {
  const groups: Record<string, string[]> = {};
  brands.forEach(b => {
    const letter = b.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    if (!groups[letter].includes(b)) {
      groups[letter].push(b);
    }
  });
  return Object.keys(groups).sort().map(letter => ({
    letter,
    brands: groups[letter].sort()
  }));
};



export function Header({ session, categories = [], brands = [] }: { session: any, categories?: string[], brands?: string[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTypeOpen, setMobileTypeOpen] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false);
  const [expandedBrandLetter, setExpandedBrandLetter] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { openModal } = useLoginModal();
  const { openModal: openProfileModal } = useProfileModal();
  const { totalItems } = useCart();

  useEffect(() => setIsMounted(true), []);

  const isActiveSession = isMounted && typeof sessionStorage !== 'undefined' && sessionStorage.getItem("octane_session_active") === "true";
  const effectiveSession = isActiveSession ? session : null;


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
      <header className={`site-header${scrolled ? " is-scrolled" : ""}${pathname?.startsWith('/blog') ? " is-journal" : ""}`}>
        <div className="nav-shell">
          <Link href="/" className="logo" aria-label="Octane Powersports home">
            <img src="/logo.png" alt="Octane Powersports" style={{ height: '44px', width: 'auto', objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg) brightness(1.2)' }} />
          </Link>

          <nav className="main-nav" aria-label="Primary navigation">
            <Link href="/" className={`nav-link ${pathname === '/' ? '!text-[#ff6b00]' : ''}`}>Home</Link>
            <Link href="/shop" className={`nav-link ${pathname === '/shop' ? '!text-[#ff6b00]' : ''}`}>Shop</Link>
            <div className="mega-trigger">
              <button suppressHydrationWarning className="nav-link nav-btn">
                Shop By Category <ChevronDown size={13} className="nav-chevron" />
              </button>
              <div className="mega-menu types-menu">
                <div className="mega-type-grid">
                  {categories.map((cat) => (
                    <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`} className="type-item">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mega-trigger">
              <button suppressHydrationWarning className="nav-link nav-btn">
                Shop By Brand <ChevronDown size={13} className="nav-chevron" />
              </button>
              <div className="mega-menu brands-menu">
                <div className="mega-brand-grid">
                  {getBrandGroups(brands).map(group => (
                    <div key={group.letter} className="brand-group">
                      <h4 className="brand-letter">{group.letter}</h4>
                      <div className="brand-links">
                        {group.brands.map(brand => (
                          <Link key={brand} href={`/shop?brand=${encodeURIComponent(brand)}`} className="brand-item">
                            {brand}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/blog" className={`nav-link ${pathname?.startsWith('/blog') ? '!text-[#ff6b00]' : ''}`}>Blog</Link>

            {effectiveSession ? (
              <>
                <Link href="/service-booking" className={`nav-link ${pathname?.startsWith('/service-booking') ? '!text-[#ff6b00]' : ''}`}>Service Booking</Link>
                <Link href="/orders" className={`nav-link ${pathname?.startsWith('/orders') ? '!text-[#ff6b00]' : ''}`}>Orders</Link>
              </>
            ) : (
              <Link href="/service-booking" className={`nav-link ${pathname?.startsWith('/service-booking') ? '!text-[#ff6b00]' : ''}`}>Service</Link>
            )}
          </nav>

          <div className="nav-actions">
            {/* Desktop Search */}
            <div ref={searchContainerRef} className={`nav-search-wrapper desktop-search ${searchOpen ? "open" : ""}`}>
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
                  suppressHydrationWarning
                />
              </form>
            </div>

            {/* Mobile Search Trigger */}
            <button
              suppressHydrationWarning
              className="search-trigger-btn mobile-search-trigger"
              aria-label="Search"
              onClick={(e) => {
                e.preventDefault();
                setSearchOpen(!searchOpen);
              }}
            >
              <Search size={18} />
            </button>

            {effectiveSession ? (
              <>
                <div className="relative group">
                  {effectiveSession.user?.role === 'admin' ? (
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
                        <p className="text-sm font-semibold text-white truncate">{effectiveSession.user?.name || effectiveSession.user?.email}</p>
                      </div>
                      {effectiveSession.user?.role === 'admin' && (
                        <div className="py-2">
                          <Link href="/admin" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium !text-[#ff6b00] hover:!text-white hover:bg-[#ff6b00] transition-colors">
                            <Shield size={16} /> Admin Dashboard
                          </Link>
                        </div>
                      )}
                      <div className="border-t border-gray-800 p-2">
                        <button onClick={() => {
                          localStorage.removeItem("octane_cart");
                          sessionStorage.removeItem("octane_session_active");
                          signOut({ callbackUrl: '/' });
                        }} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:!text-white hover:bg-red-500/80 rounded-lg transition-colors text-left">
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("octane_cart");
                    sessionStorage.removeItem("octane_session_active");
                    signOut({ callbackUrl: '/' });
                  }}
                  className="nav-icon-btn hidden md:flex"
                  aria-label="Log Out"
                  title="Log Out"
                >
                  <LogOut size={18} className="text-red-500 hover:text-red-600 transition-colors" />
                </button>
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

        {/* Global Search Dropdown Row (Mobile Only) */}
        <div className={`global-search-container mobile-search-dropdown ${searchOpen ? "open" : ""}`}>
          <form onSubmit={handleSearch} className="global-search-inner">
            <Search size={20} className="global-search-icon" />
            <input
              autoFocus={searchOpen}
              type="text"
              placeholder="Search for premium parts, brands, or categories..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="global-search-input"
              suppressHydrationWarning
            />
            <button type="button" className="global-search-close" onClick={() => setSearchOpen(false)}>
              <X size={20} />
            </button>
          </form>
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
              <img src="/logo.png" alt="Octane Powersports" style={{ height: '38px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <nav className="mobile-nav">
              <Link href="/" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/shop" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Shop</Link>
              <div className="mobile-accordion">
                <button
                  className="mobile-nav-link w-full text-left flex items-center justify-between"
                  onClick={() => setMobileTypeOpen(!mobileTypeOpen)}
                >
                  <span>Shop By Category</span>
                  <ChevronDown size={18} className={`transition-transform shrink-0 ${mobileTypeOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileTypeOpen && (
                  <div className="py-3 pl-4 border-l border-white/10 ml-3 mt-1">
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat}
                          href={`/shop?category=${encodeURIComponent(cat)}`}
                          className="mobile-cat-grid-item"
                          onClick={() => setMobileOpen(false)}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mobile-accordion">
                <button
                  className="mobile-nav-link w-full text-left flex items-center justify-between"
                  onClick={() => setMobileBrandOpen(!mobileBrandOpen)}
                >
                  <span>Shop By Brand</span>
                  <ChevronDown size={18} className={`transition-transform shrink-0 ${mobileBrandOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileBrandOpen && (
                  <div className="mobile-accordion-content">
                    {getBrandGroups(brands).map(group => (
                      <div key={group.letter} className="mobile-brand-group mb-2">
                        <button
                          className="mobile-brand-letter flex items-center justify-between w-full font-bold text-gray-300 py-2"
                          onClick={() => setExpandedBrandLetter(expandedBrandLetter === group.letter ? null : group.letter)}
                        >
                          <span>{group.letter}</span>
                          <ChevronDown size={14} className={`transition-transform ${expandedBrandLetter === group.letter ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedBrandLetter === group.letter && (
                          <div className="mobile-brand-sub-list flex flex-col pl-4 border-l border-gray-800/50 ml-1.5 mt-1">
                            {group.brands.map(brand => (
                              <Link key={brand} href={`/shop?brand=${encodeURIComponent(brand)}`} className="mobile-sub-link" onClick={() => setMobileOpen(false)}>
                                {brand}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/blog" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link href="/service-booking" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Service Booking</Link>
              {effectiveSession && (
                <button
                  onClick={() => {
                    localStorage.removeItem("octane_cart");
                    sessionStorage.removeItem("octane_session_active");
                    signOut({ callbackUrl: '/' });
                    setMobileOpen(false);
                  }}
                  className="mobile-nav-link text-left text-red-500 w-full"
                >
                  Log Out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
