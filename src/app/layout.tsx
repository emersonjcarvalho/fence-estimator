import './globals.css';

import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import { Analytics } from '@/components/analytics';
import { ThemeProvider } from '@/components/theme-provider';
import { EnvInitializer } from '@/components/env-initializer';

export const metadata: Metadata = {
    title: 'HomeBuddy - Walk-in Shower Estimator',
    description: 'Get an instant estimate for your walk-in shower installation project',
    icons: {
        icon: '/favicon.ico',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${GeistSans.variable} ${GeistMono.variable} m-0 min-h-screen bg-background p-0 font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <EnvInitializer />
                    {children}
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
