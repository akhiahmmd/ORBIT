'use client';
import { motion } from 'framer-motion';

const stats = [
  { label: 'DAYS', value: '31' },
  { label: 'ENTRIES', value: '146' },
  { label: 'PATTERNS', value: '18' },
  { label: 'CLUSTERS', value: '6' },
];

export default function HeroStats() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
      className="absolute bottom-0 left-0 w-full z-20 pointer-events-none"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-6">
          <div className="flex items-center gap-10 md:gap-14">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-start gap-1">
                <span className="text-white/90 text-xl font-normal tracking-tight leading-none">
                  {stat.value}
                </span>
                <span className="text-white/40 text-[9px] tracking-[0.15em] uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
            {/* Subtle line */}
          <div className="flex-1 h-px bg-gradient-to-r from-white/5 to-transparent hidden md:block" />
        </div>
      </div>
    </motion.div>
  );
}
