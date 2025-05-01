import type { NextConfig } from 'next';

import initializeBundleAnalyzer from '@next/bundle-analyzer';

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

// Read step order from environment or use default
let stepOrder = process.env.NEXT_PUBLIC_FORM_STEP_ORDER;
if (!stepOrder) {
    // Default to project type first, user info last
    stepOrder = 'projectType,showerIssues,waterHeater,plumbingCondition,existingBathtub,zipCode,userInfo';
    console.log('[NextConfig] Using default step order:', stepOrder);
} else {
    console.log('[NextConfig] Using configured step order:', stepOrder);
}

// https://nextjs.org/docs/pages/api-reference/next-config-js
const nextConfig: NextConfig = {
    output: 'standalone',
    outputFileTracingIncludes: {
        "/*": ["./registry/**/*"],
    },
    eslint: {
        // Disable ESLint during build for production
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    // Hard-code environment variables in the config
    env: {
        NEXT_PUBLIC_FORM_STEP_ORDER: stepOrder,
    },
};

export default withBundleAnalyzer(nextConfig);
