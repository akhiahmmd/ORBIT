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

  // Apply filters using real dates relative to today: 2026-09-25
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
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col bg-transparent" id="universe">
      
      {/* Structural layout: Header -> Toolbar -> Galaxy */}
      <div className="relative z-20 w-full flex-shrink-0 pt-24 pb-6 flex flex-col items-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center px-6"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-4">
            Your Universe
          </h2>
          <p className="text-base md:text-lg text-indigo-200/60 max-w-xl mx-auto font-sans leading-relaxed font-light">
            Every thought, reflection, and moment becomes a star in your personal galaxy.
          </p>
        </motion.div>

        {/* Compact Control Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center items-center gap-4 bg-[#0a0f1f]/80 backdrop-blur-xl border border-indigo-500/20 rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-30"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-indigo-300/50 font-mono">Time</span>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
              {FILTER_OPTIONS.time.map(time => (
                <button
                  key={time}
                  onClick={() => setActiveTimeFilter(time)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTimeFilter === time
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-indigo-200/50 hover:text-indigo-200 hover:bg-white/5'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-indigo-500/20 hidden md:block" />

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-indigo-300/50 font-mono">Mood</span>
            <div className="flex flex-wrap gap-1 bg-black/40 rounded-lg p-1 border border-white/5">
              {FILTER_OPTIONS.mood.map(mood => (
                <button
                  key={mood}
                  onClick={() => setActiveMoodFilter(mood)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeMoodFilter === mood
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-indigo-200/50 hover:text-indigo-200 hover:bg-white/5'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Galaxy Area */}
      <div className="relative flex-1 w-full min-h-[500px] sm:min-h-[600px] z-10" style={{ touchAction: 'pan-y' }}>
        
        {/* Empty State */}
        {filteredMemories.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="bg-[#0a0f1f]/80 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl pointer-events-auto">
              <span className="text-indigo-300/40 mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </span>
              <h3 className="text-xl text-white font-serif mb-2">No memories found</h3>
              <p className="text-sm text-indigo-200/60 mb-6">Your current filters returned empty space.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-indigo-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 cursor-grab active:cursor-grabbing" style={{ touchAction: 'pan-y' }}>
          <Canvas
            style={{ touchAction: 'pan-y' }}
            camera={{ position: [0, 2, 12], fov: 45, near: 0.1, far: 150 }}
            gl={{ antialias: true, alpha: true }}
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
        </div>

        {/* Info overlay & Instructions */}
        <div className="absolute bottom-6 left-6 md:left-12 pointer-events-none z-20">
           <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-indigo-200/40 mb-2">
            Drag to rotate &bull; Click to explore
          </span>
          <span className="inline-block font-mono text-[9px] tracking-[0.2em] uppercase text-cyan-300/60 bg-cyan-900/20 px-3 py-1.5 rounded border border-cyan-500/20 backdrop-blur-md">
            Sample Data Mode
          </span>
        </div>

        {/* Active Memory Panel (Responsive Side/Bottom Sheet) */}
        <AnimatePresence>
          {activeMemory && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute bottom-4 left-4 right-4 md:left-auto md:right-8 md:top-8 md:bottom-auto md:w-[380px] pointer-events-auto z-30"
            >
              <div className="rounded-2xl p-6 md:p-8 overflow-hidden relative bg-[#090b14]/90 backdrop-blur-2xl border border-indigo-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)]">
                {/* Decorative top glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                
                {/* Close button */}
                <button 
                  onClick={() => setActiveMemory(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 text-indigo-200/40 hover:text-white hover:bg-white/10 transition-colors p-2 rounded-full cursor-pointer"
                  aria-label="Close details"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>

                <div className="mb-4 md:mb-6 pr-8">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cyan-400">
                    {activeMemory.date}
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif text-white mt-2 leading-tight">
                    {activeMemory.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                    {activeMemory.mood}
                  </span>
                  {activeMemory.tags.map(tag => (
                    <span key={tag} className="font-mono text-[9px] tracking-[0.15em] uppercase px-2 py-1 md:px-3 md:py-1.5 rounded-md border border-white/10 text-white/50 bg-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-gradient-to-b from-cyan-500 to-indigo-500 rounded-full" />
                  <p className="pl-5 md:pl-6 font-serif text-[15px] md:text-[16px] leading-[1.6] text-indigo-100/80 italic">
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
