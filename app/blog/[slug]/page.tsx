import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { articles } from "@/lib/data";
import { ArticleCard } from "@/components/article-card";
import "../blog.css";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return {
    title: article?.title ?? "Article",
    description: article?.description
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
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
            <Image src={article.image} alt={article.title} fill priority className="article-detail-image" />
          </div>
        </div>

        {/* Two-Column Content Layout */}
        <div className="container article-layout">
          <div className="article-body">
            <p className="article-lead">{article.description}</p>
            <div className="article-content">
              <p>Premium motorcycle upgrades work best when every part supports the way the bike is actually ridden. That means thinking beyond the headline specification and looking at materials, fitment, service access and long-term comfort.</p>
              
              <blockquote>
                "The best upgrade you can make to your motorcycle is the one that gives you the confidence to ride further and brake harder."
              </blockquote>

              <h2>The Right Choice for Your Ride</h2>
              <p>For performance riders, the right choice balances response with predictability. Street and track riders often benefit more from protection, lighting, cockpit tech and compact luggage systems that reduce friction over hundreds of miles.</p>
              <p>Octane Powersports keeps the catalog focused so each part can be evaluated for finish, reliability and installation confidence before it reaches a rider.</p>
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
  );
}
