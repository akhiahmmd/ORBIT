'use client';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function PastSelfChat() {
  return (
    <section className="relative w-full max-w-4xl mx-auto px-6 py-32 z-10 pointer-events-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Talk to your past self.</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">Query your universe. ORBIT connects the dots between your entries to give you profound insights.</p>
      </div>

      <div className="relative">
        {/* Glow behind chat */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-2xl mx-auto bg-[#050914]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-400/50 to-indigo-500/0"></div>
          
          <div className="flex flex-col space-y-8">
            
            {/* User Message */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-end"
            >
              <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tr-sm px-6 py-4 max-w-[80%]">
                <p className="text-white text-lg">"What was I worried about last month?"</p>
              </div>
            </motion.div>

            {/* AI Processing indicator (static for demo, but looks cool) */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-2 pl-4 text-indigo-400 text-sm font-mono"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Synthesizing 42 entries...</span>
            </motion.div>

            {/* AI Response */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex justify-start"
            >
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl rounded-tl-sm px-6 py-5 max-w-[90%] shadow-[0_0_30px_rgba(99,102,241,0.1)] relative">
                <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-indigo-900 border border-indigo-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                </div>
                <p className="text-slate-200 text-lg leading-relaxed">
                  You mentioned upcoming exams several times and frequently wrote about staying consistent with your studies. However, your stress dropped significantly on days you tracked 8+ hours of sleep.
                </p>
                <div className="mt-4 flex gap-2">
                   <span className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-slate-400 rounded cursor-pointer hover:bg-white/10 transition-colors">Oct 12 Entry</span>
                   <span className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-slate-400 rounded cursor-pointer hover:bg-white/10 transition-colors">Oct 15 Entry</span>
                </div>
              </div>
            </motion.div>
            
          </div>
          
          {/* Input field mock */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="bg-[#02040a] border border-white/10 rounded-full flex items-center px-4 py-3">
              <MessageSquare className="w-5 h-5 text-slate-500 mr-3" />
              <div className="text-slate-500 flex-1 font-light">Ask your universe...</div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
