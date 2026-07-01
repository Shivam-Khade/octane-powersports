"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star, Check, ShoppingBag, Heart, Zap, Shield,
  Truck, RotateCcw, ChevronRight, Minus, Plus, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-context";
import { useSession } from "next-auth/react";
import { useLoginModal } from "@/components/login-context";
import PackageCard from "@/components/packages/PackageCard";
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
  relatedThumbs?: string[];
  description?: string;
  compatibility?: string[];
  warranty?: string;
  shipping?: string;
  stockCount?: number;
  sku?: string;
};

export function ProductPageClient({
  product,
  related,
  packages = []
}: {
  product: Product;
  related: Product[];
  packages?: any[];
}) {
  const allImages = [product.image, ...(product.relatedThumbs || [])].filter(Boolean);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string; transform: string } | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [showAllFitment, setShowAllFitment] = useState(false);
  
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const { openModal: openLoginModal } = useLoginModal();
  const router = useRouter();

  const stock = product.stockCount ?? 0;
  let dynamicAvailability = stock > 0 ? "In Stock" : "Out of Stock";
  const isLimited = false;
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
              <div className="gallery-main-img-wrap" onClick={() => setLightboxImg(allImages[activeImg])}>
                {allImages[activeImg] ? (
                  <Image
                    src={allImages[activeImg]}
                    alt={`${product.name} — view ${activeImg + 1}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    priority
                    style={zoomStyle || { transform: "scale(1)", transformOrigin: "center" }}
                    className="gallery-main-img"
                  />
                ) : (
                  <div className="gallery-main-img bg-gray-100 absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                    No Image Available
                  </div>
                )}
              </div>

            </div>
            {allImages.length > 1 && (
              <div className="gallery-thumbs">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb${i === activeImg ? " active" : ""}`}
                    onClick={() => { setActiveImg(i); setLightboxImg(src); }}
                    aria-label={`View image ${i + 1}`}
                    suppressHydrationWarning
                  >
                    {src ? (
                      <Image src={src} alt={`View ${i + 1}`} fill sizes="100px" />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">None</div>
                    )}
                  </button>
                ))}
              </div>
            )}
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
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <span className={`purchase-stock${isLimited ? " limited" : ""}`}>
                  <span className="stock-dot" />
                  {dynamicAvailability}
                </span>
              </div>
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

            <p className="purchase-desc">
              {product.description || "Precision-crafted for riders who demand ultimate fitment confidence, performance, and style on long tours or track days alike."}
            </p>

            {/* Bike Compatibility Section */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="purchase-compatibility">
                <span className="compatibility-title">Verified Fitment:</span>
                <div className="compatibility-list">
                  {(showAllFitment ? product.compatibility : product.compatibility.slice(0, 6)).map((bike) => (
                    <span key={bike} className="compatibility-badge">
                      {bike}
                    </span>
                  ))}
                  {product.compatibility.length > 6 && !showAllFitment && (
                    <button 
                      onClick={() => setShowAllFitment(true)}
                      className="compatibility-badge font-bold text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white transition-colors cursor-pointer"
                    >
                      +{product.compatibility.length - 6} more
                    </button>
                  )}
                  {product.compatibility.length > 6 && showAllFitment && (
                    <button 
                      onClick={() => setShowAllFitment(false)}
                      className="compatibility-badge font-bold text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white transition-colors cursor-pointer"
                    >
                      Show less
                    </button>
                  )}
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
            <div className="purchase-qty-row" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
              {product.stockCount !== 0 && (
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>1+ available</span>
              )}
            </div>

            {/* CTAs */}
            <div className="purchase-ctas">
              <button 
                suppressHydrationWarning 
                className="purchase-add-cart"
                onClick={() => {
                  if (!session?.user) {
                    openLoginModal();
                    return;
                  }
                  addToCart(product, qty);
                }}
                style={{ width: "100%" }} // Make Add to Cart full width since Buy Now is removed
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
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
              ...(product.sku ? [["SKU", product.sku]] : []),
              ["Warranty Details", product.warranty || "Official warranty"],
              ["Shipping Info", product.shipping || "Pan India — 2-4 Days"],
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

      {/* Package Deals Section */}
      {packages && packages.length > 0 && (
        <section className="section bg-[#f8f8f8]">
          <div className="container">
            <div className="flex flex-col items-center text-center mx-auto mb-12">
              <p className="eyebrow text-[#ff6b00]">Special Offers</p>
              <h2>Available in Package Deals</h2>
              <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Get this product at a discounted price by buying it as part of our premium curated packages.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg.id}>
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Related Collection</p>
              <h2>Similar Products You May Like</h2>
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
          >
            <button className="lightbox-close" onClick={() => setLightboxImg(null)}>
              <X size={24} />
            </button>
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={lightboxImg} alt="Original size" fill style={{ objectFit: "contain" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
