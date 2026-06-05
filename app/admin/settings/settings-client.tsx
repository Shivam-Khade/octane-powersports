"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsClient({ initialData, updateAction }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await updateAction(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully! If you changed your email or password, you may need to log in again.' });
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {message && (
        <div className={`p-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

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
