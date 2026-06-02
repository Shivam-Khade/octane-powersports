import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
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
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-image">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 800px) 100vw, 33vw" />
        <span>{product.badge}</span>
        <div className="quick-actions" aria-hidden="true">
          <button suppressHydrationWarning type="button" className="quick-action">
            <Eye size={16} />
            Quick View
          </button>
          <button suppressHydrationWarning type="button" className="icon-button quick-icon" aria-label={`Wishlist ${product.name}`}>
            <Heart size={18} />
          </button>
          <button suppressHydrationWarning type="button" className="icon-button quick-icon" aria-label={`Add ${product.name} to cart`}>
            <ShoppingBag size={18} />
          </button>
        </div>
      </Link>
      <div className="product-body">
        <div className="product-meta">
          <span>{product.brand}</span>
          <span>
            <Star size={14} fill="currentColor" /> {product.rating}
          </span>
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>
          {product.category} · {product.availability}
        </p>
        <div className="product-buy">
          <strong>${product.price.toLocaleString()}</strong>
          <button suppressHydrationWarning className="icon-button" aria-label={`Save ${product.name}`}>
            <Heart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
