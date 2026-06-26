"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./bike-parts-search.css";

export function BikePartsSearch({ variant = "vertical" }: { variant?: "vertical" | "horizontal" }) {
  const router = useRouter();
  
  const [make, setMake] = useState("");
  const [series, setSeries] = useState("");
  const [model, setModel] = useState("");
  
  const [bikeData, setBikeData] = useState<Record<string, Record<string, Record<string, string[]>>>>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetch('/api/bike-models')
      .then(res => res.json())
      .then(data => {
        setBikeData(data);
        setLoadingData(false);
      })
      .catch(err => {
        console.error("Failed to load bike models:", err);
        setLoadingData(false);
      });
  }, []);

  const makes = useMemo(() => Object.keys(bikeData), [bikeData]);
  const seriesList = useMemo(() => (make && bikeData[make] ? Object.keys(bikeData[make]) : []), [bikeData, make]);
  const modelList = useMemo(() => (make && series && bikeData[make][series] ? Object.keys(bikeData[make][series]) : []), [bikeData, make, series]);

  const handleSearch = () => {
    if (!make || !series || !model) return;
    
    const params = new URLSearchParams();
    params.append("model", model);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <motion.div 
      className={`bike-parts-search variant-${variant}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <div className="bps-header">
        {variant === "horizontal" ? (
          <p className="bps-horizontal-title">Select bike-specific parts</p>
        ) : (
          <>
            <p>Bike-Specific Parts</p>
            <h2>Find Parts for Your Ride</h2>
          </>
        )}
      </div>

      <div className="bps-body">
        {/* Make Dropdown */}
        <CustomDropdown 
          label="Make"
          value={make}
          options={makes}
          onChange={(v) => {
            setMake(v);
            setSeries("");
            setModel("");
          }}
        />

        {/* Series Dropdown */}
        <CustomDropdown 
          label="Series"
          value={series}
          options={seriesList}
          onChange={(v) => {
            setSeries(v);
            setModel("");
          }}
          disabled={!make}
        />

        {/* Model Dropdown */}
        <CustomDropdown 
          label="Model"
          value={model}
          options={modelList}
          onChange={setModel}
          disabled={!series}
        />

        {variant === "horizontal" ? (
          <button 
            className="bps-submit-btn-horizontal" 
            onClick={handleSearch}
            disabled={!make || !series || !model}
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
        ) : (
          <button 
            className="bps-submit button primary" 
            onClick={handleSearch}
            disabled={!make || !series || !model}
          >
            <Search size={18} />
            Search Parts
          </button>
        )}
      </div>
    </motion.div>
  );
}

function CustomDropdown({ 
  label, 
  value, 
  options, 
  onChange, 
  disabled 
}: { 
  label: string, 
  value: string, 
  options: string[], 
  onChange: (v: string) => void,
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bps-group">
      <div 
        className={`bps-select-wrapper custom-bps-select ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => { if (!disabled) setIsOpen(!isOpen) }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={`bps-select-value ${!value ? 'placeholder' : ''}`}>{value || label}</span>
        <ChevronDown size={16} className={`bps-select-icon ${isOpen ? 'open' : ''}`} />
        
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div 
              className="bps-dropdown-menu"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {options.map(opt => (
                <div 
                  key={opt}
                  className={`bps-dropdown-option ${value === opt ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt);
                    setIsOpen(false);
                  }}
                >
                  {opt}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
