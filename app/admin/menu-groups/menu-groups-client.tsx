"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MenuGroupsClient({ initialGroups, saveAction, deleteAction }: any) {
  const [groups, setGroups] = useState(initialGroups);

  useEffect(() => {
    setGroups(initialGroups);
  }, [initialGroups]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    sort_order: 0
  });

  const openModal = (group: any = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        id: group.id,
        name: group.name,
        sort_order: group.sort_order || 0
      });
    } else {
      setEditingGroup(null);
      setFormData({
        id: null, name: "", sort_order: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Name is required");
    
    setIsSaving(true);
    try {
      await saveAction(formData);
      toast.success(editingGroup ? "Menu Group updated!" : "Menu Group created!");
      closeModal();
    } catch (error: any) {
      toast.error(error.message || "Failed to save menu group");
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
            <p className="text-base font-black uppercase tracking-wide text-white">Delete Menu Group</p>
          </div>
          <p className="text-sm text-gray-400 font-medium">Are you sure you want to permanently remove this menu group? This action cannot be undone.</p>
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
                setGroups((prev: any) => prev.filter((g: any) => g.id !== id));
                toast.success("Menu Group deleted successfully", {
                  style: { background: '#0a0a0a', color: '#fff', border: '1px solid #333', borderRadius: '12px' }
                });
              } catch (err: any) {
                toast.error(err.message || "Failed to delete menu group", {
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
      <div className="mb-6">
        <button 
          onClick={() => openModal()}
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Menu Group
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8f8f8] text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Sort Order</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groups.map((group: any) => (
                <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#0a0a0a]">{group.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                      {group.sort_order}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => openModal(group)}
                      className="p-2 text-gray-400 hover:text-[#ff6b00] hover:bg-[#ff6b00]/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(group.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {groups.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No menu groups found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">{editingGroup ? 'Edit Menu Group' : 'New Menu Group'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent outline-none transition-all"
                  placeholder="e.g. ENGINE & EXHAUST"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input 
                  type="number" 
                  value={formData.sort_order}
                  onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the menu (0, 1, 2...)</p>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-[#ff6b00] hover:bg-[#e66000] text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
