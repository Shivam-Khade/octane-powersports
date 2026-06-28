"use client";

import { useEffect } from "react";
import { Video } from "lucide-react";

import "./insta-grid.css";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const instaReels = [
  {
    id: "DRwSVqJDQ5G",
    title: "Reel 1",
  },
  {
    id: "DQpoQIaDb3S",
    title: "Reel 2",
  },
  {
    id: "DSVUT36DV-v",
    title: "Reel 3",
  },
  {
    id: "DRzXupjiNGF",
    title: "Reel 4",
  }
];

export function InstaGrid() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const getPermalink = (id: string) => {
    if (id.includes('instagram.com')) {
      const cleanUrl = id.split('?')[0].replace(/\/$/, '');
      return `${cleanUrl}/`;
    }
    return `https://www.instagram.com/reel/${id}/`;
  };

  return (
    <div className="insta-grid">
      {instaReels.map((reel, idx) => (
        <div key={idx} className="insta-card">
          {reel.id === "C-123456789" ? (
            <div className="flex flex-col items-center justify-center bg-[#111] text-gray-400 p-6 text-center border-2 border-dashed border-gray-800 rounded-2xl" style={{ width: "100%", height: "500px" }}>
              <Video size={48} className="mb-4 text-[#ff6b00]" />
              <p className="font-bold text-lg text-white">Placeholder Reel</p>
              <p className="text-sm mt-2 max-w-[200px]">Update code with your real Instagram shortcode to view it here.</p>
            </div>
          ) : (
            <>
              {/* Skeleton Loader behind the blockquote */}
              <div className="absolute inset-0 p-5 flex flex-col gap-4 bg-gray-50/50 animate-pulse z-0 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="w-full flex-1 bg-gray-200 rounded-lg"></div>
                <div className="flex gap-4">
                   <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                   <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                   <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              <blockquote
                className="instagram-media relative z-10"
                data-instgrm-permalink={getPermalink(reel.id)}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: "0",
                  margin: "0",
                  padding: "0",
                  width: "100%",
                }}
              ></blockquote>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
