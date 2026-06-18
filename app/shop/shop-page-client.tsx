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

export function ShopPageClient({ initialProducts, categories }: { initialProducts: Product[], categories: string[] }) {
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
    const uniqueBrands = Array.from(new Set(initialProducts.map(p => p.brand).filter(Boolean)));
    return uniqueBrands.sort().map(b => ({ value: b, label: b }));
  }, [initialProducts]);

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
      return 0; // "Best Sellers" default
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
          <AnimatePresence>
            <BikePartsSearch variant="horizontal" />
          </AnimatePresence>
        </div>
      </section>

      <section className="shop-layout container no-sidebar">



        <div className="shop-results">
          <div className="shop-toolbar sticky-toolbar">
            <span className="result-count">Showing 1-{Math.min(displayedProducts.length, filteredProducts.length)} of {filteredProducts.length}</span>
            <div className="toolbar-actions">

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

          {/* Recommendations Carousel */}
          {!isLoading && (
            <div className="recommendations-section">
              <h3 className="section-eyebrow">You Might Like</h3>
              <div className="recommendations-carousel">
                {initialProducts.slice(0, 3).map(p => (
                  <div key={p.slug} className="carousel-item">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function CollapsibleFilter({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filter-group">
      <button className="filter-group-header" onClick={() => setIsOpen(!isOpen)}>
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

function PremiumSortDropdown({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Latest", "Best Sellers", "Price Low-High", "Price High-Low", "Top Rated"];

  return (
    <div className="custom-sort-dropdown">
      <button 
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
