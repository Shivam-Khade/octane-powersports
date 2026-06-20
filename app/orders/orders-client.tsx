"use client";

import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Loader2, Grid2X2, List } from "lucide-react";
import "./orders.css";

type OrderItem = {
  id: number;
  product_name: string;
  price: string;
  quantity: number;
  image?: string;
};

type Order = {
  id: number;
  total_amount: string;
  status: string;
  created_at: string;
  items: OrderItem[];
};

export default function OrdersClient({ session }: { session: any }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const [isGrid, setIsGrid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/user/orders", { cache: "no-store" }),
          fetch("/api/products", { cache: "no-store" })
        ]);
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(data);
        }
        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="orders-page flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#ff6b00] mx-auto mb-4" size={40} />
          <p className="text-gray-500 font-medium">Loading your orders...</p>
        </div>
      </main>
    );
  }

  const currentOrders = orders.filter(o => o.status === "Pending" || o.status === "Shipped");
  const pastOrders = orders.filter(o => o.status === "Delivered" || o.status === "Cancelled");

  const displayedOrders = activeTab === "current" ? currentOrders : pastOrders;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <main className="orders-page pt-32 pb-20 bg-[#f8f8f8] min-h-[85vh]">
      <section className="container max-w-5xl mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-bold tracking-[0.2em] text-[#ff6b00] uppercase mb-2">Your Garage</p>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-[#0a0a0a] m-0 leading-none">Order Tracking</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 md:self-end">
            <div className="flex bg-white p-1 rounded-full border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveTab("current")}
                className={`px-6 py-2.5 flex items-center gap-2 font-bold text-sm uppercase tracking-wide rounded-full transition-all ${
                  activeTab === "current" 
                    ? "bg-[#ff6b00] text-white shadow-md" 
                    : "text-gray-500 hover:text-[#0a0a0a]"
                }`}
              >
                <Truck size={16} /> Active ({currentOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2.5 flex items-center gap-2 font-bold text-sm uppercase tracking-wide rounded-full transition-all ${
                  activeTab === "history" 
                    ? "bg-[#ff6b00] text-white shadow-md" 
                    : "text-gray-500 hover:text-[#0a0a0a]"
                }`}
              >
                <CheckCircle size={16} /> History ({pastOrders.length})
              </button>
            </div>
            
            <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setIsGrid(true)}
                className={`p-2 rounded-lg transition-colors ${isGrid ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-black"}`}
                aria-label="Grid view"
              >
                <Grid2X2 size={18} />
              </button>
              <button
                onClick={() => setIsGrid(false)}
                className={`p-2 rounded-lg transition-colors ${!isGrid ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-black"}`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="orders-container">
          {displayedOrders.length === 0 ? (
            <div className="text-center py-20 px-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-[#0a0a0a] uppercase tracking-wide mb-3">No Orders Found</h3>
              <p className="text-gray-500 text-base max-w-md mx-auto mb-8">
                {activeTab === "current" 
                  ? "You don't have any active orders currently being processed or shipped. Time to upgrade your ride!"
                  : "You haven't completed any orders yet. Check out our latest parts and gear."}
              </p>
              <a href="/shop" className="inline-flex items-center justify-center bg-white border-2 border-[#ff6b00] text-[#ff6b00] px-8 py-3.5 rounded-full font-bold uppercase tracking-wide hover:bg-[#ff6b00] hover:!text-white transition-all duration-300">
                Explore Shop
              </a>
            </div>
          ) : (
            <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "flex flex-col gap-8"}>
              {displayedOrders.map((order) => (
                <div key={order.id} className="group border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300">
                  <div className="bg-[#0a0a0a] text-white px-6 md:px-8 py-5 flex flex-wrap justify-between items-center gap-6">
                    <div className="flex gap-8 md:gap-12 flex-wrap">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Order Placed</p>
                        <p className="text-sm font-semibold">{new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total Amount</p>
                        <p className="text-sm font-bold text-[#ff6b00]">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Order Number</p>
                        <p className="text-sm font-mono bg-white/10 px-2 py-0.5 rounded">OCT-{order.id.toString().padStart(5, '0')}</p>
                      </div>

                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                        <span className={`w-2 h-2 rounded-full ${order.status === 'Pending' ? 'bg-yellow-500' : order.status === 'Shipped' ? 'bg-blue-500' : order.status === 'Delivered' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <ul className="divide-y divide-gray-100">
                      {order.items?.map((item) => {
                        return (
                        <li key={item.id} className="py-5 flex justify-between items-center group/item first:pt-0 last:pb-0">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center group-hover/item:border-[#ff6b00] transition-colors overflow-hidden shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="text-gray-300 group-hover/item:text-[#ff6b00] transition-colors" size={28} />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#0a0a0a] text-lg mb-1 leading-tight">{item.product_name}</p>
                              <p className="text-sm font-semibold text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="font-black text-xl text-[#0a0a0a]">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </div>
                        </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
