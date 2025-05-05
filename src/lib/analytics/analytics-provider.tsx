'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GA_MEASUREMENT_ID, trackVirtualPageView } from './gtag';

/**
 * AnalyticsProvider props
 */
interface AnalyticsProviderProps {
  children: ReactNode;
}

/**
 * Provider component that initializes analytics and tracks route changes
 * This handles virtual page views for SPA navigation
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps): JSX.Element {
  const pathname = usePathname();

  // Track initial page view
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      trackVirtualPageView(pathname);
    }
  }, []);

  // Track page changes
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      trackVirtualPageView(pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}
