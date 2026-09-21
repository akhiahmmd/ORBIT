'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative w-full h-[80vh] flex flex-col justify-center items-center z-10 pointer-events-none mt-32">
      <div className="text-center px-6 pointer-events-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl"
        >
          Your life is already <br className="hidden md:block"/> full of patterns.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl md:text-3xl text-indigo-300 font-light mb-12 drop-shadow-md"
        >
          ORBIT helps you see them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex justify-center"
        >
          <button className="group relative px-10 py-5 bg-white text-[#010204] hover:bg-slate-200 rounded-full font-medium transition-all flex items-center gap-3 cursor-pointer text-xl shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Enter Your Universe
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-0 left-0 w-full py-12 flex flex-col items-center justify-center opacity-50 border-t border-white/5 pointer-events-auto mt-40"
      >
        <div className="flex items-center gap-2 text-white font-mono tracking-widest text-sm uppercase mb-4">
          <Sparkles className="w-4 h-4 text-indigo-400" /> ORBIT
        </div>
        <p className="text-[10px] text-slate-500 tracking-wider">© 2026 ORBIT OS. Explore the patterns that shape you.</p>
      </motion.footer>
    </section>
  );
}
