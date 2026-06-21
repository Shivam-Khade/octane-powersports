import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "./featured-article";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="article-card">
      <div className="card-image-section">
        <Image 
          src={article.image} 
          alt={article.title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="card-image"
          unoptimized
        />
        <span className="card-category-badge">{article.category}</span>
        <span className="card-read-time">{article.readTime} min read</span>
      </div>
      
      <div className="card-content-section">
        <span className="card-category-label">{article.category}</span>
        <h3 className="card-title">{article.title}</h3>
        <p className="card-desc">{article.description}</p>
        
        <div className="card-meta">
          <span>{article.publishDate} • By {article.author}</span>
          <span className="card-cta">
            Read more <ArrowRight size={14} className="card-arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
}
