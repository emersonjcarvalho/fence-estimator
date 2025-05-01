"use client";

import React from 'react';
import { useEstimator } from '../context/EstimatorContext';

export function BackButton() {
  const { prevStep } = useEstimator();

  return (
    <button
      type="button"
      onClick={prevStep}
      className="flex items-center justify-center text-sm text-gray-500 hover:text-gray-700"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="mr-1 h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      Back
    </button>
  );
}
