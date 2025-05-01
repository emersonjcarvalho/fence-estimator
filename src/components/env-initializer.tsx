"use client";

import { useEffect } from 'react';

/**
 * Sets custom environment variables in the global window object for client-side access
 */
export function EnvInitializer() {
  useEffect(() => {
    // Initialize form step order from server environment variable
    const formStepOrder = process.env.NEXT_PUBLIC_FORM_STEP_ORDER;
    if (formStepOrder) {
      (window as any).__NEXT_FORM_STEP_ORDER__ = formStepOrder;
    }
    
    // Initialize form reset timeout from server environment variable
    const formResetTimeout = process.env.NEXT_PUBLIC_FORM_RESET_TIMEOUT;
    if (formResetTimeout) {
      (window as any).__NEXT_FORM_RESET_TIMEOUT__ = formResetTimeout;
    }
    
    // Initialize auto-reset enabled flag from server environment variable
    const formAutoResetEnabled = process.env.NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED;
    if (formAutoResetEnabled !== undefined) {
      (window as any).__NEXT_FORM_AUTO_RESET_ENABLED__ = formAutoResetEnabled;
    }
    
    // Log environment variables in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Environment variables initialized:', {
        NEXT_PUBLIC_FORM_STEP_ORDER: formStepOrder,
        NEXT_PUBLIC_FORM_RESET_TIMEOUT: formResetTimeout,
        NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED: formAutoResetEnabled,
      });
    }
  }, []);
  
  // This component doesn't render anything
  return null;
}
