import { Suspense } from "react";
import pool from "@/lib/db";
import { ShopPageClient } from "./shop-page-client";

export const metadata = {
  title: "Shop Premium Superbike Parts"
};

export default async function ShopPage() {
  const [rows] = await pool.query('SELECT * FROM products');
  const products = (rows as any[]).map(product => {
    const p = { ...product };
    ['compatibility', 'specs', 'options', 'relatedThumbs'].forEach(field => {
      if (typeof p[field] === 'string') {
        try {
          p[field] = JSON.parse(p[field]);
        } catch (e) {
          // ignore
        }
      }
    });
    p.rating = Number(p.rating);
    p.price = Number(p.price);
    p.stockCount = Number(p.stockCount);
    return p;
  });

  const [catRows] = await pool.query('SELECT name FROM categories ORDER BY name ASC');
  const categories = (catRows as any[]).map(c => c.name);

  return (
    <Suspense fallback={<div style={{height: "100vh"}}></div>}>
      <ShopPageClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
