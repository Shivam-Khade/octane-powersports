"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Users, Package, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BikePartsSearch } from "./bike-parts-search";
import "./hero-cinematic.css";

const stats = [
  { icon: Users, value: "5000+", label: "Riders" },
  { icon: Package, value: "100+", label: "Premium Products" },
  { icon: MapPin, value: "Pan India", label: "Delivery" }
];

export function HeroCinematic() {
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"]
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, 40]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="hero-cinematic">
      {/* Video Background */}
      <motion.div
        className="hero-cinematic__videoWrap"
        style={{ scale: videoScale }}
      >
        <div suppressHydrationWarning style={{ width: '100%', height: '100%' }}>
            {mounted && (
              <video
                className="hero-cinematic__video"
                autoPlay
                muted
                loop
                playsInline
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
          className="hero-cinematic__search-wrapper"
          initial={{ opacity: 0, y: 40, scale: 0.98, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <BikePartsSearch />
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
