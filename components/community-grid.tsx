"use client";

import Image from "next/image";
import { Play, Share2, Clock } from "lucide-react";
import "./community-grid.css";

const sideVideos = [
  {
    id: "bnyeS1wHJ1c",
    url: "https://youtu.be/bnyeS1wHJ1c?si=uuHuKZNb24kohe0d",
    title: "Kawasaki Ninja 650 Akrapovič Full System & Rapid Bike Tuning!",
  },
  {
    id: "WZtnOA5u77s",
    url: "https://youtu.be/WZtnOA5u77s?si=pV2NlQrE9M6sPp0M",
    title: "Octane Powersports Custom Build Review",
  },
  {
    id: "3vxPDnZhcuE",
    url: "https://youtu.be/3vxPDnZhcuE?si=AeTgScOvzyg_MfKB",
    title: "Kawasaki Z900 SC Project CRT Titanium Slip-on Exhaust",
  },
  {
    id: "9lhzKzzmxXI",
    url: "https://youtu.be/9lhzKzzmxXI?si=BKUhQSMfT5Af6BOG",
    title: "2023 BMW S1000RR PRO Arrow Pista Exhaust Build",
  }
];

export function CommunityGrid() {
  return (
    <div className="youtube-feed">
      {/* Left Large Video */}
      <div className="yt-main-video group">
        <div className="yt-thumbnail">
          <iframe 
            src="https://www.youtube.com/embed/WLpi1vSPPdY?rel=0" 
            title="Octane Powersports YouTube Video" 
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
      
      {/* Right Column Videos */}
      <div className="yt-side-videos">
        {sideVideos.map((video) => (
          <a key={video.id} href={video.url} target="_blank" rel="noreferrer" className="yt-side-card group">
            <div className="yt-side-thumbnail">
              <img 
                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                alt={video.title} 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
            <div className="yt-side-info">
              <h4>{video.title}</h4>
              <span className="yt-watch-link">Watch on YouTube</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
