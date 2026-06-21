"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Zap } from "lucide-react";
import { useCart } from "./cart-context";
import "./product-card.css";

export type Product = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  availability: string;
  badge: string;
  image: string;
  specs?: string[];
  options?: string[];
  stockCount?: number;
  relatedThumbs?: string[];
  compatibility?: string[];
};

export function ProductCard({ product }: { product: Product }) {
  const stock = product.stockCount ?? 0;
  let dynamicAvailability = "Out of Stock";
  if (stock > 5) dynamicAvailability = "In Stock";
  else if (stock > 3) dynamicAvailability = "Limited";
  else if (stock > 0) dynamicAvailability = "Low Stock";

  const isLimited = dynamicAvailability === "Limited" || dynamicAvailability === "Low Stock";
  const lowStock = stock > 0 && stock < 5;
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-image-wrap">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 800px) 50vw, 25vw" className="main-img" unoptimized />
        ) : (
          <div className="main-img bg-gray-100 absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-widest">No Image</div>
        )}

        <div className="product-badge-row">
          <span className="product-badge product-badge--category">{product.category}</span>
          <span className={`product-badge product-badge--status ${isLimited ? 'limited' : ''}`}>{product.badge}</span>
          {lowStock && <span className="product-badge product-badge--stock">Limited</span>}
        </div>

      </Link>

      <div className="product-body">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand}</span>
          <span className="product-rating">
            <Star size={14} fill="#FF6B00" color="#FF6B00" />
            <span className="rating-val">{product.rating.toFixed(1)}</span>
          </span>
        </div>

        <Link href={`/product/${product.slug}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        {product.specs && product.specs.length > 0 && (
          <div className="product-specs">
            {product.specs.slice(0, 3).map((spec, i) => (
              <span key={i} className="spec-item">
                {spec}{i < Math.min(product.specs!.length, 3) - 1 ? ' | ' : ''}
              </span>
            ))}
          </div>
        )}

        <div className="product-footer">
          <div className="product-price-block">
            <strong className="product-price">₹{product.price.toLocaleString("en-IN")}</strong>
            <span className="product-emi">
              <Zap size={11} />
              EMI from ₹{Math.round(product.price / 12).toLocaleString("en-IN")}/mo
            </span>
          </div>
          <button 
            suppressHydrationWarning 
            className="product-cart-btn" 
            aria-label={`Add ${product.name} to cart`}
            onClick={(e) => {
              e.preventDefault(); // prevent triggering the Link
              addToCart(product);
            }}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
