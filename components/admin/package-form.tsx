"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, X, Search, ChevronUp, ChevronDown, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function CustomSelect({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {label: string, value: string}[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <div 
        className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none hover:border-[#ff6b00]/50 transition-all font-medium cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ ...(isOpen ? { borderColor: '#ff6b00', backgroundColor: '#fff', boxShadow: '0 0 0 4px rgba(255, 107, 0, 0.1)' } : {}) }}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-[#ff6b00]' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] py-2 overflow-hidden">
          {options.map(opt => (
            <div 
              key={opt.value}
              className={`px-4 py-3 cursor-pointer transition-colors ${value === opt.value ? 'bg-[#ff6b00]/5 text-[#ff6b00] font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PackageForm({ initialData, bikeModels, saveAction, searchProducts }: any) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: initialData?.id || null,
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    banner: initialData?.banner || "",
    thumbnail: initialData?.thumbnail || "",
    priority: initialData?.priority ?? "",
    is_active: initialData?.is_active ?? true,
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : "",
    end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : "",
    discount_type: initialData?.discount_type || "percentage",
    discount_value: initialData?.discount_value ?? "",
    seo_title: initialData?.seo_title || "",
    seo_description: initialData?.seo_description || "",
    bikes: initialData?.bikes || [],
    products: initialData?.products || [] // [{ id, name, price, image }]
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchProducts(searchQuery);
          setSearchResults(results.filter((r: any) => !formData.products.some((p: any) => p.id === r.id)));
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, formData.products, searchProducts]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'banner' | 'thumbnail') => {
    if (!e.target.files?.[0]) return;
    setUploadingImage(field);
    
    const fileData = new FormData();
    fileData.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fileData
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, [field]: data.url }));
      } else {
        toast.error("Upload failed: " + data.error);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(null);
    }
  };

  const handleCheckboxChange = (model: string) => {
    const current = formData.bikes;
    if (current.includes(model)) {
      setFormData({ ...formData, bikes: current.filter((v: string) => v !== model) });
    } else {
      setFormData({ ...formData, bikes: [...current, model] });
    }
  };

  const addProduct = (product: any) => {
    setFormData({ ...formData, products: [...formData.products, product] });
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeProduct = (id: number) => {
    setFormData({ ...formData, products: formData.products.filter((p: any) => p.id !== id) });
  };

  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...formData.products];
    if (direction === 'up' && index > 0) {
      const temp = newProducts[index - 1];
      newProducts[index - 1] = newProducts[index];
      newProducts[index] = temp;
    } else if (direction === 'down' && index < newProducts.length - 1) {
      const temp = newProducts[index + 1];
      newProducts[index + 1] = newProducts[index];
      newProducts[index] = temp;
    }
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.products.length < 2) {
      toast.error("A package must contain at least 2 products.");
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };
      
      const result = await saveAction(dataToSave);
      
      if (result && !result.success) {
        toast.error(result.error || "Failed to save package.");
        return;
      }
      
      toast.success("Package saved successfully!");
      router.push("/admin/packages");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save package.");
    } finally {
      setIsSaving(false);
    }
  };

  const originalTotal = formData.products.reduce((sum: number, p: any) => sum + Number(p.price || 0), 0);
  const discountAmount = formData.discount_type === 'percentage' 
    ? (originalTotal * Number(formData.discount_value)) / 100 
    : Number(formData.discount_value);
  const finalPrice = Math.max(0, originalTotal - discountAmount);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-10 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-12" suppressHydrationWarning>
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-tight text-[#0a0a0a] border-b border-gray-100 pb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Package Name</label>
              <input suppressHydrationWarning required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all placeholder-gray-400 font-medium" placeholder="e.g. Protection Pack" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">URL Slug</label>
              <input suppressHydrationWarning required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all placeholder-gray-400 font-medium" placeholder="e.g. protection-pack" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
              <textarea suppressHydrationWarning rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all resize-y placeholder-gray-400 font-medium"></textarea>
            </div>
          </div>
        </div>

        {/* Pricing & Discount */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-tight text-[#0a0a0a] border-b border-gray-100 pb-3">Pricing & Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
              <CustomSelect 
                value={formData.is_active ? '1' : '0'} 
                onChange={(val) => setFormData({...formData, is_active: val === '1'})} 
                options={[{label: 'Active', value: '1'}, {label: 'Inactive', value: '0'}]}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Type</label>
              <CustomSelect 
                value={formData.discount_type} 
                onChange={(val) => setFormData({...formData, discount_type: val})} 
                options={[{label: 'Percentage (%)', value: 'percentage'}, {label: 'Fixed Amount (₹)', value: 'fixed'}]}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Value</label>
              <input suppressHydrationWarning required type="number" min="0" step="0.01" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all font-medium placeholder-gray-400" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Priority (Higher = First)</label>
              <input suppressHydrationWarning type="number" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all font-medium placeholder-gray-400" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Date (Optional)</label>
              <input suppressHydrationWarning type="datetime-local" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all font-medium placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">End Date (Optional)</label>
              <input suppressHydrationWarning type="datetime-local" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all font-medium placeholder-gray-400" />
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-wrap gap-8 items-center justify-between shadow-sm">
             <div className="flex flex-col">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Original Value</span>
               <span className="text-2xl font-bold line-through text-gray-400">₹{originalTotal.toFixed(2)}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider mb-1">Discount applied</span>
               <span className="text-2xl font-black text-[#ff6b00]">-₹{discountAmount.toFixed(2)}</span>
             </div>
             <div className="flex flex-col text-right">
               <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Final Package Price</span>
               <span className="text-4xl font-black text-green-600 tracking-tight">₹{finalPrice.toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* Included Products */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-tight text-[#0a0a0a] border-b border-gray-100 pb-3">Included Products</h3>
          
          <div className="relative">
            <div className="relative shadow-sm rounded-xl">
              <input 
                type="text" 
                placeholder="Search products to add..." 
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all font-medium placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            {searchQuery.length >= 2 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] max-h-72 overflow-y-auto">
                {isSearching ? (
                  <div className="p-6 text-center text-gray-500 font-medium">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(product => (
                    <div 
                      key={product.id} 
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                      onClick={() => addProduct(product)}
                    >
                      {product.image ? (
                        <img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" alt="" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100"><Package size={20} className="text-gray-300" /></div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                        <p className="text-[#ff6b00] text-sm font-black mt-0.5">₹{product.price}</p>
                      </div>
                      <span className="text-xs bg-[#0a0a0a] text-white px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider shadow-sm hover:bg-gray-800 transition-colors">Add</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500 font-medium">No products found.</div>
                )}
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50 shadow-inner">
            {formData.products.length === 0 ? (
              <div className="p-10 text-center text-gray-500 font-medium">
                Search and add products above.<br/>A package requires at least 2 products.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {formData.products.map((product: any, index: number) => (
                  <li key={product.id} className="flex items-center justify-between p-5 group bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => moveProduct(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                          <ChevronUp size={18} />
                        </button>
                        <button type="button" onClick={() => moveProduct(index, 'down')} disabled={index === formData.products.length - 1} className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                          <ChevronDown size={18} />
                        </button>
                      </div>
                      <span className="font-black text-gray-300 text-xl w-8">{(index + 1).toString().padStart(2, '0')}</span>
                      {product.image ? (
                        <img src={product.image} className="w-14 h-14 rounded-xl object-cover bg-white border border-gray-200 shadow-sm" alt="" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200"><Package size={24} className="text-gray-300" /></div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 text-base">{product.name}</p>
                        <p className="text-[#ff6b00] text-sm font-black mt-0.5">₹{product.price}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeProduct(product.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <X size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-tight text-[#0a0a0a] border-b border-gray-100 pb-3">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Package Banner (Client side)</label>
              <div className="flex flex-col gap-4">
                {formData.banner && (
                  <img src={formData.banner} alt="Banner Preview" className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm" />
                )}
                <label className={`flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-[#ff6b00]/50 transition-all ${uploadingImage === 'banner' ? 'opacity-50' : ''}`}>
                  <Upload size={28} className="text-gray-400" />
                  <span className="text-gray-600 font-bold text-sm tracking-wide">{uploadingImage === 'banner' ? 'UPLOADING...' : 'UPLOAD BANNER'}</span>
                  <input suppressHydrationWarning type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'banner')} disabled={!!uploadingImage} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Package Thumbnail (Admin side)</label>
              <div className="flex flex-col gap-4">
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Thumbnail Preview" className="w-full h-48 object-contain bg-white rounded-xl border border-gray-200 shadow-sm p-2" />
                )}
                <label className={`flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-[#ff6b00]/50 transition-all ${uploadingImage === 'thumbnail' ? 'opacity-50' : ''}`}>
                  <Upload size={28} className="text-gray-400" />
                  <span className="text-gray-600 font-bold text-sm tracking-wide">{uploadingImage === 'thumbnail' ? 'UPLOADING...' : 'UPLOAD THUMBNAIL'}</span>
                  <input suppressHydrationWarning type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'thumbnail')} disabled={!!uploadingImage} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bike Compatibility */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-[#0a0a0a]">Compatible Bikes</h3>
              <p className="text-sm text-gray-500 pt-1">Select the bikes this package applies to.</p>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-6 border border-gray-200 rounded-2xl bg-gray-50/30 space-y-6 shadow-inner">
            {bikeModels?.map((brandObj: any) => {
              const allBrandModels = brandObj.series.flatMap((s: any) => s.models);
              const isBrandSelected = allBrandModels.length > 0 && allBrandModels.every((m: string) => formData.bikes.includes(m));
              return (
              <details key={brandObj.brand} className="group">
                <summary className="font-black text-gray-900 text-lg cursor-pointer select-none list-none flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-[#ff6b00] group-open:rotate-90 transition-transform">▶</span>
                    {brandObj.brand}
                  </div>
                  <button 
                    type="button" 
                    suppressHydrationWarning
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 shadow-sm border ${
                      isBrandSelected 
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                        : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      let newBikes = [...formData.bikes];
                      if (!isBrandSelected) {
                        allBrandModels.forEach((m: string) => {
                          if (!newBikes.includes(m)) newBikes.push(m);
                        });
                      } else {
                        newBikes = newBikes.filter((m: string) => !allBrandModels.includes(m));
                      }
                      setFormData({ ...formData, bikes: newBikes });
                    }}
                  >
                    {isBrandSelected ? 'CLEAR ALL' : 'SELECT ALL'}
                  </button>
                </summary>
                <div className="pl-8 pt-2 space-y-6 mb-6">
                  {brandObj.series.map((seriesObj: any) => {
                    const isSeriesSelected = seriesObj.models.length > 0 && seriesObj.models.every((m: string) => formData.bikes.includes(m));
                    return (
                    <details key={seriesObj.name} className="group/series">
                      <summary className="font-bold text-gray-700 text-base cursor-pointer select-none list-none flex items-center justify-between mb-3 pr-2">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 group-open/series:rotate-90 transition-transform text-xs">▶</span>
                          {seriesObj.name}
                        </div>
                        <button 
                          type="button" 
                          suppressHydrationWarning
                          className={`text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 shadow-sm border ${
                            isSeriesSelected 
                              ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                              : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            let newBikes = [...formData.bikes];
                            if (!isSeriesSelected) {
                              seriesObj.models.forEach((m: string) => {
                                if (!newBikes.includes(m)) newBikes.push(m);
                              });
                            } else {
                              newBikes = newBikes.filter((m: string) => !seriesObj.models.includes(m));
                            }
                            setFormData({ ...formData, bikes: newBikes });
                          }}
                        >
                          {isSeriesSelected ? 'CLEAR' : 'SELECT ALL'}
                        </button>
                      </summary>
                      <div className="pl-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {seriesObj.models.map((model: string) => (
                          <label key={model} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all">
                            <input 
                              suppressHydrationWarning
                              type="checkbox" 
                              checked={formData.bikes.includes(model)}
                              onChange={() => handleCheckboxChange(model)}
                              className="w-4 h-4 text-[#ff6b00] bg-white border-gray-300 rounded focus:ring-[#ff6b00] focus:ring-offset-white"
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

        {/* SEO */}
        <div className="space-y-6">
          <h3 className="text-lg font-black uppercase tracking-tight text-[#0a0a0a] border-b border-gray-100 pb-3">SEO</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SEO Title</label>
              <input suppressHydrationWarning type="text" value={formData.seo_title} onChange={e => setFormData({...formData, seo_title: e.target.value})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all font-medium placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SEO Description</label>
              <textarea suppressHydrationWarning rows={2} value={formData.seo_description} onChange={e => setFormData({...formData, seo_description: e.target.value})} className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 focus:bg-white transition-all font-medium resize-y placeholder-gray-400"></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
          <button suppressHydrationWarning type="button" onClick={() => router.push("/admin/packages")} className="px-8 py-4 font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
          <button suppressHydrationWarning type="submit" disabled={isSaving || !!uploadingImage} className="px-10 py-4 bg-[#ff6b00] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#e66000] transition-all disabled:opacity-50 shadow-lg shadow-[#ff6b00]/20 hover:shadow-[#ff6b00]/40 transform hover:-translate-y-0.5">
            {isSaving ? 'SAVING...' : 'SAVE PACKAGE DEAL'}
          </button>
        </div>
      </form>
    </div>
  );
}
