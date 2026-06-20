"use client";

import { useState } from "react";
import { Package, Mail, Phone, MapPin } from "lucide-react";

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
              <th className="px-4 py-3 font-bold text-gray-500 uppercase text-xs tracking-wider">Order ID</th>
              <th className="px-4 py-3 font-bold text-gray-500 uppercase text-xs tracking-wider">Date</th>
              <th className="px-4 py-3 font-bold text-gray-500 uppercase text-xs tracking-wider">Customer</th>
              <th className="px-4 py-3 font-bold text-gray-500 uppercase text-xs tracking-wider">Total</th>
              <th className="px-4 py-3 font-bold text-gray-500 uppercase text-xs tracking-wider">Items</th>
              <th className="px-4 py-3 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-[#0a0a0a] align-top">OCT-{order.id.toString().padStart(5, '0')}</td>
                <td className="px-4 py-3 text-sm text-gray-500 align-top" suppressHydrationWarning>
                  {new Date(order.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 align-top min-w-[250px]">
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-[#0a0a0a]">{order.customer_name || 'Guest'}</p>
                    <div className="flex flex-col gap-1 mt-1">
                      {order.customer_email && (
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 leading-none">
                          <Mail size={12} className="text-gray-400 shrink-0" />
                          <span className="truncate">{order.customer_email}</span>
                        </div>
                      )}
                      {order.customer_phone && (
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-500 leading-none">
                          <Phone size={12} className="text-gray-400 shrink-0" />
                          <span>{order.customer_phone}</span>
                        </div>
                      )}
                      {order.address && (
                        <div className="flex items-start gap-1.5 text-[12px] text-gray-500 mt-0.5">
                          <MapPin size={12} className="mt-[2px] shrink-0 text-gray-400" />
                          <span className="leading-tight">
                            {order.address.address_line}, {order.address.city}, {order.address.state} {order.address.postal_code}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold align-top">₹{Number(order.total_amount).toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-sm text-gray-500 align-top min-w-[200px]">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 font-medium text-[#0a0a0a]">
                      <Package size={14} className="text-gray-400" /> 
                      {order.items?.length || 0} items
                    </div>
                    {order.items && order.items.length > 0 && (
                      <ul className="flex flex-col gap-1.5 border-l-2 border-gray-100 pl-2.5">
                        {order.items.map((item: any, idx: number) => (
                          <li key={idx} className="flex flex-col text-[12px] leading-tight">
                            <span className="font-medium text-gray-700 line-clamp-1" title={item.product_name}>{item.product_name}</span>
                            <span className="text-gray-400">{item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right align-top">
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
