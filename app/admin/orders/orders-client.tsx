"use client";

import { useState, useRef, useEffect } from "react";
import { Package, Mail, Phone, MapPin, ChevronDown, Check } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-amber-100 text-amber-800 border-amber-200";
    case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Delivered": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Cancelled": return "bg-rose-100 text-rose-800 border-rose-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

function StatusDropdown({ status, isUpdating, onChange }: { status: string, isUpdating: boolean, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => !isUpdating && setOpen(!open)}
        disabled={isUpdating}
        className={`flex items-center justify-between min-w-[130px] gap-2 px-3 py-2 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${getStatusColor(status)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer hover:-translate-y-0.5'}`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {isUpdating && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
          {status}
        </div>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl bg-white border border-gray-100 shadow-2xl ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden">
          <div className="p-1.5 flex flex-col gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${s === status ? 'bg-gray-100 text-[#ff6b00]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0a0a0a]'}`}
              >
                {s}
                {s === status && <Check size={14} className="text-[#ff6b00]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
                  <StatusDropdown 
                    status={order.status} 
                    isUpdating={isUpdating === order.id} 
                    onChange={(newStatus) => handleStatusChange(order.id, newStatus)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
