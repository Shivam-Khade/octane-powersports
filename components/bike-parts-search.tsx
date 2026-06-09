"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./bike-parts-search.css";

const bikeData = {
  "BMW": {
    "R": {
      "GS1300": ["Engine ice", "Brembo"]
    }
  },
  "Kawasaki": {
    "Ninja ZX": {
      "Zx10r": ["Engine ice", "Eazi grip"]
    },
    "z": {
      "z900": ["Engine ice", "R&G", "Pirelli"]
    }
  },
  "Royal Enfield": {
    "650": {
      "Interceptor": ["K&N"],
      "GT": ["K&N"]
    }
  }
};

export function BikePartsSearch() {
  const router = useRouter();
  
  const [make, setMake] = useState("");
  const [series, setSeries] = useState("");
  const [model, setModel] = useState("");

  const makes = Object.keys(bikeData);
  const seriesList = make ? Object.keys(bikeData[make as keyof typeof bikeData]) : [];
  const modelList = make && series ? Object.keys(bikeData[make as keyof typeof bikeData][series as keyof typeof bikeData[keyof typeof bikeData]]) : [];

  const handleSearch = () => {
    if (!make || !series || !model) return;
    
    const parts = bikeData[make as keyof typeof bikeData][series as keyof typeof bikeData[keyof typeof bikeData]][model as keyof typeof bikeData[keyof typeof bikeData][keyof typeof bikeData[keyof typeof bikeData]]];
    
    if (parts && parts.length > 0) {
      // Construct the URL with multiple brand parameters
      const params = new URLSearchParams();
      parts.forEach(part => params.append("brand", part));
      router.push(`/shop?${params.toString()}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <motion.div 
      className="bike-parts-search"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <div className="bps-header">
        <h2>Find parts, accessories & consumables</h2>
        <p>Bike-Specific Parts</p>
      </div>

      <div className="bps-body">
        {/* Make Dropdown */}
        <CustomDropdown 
          label="Select Make"
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
          label="Select Series"
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
          label="Select Model"
          value={model}
          options={modelList}
          onChange={setModel}
          disabled={!series}
        />

        <button 
          className="bps-submit button primary"
          disabled={!make || !series || !model}
          onClick={handleSearch}
        >
          <Search size={18} />
          Search Parts
        </button>
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
