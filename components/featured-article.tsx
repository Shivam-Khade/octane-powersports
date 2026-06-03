import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

export function FeaturedArticle({ article }: { article: Article }) {
  if (!article) return null;

  return (
    <Link href={`/blog/${article.slug}`} className="featured-article">
      <div className="featured-image-wrapper">
        <Image 
          src={article.image} 
          alt={article.title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          priority
          className="featured-image"
        />
        <div className="featured-overlay" />
      </div>
      
      <div className="featured-content">
        <span className="featured-category">{article.category}</span>
        <h2 className="featured-title">{article.title}</h2>
        <p className="featured-desc">{article.description}</p>
        
        <div className="featured-bottom">
          <span className="featured-cta">
            Read Article <ArrowRight size={16} className="featured-arrow" />
          </span>
          <span className="featured-meta">
            By {article.author} | {article.readTime} min read | {article.publishDate}
          </span>
        </div>
      </div>
    </Link>
  );
}
