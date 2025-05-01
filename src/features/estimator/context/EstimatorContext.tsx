"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getStepOrder, StepId } from '../config/stepsConfig';
import { getSchemaForStep } from '../schemas/validationSchema';
import { z } from 'zod';

// Define types for our form state
export type PropertyType = 
  | 'Commercial' 
  | 'Residential'
  | 'Not sure';

export type ServiceType = 
  | 'New Installation' 
  | 'Replacement' 
  | 'Repair'
  | 'Not sure';

export type MaterialType = 
  | 'PVC' 
  | 'Wood' 
  | 'Aluminum' 
  | 'Chain Link' 
  | 'Other';

export type ShowerIssue =
  | 'Lack of space'
  | 'Hard to enter/exit'
  | 'Inaccessible controls'
  | 'High threshold'
  | 'Other/not sure'
  | 'None';

export type WaterHeaterType =
  | 'Storage tank water heater'
  | 'Tankless water heater'
  | 'Solar water heater'
  | 'Not sure';

export type PlumbingCondition =
  | 'Good'
  | 'Fair'
  | 'Poor'
  | 'Not sure';

export type ProjectType =
  | 'Tub to walk-in shower'
  | 'Shower to walk-in shower'
  | 'Not sure';

// Form state interface
export interface EstimatorFormState {
  // Step 1 - Property Type
  propertyType: PropertyType;
  
  // Step 2 - Service Type
  serviceType: ServiceType;
  
  // Step 3 - Materials
  materials: MaterialType[];
  
  // Step 4 - Project Details
  projectDetails: string;
  
  // Step 5 - Contact Information
  fullName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  
  // Shower specific steps
  showerIssues: ShowerIssue[];
  existingWaterHeater: WaterHeaterType;
  plumbingCondition: PlumbingCondition;
  hasExistingBathtub: boolean | null;
  projectType: ProjectType;
  
  // Current step tracking
  currentStep: number;
}

// Initial state
const initialState: EstimatorFormState = {
  // Step 1
  propertyType: 'Not sure',
  
  // Step 2
  serviceType: 'Not sure',
  
  // Step 3
  materials: [],
  
  // Step 4
  projectDetails: '',
  
  // Step 5
  fullName: '',
  email: '',
  phone: '',
  address: '',
  zipCode: '',
  
  // Shower specific steps
  showerIssues: [],
  existingWaterHeater: 'Not sure',
  plumbingCondition: 'Not sure',
  hasExistingBathtub: null,
  projectType: 'Not sure',
  
  // Current step tracking
  currentStep: 0,
};

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}

// Context type
interface EstimatorContextType {
  formState: EstimatorFormState;
  updateFormState: (updates: Partial<EstimatorFormState>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  totalSteps: number;
  validateCurrentStep: () => ValidationError[];
  currentStepId: StepId | null;
  errors: ValidationError[];
  setErrors: (errors: ValidationError[]) => void;
  isLastStep: () => boolean;
}

// Create context
const EstimatorContext = createContext<EstimatorContextType | undefined>(undefined);

// Provider component
export function EstimatorProvider({ children }: { children: ReactNode }) {
  const [formState, setFormState] = useState<EstimatorFormState>(initialState);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  // Default to 7 steps, but this will be updated when component mounts
  const [totalSteps, setTotalSteps] = useState<number>(7);
  const [stepOrder, setStepOrder] = useState<StepId[]>([]);
  const [currentStepId, setCurrentStepId] = useState<StepId | null>(null);
  
  // Initialize step order on mount
  useEffect(() => {
    try {
      const newStepOrder = getStepOrder();
      setStepOrder(newStepOrder);
      setTotalSteps(newStepOrder.length);
      setCurrentStepId(newStepOrder[formState.currentStep]);
      console.log('Total steps initialized:', newStepOrder.length);
    } catch (error) {
      console.error('Error initializing step order:', error);
    }
  }, []);
  
  // Update current step ID when step changes
  useEffect(() => {
    if (stepOrder.length > 0) {
      // Make sure we don't go beyond the last step
      const safeCurrentStep = Math.min(formState.currentStep, stepOrder.length - 1);
      
      if (safeCurrentStep !== formState.currentStep) {
        // If we somehow got to an invalid step, reset to the last step
        setFormState(prev => ({ ...prev, currentStep: safeCurrentStep }));
      }
      
      setCurrentStepId(stepOrder[safeCurrentStep]);
    }
  }, [formState.currentStep, stepOrder]);

  // Update form state
  const updateFormState = (updates: Partial<EstimatorFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  // Validate the current step
  const validateCurrentStep = (): ValidationError[] => {
    if (!currentStepId) return [];
    
    const schema = getSchemaForStep(currentStepId);
    if (!schema) return [];
    
    try {
      // Extract relevant data for the current step
      const fieldData: Record<string, any> = {};
      Object.keys(schema.shape).forEach(key => {
        fieldData[key] = formState[key as keyof EstimatorFormState];
      });
      
      // Validate with Zod
      schema.parse(fieldData);
      return []; // No errors
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
      }
      return [];
    }
  };

  // Navigation functions
  const nextStep = () => {
    const validationErrors = validateCurrentStep();
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      // Check if we're at the last step
      const nextStepIndex = formState.currentStep + 1;
      
      // Make sure we don't go beyond the available steps
      if (nextStepIndex < stepOrder.length) {
        setFormState((prev) => ({ ...prev, currentStep: nextStepIndex }));
      }
    }
  };

  const prevStep = () => {
    if (formState.currentStep > 0) {
      setFormState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const goToStep = (step: number) => {
    // Ensure we don't go beyond available steps
    if (step >= 0 && step < stepOrder.length) {
      setFormState((prev) => ({ ...prev, currentStep: step }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormState(initialState);
  };

  // Check if current step is the last step
  const isLastStep = () => {
    return formState.currentStep === totalSteps - 1;
  };

  return (
    <EstimatorContext.Provider
      value={{
        formState,
        updateFormState,
        nextStep,
        prevStep,
        goToStep,
        resetForm,
        totalSteps,
        validateCurrentStep,
        currentStepId,
        errors,
        setErrors,
        isLastStep
      }}
    >
      {children}
    </EstimatorContext.Provider>
  );
}

// Custom hook to use the Estimator context
export function useEstimator() {
  const context = useContext(EstimatorContext);
  if (context === undefined) {
    throw new Error('useEstimator must be used within an EstimatorProvider');
  }
  return context;
}
