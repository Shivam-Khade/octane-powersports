"use client";

import { motion } from "framer-motion";
import "./brand-marquee.css";

const featuredBrands = [
  { name: "Eazi grip", type: "Tank Grips" },
  { name: "K&N", type: "Air Filters" },
  { name: "Brembo", type: "Braking Systems" },
  { name: "R&G", type: "Crash Protection" },
  { name: "Pirelli", type: "Tyres" },
  { name: "Engine ice", type: "Coolants" }
];

export function BrandMarquee() {
  const marqueeBrands = [...featuredBrands, ...featuredBrands];

  return (
    <section className="brand-showcase-section" id="brands">
      <div className="brand-marquee-container">
        <div className="brand-marquee-track">
          {marqueeBrands.map((brand, i) => (
            <div key={`${brand.name}-${i}`} className="brand-showcase-card">
              <span className="brand-card-logo">{brand.name}</span>
              <span className="brand-card-type">{brand.type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
