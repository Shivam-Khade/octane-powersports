"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Upload, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsClient({ initialProducts, categories, brands, saveAction, deleteAction }: any) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    slug: "",
    category: "",
    brand: "",
    price: 0,
    rating: 5.0,
    availability: "In Stock",
    badge: "",
    image: "",
    description: "",
    stockCount: 10
  });

  const openModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        id: null, name: "", slug: "", category: categories?.[0]?.name || "", brand: brands?.[0]?.brand || "", 
        price: 0, rating: 5.0, availability: "In Stock", badge: "", image: "", description: "", stockCount: 10
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingImage(true);
    
    const fileData = new FormData();
    fileData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fileData
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image: data.url });
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveAction(formData);
      // Optimistic update
      if (formData.id) {
        setProducts(products.map((p: any) => p.id === formData.id ? formData : p));
      } else {
        // Need ID from DB ideally, but we can just reload the page or let server action revalidate handle it
        window.location.reload(); 
      }
      closeModal();
    } catch (err) {
      alert("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteAction(id);
      setProducts(products.filter((p: any) => p.id !== id));
    }
  };

  return (
    <>
      <div className="mb-6">
        <button onClick={() => openModal()} className="bg-[#ff6b00] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-[#e66000] transition-colors flex items-center gap-2 text-sm">
          <Plus size={18} /> Add New Product
        </button>
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
            <tbody className="divide-y divide-gray-100">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md bg-gray-100" />
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
                      <button onClick={() => openModal(product)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-200 rounded-md">
                        <Edit2 size={16} />
                      </button>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[1050] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-black uppercase tracking-tight">{editingProduct ? "Edit Product" : "New Product"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                  <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <PremiumSelect 
                    value={formData.category} 
                    onChange={(v) => setFormData({...formData, category: v})} 
                    options={categories?.map((c: any) => c.name) || []}
                    placeholder="Select a category"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
                  <PremiumSelect 
                    value={formData.brand} 
                    onChange={(v) => setFormData({...formData, brand: v})} 
                    options={brands?.map((b: any) => b.brand) || []}
                    placeholder="Select a brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                  <input required type="number" min="0" value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: Number(e.target.value)})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                <div className="flex gap-4 items-end">
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                  )}
                  <div className="flex-1">
                    <label className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploadingImage ? 'opacity-50' : ''}`}>
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-gray-600 font-medium">{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving || uploadingImage} className="px-6 py-3 bg-[#0a0a0a] text-white font-bold uppercase tracking-wide rounded-lg hover:bg-[#ff6b00] transition-colors disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function PremiumSelect({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={`w-full p-3.5 pr-12 border-2 rounded-xl focus:outline-none transition-all text-left flex justify-between items-center shadow-sm ${isOpen ? 'border-[#ff6b00] ring-4 ring-[#ff6b00]/10 bg-white' : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-white'}`}
      >
        <span className={value ? "text-[#0a0a0a] font-bold" : "text-gray-400 font-medium"}>
          {value || placeholder}
        </span>
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center transition-colors ${isOpen ? 'bg-[#ff6b00]/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <ChevronDown 
            size={18} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#ff6b00]' : 'text-gray-400'}`} 
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
          >
            {options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`w-full text-left px-5 py-3.5 transition-colors ${value === opt ? 'bg-[#ff6b00]/10 text-[#ff6b00] font-black border-l-4 border-[#ff6b00]' : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
