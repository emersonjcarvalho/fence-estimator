"use client";

import React, { useState } from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

export function Step1UserInfo({ onSubmit, isSubmitting }: { onSubmit?: () => void, isSubmitting?: boolean } = {}) {
  const { formState, updateFormState, nextStep, errors, setErrors } = useEstimator();
  const [localErrors, setLocalErrors] = useState<{
    fullName?: string;
    email?: string;
  }>({});
  
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors([]);
    const newLocalErrors: {
      fullName?: string;
      email?: string;
    } = {};
    
    // Validate inputs
    if (!formState.fullName.trim()) {
      newLocalErrors.fullName = "Name is required";
    }
    
    if (!formState.email.trim()) {
      newLocalErrors.email = "Email is required";
    } else if (!validateEmail(formState.email)) {
      newLocalErrors.email = "Please enter a valid email address";
    }
    
    // If there are validation errors, show them
    if (Object.keys(newLocalErrors).length > 0) {
      setLocalErrors(newLocalErrors);
      return;
    }
    
    // Clear local errors
    setLocalErrors({});
    
    // If it's the last step and onSubmit is provided, submit the form
    if (onSubmit) {
      onSubmit();
    } else {
      // Otherwise, go to the next step
      nextStep();
    }
  };

  const { isLastStep } = useEstimator();
  const isLastStepValue = isLastStep();
  const buttonText = isLastStepValue ? (isSubmitting ? "Submitting..." : "Submit") : "Next";
  const title = "Who should I prepare this estimate for?";
  const characterSpeech = isLastStepValue ? "Final step - just need your contact info!" : undefined;

  return (
    <FormLayout 
      title={title} 
      characterSpeech={characterSpeech}
      showBackButton={true}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full name"
            className={`w-full rounded-md bg-slate-50 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              localErrors.fullName ? 'border-2 border-red-500' : ''
            }`}
            value={formState.fullName}
            onChange={(e) => {
              updateFormState({ fullName: e.target.value });
              if (localErrors.fullName) {
                setLocalErrors({...localErrors, fullName: undefined});
              }
            }}
          />
          {localErrors.fullName && <ErrorMessage message={localErrors.fullName} />}
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email address"
            className={`w-full rounded-md bg-slate-50 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              localErrors.email ? 'border-2 border-red-500' : ''
            }`}
            value={formState.email}
            onChange={(e) => {
              updateFormState({ email: e.target.value });
              if (localErrors.email) {
                setLocalErrors({...localErrors, email: undefined});
              }
            }}
          />
          {localErrors.email && <ErrorMessage message={localErrors.email} />}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-orange-500 p-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {buttonText}
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
