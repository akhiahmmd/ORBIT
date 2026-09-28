import OrbitHero from '@/components/OrbitHero';
import HowItWorks from '@/components/how-it-works/HowItWorks';
import YourUniverse from '@/components/universe/YourUniverse';
import ProductPreview from '@/components/product-preview/ProductPreview';
import Conclusion from '@/components/Conclusion';
import RefreshScrollReset from '@/components/RefreshScrollReset';

export default function Home() {
  return (
    <div className="bg-background text-slate-100 font-sans min-h-screen selection:bg-indigo-500/30 overflow-x-hidden">
      <RefreshScrollReset />
      <OrbitHero />
      <HowItWorks />
      <YourUniverse />
      <ProductPreview />
      <Conclusion />
    </div>
  );
}
