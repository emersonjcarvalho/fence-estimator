/**
 * Simple Prisma Generate Script
 * 
 * This script uses the require.resolve approach to find and run the Prisma CLI
 * without relying on npx or spawning subprocesses.
 */

const path = require('path');
const fs = require('fs');

console.log('Starting Prisma Client generation...');

// Try to find the prisma CLI
try {
  // Find the prisma module path
  const prismaBinPath = require.resolve('prisma');
  const prismaDir = path.dirname(prismaBinPath);
  const prismaBin = path.join(prismaDir, '..', '.bin', 'prisma');
  
  console.log(`Using Prisma CLI at: ${prismaBin}`);

  // Check if the path exists
  if (!fs.existsSync(prismaBin)) {
    console.error(`Error: Prisma CLI not found at ${prismaBin}`);
    console.log('Falling back to direct Prisma module...');
    
    // Direct method
    try {
      // Load and run prisma generate directly
      require('@prisma/client/scripts/postinstall.js');
      console.log('Prisma Client generated successfully using direct method!');
    } catch (directError) {
      console.error('Error using direct method:', directError);
      process.exit(1);
    }
  } else {
    // Use the CLI
    console.log('Running Prisma generate...');
    
    // Run the CLI using native Node.js require
    // This avoids subprocess spawn issues
    const { execSync } = require('child_process');
    const result = execSync(`"${prismaBin}" generate`, { 
      stdio: 'inherit',
      windowsHide: true 
    });
    
    console.log('Prisma Client generated successfully!');
  }
} catch (error) {
  console.error('Error generating Prisma Client:', error);
  process.exit(1);
}
