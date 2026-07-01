"use client";

import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { useCart } from "@/components/cart-context";

export default function PackageCard({ pkg }: { pkg: any }) {
  const { addPackageToCart } = useCart();
  
  const originalTotal = pkg.products?.reduce((sum: number, p: any) => sum + Number(p.price || 0), 0) || 0;
  const discountAmount = pkg.discount_type === 'percentage' 
    ? (originalTotal * Number(pkg.discount_value)) / 100 
    : Number(pkg.discount_value);
  const finalPrice = Math.max(0, originalTotal - discountAmount);
  const hasOutOfStock = pkg.products?.some((p: any) => p.stockCount === 0 || p.availability === 'Out of Stock');

  const handleTrackClick = () => {
    fetch('/api/packages/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: pkg.id, action: 'clicks' })
    }).catch(() => {});
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      {pkg.discount_type === 'percentage' && (
        <div className="absolute top-4 right-4 z-10 bg-[#ff6b00] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg transform rotate-3">
          Save {pkg.discount_value}%
        </div>
      )}
      
      <Link href={`/packages/${pkg.slug}`} onClick={handleTrackClick} className="block relative overflow-hidden aspect-[2/1] sm:aspect-video bg-gray-100">
        {pkg.banner ? (
          <img src={pkg.banner} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white w-full">
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">{pkg.name}</h3>
        </div>
      </Link>
      
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">{pkg.description}</p>
        
        {/* Included Products Thumbnails */}
        <div className="mb-6 flex-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Includes {pkg.products?.length || 0} Items</p>
          <div className="flex flex-wrap items-center gap-2">
            {pkg.products?.map((product: any, index: number) => (
              <React.Fragment key={product.id}>
                <Link href={`/product/${product.slug}`} className="relative group/thumb block">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <Package size={16} className="text-gray-400" />
                    </div>
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/thumb:opacity-100 transition-opacity pointer-events-none z-10">
                    {product.name}
                  </div>
                </Link>
                {index < pkg.products.length - 1 && (
                  <span className="text-gray-300 font-bold">+</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-gray-400 line-through">₹{originalTotal.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl sm:text-3xl font-black text-[#ff6b00]">₹{finalPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">You Save</p>
              <p className="text-sm sm:text-lg font-black text-green-600">₹{discountAmount.toFixed(2)}</p>
            </div>
          </div>
          
          <button 
            onClick={() => addPackageToCart(pkg)}
            disabled={hasOutOfStock}
            className={`w-full py-3 sm:py-4 px-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              hasOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#0a0a0a] text-white hover:bg-[#ff6b00] hover:shadow-lg hover:shadow-[#ff6b00]/30 active:scale-95'
            }`}
          >
            {hasOutOfStock ? 'Currently Unavailable' : 'Add Complete Package'}
          </button>
        </div>
      </div>
    </div>
  );
}
