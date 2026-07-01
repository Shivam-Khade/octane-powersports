"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Upload, Search, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CategoriesClient({ initialCategories, menuGroups, saveAction, deleteAction }: any) {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  const filteredCategories = categories.filter((c: any) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    image: "",
    featured: false,
    menu_group_id: null as number | null
  });

  const openModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        featured: category.featured === 1 || category.featured === true,
        menu_group_id: category.menu_group_id || null
      });
    } else {
      setEditingCategory(null);
      setFormData({
        id: null, name: "", description: "", image: "", featured: false, menu_group_id: null
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
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
      toast.success("Category saved successfully", {
        style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
      });
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category.", {
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
            <p className="text-base font-black uppercase tracking-wide text-white">Delete Category</p>
          </div>
          <p className="text-sm text-gray-400 font-medium">Are you sure you want to permanently remove this category? This action cannot be undone.</p>
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
                setCategories((prev: any) => prev.filter((c: any) => c.id !== id));
                toast.success("Category deleted successfully", {
                  style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
                });
              } catch (err) {
                toast.error("Failed to delete category", {
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
      <div className="mb-6 flex justify-between items-center gap-4">
        <button onClick={() => openModal()} className="bg-[#ff6b00] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-[#e66000] transition-colors flex items-center gap-2 text-sm whitespace-nowrap">
          <Plus size={18} /> Add New Category
        </button>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#ff6b00] text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Image</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Name</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Menu Group</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((category: any) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded-md bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">None</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-[#0a0a0a]">{category.name}</td>
                  <td className="p-4">
                    {category.menu_group_name ? (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-medium">{category.menu_group_name}</span>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    {category.featured ? (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">Featured (Home)</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-bold">Standard</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(category)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-200 rounded-md">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 rounded-md">
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1050] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-20">
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">{editingCategory ? "Edit Category" : "New Category"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 transition-all font-medium placeholder-gray-400" placeholder="e.g. Helmets" />
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Menu Group</label>
                <div 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer flex justify-between items-center hover:border-gray-300 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                >
                  <span className="text-gray-900 font-medium">
                    {formData.menu_group_id ? menuGroups.find((g: any) => g.id === formData.menu_group_id)?.name : "-- No Group (Unassigned) --"}
                  </span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${isGroupDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isGroupDropdownOpen && (
                  <div className="absolute top-[100%] left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
                    <div 
                      className="p-4 hover:bg-[#ff6b00]/10 hover:text-[#ff6b00] text-gray-600 font-medium cursor-pointer transition-colors border-b border-gray-100"
                      onClick={() => {
                        setFormData({...formData, menu_group_id: null});
                        setIsGroupDropdownOpen(false);
                      }}
                    >
                      -- No Group (Unassigned) --
                    </div>
                    {menuGroups.map((group: any) => (
                      <div 
                        key={group.id} 
                        className="p-4 hover:bg-[#ff6b00]/10 hover:text-[#ff6b00] text-gray-600 font-medium cursor-pointer transition-colors"
                        onClick={() => {
                          setFormData({...formData, menu_group_id: group.id});
                          setIsGroupDropdownOpen(false);
                        }}
                      >
                        {group.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-[#ff6b00]/50 hover:bg-[#ff6b00]/5 transition-all group shadow-sm">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded bg-white checked:bg-[#ff6b00] checked:border-[#ff6b00] transition-colors cursor-pointer" />
                    <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 uppercase tracking-wide text-sm mb-1 group-hover:text-[#ff6b00] transition-colors">Feature on Homepage</div>
                    <div className="text-xs text-gray-500">Display this category as a visual card on the main landing page.</div>
                  </div>
                </label>
              </div>

              {formData.featured && (
                <>
                  <div className="animate-enter">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Description</label>
                    <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff6b00] focus:ring-4 focus:ring-[#ff6b00]/10 transition-all placeholder-gray-400" placeholder="Brief description for the homepage card"></textarea>
                  </div>

                  <div className="animate-enter">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Image</label>
                    <div className="flex gap-4 items-end">
                      {formData.image && (
                        <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm" />
                      )}
                      <div className="flex-1">
                        <label className={`flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl cursor-pointer hover:border-[#ff6b00] hover:bg-[#ff6b00]/5 transition-all ${uploadingImage ? 'opacity-50' : ''}`}>
                          <Upload size={24} className={uploadingImage ? 'text-[#ff6b00] animate-bounce' : 'text-gray-400'} />
                          <span className="text-gray-500 font-medium text-sm">{uploadingImage ? 'Uploading...' : 'Click to Upload Image'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors text-sm">Cancel</button>
                <button type="submit" disabled={isSaving || uploadingImage || (formData.featured && !formData.image)} className="px-8 py-3 bg-[#0a0a0a] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#ff6b00] hover:shadow-[0_4px_14px_rgba(255,107,0,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none text-sm">
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
