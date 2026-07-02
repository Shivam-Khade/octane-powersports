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
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#0a0a0a] bg-gray-100 hover:bg-[#ff6b00] hover:text-white rounded-lg transition-colors text-left uppercase tracking-wider"
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}
