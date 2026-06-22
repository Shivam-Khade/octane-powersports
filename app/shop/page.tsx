import { Suspense } from "react";
import pool from "@/lib/db";
import { ShopPageClient } from "./shop-page-client";

export const metadata = {
  title: "Shop Premium Superbike Parts"
};

export default async function ShopPage() {
  const [rows] = await pool.query('SELECT * FROM products WHERE stockCount > 0');
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
    
    const normalizeName = (name: string) => {
      if (name && name === name.toUpperCase() && name.length > 3) {
        return name.charAt(0) + name.slice(1).toLowerCase();
      }
      return name;
    };

    if (typeof p.brand === 'string') {
      const uniqueBrands = Array.from(new Set(p.brand.split(',').map((b: string) => normalizeName(b.trim()))));
      p.brand = uniqueBrands.join(', ');
    }
    if (typeof p.category === 'string') {
      p.category = normalizeName(p.category);
    }
    return p;
  });

  const normalizeName = (name: string) => {
    if (name && name === name.toUpperCase() && name.length > 3) {
      return name.charAt(0) + name.slice(1).toLowerCase();
    }
    return name;
  };

  const [catRows] = await pool.query('SELECT name FROM categories ORDER BY name ASC');
  const dbCategories = (catRows as any[]).map(c => normalizeName(c.name));
  const productCategories = products.map(p => p.category).filter(Boolean);
  const categories = Array.from(new Set([...dbCategories, ...productCategories])).sort();

  return (
    <Suspense fallback={<div style={{height: "100vh"}}></div>}>
      <ShopPageClient initialProducts={products} categories={categories} />
    </Suspense>
  );
}
