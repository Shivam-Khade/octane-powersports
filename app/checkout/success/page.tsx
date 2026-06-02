import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import "./success.css";

export const metadata = {
  title: "Order Confirmed"
};

export default function SuccessPage() {
  return (
    <main className="success-page">
      <section className="success-card">
        <CheckCircle2 size={54} />
        <p className="eyebrow">Order confirmed</p>
        <h1>Your build is moving.</h1>
        <p>We’ll verify fitment and send dispatch details with installation notes.</p>
        <Link href="/shop" className="button">Continue Shopping</Link>
      </section>
    </main>
  );
}
