import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Star, Zap } from "lucide-react";
import "./product-card.css";

type Product = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  availability: string;
  badge: string;
  image: string;
};

export function ProductCard({ product }: { product: Product }) {
  const isLimited = product.availability === "Limited";

  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-image-wrap">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 800px) 50vw, 25vw" />

        <div className="product-badge-row">
          <span className="product-badge">{product.badge}</span>
          {isLimited && <span className="product-badge product-badge--limited">Limited</span>}
        </div>

        {/* Hover overlay */}
        <div className="product-hover-overlay">
          <button suppressHydrationWarning type="button" className="product-quick-view">
            <Eye size={15} />
            Quick View
          </button>
          <div className="product-hover-actions">
            <button suppressHydrationWarning type="button" className="product-icon-action" aria-label={`Wishlist ${product.name}`}>
              <Heart size={16} />
            </button>
            <button suppressHydrationWarning type="button" className="product-icon-action" aria-label={`Add ${product.name} to cart`}>
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </Link>

      <div className="product-body">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand}</span>
          <span className="product-rating">
            <Star size={12} fill="#FF6B00" color="#FF6B00" />
            {product.rating}
          </span>
        </div>

        <Link href={`/product/${product.slug}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <p className="product-category">{product.category}</p>

        <div className="product-footer">
          <div className="product-price-block">
            <strong className="product-price">₹{product.price.toLocaleString("en-IN")}</strong>
            <span className="product-emi">
              <Zap size={11} />
              EMI from ₹{Math.round(product.price / 12).toLocaleString("en-IN")}/mo
            </span>
          </div>
          <button suppressHydrationWarning className="product-cart-btn" aria-label={`Add ${product.name} to cart`}>
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
