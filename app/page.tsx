import HeroSection from '@/components/HeroSection';
import ScrollNarrative from '@/components/ScrollNarrative';
import SceneManager from '@/components/SceneManager';

export default function Home() {
  return (
    <div className="bg-transparent text-slate-100 font-sans min-h-screen selection:bg-indigo-500/30">
      
      <SceneManager />

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="text-xl font-bold tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300 uppercase pointer-events-auto">
          ORBIT
        </div>
      </nav>

      {/* Scrollable Overlay Area */}
      <main className="relative z-10 flex flex-col items-center justify-start w-full pointer-events-none">
        <HeroSection />
        <ScrollNarrative />
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 flex flex-col items-center justify-center opacity-40 border-t border-white/5 pointer-events-none mt-40">
        <p className="text-xs tracking-widest uppercase mb-2">ORBIT OS © 2026</p>
        <p className="text-[10px] text-slate-500 tracking-wider">Explore the patterns that shape you.</p>
      </footer>
    </div>
  );
}
