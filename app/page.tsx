export default function Home() {
  return (
    <div className="min-h-screen bg-[#030508] text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Background Stars & Glowing Particles Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
          ORBIT
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 mt-10 md:mt-0">
        
        {/* Glowing Orbit Visual (Built with CSS) */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12 flex items-center justify-center animate-float">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-slow-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute -top-2 left-1/2 w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]"></div>
          </div>
          {/* Middle ring */}
          <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-slow-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
            <div className="absolute top-1/2 -right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          </div>
          {/* Inner glowing core */}
          <div className="absolute inset-16 rounded-full bg-gradient-to-br from-indigo-600 to-blue-900 animate-pulse-glow shadow-[0_0_60px_rgba(79,70,229,0.4)]"></div>
        </div>

        {/* Typography & Copy */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
          Explore the patterns <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            that shape you.
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
          Turn your thoughts, goals, and daily moments into an interactive universe powered by AI.
        </p>

        {/* Interactive CTA Button */}
        <button className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 rounded-full transition-all duration-300 backdrop-blur-sm cursor-pointer">
          <span className="relative z-10 text-white font-medium tracking-wide flex items-center gap-2">
            Enter Your Universe
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          {/* Glow effect that appears on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none"></div>
        </button>
      </main>

      {/* Footer / Scroll Indicator */}
      <footer className="relative z-10 py-8 flex flex-col items-center justify-center opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-slate-400 to-transparent mb-4 animate-pulse"></div>
        <p className="text-xs tracking-widest uppercase">Discover Your Orbit</p>
      </footer>
    </div>
  );
}
