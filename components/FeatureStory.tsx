'use client';
import { motion } from 'framer-motion';

const storySteps = [
  {
    id: 'journal',
    title: 'Capture your day.',
    label: 'JOURNAL',
    description: 'Write, speak, or simply log your daily moments. It all starts with a thought.',
    visual: (
      <div className="w-full h-64 bg-[#050914]/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-slate-800 shrink-0"></div>
          <div className="space-y-3 w-full">
            <div className="w-1/3 h-3 bg-slate-700 rounded"></div>
            <div className="w-full h-2 bg-slate-800 rounded"></div>
            <div className="w-5/6 h-2 bg-slate-800 rounded"></div>
            <div className="w-4/6 h-2 bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'ai',
    title: 'Let AI understand it.',
    label: 'AI ANALYSIS',
    description: 'Our models extract entities, mood, topics, and semantics without you lifting a finger.',
    visual: (
      <div className="w-full h-64 bg-[#050914]/80 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-6 shadow-xl flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
             <span className="text-slate-400 text-sm">Entity Extracted</span>
             <span className="text-indigo-300 font-mono text-xs bg-indigo-500/20 px-2 py-1 rounded">Python</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
             <span className="text-slate-400 text-sm">Detected Mood</span>
             <span className="text-emerald-300 font-mono text-xs bg-emerald-500/20 px-2 py-1 rounded">Focused (0.89)</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-slate-400 text-sm">Topic Cluster</span>
             <span className="text-cyan-300 font-mono text-xs bg-cyan-500/20 px-2 py-1 rounded">Learning</span>
          </div>
        </div>
        {/* Scanning laser line */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,1)]"
        ></motion.div>
      </div>
    )
  },
  {
    id: 'patterns',
    title: 'Discover what repeats.',
    label: 'PATTERNS',
    description: 'See the invisible threads connecting your thoughts across time.',
    visual: (
      <div className="w-full h-64 bg-[#050914]/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-6 shadow-xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="relative w-full h-full max-w-[200px]">
          {/* Constellation lines */}
          <svg className="absolute inset-0 w-full h-full text-cyan-500/30" viewBox="0 0 100 100">
            <line x1="20" y1="20" x2="80" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="80" y1="50" x2="30" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="30" y1="80" x2="20" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <div className="absolute top-[20%] left-[20%] w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)] -ml-1.5 -mt-1.5"></div>
          <div className="absolute top-[50%] left-[80%] w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] -ml-2 -mt-2"></div>
          <div className="absolute top-[80%] left-[30%] w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] -ml-1.5 -mt-1.5"></div>
        </div>
      </div>
    )
  },
  {
    id: 'orbit',
    title: 'See your life from a new perspective.',
    label: 'ORBIT',
    description: 'Your days are no longer just pages in a book. They are a universe you can explore.',
    visual: (
      <div className="w-full h-64 bg-transparent border border-white/5 rounded-2xl p-6 shadow-xl flex items-center justify-center relative overflow-hidden">
        {/* Hollow frame to let the actual 3D universe behind it show through fully */}
        <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>
        <div className="text-white/50 text-sm tracking-widest uppercase font-mono">Universe Active</div>
      </div>
    )
  }
];

export default function FeatureStory() {
  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 py-32 pointer-events-none">
      
      <div className="space-y-32">
        {storySteps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          
          return (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center pointer-events-auto`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-4">
                <div className="text-xs font-mono tracking-[0.2em] text-indigo-400 uppercase">
                  Step 0{idx + 1} — {step.label}
                </div>
                <h3 className="text-4xl font-bold text-white tracking-tight">{step.title}</h3>
                <p className="text-xl text-slate-400 leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>

              {/* Visual Presentation */}
              <div className="flex-1 w-full">
                {step.visual}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
