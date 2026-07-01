"use client";

import { useState } from "react";
import { Package, Plus, Search, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface PackagesClientProps {
  initialPackages: any[];
  deleteAction: (id: number) => Promise<void>;
}

export default function PackagesClient({ initialPackages, deleteAction }: PackagesClientProps) {
  const [packages, setPackages] = useState(initialPackages);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    
    setIsDeleting(id);
    try {
      await deleteAction(id);
      setPackages(packages.filter(p => p.id !== id));
      toast.success("Package deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete package");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f8f8f8]">
        <div className="relative w-80 group">
          <input 
            type="text" 
            placeholder="Search packages..." 
            className="peer w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all font-medium placeholder-gray-400 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-[#ff6b00] transition-colors" size={18} />
        </div>
        <Link href="/admin/packages/create" className="px-5 py-2.5 bg-[#ff6b00] !text-white select-none text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#e66000] transition-all shadow-md shadow-[#ff6b00]/20 hover:shadow-[#ff6b00]/40 flex items-center gap-2">
          <Plus size={18} /> Add Package
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Package Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Products</th>
              <th className="px-6 py-4">Purchases</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPackages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {pkg.thumbnail ? (
                      <img src={pkg.thumbnail} alt={pkg.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <Package size={20} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#0a0a0a]">{pkg.name}</p>
                      <p className="text-xs text-gray-500">{pkg.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {pkg.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {pkg.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {pkg.product_count || 0}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {pkg.purchases || 0}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-[#ff6b00]">
                  ${Number(pkg.revenue || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/packages/${pkg.id}/edit`} className="p-2 text-gray-400 hover:text-[#0a0a0a] hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(pkg.id)}
                      disabled={isDeleting === pkg.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPackages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No packages found. Create your first package deal!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
