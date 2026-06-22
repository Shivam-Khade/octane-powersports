import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQs | Octane Powersports",
};

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pb-24">
      {/* Premium Hero */}
      <div className="pt-36 pb-20 bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest justify-center">
            <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-[#FF6B00]">Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase text-gray-900" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', letterSpacing: '0.02em' }}>
            FREQUENTLY ASKED <span className="text-[#FF6B00]">QUESTIONS</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            Got a question? We're here to help. Check out our most common questions below to find answers quickly.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 max-w-4xl mt-12 relative z-20">
        <div className="grid grid-cols-1 gap-6">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-gray-200 group-hover:bg-[#FF6B00] transition-colors"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 pl-4">Do you ship Pan India?</h3>
            <p className="text-gray-600 text-lg leading-relaxed pl-4">Yes, we deliver our premium motorcycle parts across all major pin codes in India with trusted logistics partners.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-gray-200 group-hover:bg-[#FF6B00] transition-colors"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 pl-4">How long will my order take to arrive?</h3>
            <p className="text-gray-600 text-lg leading-relaxed pl-4">Most orders are processed within 1-2 business days. Delivery typically takes 3-7 business days depending on your location and standard logistics conditions.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-gray-200 group-hover:bg-[#FF6B00] transition-colors"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 pl-4">Are your products authentic?</h3>
            <p className="text-gray-600 text-lg leading-relaxed pl-4">Absolutely! Octane Powersports only sources and sells 100% genuine and authentic parts directly from top global brands or their authorized distributors.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-gray-200 group-hover:bg-[#FF6B00] transition-colors"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 pl-4">How do I track my order?</h3>
            <p className="text-gray-600 text-lg leading-relaxed pl-4">Once your order has shipped, you will receive an email with tracking details. You can also view the status in the Orders section of your account.</p>
          </div>

        </div>
      </div>
    </main>
  );
}
