"use client";

import { FormSubmissionData } from '@/lib/supabase/client';
import { submitFormToSupabase } from '@/lib/supabase/client';
import { 
  createSubmission, 
  getAllSubmissions, 
  getSubmissionById 
} from '../actions/formActions';

/**
 * Repository for estimator submissions
 * Provides a client-safe interface to server actions
 */
export class EstimatorRepository {
  /**
   * Create a new estimator submission in the database
   */
  static async createSubmission(data: FormSubmissionData) {
    try {
      return await createSubmission(data);
    } catch (error: any) {
      console.error('Error in EstimatorRepository.createSubmission:', error);
      
      // Fallback to direct Supabase API calls if server action fails
      try {
        console.warn('Server action failed, using Supabase fallback');
        return await submitFormToSupabase(data);
      } catch (fallbackError: any) {
        return {
          success: false,
          error: fallbackError,
          message: `Submission failed: ${fallbackError.message || 'Unknown error'}`
        };
      }
    }
  }

  /**
   * Get all estimator submissions
   */
  static async getAllSubmissions() {
    try {
      return await getAllSubmissions();
    } catch (error: any) {
      console.error('Error in EstimatorRepository.getAllSubmissions:', error);
      return {
        success: false,
        error,
        message: `Failed to fetch submissions: ${error.message || 'Unknown error'}`
      };
    }
  }

  /**
   * Get a submission by ID
   */
  static async getSubmissionById(id: number) {
    try {
      return await getSubmissionById(id);
    } catch (error: any) {
      console.error(`Error in EstimatorRepository.getSubmissionById(${id}):`, error);
      return {
        success: false,
        error,
        message: `Failed to fetch submission: ${error.message || 'Unknown error'}`
      };
    }
  }
}
