import pool from "@/lib/db";
import { Package, ShoppingCart, CalendarCheck, FileText, Users, DollarSign, LayoutDashboard, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard - Octane"
};

export default async function AdminPage() {
  // Fetch high-level stats
  const [productCountResult] = await pool.query('SELECT COUNT(*) as count FROM products');
  const [orderCountResult] = await pool.query('SELECT COUNT(*) as count FROM orders');
  const [blogCountResult] = await pool.query('SELECT COUNT(*) as count FROM blogs');
  const [bookingCountResult] = await pool.query('SELECT COUNT(*) as count FROM service_bookings');
  const [userCountResult] = await pool.query('SELECT COUNT(*) as count FROM users');
  const [categoryCountResult] = await pool.query('SELECT COUNT(*) as count FROM categories');
  const [revenueResult] = await pool.query("SELECT SUM(total_amount) as total FROM orders WHERE status != 'Cancelled'");

  const productsCount = (productCountResult as any)[0].count;
  const ordersCount = (orderCountResult as any)[0].count;
  const blogsCount = (blogCountResult as any)[0].count;
  const bookingsCount = (bookingCountResult as any)[0].count;
  const usersCount = (userCountResult as any)[0].count;
  const categoriesCount = (categoryCountResult as any)[0].count;
  const totalRevenue = (revenueResult as any)[0].total || 0;

  // Fetch recent orders
  const [recentOrdersResult] = await pool.query(`
    SELECT o.id, o.total_amount, o.status, o.created_at, u.name as customer_name 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.id DESC LIMIT 5
  `);
  const recentOrders = recentOrdersResult as any[];

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tight text-[#0a0a0a]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here is what's happening today.</p>
      </div>
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Revenue Card (Special) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#0a0a0a] p-8 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b00] rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-[#ff6b00]">
                <DollarSign size={20} />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
            </div>
            <p className="text-5xl font-black text-white tracking-tight">₹{Number(totalRevenue).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Regular Stats */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-50 text-[#ff6b00] rounded-lg flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Orders</p>
          </div>
          <p className="text-3xl font-black text-[#0a0a0a]">{ordersCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-50 text-[#ff6b00] rounded-lg flex items-center justify-center">
              <CalendarCheck size={20} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Bookings</p>
          </div>
          <p className="text-3xl font-black text-[#0a0a0a]">{bookingsCount}</p>
        </div>

      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center"><Package size={20} /></div>
          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Products</p><p className="text-2xl font-black text-[#0a0a0a] leading-none">{productsCount}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center"><LayoutDashboard size={20} /></div>
          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Categories</p><p className="text-2xl font-black text-[#0a0a0a] leading-none">{categoriesCount}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center"><FileText size={20} /></div>
          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Articles</p><p className="text-2xl font-black text-[#0a0a0a] leading-none">{blogsCount}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center"><Users size={20} /></div>
          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Users</p><p className="text-2xl font-black text-[#0a0a0a] leading-none">{usersCount}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-black uppercase tracking-tight text-[#0a0a0a]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-[#ff6b00] flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Order ID</th>
                  <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Customer</th>
                  <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Amount</th>
                  <th className="p-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-400">No recent orders</td></tr>
                ) : recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm font-medium text-gray-500">#{order.id}</td>
                    <td className="p-4 font-bold text-[#0a0a0a]">{order.customer_name || 'Guest'}</td>
                    <td className="p-4 font-bold text-[#ff6b00]">₹{Number(order.total_amount).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00] rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
          <h2 className="text-lg font-black uppercase tracking-tight text-[#0a0a0a] mb-6 relative z-10">Quick Actions</h2>
          <div className="flex flex-col gap-3 relative z-10">
            <Link href="/admin/products" className="bg-white text-[#0a0a0a] border-2 border-gray-200 px-5 py-4 rounded-xl font-bold uppercase tracking-wide hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors text-sm flex items-center justify-between">
              <span>Manage Products</span>
              <Package size={16} />
            </Link>
            <Link href="/admin/categories" className="bg-white text-[#0a0a0a] border-2 border-gray-200 px-5 py-4 rounded-xl font-bold uppercase tracking-wide hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors text-sm flex items-center justify-between">
              <span>Edit Categories</span>
              <LayoutDashboard size={16} />
            </Link>
            <Link href="/admin/bookings" className="bg-white text-[#0a0a0a] border-2 border-gray-200 px-5 py-4 rounded-xl font-bold uppercase tracking-wide hover:border-[#ff6b00] hover:text-[#ff6b00] transition-colors text-sm flex items-center justify-between">
              <span>Review Bookings</span>
              <CalendarCheck size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
