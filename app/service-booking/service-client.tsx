"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
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

export function ServiceClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bikeModel: "",
    date: "",
    serviceType: "Part Installation",
    notes: ""
  });

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
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/service-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: "", phone: "", email: "", bikeModel: "", date: "", serviceType: "Part Installation", notes: ""
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit booking");
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
                <label htmlFor="name">Full Name</label>
              </motion.div>
              <motion.div variants={itemVariants} className="input-group">
                <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleChange} placeholder=" " />
                <label htmlFor="phone">Phone Number</label>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="input-group">
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} placeholder=" " />
              <label htmlFor="email">Email Address</label>
            </motion.div>

            <div className="form-row">
              <motion.div variants={itemVariants} className="input-group">
                <input type="text" name="bikeModel" id="bikeModel" required value={formData.bikeModel} onChange={handleChange} placeholder=" " />
                <label htmlFor="bikeModel">Bike Make & Model</label>
              </motion.div>
              <motion.div variants={itemVariants} className="input-group">
                <input type="date" name="date" id="date" required value={formData.date} onChange={handleChange} placeholder=" " />
                <label htmlFor="date" className={formData.date ? "active-date" : ""}>Preferred Date</label>
              </motion.div>
            </div>

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
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
              {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">Booking request submitted successfully! We'll contact you soon.</div>}
              <button type="submit" className="button submit-btn" disabled={submitting || success}>
                {submitting ? "Submitting..." : success ? "Submitted!" : "Confirm Request"}
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
            <h2 className="service-title">Visit Offline</h2>
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
