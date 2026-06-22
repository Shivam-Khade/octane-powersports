import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Octane Powersports",
};

export default function PrivacyPolicyPage() {
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
            PRIVACY <span className="text-[#FF6B00]">POLICY</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            How your personal information is collected, used, and shared when you visit or make a purchase from Octane Powersports.
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
                Personal Information We Collect
              </h2>
              <p className="leading-relaxed">When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                How We Use Your Data
              </h2>
              <p className="leading-relaxed">We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to communicate with you and screen our orders for potential risk or fraud.</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-5 flex items-center gap-4">
                <span className="w-8 h-1 bg-[#FF6B00] inline-block rounded-full"></span>
                Data Retention
              </h2>
              <p className="leading-relaxed">When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
