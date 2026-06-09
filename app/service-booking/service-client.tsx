"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useLoginModal } from "@/components/login-context";
import "./service.css";

const formVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface InitialData {
  name: string;
  email: string;
  phone: string;
  bikeModel: string;
}

export function ServiceClient({ 
  isAuthenticated, 
  initialData 
}: { 
  isAuthenticated: boolean; 
  initialData?: InitialData; 
}) {
  const { openModal } = useLoginModal();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    bikeModel: initialData?.bikeModel || "",
    date: "",
    timeSlot: "",
    serviceType: "Part Installation",
    notes: ""
  });

  const TIME_SLOTS = [
    "12:00 PM – 2:00 PM",
    "2:00 PM – 4:00 PM",
    "4:00 PM – 6:00 PM",
    "6:00 PM – 8:00 PM"
  ];

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    if (!formData.date) {
      setBookedSlots([]);
      return;
    }
    
    // Reset timeSlot when date changes
    setFormData(prev => ({ ...prev, timeSlot: "" }));
    setIsLoadingSlots(true);

    fetch(`/api/service-bookings/availability?date=${formData.date}`)
      .then(res => res.json())
      .then(data => {
        if (data.bookedSlots) {
          setBookedSlots(data.bookedSlots);
        }
      })
      .catch(err => console.error("Failed to fetch slots", err))
      .finally(() => setIsLoadingSlots(false));
  }, [formData.date]);

  const isSlotPassed = (dateString: string, slotString: string) => {
    if (!dateString) return false;
    
    const now = new Date();
    // Use en-CA locale to get YYYY-MM-DD format natively
    const istDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    
    if (dateString !== istDateStr) return false;

    // Get current hour in IST (24-hour format)
    const currentHourStr = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false });
    let currentHour = parseInt(currentHourStr, 10);
    if (currentHour === 24) currentHour = 0;

    let slotStartHour = 0;
    if (slotString.includes("12:00 PM")) slotStartHour = 12;
    else if (slotString.includes("2:00 PM")) slotStartHour = 14;
    else if (slotString.includes("4:00 PM")) slotStartHour = 16;
    else if (slotString.includes("6:00 PM")) slotStartHour = 18;
    
    return currentHour >= slotStartHour;
  };

  const availableCount = formData.date ? TIME_SLOTS.filter(slot => !bookedSlots.includes(slot) && !isSlotPassed(formData.date, slot)).length : 0;
  const allSlotsBooked = formData.date ? availableCount === 0 : false;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const serviceOptions = ["Part Installation", "General Maintenance", "Fitment & Diagnostics", "Performance Tuning"];

  const handleSelect = (option: string) => {
    setFormData({ ...formData, serviceType: option });
    setDropdownOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      openModal();
      return;
    }

    setSubmitting(true);
    setError("");

    if (!formData.timeSlot) {
      toast.error("Please select an available time slot", { position: "top-right" });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/service-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Booking request submitted successfully! We'll contact you soon.", { position: "top-right" });
        setFormData({
          name: "", phone: "", email: "", bikeModel: "", date: "", timeSlot: "", serviceType: "Part Installation", notes: ""
        });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit booking", { position: "top-right" });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", { position: "top-right" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="service-split-layout">
      {/* Left Form Side */}
      <div className="service-form-side">
        <motion.div 
          className="service-form-container"
          variants={formVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="form-header">
            <h2>Request Booking</h2>
            <p>Tell us about your machine and what you need.</p>
          </motion.div>

          <form className="premium-service-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <motion.div variants={itemVariants} className="input-group">
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} placeholder=" " />
                <label htmlFor="name">Full Name <span className="text-red-500">*</span></label>
              </motion.div>
              <motion.div variants={itemVariants} className="input-group">
                <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} placeholder=" " />
                <label htmlFor="phone">Phone Number <span className="text-red-500">*</span></label>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="input-group">
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} placeholder=" " />
              <label htmlFor="email">Email Address <span className="text-red-500">*</span></label>
            </motion.div>

            <div className="form-row">
              <motion.div variants={itemVariants} className="input-group">
                <input type="text" name="bikeModel" id="bikeModel" required value={formData.bikeModel} onChange={handleChange} placeholder=" " />
                <label htmlFor="bikeModel">Bike Make & Model <span className="text-red-500">*</span></label>
              </motion.div>
              <motion.div variants={itemVariants} className="input-group">
                <input type="date" name="date" id="date" min={new Date().toISOString().split('T')[0]} required value={formData.date} onChange={handleChange} placeholder=" " />
                <label htmlFor="date" className={formData.date ? "active-date" : ""}>Preferred Date <span className="text-red-500">*</span></label>
              </motion.div>
            </div>

            {formData.date && (
              <motion.div variants={itemVariants} className="input-group">
                <label style={{position: 'static', transform: 'none', color: 'var(--gray-300)', fontSize: '13px', marginBottom: '10px', display: 'block'}}>
                  Available Time Slots <span className="text-red-500">*</span>
                </label>
                {isLoadingSlots ? (
                  <div className="text-sm text-gray-400 p-3">Loading available slots...</div>
                ) : allSlotsBooked ? (
                  <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-md border border-red-500/20 mt-2">
                    All slots are fully booked for this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {TIME_SLOTS.map(slot => {
                      const passed = isSlotPassed(formData.date, slot);
                      const isBooked = bookedSlots.includes(slot) || passed;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setFormData({ ...formData, timeSlot: slot })}
                          className={`time-slot-btn ${formData.timeSlot === slot ? "selected" : ""}`}
                        >
                          {slot} {bookedSlots.includes(slot) ? "(Booked)" : passed ? "(Passed)" : ""}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="input-group custom-select-group">
              <div 
                className={`custom-select-trigger ${dropdownOpen ? "open" : ""}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{formData.serviceType}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <label className="active-label">Service Type</label>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    className="custom-select-menu"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {serviceOptions.map(option => (
                      <div 
                        key={option} 
                        className={`custom-select-option ${formData.serviceType === option ? "selected" : ""}`}
                        onClick={() => handleSelect(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="input-group textarea-group">
              <textarea name="notes" id="notes" rows={4} value={formData.notes} onChange={handleChange} placeholder=" "></textarea>
              <label htmlFor="notes">Additional Notes or Mod Requests</label>
            </motion.div>

            <motion.div variants={itemVariants} className="form-submit-wrapper">
              <button type="submit" className="button submit-btn" disabled={submitting || allSlotsBooked}>
                {submitting ? "Submitting..." : "Confirm Request"}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* Center Divider */}
      <div className="service-divider">
        <div className="service-divider-line" />
        <div className="service-divider-badge">OR</div>
      </div>

      {/* Right Map Side */}
      <div className="service-map-side">
        <div className="service-map-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="map-header"
          >
            <h2 className="service-title">Visit the Store</h2>
            <p className="service-desc">
              Drop by our performance center for an in-person consultation or to view our latest inventory.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="map-iframe-wrapper"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.3730754481376!2d73.90570517517764!3d18.557211768053925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf84c8da5b85%3A0x2d7e90476395f8e2!2sOCTANE%20POWERSPORTS%20LLP!5e0!3m2!1sen!2sin!4v1780489754802!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
