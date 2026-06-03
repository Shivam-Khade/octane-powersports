"use client";

import { motion } from "framer-motion";
import "./brand-marquee.css";

const featuredBrands = [
  { name: "AGV", type: "Helmets & Safety" },
  { name: "Alpinestars", type: "Riding Gear" },
  { name: "Rynox", type: "Touring Apparel" },
  { name: "MT Helmets", type: "Helmets" },
  { name: "LS2", type: "Helmets & Apparel" },
  { name: "Axor", type: "Helmets & Goggles" },
  { name: "KTM", type: "PowerParts" },
  { name: "Kawasaki", type: "Performance Parts" },
  { name: "Ducati", type: "Exhausts & Carbon" },
  { name: "BMW Motorrad", type: "Adventure Luggage" },
  { name: "Triumph", type: "Crash Protection" },
  { name: "Royal Enfield", type: "Genuine Accessories" }
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
