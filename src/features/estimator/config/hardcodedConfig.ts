/**
 * Hardcoded configurations for form steps
 * This is used as a fallback when environment variables are not working
 */

// Available configurations
export const CONFIGS = {
  // Default order - As specified in the requirements
  DEFAULT: [
    'propertyType',
    'serviceType',
    'materials',
    'projectDetails',
    'contactInfo'
  ] as string[],
  
  // Contact Info first
  CONTACT_INFO_FIRST: [
    'contactInfo',
    'propertyType',
    'serviceType',
    'materials',
    'projectDetails'
  ] as string[],
  
  // Technical questions first
  TECHNICAL_FIRST: [
    'serviceType',
    'materials',
    'propertyType',
    'projectDetails',
    'contactInfo'
  ] as string[],
};

// CHANGE THIS LINE to switch between configurations when environment variables don't work
export const ACTIVE_CONFIG = CONFIGS.DEFAULT;
