"use client";

/**
 * Initialize environment variables for the client-side
 * This function sets global variables that will be used by client components
 */
export function initializeClientEnv(stepOrder?: string) {
  if (typeof window !== 'undefined') {
    // Set the step order as a global variable for client-side access
    (window as any).__NEXT_FORM_STEP_ORDER__ = stepOrder;
  }
}
