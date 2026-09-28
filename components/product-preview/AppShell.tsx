'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Orbit, Compass, BookOpen, BarChart2, Target, Settings } from 'lucide-react';
import { JournalView, InsightsView, GoalsView } from './DataViews';

const UniverseView = dynamic(() => import('./UniverseView'), { ssr: false });

type Tab = 'universe' | 'journal' | 'insights' | 'goals';

export interface SelectionState {
  type: 'star' | 'cluster' | null;
  id: string | null;
}

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('universe');
  const [selection, setSelection] = useState<SelectionState>({ type: null, id: null });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.3 }}
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#060810]"
    >
      {/* Permanent Background Universe */}
      <div className="absolute inset-0 z-0">
        <UniverseView selection={selection} setSelection={setSelection} activeTab={activeTab} onInteract={() => setActiveTab('universe')} />
      </div>

      {/* Floating UI Layer */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row pointer-events-none">
        
        {/* Sidebar */}
        <div className="pointer-events-auto w-full md:w-[220px] flex-shrink-0 flex md:flex-col justify-between p-4 md:p-6 bg-black/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 z-30 relative">
          <div className="flex md:flex-col gap-8 md:gap-10 items-center md:items-start w-full">
            <div className="font-mono tracking-[0.2em] uppercase text-xs text-white/90 flex items-center gap-3">
              <Orbit size={16} className="text-indigo-400" />
              <span className="hidden md:inline">ORBIT</span>
            </div>
            
            <nav className="flex md:flex-col gap-2 md:gap-4 w-full overflow-x-auto no-scrollbar">
              {[
                { id: 'universe', label: 'Universe', icon: Compass },
                { id: 'journal', label: 'Journal', icon: BookOpen },
                { id: 'insights', label: 'Insights', icon: BarChart2 },
                { id: 'goals', label: 'Goals', icon: Target },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                        : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                    <span className="font-sans hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <button className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/70 transition-colors">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>

        {/* Center Panel Container */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab !== 'universe' && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="pointer-events-auto w-full max-w-2xl max-h-full overflow-y-auto custom-scrollbar bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl"
              >
                {activeTab === 'journal' && <JournalView onStarClick={(id) => { setActiveTab('universe'); setSelection({ type: 'star', id }); }} />}
                {activeTab === 'insights' && <InsightsView />}
                {activeTab === 'goals' && <GoalsView />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel (Only on Universe Tab) */}
        <AnimatePresence>
          {activeTab === 'universe' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-auto absolute md:relative bottom-4 md:bottom-auto right-4 md:right-0 w-[calc(100%-2rem)] md:w-[280px] flex-shrink-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-none md:border-l md:border-t-0 md:border-b-0 md:border-r-0 p-6 flex flex-col z-20 m-4 md:m-0 h-auto md:h-full max-h-[40%]"
            >
              {selection.id ? (
                <SelectionDetail selection={selection} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-white/30 p-4">
                  <Compass size={24} className="mb-3 opacity-50" />
                  <p className="font-serif text-sm italic">Select a memory or cluster to view insights.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

function SelectionDetail({ selection }: { selection: SelectionState }) {
  if (selection.type === 'cluster') {
    const isStudy = selection.id === 'study';
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">Cluster</div>
        <h3 className="font-serif text-xl text-white/90 mb-6">{isStudy ? 'STUDY / LEARNING' : 'PRODUCTIVITY'}</h3>
        
        <div className="space-y-6">
          <div>
            <div className="text-white/50 text-xs mb-1">Total Memories</div>
            <div className="font-mono text-indigo-400 text-sm tracking-widest">{isStudy ? '24' : '18'} MOMENTS</div>
          </div>
          
          <div className="h-px bg-white/5 w-full" />
          
          <div>
            <div className="text-white/50 text-xs mb-1">Most Active</div>
            <div className="font-sans text-white/90 text-sm">Wednesday</div>
          </div>
          
          <div>
            <div className="text-white/50 text-xs mb-1">Average Productivity</div>
            <div className="font-sans text-white/90 text-sm">{isStudy ? '8.1 / 10' : '7.5 / 10'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">AUG 15, 2026</div>
      <h3 className="font-serif text-lg text-white/90 mb-4">Python / Learning</h3>
      
      <div className="flex gap-2 mb-6">
        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/60">Happy</span>
        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/60">8/10</span>
      </div>

      <div className="h-px bg-white/5 w-full mb-6" />

      <p className="font-serif italic text-white/70 text-sm leading-relaxed">
        "Finally understood functions today. It all makes sense now."
      </p>
    </div>
  );
}
