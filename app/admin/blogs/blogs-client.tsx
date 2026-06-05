"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";

export default function BlogsClient({ initialBlogs, saveAction, deleteAction }: any) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    slug: "",
    description: "",
    image: "",
    category: "",
    author: "",
    publishDate: "",
    readTime: 5,
    content: ""
  });

  const openModal = (blog: any = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData(blog);
    } else {
      setEditingBlog(null);
      setFormData({
        id: null, title: "", slug: "", description: "", image: "", category: "News", author: "Admin", 
        publishDate: new Date().toISOString().split('T')[0], readTime: 5, content: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
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
      if (formData.id) {
        setBlogs(blogs.map((b: any) => b.id === formData.id ? formData : b));
      } else {
        window.location.reload(); 
      }
      closeModal();
    } catch (err) {
      alert("Failed to save blog.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      await deleteAction(id);
      setBlogs(blogs.filter((b: any) => b.id !== id));
    }
  };

  return (
    <>
      <div className="mb-6">
        <button onClick={() => openModal()} className="bg-[#ff6b00] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-[#e66000] transition-colors flex items-center gap-2 text-sm">
          <Plus size={18} /> Add New Article
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Image</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Title</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Category</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Author</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider">Date</th>
                <th className="p-4 font-bold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog: any) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <img src={blog.image} alt={blog.title} className="w-16 h-10 object-cover rounded-md bg-gray-100" />
                  </td>
                  <td className="p-4 font-medium text-[#0a0a0a] max-w-xs truncate">{blog.title}</td>
                  <td className="p-4 text-sm text-gray-500">{blog.category}</td>
                  <td className="p-4 text-sm text-gray-500">{blog.author}</td>
                  <td className="p-4 text-sm text-gray-500">{blog.publishDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(blog)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-200 rounded-md">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 rounded-md">
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
              <h2 className="text-2xl font-black uppercase tracking-tight">{editingBlog ? "Edit Article" : "New Article"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                  <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Author</label>
                  <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Publish Date</label>
                <input required type="text" value={formData.publishDate} onChange={e => setFormData({...formData, publishDate: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
                <div className="flex gap-4 items-end">
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-200" />
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Short Description</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Content (HTML/Text)</label>
                <textarea rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00] font-mono text-sm"></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-6 py-3 font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving || uploadingImage} className="px-6 py-3 bg-[#0a0a0a] text-white font-bold uppercase tracking-wide rounded-lg hover:bg-[#ff6b00] transition-colors disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
