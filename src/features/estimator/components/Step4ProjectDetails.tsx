"use client";

import React from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator } from '../context/EstimatorContext';

export function Step4ProjectDetails() {
  const { formState, updateFormState, nextStep } = useEstimator();
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormState({ projectDetails: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <FormLayout 
      title="Any other details you'd like to share about the project?"
      subtitle="Optional"
      characterSpeech=""
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            className="w-full rounded-md bg-slate-50 p-4 min-h-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Project details, specific requirements, questions, or concerns..."
            value={formState.projectDetails}
            onChange={handleTextChange}
            rows={5}
          />
          <p className="mt-2 text-xs text-gray-500">
            {formState.projectDetails.length}/1000 characters
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-orange-500 p-4 font-semibold text-white transition hover:bg-orange-600"
          >
            Next
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
