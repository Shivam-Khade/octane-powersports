"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Grid2X2, List, Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard, Product } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { BikePartsSearch } from "@/components/bike-parts-search";
import "./shop.css";

// Helper for Curated Collections
const curatedCollections = [
  { name: "Track-Ready Kits", filter: { category: "Exhausts systems" } },
  { name: "Adventure Setup", filter: { category: "Luggage" } },
  { name: "Essential Protection", filter: { category: "Protection parts" } }
];

export function ShopPageClient({ initialProducts, categories, allBrands = [] }: { initialProducts: Product[], categories: string[], allBrands?: string[] }) {
  const searchParams = useSearchParams();
  const initialBrands = searchParams.getAll("brand");
  const initialCategory = searchParams.get("category");
  const initialModel = searchParams.get("model");
  const initialQ = searchParams.get("q");

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeCategories, setActiveCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [activeBrands, setActiveBrands] = useState<string[]>(initialBrands.length > 0 ? initialBrands : []);
  const [activeModel, setActiveModel] = useState<string | null>(initialModel);

  useEffect(() => {
    // When URL search params change (i.e. user clicked a header link), 
    // completely reset the filters to match the new URL.
    const brands = searchParams.getAll("brand");
    const category = searchParams.get("category");
    const model = searchParams.get("model");
    const q = searchParams.get("q");

    setActiveBrands(brands);
    setActiveCategories(category ? [category] : []);
    setActiveModel(model);
    setSearchQuery(q || "");
    setPage(1);
  }, [searchParams]);
  const [searchQuery, setSearchQuery] = useState(initialQ || "");
  const [sortBy, setSortBy] = useState("Best Sellers");
  const [isGrid, setIsGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const filterBrands = useMemo(() => {
    const uniqueBrands = allBrands.length > 0 
      ? allBrands 
      : Array.from(new Set(initialProducts.map(p => p.brand).filter(Boolean)));
    return uniqueBrands.sort().map(b => ({ value: b, label: b }));
  }, [initialProducts, allBrands]);

  const getBucket = (str: string) => {
    const char = str.charAt(0).toUpperCase();
    if (/[A-D]/i.test(char)) return "ABCD";
    if (/[E-H]/i.test(char)) return "EFGH";
    if (/[I-L]/i.test(char)) return "IJKL";
    if (/[M-P]/i.test(char)) return "MNOP";
    if (/[Q-T]/i.test(char)) return "QRST";
    if (/[U-Z]/i.test(char)) return "UVWXYZ";
    return "#";
  };

  const groupedCategories = useMemo(() => {
    const groups: Record<string, string[]> = {};
    categories.forEach(c => {
      const bucket = getBucket(c);
      if (!groups[bucket]) groups[bucket] = [];
      groups[bucket].push(c);
    });
    return Object.keys(groups).sort().map(bucket => ({
      letter: bucket,
      items: groups[bucket].sort()
    }));
  }, [categories]);

  const groupedBrands = useMemo(() => {
    const groups: Record<string, { value: string, label: string }[]> = {};
    filterBrands.forEach(b => {
      const bucket = getBucket(b.label);
      if (!groups[bucket]) groups[bucket] = [];
      groups[bucket].push(b);
    });
    return Object.keys(groups).sort().map(bucket => ({
      letter: bucket,
      items: groups[bucket].sort((a, b) => a.label.localeCompare(b.label))
    }));
  }, [filterBrands]);

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filtering
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const safeName = p.name || "";
      const safeCategory = p.category || "";
      const safeBrand = p.brand || "";
      const compatibility = Array.isArray(p.compatibility) ? p.compatibility : 
                           (typeof p.compatibility === 'string' ? JSON.parse(p.compatibility || '[]') : []);

      const normalize = (str: string) => str.toLowerCase().replace(/[-_]/g, ' ');
      const normQuery = normalize(searchQuery);

      const matchCategory = activeCategories.length === 0 || activeCategories.some(c => normalize(c) === normalize(safeCategory));
      
      // Case-insensitive, hyphen-insensitive brand match
      const matchBrand = activeBrands.length === 0 || activeBrands.some(b => normalize(b) === normalize(safeBrand));
      
      const matchModel = !activeModel || compatibility.some((m: string) => normalize(m).includes(normalize(activeModel)) || normalize(activeModel).includes(normalize(m)));

      const matchSearch = normalize(safeName).includes(normQuery) || 
                          normalize(safeCategory).includes(normQuery) ||
                          normalize(safeBrand).includes(normQuery) ||
                          compatibility.some((m: string) => normalize(m).includes(normQuery));
                          
      return matchCategory && matchBrand && matchModel && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "Price Low-High") return a.price - b.price;
      if (sortBy === "Price High-Low") return b.price - a.price;
      if (sortBy === "Top Rated") return b.rating - a.rating;
      if (sortBy === "Latest") {
        return initialProducts.findIndex(p => p.slug === b.slug) - initialProducts.findIndex(p => p.slug === a.slug);
      }
      if (sortBy === "Best Sellers") {
        // Determine a pseudo-popularity score since we don't have strict sales data
        const popA = a.rating * 10 + (a.name.length % 10) - (a.stockCount || 5);
        const popB = b.rating * 10 + (b.name.length % 10) - (b.stockCount || 5);
        return popB - popA;
      }
      return 0;
    });
  }, [initialProducts, activeCategories, activeBrands, activeModel, searchQuery, sortBy]);

  const displayedProducts = filteredProducts.slice(0, page * itemsPerPage);
  
  // Handlers
  const toggleCategory = (cat: string) => {
    setActiveCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  };

  const toggleBrand = (brand: string) => {
    setActiveBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setPage(1);
  };

  const clearAllFilters = () => {
    setActiveCategories([]);
    setActiveBrands([]);
    setActiveModel(null);
    setSearchQuery("");
    setPage(1);
  };

  const activeFiltersCount = activeCategories.length + activeBrands.length;
  
  const isShopAll = activeCategories.length === 0 && activeBrands.length === 0;
  const showCategoryFilter = activeBrands.length > 0;
  const showBrandFilter = activeCategories.length > 0;

  return (
    <main className="shop-premium-bg">
      <section className="shop-hero">
        <div className="container">
          <h1>Shop Premium Parts</h1>
        </div>
      </section>

      <section className="shop-layout container">
        <div className="desktop-filters filters">
          <h2 className="filter-title">
            Filters
            {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
          </h2>

          {activeFiltersCount > 0 && (
            <div className="active-filters-area">
              <div className="active-chips">
                {activeCategories.map(c => (
                  <button key={c} className="filter-chip" onClick={() => toggleCategory(c)}>
                    {c} <X size={12} />
                  </button>
                ))}
                {activeBrands.map(b => (
                  <button key={b} className="filter-chip" onClick={() => toggleBrand(b)}>
                    {b} <X size={12} />
                  </button>
                ))}
              </div>
              <button className="clear-all-btn" onClick={clearAllFilters}>Clear All</button>
            </div>
          )}

          <CollapsibleFilter title="Categories" defaultOpen={true}>
            <div className="filter-checkbox-list">
              {categories.map(c => (
                <label key={c} className="custom-checkbox premium-checkbox">
                  <input type="checkbox" checked={activeCategories.includes(c)} onChange={() => toggleCategory(c)} />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">{c}</span>
                </label>
              ))}
            </div>
          </CollapsibleFilter>

          <CollapsibleFilter title="Brands" defaultOpen={true}>
            <div className="filter-checkbox-list">
              {filterBrands.map(b => (
                <label key={b.value} className="custom-checkbox premium-checkbox">
                  <input type="checkbox" checked={activeBrands.includes(b.value)} onChange={() => toggleBrand(b.value)} />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">{b.label}</span>
                </label>
              ))}
            </div>
          </CollapsibleFilter>
        </div>

        <div className="shop-results">
          <div className="shop-toolbar sticky-toolbar">
            <span className="result-count">Showing 1-{Math.min(displayedProducts.length, filteredProducts.length)} of {filteredProducts.length}</span>
            <div className="toolbar-actions">
              <button 
                className="mobile-filter-btn" 
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <SlidersHorizontal size={16} /> Filters
                {activeFiltersCount > 0 && <span className="mobile-filter-badge">{activeFiltersCount}</span>}
              </button>

              <PremiumSortDropdown value={sortBy} onChange={setSortBy} />
              <div className="view-toggles">
                <button suppressHydrationWarning className={`icon-button ${isGrid ? 'active' : ''}`} onClick={() => setIsGrid(true)} aria-label="Grid view"><Grid2X2 size={18} /></button>
                <button suppressHydrationWarning className={`icon-button ${!isGrid ? 'active' : ''}`} onClick={() => setIsGrid(false)} aria-label="List view"><List size={18} /></button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className={`shop-grid ${isGrid ? '' : 'list-view'}`}>
              {[1,2,3,4,5,6].map(i => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="no-results">
                  <h2>No products found</h2>
                  <p>Try adjusting your filters or search query.</p>
                  <button className="button outline-dark" onClick={clearAllFilters}>Clear Filters</button>
                </div>
              ) : (
                <motion.div layout className={`shop-grid ${isGrid ? '' : 'list-view'}`}>
                  <AnimatePresence>
                    {displayedProducts.map((product) => (
                      <motion.div
                        key={product.slug}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {displayedProducts.length < filteredProducts.length && (
                <div className="load-more-container">
                  <button suppressHydrationWarning className="load-more-btn" onClick={() => setPage(p => p + 1)}>
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}

          {/* Recommendations Carousel (Only visible when filtering) */}
          {!isLoading && (activeCategories.length > 0 || activeBrands.length > 0) && (
            <div className="recommendations-section mt-12 pt-8 border-t border-gray-100">
              <h3 className="section-eyebrow mb-6">You Might Also Like</h3>
              <div className="recommendations-carousel grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {initialProducts
                  .filter(p => !displayedProducts.some(dp => dp.slug === p.slug))
                  .slice(0, 5)
                  .map(p => (
                    <div key={p.slug} className="carousel-item">
                      <ProductCard product={p} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp Contact Banner */}
      <section className="container mt-12 mb-20">
        <div className="bg-[#111] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b00] rounded-full filter blur-[100px] opacity-10 pointer-events-none"></div>
          <div className="z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Can't find what you're looking for?</h2>
            <p className="text-gray-400 max-w-xl">We only list what is in our stock and ready to ship on the website. You can contact us via WhatsApp to order absolutely any other parts for your bike.</p>
          </div>
          <a href="https://wa.me/917420949711?text=Hi,%20I'm%20looking%20for%20a%20specific%20part..." target="_blank" rel="noopener noreferrer" className="z-10 shrink-0 bg-[#25D366] hover:bg-[#128C7E] !text-white px-4 py-3 md:px-8 md:py-4 text-sm md:text-base rounded-full font-bold uppercase tracking-wide flex items-center justify-center gap-2 md:gap-3 transition-colors shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] w-full md:w-auto">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Message on WhatsApp
          </a>
        </div>
      </section>
      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="mobile-filter-overlay">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="mobile-filter-backdrop" 
              onClick={() => setIsMobileFiltersOpen(false)} 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-filter-sheet"
            >
              <div className="sheet-header">
                <h3>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</h3>
                <button className="close-sheet" onClick={() => setIsMobileFiltersOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="sheet-body">
                <CollapsibleFilter title="Categories" defaultOpen={true}>
                  <div className="filter-checkbox-list">
                    {categories.map(c => (
                      <label key={c} className="premium-checkbox">
                        <input type="checkbox" checked={activeCategories.includes(c)} onChange={() => toggleCategory(c)} />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">{c}</span>
                      </label>
                    ))}
                  </div>
                </CollapsibleFilter>

                <CollapsibleFilter title="Brands" defaultOpen={true}>
                  <div className="filter-checkbox-list">
                    {filterBrands.map(b => (
                      <label key={b.value} className="premium-checkbox">
                        <input type="checkbox" checked={activeBrands.includes(b.value)} onChange={() => toggleBrand(b.value)} />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">{b.label}</span>
                      </label>
                    ))}
                  </div>
                </CollapsibleFilter>
              </div>
              <div className="sheet-footer">
                <button className="button outline-dark w-full" onClick={() => { clearAllFilters(); setIsMobileFiltersOpen(false); }}>Clear All</button>
                <button className="button primary w-full" onClick={() => setIsMobileFiltersOpen(false)}>View Results</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function CollapsibleFilter({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filter-group">
      <button suppressHydrationWarning className="filter-group-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="filter-group-content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubCollapsibleFilter({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="sub-filter-group mb-1">
      <button suppressHydrationWarning className="flex items-center justify-between w-full text-left py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-2 border-l-2 border-gray-100 ml-1.5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PremiumSortDropdown({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Latest", "Best Sellers", "Price Low-High", "Price High-Low", "Top Rated"];

  return (
    <div className="custom-sort-dropdown">
      <button 
        suppressHydrationWarning
        className="custom-sort-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <span>Sort by: {value}</span>
        <ChevronDown size={14} className={`sort-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="custom-sort-menu"
          >
            {options.map(opt => (
              <button 
                key={opt}
                className={`custom-sort-option ${value === opt ? 'selected' : ''}`}
                onClick={() => { onChange(opt); setIsOpen(false); }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
