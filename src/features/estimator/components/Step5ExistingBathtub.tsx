"use client";

import React from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

export function Step5ExistingBathtub({ onSubmit, isSubmitting }: { onSubmit?: () => void, isSubmitting?: boolean } = {}) {
  const { formState, updateFormState, nextStep, errors, setErrors, validateCurrentStep } = useEstimator();
  
  const handleSelect = (hasExisting: boolean) => {
    updateFormState({ hasExistingBathtub: hasExisting });
    // Clear any existing errors when a selection is made
    setErrors([]);
  };
  
  const getErrorMessage = (): string | undefined => {
    const error = errors.find(err => err.field === 'hasExistingBathtub');
    return error?.message;
  };
  
  const getOptionClassName = (isSelected: boolean) => {
    return `flex w-full items-center justify-center rounded-md border p-4 transition ${
      isSelected 
        ? "border-orange-400 bg-orange-50" 
        : "border-gray-200 hover:border-orange-300"
    }`;
  };

  return (
    <FormLayout title="Is there an existing full-size bathtub or shower to be replaced?">
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => handleSelect(true)}
          className={getOptionClassName(formState.hasExistingBathtub === true)}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Yes</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect(false)}
          className={getOptionClassName(formState.hasExistingBathtub === false)}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span>No</span>
          </div>
        </button>
        
        <ErrorMessage message={getErrorMessage()} />
      </div>

      <div className="pt-8">
        <button
          type="button"
          onClick={onSubmit || nextStep}
          className="w-full rounded-md bg-orange-200 p-4 font-semibold text-orange-600 transition hover:bg-orange-300 disabled:opacity-70"
          disabled={isSubmitting}
        >
          {onSubmit 
            ? (isSubmitting ? "Submitting..." : "Submit") 
            : "Next"
          }
        </button>
      </div>
    </FormLayout>
  );
}
