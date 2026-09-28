'use client';
import { motion } from 'framer-motion';

export default function Conclusion() {
  return (
    <section className="relative w-full overflow-hidden bg-[#010204] py-32 md:py-48 flex flex-col items-center justify-center min-h-[60svh] z-20">
      
      {/* Background atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#010204]/80 to-[#010204]" />
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(140,165,255,0.4) 0%, transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-10 relative"
        >
          {/* Subtle ORBIT logo/icon symbol */}
          <div className="w-16 h-16 mx-auto border border-white/20 rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-2 border border-purple-500/20 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]" />
          </div>

          <h2 
            className="font-serif text-balance"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              textShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
          >
            Your thoughts.<br />
            <span className="italic text-white/70 font-light">Your universe.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <button className="px-8 py-4 bg-white text-black rounded-full font-mono text-[11px] tracking-[0.15em] uppercase hover:bg-indigo-50 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] duration-300">
            Start Exploring
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 w-full flex justify-center text-center z-10 pointer-events-none">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">
          ORBIT © 2026
        </span>
      </div>
    </section>
  );
}
