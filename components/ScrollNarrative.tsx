'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

const thoughts = [
  { text: "I finally understood Python today.", top: "20%", left: "10%", delay: 0.1 },
  { text: "Exam stress was getting to me.", top: "60%", left: "70%", delay: 0.3 },
  { text: "Worked on my project for three hours.", top: "35%", left: "80%", delay: 0.5 },
  { text: "Had a really good day with friends.", top: "75%", left: "15%", delay: 0.2 },
  { text: "Need to focus more on sleep.", top: "15%", left: "60%", delay: 0.4 },
];

export default function ScrollNarrative() {
  return (
    <section className="relative w-full pointer-events-none">
      
      {/* SECTION A: THOUGHTS */}
      <div className="relative h-[120vh] flex items-center justify-center">
        {/* Floating thought fragments */}
        {thoughts.map((thought, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 1.5, delay: thought.delay, ease: "easeOut" }}
            className="absolute text-slate-400 font-serif italic text-lg md:text-2xl"
            style={{ top: thought.top, left: thought.left }}
          >
            "{thought.text}"
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.6 }}
          transition={{ duration: 1 }}
          className="bg-[#050914]/80 backdrop-blur-xl p-10 rounded-3xl border border-white/5 pointer-events-auto text-center max-w-2xl mx-4 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-xl">Your days begin as thoughts.</h2>
          <p className="text-xl text-slate-300">Scattered fragments of memories, ideas, and reflections.</p>
        </motion.div>
      </div>

      {/* SECTION B: DATA */}
      <div className="relative h-[120vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.6 }}
          transition={{ duration: 1 }}
          className="bg-[#050914]/80 backdrop-blur-xl p-10 rounded-3xl border border-white/5 pointer-events-auto text-center max-w-2xl mx-4 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-xl">AI turns them into patterns.</h2>
          <p className="text-xl text-slate-300">Natural language processing extracts the meaning beneath the surface.</p>
        </motion.div>
      </div>

      {/* SECTION C: PATTERNS */}
      <div className="relative h-[120vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.6 }}
          transition={{ duration: 1 }}
          className="bg-[#050914]/80 backdrop-blur-xl p-10 rounded-3xl border border-white/5 pointer-events-auto text-center max-w-2xl mx-4 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-xl">Patterns begin to emerge.</h2>
          <p className="text-xl text-slate-300">Clusters of related concepts form constellations of your mind.</p>
        </motion.div>
      </div>

      {/* SECTION D: ORBIT */}
      <div className="relative h-[120vh] flex items-center justify-center mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.6 }}
          transition={{ duration: 1 }}
          className="bg-[#050914]/80 backdrop-blur-xl p-12 rounded-3xl border border-indigo-500/20 pointer-events-auto text-center max-w-2xl mx-4 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
          <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 mb-6 tracking-tight">Your life becomes your ORBIT.</h2>
          <p className="text-2xl text-slate-300 font-light">A living, interactive digital universe.</p>
        </motion.div>
      </div>
      
    </section>
  );
}
