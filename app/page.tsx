import OrbitHero from '@/components/OrbitHero';
import HowItWorks from '@/components/how-it-works/HowItWorks';

export default function Home() {
  return (
    <div className="bg-[#010204] text-slate-100 font-sans min-h-screen selection:bg-indigo-500/30 overflow-x-hidden">
      <OrbitHero />
      <HowItWorks />
    </div>
  );
}
