import pool from "@/lib/db";
import { ProductPageClient } from "./product-page-client";
import { notFound, redirect } from "next/navigation";

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
  const decodedSlug = decodeURIComponent(slug);
  const [rows] = await pool.query('SELECT * FROM products WHERE slug = ? AND stockCount > 0', [decodedSlug]);
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
  const decodedSlug = decodeURIComponent(slug);
  const [rows] = await pool.query('SELECT * FROM products WHERE slug = ? AND stockCount > 0', [decodedSlug]);
  const matched = rows as any[];
  if (matched.length === 0) {
    const strippedSlug = decodedSlug.replace(/[^a-zA-Z0-9]/g, '%').replace(/%+/g, '%');
    const aggressivePattern = `%${strippedSlug}%`;
    const [fallbackRows] = await pool.query(
      'SELECT slug FROM products WHERE (slug LIKE ? OR name LIKE ?) LIMIT 1',
      [aggressivePattern, aggressivePattern]
    );
    const fallbackMatches = fallbackRows as any[];
    if (fallbackMatches.length > 0) {
      redirect(`/product/${fallbackMatches[0].slug}`);
    } else {
      notFound();
    }
  }
  
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

  const [allRows] = await pool.query(`
    SELECT * FROM products 
    WHERE slug != ? AND stockCount > 0 
    ORDER BY 
      CASE WHEN category = ? THEN 1 ELSE 0 END DESC,
      CASE WHEN brand = ? THEN 1 ELSE 0 END DESC,
      (COALESCE(cart_adds, 0) * 10 + COALESCE(views, 0)) DESC
    LIMIT 4
  `, [product.slug, product.category, product.brand]);
  
  const related = (allRows as any[]).map(parseProduct);

  // Fetch Packages containing this product
  const [packageRows] = await pool.query<any[]>(`
    SELECT p.* 
    FROM packages p
    JOIN package_products pp ON p.id = pp.package_id
    WHERE pp.product_id = ? AND p.is_active = 1
    AND (p.start_date IS NULL OR p.start_date <= NOW())
    AND (p.end_date IS NULL OR p.end_date >= NOW())
    ORDER BY p.priority DESC
  `, [product.id]);

  const packages = packageRows;

  if (packages.length > 0) {
    const packageIds = packages.map(p => p.id);
    const [productsRows] = await pool.query<any[]>(`
      SELECT pp.package_id, p.id, p.name, p.slug, p.price, p.image, p.stockCount, p.availability
      FROM package_products pp
      JOIN products p ON pp.product_id = p.id
      WHERE pp.package_id IN (?)
      ORDER BY pp.sort_order ASC
    `, [packageIds]);

    const productsByPackageId = productsRows.reduce((acc, row) => {
      if (!acc[row.package_id]) acc[row.package_id] = [];
      acc[row.package_id].push(row);
      return acc;
    }, {});

    for (const pkg of packages) {
      pkg.products = productsByPackageId[pkg.id] || [];
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker type="product" id={product.id} />
      <ProductPageClient product={product} related={related} packages={packages} />
    </>
  );
}
