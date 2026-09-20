'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Target, Coffee, Moon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockData = [
  { id: 'study', icon: Brain, label: 'Learning', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', date: 'Oct 12', topic: 'React 3D', mood: 'Focused', prod: '90%', text: 'Mastered the basics of Three.js today. My spatial reasoning is improving.' },
  { id: 'work', icon: Target, label: 'Goals', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', date: 'Oct 14', topic: 'Q4 Launch', mood: 'Determined', prod: '85%', text: 'Hit all milestone metrics for the new release. Feeling confident.' },
  { id: 'health', icon: Activity, label: 'Health', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', date: 'Oct 15', topic: 'Recovery', mood: 'Tired', prod: '40%', text: 'Need to prioritize sleep. The resting heart rate metric was elevated.' },
  { id: 'rest', icon: Moon, label: 'Rest', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', date: 'Oct 16', topic: 'Meditation', mood: 'Calm', prod: 'N/A', text: 'Taking a complete day off screens. The mind needs empty space to create.' },
];

export default function InteractiveDemo() {
  const [activeNode, setActiveNode] = useState(mockData[0]);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-32 z-10">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Interact with your mind.</h2>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">Hover and explore a sample constellation of personal data. Every node is a memory, a goal, or a journal entry.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
        {/* Node Graph Map (Fake) */}
        <div className="relative w-full lg:w-1/2 h-[450px] bg-white/[0.01] border border-white/5 rounded-3xl p-8 overflow-hidden backdrop-blur-sm flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)] pointer-events-none"></div>
          
          <div className="relative w-full h-full max-w-[300px] max-h-[300px]">
            {mockData.map((node, i) => {
              const isActive = activeNode.id === node.id;
              // Distribute in a circle
              const angle = (i / mockData.length) * Math.PI * 2;
              const radius = 120;
              const x = `calc(50% + ${Math.cos(angle) * radius}px)`;
              const y = `calc(50% + ${Math.sin(angle) * radius}px)`;

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  onMouseEnter={() => setActiveNode(node)}
                  className={cn(
                    "absolute w-16 h-16 -ml-8 -mt-8 rounded-full flex items-center justify-center transition-all duration-500 border z-10 cursor-pointer shadow-lg",
                    isActive ? `scale-110 ${node.bg} ${node.border} shadow-[0_0_20px_rgba(79,70,229,0.3)]` : 'scale-100 bg-white/5 border-white/10 hover:bg-white/10'
                  )}
                  style={{ left: x, top: y }}
                >
                  <node.icon className={cn("w-6 h-6 transition-colors", isActive ? node.color : 'text-slate-400')} />
                </button>
              );
            })}
            
            {/* Center Core */}
            <div className="absolute left-1/2 top-1/2 -ml-3 -mt-3 w-6 h-6 bg-indigo-500 rounded-full blur-[4px] animate-pulse-glow"></div>
            
            {/* Connecting lines (Fake SVG visual) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {mockData.map((node, i) => {
                const angle = (i / mockData.length) * Math.PI * 2;
                const radius = 120;
                const x = 150 + Math.cos(angle) * radius;
                const y = 150 + Math.sin(angle) * radius;
                return (
                  <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" />
                );
              })}
              <defs>
                <linearGradient id="lineGrad">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Info Card */}
        <div className="w-full lg:w-[400px] min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#050914] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className={cn("absolute top-0 left-0 w-full h-1", activeNode.bg)}></div>
              
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", activeNode.bg)}>
                    <activeNode.icon className={cn("w-5 h-5", activeNode.color)} />
                  </div>
                  <span className="font-semibold text-white text-lg">{activeNode.label}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-white/5 px-2 py-1 rounded">{activeNode.date}</span>
              </div>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-sm">Topic</span>
                  <span className="text-white text-sm font-medium">{activeNode.topic}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-sm">Mood</span>
                  <span className="text-white text-sm font-medium">{activeNode.mood}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-sm">Focus</span>
                  <span className="text-white text-sm font-medium">{activeNode.prod}</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 py-1">
                "{activeNode.text}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
