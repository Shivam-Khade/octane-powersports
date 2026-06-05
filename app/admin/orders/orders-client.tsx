"use client";

import { useState } from "react";
import { Package } from "lucide-react";

export default function OrdersClient({ initialOrders, updateStatusAction }: any) {
  const [orders, setOrders] = useState(initialOrders);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setIsUpdating(id);
    try {
      await updateStatusAction(id, newStatus);
      setOrders(orders.map((o: any) => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Order ID</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Date</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Customer</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Total</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Items</th>
              <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-bold text-[#0a0a0a]">OCT-{order.id.toString().padStart(5, '0')}</td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <p className="font-medium text-[#0a0a0a]">{order.customer_name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{order.customer_email || 'No email'}</p>
                </td>
                <td className="p-4 font-bold">₹{Number(order.total_amount).toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-gray-500 flex items-center gap-2">
                  <Package size={14} /> {order.items?.length || 0} items
                </td>
                <td className="p-4 text-right">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={isUpdating === order.id}
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-[#ff6b00] outline-none cursor-pointer ${getStatusColor(order.status)} ${isUpdating === order.id ? 'opacity-50' : ''}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
