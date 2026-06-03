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
  return (
    <section className="brand-showcase-section" id="brands">
      <div className="container">
        <div className="brand-showcase-grid">
          {featuredBrands.map((brand, i) => (
            <motion.div
              key={brand.name}
              className="brand-showcase-card"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="brand-card-logo">{brand.name}</span>
              <span className="brand-card-type">{brand.type}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
