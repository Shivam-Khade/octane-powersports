"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, CreditCard, Headphones, RotateCcw } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { BrandMarquee } from "@/components/brand-marquee";
import { LifestyleSection } from "@/components/lifestyle-section";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { CommunityGrid } from "@/components/community-grid";
import { HeroCinematic } from "@/components/hero-cinematic";
import { useEffect, useState } from "react";
import "./home.css";

const whyUs = [
  { title: "Authentic Products", text: "Every product is 100% genuine, sourced directly from authorised brand distributors.", Icon: ShieldCheck },
  { title: "Fast Delivery", text: "Priority shipping across India. Same-day dispatch on all in-stock orders placed before 2 PM.", Icon: Truck },
  { title: "Secure Payments", text: "UPI, cards, net banking and EMI — all transactions encrypted with bank-grade security.", Icon: CreditCard },
  { title: "Expert Support", text: "Speak to our riding gear experts for fitment advice, compatibility checks and recommendations.", Icon: Headphones },
  { title: "Easy Returns", text: "Hassle-free 15-day return policy. If it doesn't fit or meet expectations, we make it right.", Icon: RotateCcw }
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categoryCards, setCategoryCards] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        // filter featured ones
        setCategoryCards(data.filter((c: any) => c.featured));
      })
      .catch(console.error);
  }, []);

  return (
    <main>
      {/* ===== HERO ===== */}
      <HeroCinematic />

      {/* ===== BRAND MARQUEE ===== */}
      <BrandMarquee />

      {/* ===== CATEGORIES ===== */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-head"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <div>
              <motion.p className="eyebrow" variants={fadeUp}>Shop by Category</motion.p>
              <motion.h2 variants={fadeUp}>Everything You Need.<br />Built to Perform.</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/shop" className="button outline-dark">
                View All Categories <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <div className="category-grid">
            {categoryCards.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-card">
                  <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="category-card-body">
                    <h3 className="category-card-title">{cat.name}</h3>
                    <p className="category-card-desc">{cat.description}</p>
                    <span className="category-card-arrow">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section alt">
        <div className="container">
          <motion.div
            className="section-head"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <div>
              <motion.p className="eyebrow" variants={fadeUp}>Best Sellers</motion.p>
              <motion.h2 variants={fadeUp}>Premium Gear,<br />Proven by Riders.</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/shop" className="button outline-dark">View All Products <ArrowRight size={16} /></Link>
            </motion.div>
          </motion.div>
          <div className="product-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIFESTYLE ===== */}
      <LifestyleSection />

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p className="eyebrow" variants={fadeUp}>Why Octane</motion.p>
            <motion.h2 className="why-heading" variants={fadeUp}>The Octane Promise</motion.h2>
          </motion.div>
          <div className="why-grid">
            {whyUs.map(({ title, text, Icon }, i) => (
              <motion.div
                key={title}
                className="why-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="why-icon">
                  <Icon size={22} />
                </div>
                <h3 className="why-title">{title}</h3>
                <p className="why-text">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section alt">
        <div className="container">
          <motion.div
            className="testimonial-section-head"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p className="eyebrow" variants={fadeUp}>Rider Reviews</motion.p>
            <motion.h2 variants={fadeUp}>5,000+ Riders Trust Octane</motion.h2>
            <motion.p className="testimonial-intro" variants={fadeUp}>
              From mountain passes to city commutes — real riders, real experiences.
            </motion.p>
          </motion.div>
          <TestimonialCarousel />

          {/* Trust stats */}
          <div className="trust-stats">
            {[
              { value: "4.9", label: "Average Rating" },
              { value: "5,000+", label: "Orders Delivered" },
              { value: "98%", label: "Happy Customers" },
              { value: "15 Day", label: "Easy Returns" }
            ].map(({ value, label }) => (
              <div key={label} className="trust-stat">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY ===== */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-head"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <div>
              <motion.p className="eyebrow" variants={fadeUp}>The Community</motion.p>
              <motion.h2 variants={fadeUp}>Riders on the Road</motion.h2>
            </div>
            <motion.a
              href="https://instagram.com/octanepowersports"
              target="_blank"
              rel="noopener noreferrer"
              className="button outline-dark"
              variants={fadeUp}
            >
              @octanepowersports <ArrowRight size={16} />
            </motion.a>
          </motion.div>
          <CommunityGrid />
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="newsletter-section">
        <div className="container newsletter-inner">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Octane Insider</p>
            <h2 className="newsletter-heading">New drops, fitment guides<br />and exclusive deals.</h2>
            <p className="newsletter-body">Join 5,000+ riders. No spam, only what matters.</p>
          </motion.div>
          <motion.form
            className="newsletter-form"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              suppressHydrationWarning
              aria-label="Email address"
              placeholder="Enter your email"
              type="email"
              className="newsletter-input"
            />
            <button suppressHydrationWarning type="submit" className="button primary newsletter-submit">
              Subscribe
            </button>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
