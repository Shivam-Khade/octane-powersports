import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import pool from "@/lib/db";
import { ArticleCard } from "@/components/article-card";
import DOMPurify from 'isomorphic-dompurify';
import "../blog.css";

function parseArticle(a: any) {
  const parsed = { ...a };
  if (typeof parsed.featured !== 'boolean') {
    parsed.featured = parsed.featured === 1;
  }
  return parsed;
}

export async function generateStaticParams() {
  const [rows] = await pool.query('SELECT slug FROM blogs');
  return (rows as any[]).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ?', [slug]);
  const articles = rows as any[];
  const article = articles.length > 0 ? articles[0] : null;
  
  if (!article) return { title: "Article Not Found" };

  const title = `${article.title} | Octane Powersports Journal`;
  const description = article.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://octanepowersports.in/blog/${article.slug}`,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.image],
    },
    alternates: {
      canonical: `https://octanepowersports.in/blog/${article.slug}`
    }
  };
}

import { ViewTracker } from "@/components/view-tracker";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ?', [slug]);
  const matched = rows as any[];
  if (matched.length === 0) notFound();

  const article = parseArticle(matched[0]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "image": [article.image],
    "datePublished": new Date(article.publishDate).toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Octane Powersports",
      "logo": {
        "@type": "ImageObject",
        "url": "https://octanepowersports.in/logo.png"
      }
    }
  };

  const [allRows] = await pool.query('SELECT * FROM blogs LIMIT 4');
  const allArticles = (allRows as any[]).map(parseArticle);
  const related = allArticles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker type="blog" id={article.slug} />
      <main className="blog-main-bg">
        <article className="article-detail-page">
          {/* Breadcrumb */}
          <div className="container">
            <nav className="breadcrumb">
              <Link href="/">Home</Link> <ChevronRight size={14} />
              <Link href="/blog">Journal</Link> <ChevronRight size={14} />
              <span className="current">{article.title}</span>
            </nav>
          </div>

          {/* Featured Image Header */}
          <div className="container">
            <div className="article-detail-header">
              <span className="card-category-badge static-badge">{article.category}</span>
              <h1 className="article-detail-title">{article.title}</h1>
              <div className="article-detail-meta">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{article.publishDate}</span>
                <span>•</span>
                <span>{article.readTime} min read</span>
              </div>
            </div>
            
            <div className="article-detail-image-wrapper">
              <Image src={article.image} alt={article.title} fill priority unoptimized className="article-detail-image" />
            </div>
          </div>

          {/* Two-Column Content Layout */}
          <div className="container article-layout">
            <div className="article-body">
              <p className="article-lead">{article.description}</p>
              <div className="article-content">
                {article.introText && <p>{article.introText}</p>}
                
                {article.quoteText && (
                  <blockquote>
                    "{article.quoteText}"
                  </blockquote>
                )}

                {article.subHeading && <h2>{article.subHeading}</h2>}
                
                {article.bodyText && (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {article.bodyText}
                  </div>
                )}

                {article.content && (
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                )}
              </div>
            </div>

            <aside className="article-sidebar">
              <div className="sidebar-widget author-bio">
                <h3 className="widget-title">About {article.author}</h3>
                <p>A passionate rider and powersports enthusiast sharing insights on gear, performance, and the ride itself.</p>
              </div>

              <div className="sidebar-widget shop-cta-widget">
                <h3 className="widget-title text-white">Ready to upgrade?</h3>
                <p className="text-white">Explore our premium selection of motorcycle parts and accessories.</p>
                <Link href="/shop" className="button cta-btn">Shop Now</Link>
              </div>
            </aside>
          </div>
        </article>

        {/* Related Articles Grid */}
        <section className="section blog-main-bg">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">More from the Journal</p>
                <h2 className="related-heading">Keep Building Your Setup</h2>
              </div>
            </div>
            <div className="article-grid">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

