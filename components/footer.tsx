import Link from "next/link";
import { Share2, Mail, Phone, MapPin } from "lucide-react";
import "./footer.css";

const InstagramIcon = ({ size = 24, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ size = 24, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6C3.9 20 2.5 18.6 2.5 16.9V7.1z"/>
    <path d="m9.5 15.5 6-3.5-6-3.5v7z"/>
  </svg>
);

const socials = [
  { icon: Share2, href: "https://api.whatsapp.com/send?text=Check%20out%20Octane%20Powersports:%20https://octaneps.com", label: "Share on WhatsApp" },
  { icon: InstagramIcon, href: "https://instagram.com/octanepowersports", label: "Instagram" },
  { icon: YoutubeIcon, href: "https://youtube.com/@octanepowersports", label: "YouTube" }
];

export function Footer() {
  return (
    <footer className="footer">
      {/* Main Grid */}
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Octane Powersports">
            <img src="/logo.png" alt="Octane Powersports" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <p className="footer-brand-desc">
            India's premium motorcycle parts store. Authentic products, expert support, and Pan India delivery.
          </p>
          <div className="footer-socials">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label={label}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="footer-col">
          <h3 className="footer-col-title">CONTACT INFORMATION</h3>
          <div className="footer-contact-text">
            <p>Phone: +91 7420949711</p>
            <p>Email: info@octaneps.com</p>
            <p>Shop no 5, 30/8A/1 Ramwadi,<br/>Pune 411014</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3 className="footer-col-title">QUICK LINKS</h3>
          {[
            { label: "Shipping Policy", href: "/shipping-policy" },
            { label: "Warranty Claim Process", href: "/warranty-claim" },
            { label: "Service Booking", href: "/service-booking" },
            { label: "Track Your Order", href: "/orders" },
            { label: "Fitment Help", href: "/fitment-help" }
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="footer-link">{label}</Link>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span className="footer-copy">© 2026 Octane Powersports LLP. All rights reserved.</span>
          <div className="footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/faqs">FAQs</Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/917420949711" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </footer>
  );
}
