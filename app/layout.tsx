import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FooterWrapper } from "@/components/footer-wrapper";
import { CartDrawer } from "@/components/cart-drawer";
import { CursorGlow } from "@/components/cursor-glow";
import { WhatsappButton } from "@/components/whatsapp-button";
import { LoginModalProvider } from "@/components/login-context";
import { LoginModal } from "@/components/login-modal";
import { ProfileModalProvider } from "@/components/profile-context";
import { ProfileModal } from "@/components/profile-modal";
import { CartProvider } from "@/components/cart-context";
import NextAuthSessionProvider from "@/components/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import pool from "@/lib/db";

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
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Octane Powersports Logo"
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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

  let categories: any[] = [];
  let brands: string[] = [];
  let gridSettings = { 
    categoryDesktopCols: 4, 
    categoryMobileCols: 3,
    brandDesktopCols: 4,
    brandMobileCols: 3
  };
  try {
    const normalizeName = (name: string) => {
      if (name && name === name.toUpperCase() && name.length > 3) {
        return name.charAt(0) + name.slice(1).toLowerCase();
      }
      return name;
    };

    const [catRows] = await pool.query(`
      SELECT c.name as name, m.name as parent_group, m.sort_order 
      FROM categories c 
      LEFT JOIN menu_groups m ON c.menu_group_id = m.id 
      ORDER BY m.sort_order IS NULL, m.sort_order ASC, m.name ASC, c.name ASC
    `);
    
    const dbCategories = (catRows as any[]).map(c => ({
      name: normalizeName(c.name),
      parent_group: c.parent_group || 'OTHER'
    }));
    
    const [prodRows] = await pool.query('SELECT brand, category FROM products');
    const products = prodRows as any[];
    
    const productCategoriesSet = new Set<string>();
    products.forEach(p => {
      if (p.category) {
        p.category.split(',').forEach((c: string) => productCategoriesSet.add(normalizeName(c.trim())));
      }
    });

    const categoriesList = [...dbCategories];
    productCategoriesSet.forEach(catName => {
      if (catName && !categoriesList.some(c => c.name === catName)) {
        categoriesList.push({ name: catName, parent_group: 'OTHER' });
      }
    });
    
    categories = categoriesList;
    
    const [brandRows] = await pool.query('SELECT name FROM brands ORDER BY name ASC');
    brands = (brandRows as any[]).map(b => b.name);

    const [settingsRows] = await pool.query('SELECT value_data FROM settings WHERE key_name = ?', ['navigation_grid']);
    if ((settingsRows as any[])[0]?.value_data) {
      const data = (settingsRows as any[])[0].value_data;
      gridSettings = {
        categoryDesktopCols: data.categoryDesktopCols || data.desktopColumns || 4,
        categoryMobileCols: data.categoryMobileCols || data.mobileColumns || 3,
        brandDesktopCols: data.brandDesktopCols || data.desktopColumns || 4,
        brandMobileCols: data.brandMobileCols || data.mobileColumns || 3,
      };
    }
  } catch (error) {
    console.error("Failed to fetch brands/categories for layout:", error);
  }

  return (
    <html 
      lang="en" 
      className={`${bebasNeue.variable} ${montserrat.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem("splash_shown") || window.location.pathname !== '/') {
                  document.documentElement.classList.add("skip-splash");
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <NextAuthSessionProvider session={session}>
          <CartProvider session={session}>
            <LoginModalProvider>
              <ProfileModalProvider>
                <div id="root-wrapper" style={{ overflowX: 'clip', width: '100%', position: 'relative' }}>
                  <Toaster containerClassName="custom-toaster" position="top-right" toastOptions={{ duration: 3000, style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333' } }} />
                  <CursorGlow />
                  <Header session={session} categories={categories} brands={brands} gridSettings={gridSettings} />
                  {children}
                  <FooterWrapper>
                    <Footer />
                  </FooterWrapper>
                  <WhatsappButton />
                  <CartDrawer />
                  <LoginModal />
                  <ProfileModal />
                </div>
              </ProfileModalProvider>
            </LoginModalProvider>
          </CartProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
