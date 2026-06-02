import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";

export const metadata: Metadata = {
  metadataBase: new URL("https://octanepowersports.com"),
  title: {
    default: "Octane Powersports | Premium Motorcycle Parts & Accessories",
    template: "%s | Octane Powersports"
  },
  description:
    "Premium motorcycle accessories, exhaust systems, protection parts, electronics and performance upgrades for riders who demand more.",
  openGraph: {
    title: "Octane Powersports",
    description: "Premium motorcycle parts and accessories for performance riders.",
    url: "https://octanepowersports.com",
    siteName: "Octane Powersports",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Premium motorcycle exhaust and performance parts"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Octane Powersports",
    url: "https://octanepowersports.com",
    logo: "https://octanepowersports.com/logo.png",
    sameAs: ["https://www.instagram.com/octanepowersports"]
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Header />
        {children}
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
