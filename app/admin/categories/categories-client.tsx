"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";

export default function CategoriesClient({ initialCategories, saveAction, deleteAction }: any) {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    image: "",
    featured: false
  });

  const openModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        featured: category.featured === 1 || category.featured === true
      });
    } else {
      setEditingCategory(null);
      setFormData({
        id: null, name: "", description: "", image: "", featured: false
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
      window.location.reload(); 
    } catch (err) {
      alert("Failed to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteAction(id);
      setCategories(categories.filter((c: any) => c.id !== id));
    }
  };

  return (
    <>
      <div className="mb-6">
        <button onClick={() => openModal()} className="bg-[#ff6b00] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-[#e66000] transition-colors flex items-center gap-2 text-sm">
          <Plus size={18} /> Add New Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Image</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Name</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category: any) => (
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
        <div className="fixed inset-0 bg-black/60 z-[1050] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-black uppercase tracking-tight">{editingCategory ? "Edit Category" : "New Category"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
              </div>

              <div>
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 accent-[#ff6b00]" />
                  <div>
                    <div className="font-bold">Feature on Homepage</div>
                    <div className="text-sm text-gray-500">Display this category as a visual card on the main landing page.</div>
                  </div>
                </label>
              </div>

              {formData.featured && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Card Description (Required for Featured)</label>
                    <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Card Image (Required for Featured)</label>
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
                </>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving || uploadingImage || (formData.featured && !formData.image)} className="px-6 py-3 bg-[#0a0a0a] text-white font-bold uppercase tracking-wide rounded-lg hover:bg-[#ff6b00] transition-colors disabled:opacity-50">
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
