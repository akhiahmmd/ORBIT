'use client';
import { motion } from 'framer-motion';

interface MemoryFormationProps {
  onViewOrbit: () => void;
}

export default function MemoryFormation({ onViewOrbit }: MemoryFormationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-10 w-full max-w-[400px]"
    >
      {/* Event Star Container */}
      <div className="relative w-full h-[180px] flex items-center justify-center">
        
        {/* Converging Labels Animation (fakes the labels collapsing) */}
        {[
          { x: -60, y: -40, delay: 0 },
          { x: 60, y: -40, delay: 0.05 },
          { x: -40, y: 40, delay: 0.1 },
          { x: 40, y: 40, delay: 0.15 }
        ].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: pos.x, y: pos.y, scale: 1 }}
            animate={{ opacity: 0, x: 0, y: 0, scale: 0.1 }}
            transition={{ duration: 0.4, delay: pos.delay, ease: 'backIn' }}
            className="absolute px-3 py-1.5 rounded-full"
            style={{
              background: '#141824',
              border: '1px solid #2e3650',
            }}
          />
        ))}

        {/* Luminous Star Formation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, type: 'spring', bounce: 0.4 }}
          className="relative flex items-center justify-center"
        >
          {/* Outer glow */}
          <div 
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '100px', height: '100px',
              background: 'radial-gradient(circle, rgba(129, 140, 248, 0.15) 0%, rgba(129, 140, 248, 0.05) 40%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />

          {/* Star core rings */}
          <div className="absolute rounded-full"
            style={{
              width: '44px', height: '44px',
              border: '1px solid rgba(129, 140, 248, 0.25)',
              boxShadow: '0 0 20px rgba(129, 140, 248, 0.15)',
            }}
          />
          <div className="absolute rounded-full"
            style={{
              width: '24px', height: '24px',
              border: '1px solid rgba(129, 140, 248, 0.4)',
            }}
          />
          
          {/* Solid core */}
          <div className="relative z-10 rounded-full bg-white"
            style={{
              width: '8px', height: '8px',
              boxShadow: '0 0 20px rgba(165, 180, 252, 1), 0 0 40px rgba(129, 140, 248, 0.6)',
            }}
          />

          {/* Diffraction spikes */}
          {[0, 90, 180, 270].map((angle) => (
            <div
              key={angle}
              className="absolute"
              style={{
                width: '24px', height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(165, 180, 252, 0.6), transparent)',
                transform: `rotate(${angle}deg)`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Metadata & Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <div className="flex flex-col items-center gap-1">
          <span 
            className="font-mono text-[10px] tracking-widest uppercase text-indigo-300/70"
          >
            AUG 15, 2026
          </span>
          <span 
            className="font-serif text-[14px] text-slate-300"
          >
            PYTHON / LEARNING
          </span>
        </div>

        <p 
          className="font-serif text-[13px] text-slate-400 italic"
        >
          One moment became a memory.
        </p>

        <button
          onClick={onViewOrbit}
          className="mt-2 group w-[220px] py-3 rounded-lg flex items-center justify-center gap-2 bg-[#141824] hover:bg-[#1a1f30] border border-[#2e3650] hover:border-indigo-500/50 transition-all duration-300 active:scale-[0.98]"
        >
          <span className="font-mono tracking-widest text-[11px] uppercase font-medium text-indigo-200 group-hover:text-indigo-100 transition-colors">
            View in ORBIT
          </span>
          <svg 
            width="12" height="12" viewBox="0 0 12 12" fill="none" 
            className="transition-transform duration-300 group-hover:translate-x-1 text-indigo-300 group-hover:text-indigo-200"
          >
            <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
