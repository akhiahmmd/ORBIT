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
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden bg-[#02030a]">
      {/* 3D Galaxy — fills entire viewport behind everything */}
      <div className="absolute inset-0 z-0">
        <OrbitScene />
      </div>

      {/* Navigation */}
      <HeroNavigation />

      {/* Left text overlay */}
      <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center pointer-events-none">
        <div className="w-full lg:w-[46%] flex flex-col justify-center pt-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="flex items-center gap-3 text-[10px] font-mono text-white/45 tracking-[0.28em] uppercase mb-8"
          >
            <span className="h-px w-8 bg-indigo-200/50" />
            Personal pattern archive
            <span className="text-white/20">/ 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="text-[3.1rem] md:text-[4.25rem] lg:text-[4.8rem] font-serif text-[#f8f9fa] tracking-[-0.02em] leading-[1.05] mb-8 text-balance"
          >
            Explore the patterns <br />
            that shape you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="text-[1.05rem] text-white/62 max-w-md mb-11 leading-[1.75] font-light"
          >
            Turn your thoughts, goals, and daily moments into an interactive universe powered by AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="flex flex-row items-center gap-6 pointer-events-auto"
          >
            <button className="group flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border border-indigo-200/20 bg-[#0a0f1d]/60 backdrop-blur-md text-white hover:bg-white/10 hover:border-indigo-200/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-500 w-fit text-[13px] font-medium tracking-wide">
              Enter Your Universe
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            <a href="#" className="group flex items-center gap-3 text-[13px] text-white/50 hover:text-white/90 transition-colors w-fit pl-2">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-white/20 text-[9px] group-hover:border-white/50">▶</span>
              Explore how it works
            </a>
          </motion.div>
        </div>
      </div>

      {/* Quiet instrumentation grounds the scene in a real, explorable product. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
        className="absolute right-6 bottom-24 z-20 hidden w-44 text-right lg:block pointer-events-none"
      >
        <div className="mb-3 flex items-center justify-end gap-2 text-[9px] font-mono tracking-[0.22em] text-white/30 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
          Live constellation
        </div>
        <div className="border-t border-white/10 pt-3 text-[10px] font-mono leading-relaxed tracking-[0.12em] text-white/24 uppercase">
          Drag to orbit<br />
          Select a memory to inspect
        </div>
      </motion.div>

      {/* Stats strip */}
      <HeroStats />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#010204] to-transparent pointer-events-none z-20" />

      {/* Left side text readability — subtle gradient */}
      <div className="absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-[#02030a]/92 via-[#02030a]/55 to-transparent pointer-events-none z-[5] hidden lg:block" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#02030a]/45 to-transparent pointer-events-none z-[5]" />
    </section>
  );
}
