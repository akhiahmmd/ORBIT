'use client';
import { motion, AnimatePresence } from 'framer-motion';

export interface NodeData {
  id: string;
  date: string;
  topic: string;
  cluster: string;
  mood: string;
  productivity: string;
  journal: string;
}

interface NodeInsightProps {
  node: NodeData | null;
  position: { x: number; y: number };
  expanded: boolean;
  onClose: () => void;
}

export default function NodeInsight({ node, position, expanded, onClose }: NodeInsightProps) {
  if (!node) return null;

  // Keep panel within viewport bounds
  const panelWidth = expanded ? 280 : 220;
  const panelHeight = expanded ? 260 : 140;

  return (
    <AnimatePresence>
      <motion.div
        key={node.id + (expanded ? '-exp' : '')}
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute z-40 pointer-events-auto"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -110%)',
        }}
      >
        <div
          className={`
            bg-[#0a0e1a]/90 backdrop-blur-xl border border-white/[0.08]
            rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden
            transition-all duration-300
          `}
          style={{ width: panelWidth }}
        >
          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="p-4">
            {/* Date + cluster tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-white/40 tracking-wide">
                {node.date}
              </span>
              <span className="text-[10px] font-mono text-indigo-300/70 bg-indigo-500/10 px-2 py-0.5 rounded tracking-wide">
                {node.cluster}
              </span>
            </div>

            {/* Topic */}
            <div className="text-white/90 text-sm font-medium mb-2 tracking-tight">
              {node.topic}
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-[11px] text-white/30 mb-1">
              <span>Mood: <span className="text-white/60">{node.mood}</span></span>
              <span>Prod: <span className="text-white/60">{node.productivity}</span></span>
            </div>

            {/* Journal excerpt — only in expanded mode */}
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <p className="text-[12px] text-white/40 leading-relaxed italic">
                    &ldquo;{node.journal}&rdquo;
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-3 text-[10px] text-white/20 hover:text-white/50 transition-colors tracking-wide uppercase cursor-pointer"
                >
                  Close
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
