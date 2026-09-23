'use client';
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import MiniOrbitScene from './MiniOrbitScene';

interface MiniOrbitProps {
  onExploreFull: () => void;
}

export default function MiniOrbit({ onExploreFull }: MiniOrbitProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [hoverType, setHoverType] = useState<'star' | 'cluster' | null>(null);
  const [clickType, setClickType] = useState<'star' | 'cluster' | null>(null);

  const handleHover = (id: string | null, type: 'star' | 'cluster' | null) => {
    setHoveredId(id);
    setHoverType(type);
  };

  const handleClick = (id: string | null, type: 'star' | 'cluster' | null) => {
    if (clickedId === id) {
      // Toggle off if already clicked
      setClickedId(null);
      setClickType(null);
    } else {
      setClickedId(id);
      setClickType(type);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
           style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)' }}>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <MiniOrbitScene 
              hoveredId={hoveredId} 
              clickedId={clickedId} 
              onHover={handleHover} 
              onClick={handleClick} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Subtle Hint Controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Drag to explore</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Scroll to zoom</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Click a memory</span>
        </div>

        <AnimatePresence>
          {/* Star Hover / Click Panel */}
          {((hoveredId && hoverType === 'star' && !clickedId) || (clickedId && clickType === 'star')) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-6 top-6 w-[220px] rounded-xl overflow-hidden pointer-events-auto"
              style={{
                background: 'rgba(6,8,18,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    AUG 15, 2026
                  </span>
                </div>
                <h4 className="font-serif mb-3" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.92)' }}>
                  Python / Learning
                </h4>
                <div className="flex gap-3 mb-3">
                  <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                    Happy
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                    8/10
                  </span>
                </div>
                <div className="h-px mb-3" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <p className="font-serif italic leading-[1.5]" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  &ldquo;Finally understood functions today. It all makes sense now.&rdquo;
                </p>
              </div>
            </motion.div>
          )}

          {/* Cluster Hover / Click Panel */}
          {((hoveredId && hoverType === 'cluster' && !clickedId) || (clickedId && clickType === 'cluster')) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-6 top-6 w-[200px] rounded-xl overflow-hidden pointer-events-auto"
              style={{
                background: 'rgba(6,8,18,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="p-4 text-right">
                <div className="font-mono text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Pattern Cluster
                </div>
                <h4 className="font-serif mb-2" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.92)' }}>
                  {hoveredId === 'study' || clickedId === 'study' ? 'Study & Code' : 'Productivity'}
                </h4>
                <div className="font-mono text-[10px] tracking-widest text-indigo-400">
                  24 MOMENTS
                </div>
                {clickedId && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-left">
                    <p className="font-sans text-[11px] leading-[1.6] text-white/50">
                      Python appears frequently in your study entries, usually correlating with high focus scores.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-center pointer-events-auto"
        >
          <p className="font-serif italic" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            One memory is a moment.<br/>
            Hundreds of memories reveal patterns.
          </p>
          
          <button
            onClick={onExploreFull}
            className="group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            <span 
              className="font-mono tracking-[0.1em] text-[10px] uppercase font-medium relative z-10 transition-colors"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Explore the full universe
            </span>
            <svg 
              width="12" height="12" viewBox="0 0 12 12" fill="none" 
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(circle at center, rgba(140,165,255,0.15) 0%, transparent 70%)' }}
            />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
