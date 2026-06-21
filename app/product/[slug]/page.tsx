import pool from "@/lib/db";
import { ProductPageClient } from "./product-page-client";
import { notFound } from "next/navigation";

// Utility to parse product fields correctly
function parseProduct(p: any) {
  const parsed = { ...p };
  ['compatibility', 'specs', 'options', 'relatedThumbs'].forEach(field => {
    if (typeof parsed[field] === 'string') {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch (e) {
        // ignore
      }
    }
  });
  parsed.rating = Number(parsed.rating);
  parsed.price = Number(parsed.price);
  parsed.stockCount = Number(parsed.stockCount);
  return parsed;
}

export async function generateStaticParams() {
  const [rows] = await pool.query('SELECT slug FROM products WHERE stockCount > 0');
  return (rows as any[]).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rows] = await pool.query('SELECT * FROM products WHERE slug = ? AND stockCount > 0', [slug]);
  const products = rows as any[];
  const product = products.length > 0 ? products[0] : null;
  
  if (!product) return { title: "Product Not Found" };

  const title = `${product.name} — Buy Online India | Octane Powersports`;
  const description = `Buy ${product.name} by ${product.brand} online in India. Genuine product with fast Pan India delivery and easy returns.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://octanepowersports.in/product/${product.slug}`,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `https://octanepowersports.in/product/${product.slug}`
    }
  };
}

import { ViewTracker } from "@/components/view-tracker";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [rows] = await pool.query('SELECT * FROM products WHERE slug = ? AND stockCount > 0', [slug]);
  const matched = rows as any[];
  if (matched.length === 0) notFound();
  
  const product = parseProduct(matched[0]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": `Buy ${product.name} by ${product.brand} online in India.`,
    "sku": product.slug,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://octanepowersports.in/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stockCount > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  const [allRows] = await pool.query('SELECT * FROM products WHERE stockCount > 0 LIMIT 5');
  const allProducts = (allRows as any[]).map(parseProduct);
  const related = allProducts.filter((item) => item.slug !== product.slug).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker type="product" id={product.id} />
      <ProductPageClient product={product} related={related} />
    </>
  );
}
