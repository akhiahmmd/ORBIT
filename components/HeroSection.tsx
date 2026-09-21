'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center pointer-events-none overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-indigo-300 mb-8 uppercase pointer-events-auto backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3" /> ORBIT
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tighter text-white mb-8 leading-[1.05] max-w-5xl drop-shadow-2xl pointer-events-auto"
        >
          Explore the patterns <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-200">
            that shape you.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-2xl text-slate-300 max-w-3xl mb-12 leading-relaxed drop-shadow-md pointer-events-auto font-light"
        >
          Turn your thoughts, goals, and daily moments into an interactive universe powered by AI.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 items-center pointer-events-auto"
        >
          <button className="group relative px-8 py-4 bg-white text-[#010204] hover:bg-slate-200 rounded-full font-medium transition-all flex items-center gap-3 cursor-pointer text-lg">
            Enter Your Universe
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="group px-8 py-4 bg-transparent text-white hover:text-indigo-300 border border-white/20 hover:border-indigo-400/50 rounded-full font-medium transition-all flex items-center gap-3 cursor-pointer text-lg backdrop-blur-sm">
            Explore how it works
          </button>
        </motion.div>
      </div>

      {/* Subtle bottom gradient to blend with the rest of the page */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#010204] to-transparent pointer-events-none"></div>
    </section>
  );
}
