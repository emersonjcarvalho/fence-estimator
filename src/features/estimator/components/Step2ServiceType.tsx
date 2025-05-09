"use client";

import React, { useState } from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator } from '../context/EstimatorContext';
import { ServiceType } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

export function Step2ServiceType() {
  const { formState, updateFormState, nextStep } = useEstimator();
  
  const handleOptionSelect = (option: ServiceType) => {
    updateFormState({ serviceType: option });
  };
  
  const [localError, setLocalError] = useState<string | null>(null);
  
  const handleNextStep = () => {
    if (formState.serviceType === 'Not sure') {
      setLocalError("Please select a service type");
      return;
    }
    
    setLocalError(null);
    nextStep();
  };

  return (
    <FormLayout 
      title="Which type of service do you need?"
      characterSpeech=""
    >
      <div className="space-y-4">
        <button
          className={`w-full rounded-md p-4 text-left transition ${
            formState.serviceType === 'New Installation'
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-slate-50 hover:bg-slate-100'
          }`}
          onClick={() => handleOptionSelect('New Installation')}
        >
          <div className="flex items-center">
            <div className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              formState.serviceType === 'New Installation' ? 'bg-blue-500' : 'border border-slate-300'
            }`}>
              {formState.serviceType === 'New Installation' && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </div>
            <div>
              <span className="font-semibold">New Installation</span>
              <p className="text-sm text-gray-500">Installing a new fence where none existed before</p>
            </div>
          </div>
        </button>

        <button
          className={`w-full rounded-md p-4 text-left transition ${
            formState.serviceType === 'Replacement'
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-slate-50 hover:bg-slate-100'
          }`}
          onClick={() => handleOptionSelect('Replacement')}
        >
          <div className="flex items-center">
            <div className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              formState.serviceType === 'Replacement' ? 'bg-blue-500' : 'border border-slate-300'
            }`}>
              {formState.serviceType === 'Replacement' && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </div>
            <div>
              <span className="font-semibold">Replacement</span>
              <p className="text-sm text-gray-500">Replacing an existing fence</p>
            </div>
          </div>
        </button>
        
        <button
          className={`w-full rounded-md p-4 text-left transition ${
            formState.serviceType === 'Repair'
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-slate-50 hover:bg-slate-100'
          }`}
          onClick={() => handleOptionSelect('Repair')}
        >
          <div className="flex items-center">
            <div className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              formState.serviceType === 'Repair' ? 'bg-blue-500' : 'border border-slate-300'
            }`}>
              {formState.serviceType === 'Repair' && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 text-white" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </div>
            <div>
              <span className="font-semibold">Repair</span>
              <p className="text-sm text-gray-500">Fixing an existing fence</p>
            </div>
          </div>
        </button>
        
        {/* Error message */}
        {localError && <ErrorMessage message={localError} />}
        
        {/* Next button */}
        <div className="pt-4">
          <button
            type="button"
            className="w-full rounded-md bg-orange-500 p-4 font-semibold text-white transition hover:bg-orange-600"
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      </div>
    </FormLayout>
  );
}
