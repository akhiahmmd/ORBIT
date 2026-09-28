'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import HeroNavigation from './HeroNavigation';
import HeroStats from './HeroStats';

// Dynamic import to avoid SSR issues with Three.js
const OrbitScene = dynamic(() => import('./orbit/OrbitScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#010204]" />,
});

export default function OrbitHero() {
  return (
    <section className="relative w-full h-[100dvh] min-h-[720px] overflow-hidden bg-[#010204]">
      {/* 3D Galaxy — fills entire viewport behind everything */}
      <div className="absolute inset-0 z-0">
        <OrbitScene />
      </div>

      {/* Subtle vignette for edge blending and left-side readability */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(1,2,4,0.8)] z-[5]" />
      <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-gradient-to-r from-[#010204]/90 via-[#010204]/50 to-transparent pointer-events-none z-[6]" />

      {/* Navigation - Absolute top */}
      <div className="absolute top-0 left-0 w-full z-50">
        <HeroNavigation />
      </div>

      {/* Left text overlay - Centered vertically within exactly 100dvh */}
      <div className="relative z-10 w-full h-full max-w-[1440px] mx-auto px-8 lg:px-16 flex flex-col justify-center pointer-events-none pb-12">
        <div className="w-full lg:w-[50%] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-[12px] font-sans tracking-[0.4em] text-white/50 uppercase mb-6"
          >
            O R B I T
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-serif text-[#ffffff] tracking-tight leading-[1.02] mb-8 text-balance drop-shadow-2xl"
          >
            Explore the patterns <br />
            <span className="text-white/80 italic font-light">that shape you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="text-[1.1rem] lg:text-[1.2rem] text-white/70 max-w-md mb-12 leading-[1.7] font-light drop-shadow-md"
          >
            Turn your thoughts, goals, and daily moments into an interactive universe powered by AI.
          </motion.p>

          {/* CTA Buttons - Positioned deliberately below supporting text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 pointer-events-auto mt-2"
          >
            <a href="#how-it-works" className="group relative flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/95 hover:bg-white/10 hover:border-white/30 transition-all duration-500 w-fit text-[14px] font-light tracking-wide overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <span className="relative z-10 flex items-center gap-2">
                Enter Your Universe
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </a>

            <div className="relative group">
              <a href="#how-it-works" className="relative z-10 flex items-center gap-3 text-[14px] text-white/60 group-hover:text-white transition-colors duration-500 w-fit font-light cursor-pointer">
                <div className="relative flex h-8 w-8 items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border border-white/20 bg-white/5 group-hover:border-white/40 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="relative ml-0.5 w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white/80 border-b-[4px] border-b-transparent group-hover:border-l-white transition-colors duration-500" />
                </div>
                Explore how it works
              </a>
              
              {/* Orbital Cue */}
              <div className="absolute left-[15px] top-[32px] w-[150px] h-[100px] pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                <svg width="150" height="100" viewBox="0 0 150 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                  <path 
                    d="M0,0 C0,40 20,60 80,75" 
                    stroke="url(#hero-orbit-grad)" 
                    strokeWidth="1.5" 
                    fill="none" 
                  />
                  <circle r="3" fill="#ffffff" filter="blur(3px)" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M0,0 C0,40 20,60 80,75" />
                    <animate attributeName="opacity" values="0;0.8;0.8;0" keyTimes="0;0.2;0.8;1" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="1.5" fill="#ffffff" className="opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M0,0 C0,40 20,60 80,75" />
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <defs>
                    <linearGradient id="hero-orbit-grad" x1="0" y1="0" x2="80" y2="75" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Editorial label */}
              <div
                className="absolute left-[45px] top-[55px] text-[10px] font-mono tracking-[0.2em] text-white/70 uppercase pointer-events-none whitespace-nowrap group-hover:text-white group-hover:tracking-[0.22em] transition-all duration-700"
              >
                NEXT — HOW IT WORKS
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side subtle next-step indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
        className="absolute right-10 bottom-12 z-20 hidden lg:flex items-center gap-3 pointer-events-none opacity-50"
      >
        <span className="text-[9px] font-mono tracking-[0.2em] text-white uppercase">Continue</span>
        <span className="text-[12px] text-white leading-none">→</span>
      </motion.div>

      {/* Stats strip - Absolute bottom */}
      <div className="absolute bottom-10 md:bottom-12 left-0 w-full z-20">
        <HeroStats />
      </div>
    </section>
  );
}
