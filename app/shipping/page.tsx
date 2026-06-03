export const metadata = {
  title: "Shipping Information"
};

export default function ShippingPage() {
  return (
    <main className="container" style={{ padding: '120px 20px', minHeight: '60vh' }}>
      <h1>Shipping Information</h1>
      <p style={{ marginTop: '20px', maxWidth: '800px', lineHeight: '1.6' }}>
        Priority shipping across India. Same-day dispatch on all in-stock orders placed before 2 PM. 
        Most orders arrive within 2-5 business days depending on location.
      </p>
    </main>
  );
}
