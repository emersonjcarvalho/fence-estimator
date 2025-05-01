"use client";

import React, { useState } from 'react';
import { ENV } from '@/lib/env-setup';
import { getStepOrder } from '../config/stepsConfig';
import { DatabaseStatus } from './DatabaseStatus';

// A component to display environment variables for debugging
export function DebugEnvironment() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Only show in development and only on client side
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // Use useEffect to ensure client-side only rendering
  const [mounted, setMounted] = useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  // Get step order for display
  const stepOrder = getStepOrder();
  const stepOrderString = Array.isArray(stepOrder) ? stepOrder.join(',') : 'Error getting step order';
  
  // Get raw environment values
  const rawStepOrderEnv = process.env.NEXT_PUBLIC_FORM_STEP_ORDER || 'Not set';
  const resetTimeoutEnv = process.env.NEXT_PUBLIC_FORM_RESET_TIMEOUT || 'Not set (default: 10000)';
  const autoResetEnabledEnv = process.env.NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED || 'Not set (default: true)';
  
  // Get client-side window values (these are the actual values used by the app)
  const clientStepOrder = typeof window !== 'undefined' ? (window as any).__NEXT_FORM_STEP_ORDER__ : 'Not available on server';
  const clientResetTimeout = typeof window !== 'undefined' ? (window as any).__NEXT_FORM_RESET_TIMEOUT__ : 'Not available on server';
  const clientAutoResetEnabled = typeof window !== 'undefined' ? (window as any).__NEXT_FORM_AUTO_RESET_ENABLED__ : 'Not available on server';
  
  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="rounded-full bg-gray-800 p-2 text-white shadow-lg"
        >
          {isVisible ? 'Hide Debug' : 'Show Debug'}
        </button>
        
        {isVisible && (
          <div className="mt-2 w-96 max-w-[90vw] rounded-md bg-white p-4 shadow-lg">
            <h3 className="mb-2 font-bold">Form Configuration Debug</h3>
            
            <div className="mb-4 space-y-2">
              <h4 className="font-semibold">Current Step Order:</h4>
              <div className="rounded bg-blue-50 p-2 font-mono text-xs">
                {stepOrderString}
              </div>
              
              <h4 className="font-semibold">Raw Environment Variables:</h4>
              <div className="rounded bg-gray-100 p-2 font-mono text-xs space-y-1">
                <div>NEXT_PUBLIC_FORM_STEP_ORDER={rawStepOrderEnv}</div>
                <div>NEXT_PUBLIC_FORM_RESET_TIMEOUT={resetTimeoutEnv}</div>
                <div>NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED={autoResetEnabledEnv}</div>
              </div>
              
              <h4 className="font-semibold">Client-side Values:</h4>
              <div className="rounded bg-green-50 p-2 font-mono text-xs space-y-1">
                <div>__NEXT_FORM_STEP_ORDER__={clientStepOrder}</div>
                <div>__NEXT_FORM_RESET_TIMEOUT__={clientResetTimeout}</div>
                <div>__NEXT_FORM_AUTO_RESET_ENABLED__={clientAutoResetEnabled}</div>
              </div>

              <h4 className="font-semibold">Database URL Status:</h4>
              <div className="rounded bg-yellow-50 p-2 font-mono text-xs">
                DATABASE_URL={process.env.DATABASE_URL ? 'Configured' : 'Not configured'}
              </div>
              
              <h4 className="font-semibold">Form Submission Behavior:</h4>
              <div className="rounded bg-purple-50 p-2 text-xs">
                <div><strong>Auto-reset:</strong> {clientAutoResetEnabled === 'true' ? 'Enabled' : 'Disabled'}</div>
                <div><strong>Reset timeout:</strong> {clientResetTimeout ? `${clientResetTimeout}ms` : '10000ms (default)'}</div>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-200 pt-2">
              <p className="text-xs text-red-500">
                <strong>Remember:</strong> After changing .env.local, you <strong>must restart</strong> the dev server.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Try using the switch-config.bat script (Windows) or switch-config.sh (Mac/Linux).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DatabaseStatus component is always visible in dev mode */}
      {isVisible && <DatabaseStatus />}
    </>
  );
}
