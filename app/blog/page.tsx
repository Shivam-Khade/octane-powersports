import { articles } from "@/lib/data";
import { BlogPageClient } from "./blog-page-client";

export const metadata = {
  title: "Journal | Octane Powersports",
  description: "Fitment guides, buying advice and performance notes."
};

export default function BlogPage() {
  return <BlogPageClient initialArticles={articles} />;
}
