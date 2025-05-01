"use client";

import React, { useState } from 'react';
import { FormLayout } from './FormLayout';
import { useEstimator } from '../context/EstimatorContext';
import { ErrorMessage } from './ErrorMessage';

interface LocalErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  zipCode?: string;
}

export function Step5ContactInfo({ onSubmit, isSubmitting }: { onSubmit?: () => void, isSubmitting?: boolean } = {}) {
  const { formState, updateFormState, nextStep, errors, setErrors, isLastStep } = useEstimator();
  const [localErrors, setLocalErrors] = useState<LocalErrors>({});
  
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const validatePhone = (phone: string): boolean => {
    return /^[0-9()-.\s]{10,}$/.test(phone);
  };
  
  const validateZipCode = (zipCode: string): boolean => {
    return /^\d{5}$/.test(zipCode);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors([]);
    const newLocalErrors: LocalErrors = {};
    
    // Validate inputs
    if (!formState.fullName.trim()) {
      newLocalErrors.fullName = "Name is required";
    }
    
    if (!formState.email.trim()) {
      newLocalErrors.email = "Email is required";
    } else if (!validateEmail(formState.email)) {
      newLocalErrors.email = "Please enter a valid email address";
    }
    
    if (!formState.phone.trim()) {
      newLocalErrors.phone = "Phone number is required";
    } else if (!validatePhone(formState.phone)) {
      newLocalErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formState.address.trim()) {
      newLocalErrors.address = "Address is required";
    }
    
    if (!formState.zipCode.trim()) {
      newLocalErrors.zipCode = "ZIP code is required";
    } else if (!validateZipCode(formState.zipCode)) {
      newLocalErrors.zipCode = "Please enter a valid 5-digit ZIP code";
    }
    
    // If there are validation errors, show them
    if (Object.keys(newLocalErrors).length > 0) {
      setLocalErrors(newLocalErrors);
      return;
    }
    
    // Clear local errors
    setLocalErrors({});
    
    // If it's the last step and onSubmit is provided, submit the form
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleInputChange = (field: keyof LocalErrors, value: string) => {
    updateFormState({ [field]: value } as any);
    
    // Clear error for this field if it exists
    if (localErrors[field]) {
      setLocalErrors({...localErrors, [field]: undefined});
    }
  };

  const isLastStepValue = isLastStep();
  const buttonText = isLastStepValue ? (isSubmitting ? "Submitting..." : "Submit") : "Next";
  const title = "Contact Information";
  const characterSpeech = "Final step - just need your contact info!";

  return (
    <FormLayout 
      title={title} 
      characterSpeech={characterSpeech}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full name"
            className={`w-full rounded-md bg-slate-50 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              localErrors.fullName ? 'border-2 border-red-500' : ''
            }`}
            value={formState.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
          {localErrors.fullName && <ErrorMessage message={localErrors.fullName} />}
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email address"
            className={`w-full rounded-md bg-slate-50 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              localErrors.email ? 'border-2 border-red-500' : ''
            }`}
            value={formState.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          {localErrors.email && <ErrorMessage message={localErrors.email} />}
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="Phone number"
            className={`w-full rounded-md bg-slate-50 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              localErrors.phone ? 'border-2 border-red-500' : ''
            }`}
            value={formState.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          {localErrors.phone && <ErrorMessage message={localErrors.phone} />}
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Address"
            className={`w-full rounded-md bg-slate-50 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              localErrors.address ? 'border-2 border-red-500' : ''
            }`}
            value={formState.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
          {localErrors.address && <ErrorMessage message={localErrors.address} />}
        </div>
        
        <div>
          <input
            type="text"
            placeholder="ZIP code"
            className={`w-full rounded-md bg-slate-50 p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              localErrors.zipCode ? 'border-2 border-red-500' : ''
            }`}
            value={formState.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            maxLength={5}
          />
          {localErrors.zipCode && <ErrorMessage message={localErrors.zipCode} />}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-orange-500 p-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {buttonText}
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
