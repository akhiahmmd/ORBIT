'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { EventStarData } from './DataStars';

/**
 * InsightPanel — Spatial information panel shown when a star is clicked.
 * Positioned as an HTML overlay on top of the 3D scene.
 */
export default function InsightPanel({
  star,
  onClose,
}: {
  star: EventStarData | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {star && (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 pointer-events-auto w-[300px]"
        >
          <div className="bg-[#070914]/88 backdrop-blur-2xl border border-white/[0.1] rounded-sm shadow-[0_18px_60px_rgba(0,0,0,0.72)] overflow-hidden">
            {/* Top accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-200/70 to-transparent" />

            <div className="p-6">
              {/* Date */}
              <div className="flex items-center justify-between text-[10px] font-mono text-white/32 tracking-[0.2em] mb-4">
                {star.date}
                <span className="text-emerald-200/65">RECALLED</span>
              </div>

              {/* Topic */}
              <h3 className="text-white text-lg font-semibold tracking-tight mb-1">
                {star.topic}
              </h3>

              {/* Cluster tag */}
              <div className="text-indigo-200/55 text-xs font-mono tracking-wide mb-5">
                {star.cluster}
              </div>

              {/* Meta */}
              <div className="space-y-3 mb-5 pb-5 border-b border-white/[0.04]">
                <div className="flex justify-between text-xs">
                  <span className="text-white/25">Mood</span>
                  <span className="text-white/70">{star.mood}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/25">Productivity</span>
                  <span className="text-white/70">{star.productivity}</span>
                </div>
              </div>

              {/* Journal */}
              <p className="text-white/35 text-[13px] leading-relaxed italic">
                &ldquo;{star.journal}&rdquo;
              </p>

              {/* Close */}
              <button
                onClick={onClose}
                className="mt-5 text-[10px] text-white/15 hover:text-white/40 transition-colors tracking-[0.15em] uppercase cursor-pointer"
              >
                Return to universe ←
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
