"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SessionProvider, useSession } from "next-auth/react";
import { User, MapPin, Save, Loader2, X, Plus } from "lucide-react";
import { useProfileModal } from "./profile-context";
import toast from "react-hot-toast";

type Address = {
  id: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string;
};

export function ProfileModal() {
  return (
    <SessionProvider>
      <ProfileModalContent />
    </SessionProvider>
  );
}

function ProfileModalContent() {
  const { isOpen, closeModal } = useProfileModal();
  const { data: session } = useSession();
  
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">("profile");
  
  // Profile State
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    phone: "",
    bike_garage: "",
    fitment_preferences: ""
  });

  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressData, setAddressData] = useState({
    address_line: "",
    city: "",
    postal_code: ""
  });

  // Fetch Data when Modal Opens
  useEffect(() => {
    if (!isOpen || !session) return;
    
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            phone: data.phone || "",
            bike_garage: data.bike_garage || "",
            fitment_preferences: data.fitment_preferences || ""
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const res = await fetch("/api/user/address");
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchProfile();
    fetchAddresses();
  }, [isOpen, session]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (e.target.name === 'phone') value = value.replace(/\D/g, '');
    setProfileData({ ...profileData, [e.target.name]: value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);

    try {
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      if (res.ok) {
        setAddressData({ address_line: "", city: "", postal_code: "" });
        setShowAddressForm(false);
        toast.success("Address saved!");
        // Refresh addresses
        const newRes = await fetch("/api/user/address");
        if (newRes.ok) setAddresses(await newRes.json());
      } else {
        toast.error("Failed to save address");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setSavingAddress(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 pb-6 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white font-bold text-base">
                  {session?.user?.name?.charAt(0) || "R"}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0a0a0a] m-0 leading-tight">Rider Profile</h2>
                  <p className="text-xs text-gray-500 m-0">{session?.user?.email}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-black transition-colors p-1.5 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              {/* Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200 shadow-inner mb-5 w-max mx-auto">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-2 px-5 py-2 font-bold text-xs uppercase tracking-wide transition-all rounded-full ${activeTab === 'profile' ? 'bg-[#ff6b00] text-white shadow-md' : 'text-gray-500 hover:text-[#0a0a0a]'}`}
                >
                  <User size={14} /> Details
                </button>
                <button 
                  onClick={() => setActiveTab("addresses")}
                  className={`flex items-center gap-2 px-5 py-2 font-bold text-xs uppercase tracking-wide transition-all rounded-full ${activeTab === 'addresses' ? 'bg-[#ff6b00] text-white shadow-md' : 'text-gray-500 hover:text-[#0a0a0a]'}`}
                >
                  <MapPin size={14} /> Addresses
                </button>
              </div>

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  {loadingProfile ? (
                    <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-[#ff6b00]" size={28} /></div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-700">Full Name</label>
                          <input type="text" disabled value={session?.user?.name || ""} className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1 text-gray-700">Phone Number</label>
                          <input type="tel" pattern="[0-9]{10}" maxLength={10} title="Please enter a valid 10-digit phone number" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/10 outline-none transition-all text-sm text-black" placeholder="9876543210" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-700">Bike Garage (Your Motorcycles)</label>
                        <textarea name="bike_garage" value={profileData.bike_garage} onChange={handleProfileChange} rows={2} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/10 outline-none transition-all resize-none text-sm text-black" placeholder="e.g. 2023 KTM Duke 390"></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-700">Fitment Preferences</label>
                        <textarea name="fitment_preferences" value={profileData.fitment_preferences} onChange={handleProfileChange} rows={2} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/10 outline-none transition-all resize-none text-sm text-black" placeholder="e.g. Helmet Size L, Jacket Size 42"></textarea>
                      </div>

                      <div className="mt-2 flex justify-end">
                        <button type="submit" disabled={savingProfile} className="flex items-center justify-center gap-2 bg-[#0a0a0a] text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wide hover:bg-[#ff6b00] transition-colors disabled:opacity-70 w-full md:w-auto text-sm">
                          {savingProfile ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                          Save Profile
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  {loadingAddresses ? (
                    <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-[#ff6b00]" size={28} /></div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold">Saved Addresses</h3>
                        {!showAddressForm && (
                          <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-1.5 bg-[#ff6b00]/10 text-[#ff6b00] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-[#ff6b00] hover:text-white transition-colors">
                            <Plus size={14} /> Add New
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {showAddressForm && (
                          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddressSubmit} className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-200 shadow-sm overflow-hidden">
                            <div className="mb-3"><label className="block text-xs font-semibold mb-1 text-gray-700">Address Line</label><input required type="text" name="address_line" value={addressData.address_line} onChange={handleAddressChange} className="w-full p-2.5 text-sm text-black rounded-lg border border-gray-200 outline-none focus:border-[#ff6b00]" /></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div><label className="block text-xs font-semibold mb-1 text-gray-700">City</label><input required type="text" name="city" value={addressData.city} onChange={handleAddressChange} className="w-full p-2.5 text-sm text-black rounded-lg border border-gray-200 outline-none focus:border-[#ff6b00]" /></div>
                              <div><label className="block text-xs font-semibold mb-1 text-gray-700">Postal Code</label><input required type="text" name="postal_code" value={addressData.postal_code} onChange={handleAddressChange} className="w-full p-2.5 text-sm text-black rounded-lg border border-gray-200 outline-none focus:border-[#ff6b00]" /></div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button type="button" onClick={() => setShowAddressForm(false)} className="px-5 py-2 rounded-full font-bold uppercase tracking-wide text-gray-600 hover:bg-gray-200 transition-colors text-xs">Cancel</button>
                              <button type="submit" disabled={savingAddress} className="bg-[#0a0a0a] text-white px-5 py-2 rounded-full font-bold uppercase tracking-wide hover:bg-[#ff6b00] transition-colors text-xs min-w-[100px]">
                                {savingAddress ? <Loader2 className="animate-spin mx-auto" size={14} /> : "Save"}
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {addresses.length === 0 && !showAddressForm ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          <MapPin size={24} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 font-medium text-sm">No saved addresses yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {addresses.map((addr) => (
                            <div key={addr.id} className="border border-gray-200 rounded-xl p-4 hover:border-[#ff6b00] transition-colors bg-white flex justify-between items-start group">
                              <div>
                                <p className="text-[#0a0a0a] leading-relaxed text-sm font-medium">
                                  {addr.address_line}<br />
                                  {addr.city}, {addr.postal_code}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
