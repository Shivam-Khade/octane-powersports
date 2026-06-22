import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy | Octane Powersports",
};

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pb-24">
      {/* Premium Hero */}
      <div className="pt-36 pb-20 bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-[#FF6B00]">Policies</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase text-gray-900" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', letterSpacing: '0.02em' }}>
            SHIPPING <span className="text-[#FF6B00]">POLICY</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            Everything you need to know about how we handle, dispatch, and securely deliver your premium motorcycle parts.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="container mx-auto px-6 max-w-4xl -mt-8 relative z-20">
        <div className="bg-white p-8 md:p-14 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="prose prose-lg max-w-none text-gray-600 space-y-10">
            
            <p className="text-xl leading-relaxed text-gray-800 font-medium">
              At Octane Powersports, we strive to deliver your premium motorcycle parts as quickly and safely as possible. We offer seamless Pan India delivery through our trusted courier partners.
            </p>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                Processing Time
              </h2>
              <p className="leading-relaxed">All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                Shipping Rates & Estimates
              </h2>
              <p className="leading-relaxed">Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur based on weather or courier logistics.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                Order Tracking
              </h2>
              <p className="leading-relaxed">When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become active.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                Damaged Items
              </h2>
              <p className="leading-relaxed">In the rare event that your order arrives damaged, please email us within 48 hours at <a href="mailto:info@octaneps.com" className="text-[#FF6B00] font-bold hover:underline">info@octaneps.com</a> with your order number and clear photos of the item's condition.</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
