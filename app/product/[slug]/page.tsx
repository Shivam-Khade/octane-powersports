import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Play, Star, ZoomIn } from "lucide-react";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import "./product.css";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return { title: product ? product.name : "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const related = products.filter((item) => item.slug !== product.slug).slice(0, 4);

  return (
    <main>
      <section className="product-detail container">
        <div className="gallery">
          {[product.image, ...related.slice(0, 3).map((item) => item.image)].map((image, index) => (
            <div className="gallery-tile" key={image}>
              <Image src={image} alt={`${product.name} view ${index + 1}`} fill sizes="(max-width: 900px) 100vw, 45vw" priority={index === 0} />
              <button suppressHydrationWarning className="icon-button" aria-label={index === 0 ? "Zoom image" : "Play product video"}>
                {index === 0 ? <ZoomIn size={18} /> : <Play size={18} />}
              </button>
            </div>
          ))}
        </div>

        <aside className="purchase-card">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.name}</h1>
          <div className="rating"><Star size={16} fill="currentColor" /> {product.rating} · 128 reviews</div>
          <p className="price">${product.price.toLocaleString()}</p>
          <p className="muted">Precision selected for fitment confidence, premium finish and rider-focused performance.</p>
          <div className="checks">
            {["In-stock dispatch", "Fitment verified", "Installation support"].map((item) => (
              <span key={item}><Check size={16} /> {item}</span>
            ))}
          </div>
          <button suppressHydrationWarning className="button">Add To Cart</button>
          <button suppressHydrationWarning className="button secondary">Add To Wishlist</button>
        </aside>
      </section>

      <section className="section alt">
        <div className="container product-tabs">
          <div>
            <p className="eyebrow">Description</p>
            <h2>Designed for riders who care about every contact point.</h2>
            <p>Built from premium materials and selected for exacting finish quality, this upgrade gives your machine a sharper presence while preserving real-world usability.</p>
          </div>
          <div className="specs">
            {[
              ["Category", product.category],
              ["Brand", product.brand],
              ["Availability", product.availability],
              ["Warranty", "12 months"],
              ["Support", "Fitment and service booking"]
            ].map(([label, value]) => (
              <div key={label}><span>{label}</span><strong>{value}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Frequently bought together</p>
              <h2>Complete the setup.</h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
