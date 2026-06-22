import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Warranty Claim | Octane Powersports",
};

export default function WarrantyClaimPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] pb-24">
      {/* Premium Hero */}
      <div className="pt-36 pb-20 bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">
            <Link href="/" className="hover:text-[#FF6B00] transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-[#FF6B00]">Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase text-gray-900" style={{ fontFamily: 'var(--font-bebas-neue), sans-serif', letterSpacing: '0.02em' }}>
            WARRANTY <span className="text-[#FF6B00]">CLAIM</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            We stand behind the premium quality of the parts we sell. Follow this simple process to initiate a claim.
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
                Eligibility Guidelines
              </h2>
              <p className="leading-relaxed">Warranty claims are strictly subject to the original manufacturer's terms and conditions. Warranties typically cover manufacturing defects and do not cover damage caused by improper installation, misuse, racing applications, or normal wear and tear.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                How to Submit a Claim
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="text-[#FF6B00] font-black text-3xl mb-2">01</div>
                  <h3 className="font-bold text-gray-900 mb-2">Gather Details</h3>
                  <p className="text-sm">Collect your original purchase invoice and order number.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="text-[#FF6B00] font-black text-3xl mb-2">02</div>
                  <h3 className="font-bold text-gray-900 mb-2">Take Photos</h3>
                  <p className="text-sm">Take clear photographs or videos demonstrating the defect clearly.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="text-[#FF6B00] font-black text-3xl mb-2">03</div>
                  <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-sm">Send everything to <a href="mailto:info@octaneps.com" className="text-[#FF6B00] font-semibold hover:underline">info@octaneps.com</a>.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                Processing Timeline
              </h2>
              <p className="leading-relaxed">Once we receive your claim, we will liaise directly with the manufacturer on your behalf. Please allow 7-14 business days for the manufacturer to review the claim. If approved, we will provide you with a replacement or repair instructions as per the manufacturer's policy.</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
