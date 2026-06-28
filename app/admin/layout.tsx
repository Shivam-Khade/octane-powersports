import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/sign-out-button";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  CalendarCheck, 
  ShoppingCart,
  LogOut,
  Settings,
  BarChart3,
  Users
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-[#f8f8f8]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] text-white flex flex-col h-full sticky top-0">
        <div className="p-6">
          <Link href="/admin" className="text-2xl font-black tracking-tighter uppercase text-white hover:text-[#ff6b00] transition-colors flex flex-col leading-none">
            OCTANE
            <span className="text-[#ff6b00] text-sm tracking-[0.2em] -mt-1">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/admin" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <LayoutDashboard size={18} className="text-[#ff6b00]" /> Dashboard
          </Link>
          <Link href="/admin/analytics" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <BarChart3 size={18} className="text-[#ff6b00]" /> Analytics
          </Link>
          <Link href="/admin/products" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <Package size={18} className="text-[#ff6b00]" /> Products
          </Link>
          <Link href="/admin/categories" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <LayoutDashboard size={18} className="text-[#ff6b00]" /> Categories
          </Link>
          <Link href="/admin/brands" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <Package size={18} className="text-[#ff6b00]" /> Brands
          </Link>
          <Link href="/admin/orders" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <ShoppingCart size={18} className="text-[#ff6b00]" /> Orders
          </Link>
          <Link href="/admin/bookings" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <CalendarCheck size={18} className="text-[#ff6b00]" /> Service Bookings
          </Link>
          <Link href="/admin/blogs" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <FileText size={18} className="text-[#ff6b00]" /> Blog Posts
          </Link>
          <Link href="/admin/users" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <Users size={18} className="text-[#ff6b00]" /> Users
          </Link>
          <Link href="/admin/settings" prefetch={false} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium text-sm">
            <Settings size={18} className="text-[#ff6b00]" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#ff6b00]">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
