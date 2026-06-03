import { products } from "@/lib/data";
import { ShopPageClient } from "./shop-page-client";

export const metadata = {
  title: "Shop Premium Superbike Parts"
};

export default function ShopPage() {
  return <ShopPageClient initialProducts={products} />;
}
