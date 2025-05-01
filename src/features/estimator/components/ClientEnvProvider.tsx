"use client";

import { ReactNode, useEffect } from 'react';
import { initializeClientEnv } from '../utils/initialize-client-env';

interface ClientEnvProviderProps {
  children: ReactNode;
  stepOrder?: string;
}

/**
 * Provider component that initializes client-side environment variables
 */
export function ClientEnvProvider({ children, stepOrder }: ClientEnvProviderProps) {
  useEffect(() => {
    // Initialize client-side environment variables
    initializeClientEnv(stepOrder);
  }, [stepOrder]);

  return <>{children}</>;
}
