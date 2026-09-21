'use client';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, Activity } from 'lucide-react';

const insights = [
  {
    id: 1,
    icon: BarChart2,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: "You are most productive on days when you sleep 7–8 hours.",
    visual: (
      <div className="flex items-end gap-2 h-16 mt-6">
        {[4, 5, 6, 7, 8, 9].map((hours, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className={`w-full rounded-t-sm transition-all duration-500 ${hours >= 7 && hours <= 8 ? 'bg-indigo-400' : 'bg-slate-700'}`} style={{ height: hours === 7 || hours === 8 ? '100%' : `${hours * 8}%` }}></div>
            <span className="text-[9px] text-slate-500">{hours}h</span>
          </div>
        ))}
      </div>
    )
  },
  {
    id: 2,
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: "Python appears frequently in your most productive entries.",
    visual: (
      <div className="flex flex-col justify-center h-16 mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-slate-400 w-12 text-right">Python</div>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-emerald-400 rounded-full"></motion.div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-slate-400 w-12 text-right">React</div>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} whileInView={{ width: '60%' }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-emerald-400/50 rounded-full"></motion.div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    icon: Activity,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: "Stress-related entries increased during exam periods.",
    visual: (
      <div className="relative h-16 mt-6 flex items-end">
        {/* Simple SVG Line Chart */}
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M0,35 Q10,35 20,30 T40,25 T60,5 T80,10 T100,30" 
            fill="none" 
            stroke="url(#roseGradient)" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="roseGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute top-0 left-[60%] -translate-x-1/2 -mt-4 text-[10px] text-rose-300 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Exams</div>
      </div>
    )
  }
];

export default function InsightsPreview() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 py-32 z-10 pointer-events-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Uncover hidden correlations.</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">ORBIT automatically identifies trends connecting your habits, mood, and productivity over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, idx) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-colors group relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${insight.bg} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${insight.bg} ${insight.border}`}>
              <insight.icon className={`w-6 h-6 ${insight.color}`} />
            </div>
            
            <p className="text-white text-lg font-medium leading-snug h-16">
              "{insight.text}"
            </p>
            
            <div className="mt-4 pt-4 border-t border-white/5 relative">
              {insight.visual}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
