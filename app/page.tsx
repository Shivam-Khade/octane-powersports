"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, CreditCard, Headphones, RotateCcw } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { ProductCard } from "@/components/product-card";
import { HeroCinematic } from "@/components/hero-cinematic";

const BrandMarquee = dynamic(() => import("@/components/brand-marquee").then(mod => ({ default: mod.BrandMarquee })), { ssr: true });
const LifestyleSection = dynamic(() => import("@/components/lifestyle-section").then(mod => ({ default: mod.LifestyleSection })), { ssr: true });
const TestimonialCarousel = dynamic(() => import("@/components/testimonial-carousel").then(mod => ({ default: mod.TestimonialCarousel })), { ssr: true });
const CommunityGrid = dynamic(() => import("@/components/community-grid").then(mod => ({ default: mod.CommunityGrid })), { ssr: true });
import { useEffect, useState } from "react";
import "./home.css";

const whyUs = [
  { title: "Authentic Products", text: "Every product is 100% genuine, sourced directly from authorised brand distributors.", Icon: ShieldCheck },
  { title: "Fast Delivery", text: "Priority shipping across India. Same-day dispatch on all in-stock orders placed before 2 PM.", Icon: Truck },
  { title: "Secure Payments", text: "UPI, cards, and net banking — all transactions encrypted with bank-grade security.", Icon: CreditCard },
  { title: "Expert Support", text: "Speak to our riding gear experts for fitment advice, compatibility checks and recommendations.", Icon: Headphones }
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categoryCards, setCategoryCards] = useState<any[]>([]);
  const [currentCatIndex, setCurrentCatIndex] = useState(0);

  useEffect(() => {
    if (categoryCards.length === 0) return;
    const interval = setInterval(() => {
      setCurrentCatIndex((prev) => (prev + 1) % categoryCards.length);
    }, 2500); // slides every 2.5s for readability
    return () => clearInterval(interval);
  }, [categoryCards.length]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(console.error);

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategoryCards(data.filter((c: any) => c.featured));
        }
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
          </motion.div>

          <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
            <AnimatePresence>
              {categoryCards.length > 0 && (
                <motion.div
                  key={currentCatIndex}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Link href={`/shop?category=${encodeURIComponent(categoryCards[currentCatIndex].name)}`} className="relative w-full h-full block">
                    {categoryCards[currentCatIndex].image ? (
                      <Image 
                        src={categoryCards[currentCatIndex].image} 
                        alt={categoryCards[currentCatIndex].name} 
                        fill 
                        sizes="100vw" 
                        className="object-cover" 
                        priority
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#1a1a1a]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 z-20 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="max-w-3xl">
                        <motion.h3 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-none text-white"
                        >
                          {categoryCards[currentCatIndex].name}
                        </motion.h3>
                        <motion.p 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="text-lg md:text-xl text-white/80 max-w-2xl m-0 leading-relaxed"
                        >
                          {categoryCards[currentCatIndex].description}
                        </motion.p>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#ff6b00] text-white hover:bg-[#ff8533] transition-colors shadow-lg shadow-[#ff6b00]/30"
                      >
                        <ArrowRight size={24} />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Progress Indicators */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {categoryCards.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentCatIndex(i)} 
                  className={`w-12 h-1.5 rounded-full transition-all duration-300 ${i === currentCatIndex ? 'bg-[#ff6b00] shadow-[0_0_10px_#ff6b00]' : 'bg-white/30 hover:bg-white/60'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
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
              <motion.h2 variants={fadeUp}>Premium Parts,<br />Proven by Riders.</motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/shop" className="button outline-dark">View All Products <ArrowRight size={16} /></Link>
            </motion.div>
          </motion.div>
          <div className="product-grid">
            {(Array.isArray(products) ? products : []).slice(0, 4).map((product) => (
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
              <motion.p className="eyebrow" variants={fadeUp}>Octane Garage</motion.p>
              <motion.h2 variants={fadeUp} style={{ textTransform: "uppercase" }}>LATEST PERFORMANCE BUILDS</motion.h2>
            </div>
            <motion.a
              href="https://www.youtube.com/@OctanePowersports"
              target="_blank"
              rel="noopener noreferrer"
              className="button outline-dark"
              variants={fadeUp}
              style={{ position: "relative", top: "6px" }}
            >
              @OctanePowersports <ArrowRight size={16} />
            </motion.a>
          </motion.div>
          <CommunityGrid />
        </div>
      </section>

    </main>
  );
}
