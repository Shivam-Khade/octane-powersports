"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import "./hero-visual.css";

function Count({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 28;
    const step = value / totalFrames;
    let rafId = 0;

    const tick = () => {
      frame += 1;
      setCount(Math.min(value, Math.round(step * frame)));
      if (frame < totalFrames) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return (
    <strong className="hero-stat-value">
      {count}
      {suffix}
    </strong>
  );
}

const tileVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};

export function HeroVisual() {
  const tiles = [products[0], products[1], products[3]];

  return (
    <motion.div
      className="hero-visual"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } }
      }}
    >
      <motion.div className="hero-visual-card hero-visual-card--large" variants={tileVariants}>
        <Image src={tiles[0].image} alt={tiles[0].name} fill priority sizes="(max-width: 900px) 100vw, 42vw" />
        <div className="hero-visual-copy">
          <p>{tiles[0].brand}</p>
          <strong>Carbon and titanium exhaust systems.</strong>
        </div>
      </motion.div>
      <motion.div className="hero-visual-card hero-visual-card--small" variants={tileVariants}>
        <Image src={tiles[1].image} alt={tiles[1].name} fill sizes="(max-width: 900px) 100vw, 20vw" />
        <div className="hero-visual-copy">
          <p>{tiles[1].brand}</p>
          <strong>Track braking components.</strong>
        </div>
      </motion.div>
      <motion.div className="hero-visual-card hero-visual-card--small hero-visual-card--accent" variants={tileVariants}>
        <Image src={tiles[2].image} alt={tiles[2].name} fill sizes="(max-width: 900px) 100vw, 20vw" />
        <div className="hero-visual-copy">
          <p>{tiles[2].brand}</p>
          <strong>Street-ready rider tech.</strong>
        </div>
      </motion.div>
      <motion.div className="hero-stats" variants={tileVariants}>
        <div>
          <Count value={320} suffix="+" />
          <span>premium parts</span>
        </div>
        <div>
          <Count value={48} suffix="h" />
          <span>dispatch window</span>
        </div>
        <div>
          <Count value={12} suffix="+" />
          <span>premium brands</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
