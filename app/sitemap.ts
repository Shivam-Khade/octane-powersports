import type { MetadataRoute } from "next";
import { products, articles } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://octanepowersports.com";
  return [
    "",
    "/shop",
    "/blog",
    "/service-booking",
    "/account",
    "/checkout",
    ...products.map((product) => `/product/${product.slug}`),
    ...articles.map((article) => `/blog/${article.slug}`)
  ].map((url) => ({
    url: `${base}${url}`,
    lastModified: new Date()
  }));
}
