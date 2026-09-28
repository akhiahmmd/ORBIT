import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function JournalView({ onStarClick }: { onStarClick: (id: string) => void }) {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('Focused');
  const [entries, setEntries] = useState([
    { date: 'AUG 15', text: "Finally understood Python today. Everything clicked.", active: true, mood: 'Joyful' },
    { date: 'AUG 14', text: "Worked on my portfolio for two hours. Feeling productive.", mood: 'Focused' },
    { date: 'AUG 12', text: "Exam stress was high. Need to take a break.", mood: 'Anxious' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('orbit_journal_entries');
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleRecord = () => {
    if (!entry.trim()) return;
    const newEntry = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
      text: entry.trim(),
      active: true,
      mood: mood
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    setEntry('');
    localStorage.setItem('orbit_journal_entries', JSON.stringify(updated));
  };

  return (
    <div className="w-full flex flex-col gap-6 relative z-10 pointer-events-auto">
      <div className="flex justify-between items-end">
        <h2 className="font-serif text-2xl text-white/90 tracking-wide">Journal</h2>
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">31 Days Active</span>
      </div>

      {/* Input Area */}
      <div className="rounded-2xl bg-[#030408]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group focus-within:border-indigo-500/40 transition-colors duration-500">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
        <textarea
           placeholder="What patterns did you notice today?"
           className="w-full bg-transparent text-white/90 p-5 font-serif text-[15px] leading-relaxed resize-none outline-none placeholder:text-white/20 min-h-[100px]"
           value={entry}
           onChange={(e) => setEntry(e.target.value)}
        />
        <div className="flex justify-between items-center px-4 py-3 border-t border-white/5 bg-white/[0.02]">
           <div className="flex gap-2">
             <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all text-sm">+</button>
             <select 
               value={mood} 
               onChange={(e) => setMood(e.target.value)}
               className="bg-transparent border border-white/10 text-white/60 text-[11px] font-mono tracking-widest uppercase rounded px-2 py-1 outline-none appearance-none hover:bg-white/5 cursor-pointer"
             >
               <option value="Joyful" className="bg-[#030408]">Joyful</option>
               <option value="Focused" className="bg-[#030408]">Focused</option>
               <option value="Calm" className="bg-[#030408]">Calm</option>
               <option value="Reflective" className="bg-[#030408]">Reflective</option>
               <option value="Anxious" className="bg-[#030408]">Anxious</option>
             </select>
           </div>
           <button 
             onClick={handleRecord}
             className="px-5 py-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 text-[10px] font-mono tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all"
           >
             Record Moment
           </button>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="relative border-l border-white/10 ml-4 pl-6 space-y-6 before:absolute before:top-0 before:bottom-0 before:-left-[1px] before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/50 before:to-transparent">
        {entries.map((entryItem, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="relative group"
          >
            <div className={`absolute -left-[37px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#090b14] transition-all duration-500 ${entryItem.active ? 'bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] scale-110' : 'bg-white/20 group-hover:bg-white/40'}`} />
            <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mb-2">
              {entryItem.date} {entryItem.mood && <span className="ml-2 text-indigo-400/70">• {entryItem.mood}</span>}
            </div>
            <div className="font-serif text-[15px] text-white/80 leading-relaxed mb-3 italic">
              "{entryItem.text}"
            </div>
            {entryItem.active && (
              <button 
                onClick={() => onStarClick('study-star-0')}
                className="text-[11px] font-mono tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 group/btn mt-2 bg-indigo-500/10 px-3 py-1.5 rounded-md border border-indigo-500/20 w-fit"
              >
                <span>View in Universe</span>
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
      <h2 className="font-serif text-xl text-white/90 mb-5 tracking-wide">Pattern Discovery</h2>
      
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
      className={`p-5 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] flex flex-col gap-3 hover:border-white/[0.15] hover:from-white/[0.05] hover:to-white/[0.02] transition-all duration-500 group ${fullWidth ? 'md:col-span-2' : ''}`}
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
  const goals = [
    { title: 'Learn Python', progress: 85, color: '#818cf8', radius: 80, dashArray: 502 },
    { title: 'Build ORBIT', progress: 65, color: '#c084fc', radius: 60, dashArray: 377 },
    { title: 'Portfolio', progress: 40, color: '#34d399', radius: 40, dashArray: 251 },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="font-serif text-xl text-white/90 mb-6 tracking-wide text-center">Trajectories</h2>
      
      <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center mb-6">
         {/* Orbital Rings */}
         <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]" viewBox="0 0 200 200">
           {goals.map((goal, idx) => (
             <g key={goal.title}>
               {/* Background Track */}
               <circle 
                 cx="100" cy="100" r={goal.radius} 
                 fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"
               />
               {/* Progress Fill */}
               <motion.circle 
                 cx="100" cy="100" r={goal.radius} 
                 fill="none" stroke={goal.color} strokeWidth="6" strokeLinecap="round"
                 strokeDasharray={goal.dashArray}
                 initial={{ strokeDashoffset: goal.dashArray }}
                 animate={{ strokeDashoffset: goal.dashArray - (goal.dashArray * goal.progress) / 100 }}
                 transition={{ duration: 1.5, delay: idx * 0.2, ease: "easeOut" }}
                 style={{ filter: `drop-shadow(0 0 8px ${goal.color}80)` }}
               />
             </g>
           ))}
         </svg>
         
         <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
           <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1">Momentum</span>
           <span className="font-serif text-4xl text-white/90">63%</span>
         </div>
      </div>

      <div className="w-full space-y-4">
        {goals.map((goal, idx) => (
          <motion.div 
            key={goal.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: goal.color, boxShadow: `0 0 10px ${goal.color}` }} />
              <span className="font-sans text-sm text-white/80">{goal.title}</span>
            </div>
            <span className="font-mono text-xs text-white/50">{goal.progress}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
