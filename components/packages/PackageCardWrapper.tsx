"use client";

import { useCart } from "@/components/cart-context";

export default function PackageCardWrapper({ pkg }: { pkg: any }) {
  const { addPackageToCart } = useCart();
  const hasOutOfStock = pkg.products?.some((p: any) => p.stockCount === 0 || p.availability === 'Out of Stock');

  return (
    <button 
      onClick={() => addPackageToCart(pkg)}
      disabled={hasOutOfStock}
      className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all duration-300 ${
        hasOutOfStock
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-[#ff6b00] text-white hover:bg-white hover:text-[#0a0a0a] shadow-lg shadow-[#ff6b00]/30 active:scale-95'
      }`}
    >
      {hasOutOfStock ? 'Unavailable' : 'Add Complete Package'}
    </button>
  );
}
