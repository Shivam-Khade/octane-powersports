import type { MetadataRoute } from "next";
import pool from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://octanepowersports.com";
  
  const [productRows] = await pool.query('SELECT slug FROM products');
  const products = productRows as any[];
  
  const [blogRows] = await pool.query('SELECT slug FROM blogs');
  const articles = blogRows as any[];

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
