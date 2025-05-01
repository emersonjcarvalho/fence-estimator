"use client";

import React from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator, ProjectType } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

export function Step6ProjectType({ onSubmit, isSubmitting }: { onSubmit?: () => void, isSubmitting?: boolean } = {}) {
  const { formState, updateFormState, nextStep, errors, setErrors } = useEstimator();
  
  const handleSelect = (type: ProjectType) => {
    updateFormState({ projectType: type });
    // Clear any existing errors when a selection is made
    setErrors([]);
  };
  
  const getErrorMessage = (): string | undefined => {
    const error = errors.find(err => err.field === 'projectType');
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
    <FormLayout 
      title="Describe your project:" 
      characterSpeech="Let's get started on your walk-in shower estimate!"
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => handleSelect('Tub to walk-in shower')}
          className={getOptionClassName(formState.projectType === 'Tub to walk-in shower')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v6H3V3zm0 12h18v6H3v-6zm0-6h18v6H3V9z" />
              </svg>
            </div>
            <span>Tub to walk-in shower</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('Shower to walk-in shower')}
          className={getOptionClassName(formState.projectType === 'Shower to walk-in shower')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span>Shower to walk-in shower</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('Not sure')}
          className={getOptionClassName(formState.projectType === 'Not sure')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
