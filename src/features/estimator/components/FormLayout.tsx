"use client";

import React, { ReactNode } from 'react';
import Image from 'next/image';
import { useEstimator } from '../context/EstimatorContext';

interface FormLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  characterSpeech?: string;
  showBackButton?: boolean;
  onSubmit?: () => void;
}

export function FormLayout({
  children,
  title,
  subtitle,
  characterSpeech,
  showBackButton = true,
  onSubmit,
}: FormLayoutProps) {
  const { prevStep, formState, totalSteps, isLastStep } = useEstimator();
  const progress = ((formState.currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center bg-slate-50 py-8">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        {/* Logo */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-blue-600 font-bold text-2xl">
            HomeBuddy<span className="text-orange-400">.</span>
            <div className="text-xs font-normal text-blue-600 uppercase">
              FOR HOMEOWNERS
            </div>
          </div>
          <button className="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-green-200 mb-6">
          <div
            className="h-1 bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Character with speech bubble (if provided) */}
        {characterSpeech && (
          <div className="relative mb-6 flex justify-end">
            <div className="absolute right-16 top-4 z-10 rounded-3xl border border-orange-200 bg-white p-4 shadow-sm">
              <p>{characterSpeech}</p>
            </div>
            <div className="relative h-32 w-32">
              <div className="h-32 w-32 rounded-full bg-blue-100">
                {/* Character image */}
                <div className="absolute bottom-0 right-0">
                  <svg 
                    width="130" 
                    height="130" 
                    viewBox="0 0 130 130" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="130" height="130" fill="none" />
                    <circle cx="65" cy="45" r="20" fill="#FFD7A8" /> {/* Face */}
                    <rect x="50" y="35" width="30" height="15" fill="#5D4037" /> {/* Cap */}
                    <rect x="45" y="45" width="40" height="5" fill="#2196F3" /> {/* Cap brim */}
                    <text x="60" y="43" fill="white" fontSize="14" fontWeight="bold">HB</text> {/* Cap text */}
                    <path d="M45 70 Q65 90 85 70" stroke="#5D4037" strokeWidth="8" fill="none" /> {/* Beard */}
                    <rect x="55" y="60" width="20" height="30" fill="white" /> {/* Shirt */}
                    <rect x="55" y="60" width="5" height="30" fill="#2196F3" /> {/* Overall strap */}
                    <rect x="75" y="60" width="5" height="30" fill="#2196F3" /> {/* Overall strap */}
                    <rect x="55" y="90" width="20" height="15" fill="#2196F3" /> {/* Overalls */}
                    <rect x="85" y="65" width="15" height="10" fill="#FF9800" /> {/* Clipboard */}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form title */}
        <h1 className="mb-4 text-center text-xl font-bold">{title}</h1>
        
        {/* Subtitle if provided */}
        {subtitle && (
          <p className="mb-6 text-center text-sm text-gray-500">{subtitle}</p>
        )}

        {/* Form content */}
        <div className="mb-6">{children}</div>
        


        {/* Back button (if enabled) */}
        {showBackButton && formState.currentStep > 0 && (
          <div className="mt-4 flex justify-center">
            <button
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
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center text-xs text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mr-2 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          Safe, Secure and Confidential
        </div>
      </div>
    </div>
  );
}
