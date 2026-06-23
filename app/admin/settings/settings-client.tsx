"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsClient({ initialData, initialGridSettings, updateAction }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    gridSettings: {
      categoryDesktopCols: initialGridSettings?.categoryDesktopCols || initialGridSettings?.desktopColumns || 4,
      categoryMobileCols: initialGridSettings?.categoryMobileCols || initialGridSettings?.mobileColumns || 3,
      brandDesktopCols: initialGridSettings?.brandDesktopCols || initialGridSettings?.desktopColumns || 4,
      brandMobileCols: initialGridSettings?.brandMobileCols || initialGridSettings?.mobileColumns || 3
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateAction(formData);
      toast.success('Settings updated successfully!');
      if (formData.password) {
        toast('You may need to log in again since your password changed.', { icon: 'ℹ️' });
      }
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
        <input 
          required 
          type="text" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" 
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
        <input 
          required 
          type="email" 
          value={formData.email} 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" 
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">New Password (leave blank to keep current)</label>
        <input 
          type="password" 
          value={formData.password} 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          placeholder="••••••••"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" 
        />
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-black uppercase mb-4 text-[#0a0a0a]">Shop By Category Grid</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Desktop Columns</label>
            <input 
              required 
              type="number" 
              min="1"
              max="12"
              value={formData.gridSettings.categoryDesktopCols} 
              onChange={e => setFormData({
                ...formData, 
                gridSettings: { ...formData.gridSettings, categoryDesktopCols: parseInt(e.target.value) || 1 }
              })} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Columns</label>
            <input 
              required 
              type="number" 
              min="1"
              max="6"
              value={formData.gridSettings.categoryMobileCols} 
              onChange={e => setFormData({
                ...formData, 
                gridSettings: { ...formData.gridSettings, categoryMobileCols: parseInt(e.target.value) || 1 }
              })} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" 
            />
          </div>
        </div>

        <h3 className="text-lg font-black uppercase mb-4 text-[#0a0a0a] pt-4 border-t border-gray-100">Shop By Brand Grid</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Desktop Columns</label>
            <input 
              required 
              type="number" 
              min="1"
              max="12"
              value={formData.gridSettings.brandDesktopCols} 
              onChange={e => setFormData({
                ...formData, 
                gridSettings: { ...formData.gridSettings, brandDesktopCols: parseInt(e.target.value) || 1 }
              })} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Columns</label>
            <input 
              required 
              type="number" 
              min="1"
              max="6"
              value={formData.gridSettings.brandMobileCols} 
              onChange={e => setFormData({
                ...formData, 
                gridSettings: { ...formData.gridSettings, brandMobileCols: parseInt(e.target.value) || 1 }
              })} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6b00]" 
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isSaving} 
          className="px-6 py-3 bg-[#0a0a0a] text-white font-bold uppercase tracking-wide rounded-lg hover:bg-[#ff6b00] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
