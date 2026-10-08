import type { Metadata } from 'next';
import OrbitHeroV2 from '@/components/hero/OrbitHeroV2';

export const metadata: Metadata = {
  title: 'ORBIT — Hero V2 Preview',
  description: 'Isolated preview of the new ORBIT hero design.',
};

/**
 * /hero-v2
 *
 * Isolated development route — renders ONLY OrbitHeroV2.
 * Does NOT modify the existing homepage.
 * Does NOT import or affect any existing hero component.
 */
export default function HeroV2Page() {
  return <OrbitHeroV2 />;
}
