import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import "./footer.css";

const WhatsAppShareIcon = ({ size = 28, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#waShareGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <defs>
      <linearGradient id="waShareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#25D366" />
        <stop offset="100%" stopColor="#128C7E" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const InstagramIcon = ({ size = 28, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <defs>
      <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
    <rect width="20" height="20" x="2" y="2" rx="6" ry="6" fill="url(#igGradient)"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="white" strokeWidth="2" fill="none"/>
    <rect x="6" y="6" width="12" height="12" rx="3" stroke="white" strokeWidth="2" fill="none"/>
    <circle cx="16.5" cy="7.5" r="1.2" fill="white"/>
  </svg>
);

const YoutubeIcon = ({ size = 28, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
    <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const socials = [
  { icon: WhatsAppShareIcon, href: "https://api.whatsapp.com/send?text=Check%20out%20Octane%20Powersports:%20https://octaneps.com", label: "Share on WhatsApp" },
  { icon: InstagramIcon, href: "https://www.instagram.com/octaneps", label: "Instagram" },
  { icon: YoutubeIcon, href: "https://youtube.com/@octanepowersports", label: "YouTube" }
];

export function Footer() {
  return (
    <footer className="footer">
      {/* Main Grid */}
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Octane Powersports" style={{ position: 'relative', display: 'block', width: 'fit-content' }}>
            <img src="/logo.png" alt="Octane Powersports" style={{ height: '44px', width: 'auto', objectFit: 'contain', display: 'block' }} />
            <img src="/logo.png" alt="" aria-hidden="true" style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              height: '44px', 
              width: '100%', 
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              clipPath: 'inset(52% 0 0 0)',
              pointerEvents: 'none'
            }} />
          </Link>
          <p className="footer-brand-desc">
            India's premium motorcycle parts store. Authentic products, expert support, and Pan India delivery.
          </p>
          <div className="footer-socials">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label={label}>
                <Icon size={28} />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="footer-col">
          <h3 className="footer-col-title">CONTACT INFORMATION</h3>
          <div className="footer-contact-text">
            <p>Phone: +91 7420949711 / +91 7420919711</p>
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
          <span className="footer-copy">© 2026 Octane <span style={{ color: '#ffffff', fontWeight: 'bold' }}>Powersports</span> LLP. All rights reserved.</span>
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
