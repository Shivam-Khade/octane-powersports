"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, Minus, Plus, MapPin, AlertCircle, Package } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useProfileModal } from "@/components/profile-context";
import { useCart } from "@/components/cart-context";
import { useLoginModal } from "@/components/login-context";
import "./checkout.css";

export default function CheckoutPage() {
  return <CheckoutContent />;
}

function CheckoutContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const { openModal: openProfileModal, isOpen: isProfileModalOpen } = useProfileModal();
  const { openModal: openLoginModal } = useLoginModal();
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { cartItems, updateQty, removeFromCart, clearCart } = useCart();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/address")
        .then(async res => {
          if (!res.ok) throw new Error("Failed to fetch address");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setAddresses(data);
            if (data.length > 0) setSelectedAddress(data[0]);
          }
        })
        .catch(err => console.error("Checkout address fetch error:", err));
    }
  }, [session, isProfileModalOpen]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Calculations
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + ((item.price - (item.packageDiscount || 0)) * item.quantity);
  }, 0);
  // const deliveryCharge = (totalPrice < 5000 && cartItems.length > 0) ? 300 : 0;
  const deliveryCharge = 0; // Temporarily disabled
  const finalTotal = totalPrice + deliveryCharge;

  const handleSubmit = async () => {
    if (!session?.user) {
      openLoginModal();
      return;
    }

    if (!selectedAddress) {
      setError("Please add a delivery address before making payment.");
      openProfileModal();
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      const resOrder = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const orderData = await resOrder.json();
      if (!resOrder.ok) throw new Error(orderData.error || "Failed to create order");

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Octane Powersports",
        description: "Premium Parts Purchase",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const finalOrderData = {
              total_amount: finalTotal,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              items: cartItems.map(i => ({
                product_name: i.name,
                price: i.price,
                quantity: i.quantity,
                package_id: i.packageId || null,
                package_name: i.packageName || null
              }))
            };

            const res = await fetch("/api/user/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(finalOrderData)
            });

            if (res.ok) {
              clearCart(); // Clear cart on success
              router.push("/orders");
              router.refresh();
            } else {
              const data = await res.json();
              setError(data.error || "Failed to finalize order in database");
              setSubmitting(false);
            }
          } catch (err) {
            setError("Failed to verify payment");
            setSubmitting(false);
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          contact: ""
        },
        theme: {
          color: "#ff6b00"
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError(response.error.description);
        setSubmitting(false);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Cart.</h1>
        </div>
        
        <div className="checkout-grid">
          {/* Left Column */}
          <div className="checkout-left">
            
            {/* Address Block */}
            <div className="checkout-panel">
              <div className="panel-header">
                <h2><span className="badge">1</span> Delivery Address</h2>
              </div>
              <div className="panel-body">
                <div className="address-block">
                  <div className="address-details w-full pr-4">
                    {selectedAddress ? (
                      <div>
                        <p className="mb-1 font-bold text-[#0a0a0a]">{selectedAddress.full_name || session?.user?.name || "Premium Rider"}</p>
                        <p className="text-[#0a0a0a] text-sm mb-1">{selectedAddress.address_line}</p>
                        <p className="text-[#0a0a0a] text-sm mb-1">{selectedAddress.city}, {selectedAddress.postal_code}</p>
                        <p className="text-sm text-[#878787] mb-3">Phone: {selectedAddress.phone}</p>
                        {selectedAddress.lat && selectedAddress.lng && (
                          <div className="h-28 w-full rounded-md overflow-hidden relative shadow-[0_1px_2px_0_rgba(0,0,0,0.1)] border border-[#e0e0e0]">
                            <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src={`https://maps.google.com/maps?q=${selectedAddress.lat},${selectedAddress.lng}&z=15&output=embed`} className="border-0 pointer-events-none"></iframe>
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[10px] px-2 py-1 rounded text-[#0a0a0a] font-bold border border-gray-100 flex items-center gap-1 shadow-sm">
                              <MapPin size={10} className="text-[#ff6b00]" /> GPS Pinned
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <strong>{session?.user?.name || "Premium Rider"}</strong>
                        <p className="mt-1">No delivery address saved yet.</p>
                        <p className="text-sm text-[#878787] mt-2">Add your delivery location in your profile pop-up.</p>
                      </>
                    )}
                  </div>
                  <button className="change-btn shrink-0" onClick={openProfileModal}>
                    {selectedAddress ? 'Change' : 'Add Address'}
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="checkout-panel">
              <div className="panel-header">
                <h2><span className="badge">2</span> Order Summary</h2>
              </div>
              <div className="panel-body cart-items">
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any premium parts yet.</p>
                  </div>
                ) : (
                  (() => {
                    const packagesMap = new Map();
                    const individualItems: any[] = [];
                    
                    cartItems.forEach(item => {
                      if (item.packageId) {
                        if (!packagesMap.has(item.packageId)) {
                          packagesMap.set(item.packageId, {
                            id: item.packageId,
                            name: item.packageName,
                            items: [],
                            discount: 0
                          });
                        }
                        const pkg = packagesMap.get(item.packageId);
                        pkg.items.push(item);
                        pkg.discount += (item.packageDiscount || 0);
                      } else {
                        individualItems.push(item);
                      }
                    });

                    return (
                      <>
                        {Array.from(packagesMap.values()).map(pkg => (
                          <div key={`pkg-${pkg.id}`} className="mb-6 border border-[#ff6b00]/30 rounded-lg overflow-hidden">
                            <div className="bg-[#ff6b00]/5 px-6 py-5 border-b border-[#ff6b00]/20 flex justify-between items-center">
                              <h3 className="font-bold text-[#ff6b00] text-sm md:text-base uppercase tracking-wider flex items-center gap-3">
                                <Package size={18} /> {pkg.name}
                              </h3>
                              <span className="text-[10px] md:text-xs font-bold bg-[#ff6b00] text-white px-3 py-1.5 rounded uppercase tracking-wider shadow-sm">Package Discount Applied</span>
                            </div>
                            <div className="bg-white px-4 md:px-6 py-2">
                              {pkg.items.map((item: any) => (
                                <div key={item.id} className="cart-item border-b border-gray-100 last:border-0 relative">
                                  <div className="item-img-placeholder relative">
                                    <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover rounded-md opacity-80" />
                                  </div>
                                  <div className="item-content">
                                    <div className="item-details">
                                      <h3>{item.name}</h3>
                                      <p className="item-seller">Seller: {item.seller}</p>
                                      <p className="item-price">
                                        ₹{(item.price - (item.packageDiscount || 0)).toLocaleString('en-IN')}
                                        <span className="ml-2 text-xs line-through text-gray-400">₹{item.price.toLocaleString('en-IN')}</span>
                                      </p>
                                    </div>
                                    <div className="item-actions">
                                      <div className="qty-control">
                                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)} disabled={item.quantity <= 1}>
                                          <Minus size={14} />
                                        </button>
                                        <span className="qty-display">{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>
                                          <Plus size={14} />
                                        </button>
                                      </div>
                                      <button className="remove-btn text-red-500" onClick={() => {
                                        toast.custom((t) => (
                                          <div className={`
                                            bg-[#0a0a0a] border border-[#ff6b00]/20 rounded-2xl p-5 shadow-2xl shadow-[#ff6b00]/10 max-w-sm w-full
                                            transition-all duration-300 ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                                          `}>
                                            <div className="flex items-start gap-4">
                                              <div className="bg-[#ff6b00]/10 p-2 rounded-full flex-shrink-0 mt-0.5">
                                                <AlertCircle size={20} className="text-[#ff6b00]" />
                                              </div>
                                              <div>
                                                <h4 className="text-white font-black uppercase tracking-wider text-sm mb-1">Break Package Deal?</h4>
                                                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                                                  Removing this item will destroy the bundle. The remaining items will return to their full standard price.
                                                </p>
                                                <div className="flex gap-3 justify-end">
                                                  <button 
                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                                                    onClick={() => toast.dismiss(t.id)}
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button 
                                                    className="px-4 py-2 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-[#ff6b00]/20"
                                                    onClick={() => {
                                                      removeFromCart(item.id, true);
                                                      toast.dismiss(t.id);
                                                    }}
                                                  >
                                                    Remove Item
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ), { duration: Infinity });
                                      }}>Remove</button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {individualItems.map(item => (
                          <div key={item.id} className="cart-item">
                            <div className="item-img-placeholder relative">
                              <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover rounded-md opacity-80" />
                            </div>
                            <div className="item-content">
                              <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="item-seller">Seller: {item.seller}</p>
                                <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                              </div>
                              <div className="item-actions">
                                <div className="qty-control">
                                  <button className="qty-btn" onClick={() => updateQty(item.id, -1)} disabled={item.quantity <= 1}>
                                    <Minus size={14} />
                                  </button>
                                  <span className="qty-display">{item.quantity}</span>
                                  <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className="place-order-wrapper desktop-place-order">
                  <button onClick={handleSubmit} disabled={submitting} className="place-order-btn">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : "PLACE ORDER"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="checkout-right">
            <div className="price-details">
              <div className="price-header">
                <h3>Price Details</h3>
              </div>
              <div className="price-body">
                <div className="price-row">
                  <span>Price ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="price-row">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? "free-text" : ""}>
                    {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                  </span>
                </div>
                
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
                
                {cartItems.length > 0 && (
                  <div className="mobile-place-order">
                    <button onClick={handleSubmit} disabled={submitting} className="place-order-btn">
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : "PLACE ORDER"}
                    </button>
                  </div>
                )}
                
                {error && (
                  <div className="mx-0 mt-6 mb-2 p-4 border border-[#e53935]/30 bg-[#e53935]/5 rounded-md flex gap-3 items-start shadow-[0_2px_10px_rgba(229,57,53,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#e53935]"></div>
                    <AlertCircle className="text-[#e53935] shrink-0 mt-0.5 ml-1" size={18} />
                    <div className="flex flex-col">
                      <span className="font-bold text-[#e53935] text-xs mb-1 uppercase tracking-wider">Transaction Failed</span>
                      <span className="text-[#d32f2f] text-sm leading-relaxed font-medium">
                        {error.includes("declined by the bank") 
                          ? "Your transaction was declined by the bank. Please use an alternative payment method to complete your order." 
                          : error}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex items-start gap-3 text-[#878787] text-sm p-4 bg-[#ffffff] rounded-md border border-[#e0e0e0] shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]">
              <CheckCircle2 size={24} className="text-[#388e3c] shrink-0" />
              <p className="m-0 leading-relaxed font-medium">
                Safe and Secure Payments. 100% Authentic products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
