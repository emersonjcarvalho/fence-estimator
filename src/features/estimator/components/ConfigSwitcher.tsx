"use client";

import React, { useState, useEffect } from 'react';
import { useEstimator } from '../context/EstimatorContext';
import { getStepOrder } from '../config/stepsConfig';

// Pre-defined configurations for testing
const STEP_CONFIGURATIONS = {
  propertyTypeFirst: 'propertyType,serviceType,materials,projectDetails,contactInfo',
  contactInfoFirst: 'contactInfo,propertyType,serviceType,materials,projectDetails',
  technicalFirst: 'materials,serviceType,propertyType,projectDetails,contactInfo',
};

// Form submission behavior options
const RESET_TIMEOUT_OPTIONS = {
  quick: '3000',     // 3 seconds
  default: '10000',  // 10 seconds
  long: '30000',     // 30 seconds
};

const AUTO_RESET_OPTIONS = {
  enabled: 'true',
  disabled: 'false',
};

// This component allows changing the configuration in-memory for testing
// Note: Changes won't persist after page refresh - this is just for testing
export function ConfigSwitcher() {
  const [isVisible, setIsVisible] = useState(false);
  const { resetForm, goToStep } = useEstimator();
  
  // Track current reset settings
  const [resetTimeout, setResetTimeout] = useState<string>(
    typeof window !== 'undefined' 
      ? ((window as any).__NEXT_FORM_RESET_TIMEOUT__ || RESET_TIMEOUT_OPTIONS.default)
      : RESET_TIMEOUT_OPTIONS.default
  );
  
  const [autoReset, setAutoReset] = useState<string>(
    typeof window !== 'undefined'
      ? ((window as any).__NEXT_FORM_AUTO_RESET_ENABLED__ || AUTO_RESET_OPTIONS.enabled)
      : AUTO_RESET_OPTIONS.enabled
  );
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  // Use useEffect to ensure client-side only rendering
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  // Get current step order for display
  const currentStepOrder = typeof window !== 'undefined' 
    ? (window as any).__NEXT_FORM_STEP_ORDER__ || STEP_CONFIGURATIONS.propertyTypeFirst
    : STEP_CONFIGURATIONS.propertyTypeFirst;
  
  const switchStepConfig = (config: string) => {
    try {
      // This is a hack to test different configurations without server restart
      // It overwrites the environment variable in memory
      if (typeof window !== 'undefined') {
        // Set the global variable that will be used by the form
        (window as any).__NEXT_FORM_STEP_ORDER__ = config;
        
        // Reset form and go to step 0
        resetForm();
        goToStep(0);
        
        // Force a page refresh to apply the new configuration
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching step configuration:', error);
      alert('Error switching configuration. See console for details.');
    }
  };
  
  const switchResetTimeoutConfig = (timeout: string) => {
    try {
      // Update in-memory settings
      if (typeof window !== 'undefined') {
        (window as any).__NEXT_FORM_RESET_TIMEOUT__ = timeout;
        setResetTimeout(timeout);
        console.log(`Reset timeout updated to ${timeout}ms`);
      }
    } catch (error) {
      console.error('Error switching reset timeout:', error);
      alert('Error switching reset timeout. See console for details.');
    }
  };
  
  const switchAutoResetConfig = (enabled: string) => {
    try {
      // Update in-memory settings
      if (typeof window !== 'undefined') {
        (window as any).__NEXT_FORM_AUTO_RESET_ENABLED__ = enabled;
        setAutoReset(enabled);
        console.log(`Auto-reset ${enabled === 'true' ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error('Error switching auto-reset setting:', error);
      alert('Error switching auto-reset setting. See console for details.');
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="rounded-full bg-indigo-600 p-2 text-white shadow-lg"
      >
        {isVisible ? 'Hide Configs' : 'Test Configs'}
      </button>
      
      {isVisible && (
        <div className="mt-2 w-72 rounded-md bg-white p-4 shadow-lg">
          <h3 className="mb-2 font-bold">Test Different Configurations</h3>
          
          {/* Step order configuration */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Step Order:</h4>
            <p className="text-xs text-gray-500 mb-2">
              Current order: {currentStepOrder}
            </p>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => switchStepConfig(STEP_CONFIGURATIONS.propertyTypeFirst)}
                className="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
              >
                Property Type First
              </button>
              
              <button
                onClick={() => switchStepConfig(STEP_CONFIGURATIONS.contactInfoFirst)}
                className="rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600"
              >
                Contact Info First
              </button>
              
              <button
                onClick={() => switchStepConfig(STEP_CONFIGURATIONS.technicalFirst)}
                className="rounded bg-amber-500 px-2 py-1 text-sm text-white hover:bg-amber-600"
              >
                Technical First
              </button>
            </div>
          </div>
          
          {/* Form submission behavior configuration */}
          <div className="mb-4 border-t border-gray-200 pt-3">
            <h4 className="text-sm font-semibold mb-2">Form Submission Behavior:</h4>
            
            {/* Auto-reset toggle */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">
                Auto-reset: <span className={`font-semibold ${autoReset === 'true' ? 'text-green-600' : 'text-red-600'}`}>
                  {autoReset === 'true' ? 'Enabled' : 'Disabled'}
                </span>
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => switchAutoResetConfig(AUTO_RESET_OPTIONS.enabled)}
                  className={`rounded px-2 py-1 text-xs text-white ${
                    autoReset === 'true' ? 'bg-green-700' : 'bg-green-400 hover:bg-green-600'
                  }`}
                >
                  Enable
                </button>
                
                <button
                  onClick={() => switchAutoResetConfig(AUTO_RESET_OPTIONS.disabled)}
                  className={`rounded px-2 py-1 text-xs text-white ${
                    autoReset === 'false' ? 'bg-red-700' : 'bg-red-400 hover:bg-red-600'
                  }`}
                >
                  Disable
                </button>
              </div>
            </div>
            
            {/* Reset timeout */}
            <div>
              <p className="text-xs text-gray-500 mb-2">
                Reset timeout: <span className="font-semibold">{resetTimeout}ms</span>
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => switchResetTimeoutConfig(RESET_TIMEOUT_OPTIONS.quick)}
                  className={`rounded px-2 py-1 text-xs text-white ${
                    resetTimeout === RESET_TIMEOUT_OPTIONS.quick ? 'bg-blue-700' : 'bg-blue-400 hover:bg-blue-600'
                  }`}
                >
                  Quick (3s)
                </button>
                
                <button
                  onClick={() => switchResetTimeoutConfig(RESET_TIMEOUT_OPTIONS.default)}
                  className={`rounded px-2 py-1 text-xs text-white ${
                    resetTimeout === RESET_TIMEOUT_OPTIONS.default ? 'bg-blue-700' : 'bg-blue-400 hover:bg-blue-600'
                  }`}
                >
                  Default (10s)
                </button>
                
                <button
                  onClick={() => switchResetTimeoutConfig(RESET_TIMEOUT_OPTIONS.long)}
                  className={`rounded px-2 py-1 text-xs text-white ${
                    resetTimeout === RESET_TIMEOUT_OPTIONS.long ? 'bg-blue-700' : 'bg-blue-400 hover:bg-blue-600'
                  }`}
                >
                  Long (30s)
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 border-t border-gray-200 pt-2">
            <p className="text-xs text-gray-500">
              <strong>Note:</strong> These changes only apply to this session.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
