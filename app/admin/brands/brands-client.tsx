"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import { toast } from "react-hot-toast";

export default function BrandsClient({ initialBrands, saveAction, deleteAction }: any) {
  const [brands, setBrands] = useState(initialBrands);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setBrands(initialBrands);
  }, [initialBrands]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: ""
  });

  const filteredBrands = brands.filter((brand: any) => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (brand: any = null) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        id: brand.id,
        name: brand.name
      });
    } else {
      setEditingBrand(null);
      setFormData({
        id: null, name: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await saveAction(formData);
      if (res?.error) {
        toast.error(res.error, {
          style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
        });
        return;
      }
      toast.success("Brand saved successfully", {
        style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
      });
      closeModal(); 
    } catch (err) {
      toast.error("Failed to save brand.", {
        style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-[#0a0a0a]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl pointer-events-auto flex flex-col border border-gray-800 overflow-hidden transform transition-all`}>
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 size={16} className="text-red-500" />
            </div>
            <p className="text-base font-black uppercase tracking-wide text-white">Delete Brand</p>
          </div>
          <p className="text-sm text-gray-400 font-medium">Are you sure you want to permanently remove this brand? This action cannot be undone.</p>
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
                setBrands((prev: any) => prev.filter((c: any) => c.id !== id));
                toast.success("Brand deleted successfully", {
                  style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
                });
              } catch (err) {
                toast.error("Failed to delete brand", {
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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-t-2xl border border-gray-200 border-b-0 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button onClick={() => openModal()} className="bg-[#111111] text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wide hover:bg-[#ff6b00] transition-all flex items-center gap-2 text-sm shrink-0 shadow-md hover:shadow-lg">
          <Plus size={16} /> Add New Brand
        </button>

        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Brand Name</th>
                <th className="px-6 py-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand: any) => (
                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-[#111111] tracking-wide">{brand.name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(brand)} className="p-2 text-gray-400 hover:text-[#ff6b00] transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(brand.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                    <p>No brands found matching "{searchQuery}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm z-[1050] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
            <div className="p-6 flex justify-between items-center bg-gray-50 border-b border-gray-100">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#111111]">{editingBrand ? "Edit Brand" : "New Brand"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 transition-colors bg-white p-2 rounded-full shadow-sm border border-gray-200">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Brand Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 focus:border-[#ff6b00] transition-all font-medium text-lg" placeholder="Enter brand name" />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100 rounded-xl transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={isSaving || !formData.name.trim()} className="px-6 py-3 bg-[#111111] text-white font-bold uppercase tracking-wide rounded-xl hover:bg-[#ff6b00] transition-colors disabled:opacity-50 text-sm shadow-md hover:shadow-lg">
                  {isSaving ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
