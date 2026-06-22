import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Octane Powersports",
};

export default function TermsPage() {
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
            TERMS <span className="text-[#FF6B00]">&</span> CONDITIONS
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            These terms and conditions outline the rules, regulations, and guidelines for the use of our Website and services.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="container mx-auto px-6 max-w-4xl -mt-8 relative z-20">
        <div className="bg-white p-8 md:p-14 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="prose prose-lg max-w-none text-gray-600 space-y-10">
            
            <div className="pt-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                1. General Overview
              </h2>
              <p className="leading-relaxed">By accessing this website we assume you accept these terms and conditions. Do not continue to use Octane Powersports if you do not agree to take all of the terms and conditions stated on this page.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                2. Products and Pricing
              </h2>
              <p className="leading-relaxed">All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                3. Governing Law
              </h2>
              <p className="leading-relaxed">These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
