"use client";

import { useState, useEffect } from "react";
import { Upload, X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductForm({ initialData, categories, brands, bikeModels, saveAction }: any) {
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
    price: initialData?.price || "",
    sku: initialData?.sku || "",
    rating: initialData?.rating || 5.0,
    availability: initialData?.availability || "In Stock",
    badge: initialData?.badge || "",
    image: initialData?.image || "",
    description: initialData?.description || "",
    stockCount: initialData?.stockCount ?? "",
    compatibility: parseArray(initialData?.compatibility),
    relatedThumbs: parseArray(initialData?.relatedThumbs)
  });

  const [newModel, setNewModel] = useState("");
  const [pasteTarget, setPasteTarget] = useState<'main' | 'sub'>('main');

  useEffect(() => {
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          e.preventDefault(); // Stop default paste behavior
          const file = items[i].getAsFile();
          if (file) {
            setUploadingImage(true);
            const fileData = new FormData();
            fileData.append("file", file);

            try {
              const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: fileData
              });
              const data = await res.json();
              if (data.url) {
                setFormData(prev => {
                  if (pasteTarget === 'main') {
                    return { ...prev, image: data.url };
                  } else {
                    return { ...prev, relatedThumbs: [...prev.relatedThumbs, data.url] };
                  }
                });
              } else {
                alert("Upload failed: " + data.error);
              }
            } catch (err) {
              alert("Upload failed");
            } finally {
              setUploadingImage(false);
            }
          }
          break; // Handle only the first image
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [pasteTarget]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'sub' = 'main') => {
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
        if (type === 'main') {
          setFormData(prev => ({ ...prev, image: data.url }));
        } else {
          setFormData(prev => ({ ...prev, relatedThumbs: [...prev.relatedThumbs, data.url] }));
        }
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCheckboxChange = (field: 'category' | 'brand' | 'compatibility', value: string) => {
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
        compatibility: formData.compatibility, // Will be JSON stringified in saveAction if not already
        relatedThumbs: formData.relatedThumbs
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
      <form onSubmit={handleSubmit} className="space-y-8" suppressHydrationWarning>
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a] border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input suppressHydrationWarning required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
              <input suppressHydrationWarning required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
              <input suppressHydrationWarning required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">SKU</label>
              <input suppressHydrationWarning type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="e.g. OCT-12345" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
              <input suppressHydrationWarning required type="number" min="0" value={formData.stockCount} onChange={e => setFormData({...formData, stockCount: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
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
                  suppressHydrationWarning
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
                  suppressHydrationWarning
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

        {/* Bike Series Compatibility (Checkboxes) */}
        {/* Bike Series Compatibility (Checkboxes) */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b pb-2">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a]">Bike Series Model (Compatibility)</h3>
              <p className="text-sm text-gray-500 pt-1">Select specific bike series models that this product is compatible with.</p>
            </div>
            {bikeModels && bikeModels.length > 0 && (() => {
              const allAvailableModels = bikeModels.flatMap((b: any) => b.series.flatMap((s: any) => s.models));
              const isAllBikesSelected = allAvailableModels.length > 0 && allAvailableModels.every((m: string) => formData.compatibility.includes(m));
              return (
                <button
                  type="button"
                  suppressHydrationWarning
                  className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-md border ${
                    isAllBikesSelected
                      ? 'bg-gradient-to-b from-red-500 to-red-600 border-red-700/20 text-white hover:from-red-400 hover:to-red-500 shadow-red-500/20'
                      : 'bg-gradient-to-b from-green-500 to-green-600 border-green-700/20 text-white hover:from-green-400 hover:to-green-500 shadow-green-500/20'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isAllBikesSelected) {
                      setFormData({ ...formData, compatibility: formData.compatibility.filter((m: string) => !allAvailableModels.includes(m)) });
                    } else {
                      setFormData({ ...formData, compatibility: Array.from(new Set([...formData.compatibility, ...allAvailableModels])) });
                    }
                  }}
                >
                  {isAllBikesSelected ? 'Clear All Bikes' : 'Select All Bikes'}
                </button>
              );
            })()}
          </div>
          <div className="max-h-96 overflow-y-auto p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-4">
            {bikeModels?.map((brandObj: any) => {
              const allBrandModels = brandObj.series.flatMap((s: any) => s.models);
              const isBrandSelected = allBrandModels.length > 0 && allBrandModels.every((m: string) => formData.compatibility.includes(m));
              return (
              <details key={brandObj.brand} className="group">
                <summary className="font-black text-gray-800 cursor-pointer select-none list-none flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff6b00] group-open:rotate-90 transition-transform">▶</span>
                    {brandObj.brand}
                  </div>
                  <button 
                    type="button" 
                    suppressHydrationWarning
                    className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all duration-200 active:scale-95 shadow-md border ${
                      isBrandSelected 
                        ? 'bg-gradient-to-b from-red-500 to-red-600 border-red-700/20 text-white hover:from-red-400 hover:to-red-500 shadow-red-500/20' 
                        : 'bg-gradient-to-b from-green-500 to-green-600 border-green-700/20 text-white hover:from-green-400 hover:to-green-500 shadow-green-500/20'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      let newComp = [...formData.compatibility];
                      if (!isBrandSelected) {
                        allBrandModels.forEach((m: string) => {
                          if (!newComp.includes(m)) newComp.push(m);
                        });
                      } else {
                        newComp = newComp.filter((m: string) => !allBrandModels.includes(m));
                      }
                      setFormData({ ...formData, compatibility: newComp });
                    }}
                  >
                    {isBrandSelected ? 'Clear All' : 'Select All'}
                  </button>
                </summary>
                <div className="pl-6 pt-1 space-y-4 mb-4">
                  {brandObj.series.map((seriesObj: any) => {
                    const isSeriesSelected = seriesObj.models.length > 0 && seriesObj.models.every((m: string) => formData.compatibility.includes(m));
                    return (
                    <details key={seriesObj.name} className="group/series">
                      <summary className="font-bold text-gray-700 text-sm cursor-pointer select-none list-none flex items-center justify-between mb-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 group-open/series:rotate-90 transition-transform text-xs">▶</span>
                          {seriesObj.name}
                        </div>
                        <button 
                          type="button" 
                          suppressHydrationWarning
                          className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded transition-all duration-200 active:scale-95 shadow-sm border ${
                            isSeriesSelected 
                              ? 'bg-gradient-to-b from-red-500 to-red-600 border-red-700/20 text-white hover:from-red-400 hover:to-red-500 shadow-red-500/20' 
                              : 'bg-gradient-to-b from-green-500 to-green-600 border-green-700/20 text-white hover:from-green-400 hover:to-green-500 shadow-green-500/20'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            let newComp = [...formData.compatibility];
                            if (!isSeriesSelected) {
                              seriesObj.models.forEach((m: string) => {
                                if (!newComp.includes(m)) newComp.push(m);
                              });
                            } else {
                              newComp = newComp.filter((m: string) => !seriesObj.models.includes(m));
                            }
                            setFormData({ ...formData, compatibility: newComp });
                          }}
                        >
                          {isSeriesSelected ? 'Clear' : 'Select All'}
                        </button>
                      </summary>
                      <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {seriesObj.models.map((model: string) => (
                          <label key={model} className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-white border border-transparent hover:border-gray-200 transition-all">
                            <input 
                              suppressHydrationWarning
                              type="checkbox" 
                              checked={formData.compatibility.includes(model)}
                              onChange={() => handleCheckboxChange('compatibility', model)}
                              className="w-4 h-4 text-[#ff6b00] border-gray-300 rounded focus:ring-[#ff6b00]"
                            />
                            <span className="text-sm font-medium text-gray-600">{model}</span>
                          </label>
                        ))}
                      </div>
                    </details>
                    );
                  })}
                </div>
              </details>
              );
            })}
          </div>
        </div>

        {/* Image & Description */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a]">Media & Details</h3>
            <div className="flex gap-4 items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-sm font-bold text-gray-700">Paste Target (Ctrl+V):</span>
              <label className="flex items-center gap-2 text-sm cursor-pointer font-medium hover:text-[#ff6b00]">
                <input type="radio" name="pasteTarget" checked={pasteTarget === 'main'} onChange={() => setPasteTarget('main')} className="text-[#ff6b00] focus:ring-[#ff6b00] w-4 h-4" />
                Main Image
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer font-medium hover:text-[#ff6b00]">
                <input type="radio" name="pasteTarget" checked={pasteTarget === 'sub'} onChange={() => setPasteTarget('sub')} className="text-[#ff6b00] focus:ring-[#ff6b00] w-4 h-4" />
                Sub Images
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Product Image (Main)</label>
            <div className="flex gap-4 items-end">
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
              )}
              <div className="flex-1">
                <label className={`flex flex-col items-center justify-center gap-2 w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploadingImage && pasteTarget === 'main' ? 'opacity-50' : ''}`}>
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-gray-600 font-medium">{uploadingImage && pasteTarget === 'main' ? 'Uploading...' : 'Click to upload Main Image'}</span>
                  <input suppressHydrationWarning type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'main')} disabled={uploadingImage} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Sub Images (Gallery)</label>
            <div className="flex flex-wrap gap-4 items-end">
              {formData.relatedThumbs.map((img: string, i: number) => (
                <div key={i} className="relative group">
                  <img src={img} alt={`Sub ${i+1}`} className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  <button type="button" onClick={() => {
                    setFormData(prev => ({ ...prev, relatedThumbs: prev.relatedThumbs.filter((_: string, index: number) => index !== i) }));
                  }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="flex-1 min-w-[200px]">
                <label className={`flex flex-col items-center justify-center gap-2 w-full p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploadingImage && pasteTarget === 'sub' ? 'opacity-50' : ''}`}>
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-gray-600 font-medium text-center">{uploadingImage && pasteTarget === 'sub' ? 'Uploading...' : 'Click to upload Sub Images'}</span>
                  <input suppressHydrationWarning type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'sub')} disabled={uploadingImage} />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea suppressHydrationWarning rows={6} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00] resize-y"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button suppressHydrationWarning type="button" onClick={() => router.push("/admin/products")} className="px-8 py-3 font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
          <button suppressHydrationWarning type="submit" disabled={isSaving || uploadingImage} className="px-8 py-3 bg-[#ff6b00] text-white font-bold uppercase tracking-wide rounded-lg hover:bg-[#e66000] transition-colors disabled:opacity-50 shadow-lg shadow-[#ff6b00]/20">
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
