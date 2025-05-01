/**
 * Global environment setup
 * This simplifies access to environment variables across the application.
 */

// Default step order (Project Type first, User Info last)
const DEFAULT_STEP_ORDER = 'projectType,showerIssues,waterHeater,plumbingCondition,existingBathtub,zipCode,userInfo';

// Export environment variables with defaults
export const ENV = {
  // Form step order
  FORM_STEP_ORDER: typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_FORM_STEP_ORDER 
    ? process.env.NEXT_PUBLIC_FORM_STEP_ORDER 
    : DEFAULT_STEP_ORDER,
  
  // Helper for development debugging
  IS_DEVELOPMENT: typeof process !== 'undefined' && process.env 
    ? process.env.NODE_ENV === 'development'
    : false,
};

// Log environment variables in development
if (ENV.IS_DEVELOPMENT && typeof console !== 'undefined') {
  console.log('[ENV] Environment variables loaded:', ENV);
}
