import Link from "next/link";
import { Share2, Play, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { brands } from "@/lib/data";
import pool from "@/lib/db";
import "./footer.css";

const socials = [
  { icon: ExternalLink, href: "https://instagram.com/octanepowersports", label: "Instagram" },
  { icon: Play, href: "https://youtube.com/@octanepowersports", label: "YouTube" },
  { icon: Share2, href: "#", label: "Facebook" },
  { icon: ExternalLink, href: "#", label: "X / Twitter" }
];

export async function Footer() {
  let categories: string[] = [];
  try {
    const [rows] = await pool.query("SELECT name FROM categories ORDER BY featured DESC LIMIT 8");
    categories = (rows as any[]).map(r => r.name);
  } catch(e) {}

  return (
    <footer className="footer">
      {/* Main Grid */}
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Octane Powersports">
            <span className="footer-logo-main">OCTANE</span>
            <small className="footer-logo-sub">POWERSPORTS</small>
          </Link>
          <p className="footer-brand-desc">
            India's premium motorcycle parts store. Authentic products, expert support, and Pan India delivery.
          </p>
          <div className="footer-contact">
            <a href="tel:+917420949711" className="footer-contact-link">
              <Phone size={14} /> +91 7420949711
            </a>
            <a href="mailto:info@octaneps.com" className="footer-contact-link">
              <Mail size={14} /> info@octaneps.com
            </a>
            <span className="footer-contact-link">
              <MapPin size={14} /> Shop no 5, 30/8A/1 Ramwadi, Pune 411014
            </span>
          </div>
          <div className="footer-socials">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label={label}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div className="footer-col">
          <h3 className="footer-col-title">Shop</h3>
          {categories.map((item) => (
            <Link key={item} href={`/shop?category=${encodeURIComponent(item)}`} className="footer-link">
              {item}
            </Link>
          ))}
        </div>

        {/* Brands */}
        <div className="footer-col">
          <h3 className="footer-col-title">Brands</h3>
          {brands.map((item) => (
            <Link key={item} href={`/shop?brand=${encodeURIComponent(item)}`} className="footer-link">
              {item}
            </Link>
          ))}
        </div>

        {/* Support */}
        <div className="footer-col">
          <h3 className="footer-col-title">Support</h3>
          {[
            { label: "Service Booking", href: "/service-booking" },
            { label: "Track Your Order", href: "/account" },
            { label: "Shipping Info", href: "#" },
            { label: "Returns Policy", href: "#" },
            { label: "Fitment Help", href: "#" },
            { label: "Contact Us", href: "/contact" },
            { label: "FAQs", href: "#" }
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="footer-link">{label}</Link>
          ))}
        </div>

        {/* Company */}
        <div className="footer-col">
          <h3 className="footer-col-title">Company</h3>
          {[
            { label: "About Us", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Blog & Journal", href: "/blog" },
            { label: "Press", href: "#" },
            { label: "Affiliates", href: "#" }
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="footer-link">{label}</Link>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span className="footer-copy">© 2026 Octane Powersports LLP. All rights reserved.</span>
          <div className="footer-payments">
            <span className="payment-badge">UPI</span>
            <span className="payment-badge">Visa</span>
            <span className="payment-badge">Mastercard</span>
            <span className="payment-badge">RuPay</span>
            <span className="payment-badge">EMI</span>
          </div>
          <div className="footer-legal">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
