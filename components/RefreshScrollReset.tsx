'use client';
import { useEffect } from 'react';

export default function RefreshScrollReset() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isReload = 
        (window.performance?.navigation?.type === 1) || 
        window.performance?.getEntriesByType('navigation').some((nav) => (nav as PerformanceNavigationTiming).type === 'reload');
        
      if (isReload) {
        // Scroll to top immediately on mount
        window.scrollTo(0, 0);
        
        // Small delay to ensure it overrides any framework-level (Next.js) or browser delayed scroll restoration
        const timeoutId = setTimeout(() => {
          window.scrollTo(0, 0);
        }, 50);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, []);

  return null;
}
