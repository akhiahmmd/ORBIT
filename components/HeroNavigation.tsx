'use client';
import { motion } from 'framer-motion';

export default function HeroNavigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="absolute top-0 left-0 w-full z-50 pointer-events-none"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-10 py-5">
        {/* Logo */}
        <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.25em] text-white/90 uppercase pointer-events-auto select-none">
          <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 text-[9px] tracking-normal">N</span>
          ORBIT
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8 pointer-events-auto">
          {['Universe', 'How it works', 'Insights'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[11px] text-white/45 hover:text-white/90 transition-colors duration-300 tracking-[0.12em] uppercase"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#"
          className="hidden sm:flex items-center gap-2 text-[11px] text-white/55 hover:text-white transition-colors duration-300 pointer-events-auto tracking-[0.1em] uppercase"
        >
          Enter your universe
          <span className="text-white/30">→</span>
        </a>
      </div>
    </motion.nav>
  );
}
