'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

const sections = [
  { title: "Your thoughts", desc: "Start as scattered fragments." },
  { title: "Become data", desc: "Structured and captured." },
  { title: "Become patterns", desc: "Our AI clusters related thoughts." },
  { title: "Become your ORBIT", desc: "A living galaxy of your life. Scroll down to interact." }
];

export default function ScrollNarrative() {
  return (
    <section className="relative w-full pb-48 pointer-events-none">
      {/* Create tall scroll area */}
      <div className="relative w-full" style={{ height: '300vh' }}>
        
        {/* Sticky container for the text */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center pointer-events-none px-6 text-center">
          
          {sections.map((section, idx) => {
            // Very hacky/simple way to fade in/out based on scroll depth in the single sticky wrapper
            // In a real app we might use complex useTransform mapping, but we can do a simplified CSS trick or framer-motion approach
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-40%" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  // Position them absolute to overlay, but we'll spread them out over the scroll area using regular divs in the next section.
                  // Actually, let's use the actual document flow instead of a sticky stack, it's more robust.
                  display: 'none'
                }}
              >
              </motion.div>
            )
          })}
        </div>

        {/* Instead of sticky, we just space them out with large margins so the user scrolls past them */}
        <div className="absolute inset-0 flex flex-col">
          {sections.map((section, idx) => (
             <div key={idx} className="h-screen flex items-center justify-center">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: false, amount: 0.6 }}
                 transition={{ duration: 0.8 }}
                 className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/5 pointer-events-auto text-center"
               >
                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-xl">{section.title}</h2>
                 <p className="text-xl text-slate-300 max-w-md mx-auto">{section.desc}</p>
               </motion.div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
