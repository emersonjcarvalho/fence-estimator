"use client";

/**
 * Form settings configuration
 * Handles form behavior settings like auto-reset and timeout
 */

// Default timeout in milliseconds - 10 seconds
const DEFAULT_RESET_TIMEOUT = 10000;

/**
 * Get the form reset timeout from environment variables or use default
 * @returns Timeout in milliseconds
 */
export function getFormResetTimeout(): number {
  // Check for client-side environment variables
  if (typeof window !== 'undefined') {
    const timeoutEnv = (window as any).__NEXT_FORM_RESET_TIMEOUT__;
    
    if (timeoutEnv) {
      const parsedTimeout = parseInt(timeoutEnv, 10);
      if (!isNaN(parsedTimeout) && parsedTimeout > 0) {
        return parsedTimeout;
      }
      
      console.warn('Invalid reset timeout in environment variable. Using default timeout.');
    }
  }
  
  return DEFAULT_RESET_TIMEOUT;
}

/**
 * Check if auto-reset is enabled from environment variables
 * @returns Boolean indicating if auto-reset is enabled
 */
export function isAutoResetEnabled(): boolean {
  // Check for client-side environment variables
  if (typeof window !== 'undefined') {
    const autoResetEnv = (window as any).__NEXT_FORM_AUTO_RESET_ENABLED__;
    
    if (autoResetEnv !== undefined) {
      // Convert string value to boolean
      return autoResetEnv.toLowerCase() === 'true';
    }
  }
  
  // Default to true for backward compatibility
  return true;
}
