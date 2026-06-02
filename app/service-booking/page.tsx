import "./service.css";

export const metadata = {
  title: "Service Booking"
};

export default function ServiceBookingPage() {
  return (
    <main className="service-page">
      <section className="container service-grid">
        <div>
          <p className="eyebrow">Service booking</p>
          <h1>Book installation, fitment checks or maintenance support.</h1>
          <p>Share your bike model and preferred service date. Our team will confirm fitment, availability and next steps.</p>
        </div>
        <form className="service-form">
          {[
            ["Name", "text"],
            ["Phone", "tel"],
            ["Email", "email"],
            ["Bike Model", "text"],
            ["Preferred Date", "date"]
          ].map(([label, type]) => (
            <label key={label}>{label}<input suppressHydrationWarning type={type} /></label>
          ))}
          <label>Service Type
            <select defaultValue="Installation">
              {["Installation", "Maintenance", "Fitment Check", "Performance Upgrade"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="full">Additional Notes<textarea suppressHydrationWarning rows={5} /></label>
          <button suppressHydrationWarning className="button">Request Booking</button>
        </form>
      </section>
    </main>
  );
}
