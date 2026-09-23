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
      className="absolute bottom-12 left-0 w-full z-20 pointer-events-none"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="flex items-center gap-12 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start gap-2">
              <span className="text-white/80 text-[1.35rem] font-light tracking-wide leading-none">
                {stat.value}
              </span>
              <span className="text-white/40 text-[9px] tracking-[0.2em] font-sans uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
