"use client";

import { usePathname } from "next/navigation";

export function StoreLayoutElements({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide store layout elements on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  
  return <>{children}</>;
}
