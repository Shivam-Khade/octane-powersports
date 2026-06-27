"use client";

import "./insta-grid.css";

const instaReels = [
  {
    id: "C-123456789", // <-- Replace with your 1st Reel's shortcode
    title: "Reel 1",
  },
  {
    id: "C-123456789", // <-- Replace with your 2nd Reel's shortcode
    title: "Reel 2",
  },
  {
    id: "C-123456789", // <-- Replace with your 3rd Reel's shortcode
    title: "Reel 3",
  },
  {
    id: "C-123456789", // <-- Replace with your 4th Reel's shortcode
    title: "Reel 4",
  }
];

export function InstaGrid() {
  const getEmbedUrl = (id: string) => {
    // If they pasted a full URL
    if (id.includes('instagram.com')) {
      const cleanUrl = id.split('?')[0].replace(/\/$/, '');
      return `${cleanUrl}/embed/`;
    }
    // If they pasted just the shortcode
    return `https://www.instagram.com/p/${id}/embed/`;
  };

  return (
    <div className="insta-grid">
      {instaReels.map((reel, idx) => (
        <div key={idx} className="insta-card">
          <iframe 
            src={getEmbedUrl(reel.id)}
            className="insta-iframe"
            frameBorder="0" 
            scrolling="no" 
            allow="encrypted-media"
            title={reel.title}
          />
        </div>
      ))}
    </div>
  );
}
