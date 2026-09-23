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
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 lg:px-16 py-8">
        {/* Logo */}
        <div className="flex items-center gap-3 text-[13px] font-sans font-light tracking-[0.3em] text-white/90 uppercase pointer-events-auto select-none">
          ORBIT
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-10 pointer-events-auto">
          {['Universe', 'How it works', 'Insights'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[12px] text-white/50 hover:text-white/90 transition-colors duration-300 tracking-[0.05em] font-light"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#"
          className="hidden sm:flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[12px] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 pointer-events-auto tracking-[0.05em] font-light"
        >
          Enter your universe
          <span className="text-white/50 font-normal">→</span>
        </a>
      </div>
    </motion.nav>
  );
}
