"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { communityImages } from "@/lib/data";
import "./community-grid.css";

export function CommunityGrid() {
  return (
    <div className="community-grid">
      {communityImages.map((src, i) => (
        <motion.div
          key={i}
          className="community-cell"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={src}
            alt={`Rider community photo ${i + 1}`}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
          />
          <div className="community-overlay">
            <ExternalLink size={24} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
