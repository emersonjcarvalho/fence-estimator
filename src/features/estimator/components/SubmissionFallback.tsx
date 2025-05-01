"use client";

import React from 'react';
import { EstimatorFormState } from '../context/EstimatorContext';

interface SubmissionFallbackProps {
  formData: EstimatorFormState;
  onClose: () => void;
}

/**
 * A development-only component that displays form data when Supabase
 * submission fails or is not configured. Helps with debugging and testing.
 */
export function SubmissionFallback({ formData, onClose }: SubmissionFallbackProps) {
  // Only show in development environment
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="relative rounded-lg bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Form Submission Data</h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-4 rounded-md bg-blue-50 p-4 text-sm text-blue-700">
        <div className="flex items-center">
          <svg className="mr-2 h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>
            <strong>Development Mode:</strong> Actual database submission is disabled.
            Below is the data that would be sent to Supabase.
          </p>
        </div>
      </div>
      
      <div className="mb-6 max-h-64 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-4">
        <pre className="text-xs text-gray-700">{JSON.stringify(formData, null, 2)}</pre>
      </div>
      
      <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-700">
        <div className="flex">
          <svg className="mr-2 h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium">To enable Supabase:</p>
            <ol className="mt-1 list-decimal pl-5">
              <li>Create a Supabase project at <a href="https://supabase.com" className="font-medium underline" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
              <li>Add your project URL and anon key to <code className="font-mono">.env.local</code></li>
              <li>Run the SQL setup script from <code className="font-mono">supabase-schema.sql</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
