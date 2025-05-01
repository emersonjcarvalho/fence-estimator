"use client";

import { supabase } from './client';

/**
 * Utility to check Supabase configuration and perform diagnostics
 * This can be called during app initialization to verify database access
 */
export async function checkSupabaseSetup(): Promise<{
  isConfigured: boolean;
  hasTable: boolean;
  hasRlsPolicy: boolean;
  error?: any;
}> {
  // Check if Supabase client is configured
  if (!supabase) {
    console.warn('Supabase client is not configured');
    return {
      isConfigured: false,
      hasTable: false,
      hasRlsPolicy: false
    };
  }
  
  try {
    // Check if we can connect to Supabase
    const { data: versionData, error: versionError } = await supabase.rpc('version');
    
    if (versionError) {
      console.error('Error connecting to Supabase:', versionError);
      return {
        isConfigured: true,
        hasTable: false,
        hasRlsPolicy: false,
        error: versionError
      };
    }
    
    console.log('Connected to Supabase version:', versionData);
    
    // Check if table exists by counting rows
    const { count, error: countError } = await supabase
      .from('fence_estimator')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.warn('Table check error:', countError);
      return {
        isConfigured: true,
        hasTable: false,
        hasRlsPolicy: false,
        error: countError
      };
    }
    
    console.log(`Table exists with ${count} rows`);
    
    // Check if we can insert a test record to verify RLS policy
    const testData = {
      full_name: 'Test User',
      email: 'test@example.com',
      existing_water_heater: 'Not sure',
      plumbingCondition: 'Not sure',
      project_type: 'Not sure',
      created_at: new Date().toISOString()
    };
    
    const { data: testInsert, error: insertError } = await supabase
      .from('fence_estimator')
      .insert([testData])
      .select()
      .single();
    
    if (insertError) {
      console.warn('RLS policy check error:', insertError);
      return {
        isConfigured: true,
        hasTable: true,
        hasRlsPolicy: false,
        error: insertError
      };
    }
    
    console.log('RLS policy allows anonymous inserts:', testInsert);
    
    // If we got here, everything is set up correctly
    return {
      isConfigured: true,
      hasTable: true,
      hasRlsPolicy: true
    };
  } catch (error) {
    console.error('Database setup check error:', error);
    return {
      isConfigured: true,
      hasTable: false,
      hasRlsPolicy: false,
      error
    };
  }
}
