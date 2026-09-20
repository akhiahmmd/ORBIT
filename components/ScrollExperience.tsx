'use client';
import { motion } from 'framer-motion';

const sections = [
  {
    title: "Your days become data.",
    description: "Every thought, journal entry, and metric is captured as a raw particle in your universe.",
    align: "left"
  },
  {
    title: "Your patterns become visible.",
    description: "Our AI clusters related thoughts, revealing hidden connections and emotional trends over time.",
    align: "right"
  },
  {
    title: "Your data becomes your ORBIT.",
    description: "A living, breathing galaxy of your life. Navigate it, reflect on it, and grow from it.",
    align: "left"
  }
];

export default function ScrollExperience() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-32 space-y-48 z-10">
      {sections.map((section, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className={`flex flex-col w-full ${section.align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
        >
          <div className="text-indigo-400 font-mono text-sm mb-4 tracking-widest uppercase">Phase 0{idx + 1}</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight max-w-2xl">{section.title}</h2>
          <p className="text-xl text-slate-400 max-w-lg leading-relaxed">{section.description}</p>
        </motion.div>
      ))}
    </section>
  );
}
