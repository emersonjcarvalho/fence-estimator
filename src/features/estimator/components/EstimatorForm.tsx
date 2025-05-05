"use client";

import React, { useState, useRef } from 'react';
import { useEstimator } from '../context/EstimatorContext';
import { getStepOrder } from '../config/stepsConfig';
import { getFormResetTimeout, isAutoResetEnabled } from '../config/formSettings';
import { Step1PropertyType } from './Step1PropertyType';
import { Step2ServiceType } from './Step2ServiceType';
import { Step3Materials } from './Step3Materials';
import { Step4ProjectDetails } from './Step4ProjectDetails';
import { Step5ContactInfo } from './Step5ContactInfo';
import { handleFormSubmission } from '../services/formSubmissionService';
import { FeedbackMessage } from './FeedbackMessage';
import { SubmissionFallback } from './SubmissionFallback';
import { supabase } from '@/lib/supabase/client';
import { trackFormSubmission } from '@/lib/analytics';

export function EstimatorForm() {
  const { formState, resetForm, isLastStep } = useEstimator();
  const stepOrder = getStepOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Get the current step ID based on the current step index
  const currentStepId = stepOrder[formState.currentStep];
  
  // For debugging
  console.log('Current step:', formState.currentStep);
  console.log('Step order:', stepOrder);
  console.log('Current step ID:', currentStepId);
  
  // Store timeout ID for cleanup
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!isLastStep()) return;
    
    // Clear any existing timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    
    setIsSubmitting(true);
    try {
      // Submit to database
      const result = await handleFormSubmission(formState);
      
      // Track form submission in Google Analytics
      trackFormSubmission(result.success, {
        form_type: 'fence_estimator',
        property_type: formState.propertyType,
        service_type: formState.serviceType,
        materials_count: formState.materials.length,
        ...(result.success ? {} : { error_message: result.message }),
      });
      
      // Set feedback based on the result
      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message
      });
      
      if (result.success && isAutoResetEnabled()) {
        // Get configured timeout
        const resetTimeout = getFormResetTimeout();
        console.log(`Auto-reset enabled. Will reset form in ${resetTimeout}ms`);
        
        // Reset form after configured delay to show success message
        resetTimeoutRef.current = setTimeout(() => {
          resetForm();
          setFeedback(null);
          resetTimeoutRef.current = null;
        }, resetTimeout);
      }
    } catch (error: any) {
      console.error('Error in form submission handler:', error);
      
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      
      // Add development mode details
      if (process.env.NODE_ENV === 'development') {
        errorMessage += ` Developer info: ${error.message || 'Unknown error'}`;
      }
      
      // Track form submission error in analytics
      trackFormSubmission(false, {
        form_type: 'fence_estimator',
        error_message: error.message || 'Unknown error',
        error_type: 'exception'
      });
      
      setFeedback({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const clearFeedback = () => {
    // Clear any existing timeout when feedback is manually cleared
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    
    setFeedback(null);
  };
  
  // Determine if we should show the development fallback
  const isDevMode = process.env.NODE_ENV === 'development';
  const showDevFallback = isDevMode && !supabase && feedback?.type === 'error';
  
  // Render feedback message if exists
  if (feedback) {
    return (
      <div className="flex min-h-[85vh] flex-col items-center justify-center bg-slate-50 py-8">
        <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex justify-between items-center">
            <div className="text-blue-600 font-bold text-2xl">
            <strong>1<sup>st</sup></strong> Ranked Fence<span className="text-orange-400">.</span>
              <div className="text-xs font-normal text-blue-600 uppercase">
                Strong and Secure Fences in South Florida
              </div>
            </div>
          </div>
          
          {/* Show the development fallback in dev mode without Supabase */}
          {showDevFallback ? (
            <SubmissionFallback 
              formData={formState} 
              onClose={clearFeedback} 
            />
          ) : (
            <>
              <FeedbackMessage 
                type={feedback.type} 
                message={feedback.message} 
                onClose={clearFeedback} 
              />
              
              <div className="mt-6">
                <button
                  onClick={() => {
                    resetForm();
                    setFeedback(null); // Clear feedback to return to form
                  }}
                  className="w-full rounded-md bg-blue-500 p-4 font-semibold text-white transition hover:bg-blue-600"
                >
                  Start a New Estimate
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  
  // Render the appropriate component for the current step
  const isLastStepValue = isLastStep();
  const submissionProps = isLastStepValue ? { onSubmit: handleSubmit, isSubmitting } : {};
  
  switch (currentStepId) {
    case 'propertyType':
      return <Step1PropertyType />;
    case 'serviceType':
      return <Step2ServiceType />;
    case 'materials':
      return <Step3Materials />;
    case 'projectDetails':
      return <Step4ProjectDetails />;
    case 'contactInfo':
      return <Step5ContactInfo {...submissionProps} />;
    default:
      // If there's an invalid step ID or it's undefined, default to Property Type step
      console.warn(`Unknown step ID: ${currentStepId}, defaulting to Property Type step`);
      return <Step1PropertyType />;
  }
}
