"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button 
      onClick={() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("octane_cart");
          sessionStorage.removeItem("octane_session_active");
        }
        signOut({ callbackUrl: '/' });
      }}
      className="flex items-center gap-3 w-full px-4 py-2 mt-2 text-sm font-bold text-[#0a0a0a] bg-white hover:bg-red-500 hover:text-white rounded-lg transition-colors text-left uppercase tracking-wider"
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}
