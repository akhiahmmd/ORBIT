'use client';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Target, Settings, BrainCircuit, Maximize2, Search, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProductReveal() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-6 py-32 z-10 pointer-events-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">A UI for your mind.</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">See how ORBIT turns your scattered entries into a beautiful, explorable spatial interface.</p>
      </div>

      {/* Main Product Frame */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="relative w-full rounded-2xl md:rounded-[2rem] bg-[#02040a] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[700px]"
      >
        {/* Glass Reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none"></div>

        {/* Left Sidebar */}
        <div className="hidden md:flex flex-col w-64 border-r border-white/5 p-6 space-y-8 bg-[#050914]/50 backdrop-blur-md">
          <div className="flex items-center gap-2 text-white font-mono tracking-widest text-sm uppercase mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" /> ORBIT
          </div>
          
          <nav className="flex-1 space-y-2">
            {[
              { icon: Maximize2, label: 'Universe', active: true },
              { icon: BookOpen, label: 'Journal', active: false },
              { icon: BrainCircuit, label: 'Insights', active: false },
              { icon: Target, label: 'Goals', active: false },
            ].map((item, i) => (
              <a key={i} href="#" className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                item.active ? "bg-indigo-500/10 text-indigo-300" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/5">
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] flex items-center justify-center">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center pointer-events-none">
            <h3 className="text-white font-semibold tracking-wide">Main Constellation</h3>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm pointer-events-auto">
              <Search className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">Search memories...</span>
            </div>
          </div>

          {/* Fake Interactive Universe (CSS/SVG based) */}
          <div className="relative w-full max-w-[500px] aspect-square animate-[spin_120s_linear_infinite]">
            {/* Orbital rings */}
            <div className="absolute inset-4 border border-white/[0.03] rounded-full"></div>
            <div className="absolute inset-20 border border-white/[0.05] rounded-full"></div>
            <div className="absolute inset-40 border border-white/[0.07] rounded-full"></div>
            
            {/* Clusters */}
            <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-indigo-500/5 rounded-full blur-xl animate-pulse-glow"></div>
            <div className="absolute bottom-[20%] right-[30%] w-40 h-40 bg-cyan-500/5 rounded-full blur-xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            
            {/* Nodes */}
            <div className="absolute top-[25%] left-[25%] group cursor-pointer">
              <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white whitespace-nowrap bg-black/50 px-2 py-1 rounded">Study / Learning</div>
            </div>
            
            <div className="absolute top-[40%] right-[25%] group cursor-pointer">
              <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white whitespace-nowrap bg-black/50 px-2 py-1 rounded">Productive Days</div>
            </div>

            <div className="absolute bottom-[35%] left-[40%] group cursor-pointer">
              <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
              <div className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] text-white whitespace-nowrap bg-white/10 backdrop-blur-md px-2 py-1 rounded border border-white/20">Active Selection</div>
            </div>
          </div>
        </div>

        {/* Right UI / Supporting Info Panel */}
        <div className="w-full md:w-80 border-l border-white/5 bg-[#050914]/80 backdrop-blur-xl p-6 flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          
          <div className="mb-6 mt-2">
            <div className="text-xs font-mono text-slate-500 mb-1">SELECTED DAY</div>
            <h4 className="text-lg font-semibold text-white">August 15, 2026</h4>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">Mood</div>
              <div className="text-sm font-medium text-amber-300">Happy</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">Productivity</div>
              <div className="text-sm font-medium text-emerald-300">8 / 10</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">Topics</div>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[10px] px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">Python</span>
                <span className="text-[10px] px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">Study</span>
                <span className="text-[10px] px-2 py-1 bg-rose-500/20 text-rose-300 rounded">Learning</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xs font-mono text-slate-500 mb-3">JOURNAL EXCERPT</div>
            <p className="text-sm leading-relaxed text-slate-300 italic border-l-2 border-indigo-500/30 pl-3">
              "Studied Python for three hours and finally understood functions. It feels like things are starting to click. Had a great dinner with Sarah afterwards."
            </p>
          </div>
          
          <button className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-white/10">
            View Full Entry <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
