import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { posts } from "@/lib/data";
import "../blog.css";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return {
    title: post?.title ?? "Article",
    description: post?.excerpt
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  const related = posts.filter((item) => item.slug !== post.slug);

  return (
    <main>
      <article className="article-page container">
        <Link href="/blog" className="back-link"><ArrowLeft size={18} /> Journal</Link>
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="article-deck">{post.excerpt}</p>
        <Image src={post.image} alt={post.title} width={1400} height={760} priority />
        <div className="article-copy">
          <p>Premium motorcycle upgrades work best when every part supports the way the bike is actually ridden. That means thinking beyond the headline specification and looking at materials, fitment, service access and long-term comfort.</p>
          <p>For performance riders, the right choice balances response with predictability. Street and track riders often benefit more from protection, lighting, cockpit tech and compact luggage systems that reduce friction over hundreds of miles.</p>
          <p>Octane Powersports keeps the catalog focused so each part can be evaluated for finish, reliability and installation confidence before it reaches a rider.</p>
        </div>
      </article>
      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Related articles</p>
              <h2>Keep building your setup.</h2>
            </div>
          </div>
          <div className="article-grid">
            {related.map((item) => (
              <Link href={`/blog/${item.slug}`} className="article-card" key={item.slug}>
                <Image src={item.image} alt={item.title} width={520} height={320} />
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
