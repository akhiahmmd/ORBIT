import { motion } from 'framer-motion';

export function JournalView({ onStarClick }: { onStarClick: (id: string) => void }) {
  const entries = [
    { date: 'AUG 15', text: "Finally understood Python today. Everything clicked.", active: true },
    { date: 'AUG 14', text: "Worked on my portfolio for two hours. Feeling productive." },
    { date: 'AUG 12', text: "Exam stress was high. Need to take a break." },
    { date: 'AUG 10', text: "Read a great book on design systems." },
  ];

  return (
    <div className="w-full">
      <h2 className="font-serif text-2xl text-white/90 mb-8 tracking-wide">Chronicle</h2>
      <div className="relative border-l border-white/10 ml-3 pl-8 space-y-12 before:absolute before:top-0 before:bottom-0 before:-left-[1px] before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/50 before:to-transparent">
        {entries.map((entry, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group"
          >
            <div className={`absolute -left-[37px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#020306] transition-colors duration-500 ${entry.active ? 'bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]' : 'bg-white/20 group-hover:bg-white/40'}`} />
            <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-2">{entry.date}</div>
            <div className="font-serif text-lg text-white/80 leading-relaxed mb-3">
              "{entry.text}"
            </div>
            {entry.active && (
              <button 
                onClick={() => onStarClick('study-star-0')}
                className="text-xs font-mono tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 group/btn"
              >
                <span>View Event in Universe</span>
                <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function InsightsView() {
  return (
    <div className="w-full">
      <h2 className="font-serif text-2xl text-white/90 mb-8 tracking-wide">Pattern Discovery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <InsightCard 
          title="Resonance"
          value="Morning Focus"
          desc="Entries tagged 'Happy' strongly align with your morning study sessions."
          visual={<div className="w-10 h-10 rounded-full border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]" /></div>}
        />
        <InsightCard 
          title="Frequency"
          value="Python"
          desc="This topic forms the densest cluster in your recent knowledge graph."
          visual={<div className="w-10 h-10 relative flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border border-purple-500/20 animate-[spin_4s_linear_infinite]" />
            <div className="absolute w-3/4 h-3/4 rounded-full border border-purple-400/40 animate-[spin_3s_linear_infinite_reverse]" />
            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </div>}
        />
        <InsightCard 
          title="Trajectory"
          value="Rising Momentum"
          desc="Your most active learning days consistently land on Wednesday and Saturday."
          visual={<div className="w-10 h-10 flex items-end justify-between gap-1 pb-1">
            <div className="w-1.5 h-3 bg-emerald-500/20 rounded-t-sm" />
            <div className="w-1.5 h-5 bg-emerald-500/40 rounded-t-sm" />
            <div className="w-1.5 h-4 bg-emerald-500/60 rounded-t-sm" />
            <div className="w-1.5 h-7 bg-emerald-400 rounded-t-sm shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>}
          fullWidth
        />
      </div>
    </div>
  );
}

function InsightCard({ title, value, desc, visual, fullWidth }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] flex flex-col gap-5 hover:border-white/[0.15] hover:from-white/[0.05] hover:to-white/[0.02] transition-all duration-500 group ${fullWidth ? 'md:col-span-2' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase mb-2">{title}</div>
          <div className="font-serif text-xl text-white/90">{value}</div>
        </div>
        <div className="opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 transform">
          {visual}
        </div>
      </div>
      <div className="text-sm text-white/50 leading-relaxed font-light">{desc}</div>
    </motion.div>
  );
}

export function GoalsView() {
  return (
    <div className="w-full">
      <h2 className="font-serif text-2xl text-white/90 mb-10 tracking-wide">Active Trajectories</h2>
      <div className="space-y-10">
        <Goal progress={85} title="Learn Python" label="Primary Focus" color="from-indigo-400 to-blue-500" shadow="shadow-indigo-500/50" />
        <Goal progress={65} title="Build ORBIT" label="Project" color="from-purple-400 to-pink-500" shadow="shadow-purple-500/50" />
        <Goal progress={40} title="Complete Portfolio" label="Goal" color="from-emerald-400 to-teal-500" shadow="shadow-emerald-500/50" />
      </div>
    </div>
  );
}

function Goal({ progress, title, label, color, shadow }: { progress: number, title: string, label: string, color: string, shadow: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/40 mb-1.5">{label}</div>
          <div className="font-serif text-lg text-white/90">{title}</div>
        </div>
        <div className="font-mono text-xl font-light text-white/90">{progress}<span className="text-white/30 text-sm">%</span></div>
      </div>
      
      {/* Track */}
      <div className="relative w-full h-[2px] bg-white/5 rounded-full">
        {/* Glow behind line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: `${progress}%`, opacity: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute top-1/2 -translate-y-1/2 h-[8px] blur-sm bg-gradient-to-r ${color}`}
        />
        {/* Core line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`relative h-full bg-gradient-to-r ${color} rounded-full`}
        >
          {/* Head dot */}
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full ${shadow} shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />
        </motion.div>
      </div>
    </motion.div>
  );
}
