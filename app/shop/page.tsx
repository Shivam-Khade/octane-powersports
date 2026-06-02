import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react";
import { brands, categories, products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import "./shop.css";

export const metadata = {
  title: "Shop Premium Superbike Parts"
};

export default function ShopPage() {
  return (
    <main>
      <section className="shop-hero">
        <div className="container">
          <p className="eyebrow">Shop</p>
          <h1>Premium parts for superbike performance, protection and control.</h1>
          <div className="shop-search">
            <Search size={20} />
            <input suppressHydrationWarning placeholder="Search exhausts, tyres, phone mounts..." aria-label="Search products" />
          </div>
        </div>
      </section>

      <section className="shop-layout container">
        <aside className="filters">
          <div className="filter-title"><SlidersHorizontal size={18} /> Filters</div>
          <FilterGroup title="Category" items={categories.slice(0, 12)} />
          <FilterGroup title="Brand" items={brands} />
          <FilterGroup title="Availability" items={["In Stock", "Limited", "Pre-order"]} />
          <FilterGroup title="Rating" items={["4.5 and up", "4.0 and up", "Top rated"]} />
            <div className="range">
              <label>Price</label>
            <input suppressHydrationWarning type="range" min="50" max="1500" defaultValue="900" />
          </div>
        </aside>

        <div className="shop-results">
          <div className="shop-toolbar">
            <span>{products.length} curated products</span>
            <div>
              <select aria-label="Sort products" defaultValue="Best Sellers">
                {["Latest", "Best Sellers", "Price Low-High", "Price High-Low", "Top Rated"].map((sort) => (
                  <option key={sort}>{sort}</option>
                ))}
              </select>
              <button suppressHydrationWarning className="icon-button" aria-label="Grid view"><Grid2X2 size={18} /></button>
              <button suppressHydrationWarning className="icon-button" aria-label="List view"><List size={18} /></button>
            </div>
          </div>
          <div className="shop-grid">
            {products.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
          <div className="pagination">
            {[1, 2, 3].map((page) => <button suppressHydrationWarning key={page} className={page === 1 ? "active" : ""}>{page}</button>)}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      {items.map((item) => (
        <label key={item}>
          <input suppressHydrationWarning type="checkbox" /> {item}
        </label>
      ))}
    </div>
  );
}
