import { 
  Step1UserInfo,
  Step2ShowerIssues,
  Step3WaterHeater,
  Step4PlumbingCondition,
  Step5ExistingBathtub,
  Step6ProjectType,
  Step7ZipCode
} from '../components';

// Define available step keys and their components
export const STEP_COMPONENTS = {
  projectType: Step6ProjectType,
  showerIssues: Step2ShowerIssues,
  waterHeater: Step3WaterHeater,
  plumbingCondition: Step4PlumbingCondition,
  existingBathtub: Step5ExistingBathtub,
  zipCode: Step7ZipCode,
  contactInfo: Step1UserInfo,
};

// Define step keys for type safety
export type StepKey = keyof typeof STEP_COMPONENTS;

// Default step order if not specified in environment variables
export const DEFAULT_STEP_ORDER: StepKey[] = [
  'projectType',
  'showerIssues', 
  'waterHeater',
  'plumbingCondition',
  'existingBathtub',
  'zipCode',
  'contactInfo'
];

/**
 * Parse the step order from environment variable
 * Format: comma-separated list of step keys
 * Example: projectType,showerIssues,waterHeater,plumbingCondition,existingBathtub,zipCode,contactInfo
 */
export function getStepOrder(): StepKey[] {
  // In client-side code, we need to check if we're in the browser
  if (typeof window !== 'undefined') {
    // For client-side, we'll use a global variable that will be set from .env
    const stepOrderEnv = (window as any).__NEXT_FORM_STEP_ORDER__;
    
    if (stepOrderEnv) {
      try {
        const steps = stepOrderEnv.split(',') as StepKey[];
        
        // Validate that all steps are valid keys
        const allValid = steps.every(step => 
          Object.keys(STEP_COMPONENTS).includes(step)
        );
        
        // Validate that all required steps are included
        const allStepsIncluded = Object.keys(STEP_COMPONENTS).every(
          requiredStep => steps.includes(requiredStep as StepKey)
        );
        
        if (allValid && allStepsIncluded) {
          return steps;
        }
        
        console.warn('Invalid step order in environment variable. Using default order.');
      } catch (error) {
        console.error('Error parsing step order from environment variable:', error);
      }
    }
  }
  
  // Fall back to default order
  return DEFAULT_STEP_ORDER;
}

/**
 * Get the component for a specific step index
 */
export function getStepComponent(stepIndex: number) {
  const stepOrder = getStepOrder();
  
  if (stepIndex < 0 || stepIndex >= stepOrder.length) {
    throw new Error(`Invalid step index: ${stepIndex}`);
  }
  
  const stepKey = stepOrder[stepIndex];
  return STEP_COMPONENTS[stepKey];
}
