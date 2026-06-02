import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Wrench, Sparkles } from "lucide-react";
import { brands, categoryCards, products, posts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { HeroCinematic } from "@/components/hero-cinematic";
import "./home.css";

const reasons = [
  { title: "Fitment verified", text: "Parts matched by bike model, riding use and installation requirements.", Icon: ShieldCheck },
  { title: "Fast dispatch", text: "Priority shipping on stocked premium parts with clear availability.", Icon: Truck },
  { title: "Service support", text: "Booking support for installations, checks and maintenance.", Icon: Wrench },
  { title: "Curated quality", text: "No filler inventory; every product earns its place.", Icon: Sparkles }
];

export default function HomePage() {
  return (
    <main>
      <HeroCinematic />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Shop by category</p>
              <h2>Purpose-built superbike upgrades, arranged by system.</h2>
            </div>
            <p>Every category is selected around fitment confidence, premium material quality and the kind of finishing detail superbike riders notice.</p>
          </div>
          <div className="category-grid">
            {categoryCards.map((category) => (
              <Reveal key={category.title} className="category-card">
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 900px) 100vw, 25vw" />
                <div>
                  <h3>{category.title}</h3>
                  <p>{category.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="brands">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured brands</p>
              <h2>Factory-grade names for serious machines.</h2>
            </div>
          </div>
          <div className="brand-strip">
            {brands.map((brand) => <span key={brand}>{brand}</span>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Best sellers</p>
              <h2>Proven superbike upgrades riders keep coming back for.</h2>
            </div>
            <Link href="/shop" className="button secondary">View All</Link>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>

      <section className="upgrade-band">
        <div className="container upgrade-grid">
          <div>
            <p className="eyebrow">Popular upgrades</p>
            <h2>Build a cleaner cockpit, sharper brakes and a better-sounding superbike.</h2>
          </div>
          <div className="upgrade-list">
            {["Track-day brake kit", "Street lighting system", "Race tail package", "Carbon exhaust package"].map((item) => (
              <Link href="/shop" key={item}>{item}<ArrowRight size={18} /></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container why-grid">
          {reasons.map(({ title, text, Icon }) => (
            <div className="why-card" key={title}>
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section alt">
        <div className="container review-blog-grid">
          <div className="reviews">
            <p className="eyebrow">Customer reviews</p>
            <h2>“The parts arrived fast, fit perfectly and made the bike feel properly finished.”</h2>
            <p>Arjun M. · Ducati Panigale V4</p>
          </div>
          <div>
            <p className="eyebrow">From the journal</p>
            {posts.map((post) => (
              <Link className="post-row" href={`/blog/${post.slug}`} key={post.slug}>
                <Image src={post.image} alt={post.title} width={128} height={86} />
                <div>
                  <span>{post.category}</span>
                  <strong>{post.title}</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container newsletter-inner">
          <div>
            <p className="eyebrow">Octane insider</p>
            <h2>New drops, fitment guides and rider edits.</h2>
          </div>
          <form>
            <input suppressHydrationWarning aria-label="Email address" placeholder="Email address" type="email" />
            <button suppressHydrationWarning className="button">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}
