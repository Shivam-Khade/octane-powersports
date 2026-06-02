"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./hero-cinematic.css";

export function HeroCinematic() {
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: undefined,
    offset: ["start start", "end start"]
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, 28]);
  const videoScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.06]);
  const videoBrightness = useTransform(scrollYProgress, [0, 0.32], [1.08, 0.92]);
  const videoFilter = useTransform(videoBrightness, (value) => `brightness(${value})`);

  return (
    <section className="hero-cinematic">
      <motion.div
        className="hero-cinematic__videoWrap"
        style={{ scale: videoScale, filter: videoFilter, opacity: videoReady ? 1 : 0 }}
      >
        <video
          className="hero-cinematic__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="hero-cinematic__overlay" />
      <div className="hero-cinematic__rightShade" />
      <div className="hero-cinematic__veil" />

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
                staggerChildren: 0.09,
                delayChildren: 0.18
              }
            }
          }}
        >
          <motion.p className="eyebrow" variants={itemVariants}>
            Premium motorcycle performance
          </motion.p>
          <motion.h1 variants={itemVariants}>
            <span>Premium Motorcycle Parts</span>
            <span>Built For Riders</span>
            <span>Who Demand More</span>
          </motion.h1>
          <motion.p variants={itemVariants}>
            Curated superbike exhausts, protection, electronics, tyres and control upgrades with the calm,
            precision and confidence of a luxury performance brand.
          </motion.p>
          <div className="hero-cinematic__actions">
            <motion.div variants={itemVariants} className="hero-action-slot">
              <Link className="button hero-button hero-button--primary" href="/shop">
                <span>Shop Collection</span>
                <ArrowRight size={18} className="hero-button__arrow" />
              </Link>
            </motion.div>
            <motion.div variants={itemVariants} className="hero-action-slot">
              <Link className="button hero-button hero-button--secondary" href="/shop#brands">
                Explore Categories
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};
