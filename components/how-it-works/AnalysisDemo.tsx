'use client';
import { motion } from 'framer-motion';

interface AnalysisDemoProps {
  onCreateMemory: () => void;
}

const LABELS = [
  { text: 'PYTHON', delay: 0.05 },
  { text: 'LEARNING', delay: 0.1 },
  { text: 'HAPPY', delay: 0.15 },
  { text: 'PRODUCTIVE', delay: 0.2 },
];

export default function AnalysisDemo({ onCreateMemory }: AnalysisDemoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-10 w-full max-w-[400px]"
    >
      {/* Semantic Labels Container */}
      <div className="relative w-full h-[180px] flex items-center justify-center">
        {/* Subtle background glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(140,165,255,0.08) 0%, transparent 60%)',
          }}
        />

        {/* The Labels */}
        <div className="flex flex-wrap justify-center gap-3 relative z-10 w-[240px]">
          {LABELS.map((label, idx) => (
            <motion.div
              key={label.text}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: label.delay,
                type: 'spring',
                bounce: 0.3
              }}
              className="px-4 py-2 rounded-full backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <span 
                className="font-mono text-[10px] tracking-[0.2em] uppercase font-medium"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {label.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explanatory Text & Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <p 
          className="font-serif italic"
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}
        >
          ORBIT found these patterns in your moment.
        </p>

        <button
          onClick={onCreateMemory}
          className="group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          <span 
            className="font-mono tracking-[0.1em] text-[10px] uppercase font-medium relative z-10 transition-colors"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            Create Memory
          </span>
          <svg 
            width="12" height="12" viewBox="0 0 12 12" fill="none" 
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(140,165,255,0.15) 0%, transparent 70%)' }}
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
