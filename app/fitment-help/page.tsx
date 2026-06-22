import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Fitment Help | Octane Powersports",
};

export default function FitmentHelpPage() {
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
            FITMENT <span className="text-[#FF6B00]">HELP</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            Not sure if a part will fit your specific motorcycle? Our expert team is here to help you get the right part, the first time.
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
                Check Product Details
              </h2>
              <p className="leading-relaxed">Always review the "Fitment" or "Compatibility" section on the product page. We meticulously list the specific makes, models, and years that our products are compatible with to ensure you make an informed purchase.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                Contact Us for Assistance
              </h2>
              <p className="leading-relaxed mb-6">If you're still not sure, don't guess! Contact our support team with your motorcycle's exact Make, Model, and Year, along with the part you are interested in.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center">
                  <div className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">WhatsApp Us</div>
                  <a href="https://wa.me/917420949711" className="text-2xl font-black italic text-[#FF6B00] hover:opacity-80 transition-opacity">
                    +91 7420949711
                  </a>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center">
                  <div className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Email Support</div>
                  <a href="mailto:info@octaneps.com" className="text-xl font-bold text-gray-900 hover:text-[#FF6B00] transition-colors">
                    info@octaneps.com
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
