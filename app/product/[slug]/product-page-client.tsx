"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Star, Check, ShoppingBag, Heart, Zap, Shield,
  Truck, RotateCcw, ChevronRight, Minus, Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import "./product.css";

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
  description?: string;
  compatibility?: string[];
  warranty?: string;
  shipping?: string;
};

export function ProductPageClient({
  product,
  related
}: {
  product: Product;
  related: Product[];
}) {
  const allImages = [product.image, ...related.slice(0, 3).map((r) => r.image)];
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string; transform: string } | null>(null);

  const emi = Math.round(product.price / 12);
  const isLimited = product.availability === "Limited";

  // Hover zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle(null);
  };

  return (
    <main>
      {/* Breadcrumb */}
      <div className="product-breadcrumb">
        <div className="container product-breadcrumb-inner">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop">Shop</Link>
          <ChevronRight size={13} />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
          <ChevronRight size={13} />
          <span>{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <section className="product-section">
        <div className="container product-layout">
          {/* Gallery */}
          <motion.div
            className="product-gallery"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div 
              className="gallery-main"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="gallery-main-img-wrap">
                <Image
                  src={allImages[activeImg]}
                  alt={`${product.name} — view ${activeImg + 1}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  priority
                  style={zoomStyle || { transform: "scale(1)", transformOrigin: "center" }}
                  className="gallery-main-img"
                />
              </div>
              <div className="gallery-badge">
                <span className="product-badge-lg">{product.badge}</span>
              </div>
            </div>
            <div className="gallery-thumbs">
              {allImages.map((src, i) => (
                <button
                  key={i}
                  className={`gallery-thumb${i === activeImg ? " active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  suppressHydrationWarning
                >
                  <Image src={src} alt={`View ${i + 1}`} fill sizes="100px" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Purchase Panel */}
          <motion.aside
            className="purchase-panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="purchase-brand-row">
              <span className="purchase-brand">{product.brand}</span>
              <span className={`purchase-stock${isLimited ? " limited" : ""}`}>
                <span className="stock-dot" />
                {product.availability}
              </span>
            </div>

            <h1 className="purchase-title">{product.name}</h1>

            <div className="purchase-rating">
              <div className="purchase-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? "#FF6B00" : "none"}
                    color="#FF6B00"
                  />
                ))}
              </div>
              <span className="purchase-rating-text">{product.rating}</span>
              <span className="purchase-review-count">128 verified reviews</span>
            </div>

            <div className="purchase-price-block">
              <strong className="purchase-price">₹{product.price.toLocaleString("en-IN")}</strong>
              <span className="purchase-tax">Incl. of all taxes</span>
            </div>

            <div className="purchase-emi-card">
              <Zap size={16} className="emi-icon" />
              <div>
                <strong>EMI options from ₹{emi.toLocaleString("en-IN")}/month</strong>
                <span>Instant approval & 0% interest EMI options on major credit cards</span>
              </div>
            </div>

            <p className="purchase-desc">
              {product.description || "Precision-crafted for riders who demand ultimate fitment confidence, performance, and style on long tours or track days alike."}
            </p>

            {/* Bike Compatibility Section */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="purchase-compatibility">
                <span className="compatibility-title">Verified Fitment:</span>
                <div className="compatibility-list">
                  {product.compatibility.map((bike) => (
                    <span key={bike} className="compatibility-badge">
                      {bike}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="purchase-checks">
              {[
                { icon: Check, text: "100% Genuine Direct Import" },
                { icon: Check, text: "Official Manufacturer warranty" },
                { icon: Check, text: "Fitment guaranteed for list superbikes" }
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="purchase-check">
                  <Icon size={15} />
                  {text}
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="purchase-qty-row">
              <span className="purchase-qty-label">Quantity</span>
              <div className="purchase-qty">
                <button
                  suppressHydrationWarning
                  className="qty-btn"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  suppressHydrationWarning
                  className="qty-btn"
                  onClick={() => setQty(qty + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="purchase-ctas">
              <button suppressHydrationWarning className="purchase-add-cart">
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button suppressHydrationWarning className="purchase-buy-now">
                Buy Now
              </button>
            </div>


            {/* Trust Strip */}
            <div className="purchase-trust">
              {[
                { icon: Truck, text: product.shipping || "Free Insured Delivery" },
                { icon: Shield, text: product.warranty || "Official Warranty" },
                { icon: RotateCcw, text: "15-Day Easy Exchange" }
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="trust-item">
                  <Icon size={18} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </section>

      {/* Specs & Description */}
      <section className="section alt">
        <div className="container product-details-grid">
          <div>
            <p className="eyebrow">Description</p>
            <h2>Built For Maximum Performance & Adventure.</h2>
            <p className="product-detail-body">
              Engineered with advanced materials and high manufacturing tolerances. Designed to increase protection, ergonomics, or performance without compromise. Each product in our store is quality-inspected, safety-certified, and verified for exact compatibility with superbikes in India.
            </p>
          </div>
          <div className="specs-table">
            <p className="eyebrow">Product Specs</p>
            {[
              ["Category", product.category],
              ["Brand", product.brand],
              ["Availability", product.availability],
              ["Warranty Details", product.warranty || "Official warranty"],
              ["Shipping Info", product.shipping || "Pan India — 2-4 Days"],
              ["Returns & Exchange", "15-day return option"],
              ["Fitment Type", product.compatibility && product.compatibility[0] === "All Motorcycles (Universal Fit)" ? "Universal Fit" : "Model-Specific Fit"]
            ].map(([label, value]) => (
              <div key={label} className="spec-row">
                <span className="spec-label">{label}</span>
                <strong className="spec-value">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Related Collection</p>
              <h2>Complete Your Riding Setup</h2>
            </div>
            <Link href="/shop" className="button outline-dark">View All Products</Link>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
