"use client";

import { ENV } from '@/lib/env-setup';
import { ACTIVE_CONFIG } from './hardcodedConfig';

// Define StepId type here to avoid import issues
export type StepId = 
  | 'propertyType'
  | 'serviceType'
  | 'materials'
  | 'projectDetails'
  | 'contactInfo'
  | 'showerIssues'
  | 'waterHeater'
  | 'plumbingCondition'
  | 'existingBathtub'
  | 'zipCode'
  | 'userInfo';

// Default step order if not specified in environment variables
export const DEFAULT_STEP_ORDER: StepId[] = ACTIVE_CONFIG as StepId[];

// This function gets the configured step order from environment variables
// Create a memoized version to avoid recalculating on every render and causing client/server mismatch
let cachedStepOrder: StepId[] | null = null;

export function getStepOrder(): StepId[] {
  // Return cached value if available to avoid recalculation on client/server
  if (cachedStepOrder) {
    return cachedStepOrder;
  }
  
  try {
    // Check if we're on the client side
    const isClient = typeof window !== 'undefined';
    
    // Only log in client
    if (isClient) {
      console.log('Calculating step order...');
    }
    
    // Use ENV from global setup or fallback to process.env
    const configValue = ENV?.FORM_STEP_ORDER || process.env.NEXT_PUBLIC_FORM_STEP_ORDER || '';
    
    // Log for debugging (client-side only)
    if (isClient) {
      console.log('Step order env value:', configValue);
    }
    
    // Return default if not found
    if (!configValue) {
      if (isClient) {
        console.log('Using hardcoded step order');
      }
      cachedStepOrder = DEFAULT_STEP_ORDER;
      return DEFAULT_STEP_ORDER;
    }
    
    // Parse the environment variable
    const steps = configValue.split(',') as StepId[];
    
    // Simple validation - only check that steps are not empty
    if (steps.length === 0) {
      if (isClient) {
        console.warn('Invalid step configuration (no steps defined). Using hardcoded default.');
      }
      cachedStepOrder = DEFAULT_STEP_ORDER;
      return DEFAULT_STEP_ORDER;
    }
    
    if (isClient) {
      console.log('Using configured step order:', steps);
    }
    
    // Cache the result
    cachedStepOrder = steps;
    return steps;
  } catch (error) {
    // Only log on client
    if (typeof window !== 'undefined') {
      console.error('Error parsing step configuration:', error);
    }
    
    cachedStepOrder = DEFAULT_STEP_ORDER;
    return DEFAULT_STEP_ORDER;
  }
}
