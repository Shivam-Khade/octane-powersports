import Link from "next/link";
import { categories, brands } from "@/lib/data";
import "./footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="logo">
            <span>OCTANE</span>
            <small>POWERSPORTS</small>
          </Link>
          <p>Premium motorcycle accessories, performance upgrades and service support for serious riders.</p>
        </div>
        <div>
          <h3>Categories</h3>
          {categories.slice(0, 8).map((item) => <Link key={item} href="/shop">{item}</Link>)}
        </div>
        <div>
          <h3>Brands</h3>
          {brands.map((item) => <Link key={item} href="/shop">{item}</Link>)}
        </div>
        <div>
          <h3>Support</h3>
          {["Service Booking", "Shipping", "Returns", "Fitment Help"].map((item) => (
            <Link key={item} href={item === "Service Booking" ? "/service-booking" : "/shop"}>{item}</Link>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Octane Powersports</span>
        <span>Built for superbike, track and street riders.</span>
      </div>
    </footer>
  );
}
