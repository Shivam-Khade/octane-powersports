"use client";


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { User, MapPin, Save, Loader2, X, Plus, Search } from "lucide-react";
import { useProfileModal } from "./profile-context";
import { usePathname } from "next/navigation";
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
  return <ProfileModalContent />;
}

function ProfileModalContent() {
  const { isOpen, closeModal } = useProfileModal();
  const { data: session } = useSession();
  const pathname = usePathname();
  


  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressData, setAddressData] = useState<{ full_name: string; phone: string; address_line: string; city: string; postal_code: string }>({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: ""
  });

  useEffect(() => {
    if (!isOpen || !session) return;

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

    fetchAddresses();
  }, [isOpen, session]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (e.target.name === 'phone') value = value.replace(/\D/g, '');
    setAddressData({ ...addressData, [e.target.name]: value });
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
        setAddressData({ full_name: "", phone: "", address_line: "", city: "", postal_code: "" });
        setShowAddressForm(false);
        toast.success("Address saved!");
        // Refresh addresses
        const newRes = await fetch("/api/user/address");
        if (newRes.ok) setAddresses(await newRes.json());
        
        // Auto-close modal after successful save
        closeModal();
      } else {
        toast.error("Failed to save address");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setSavingAddress(false);
    }
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1050] flex items-start justify-center pt-24 pb-6 px-4 sm:px-6">
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
                  {loadingAddresses ? (
                    <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-[#ff6b00]" size={28} /></div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4 gap-3">
                        <h3 className="text-base font-bold shrink-0">Delivery Address</h3>
                        {!showAddressForm && (
                          <button onClick={() => {
                            setAddressData({
                              full_name: addresses[0]?.full_name || session?.user?.name || "",
                              phone: addresses[0]?.phone || (session?.user as any)?.phone || "",
                              address_line: addresses[0]?.address_line || "",
                              city: addresses[0]?.city || "",
                              postal_code: addresses[0]?.postal_code || ""
                            });
                            setShowAddressForm(true);
                          }} className="flex items-center gap-1 bg-[#ff6b00]/10 text-[#ff6b00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide hover:bg-[#ff6b00] hover:text-white transition-colors shrink-0">
                            <Plus size={12} /> {addresses.length > 0 ? "Update Details" : "Add Details"}
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {showAddressForm && (
                          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddressSubmit} className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-200 shadow-sm overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div><label className="block text-xs font-semibold mb-1 text-gray-700">Full Name</label><input required type="text" name="full_name" value={addressData.full_name} onChange={handleAddressChange} className="w-full p-2.5 text-sm text-black rounded-lg border border-gray-200 outline-none focus:border-[#ff6b00]" placeholder="Receiver's Name" /></div>
                              <div><label className="block text-xs font-semibold mb-1 text-gray-700">Phone Number</label><input required type="tel" pattern="[0-9]{10}" name="phone" value={addressData.phone} onChange={handleAddressChange} className="w-full p-2.5 text-sm text-black rounded-lg border border-gray-200 outline-none focus:border-[#ff6b00]" placeholder="10-digit mobile number" /></div>
                            </div>
                            
                            <div className="mb-3">
                              <label className="block text-xs font-semibold mb-1 text-gray-700">Address Line</label>
                              <input required type="text" name="address_line" value={addressData.address_line} onChange={handleAddressChange} className="w-full p-2.5 text-sm text-black rounded-lg border border-gray-200 outline-none focus:border-[#ff6b00]" placeholder="House No, Building, Street" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div><label className="block text-xs font-semibold mb-1 text-gray-700">City</label><input required type="text" name="city" value={addressData.city} onChange={handleAddressChange} className="w-full p-2.5 text-sm text-black rounded-lg border border-gray-200 outline-none focus:border-[#ff6b00]" placeholder="City" /></div>
                              <div><label className="block text-xs font-semibold mb-1 text-gray-700">Postal Code</label><input required type="text" name="postal_code" value={addressData.postal_code} onChange={handleAddressChange} className="w-full p-2.5 text-sm text-black rounded-lg border border-gray-200 outline-none focus:border-[#ff6b00]" placeholder="123456" /></div>
                            </div>
                            

                            <div className="flex gap-2 justify-end">
                              <button type="button" onClick={() => setShowAddressForm(false)} className="px-5 py-2 rounded-full font-bold uppercase tracking-wide text-gray-600 hover:bg-gray-200 transition-colors text-xs">Cancel</button>
                              <button type="submit" disabled={savingAddress} className="bg-[#0a0a0a] text-white px-5 py-2 rounded-full font-bold uppercase tracking-wide hover:bg-[#ff6b00] transition-colors text-xs min-w-[100px] disabled:opacity-50 disabled:hover:bg-[#0a0a0a] disabled:cursor-not-allowed">
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
                            <div key={addr.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#ff6b00] transition-colors bg-white group shadow-sm">
                              <div className="p-4 flex justify-between items-start border-b border-gray-100">
                                <div>
                                  <p className="text-[#0a0a0a] font-bold text-sm mb-1">{addr.full_name}</p>
                                  <p className="text-gray-500 text-xs font-medium mb-1">
                                    {addr.address_line}<br />
                                    {addr.city}, {addr.postal_code}
                                  </p>
                                  <p className="text-gray-500 text-xs font-medium">Phone: {addr.phone}</p>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
