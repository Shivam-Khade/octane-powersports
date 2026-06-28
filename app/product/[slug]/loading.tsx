import "./product.css";

export default function ProductLoading() {
  return (
    <main>
      <div className="product-breadcrumb">
        <div className="container product-breadcrumb-inner" style={{ height: '24px', opacity: 0.6 }}>
          <div style={{ width: '250px', height: '14px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
        </div>
      </div>
      <section className="product-section">
        <div className="container product-layout">
          <div className="product-gallery">
            <div className="gallery-main" style={{ background: 'rgba(0,0,0,0.03)', animation: 'pulse 1.5s infinite ease-in-out', borderRadius: '12px' }} />
            <div className="gallery-thumbs" style={{ marginTop: '16px' }}>
               {[1,2,3,4].map(i => <div key={i} style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', animation: 'pulse 1.5s infinite ease-in-out' }} />)}
            </div>
          </div>
          <aside className="purchase-panel">
            <div style={{ width: '120px', height: '16px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '16px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '85%', height: '48px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', marginBottom: '24px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '200px', height: '24px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '24px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '150px', height: '36px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', marginBottom: '32px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '100%', height: '80px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', marginBottom: '32px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '100%', height: '56px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          </aside>
        </div>
      </section>
    </main>
  );
}
