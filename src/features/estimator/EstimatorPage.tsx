"use client";

import dynamic from 'next/dynamic';
import { EstimatorForm } from "./components";
import { EstimatorProvider } from "./context/EstimatorContext";

// Dynamically import debug components to ensure they only load in development
const DebugEnvironment = dynamic(
  () => process.env.NODE_ENV === 'development' 
    ? import('./components/DebugEnvironment').then(mod => mod.DebugEnvironment)
    : Promise.resolve(() => null),
  { ssr: false }
);

const ConfigSwitcher = dynamic(
  () => process.env.NODE_ENV === 'development'
    ? import('./components/ConfigSwitcher').then(mod => mod.ConfigSwitcher) 
    : Promise.resolve(() => null),
  { ssr: false }
);

export default function EstimatorPage() {
  return (
    <EstimatorProvider>
      <EstimatorForm />
      
      {/* Debug tools - only loaded and rendered in development */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <DebugEnvironment />
          <ConfigSwitcher />
        </>
      )}
    </EstimatorProvider>
  );
}
