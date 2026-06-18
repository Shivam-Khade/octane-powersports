"use client";

import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductForm({ initialData, categories, brands, saveAction }: any) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Helper to safely parse JSON or comma separated values into array
  const parseArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      if (val.startsWith('[')) {
        try { return JSON.parse(val); } catch (e) { return val.split(',').map(s => s.trim()).filter(Boolean); }
      }
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    // Store categories and brands as arrays for the checkboxes
    category: parseArray(initialData?.category),
    brand: parseArray(initialData?.brand),
    price: initialData?.price || 0,
    rating: initialData?.rating || 5.0,
    availability: initialData?.availability || "In Stock",
    badge: initialData?.badge || "",
    image: initialData?.image || "",
    description: initialData?.description || "",
    stockCount: initialData?.stockCount ?? 10,
    compatibility: parseArray(initialData?.compatibility)
  });

  const [newModel, setNewModel] = useState("");

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

  const handleCheckboxChange = (field: 'category' | 'brand', value: string) => {
    const current = formData[field] as string[];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((v: string) => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const addModel = () => {
    if (newModel.trim() && !formData.compatibility.includes(newModel.trim())) {
      setFormData({ 
        ...formData, 
        compatibility: [...formData.compatibility, newModel.trim()] 
      });
      setNewModel("");
    }
  };

  const removeModel = (modelToRemove: string) => {
    setFormData({
      ...formData,
      compatibility: formData.compatibility.filter((m: string) => m !== modelToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Prepare data for save action (convert arrays to appropriate format)
      const dataToSave = {
        ...formData,
        category: formData.category.join(", "),
        brand: formData.brand.join(", "),
        compatibility: formData.compatibility // Will be JSON stringified in saveAction if not already
      };
      
      await saveAction(dataToSave);
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a] border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
              <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
              <input required type="number" min="0" value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: Number(e.target.value)})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
            </div>
          </div>
        </div>

        {/* Categories (Checkboxes) */}
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a] border-b pb-2">Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.map((cat: any) => (
              <label key={cat.name} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                <input 
                  type="checkbox" 
                  checked={formData.category.includes(cat.name)}
                  onChange={() => handleCheckboxChange('category', cat.name)}
                  className="w-4 h-4 text-[#ff6b00] border-gray-300 rounded focus:ring-[#ff6b00]"
                />
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands (Checkboxes) */}
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a] border-b pb-2">Brands</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto p-2 border border-gray-100 rounded-lg bg-gray-50/50">
            {brands?.map((b: any) => (
              <label key={b.brand} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-white border border-transparent hover:border-gray-200 transition-all">
                <input 
                  type="checkbox" 
                  checked={formData.brand.includes(b.brand)}
                  onChange={() => handleCheckboxChange('brand', b.brand)}
                  className="w-4 h-4 text-[#ff6b00] border-gray-300 rounded focus:ring-[#ff6b00]"
                />
                <span className="text-sm font-medium text-gray-700">{b.brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bike Series Compatibility */}
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a] border-b pb-2">Bike Series Model (Compatibility)</h3>
          <p className="text-sm text-gray-500">Add specific bike series models that this product is compatible with.</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Yamaha R15 V3" 
              value={newModel}
              onChange={e => setNewModel(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addModel(); } }}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"
            />
            <button 
              type="button" 
              onClick={addModel}
              className="bg-[#0a0a0a] text-white px-6 rounded-lg font-bold hover:bg-[#ff6b00] transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Add
            </button>
          </div>

          {formData.compatibility.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.compatibility.map((model: string, idx: number) => (
                <div key={idx} className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium text-gray-800">
                  {model}
                  <button type="button" onClick={() => removeModel(model)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image & Description */}
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a] border-b pb-2">Media & Details</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
            <div className="flex gap-4 items-end">
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
              )}
              <div className="flex-1">
                <label className={`flex flex-col items-center justify-center gap-2 w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploadingImage ? 'opacity-50' : ''}`}>
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">{uploadingImage ? 'Uploading image...' : 'Click to upload image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00] resize-y"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => router.push("/admin/products")} className="px-8 py-3 font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button type="submit" disabled={isSaving || uploadingImage} className="px-8 py-3 bg-[#ff6b00] text-white font-bold uppercase tracking-wide rounded-lg hover:bg-[#e66000] transition-colors disabled:opacity-50 shadow-lg shadow-[#ff6b00]/20">
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
