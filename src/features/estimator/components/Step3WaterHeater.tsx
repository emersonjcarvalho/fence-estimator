"use client";

import React from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator, WaterHeaterType } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

export function Step3WaterHeater({ onSubmit, isSubmitting }: { onSubmit?: () => void, isSubmitting?: boolean } = {}) {
  const { formState, updateFormState, nextStep, errors, setErrors } = useEstimator();
  
  const handleSelect = (type: WaterHeaterType) => {
    updateFormState({ existingWaterHeater: type });
    // Clear any existing errors when a selection is made
    setErrors([]);
  };
  
  const getErrorMessage = (): string | undefined => {
    const error = errors.find(err => err.field === 'existingWaterHeater');
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
    <FormLayout title="What type of water heating system is currently installed?">
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => handleSelect('Storage tank water heater')}
          className={getOptionClassName(formState.existingWaterHeater === 'Storage tank water heater')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span>Storage tank water heater</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('Tankless water heater')}
          className={getOptionClassName(formState.existingWaterHeater === 'Tankless water heater')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span>Tankless water heater</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('Solar water heater')}
          className={getOptionClassName(formState.existingWaterHeater === 'Solar water heater')}
        >
          <div className="flex items-center">
            <div className="mr-4 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span>Solar water heater</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('Not sure')}
          className={getOptionClassName(formState.existingWaterHeater === 'Not sure')}
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
