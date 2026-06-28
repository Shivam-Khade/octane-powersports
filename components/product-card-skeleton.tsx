export function ProductCardSkeleton() {
  return (
    <article className="product-card" style={{ pointerEvents: 'none', background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="product-image-wrap" style={{ background: 'var(--surface)', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div className="product-body" style={{ gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '40%', height: '12px', background: '#e5e5e5', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          <div style={{ width: '20%', height: '12px', background: '#e5e5e5', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
        </div>
        <div style={{ width: '90%', height: '20px', background: '#d4d4d4', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '60%', height: '20px', background: '#d4d4d4', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
        
        <div style={{ width: '70%', height: '12px', background: '#e5e5e5', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out', marginTop: '4px' }} />

        <div className="product-footer" style={{ borderTopColor: 'var(--border)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ width: '80px', height: '24px', background: '#d4d4d4', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
            <div style={{ width: '100px', height: '10px', background: '#e5e5e5', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }} />
          </div>
          <div style={{ width: '44px', height: '44px', background: '#d4d4d4', borderRadius: '8px', animation: 'pulse 1.5s infinite ease-in-out' }} />
        </div>
      </div>
    </article>
  );
}
