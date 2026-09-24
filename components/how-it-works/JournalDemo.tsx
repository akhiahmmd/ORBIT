'use client';
import { motion } from 'framer-motion';

interface JournalDemoProps {
  onAnalyze: () => void;
  isAnalyzed: boolean;
}

export default function JournalDemo({ onAnalyze, isAnalyzed }: JournalDemoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[280px] flex flex-col gap-6"
    >
      {/* Journal Entry Card */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 transition-all duration-700"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isAnalyzed 
            ? '0 0 0 rgba(0,0,0,0)' 
            : '0 24px 48px -12px rgba(0,0,0,0.5)',
          opacity: isAnalyzed ? 0.6 : 1,
          transform: isAnalyzed ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        {/* Subtle top highlight */}
        <div 
          className="absolute top-0 inset-x-0 h-[1px]" 
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} 
        />

        <div className="flex justify-between items-center mb-4">
          <span 
            className="font-mono text-[9px] tracking-[0.25em] uppercase"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            AUG 15, 2026
          </span>
          <span 
            className="font-mono text-[9px] tracking-[0.2em] uppercase"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            JOURNAL
          </span>
        </div>

        <p 
          className="font-serif leading-[1.6]"
          style={{ 
            fontSize: '15px', 
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.01em'
          }}
        >
          &ldquo;Finally understood Python today.<br/>
          I was stuck for hours, but everything clicked.&rdquo;
        </p>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-start">
        {!isAnalyzed ? (
          <button
            onClick={onAnalyze}
            className="group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-full overflow-hidden transition-all duration-300 w-full"
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
              Analyze with ORBIT
            </span>
            <svg 
              width="12" height="12" viewBox="0 0 12 12" fill="none" 
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {/* Button hover glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(circle at center, rgba(140,165,255,0.15) 0%, transparent 70%)' }}
            />
          </button>
        ) : (
          <div className="h-[42px]" /> // Spacer to prevent layout shift
        )}
      </div>
    </motion.div>
  );
}
