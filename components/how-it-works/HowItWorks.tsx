'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

import JournalDemo from './JournalDemo';
import AnalysisDemo from './AnalysisDemo';
import MemoryFormation from './MemoryFormation';

const MiniOrbit = dynamic(() => import('./MiniOrbit'), { ssr: false });

type Step = 'journal' | 'analysis' | 'memory' | 'orbit' | 'pattern';

export default function HowItWorks() {
  const [step, setStep] = useState<Step>('journal');

  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden bg-[#010204] flex flex-col"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Section Intro ────────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center pt-24 pb-8 px-6 text-center pointer-events-none flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono tracking-[0.38em] uppercase mb-4"
          style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}
        >
          HOW ORBIT WORKS
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-balance"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            color: 'rgba(255,255,255,0.96)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '0.6rem',
          }}
        >
          From moments to patterns.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans font-light max-w-[480px]"
          style={{
            fontSize: 'clamp(12px, 1.1vw, 14px)',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.02em',
          }}
        >
          See how a single moment becomes part of your personal universe.
        </motion.p>
      </div>

      {/* ── Main Interactive Area ────────────────────────────────────── */}
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 flex-1 flex items-center justify-center pb-24">
        
        <AnimatePresence mode="wait">
          {step !== 'orbit' && step !== 'pattern' ? (
            <motion.div 
              key="flow"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8"
            >
              {/* LEFT: Journal */}
              <div className="w-full md:w-1/3 flex justify-center md:justify-end z-10">
                <JournalDemo 
                  onAnalyze={() => setStep('analysis')} 
                  isAnalyzed={step !== 'journal'} 
                />
              </div>

              {/* CENTER: Analysis & Memory Formation */}
              <div className="w-full md:w-1/3 flex justify-center z-10 min-h-[300px] relative">
                <AnimatePresence mode="wait">
                  {step === 'analysis' && (
                    <AnalysisDemo 
                      key="analysis" 
                      onCreateMemory={() => setStep('memory')} 
                    />
                  )}
                  {step === 'memory' && (
                    <MemoryFormation 
                      key="memory" 
                      onViewOrbit={() => setStep('orbit')} 
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT: Universe Space */}
              <div className="w-full md:w-1/3 flex justify-center md:justify-start z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="miniorbit"
              className="w-full max-w-[1000px] z-10"
            >
              <MiniOrbit onExploreFull={() => console.log('Navigate to full app')} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Subtle background glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 60%, rgba(30, 40, 80, 0.15) 0%, transparent 60%)'
        }}
      />
    </section>
  );
}
