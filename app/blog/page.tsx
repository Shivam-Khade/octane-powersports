import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { posts } from "@/lib/data";
import "./blog.css";

export const metadata = {
  title: "Motorcycle Parts Guides & Journal"
};

export default function BlogPage() {
  return (
    <main>
      <section className="blog-hero container">
        <p className="eyebrow">Journal</p>
        <h1>Fitment guides, buying advice and performance notes.</h1>
        <div className="blog-search"><Search size={20} /><input suppressHydrationWarning aria-label="Search articles" placeholder="Search guides" /></div>
      </section>
      <section className="container blog-layout">
        <article className="featured-post">
          <Image src={posts[0].image} alt={posts[0].title} fill sizes="(max-width: 900px) 100vw, 60vw" />
          <div>
            <span>{posts[0].category}</span>
            <h2>{posts[0].title}</h2>
            <p>{posts[0].excerpt}</p>
          </div>
        </article>
        <aside className="article-cats">
          {["Performance", "Track", "Street", "Maintenance", "Electronics"].map((item) => <Link href="/blog" key={item}>{item}</Link>)}
        </aside>
      </section>
      <section className="section">
        <div className="container article-grid">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} className="article-card" key={post.slug}>
              <Image src={post.image} alt={post.title} width={520} height={320} />
              <span>{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
