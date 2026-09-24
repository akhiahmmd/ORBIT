import OrbitHero from '@/components/OrbitHero';
import HowItWorks from '@/components/how-it-works/HowItWorks';
import ProductPreview from '@/components/product-preview/ProductPreview';
import RefreshScrollReset from '@/components/RefreshScrollReset';

export default function Home() {
  return (
    <div className="bg-[#010204] text-slate-100 font-sans min-h-screen selection:bg-indigo-500/30 overflow-x-hidden">
      <RefreshScrollReset />
      <OrbitHero />
      <HowItWorks />
      <ProductPreview />
    </div>
  );
}
