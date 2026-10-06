import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { MOODS, Mood, formatDate } from '../../lib/shared-constants';

export interface JournalEntry {
  id: string;
  title: string;
  text: string;
  mood: Mood;
  date: string;
  active?: boolean;
}

function CustomDropdown({ value, options, onChange, placeholder, triggerClassName, optionClassName, up }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(options.indexOf(value));
      }
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + options.length) % options.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        onChange(options[activeIndex]);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative" onKeyDown={handleKeyDown} tabIndex={0} onBlur={() => setIsOpen(false)}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClassName}
      >
        <span>{value || placeholder}</span>
        <span className="text-[10px] opacity-50 ml-2">▼</span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: up ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: up ? 5 : -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 ${up ? 'bottom-full mb-2' : 'top-full mt-2'} min-w-full w-max bg-[#0a0c14] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 flex flex-col py-1`}
          >
            {options.map((opt: string, idx: number) => (
              <div
                key={opt}
                onMouseDown={(e) => { e.preventDefault(); onChange(opt); setIsOpen(false); }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`${optionClassName} ${activeIndex === idx ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function JournalView({ 
  entries, 
  onEntriesChange, 
  onStarClick 
}: { 
  entries: JournalEntry[], 
  onEntriesChange: (entries: JournalEntry[]) => void,
  onStarClick: (id: string) => void 
}) {
  const [entryText, setEntryText] = useState('');
  const [entryTitle, setEntryTitle] = useState('');
  const [mood, setMood] = useState<Mood | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState<Mood | 'All'>('All');
  const [toast, setToast] = useState('');
  
  // Edit & Delete State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRecord = () => {
    if (!entryText.trim()) return;
    
    const finalMood = mood || 'Reflective';
    
    if (editingId) {
      const updated = entries.map(e => 
        e.id === editingId 
          ? { ...e, title: entryTitle, text: entryText, mood: finalMood as Mood } 
          : e
      );
      onEntriesChange(updated);
      setEditingId(null);
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: entryTitle.trim(),
        text: entryText.trim(),
        mood: finalMood as Mood,
        date: new Date().toISOString(),
        active: true
      };
      onEntriesChange([newEntry, ...entries]);
    }
    
    setEntryText('');
    setEntryTitle('');
    setMood('');
    
    setToast('Moment recorded');
    setTimeout(() => setToast(''), 3000);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEntryTitle(entry.title);
    setEntryText(entry.text);
    setMood(entry.mood);
  };

  const handleDelete = (id: string) => {
    onEntriesChange(entries.filter(e => e.id !== id));
    setDeletingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEntryTitle('');
    setEntryText('');
    setMood('');
  };

  const filteredEntries = entries.filter(e => {
    const matchesSearch = (e.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                          e.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = filterMood === 'All' || e.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="w-full flex flex-col relative z-10 pointer-events-auto" style={{ pointerEvents: 'auto' }}>
      
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg text-sm font-medium z-50 flex items-center gap-2 shadow-lg"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sticky Header & Composer */}
      <div className="sticky -top-6 pt-6 -mx-6 px-6 md:-top-10 md:pt-10 md:-mx-10 md:px-10 z-30 pb-6 mb-2 bg-[#060810]/95 backdrop-blur-2xl border-b border-white/5 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <h2 className="font-serif text-2xl text-white/90 tracking-wide">Journal</h2>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">{entries.length} Entries</span>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search entries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-[#030408]/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/30"
          />
          <CustomDropdown 
            value={filterMood === 'All' ? 'All Moods' : filterMood} 
            options={['All Moods', ...MOODS]} 
            onChange={(v: string) => setFilterMood(v === 'All Moods' ? 'All' : v as Mood)}
            triggerClassName="flex justify-between items-center bg-[#030408]/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 outline-none cursor-pointer hover:border-white/20 transition-colors h-[38px]"
            optionClassName="px-3 py-2 text-sm cursor-pointer transition-colors"
          />
        </div>

        {/* Input Area */}
        <div className="rounded-2xl bg-[#030408]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative flex flex-col group focus-within:border-indigo-500/40 transition-colors duration-500">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 pointer-events-none" />
          
          <input
            type="text"
            placeholder="Title (Optional)"
            className="w-full bg-transparent text-white/90 px-5 pt-4 pb-2 font-sans font-medium text-[16px] outline-none placeholder:text-white/20"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
          />
          
          <textarea
             placeholder="What's on your mind?"
             className="w-full bg-transparent text-white/90 px-5 py-2 font-serif text-[15px] leading-relaxed resize-none outline-none placeholder:text-white/20 min-h-[100px]"
             value={entryText}
             onChange={(e) => setEntryText(e.target.value)}
          />
          <div className="flex justify-between items-center px-4 py-3 border-t border-white/5 bg-white/[0.02]">
             <div className="flex gap-2">
               <CustomDropdown 
                 value={mood} 
                 options={[...MOODS]} 
                 onChange={(v: string) => setMood(v as Mood)}
                 placeholder="How did it feel?"
                 triggerClassName="flex justify-between items-center bg-transparent border border-white/10 text-white/60 text-[11px] font-mono tracking-widest uppercase rounded px-3 py-1.5 outline-none hover:bg-white/5 cursor-pointer focus:border-indigo-500/50 transition-colors"
                 optionClassName="px-3 py-2 text-[11px] font-mono tracking-widest uppercase cursor-pointer transition-colors"
                 up={false}
               />
             </div>
             <div className="flex gap-2 items-center">
               {editingId && (
                 <button 
                   onClick={cancelEdit}
                   className="px-4 py-2 text-white/50 hover:text-white/80 text-[10px] font-mono uppercase tracking-widest transition-colors"
                 >
                   Cancel
                 </button>
               )}
               <button 
                 onClick={handleRecord}
                 disabled={!entryText.trim()}
                 className="px-5 py-2 bg-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-indigo-300 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 text-[10px] font-mono tracking-widest uppercase rounded-full shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all cursor-pointer"
               >
                 {editingId ? 'Update Moment' : 'Record Moment'}
               </button>
             </div>
          </div>
        </div>
      </div>
      
      {/* Local Storage Disclaimer */}
      <div className="text-[10px] font-mono text-white/30 text-center tracking-wider">
        Entries are saved on this device only.
      </div>
      
      {/* Timeline */}
      <div className="relative border-l border-white/10 ml-4 pl-6 space-y-6 before:absolute before:top-0 before:bottom-0 before:-left-[1px] before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/50 before:to-transparent mt-4">
        {filteredEntries.map((entryItem, idx) => {
          const entryDate = new Date(entryItem.date);
          const dateStr = formatDate(entryItem.date).toUpperCase();
          const timeStr = entryDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const isDeleting = deletingId === entryItem.id;

          return (
            <motion.div 
              key={entryItem.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * Math.min(idx, 5) }}
              className="relative group"
            >
              <div className={`absolute -left-[37px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#090b14] transition-all duration-500 ${entryItem.active ? 'bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] scale-110' : 'bg-white/20 group-hover:bg-white/40'}`} />
              
              <div className="flex justify-between items-start mb-2">
                <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 flex flex-wrap gap-2 items-center">
                  <span>{dateStr} {timeStr}</span>
                  {entryItem.mood && <span className="text-indigo-400/70 bg-indigo-500/10 px-1.5 py-0.5 rounded">• {entryItem.mood}</span>}
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(entryItem)} 
                    className="text-[10px] font-mono text-white/40 hover:text-white/80 uppercase tracking-widest cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setDeletingId(entryItem.id)} 
                    className="text-[10px] font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isDeleting ? (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg mb-3">
                  <p className="text-sm text-red-200 mb-2 font-sans">Are you sure you want to delete this entry?</p>
                  <div className="flex gap-3">
                    <button onClick={() => handleDelete(entryItem.id)} className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded cursor-pointer hover:bg-red-500/40">Yes, Delete</button>
                    <button onClick={() => setDeletingId(null)} className="text-xs text-white/50 px-3 py-1 cursor-pointer hover:text-white/80">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {entryItem.title && <div className="font-sans font-medium text-[16px] text-white/90 mb-1">{entryItem.title}</div>}
                  <div className="font-serif text-[15px] text-white/80 leading-relaxed mb-3 whitespace-pre-wrap">
                    {entryItem.text}
                  </div>
                </>
              )}

              {entryItem.active && !isDeleting && (
                <button 
                  onClick={() => onStarClick(entryItem.id)}
                  className="text-[11px] font-mono tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 group/btn mt-2 bg-indigo-500/10 px-3 py-1.5 rounded-md border border-indigo-500/20 w-fit cursor-pointer"
                >
                  <span>View in Universe</span>
                  <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              )}
            </motion.div>
          );
        })}
        {filteredEntries.length === 0 && (
          <div className="text-white/40 text-sm font-sans italic py-4">No entries found.</div>
        )}
      </div>
    </div>
  );
}

export function InsightsView({ entries = [] }: { entries?: JournalEntry[] }) {
  const happyCount = entries.filter(e => e.mood === 'Happy').length;
  const topMoodObj = entries.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topMood = Object.entries(topMoodObj).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A';
  
  const mostActiveHourObj = entries.reduce((acc, curr) => {
    const hour = new Date(curr.date).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const mostActiveHour = Object.entries(mostActiveHourObj).sort((a,b) => b[1]-a[1])[0]?.[0];
  const hourText = mostActiveHour !== undefined 
    ? `${mostActiveHour}:00 - ${parseInt(mostActiveHour)+1}:00`
    : 'N/A';

  return (
    <div className="w-full">
      <h2 className="font-serif text-xl text-white/90 mb-5 tracking-wide">Pattern Discovery</h2>
      
      {entries.length === 0 ? (
        <div className="text-white/40 text-sm font-sans italic py-4 text-center">Add entries to your journal to generate AI insights.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <InsightCard 
            title="Dominant Mood"
            value={topMood}
            desc={`Your most frequent emotional state across ${entries.length} entries.`}
            visual={<div className="w-10 h-10 rounded-full border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)]" /></div>}
          />
          <InsightCard 
            title="Resonance"
            value="Joy"
            desc={`You have tagged ${happyCount} moments as 'Happy'.`}
            visual={<div className="w-10 h-10 relative flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border border-purple-500/20 animate-[spin_4s_linear_infinite]" />
              <div className="absolute w-3/4 h-3/4 rounded-full border border-purple-400/40 animate-[spin_3s_linear_infinite_reverse]" />
              <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </div>}
          />
          <InsightCard 
            title="Trajectory"
            value="Peak Activity"
            desc={`Your most active time for journaling is around ${hourText}.`}
            visual={<div className="w-10 h-10 flex items-end justify-between gap-1 pb-1">
              <div className="w-1.5 h-3 bg-emerald-500/20 rounded-t-sm" />
              <div className="w-1.5 h-5 bg-emerald-500/40 rounded-t-sm" />
              <div className="w-1.5 h-4 bg-emerald-500/60 rounded-t-sm" />
              <div className="w-1.5 h-7 bg-emerald-400 rounded-t-sm shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            </div>}
            fullWidth
          />
        </div>
      )}
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

export interface Goal {
  id: string;
  title: string;
  progress: number;
  color: string;
}

export function GoalsView() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  
  useEffect(() => {
    const saved = localStorage.getItem('orbit_goals_v1');
    if (saved) {
      try { setGoals(JSON.parse(saved)); } catch(e){}
    } else {
      setGoals([
        { id: '1', title: 'Learn Python', progress: 85, color: '#818cf8' },
        { id: '2', title: 'Build ORBIT', progress: 65, color: '#c084fc' },
        { id: '3', title: 'Portfolio', progress: 40, color: '#34d399' },
      ]);
    }
  }, []);

  const saveGoals = (g: Goal[]) => {
    setGoals(g);
    localStorage.setItem('orbit_goals_v1', JSON.stringify(g));
  };

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    const colors = ['#818cf8', '#c084fc', '#34d399', '#f472b6', '#fbbf24'];
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle.trim(),
      progress: 0,
      color: colors[goals.length % colors.length]
    };
    saveGoals([...goals, newGoal]);
    setNewGoalTitle('');
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  const updateProgress = (id: string, delta: number) => {
    saveGoals(goals.map(g => {
      if (g.id === id) {
        return { ...g, progress: Math.max(0, Math.min(100, g.progress + delta)) };
      }
      return g;
    }));
  };
  
  const ringData = goals.map((g, idx) => {
    const radius = 80 - (idx * 16);
    const dashArray = 2 * Math.PI * radius;
    return { ...g, radius, dashArray };
  });

  const avgProgress = goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0;

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="font-serif text-xl text-white/90 mb-6 tracking-wide text-center">Trajectories</h2>
      
      <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center mb-6">
         <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]" viewBox="0 0 200 200">
           {ringData.slice(0, 5).map((goal, idx) => (
             <g key={goal.id}>
               <circle 
                 cx="100" cy="100" r={goal.radius} 
                 fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"
               />
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
           <span className="font-serif text-4xl text-white/90">{avgProgress}%</span>
         </div>
      </div>

      <div className="w-full space-y-4 mb-6">
        {goals.map((goal, idx) => (
          <motion.div 
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: goal.color, boxShadow: `0 0 10px ${goal.color}` }} />
              <span className="font-sans text-sm text-white/80">{goal.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                <button onClick={() => updateProgress(goal.id, -5)} className="text-white/40 hover:text-white px-2 cursor-pointer">-</button>
                <button onClick={() => updateProgress(goal.id, 5)} className="text-white/40 hover:text-white px-2 cursor-pointer">+</button>
              </div>
              <span className="font-mono text-xs text-white/50 w-8 text-right">{goal.progress}%</span>
              <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 text-xs ml-2 transition-opacity cursor-pointer">×</button>
            </div>
          </motion.div>
        ))}
        {goals.length === 0 && <div className="text-center text-white/30 text-sm py-4">No goals yet.</div>}
      </div>
      
      <div className="w-full flex gap-2">
        <input 
          type="text" 
          placeholder="New goal..." 
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          className="flex-1 bg-[#030408]/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 outline-none placeholder:text-white/30"
        />
        <button 
          onClick={addGoal}
          disabled={!newGoalTitle.trim()}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/90 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export interface ProfileData {
  name: string;
  description: string;
  interests: string;
}

export function ProfileView() {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    description: '',
    interests: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('orbit_profile_v1');
    if (saved) {
      try { setProfile(JSON.parse(saved)); } catch(e){}
    }
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    localStorage.setItem('orbit_profile_v1', JSON.stringify(newProfile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-end mb-2">
        <h2 className="font-serif text-2xl text-white/90 tracking-wide">Profile</h2>
        <span className={`font-mono text-[10px] tracking-[0.2em] transition-opacity ${isSaved ? 'text-emerald-400 opacity-100' : 'text-white/30 opacity-0'}`}>SAVED</span>
      </div>
      <div className="flex flex-col gap-5">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2 block pl-1">Name</label>
          <input 
            type="text" 
            value={profile.name} 
            onChange={e => handleChange('name', e.target.value)}
            className="w-full bg-[#030408]/80 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white/90 outline-none focus:border-indigo-500/50 transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2 block pl-1">Personal Description</label>
          <textarea 
            value={profile.description} 
            onChange={e => handleChange('description', e.target.value)}
            className="w-full bg-[#030408]/80 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white/90 outline-none h-28 resize-none focus:border-indigo-500/50 transition-colors"
            placeholder="A short description of who you are and what you seek to track"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2 block pl-1">Interests & Routines</label>
          <textarea 
            value={profile.interests} 
            onChange={e => handleChange('interests', e.target.value)}
            className="w-full bg-[#030408]/80 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white/90 outline-none h-28 resize-none focus:border-indigo-500/50 transition-colors"
            placeholder="Coding, running, reading... what patterns shape your days?"
          />
        </div>
      </div>
    </div>
  );
}
