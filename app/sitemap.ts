import type { MetadataRoute } from "next";
import { products, posts } from "@/lib/data";

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
    ...posts.map((post) => `/blog/${post.slug}`)
  ].map((url) => ({
    url: `${base}${url}`,
    lastModified: new Date()
  }));
}
