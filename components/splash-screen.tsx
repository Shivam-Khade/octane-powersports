"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  // Default to true so it SSRs and covers the screen immediately, preventing nav flash
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if we've already shown the splash screen this session
    const hasShown = sessionStorage.getItem("splash_shown");
    
    if (hasShown) {
      setShow(false);
    } else {
      // Lock body scroll while splash is active
      document.body.style.overflow = "hidden";
      
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("splash_shown", "true");
        document.body.style.overflow = "";
      }, 3500); // 3.5s gives ample time for the background video to load
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          id="global-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Background Glow */}
          <motion.div 
            className="absolute inset-0 opacity-0"
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 3.5, ease: "easeInOut", times: [0, 0.5, 1] }}
            style={{
              background: "radial-gradient(circle at center, #ff6b00 0%, transparent 60%)"
            }}
          />

          <div className="relative z-10 flex flex-col items-center w-full px-6">
            <div className="overflow-hidden flex items-center justify-center pb-2">
              <motion.h1 
                className="text-5xl md:text-8xl font-black text-[#ff6b00] font-montserrat uppercase tracking-tighter m-0 leading-none"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                OCTANE
              </motion.h1>
            </div>

            {/* Center Line Expansion */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "320px", opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1], delay: 0.4 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent my-1"
            />
            
            <div className="overflow-hidden pt-2">
              <motion.p
                className="text-white font-bebas text-2xl md:text-4xl tracking-[0.4em] uppercase m-0"
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                POWERSPORTS
              </motion.p>
            </div>
            
            {/* Minimal Loading Indicator */}
            <motion.div 
              className="flex gap-3 items-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" style={{ animationDelay: "300ms" }} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
