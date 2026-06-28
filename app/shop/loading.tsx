import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import "./shop.css";

export default function ShopLoading() {
  return (
    <main className="shop-premium-bg">
      <section className="shop-hero">
        <div className="container">
          <h1>Shop Premium Parts</h1>
        </div>
      </section>

      <section className="shop-layout container">
        <div className="desktop-filters filters" style={{ opacity: 0.6 }}>
          <h2 className="filter-title">Filters</h2>
          
          <div className="filter-group">
            <button className="filter-group-header">
              <h3>Categories</h3>
              <ChevronDown size={16} />
            </button>
            <div className="filter-group-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ width: '80%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              ))}
            </div>
          </div>
          
          <div className="filter-group mt-8">
            <button className="filter-group-header">
              <h3>Brands</h3>
              <ChevronDown size={16} />
            </button>
            <div className="filter-group-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} style={{ width: '85%', height: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
              ))}
            </div>
          </div>
        </div>

        <div className="shop-results">
          <div className="shop-toolbar sticky-toolbar" style={{ opacity: 0.8 }}>
            <span className="result-count" style={{ width: '120px', height: '16px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}></span>
            <div className="toolbar-actions">
              <button className="mobile-filter-btn" disabled>
                <SlidersHorizontal size={16} /> Filters
              </button>
              <div className="custom-sort-dropdown" style={{ width: '150px', height: '36px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}></div>
            </div>
          </div>

          <div className="shop-grid">
            {[1,2,3,4,5,6,7,8,9].map(i => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
