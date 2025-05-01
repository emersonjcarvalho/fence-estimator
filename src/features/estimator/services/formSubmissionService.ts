"use client";

import { EstimatorFormState } from '../context/EstimatorContext';
import { FormSubmissionData } from '@/lib/supabase/client';
import { EstimatorRepository } from '../repositories/estimatorRepository';

/**
 * Converts the form state to the format expected by the repository layer
 */
export function mapFormStateToSubmissionData(formState: EstimatorFormState): FormSubmissionData {
  return {
    // Contact info
    full_name: formState.fullName,
    email: formState.email,
    phone: formState.phone,
    address: formState.address,
    zip_code: formState.zipCode,
    
    // Service details
    property_type: formState.propertyType,
    service_type: formState.serviceType,
    materials: formState.materials,
    project_details: formState.projectDetails
  };
}

/**
 * Handles form submission using the repository layer
 */
export async function handleFormSubmission(formState: EstimatorFormState): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check if we have the minimum required fields
    if (!formState.fullName.trim() || !formState.email.trim()) {
      return {
        success: false,
        message: 'Please provide your name and email to submit the estimate request.'
      };
    }
    
    // Map form state to submission data
    const submissionData = mapFormStateToSubmissionData(formState);
    
    // Log for debugging
    console.log('Preparing form data for submission:', submissionData);
    
    // Submit via EstimatorRepository
    const result = await EstimatorRepository.createSubmission(submissionData);
    
    // Check for result
    if (!result.success) {
      // Use the message from the repository if available
      const errorMessage = result.message || 'Failed to submit form data to database';
      console.error('Submission error:', errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    }
    
    // Success - use the message from the repository if available or default
    return {
      success: true,
      message: result.message || 'Thank you! Your estimate request has been submitted. Our team will contact you shortly.'
    };
  } catch (error: any) {
    console.error('Error in form submission process:', error);
    
    return {
      success: false,
      message: `There was an error submitting your request: ${error.message || 'Unknown error'}`
    };
  }
}
