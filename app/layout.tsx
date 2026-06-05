import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { CursorGlow } from "@/components/cursor-glow";
import { LoginModalProvider } from "@/components/login-context";
import { LoginModal } from "@/components/login-modal";
import { ProfileModalProvider } from "@/components/profile-context";
import { ProfileModal } from "@/components/profile-modal";
import { CartProvider } from "@/components/cart-context";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "react-hot-toast";

// Configure Next.js font loading
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://octanepowersports.in"),
  title: {
    default: "Octane Powersports | Premium Motorcycle Gear & Performance Parts India",
    template: "%s | Octane Powersports"
  },
  description:
    "India's premium motorcycle accessories store — exhausts, protection parts, tyres and accessories from KTM, Triumph, Ducati, Kawasaki, BMW and more. Pan India delivery.",
  keywords: ["motorcycle accessories India", "performance exhaust", "protection parts", "KTM accessories", "superbike parts India"],
  openGraph: {
    title: "Octane Powersports — Ride Harder. Explore Further.",
    description: "Premium motorcycle accessories, exhausts and performance parts for riders who demand more.",
    url: "https://octanepowersports.in",
    siteName: "Octane Powersports",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Premium motorcycle helmets and riding gear — Octane Powersports"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Octane Powersports",
    url: "https://octanepowersports.in",
    logo: "https://octanepowersports.in/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9876543210",
      contactType: "customer support",
      areaServed: "IN"
    },
    sameAs: [
      "https://www.instagram.com/octanepowersports",
      "https://www.youtube.com/@octanepowersports"
    ]
  };

  const session = await getServerSession(authOptions);

  return (
    <html 
      lang="en" 
      className={`${bebasNeue.variable} ${montserrat.variable} ${inter.variable}`}
      style={{ scrollBehavior: "smooth" }}
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <CartProvider>
          <LoginModalProvider>
            <ProfileModalProvider>
              <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333' } }} />
              <CursorGlow />
              <Header session={session} />
              {children}
              <Footer />
              <CartDrawer />
              <LoginModal />
              <ProfileModal />
            </ProfileModalProvider>
          </LoginModalProvider>
        </CartProvider>
      </body>
    </html>
  );
}
