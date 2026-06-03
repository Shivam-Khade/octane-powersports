"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type Article = {
  id: number;
  title: string;
  description: string;
  slug: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  featured: boolean;
  content: string;
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function FeaturedSlider({ articles }: { articles: Article[] }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  // We only have a few articles, so we wrap around
  const imageIndex = Math.abs(page % articles.length);
  const activeArticle = articles[imageIndex];

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (isPaused || articles.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [page, isPaused, articles.length]);

  // Preload all slider images so there's no pop-in during animations
  useEffect(() => {
    articles.forEach((article) => {
      const img = new window.Image();
      img.src = article.image;
    });
  }, [articles]);

  if (!articles || articles.length === 0) return null;

  return (
    <div 
      className="featured-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="featured-article slider-slide"
        >
          <div className="featured-image-wrapper">
            <Image 
              src={activeArticle.image} 
              alt={activeArticle.title} 
              fill 
              sizes="100vw"
              priority
              className="featured-image"
            />
            <div className="featured-overlay" />
          </div>
          
          <div className="featured-content">
            <span className="featured-category">{activeArticle.category}</span>
            <Link href={`/blog/${activeArticle.slug}`} className="featured-title-link">
              <h2 className="featured-title">{activeArticle.title}</h2>
            </Link>
            <p className="featured-desc">{activeArticle.description}</p>
            
            <div className="featured-bottom">
              <Link href={`/blog/${activeArticle.slug}`} className="featured-cta">
                Read Article <ArrowRight size={16} className="featured-arrow" />
              </Link>
              <span className="featured-meta">
                By {activeArticle.author} | {activeArticle.readTime} min read | {activeArticle.publishDate}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {articles.length > 1 && (
        <>
          <button className="slider-nav-btn prev" onClick={() => paginate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <button className="slider-nav-btn next" onClick={() => paginate(1)}>
            <ChevronRight size={24} />
          </button>
          
          <div className="slider-dots">
            {articles.map((_, idx) => (
              <button
                key={idx}
                className={`slider-dot ${idx === imageIndex ? "active" : ""}`}
                onClick={() => setPage([page + (idx - imageIndex), idx - imageIndex])}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
