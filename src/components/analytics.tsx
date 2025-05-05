'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

/**
 * Analytics component that includes Vercel Analytics
 * 
 * This is separate from our Google Analytics implementation
 * and provides additional insights through Vercel's dashboard
 */
export function Analytics() {
    return <VercelAnalytics />;
}
