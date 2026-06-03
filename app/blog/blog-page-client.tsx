"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArticleCard } from "@/components/article-card";
import { FeaturedSlider, type Article } from "@/components/featured-slider";
import "./blog.css";

const categories = ["All", "Performance", "Street", "Track", "Maintenance", "Electronics"];

export function BlogPageClient({ initialArticles }: { initialArticles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setMounted(true);
  }, []);

  // The slider will show all articles, or top 3. Let's pass the top 3.
  const featuredArticles = initialArticles.slice(0, 3);
  const gridArticles = initialArticles; // or we can filter out featured ones if preferred, but since it's a slider it's okay to show them all below or offset.
  // Actually, to keep the grid full, let's just show all articles in the grid, but slider gets top 3.

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return gridArticles;
    return gridArticles.filter(a => a.category === activeCategory);
  }, [activeCategory, gridArticles]);

  const displayedArticles = filteredArticles.slice(0, page * itemsPerPage);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <main className="blog-main-bg">
      {/* Featured Slider */}
      <section className="featured-section full-screen-slider">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <FeaturedSlider articles={featuredArticles} />
        </motion.div>
      </section>

      {/* Categories Filter */}
      <section className="filter-section container">
        <motion.div 
          className="category-pills"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Article Grid */}
      <section className="article-grid-section container">
        <motion.div layout className="article-grid">
          <AnimatePresence mode="popLayout">
            {displayedArticles.map((article, i) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: mounted ? 0 : i * 0.08 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Pagination */}
        {displayedArticles.length < filteredArticles.length && (
          <motion.div 
            className="pagination-wrapper"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button 
              className="load-more-btn"
              onClick={() => setPage(p => p + 1)}
            >
              Load More Articles →
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}
