"use client";

import React, { useState, useEffect } from 'react';
import { useEstimator } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';
import { FeedbackMessage } from './FeedbackMessage';
import { handleFormSubmission } from '../services/formSubmissionService';

export function Step7ZipCode() {
  const { formState, updateFormState, resetForm, errors, setErrors } = useEstimator();
  const [zipCode, setZipCode] = useState(formState.zipCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Keep zipCode state in sync with formState
  useEffect(() => {
    setZipCode(formState.zipCode);
  }, [formState.zipCode]);
  
  const validateZipCode = (zip: string): boolean => {
    return /^\d{5}$/.test(zip);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ZIP code
    if (!zipCode || !validateZipCode(zipCode)) {
      setLocalError("Please enter a valid 5-digit ZIP code");
      return;
    }
    
    setIsSubmitting(true);
    
    // Update the form state with the ZIP code
    updateFormState({ zipCode });
    
    try {
      // Submit the form data to Supabase
      const result = await handleFormSubmission(formState);
      
      setFeedback({
        type: result.success ? 'success' : 'error',
        message: result.message
      });
      
      if (result.success) {
        // On success, reset the form after a delay to show the success message
        setTimeout(() => {
          resetForm();
        }, 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFeedback({
        type: 'error',
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    if (localError) {
      setLocalError(undefined);
    }
  };
  
  const clearFeedback = () => {
    setFeedback(null);
  };

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center bg-blue-600 py-8">
      <div className="mx-auto w-full max-w-3xl p-6">
        {/* Logo */}
        <div className="mb-6 flex justify-between">
          <div className="text-white font-bold text-2xl">
            HomeBuddy<span className="text-orange-400">.</span>
            <div className="text-xs font-normal text-white uppercase">
              FOR HOMEOWNERS
            </div>
          </div>
          <div className="text-white">
            I'm a contractor
          </div>
        </div>

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">
            How Much Does It Cost To Install A Walk-In Shower In Your Location?
          </h1>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative h-48 w-48 mb-8">
            <svg 
              width="150" 
              height="150" 
              viewBox="0 0 150 150" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="150" height="150" fill="none" />
              <circle cx="75" cy="45" r="20" fill="#FFD7A8" /> {/* Face */}
              <rect x="60" y="35" width="30" height="15" fill="#5D4037" /> {/* Cap */}
              <rect x="55" y="45" width="40" height="5" fill="#2196F3" /> {/* Cap brim */}
              <text x="70" y="43" fill="white" fontSize="14" fontWeight="bold">HB</text> {/* Cap text */}
              <path d="M55 70 Q75 90 95 70" stroke="#5D4037" strokeWidth="8" fill="none" /> {/* Beard */}
              <rect x="65" y="60" width="20" height="30" fill="white" /> {/* Shirt */}
              <rect x="65" y="60" width="5" height="30" fill="#2196F3" /> {/* Overall strap */}
              <rect x="80" y="60" width="5" height="30" fill="#2196F3" /> {/* Overall strap */}
              <rect x="60" y="90" width="30" height="25" fill="#2196F3" /> {/* Overalls */}
              <rect x="60" y="115" width="12" height="15" fill="#795548" /> {/* Left leg */}
              <rect x="78" y="115" width="12" height="15" fill="#795548" /> {/* Right leg */}
              <rect x="100" y="65" width="15" height="10" fill="#FF9800" /> {/* Tool */}
              <rect x="45" y="85" width="15" height="25" fill="#FF9800" /> {/* Toolbox */}
            </svg>
          </div>

          <h2 className="text-xl font-bold text-white mb-8">
            What Is Your ZIP Code?
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            {feedback && (
              <div className="mb-4">
                <FeedbackMessage 
                  type={feedback.type} 
                  message={feedback.message} 
                  onClose={clearFeedback}
                />
              </div>
            )}
            <div className="flex gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Enter ZIP Code"
                  className={`w-full rounded-lg border-2 ${
                    localError 
                      ? 'border-red-500' 
                      : 'border-white/20'
                  } bg-white p-4 pl-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  maxLength={5}
                  inputMode="numeric"
                  disabled={isSubmitting}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                {localError && <ErrorMessage message={localError} />}
              </div>
              <button
                type="submit"
                className="rounded-lg bg-orange-500 px-6 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Get estimate'}
              </button>
            </div>
            <p className="mt-4 text-center text-white/80 text-sm">
              Free, no-obligation estimates.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
