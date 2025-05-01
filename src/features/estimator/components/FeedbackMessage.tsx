"use client";

import React from 'react';

interface FeedbackMessageProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

export function FeedbackMessage({ type, message, onClose }: FeedbackMessageProps) {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
  
  // Check if it's a Supabase-specific error
  const isSupabaseSetupError = message.includes('fence_estimator') || 
                               message.includes('database table') || 
                               message.includes('Supabase');
                               
  // Check if it's specifically an RLS error
  const isRlsError = message.includes('policy') || 
                     message.includes('row-level security') || 
                     message.includes('permission');
  
  return (
    <div className={`mb-4 rounded-md ${bgColor} p-4 shadow-sm`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <svg className={`h-5 w-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className={`h-5 w-5 ${iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          
          {/* Specific guidance for RLS errors */}
          {type === 'error' && isRlsError && (
            <div className="mt-2 text-xs">
              <p className={`${textColor} font-medium`}>Row Level Security Error:</p>
              <ol className="list-decimal pl-5 pt-1">
                <li>Go to your Supabase SQL Editor</li>
                <li>Run the <strong>complete</strong> SQL script from supabase-fix-rls-complete.sql</li>
                <li>This comprehensive script fixes all RLS policy issues</li>
                <li>Refresh this page and try submitting again</li>
                <li>For detailed instructions, see the SUPABASE_QUICK_FIX.md file</li>
              </ol>
            </div>
          )}
          
          {/* General Supabase setup errors (not RLS-specific) */}
          {type === 'error' && isSupabaseSetupError && !isRlsError && (
            <div className="mt-2 text-xs">
              <p className={`${textColor} font-medium`}>Developer Setup Required:</p>
              <ol className="list-decimal pl-5 pt-1">
                <li>Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local</li>
                <li>Make sure the Supabase project is running and accessible</li>
                <li>Run the SQL setup script from supabase-schema.sql to create the required table</li>
                <li>See SUPABASE_SETUP.md for detailed instructions</li>
              </ol>
            </div>
          )}
          
          {/* Generic instructions for end users on error */}
          {type === 'error' && !isSupabaseSetupError && (
            <p className={`mt-1 text-xs ${textColor}`}>
              Please try again or contact support if the issue persists.
            </p>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${iconColor} hover:${bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
