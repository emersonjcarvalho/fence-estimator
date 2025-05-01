"use client";

import React from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator, PlumbingCondition } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

export function Step4PlumbingCondition({ onSubmit, isSubmitting }: { onSubmit?: () => void, isSubmitting?: boolean } = {}) {
  const { formState, updateFormState, nextStep, errors, setErrors } = useEstimator();
  
  const handleSelect = (condition: PlumbingCondition) => {
    updateFormState({ plumbingCondition: condition });
    // Clear any existing errors when a selection is made
    setErrors([]);
  };
  
  const getErrorMessage = (): string | undefined => {
    const error = errors.find(err => err.field === 'plumbingCondition');
    return error?.message;
  };
  
  const getOptionClassName = (isSelected: boolean) => {
    return `flex w-full items-center justify-between rounded-md border p-4 transition ${
      isSelected 
        ? "border-orange-400 bg-orange-50" 
        : "border-gray-200 hover:border-orange-300"
    }`;
  };

  return (
    <FormLayout title="What is the condition of the existing plumbing?">
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => handleSelect('Good')}
          className={getOptionClassName(formState.plumbingCondition === 'Good')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span>Good</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('Fair')}
          className={getOptionClassName(formState.plumbingCondition === 'Fair')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <span>Fair</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('Poor')}
          className={getOptionClassName(formState.plumbingCondition === 'Poor')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span>Poor</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('Not sure')}
          className={getOptionClassName(formState.plumbingCondition === 'Not sure')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span>Not sure</span>
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
