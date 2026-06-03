import { Suspense } from "react";
import { products } from "@/lib/data";
import { ShopPageClient } from "./shop-page-client";

export const metadata = {
  title: "Shop Premium Superbike Parts"
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{height: "100vh"}}></div>}>
      <ShopPageClient initialProducts={products} />
    </Suspense>
  );
}
