"use client";

import { useState, useMemo } from "react";
import { Plus, X, Check, Search, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

type BikesTreeClientProps = {
  bikeModels: any[];
  products: any[];
  addBikeAction: any;
  updateCompatibilityAction: any;
  deleteBikeAction: any;
};

export default function BikesTreeClient({ bikeModels, products, addBikeAction, updateCompatibilityAction, deleteBikeAction }: BikesTreeClientProps) {
  const [selectedBike, setSelectedBike] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Tree search state
  const [treeSearchQuery, setTreeSearchQuery] = useState("");

  // Collapse state
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
  const [expandedSeries, setExpandedSeries] = useState<string[]>([]);

  // Products modal state
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // New item modal
  const [newItemModal, setNewItemModal] = useState<{ isOpen: boolean; type: 'brand' | 'series' | 'model', brand: string, series?: string }>({ isOpen: false, type: 'series', brand: '' });
  const [newItemName, setNewItemName] = useState("");

  const toggleBrand = (e: React.MouseEvent, brand: string) => {
    e.stopPropagation();
    setExpandedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const toggleSeries = (e: React.MouseEvent, seriesKey: string) => {
    e.stopPropagation();
    setExpandedSeries(prev => prev.includes(seriesKey) ? prev.filter(s => s !== seriesKey) : [...prev, seriesKey]);
  };

  const isBrandExpanded = (brand: string) => treeSearchQuery.trim().length > 0 || expandedBrands.includes(brand);
  const isSeriesExpanded = (seriesKey: string) => treeSearchQuery.trim().length > 0 || expandedSeries.includes(seriesKey);

  const handleAddBrand = () => {
    setNewItemModal({ isOpen: true, type: 'brand', brand: '' });
    setNewItemName("");
  };

  const handleAddSeries = (e: React.MouseEvent, brand: string) => {
    e.stopPropagation();
    setNewItemModal({ isOpen: true, type: 'series', brand });
    setNewItemName("");
  };

  const handleAddBike = (e: React.MouseEvent, brand: string, series: string) => {
    e.stopPropagation();
    setNewItemModal({ isOpen: true, type: 'model', brand, series });
    setNewItemName("");
  };

  const submitNewItem = async () => {
    if (!newItemName.trim()) return;
    setIsSaving(true);
    try {
      const brand = newItemModal.type === 'brand' ? newItemName.trim() : newItemModal.brand;
      const series = newItemModal.type === 'series' ? newItemName.trim() : (newItemModal.type === 'model' ? newItemModal.series! : "");
      const model = newItemModal.type === 'model' ? newItemName.trim() : "";
      
      const res = await addBikeAction(brand, series, model);
      if (res.success) {
        toast.success(newItemModal.type === 'brand' ? "Brand added!" : (newItemModal.type === 'series' ? "Series added!" : "Bike model added!"));
        setNewItemModal({ ...newItemModal, isOpen: false });
        
        // Auto expand newly added items
        if (newItemModal.type === 'brand') {
           setExpandedBrands(prev => Array.from(new Set([...prev, brand])));
        } else if (newItemModal.type === 'series') {
           setExpandedBrands(prev => Array.from(new Set([...prev, brand])));
           setExpandedSeries(prev => Array.from(new Set([...prev, `${brand}-${series}`])));
        }
      } else {
        toast.error(res.error || "Failed to add.");
      }
    } catch (error) {
      toast.error("Error adding item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, brand: string, series: string, model: string = "") => {
    e.stopPropagation();
    const type = model ? 'bike model' : 'series';
    if (!window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;
    
    setIsSaving(true);
    try {
      const res = await deleteBikeAction(brand, series, model);
      if (res.success) {
        toast.success(model ? "Bike model deleted!" : "Series deleted!");
      } else {
        toast.error(res.error || "Failed to delete.");
      }
    } catch (error) {
      toast.error("Error deleting item.");
    } finally {
      setIsSaving(false);
    }
  };

  const openCompatibilityModal = (bikeName: string) => {
    setSelectedBike(bikeName);
    const initiallySelected = products.filter(p => p.compatibility.includes(bikeName)).map(p => p.id);
    setSelectedProductIds(initiallySelected);
    setSearchQuery("");
    setIsModalOpen(true);
  };

  const toggleProductSelection = (productId: number) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const saveCompatibility = async () => {
    if (!selectedBike) return;
    setIsSaving(true);
    try {
      const res = await updateCompatibilityAction(selectedBike, selectedProductIds);
      if (res.success) {
        toast.success("Compatibility updated!");
        setIsModalOpen(false);
      } else {
        toast.error(res.error || "Failed to update compatibility.");
      }
    } catch (error) {
      toast.error("Error updating compatibility.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const lowerQ = searchQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lowerQ));
  }, [searchQuery, products]);

  const filteredBikes = useMemo(() => {
    if (!treeSearchQuery.trim()) return bikeModels;
    const lowerQ = treeSearchQuery.toLowerCase();
    
    return bikeModels.map(brandObj => {
      const brandMatch = brandObj.brand.toLowerCase().includes(lowerQ);
      
      const filteredSeries = brandObj.series.map((seriesObj: any) => {
        const seriesMatch = seriesObj.name.toLowerCase().includes(lowerQ);
        const filteredModels = seriesObj.models.filter((m: string) => 
          m.toLowerCase().includes(lowerQ) || seriesMatch || brandMatch
        );
        return { ...seriesObj, models: filteredModels };
      }).filter((s: any) => s.models.length > 0 || s.name.toLowerCase().includes(lowerQ) || brandMatch);

      return { ...brandObj, series: filteredSeries };
    }).filter(b => b.series.length > 0 || b.brand.toLowerCase().includes(lowerQ));

  }, [treeSearchQuery, bikeModels]);

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff6b00] to-orange-400"></div>
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#0a0a0a]">Bike Models</h2>
              <button 
                suppressHydrationWarning
                onClick={handleAddBrand}
                className="px-3 py-1.5 bg-[#ff6b00]/10 text-[#ff6b00] border border-[#ff6b00]/20 rounded-lg hover:bg-[#ff6b00] hover:text-white transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold active:scale-95"
                title="Add New Brand"
              >
                <Plus size={14} strokeWidth={3} /> ADD BRAND
              </button>
            </div>
            <p className="text-sm font-medium text-gray-500 mt-1">Manage hierarchy and assign product compatibility</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ff6b00]" size={18} />
            <input 
              suppressHydrationWarning
              type="text" 
              placeholder="Search brands, series, or bikes..." 
              value={treeSearchQuery}
              onChange={e => setTreeSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 bg-gray-50 hover:bg-white transition-all text-sm font-semibold text-gray-700 placeholder-gray-400 shadow-sm"
            />
          </div>
        </div>

        <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto bg-gray-50/30">
          {filteredBikes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No bikes found matching "{treeSearchQuery}"</p>
            </div>
          )}
          {filteredBikes.map((brandObj) => {
            const brandExpanded = isBrandExpanded(brandObj.brand);
            
            return (
              <div key={brandObj.brand} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div 
                  onClick={(e) => toggleBrand(e, brandObj.brand)}
                  className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors">
                      {brandExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                    <h3 className="font-black text-gray-800 text-xl flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-[#ff6b00] rounded-full inline-block group-hover:scale-y-110 transition-transform"></span>
                      {brandObj.brand}
                    </h3>
                  </div>
                  <button 
                    suppressHydrationWarning
                    onClick={(e) => handleAddSeries(e, brandObj.brand)}
                    className="px-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg hover:border-[#ff6b00] hover:text-[#ff6b00] transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold text-gray-600 active:scale-95"
                    title="Add Series"
                  >
                    <Plus size={14} strokeWidth={3} /> NEW SERIES
                  </button>
                </div>

                {brandExpanded && (
                  <div className="p-5 bg-white space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    {brandObj.series.length === 0 && (
                      <p className="text-sm text-gray-400 italic px-2">No series found under this brand.</p>
                    )}
                    {brandObj.series.map((seriesObj: any) => {
                      const seriesKey = `${brandObj.brand}-${seriesObj.name}`;
                      const seriesExpanded = isSeriesExpanded(seriesKey);
                      
                      return (
                        <div key={seriesObj.name} className="border border-gray-100 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] bg-white hover:border-[#ff6b00]/30 transition-colors overflow-hidden">
                          <div 
                            onClick={(e) => toggleSeries(e, seriesKey)}
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="text-gray-400 p-0.5 rounded-md hover:bg-gray-200 transition-colors">
                                {seriesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </div>
                              <h4 className="font-extrabold text-gray-800 text-lg uppercase tracking-wide flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00]"></span>
                                {seriesObj.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                suppressHydrationWarning
                                onClick={(e) => handleAddBike(e, brandObj.brand, seriesObj.name)}
                                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-[#ff6b00]/10 hover:border-[#ff6b00]/30 hover:text-[#ff6b00] transition-all shadow-sm flex items-center gap-1 text-[11px] font-bold text-gray-600 active:scale-95 uppercase tracking-wider"
                                title="Add Bike"
                              >
                                <Plus size={12} strokeWidth={3} /> Add Bike
                              </button>
                              <button
                                suppressHydrationWarning
                                onClick={(e) => handleDelete(e, brandObj.brand, seriesObj.name)}
                                className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all shadow-sm active:scale-95 text-gray-400"
                                title="Delete Series"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          
                          {seriesExpanded && (
                            <div className="p-4 pt-0 border-t border-gray-50 bg-gray-50/50 animate-in slide-in-from-top-1 fade-in duration-200">
                              {seriesObj.models.length === 0 ? (
                                <p className="text-xs text-gray-400 italic pt-2 px-2">No bikes found in this series.</p>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                                  {seriesObj.models.map((model: string) => {
                                     const modelProductsCount = products.filter(p => p.compatibility.includes(model)).length;
                                     return (
                                      <div 
                                        key={model} 
                                        onClick={() => openCompatibilityModal(model)}
                                        className="group flex items-center justify-between p-3.5 bg-white border border-gray-200 hover:border-[#ff6b00] rounded-xl cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                                      >
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-[#ff6b00] transition-colors">{model}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-black px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-500 rounded-lg group-hover:bg-[#ff6b00] group-hover:border-[#ff6b00] group-hover:text-white transition-all shadow-sm">
                                            {modelProductsCount} parts
                                          </span>
                                          <button
                                            suppressHydrationWarning
                                            onClick={(e) => handleDelete(e, brandObj.brand, seriesObj.name, model)}
                                            className="p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Bike"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </div>
                                     );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Compatibility Modal */}
      {isModalOpen && selectedBike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff6b00] to-orange-400"></div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a]">Manage Compatibility</h2>
                <p className="text-sm font-bold text-[#ff6b00] mt-1 bg-[#ff6b00]/10 inline-block px-2 py-0.5 rounded-md">{selectedBike}</p>
              </div>
              <button 
                suppressHydrationWarning
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 bg-white text-gray-400 border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 rounded-full transition-all shadow-sm active:scale-95"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-5 border-b border-gray-100 bg-white">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff6b00]" size={18} />
                <input 
                  suppressHydrationWarning
                  type="text" 
                  placeholder="Search products to assign..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 bg-gray-50 hover:bg-white transition-all text-sm font-bold text-gray-700 shadow-inner"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map(product => {
                  const isSelected = selectedProductIds.includes(product.id);
                  return (
                    <label 
                      key={product.id} 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleProductSelection(product.id);
                      }}
                      className={`group flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#ff6b00] bg-gradient-to-r from-[#ff6b00]/5 to-transparent shadow-md' 
                          : 'border-gray-200 hover:border-[#ff6b00]/40 bg-white shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${
                        isSelected ? 'bg-[#ff6b00] border-[#ff6b00] shadow-[0_0_10px_rgba(255,107,0,0.3)]' : 'border-gray-300 bg-white group-hover:border-[#ff6b00]/50'
                      }`}>
                        {isSelected && <Check size={14} strokeWidth={3} className="text-white" />}
                      </div>
                      <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-[#ff6b00]' : 'text-gray-700 group-hover:text-gray-900'}`}>{product.name}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {filteredProducts.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 font-medium text-lg">No products found matching "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different search term.</p>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
              <button 
                suppressHydrationWarning
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 font-bold uppercase tracking-wider text-xs text-gray-500 hover:bg-gray-100 rounded-xl transition-colors active:scale-95 border border-transparent hover:border-gray-200"
              >
                Cancel
              </button>
              <button 
                suppressHydrationWarning
                onClick={saveCompatibility}
                disabled={isSaving}
                className="px-8 py-3 bg-gradient-to-r from-[#ff6b00] to-orange-500 text-white font-black uppercase tracking-wider text-xs rounded-xl hover:from-[#e66000] hover:to-[#ff6b00] transition-all disabled:opacity-50 shadow-lg shadow-[#ff6b00]/30 flex items-center gap-2 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} strokeWidth={3} />
                    Save Compatibility
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {newItemModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1 w-full bg-gradient-to-r from-[#ff6b00] to-orange-400"></div>
            <div className="p-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-[#0a0a0a] mb-1">
                Add {newItemModal.type === 'brand' ? 'Brand' : (newItemModal.type === 'series' ? 'Series' : 'Bike')}
              </h3>
              {newItemModal.type !== 'brand' && (
                <p className="text-xs text-gray-500 mb-5 font-bold uppercase tracking-wider bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100">
                  {newItemModal.brand} {newItemModal.series ? <><span className="text-[#ff6b00] mx-1">/</span>{newItemModal.series}</> : ''}
                </p>
              )}
              
              <input
                suppressHydrationWarning
                type="text"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                placeholder={`Enter ${newItemModal.type} name...`}
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 text-sm font-bold text-gray-800 transition-all shadow-sm"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && submitNewItem()}
              />
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                suppressHydrationWarning
                onClick={() => setNewItemModal({ ...newItemModal, isOpen: false })}
                className="px-5 py-2.5 font-bold text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-200 rounded-xl transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button 
                suppressHydrationWarning
                onClick={submitNewItem}
                disabled={isSaving || !newItemName.trim()}
                className="px-6 py-2.5 bg-[#ff6b00] text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#e66000] transition-all disabled:opacity-50 shadow-lg shadow-[#ff6b00]/20 active:scale-95"
              >
                {isSaving ? 'Saving...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
