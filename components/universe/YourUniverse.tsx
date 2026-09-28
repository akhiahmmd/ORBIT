'use client';
import { useState, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryEntry, SAMPLE_MEMORIES, FILTER_OPTIONS } from './UniverseData';
import UniverseScene from './UniverseScene';

export default function YourUniverse() {
  const [activeMoodFilter, setActiveMoodFilter] = useState('All Moods');
  const [activeTimeFilter, setActiveTimeFilter] = useState('All Time');
  
  const [hoveredMemoryId, setHoveredMemoryId] = useState<string | null>(null);
  const [activeMemory, setActiveMemory] = useState<MemoryEntry | null>(null);

  const filteredMemories = useMemo(() => {
    let result = SAMPLE_MEMORIES;

    if (activeMoodFilter !== 'All Moods') {
      result = result.filter(m => m.mood === activeMoodFilter);
    }

    if (activeTimeFilter === 'This Week') {
      const oneWeekAgo = new Date('2026-09-25T00:00:00Z');
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(m => new Date(m.date) >= oneWeekAgo); 
    } else if (activeTimeFilter === 'This Month') {
      const oneMonthAgo = new Date('2026-09-25T00:00:00Z');
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      result = result.filter(m => new Date(m.date) >= oneMonthAgo);
    }

    return result;
  }, [activeMoodFilter, activeTimeFilter]);

  const handleMemoryClick = (memory: MemoryEntry) => {
    if (activeMemory?.id === memory.id) {
      setActiveMemory(null);
    } else {
      setActiveMemory(memory);
    }
  };

  const resetFilters = () => {
    setActiveMoodFilter('All Moods');
    setActiveTimeFilter('All Time');
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col bg-[#030712]" id="universe">
      
      {/* Immersive Background overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_100px_rgba(3,7,18,1)]" />

      {/* Top Header & Integrated Filter Controls (Now in normal document flow) */}
      <div className="relative z-20 w-full pt-16 md:pt-20 pb-6 px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight mb-2 drop-shadow-lg">
            Your Universe
          </h2>
          <p className="text-sm md:text-base text-indigo-200/70 font-light max-w-lg mx-auto leading-relaxed drop-shadow-md">
            Every memory, reflection, and pattern becomes a star.
          </p>
        </motion.div>

        {/* Refined Filter Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-center items-center gap-4 bg-[#0a0c10]/80 backdrop-blur-md border border-[#1e293b]/80 rounded-2xl px-5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.5)] pointer-events-auto w-full max-w-3xl"
        >
          {/* Time Filter Group */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mr-2">Time</span>
            <div className="flex bg-[#141824] rounded-lg p-1 border border-[#1e293b]/60">
              {FILTER_OPTIONS.time.map(time => (
                <button
                  key={time}
                  onClick={() => setActiveTimeFilter(time)}
                  className={`px-3 py-1.5 rounded text-[11px] font-mono tracking-widest transition-all ${
                    activeTimeFilter === time
                      ? 'bg-[#2a3655] text-indigo-100 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2133]'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-px h-px md:h-6 bg-[#1e293b] hidden md:block" />

          {/* Mood Filter Group */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 hide-scrollbar">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mr-2">Mood</span>
            <div className="flex bg-[#141824] rounded-lg p-1 border border-[#1e293b]/60 whitespace-nowrap">
              {FILTER_OPTIONS.mood.map(mood => (
                <button
                  key={mood}
                  onClick={() => setActiveMoodFilter(mood)}
                  className={`px-3 py-1.5 rounded text-[11px] font-mono tracking-widest transition-all ${
                    activeMoodFilter === mood
                      ? 'bg-[#2a3655] text-indigo-100 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2133]'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Galaxy Area - Flex 1, properly spaced below controls */}
      <div className="relative flex-1 w-full min-h-[500px] z-10 cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 2, 12], fov: 45, near: 0.1, far: 150 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <UniverseScene 
              memories={filteredMemories}
              activeMemoryId={activeMemory?.id || null}
              hoveredMemoryId={hoveredMemoryId}
              onMemoryClick={handleMemoryClick}
              onMemoryHover={setHoveredMemoryId}
            />
          </Suspense>
        </Canvas>

        {/* Contextual Native Empty State */}
        <AnimatePresence>
          {filteredMemories.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
            >
              <div className="bg-[#0a0c10]/90 backdrop-blur-xl border border-[#1e293b] rounded-2xl p-10 flex flex-col items-center text-center shadow-2xl pointer-events-auto max-w-sm">
                <span className="text-indigo-400/50 mb-5 border border-indigo-500/20 rounded-full p-4 bg-indigo-500/5">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </span>
                <h3 className="text-xl text-white font-serif mb-2">Space is empty here</h3>
                <p className="text-[13px] text-slate-400 mb-6 leading-relaxed">
                  No memories match <strong className="text-slate-200">{activeTimeFilter}</strong> and <strong className="text-slate-200">{activeMoodFilter}</strong>.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono tracking-widest uppercase hover:bg-indigo-600/30 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info overlay & Instructions */}
        <div className="absolute bottom-6 md:bottom-8 left-6 md:left-10 pointer-events-none z-20">
           <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-indigo-300/40 mb-2 drop-shadow-md">
            Drag to rotate &bull; Click to explore
          </span>
          <span className="inline-block font-mono text-[9px] tracking-[0.2em] uppercase text-indigo-300/80 bg-indigo-900/30 px-3 py-1.5 rounded border border-indigo-500/20 backdrop-blur-md">
            Live Connection Active
          </span>
        </div>

        {/* Active Memory Panel (Editorial Premium Card) */}
        <AnimatePresence>
          {activeMemory && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute bottom-4 left-4 right-4 md:left-auto md:right-10 md:top-auto md:bottom-10 md:w-[420px] pointer-events-auto z-30"
            >
              <div className="rounded-2xl p-8 overflow-hidden relative bg-[#0a0c10]/95 backdrop-blur-2xl border border-[#1e293b] shadow-[0_24px_50px_rgba(0,0,0,0.8)]">
                {/* Decorative top glow */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                
                {/* Close button */}
                <button 
                  onClick={() => setActiveMemory(null)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-white hover:bg-white/10 transition-colors p-2 rounded-full cursor-pointer"
                  aria-label="Close details"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>

                <div className="mb-6 pr-8">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-indigo-400">
                    {activeMemory.date}
                  </span>
                  <h3 className="text-2xl font-serif text-slate-100 mt-2 leading-tight">
                    {activeMemory.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-500/30">
                    {activeMemory.mood}
                  </span>
                  {activeMemory.tags.map(tag => (
                    <span key={tag} className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border border-slate-700/50 text-slate-400 bg-slate-800/30">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-indigo-500/40 rounded-full" />
                  <p className="pl-6 font-serif text-[15px] leading-relaxed text-slate-300 italic">
                    &quot;{activeMemory.excerpt}&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
