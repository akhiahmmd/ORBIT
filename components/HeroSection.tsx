'use client';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-20 pointer-events-none">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-start mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xs font-mono tracking-[0.3em] text-indigo-400 mb-8 uppercase pointer-events-auto"
        >
          ORBIT OS — v2.0
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 leading-[1.1] max-w-4xl drop-shadow-2xl pointer-events-auto"
        >
          Explore the patterns <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-200">
            that shape you.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed drop-shadow-md pointer-events-auto"
        >
          Turn your thoughts, goals, and daily moments into an interactive universe powered by AI.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 items-center pointer-events-auto"
        >
          <button className="group relative px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-medium transition-all flex items-center gap-3 cursor-pointer">
            Enter Your Universe
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
