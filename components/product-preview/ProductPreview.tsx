'use client';
import { motion } from 'framer-motion';
import AppShell from './AppShell';

export default function ProductPreview() {
  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-[#010204] pt-12 pb-8 flex flex-col items-center">
      {/* ── Section Intro ────────────────────────────────────────────── */}
      <div className="flex-shrink-0 z-20 flex flex-col items-center px-6 text-center mb-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono tracking-[0.38em] uppercase mb-4"
          style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}
        >
          YOUR LIFE, VISUALIZED
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
            marginBottom: '1rem',
          }}
        >
          See the patterns you couldn't see before.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans font-light"
          style={{
            fontSize: 'clamp(14px, 1.2vw, 16px)',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.02em',
          }}
        >
          ORBIT turns your memories into a living map of your experiences.
        </motion.p>
      </div>

      {/* ── App Interface ────────────────────────────────────────────── */}
      <div className="w-full max-w-[1400px] px-4 md:px-8 z-10 flex-1 min-h-0 flex flex-col">
        <AppShell />
      </div>
      
      {/* Background glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30, 40, 80, 0.08) 0%, transparent 70%)'
        }}
      />
    </section>
  );
}
