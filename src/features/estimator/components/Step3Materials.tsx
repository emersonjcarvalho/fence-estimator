"use client";

import React from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator } from '../context/EstimatorContext';
import { MaterialType } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

export function Step3Materials() {
  const { formState, updateFormState, nextStep, errors, setErrors } = useEstimator();
  const [localError, setLocalError] = React.useState<string | null>(null);
  
  const materials: MaterialType[] = ['PVC', 'Wood', 'Aluminum', 'Chain Link', 'Other'];
  
  const toggleMaterial = (material: MaterialType) => {
    // Create a new array based on the current selection
    let newMaterials: MaterialType[];
    
    if (formState.materials.includes(material)) {
      // Remove the material if it's already selected
      newMaterials = formState.materials.filter(m => m !== material);
    } else {
      // Add the material if it's not already selected
      newMaterials = [...formState.materials, material];
    }
    
    // Update the form state
    updateFormState({ materials: newMaterials });
    
    // Clear any errors
    if (localError) {
      setLocalError(null);
    }
  };
  
  const handleNextStep = () => {
    // Validate that at least one material is selected
    if (formState.materials.length === 0) {
      setLocalError("Please select at least one material type");
      return;
    }
    
    // Clear errors and proceed to next step
    setLocalError(null);
    nextStep();
  };

  return (
    <FormLayout 
      title="What type of materials are you interested in?"
      subtitle="Select all that apply"
      characterSpeech="Different materials have different benefits and costs."
    >
      <div className="space-y-4">
        {materials.map((material) => (
          <button
            key={material}
            type="button"
            className={`w-full rounded-md p-4 text-left transition ${
              formState.materials.includes(material)
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-slate-50 hover:bg-slate-100'
            }`}
            onClick={() => toggleMaterial(material)}
          >
            <div className="flex items-center">
              <div className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                formState.materials.includes(material) ? 'bg-blue-500' : 'border border-slate-300'
              }`}>
                {formState.materials.includes(material) && (
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
              <span className="font-semibold">{material}</span>
            </div>
          </button>
        ))}
        
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
