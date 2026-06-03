import { Heart, MapPin, Package, UserRound } from "lucide-react";
import "./account.css";

export const metadata = {
  title: "Account"
};

const accountSections = [
  { title: "Profile", text: "Bike garage, fitment preferences and rider details.", Icon: UserRound },
  { title: "Order History", text: "Track recent orders, invoices and returns.", Icon: Package },
  { title: "Addresses", text: "Manage shipping and billing addresses.", Icon: MapPin }
];

export default function AccountPage() {
  return (
    <main className="account-page">
      <section className="container account-shell">
        <div className="account-panel">
          <p className="eyebrow">Rider account</p>
          <h1>Welcome back.</h1>
          <form className="login-form">
            <input suppressHydrationWarning placeholder="Email" type="email" aria-label="Email" />
            <input suppressHydrationWarning placeholder="Password" type="password" aria-label="Password" />
            <button suppressHydrationWarning className="button">Login</button>
            <button suppressHydrationWarning className="button secondary" type="button">Register</button>
          </form>
        </div>
        <div className="account-grid">
          {accountSections.map(({ title, text, Icon }) => (
            <div className="account-card" id={title === "Wishlist" ? "wishlist" : undefined} key={title}>
              <Icon size={26} />
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
