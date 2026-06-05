import pool from "@/lib/db";
import { BlogPageClient } from "./blog-page-client";

export const metadata = {
  title: "Journal | Octane Powersports",
  description: "Fitment guides, buying advice and performance notes."
};

export default async function BlogPage() {
  const [rows] = await pool.query('SELECT * FROM blogs');
  const articles = (rows as any[]).map(article => {
    const a = { ...article };
    if (typeof a.featured !== 'boolean') {
      a.featured = a.featured === 1;
    }
    return a;
  });

  return <BlogPageClient initialArticles={articles} />;
}
