/**
 * Vercel Post-Build Script for Prisma
 * 
 * This script is designed to run after the build completes on Vercel.
 * It verifies that the Prisma client was properly generated and is available.
 */

const fs = require('fs');
const path = require('path');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// Only run in Vercel environments
if (isVercel) {
  console.log('Running Vercel post-build checks for Prisma...');
  
  // Check if the Prisma client exists
  try {
    // Try to require the Prisma client
    const { PrismaClient } = require('@prisma/client');
    console.log('✅ Prisma Client is available');
    
    // Check that the client was generated properly
    const prismaClientDir = path.dirname(require.resolve('@prisma/client'));
    const runtimeDir = path.join(prismaClientDir, 'runtime');
    
    if (fs.existsSync(runtimeDir)) {
      console.log('✅ Prisma Client runtime files exist');
    } else {
      console.warn('⚠️ Warning: Prisma Client runtime directory not found');
    }
    
    // Success!
    console.log('✅ Vercel post-build checks completed successfully');
  } catch (error) {
    console.error('❌ Error during Vercel post-build checks:', error.message);
    
    // Don't exit with error to allow deployment to continue
    // This is just a diagnostic check
    console.warn('⚠️ Prisma Client might not be properly generated');
  }
} else {
  console.log('Not running in Vercel environment, skipping post-build checks');
}
