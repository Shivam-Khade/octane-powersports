"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/lib/data";
import "./testimonial-carousel.css";

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setActive((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[active];

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-track">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            className="testimonial-card"
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="testimonial-stars">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={16} fill="#FF6B00" color="#FF6B00" />
              ))}
            </div>
            <blockquote className="testimonial-quote">"{t.review}"</blockquote>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <Image src={t.avatar} alt={t.name} fill sizes="56px" />
              </div>
              <div>
                <strong className="testimonial-name">{t.name}</strong>
                <span className="testimonial-meta">{t.bike} · {t.location}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="testimonial-controls">
        <button
          suppressHydrationWarning
          className="testimonial-btn"
          onClick={() => go(-1)}
          aria-label="Previous review"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="testimonial-dots">
          {testimonials.map((_, i) => (
            <button
              suppressHydrationWarning
              key={i}
              className={`testimonial-dot${i === active ? " active" : ""}`}
              onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
        <button
          suppressHydrationWarning
          className="testimonial-btn"
          onClick={() => go(1)}
          aria-label="Next review"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
