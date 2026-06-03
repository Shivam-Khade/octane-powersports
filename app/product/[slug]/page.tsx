import { products } from "@/lib/data";
import { ProductPageClient } from "./product-page-client";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return {
    title: product ? `${product.name} — Buy Online India` : "Product",
    description: product
      ? `Buy ${product.name} by ${product.brand} online in India. Genuine product with fast Pan India delivery and easy returns.`
      : "Premium motorcycle gear and accessories"
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const related = products.filter((item) => item.slug !== product.slug).slice(0, 4);

  return <ProductPageClient product={product} related={related} />;
}
