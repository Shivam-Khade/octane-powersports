"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Upload, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ProductsClient({ initialProducts, categories, brands, saveAction, deleteAction }: any) {
  const [products, setProducts] = useState(initialProducts);

  // Modal and form code moved to ProductForm component

  const handleDelete = (id: number) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-[#0a0a0a]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto flex flex-col border border-gray-800 overflow-hidden transform transition-all`}>
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 size={16} className="text-red-500" />
            </div>
            <p className="text-base font-black uppercase tracking-wide text-white">Delete Product</p>
          </div>
          <p className="text-sm text-gray-400 font-medium">Are you sure you want to permanently remove this product? This action cannot be undone.</p>
        </div>
        <div className="flex">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 p-4 text-sm font-bold uppercase tracking-wide text-gray-400 hover:bg-white/5 hover:text-white transition-colors border-r border-gray-800/50"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteAction(id);
                setProducts((prev: any) => prev.filter((p: any) => p.id !== id));
                toast.success("Product deleted successfully", {
                  style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
                });
              } catch (err) {
                toast.error("Failed to delete product", {
                  style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
                });
              }
            }}
            className="flex-1 p-4 text-sm font-black uppercase tracking-wide text-red-500 hover:bg-red-500/10 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: "top-center" });
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/products/new" className="bg-[#ff6b00] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-[#e66000] transition-colors inline-flex items-center gap-2 text-sm">
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Image</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Name</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Category</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Price</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Stock</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100" suppressHydrationWarning>
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">None</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-[#0a0a0a]">{product.name}</td>
                  <td className="p-4 text-sm text-gray-500">{product.category}</td>
                  <td className="p-4 font-bold">₹{Number(product.price).toLocaleString('en-IN')}</td>
                  <td className="p-4 font-bold text-gray-700">{product.stockCount ?? 'N/A'}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      (product.stockCount ?? 0) > 5 ? 'bg-green-100 text-green-800' : 
                      (product.stockCount ?? 0) > 3 ? 'bg-yellow-100 text-yellow-800' : 
                      (product.stockCount ?? 0) > 0 ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {(product.stockCount ?? 0) > 5 ? 'In Stock' : 
                       (product.stockCount ?? 0) > 3 ? 'Limited' : 
                       (product.stockCount ?? 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-200 rounded-md">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 rounded-md">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal removed */}
    </>
  );
}
