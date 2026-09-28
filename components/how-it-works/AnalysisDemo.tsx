'use client';
import { motion } from 'framer-motion';

interface AnalysisDemoProps {
  onCreateMemory: () => void;
}

export default function AnalysisDemo({ onCreateMemory }: AnalysisDemoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[340px] rounded-xl overflow-hidden bg-[#0a0c10] border border-[#1f2937] shadow-2xl flex flex-col"
    >
      <div className="p-6 flex flex-col gap-5 relative">
        {/* Subtle background glow for the header */}
        <div 
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle at top left, #4f46e5, transparent 70%)' }}
        />

        <div className="flex items-center gap-3 border-b border-[#1f2937]/60 pb-4 relative z-10">
          <div className="w-8 h-8 rounded-full bg-indigo-900/40 flex items-center justify-center border border-indigo-500/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300">
               <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
               <path d="M21 3v5h-5" />
            </svg>
          </div>
          <div>
            <h3 className="font-mono text-[11px] tracking-widest text-slate-300 uppercase">Analysis Complete</h3>
            <p className="text-[12px] text-slate-500">Pattern recognized in universe</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 relative z-10">
          <p className="font-serif text-[14px] text-slate-300 leading-relaxed">
            Your frustration transformed into a breakthrough. This entry strongly aligns with your <span className="text-indigo-300">Skill Acquisition</span> cluster.
          </p>
          
          <div className="flex flex-wrap gap-2 mt-1">
            {['PYTHON', 'LEARNING', 'BREAKTHROUGH'].map((tag, idx) => (
               <motion.span
                 key={tag}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.2 + idx * 0.1 }}
                 className="px-2.5 py-1 text-[10px] font-mono tracking-widest rounded bg-[#141824] text-indigo-200 border border-[#2e3650]"
               >
                 {tag}
               </motion.span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0f1218] p-4 border-t border-[#1f2937]/60">
        <button
          onClick={onCreateMemory}
          className="w-full py-3 rounded-lg flex items-center justify-center gap-2 bg-[#1a1f30] hover:bg-[#232942] transition-colors border border-[#2e3650] hover:border-indigo-500/50 text-indigo-200 hover:text-indigo-100 font-mono text-[11px] tracking-widest uppercase group active:scale-[0.98]"
        >
          <span>Form Memory Node</span>
          <svg 
            width="12" height="12" viewBox="0 0 12 12" fill="none" 
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
