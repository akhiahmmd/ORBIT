'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface JournalDemoProps {
  onAnalyze: () => void;
  isAnalyzed: boolean;
}

export default function JournalDemo({ onAnalyze, isAnalyzed }: JournalDemoProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analyzing state, then trigger onAnalyze
    setTimeout(() => {
      onAnalyze();
      setIsAnalyzing(false); // Reset in case we come back
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[320px] flex flex-col gap-6"
    >
      {/* Journal Entry Card */}
      <div
        className="relative rounded-xl p-6 transition-all duration-700 bg-[#0a0c10] border border-[#1f2937]"
        style={{
          boxShadow: isAnalyzed || isAnalyzing ? 'none' : '0 12px 32px rgba(0,0,0,0.4)',
          opacity: isAnalyzed ? 0.4 : 1,
          transform: isAnalyzed ? 'scale(0.96)' : 'scale(1)',
        }}
      >
        {/* Subtle top highlight */}
        <div 
          className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#334155] to-transparent opacity-50" 
        />

        <div className="flex justify-between items-center mb-5">
          <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">
            Aug 15, 2026
          </span>
          <span className="font-mono text-[10px] tracking-widest text-indigo-400/80 uppercase">
            JOURNAL
          </span>
        </div>

        <p className="font-serif text-[15px] leading-relaxed text-slate-300">
          &ldquo;Finally understood Python today.<br/>
          I was stuck for hours, but everything clicked.&rdquo;
        </p>
      </div>

      {/* Action / Status Area */}
      <div className="flex flex-col min-h-[100px] justify-start">
        <AnimatePresence mode="wait">
          {!isAnalyzed && !isAnalyzing && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <p className="text-[12px] text-slate-400 font-sans px-2 text-center leading-relaxed">
                ORBIT will analyze this entry against your existing patterns to map it into your personal universe.
              </p>
              <button
                onClick={handleAnalyze}
                className="w-full py-3 rounded-lg flex items-center justify-center gap-2 bg-[#141824] hover:bg-[#1a1f30] border border-[#2e3650] hover:border-indigo-500/50 transition-all duration-300 group active:scale-[0.98]"
              >
                <span className="font-mono tracking-widest text-[11px] uppercase font-medium text-indigo-200 group-hover:text-indigo-100 transition-colors">
                  Analyze with ORBIT <span className="ml-2 px-1.5 py-0.5 bg-white/10 text-white/50 text-[9px] rounded font-mono">DEMO</span>
                </span>
                <svg 
                  width="12" height="12" viewBox="0 0 12 12" fill="none" 
                  className="transition-transform duration-300 group-hover:translate-x-1 text-indigo-300 group-hover:text-indigo-200"
                >
                  <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center gap-5 py-6 bg-[#0a0c10] border border-[#1f2937] rounded-xl"
            >
              <div className="flex gap-2 items-center justify-center">
                 {[0, 1, 2].map((i) => (
                   <motion.div
                     key={i}
                     className="w-1.5 h-1.5 rounded-full bg-indigo-400/80"
                     animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                   />
                 ))}
              </div>
              <p className="font-mono text-[10px] tracking-widest text-indigo-300/70 uppercase">
                Mapping patterns...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
