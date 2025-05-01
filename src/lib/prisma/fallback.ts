"use client";

import { FormSubmissionData, submitFormToSupabase } from '@/lib/supabase/client';

/**
 * Fallback for database operations when Prisma is not properly configured
 * Uses the legacy Supabase direct calls as a fallback
 */
export class PrismaFallback {
  /**
   * Check if Prisma appears to be configured
   * @returns Boolean indicating if Prisma seems to be configured
   */
  static isPrismaConfigured(): boolean {
    return typeof process !== 'undefined' && !!process.env.DATABASE_URL;
  }

  /**
   * Fallback method to submit form data using direct Supabase calls
   * @param data The form submission data
   * @returns The submission result
   */
  static async submitFormFallback(data: FormSubmissionData) {
    console.log('Using Supabase fallback for form submission:', data);
    
    try {
      return await submitFormToSupabase(data);
    } catch (error: any) {
      console.error('Error in Supabase fallback submission:', error);
      
      return {
        success: false,
        error,
        message: `Fallback submission error: ${error.message || 'Unknown error'}`
      };
    }
  }

  /**
   * Log a warning about missing Prisma configuration
   */
  static logConfigurationWarning() {
    if (typeof window !== 'undefined') {
      console.warn(
        'Prisma ORM is not properly configured. Using Supabase direct calls as fallback. ' +
        'Please ensure DATABASE_URL is set in your .env file.'
      );
    }
  }
}
