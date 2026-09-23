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
    <section className="relative h-screen min-h-[720px] w-full overflow-hidden bg-[#010204]">
      {/* 3D Galaxy — fills entire viewport behind everything */}
      <div className="absolute inset-0 z-0">
        <OrbitScene />
      </div>

      {/* Subtle vignette for edge blending */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(1,2,4,0.8)] z-[5]" />

      {/* Navigation */}
      <HeroNavigation />

      {/* Left text overlay */}
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-8 lg:px-16 flex items-center pointer-events-none">
        <div className="w-full lg:w-[48%] flex flex-col justify-center pt-12">
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
            className="text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-serif text-[#ffffff] tracking-tight leading-[1.05] mb-8 text-balance"
          >
            Explore the patterns <br />
            that shape you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="text-[1.1rem] text-white/60 max-w-md mb-12 leading-[1.8] font-light"
          >
            Turn your thoughts, goals, and daily moments into an interactive universe powered by AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="flex flex-row items-center gap-8 pointer-events-auto"
          >
            <button className="group relative flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90 hover:bg-white/10 hover:border-white/30 transition-all duration-500 w-fit text-[14px] font-light tracking-wide overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Enter Your Universe
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>

            <a href="#how-it-works" className="group flex items-center gap-3 text-[14px] text-white/60 hover:text-white/95 transition-colors w-fit font-light cursor-pointer">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/5 group-hover:border-white/50 group-hover:bg-white/10 transition-all">
                <div className="ml-0.5 w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent" />
              </div>
              Explore how it works
            </a>
          </motion.div>
        </div>
      </div>

      {/* Right side subtle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
        className="absolute right-10 bottom-12 z-20 hidden lg:flex items-center gap-3 pointer-events-none opacity-50"
      >
        <span className="text-[9px] font-mono tracking-[0.2em] text-white uppercase">Scroll to explore</span>
        <span className="text-[9px] text-white">↓</span>
      </motion.div>

      {/* Stats strip */}
      <HeroStats />
    </section>
  );
}
