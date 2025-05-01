"use client";

import React from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator, ShowerIssue } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

export function Step2ShowerIssues({ onSubmit, isSubmitting }: { onSubmit?: () => void, isSubmitting?: boolean } = {}) {
  const { formState, updateFormState, nextStep, errors, setErrors } = useEstimator();
  
  const toggleIssue = (issue: ShowerIssue) => {
    let updatedIssues: ShowerIssue[];
    
    // Handle special case for 'None'
    if (issue === 'None') {
      // If 'None' is selected, clear all other selections
      updatedIssues = formState.showerIssues.includes('None') ? [] : ['None'];
    } else {
      // If any other option is selected, remove 'None' if it exists
      if (formState.showerIssues.includes(issue)) {
        // Remove the issue if it's already selected
        updatedIssues = formState.showerIssues.filter(i => i !== issue);
      } else {
        // Add the issue and remove 'None' if it exists
        updatedIssues = [
          ...formState.showerIssues.filter(i => i !== 'None'),
          issue
        ];
      }
    }
    
    updateFormState({ showerIssues: updatedIssues });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing errors
    setErrors([]);
    
    // Validate selection
    if (formState.showerIssues.length === 0) {
      setErrors([{
        field: 'showerIssues',
        message: 'Please select at least one option'
      }]);
      return;
    }
    
    // If this is the last step and onSubmit is provided, submit the form
    if (onSubmit) {
      onSubmit();
    } else {
      // Otherwise go to the next step
      nextStep();
    }
  };
  
  const getErrorMessage = (): string | undefined => {
    const error = errors.find(err => err.field === 'showerIssues');
    return error?.message;
  };

  const isSelected = (issue: ShowerIssue) => formState.showerIssues.includes(issue);

  return (
    <FormLayout title="Are there issues with the current shower/tub?" subtitle="Pick all that apply.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => toggleIssue('Lack of space')}
            className={`flex flex-col items-center justify-center rounded-md border p-4 transition ${
              isSelected('Lack of space')
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className={`mb-2 text-2xl ${isSelected('Lack of space') ? 'text-orange-500' : 'text-orange-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </div>
            <span>Lack of space</span>
          </button>

          <button
            type="button"
            onClick={() => toggleIssue('Hard to enter/exit')}
            className={`flex flex-col items-center justify-center rounded-md border p-4 transition ${
              isSelected('Hard to enter/exit')
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className={`mb-2 text-2xl ${isSelected('Hard to enter/exit') ? 'text-orange-500' : 'text-orange-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span>Hard to enter/exit</span>
          </button>

          <button
            type="button"
            onClick={() => toggleIssue('Inaccessible controls')}
            className={`flex flex-col items-center justify-center rounded-md border p-4 transition ${
              isSelected('Inaccessible controls')
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className={`mb-2 text-2xl ${isSelected('Inaccessible controls') ? 'text-orange-500' : 'text-orange-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <span>Inaccessible controls</span>
          </button>

          <button
            type="button"
            onClick={() => toggleIssue('High threshold')}
            className={`flex flex-col items-center justify-center rounded-md border p-4 transition ${
              isSelected('High threshold')
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className={`mb-2 text-2xl ${isSelected('High threshold') ? 'text-orange-500' : 'text-orange-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <span>High threshold</span>
          </button>

          <button
            type="button"
            onClick={() => toggleIssue('Other/not sure')}
            className={`flex flex-col items-center justify-center rounded-md border p-4 transition ${
              isSelected('Other/not sure')
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className={`mb-2 text-2xl ${isSelected('Other/not sure') ? 'text-orange-500' : 'text-orange-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Other/not sure</span>
          </button>

          <button
            type="button"
            onClick={() => toggleIssue('None')}
            className={`flex flex-col items-center justify-center rounded-md border p-4 transition ${
              isSelected('None')
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className={`mb-2 text-2xl ${isSelected('None') ? 'text-orange-500' : 'text-orange-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span>None</span>
          </button>
        </div>

        <ErrorMessage message={getErrorMessage()} />
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-orange-500 p-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {onSubmit 
              ? (isSubmitting ? "Submitting..." : "Submit") 
              : "Next"
            }
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
