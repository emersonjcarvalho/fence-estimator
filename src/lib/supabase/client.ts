"use client";

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate Supabase configuration
const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

// Log configuration status (client-side only)
if (typeof window !== 'undefined') {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not properly configured. Please check your .env.local file.');
  } else {
    console.log('Supabase configuration detected:', { url: supabaseUrl });
  }
}

// Create a single supabase client for the entire app with additional options for better debugging
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
      // Add additional debug options in development
      ...(process.env.NODE_ENV === 'development' ? {
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'X-Client-Info': 'home-service-estimator',
          },
        },
      } : {})
    })
  : null;

// Type definition for the form data structure
export type FormSubmissionData = {
  // Contact information
  full_name: string;
  email: string;
  phone: string;
  address: string;
  zip_code: string;
  
  // Project details
  property_type: string;
  service_type: string;
  materials: string[];
  project_details: string;
  
  // Timestamp (optional, set by the database)
  created_at?: string;
};

// Function to submit form data to Supabase
export async function submitFormToSupabase(data: FormSubmissionData) {
  try {
    // Check if Supabase client is initialized
    if (!supabase) {
      console.log('Form submitted without Supabase configuration. Logging data locally instead.');
      
      // Log the data to console for development and testing
      console.log('Form data that would be submitted:', data);
      
      // In a real application, you might want to store this in localStorage or
      // show a message to the user that their data couldn't be saved to the database
      return { 
        success: true, 
        data: null,
        message: 'Supabase is not configured, but your information has been received.' 
      };
    }
    
    // Prepare submission data
    const submissionData: Record<string, any> = {
      // Contact information
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      
      // Project details
      property_type: data.property_type,
      service_type: data.service_type,
      materials: data.materials,
      project_details: data.project_details,
      
      // Timestamp
      created_at: new Date().toISOString()
    };
    
    // Only include zip_code if it's provided
    if (data.zip_code) {
      submissionData.zip_code = data.zip_code;
    }
    
    console.log('Submitting to Supabase:', submissionData);
    
    try {
      // First check if the table exists by querying it
      const { error: tableCheckError } = await supabase
        .from('fence_estimator')
        .select('count', { count: 'exact', head: true });
      
      if (tableCheckError) {
        // Check if it's an RLS policy error
        if (tableCheckError.message?.includes('policy') || tableCheckError.message?.includes('permission')) {
          console.error('Row Level Security error:', tableCheckError);
          return { 
            success: false, 
            error: tableCheckError,
            message: 'Database error: Row-Level Security policy is preventing data insertion. Please run the fix-rls.sql script in Supabase SQL Editor.'
          };
        }
        
        // If the table doesn't exist, show a helpful message
        console.error('Table check error:', tableCheckError);
        return { 
          success: false, 
          error: tableCheckError,
          message: 'The database table "fence_estimator" does not exist. Please follow the setup instructions in SUPABASE_SETUP.md.'
        };
      }
      
      // Try a direct insert with debug information
      console.log('Attempting insert with the following data:', submissionData);
      
      try {
        // First, try insert with more detailed error handling and without select
        const insertResponse = await supabase
          .from('fence_estimator')
          .insert([submissionData])
          .select();
        
        console.log('Insert response:', insertResponse);
        
        if (insertResponse.error) {
          console.error('Detailed insert error:', {
            message: insertResponse.error.message,
            details: insertResponse.error.details,
            hint: insertResponse.error.hint,
            code: insertResponse.error.code
          });
          
          // Check for RLS policy violation
          if (insertResponse.error.message?.includes('policy') || 
              insertResponse.error.message?.includes('permission') || 
              insertResponse.error.message?.includes('row-level security')) {
            
            // Log for debugging
            console.log('RLS error detected. Database configuration status:', {
              url: supabaseUrl.slice(0, 20) + '...',
              keyLength: supabaseAnonKey?.length || 0,
              anonymousRole: 'anon'
            });
            
            return { 
              success: false, 
              error: insertResponse.error,
              message: `Database error: ${insertResponse.error.message} - Please run the full supabase-fix-rls-complete.sql script in your Supabase SQL Editor.`
            };
          }
          
          // For any other error
          throw insertResponse.error;
        }
        
        return { 
          success: true, 
          data: insertResponse.data,
          message: 'Your estimate request has been submitted successfully!'
        };
        
      } catch (insertError: any) {
        console.error('Insert exception:', insertError);
        return { 
          success: false, 
          error: insertError,
          message: `Database operation failed: ${insertError.message || 'Unknown error'}`
        };
      }

      // This block is unreachable as we already returned from the try/catch above
      // Removing it as it references an undefined variable
    } catch (dbError: any) {
      console.error('Database operation error:', dbError);
      return { 
        success: false, 
        error: dbError,
        message: `Database error: ${dbError.message || 'Unknown error'}`
      };
    }
  } catch (error: any) {
    console.error('Error submitting form to Supabase:', error);
    return { 
      success: false, 
      error,
      message: `Submission error: ${error.message || 'Unknown error'}`
    };
  }
}
