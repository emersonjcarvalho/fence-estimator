"use client";

/**
 * Database utility module
 * Centralizes database access and provides helper functions
 */

import { prisma } from '@/lib/prisma/client';

/**
 * Type for database operation results
 */
export type DbResult<T> = {
  success: boolean;
  data?: T;
  error?: Error | unknown;
  message?: string;
  usingFallback?: boolean;
};

/**
 * Database utility class
 * Provides helper methods for common database operations with error handling
 */
export class Database {
  /**
   * Check if database configuration is complete
   */
  static isDatabaseConfigured(): boolean {
    return typeof process !== 'undefined' && !!process.env.DATABASE_URL;
  }
  
  /**
   * Get database configuration information
   */
  static getDatabaseConfig(): Record<string, string> {
    const databaseUrl = process.env.DATABASE_URL || 'Not set';
    
    // Mask the password in the URL for display
    const maskedUrl = databaseUrl.replace(/:[^:@]+@/, ':****@');
    
    return {
      url: maskedUrl
    };
  }

  /**
   * Safely execute a database operation with error handling
   * @param operation The database operation to execute
   * @returns The result of the operation wrapped in a DbResult
   */
  static async executeOperation<T>(
    operation: () => Promise<T>
  ): Promise<DbResult<T>> {
    try {
      // Check if Prisma is configured
      if (!prisma) {
        return {
          success: false,
          message: 'Database is not properly configured',
          usingFallback: true,
        };
      }

      // Execute the operation
      const result = await operation();
      
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error('Database operation error:', error);
      
      // Check if this is a connection error
      if (error.message?.includes('P1000') || 
          error.message?.includes('P1001') || 
          error.message?.includes('P1003') || 
          error.message?.includes('connection')) {
        return {
          success: false,
          error,
          message: `Database connection error: ${error.message}`,
          usingFallback: true,
        };
      }
      
      return {
        success: false,
        error,
        message: `Database error: ${error.message || 'Unknown error'}`,
      };
    }
  }

  /**
   * Check if the database connection is working
   * @returns A boolean indicating if the connection is working
   */
  static async testConnection(): Promise<boolean> {
    try {
      if (!prisma) return false;
      
      // Attempt a simple query to test the connection
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Get database information (for diagnostics)
   * @returns Database information if available
   */
  static async getDatabaseInfo(): Promise<DbResult<any>> {
    return this.executeOperation(async () => {
      if (!prisma) throw new Error("Prisma client is not initialized");
      
      // Get database information using raw SQL
      const info = await prisma.$queryRaw`
        SELECT 
          current_database() as database,
          current_schema() as schema,
          version() as version
      `;
      
      return info;
    });
  }
}
