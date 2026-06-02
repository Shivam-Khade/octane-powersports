import { CheckCircle2 } from "lucide-react";
import "./checkout.css";

export const metadata = {
  title: "Checkout"
};

export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <section className="container checkout-grid">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Complete your order.</h1>
          <div className="steps">
            {["Address", "Shipping", "Payment", "Review"].map((step, index) => (
              <div className="step" key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
          <form className="checkout-form">
            <input suppressHydrationWarning placeholder="Full name" />
            <input suppressHydrationWarning placeholder="Phone" />
            <input suppressHydrationWarning placeholder="Address" className="full" />
            <input suppressHydrationWarning placeholder="City" />
            <input suppressHydrationWarning placeholder="Postal code" />
            <button suppressHydrationWarning className="button full">Continue To Shipping</button>
          </form>
        </div>
        <aside className="order-summary">
          <h2>Order summary</h2>
          <div><span>Akrapovic Slip-On Titanium Exhaust</span><strong>$1,199</strong></div>
          <div><span>Shipping</span><strong>Free</strong></div>
          <div><span>Estimated tax</span><strong>$96</strong></div>
          <div className="total"><span>Total</span><strong>$1,295</strong></div>
          <p><CheckCircle2 size={18} /> Secure checkout with fitment support before dispatch.</p>
        </aside>
      </section>
    </main>
  );
}
