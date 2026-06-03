"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Users, Package, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./hero-cinematic.css";

const stats = [
  { icon: Users, value: "5000+", label: "Riders" },
  { icon: Package, value: "100+", label: "Premium Products" },
  { icon: MapPin, value: "Pan India", label: "Delivery" }
];

export function HeroCinematic() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"]
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, 40]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  return (
    <section className="hero-cinematic">
      {/* Video Background */}
      <motion.div
        className="hero-cinematic__videoWrap"
        style={{ scale: videoScale, opacity: isMounted ? 1 : 0 }}
      >
        <div suppressHydrationWarning style={{ width: '100%', height: '100%' }}>
          {isMounted && (
            <video
              className="hero-cinematic__video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          )}
        </div>
      </motion.div>

      {/* Dark overlay — subtle 25% */}
      <div className="hero-cinematic__overlay" />

      {/* Content */}
      <div className="container hero-cinematic__content">
        <motion.div
          className="hero-cinematic__copy"
          style={{ opacity: contentOpacity, y: contentY }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          <motion.p className="hero-eyebrow" variants={itemVariants}>
            Premium Powersports India
          </motion.p>

          <motion.h1 className="hero-headline" variants={itemVariants}>
            <span>RIDE HARDER.</span>
            <span>EXPLORE FURTHER.</span>
            <span className="hero-headline--accent">OWN THE ROAD.</span>
          </motion.h1>

          <motion.p className="hero-sub" variants={itemVariants}>
            Premium motorcycle exhausts, protection parts, tyres and accessories for riders who demand more.
          </motion.p>

          <motion.div className="hero-actions" variants={itemVariants}>
            <Link className="hero-button hero-button--primary" href="/shop">
              <span>Shop Collection</span>
              <ArrowRight size={18} className="hero-button__arrow" />
            </Link>
            <Link className="hero-button hero-button--secondary" href="/shop#brands">
              Explore Brands
            </Link>
          </motion.div>

          {/* Floating Stats */}
          <motion.div className="hero-stats" variants={itemVariants}>
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="hero-stat-card">
                <Icon size={18} className="hero-stat-icon" />
                <div>
                  <strong className="hero-stat-value">{value}</strong>
                  <span className="hero-stat-label">{label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};
