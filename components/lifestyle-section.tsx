"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import "./lifestyle-section.css";

export function LifestyleSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section className="lifestyle-section" ref={ref}>
      <motion.div
        className="lifestyle-bg"
        style={{ y: bgY }}
      />
      <div className="lifestyle-overlay" />
      <div className="container">
        <div className="lifestyle-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">For Riders. By Riders.</p>
            <h2 className="lifestyle-headline">
              Built For Riders.<br />
              <span className="lifestyle-headline--accent">Designed For Adventure.</span>
            </h2>
            <p className="lifestyle-body">
              Whether you're carving mountain passes, touring across India, or pushing limits at the track — we have the gear that matches your ambition.
            </p>
            <Link href="/shop" className="hero-btn hero-btn--primary lifestyle-cta">
              <span>Explore All Gear</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
